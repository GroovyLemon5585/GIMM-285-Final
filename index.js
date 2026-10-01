//Libraries
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

//Setup defaults for script
const app = express();
app.use(express.static('public'))
app.use(express.json());

const upload = multer()
const port = process.env.PORT || 8080 //Render injects PORT; use 8080 otherwise

let databaseSeeded = false;

async function tableExists(tableName) {
    const [rows] = await connection.query('SHOW TABLES LIKE ?', [tableName]);
    return rows.length > 0;
}

// Strips comments/directives from a phpMyAdmin dump and splits it into runnable statements
function parseSqlStatements(sql) {
    return sql
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0 && !/^\/\*/.test(statement) && !/^(START TRANSACTION|SET|COMMIT)\b/i.test(statement));
}

async function seedTableFromSqlFile(tableName, fileName) {
    if (await tableExists(tableName)) {
        return;
    }
    const sql = fs.readFileSync(path.join(__dirname, 'sql', fileName), 'utf8');
    for (const statement of parseSqlStatements(sql)) {
        await connection.query(statement);
    }
}

// Auto-creates and populates the car tables from the bundled SQL dumps on a fresh database
async function ensureDatabaseSeeded() {
    if (databaseSeeded) {
        return;
    }
    await seedTableFromSqlFile('car_attributes', 'car_attributes.sql');
    await seedTableFromSqlFile('car_selection', 'car_selection.sql');
    databaseSeeded = true;
}
let connection = null;
let foreignKeyChecked = false;

async function ensureCarSelectionForeignKey() {
    const [hasColumnRows] = await connection.execute("SHOW COLUMNS FROM car_selection LIKE 'car_attributes_id'");
    if (hasColumnRows.length === 0) {
        await connection.execute('ALTER TABLE car_selection ADD COLUMN car_attributes_id INT NULL');
    }

    await connection.execute(`
        UPDATE car_selection s
        INNER JOIN car_attributes a ON s.model_id = a.model_name
        SET s.car_attributes_id = a.id
        WHERE s.car_attributes_id IS NULL
    `);

    const [hasIndexRows] = await connection.execute("SHOW INDEX FROM car_selection WHERE Key_name = 'idx_car_selection_car_attributes_id'");
    if (hasIndexRows.length === 0) {
        await connection.execute('ALTER TABLE car_selection ADD INDEX idx_car_selection_car_attributes_id (car_attributes_id)');
    }

    const [fkRows] = await connection.execute(`
        SELECT CONSTRAINT_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'car_selection'
          AND COLUMN_NAME = 'car_attributes_id'
          AND REFERENCED_TABLE_NAME = 'car_attributes'
    `);

    if (fkRows.length === 0) {
        await connection.execute(`
            ALTER TABLE car_selection
            ADD CONSTRAINT fk_car_selection_car_attributes_id
            FOREIGN KEY (car_attributes_id) REFERENCES car_attributes(id)
            ON UPDATE CASCADE ON DELETE SET NULL
        `);
    }
}

async function ensureConnection() {
    if (null === connection) {
        console.log('Here');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
            user: process.env.DB_USER || "HUNTERANDERSON753",
            password: process.env.DB_PASSWORD || "o1o33pQI5sIUOu6BaFVRTID42AEXBD1ohg2",
            database: process.env.DB_NAME || 'HUNTERANDERSON753'
        });
    }

    if (!foreignKeyChecked) {
        await ensureDatabaseSeeded();
        await ensureCarSelectionForeignKey();
        foreignKeyChecked = true;
    }
}

async function query(sql, params) {
    await ensureConnection();
    const [results] = await connection.execute(sql, params);
    return results;
}

class CarModel {
    static selectCarsBaseSql() {
        return `SELECT
            a.car_brand,
            a.model_name,
            a.horsepower,
            a.lowest_gas_mileage,
            a.highest_gas_mileage,
            s.model_id,
            s.car_attributes_id,
            s.year_released,
            s.lowest_price,
            s.highest_price
        FROM car_attributes a
        INNER JOIN car_selection s ON a.id = s.car_attributes_id`;
    }

    static selectCarByIdSql() {
        return `SELECT
            a.car_brand,
            a.model_name,
            a.horsepower,
            a.lowest_gas_mileage,
            a.highest_gas_mileage,
            s.model_id,
            s.car_attributes_id,
            s.year_released,
            s.lowest_price,
            s.highest_price
        FROM car_attributes a
        INNER JOIN car_selection s ON a.id = s.car_attributes_id
        WHERE s.car_attributes_id = ?`;
    }

    static insertCarAttributesSql() {
        return `INSERT INTO car_attributes (car_brand, model_name, horsepower, lowest_gas_mileage, highest_gas_mileage)
        VALUES (?, ?, ?, ?, ?)`;
    }

    static insertCarSelectionSql() {
        return 'INSERT INTO car_selection (model_id, year_released, lowest_price, highest_price, car_attributes_id) VALUES (?, ?, ?, ?, ?)';
    }

    static updateCarAttributesByIdSql() {
        return `UPDATE car_attributes
        SET car_brand = ?, horsepower = ?, lowest_gas_mileage = ?, highest_gas_mileage = ?
        WHERE id = ?`;
    }

    static updateCarSelectionSql() {
        return `UPDATE car_selection
        SET year_released = ?, lowest_price = ?, highest_price = ?
        WHERE car_attributes_id = ?`;
    }
}

function returnValidationErrors(response, errors, message = 'Validation failed.') {
    return response.status(400).json({ message, errors });
}

const listCarsHandler = async (request, response) => {
        let result = {};
        try {
            const allowedHorsepower = ['100-200', '200-300', '300-400', '400-500', '500-600', '600-700', '700-800', '800-900', '900-1000', '1000-2000'];
            const allowedLowestGasMileage = ['0', '10', '20', '30', '40'];
            const allowedHighestGasMileage = ['0', '20', '30', '40', '50'];
            const allowedYears = ['2020-2026', '2010-2020', '2000-2010', '1990-2000', '1980-1990', '1970-1980', '1960-1970', '1950-1960', '1940-1950'];
            const allowedPrices = ['1000-10000', '10000-50000', '50000-100000', '150000-200000', '200000-250000', '250000-300000', '300000-350000', '350000-400000', '400000-450000', '450000-500000', '500000-1000000', '1000000-1500000', '1500000-2000000', '2000000-2500000', '2500000-3000000'];
            const allowedLimits = ['10', '25', '50', '100'];
            const allowedSortBy = {
                model_name: 'a.model_name',
                year_released: 's.year_released',
                horsepower: 'a.horsepower',
                lowest_price: 's.lowest_price'
            };
            const allowedSortDirection = ['asc', 'desc'];

            if (typeof request.query.horsepower !== 'undefined' && request.query.horsepower !== '') {
                if (!allowedHorsepower.includes(request.query.horsepower)) {
                    return response.status(400).json({ message: 'Invalid horsepower value.' });
                }
            }
            if (typeof request.query.lowest_gas_mileage !== 'undefined' && request.query.lowest_gas_mileage !== '') {
                if (!allowedLowestGasMileage.includes(request.query.lowest_gas_mileage)) {
                    return response.status(400).json({ message: 'Invalid lowest_gas_mileage value.' });
                }
            }
            if (typeof request.query.highest_gas_mileage !== 'undefined' && request.query.highest_gas_mileage !== '') {
                if (!allowedHighestGasMileage.includes(request.query.highest_gas_mileage)) {
                    return response.status(400).json({ message: 'Invalid highest_gas_mileage value.' });
                }
            }
            if (typeof request.query.year_released !== 'undefined' && request.query.year_released !== '') {
                if (!allowedYears.includes(request.query.year_released)) {
                    return response.status(400).json({ message: 'Invalid year_released value.' });
                }
            }
            if (typeof request.query.price !== 'undefined' && request.query.price !== '') {
                if (!allowedPrices.includes(request.query.price)) {
                    return response.status(400).json({ message: 'Invalid price value.' });
                }
            }
            if (typeof request.query.limit !== 'undefined' && request.query.limit !== '') {
                if (!allowedLimits.includes(request.query.limit)) {
                    return response.status(400).json({ message: 'Invalid limit value.' });
                }
            }
            if (typeof request.query.sort_by !== 'undefined' && request.query.sort_by !== '') {
                if (typeof allowedSortBy[request.query.sort_by] === 'undefined') {
                    return response.status(400).json({ message: 'Invalid sort_by value.' });
                }
            }
            if (typeof request.query.sort_direction !== 'undefined' && request.query.sort_direction !== '') {
                if (!allowedSortDirection.includes(String(request.query.sort_direction).toLowerCase())) {
                    return response.status(400).json({ message: 'Invalid sort_direction value.' });
                }
            }

            let selectSql = CarModel.selectCarsBaseSql(),
                whereStatements = [],
                orderByStatements = [],
                queryParameters = [];



            if (typeof request.query.car_brand !== 'undefined' && request.query.car_brand !== '') {
                const brands = request.query.car_brand.split(',');
                whereStatements.push('a.car_brand IN (' + brands.map(() => '?').join(',') + ')');
                brands.forEach(b => queryParameters.push(b.trim()));
            }

            if (typeof request.query.model_name !== 'undefined' && request.query.model_name !== '') {
                whereStatements.push('a.model_name = ?');
                queryParameters.push(request.query.model_name);
            }


            if (typeof request.query.horsepower !== 'undefined' && request.query.horsepower !== '') {
                let horsepowerHalf = request.query.horsepower.indexOf('-');
                const minHorsepower = Number(request.query.horsepower.substring(0, horsepowerHalf));
                const maxHorsepower = Number(request.query.horsepower.substring(horsepowerHalf + 1));
                whereStatements.push('a.horsepower BETWEEN ? AND ?');
                queryParameters.push(minHorsepower, maxHorsepower);
            }

            if (typeof request.query.lowest_gas_mileage !== 'undefined' && request.query.lowest_gas_mileage !== '') {
                whereStatements.push('a.lowest_gas_mileage >= ?');
                queryParameters.push(Number(request.query.lowest_gas_mileage));
            }

            if (typeof request.query.highest_gas_mileage !== 'undefined' && request.query.highest_gas_mileage !== '') {
                whereStatements.push('a.highest_gas_mileage <= ?');
                queryParameters.push(Number(request.query.highest_gas_mileage));
            }

            if (
                typeof request.query.lowest_gas_mileage !== 'undefined' && request.query.lowest_gas_mileage !== '' &&
                typeof request.query.highest_gas_mileage !== 'undefined' && request.query.highest_gas_mileage !== '' &&
                Number(request.query.lowest_gas_mileage) > Number(request.query.highest_gas_mileage)
            ) {
                return response.status(400).json({ message: 'lowest_gas_mileage cannot be greater than highest_gas_mileage.' });
            }
            if (typeof request.query.model_id !== 'undefined' && request.query.model_id !== '') {
                whereStatements.push('s.car_attributes_id = ?');
                queryParameters.push(Number(request.query.model_id));
            }
            if (typeof request.query.year_released !== 'undefined' && request.query.year_released !== '') {
                let yearHalf = request.query.year_released.indexOf('-');
                const minYear = Number(request.query.year_released.substring(0, yearHalf));
                const maxYear = Number(request.query.year_released.substring(yearHalf + 1));
                whereStatements.push('s.year_released BETWEEN ? AND ?');
                queryParameters.push(minYear, maxYear);
            }
            if (typeof request.query.price !== 'undefined' && request.query.price !== '') {
                let priceHalf = request.query.price.indexOf('-');
                const minPrice = Number(request.query.price.substring(0, priceHalf));
                const maxPrice = Number(request.query.price.substring(priceHalf + 1));
                whereStatements.push('s.lowest_price >= ? AND s.highest_price <= ?');
                queryParameters.push(minPrice, maxPrice);
            }

            if (typeof request.query.sort_by !== 'undefined' && request.query.sort_by !== '') {
                const sortColumn = allowedSortBy[request.query.sort_by];
                const sortDirection = (typeof request.query.sort_direction !== 'undefined' && request.query.sort_direction !== '')
                    ? String(request.query.sort_direction).toUpperCase()
                    : 'ASC';
                orderByStatements.push(sortColumn + ' ' + sortDirection);
            }


            //Dynamically add WHERE expressions to SELECT statements if needed
            if (whereStatements.length > 0) {
                selectSql = selectSql + ' WHERE ' + whereStatements.join(' AND ');
            }

            //Dynamically add ORDER BY expressions to SELECT statements if needed
            if (orderByStatements.length > 0) {
                selectSql = selectSql + ' ORDER BY ' + orderByStatements.join(', ');
            }

            //Dynamically add LIMIT expressions to SELECT statements if needed
            if (typeof request.query.limit !== 'undefined' && request.query.limit > 0) {
                selectSql = selectSql + ' LIMIT ' + parseInt(request.query.limit);
            }

            result = await query(selectSql, queryParameters);
        } catch (error) {
            console.log(error);
            return response.status(500) //Error code 
                .json({ message: 'Something went wrong with the server.' });
        }
        //Default response object
        response.json({ 'data': result });
    };

// Noun route for listing/searching cars
app.get('/cars', upload.none(), listCarsHandler);

// Legacy route kept to avoid breaking existing pages
app.get('/car_attributes/', upload.none(), listCarsHandler);

// Second GET action using request.params.id and a dedicated SELECT query
app.get('/cars/:id', upload.none(), async (request, response) => {
    try {
        const modelId = Number(request.params.id);
        if (!Number.isInteger(modelId) || modelId <= 0) {
            return returnValidationErrors(response, { id: 'ID must be a positive integer.' });
        }

        const result = await query(
            CarModel.selectCarByIdSql(),
            [modelId]
        );

        return response.json({ data: result });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Something went wrong with the server.' });
    }
});

const createCarHandler = async (request, response) => {
    try {
        const MAX_HORSEPOWER = 2000;
        const MAX_GAS_MILEAGE = 100;
        const MAX_YEAR_RELEASED = 2026;
        const MAX_PRICE = 2500000;
        const TEXT_PATTERN = /^[A-Za-z0-9\s'\-]+$/;
        const errors = {};

        const {
            car_brand,
            model_name,
            horsepower,
            gas_mileage,
            lowest_gas_mileage,
            highest_gas_mileage,
            year_released,
            lowest_price,
            highest_price,
            price
        } = request.body;

        const lowestGasMileageInput = (typeof lowest_gas_mileage !== 'undefined' && lowest_gas_mileage !== '')
            ? lowest_gas_mileage
            : gas_mileage;
        const highestGasMileageInput = (typeof highest_gas_mileage !== 'undefined' && highest_gas_mileage !== '')
            ? highest_gas_mileage
            : gas_mileage;
        const lowestPriceInput = (typeof lowest_price !== 'undefined' && lowest_price !== '')
            ? lowest_price
            : price;
        const highestPriceInput = (typeof highest_price !== 'undefined' && highest_price !== '')
            ? highest_price
            : price;

        if (!car_brand) {
            errors.car_brand = 'Car brand is required.';
        }
        if (!model_name) {
            errors.model_name = 'Model name is required.';
        }
        if (!horsepower) {
            errors.horsepower = 'Horsepower is required.';
        }
        if (!lowestGasMileageInput) {
            errors.lowest_gas_mileage = 'Lowest gas mileage is required.';
        }
        if (!highestGasMileageInput) {
            errors.highest_gas_mileage = 'Highest gas mileage is required.';
        }
        if (!year_released) {
            errors.year_released = 'Year released is required.';
        }
        if (!lowestPriceInput) {
            errors.lowest_price = 'Lowest price is required.';
        }
        if (!highestPriceInput) {
            errors.highest_price = 'Highest price is required.';
        }

        if (Object.keys(errors).length > 0) {
            return returnValidationErrors(response, errors, 'Please correct the highlighted fields.');
        }

        if (!TEXT_PATTERN.test(car_brand) || !TEXT_PATTERN.test(model_name)) {
            if (!TEXT_PATTERN.test(car_brand)) {
                errors.car_brand = 'Car brand must only use letters, numbers, spaces, apostrophes, and hyphens.';
            }
            if (!TEXT_PATTERN.test(model_name)) {
                errors.model_name = 'Model name must only use letters, numbers, spaces, apostrophes, and hyphens.';
            }
            return returnValidationErrors(response, errors, 'Please correct the highlighted fields.');
        }

        const hpValue = Number(horsepower);
        const lowestMpgValue = Number(lowestGasMileageInput);
        const highestMpgValue = Number(highestGasMileageInput);
        const yearValue = Number(year_released);
        const lowestPriceValue = Number(lowestPriceInput);
        const highestPriceValue = Number(highestPriceInput);

        if (
            Number.isNaN(hpValue) ||
            Number.isNaN(lowestMpgValue) ||
            Number.isNaN(highestMpgValue) ||
            Number.isNaN(yearValue) ||
            Number.isNaN(lowestPriceValue) ||
            Number.isNaN(highestPriceValue)
        ) {
            if (Number.isNaN(hpValue)) {
                errors.horsepower = 'Horsepower must be numeric.';
            }
            if (Number.isNaN(lowestMpgValue)) {
                errors.lowest_gas_mileage = 'Lowest gas mileage must be numeric.';
            }
            if (Number.isNaN(highestMpgValue)) {
                errors.highest_gas_mileage = 'Highest gas mileage must be numeric.';
            }
            if (Number.isNaN(yearValue)) {
                errors.year_released = 'Year released must be numeric.';
            }
            if (Number.isNaN(lowestPriceValue)) {
                errors.lowest_price = 'Lowest price must be numeric.';
            }
            if (Number.isNaN(highestPriceValue)) {
                errors.highest_price = 'Highest price must be numeric.';
            }
            return returnValidationErrors(response, errors, 'Please correct the highlighted fields.');
        }

        if (hpValue < 0 || hpValue > MAX_HORSEPOWER) {
            errors.horsepower = `Horsepower must be between 0 and ${MAX_HORSEPOWER}.`;
        }

        if (lowestMpgValue < 0 || lowestMpgValue > MAX_GAS_MILEAGE) {
            errors.lowest_gas_mileage = `Lowest gas mileage must be between 0 and ${MAX_GAS_MILEAGE}.`;
        }

        if (highestMpgValue < 0 || highestMpgValue > MAX_GAS_MILEAGE) {
            errors.highest_gas_mileage = `Highest gas mileage must be between 0 and ${MAX_GAS_MILEAGE}.`;
        }

        if (lowestMpgValue > highestMpgValue) {
            errors.lowest_gas_mileage = 'Lowest gas mileage cannot be greater than highest gas mileage.';
            errors.highest_gas_mileage = 'Highest gas mileage must be greater than or equal to lowest gas mileage.';
        }

        if (yearValue < 1886 || yearValue > MAX_YEAR_RELEASED) {
            errors.year_released = `Year released must be between 1886 and ${MAX_YEAR_RELEASED}.`;
        }

        if (lowestPriceValue < 0 || lowestPriceValue > MAX_PRICE) {
            errors.lowest_price = `Lowest price must be between 0 and ${MAX_PRICE}.`;
        }

        if (highestPriceValue < 0 || highestPriceValue > MAX_PRICE) {
            errors.highest_price = `Highest price must be between 0 and ${MAX_PRICE}.`;
        }

        if (lowestPriceValue > highestPriceValue) {
            errors.lowest_price = 'Lowest price cannot be greater than highest price.';
            errors.highest_price = 'Highest price must be greater than or equal to lowest price.';
        }

        if (Object.keys(errors).length > 0) {
            return returnValidationErrors(response, errors, 'Please correct the highlighted fields.');
        }

        await ensureConnection();
        await connection.beginTransaction();

        const carAttributesInsert = await query(
            CarModel.insertCarAttributesSql(),
            [car_brand, model_name, hpValue, lowestMpgValue, highestMpgValue]
        );

        await query(
            CarModel.insertCarSelectionSql(),
            [model_name, yearValue, lowestPriceValue, highestPriceValue, carAttributesInsert.insertId]
        );

        await connection.commit();

        return response.json({ message: 'Car info inserted successfully.' });
    } catch (error) {
        if (connection !== null) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.log(rollbackError);
            }
        }
        console.log(error);
        return response.status(500).json({ message: 'Something went wrong with the server.' });
    }
};

// Noun route for creating a car
app.post('/cars', upload.none(), createCarHandler);

// Legacy route kept to avoid breaking existing pages
app.post('/car_attributes/insert', upload.none(), createCarHandler);

const updateCarHandler = async (request, response) => {
    try {
        const MAX_HORSEPOWER = 3000;
        const MAX_GAS_MILEAGE = 100;
        const MAX_YEAR_RELEASED = 2026;
        const MAX_PRICE = 50000000;
        const TEXT_PATTERN = /^[A-Za-z0-9\s'\-]+$/;
        const errors = {};
        const targetCarId = Number(request.params.id);
        const {
            car_brand,
            horsepower,
            lowest_gas_mileage,
            highest_gas_mileage,
            year_released,
            lowest_price,
            highest_price
        } = request.body;

        if (!Number.isInteger(targetCarId) || targetCarId <= 0) {
            errors.id = 'ID must be a positive integer.';
        }
        if (!car_brand) {
            errors.car_brand = 'Car brand is required.';
        }
        if (!horsepower) {
            errors.horsepower = 'Horsepower is required.';
        }
        if (!lowest_gas_mileage) {
            errors.lowest_gas_mileage = 'Lowest gas mileage is required.';
        }
        if (!highest_gas_mileage) {
            errors.highest_gas_mileage = 'Highest gas mileage is required.';
        }
        if (!year_released) {
            errors.year_released = 'Year released is required.';
        }
        if (!lowest_price) {
            errors.lowest_price = 'Lowest price is required.';
        }
        if (!highest_price) {
            errors.highest_price = 'Highest price is required.';
        }

        if (Object.keys(errors).length > 0) {
            return returnValidationErrors(response, errors, 'Please correct the highlighted fields.');
        }

        if (!TEXT_PATTERN.test(car_brand.trim())) {
            errors.car_brand = 'Car brand must only use letters, numbers, hyphens, spaces, and apostrophes.';
            return returnValidationErrors(response, errors, 'Please correct the highlighted fields.');
        }

        const hpValue = Number(horsepower);
        const lowestMpgValue = Number(lowest_gas_mileage);
        const highestMpgValue = Number(highest_gas_mileage);
        const yearValue = Number(year_released);
        const lowestPriceValue = Number(lowest_price);
        const highestPriceValue = Number(highest_price);

        if (
            Number.isNaN(hpValue) ||
            Number.isNaN(lowestMpgValue) ||
            Number.isNaN(highestMpgValue) ||
            Number.isNaN(yearValue) ||
            Number.isNaN(lowestPriceValue) ||
            Number.isNaN(highestPriceValue)
        ) {
            if (Number.isNaN(hpValue)) {
                errors.horsepower = 'Horsepower must be numeric.';
            }
            if (Number.isNaN(lowestMpgValue)) {
                errors.lowest_gas_mileage = 'Lowest gas mileage must be numeric.';
            }
            if (Number.isNaN(highestMpgValue)) {
                errors.highest_gas_mileage = 'Highest gas mileage must be numeric.';
            }
            if (Number.isNaN(yearValue)) {
                errors.year_released = 'Year released must be numeric.';
            }
            if (Number.isNaN(lowestPriceValue)) {
                errors.lowest_price = 'Lowest price must be numeric.';
            }
            if (Number.isNaN(highestPriceValue)) {
                errors.highest_price = 'Highest price must be numeric.';
            }
            return returnValidationErrors(response, errors, 'Please correct the highlighted fields.');
        }

        if (hpValue < 0 || hpValue > MAX_HORSEPOWER) {
            errors.horsepower = `Horsepower must be between 0 and ${MAX_HORSEPOWER}.`;
        }

        if (lowestMpgValue < 0 || lowestMpgValue > MAX_GAS_MILEAGE) {
            errors.lowest_gas_mileage = `Lowest gas mileage must be between 0 and ${MAX_GAS_MILEAGE}.`;
        }

        if (highestMpgValue < 0 || highestMpgValue > MAX_GAS_MILEAGE) {
            errors.highest_gas_mileage = `Highest gas mileage must be between 0 and ${MAX_GAS_MILEAGE}.`;
        }

        if (lowestMpgValue > highestMpgValue) {
            errors.lowest_gas_mileage = 'Lowest gas mileage cannot be greater than highest gas mileage.';
            errors.highest_gas_mileage = 'Highest gas mileage must be greater than or equal to lowest gas mileage.';
        }

        if (yearValue < 1886 || yearValue > MAX_YEAR_RELEASED) {
            errors.year_released = `Year released must be between 1886 and ${MAX_YEAR_RELEASED}.`;
        }

        if (lowestPriceValue < 0 || lowestPriceValue > MAX_PRICE) {
            errors.lowest_price = `Lowest price must be between 0 and ${MAX_PRICE}.`;
        }

        if (highestPriceValue < 0 || highestPriceValue > MAX_PRICE) {
            errors.highest_price = `Highest price must be between 0 and ${MAX_PRICE}.`;
        }

        if (lowestPriceValue > highestPriceValue) {
            errors.lowest_price = 'Lowest price cannot be greater than highest price.';
            errors.highest_price = 'Highest price must be greater than or equal to lowest price.';
        }

        if (Object.keys(errors).length > 0) {
            return returnValidationErrors(response, errors, 'Please correct the highlighted fields.');
        }

        await ensureConnection();
        await connection.beginTransaction();

        const carAttributesUpdate = await query(
            CarModel.updateCarAttributesByIdSql(),
            [car_brand, hpValue, lowestMpgValue, highestMpgValue, targetCarId]
        );

        const carSelectionUpdate = await query(
            CarModel.updateCarSelectionSql(),
            [yearValue, lowestPriceValue, highestPriceValue, targetCarId]
        );

        if (carAttributesUpdate.affectedRows === 0 || carSelectionUpdate.affectedRows === 0) {
            await connection.rollback();
            return response.status(404).json({ message: 'Model not found for update.' });
        }

        await connection.commit();

        return response.json({ message: 'Car info updated successfully.' });
    } catch (error) {
        if (connection !== null) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.log(rollbackError);
            }
        }
        console.log(error);
        return response.status(500).json({ message: 'Something went wrong with the server.' });
    }
};

// Noun route for updating a car by id
app.put('/cars/:id', updateCarHandler);

// Legacy route kept to avoid breaking existing pages
app.put('/car_attributes/update/:id', updateCarHandler);

app.listen(port, '0.0.0.0', () => {
    console.log(`Application listening on 0.0.0.0:${port}`);
})