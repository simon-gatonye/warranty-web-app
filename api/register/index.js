const sql = require('mssql');

module.exports = async function (context, req) {
    const { serialNumber, farmerName, farmerPhone, county, purchaseDate } = req.body || {};

    if (!serialNumber || !farmerName || !farmerPhone) {
        context.res = {
            status: 400,
            body: { message: "Please fill in all required fields." }
        };
        return;
    }

    try {
        await sql.connect(process.env.SqlConnectionString);

        await sql.query`
            INSERT INTO Fact_WarrantyRegistration (SerialNumber, FarmerName, Phone, County, PurchaseDate, RegistrationDate)
            VALUES (${serialNumber}, ${farmerName}, ${farmerPhone}, ${county}, ${purchaseDate}, GETDATE())
        `;

        context.res = {
            status: 200,
            body: { message: "Warranty registered successfully!" }
        };
    } catch (err) {
        context.log('Database error:', err);
        context.res = {
            status: 500,
            body: { message: "Database connection failed. " + err.message }
        };
    } finally {
        await sql.close();
    }
};
