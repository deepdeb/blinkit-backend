const jwt = require('jsonwebtoken')

const generateAccessToken = (userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn: '15s' }
    )
    return token
}

module.exports = {generateAccessToken}
