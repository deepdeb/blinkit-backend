const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.truncateTable = async (req, res) => {
    const {table} = req.query
    // console.log(req.query)
    try {
        await prisma[table].deleteMany({});
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
        // await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${table}`);
        return res.status(200).json({ message: 'Table truncated successfully' });
    } catch (error) {
        console.error('Error truncating table:', error.message);
        return res.status(500).json({ error: 'Failed to truncate table' });
    }
} 