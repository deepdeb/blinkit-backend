
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')

const generateRefreshToken = async (userId) => {
    const token = await jwt.sign({ id: userId },
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn: '7d' }
    )

    const updateRefreshTokenUser = await prisma.users.update({
        where: {
            user_id: userId
        },
        data: {
            refresh_token: token
        }
    })

    return token
}

module.exports = {generateRefreshToken}