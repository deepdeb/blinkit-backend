const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { generateAccessToken } = require("../utils/generateAccessToken");
const { generateRefreshToken } = require("../utils/generateRefreshToken");
const { default: uploadImageCloudinary } = require("../utils/uploadImageCloudinary");
const generateOtp = require("../utils/generateOTP");
const { sendEmail } = require("../config/sendEmail");
const forgotPasswordTemplate = require("../utils/forgotPasswordTemplate");

exports.showUsers = async (req, res) => {
    try {
        const userList = await prisma.users.findMany({})
        return res.send(userList)
    } catch (error) {
        return res.status(500).send(`Error showing users: ${error.message}`)
    }
}

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existing_user = await prisma.users.findFirst({
            where: {
                email: email
            }
        })

        if (existing_user) {
            return res.status(200).json({ message: "Email already registered" })
        }

        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)

        const userCreate = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: hashPassword
            }
        })

        return res.status(201).json({ message: "User registered successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const { code } = req.body

        const user = await prisma.users.findFirst({
            where: {
                user_id: code
            }
        })

        if (!user) {
            return res.status(400)
        }

        const updateUser = await prisma.users.update({
            where: {
                user_id: code
            },
            data: {
                verify_email: true
            }
        })

        return res.status(200)
    } catch (error) {
        return res.status(500).send({ message: error })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(200).json({ message: "Email & Password are mandatory" })
        }

        const user = await prisma.users.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(200).json({ message: 'Invalid credentials' })
        }

        if (user.status !== "Active") {
            return res.status(200).json({ message: 'Account inactive' })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(200).json({ message: 'Invalid credentials' })
        }

        const accessToken = await generateAccessToken(user.user_id)
        const refreshToken = await generateRefreshToken(user.user_id)

        const updateUser = await prisma.users.update({
            where: {
                user_id: user.user_id
            },
            data: {
                last_login_date: new Date()
            }
        })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        res.cookie('accessToken', accessToken, cookiesOption)
        res.cookie('refreshToken', refreshToken, cookiesOption)

        return res.status(201).json({ message: "Login successful" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.logout = async (req, res) => {
    try {
        const user = req.user
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        res.clearCookie("accessToken", cookiesOption)
        res.clearCookie("refreshToken", cookiesOption)

        const removeRefreshToken = await prisma.users.update({

            where: {
                user_id: user.id
            },
            data: {
                refresh_token: ""
            }
        })
        return res.status(201).json({ message: "Logout successful" })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

exports.uploadAvatar = async (req, res) => {
    try {
        const userId = req.userId // coming from auth middleware
        const image = req.file // coming from multer middleware

        const upload = await uploadImageCloudinary(image)

        const updateUser = await prisma.users.update({
            where: {
                user_id: userId
            },
            data: {
                avatar: upload.url
            }
        })

        return res.status(200).json({ message: "Upload profile", data: { id: userId, avatar: upload.url, } })
    } catch (error) {
        return res.status(500).send({ message: error })
    }
}

exports.updateUserDetails = async (req, res) => {
    try {
        const userId = req.userId
        const { name, email, password, mobile } = req.body

        let hashPassword = ""

        if (password) {
            const salt = await bcrypt.genSalt()
            hashPassword = await bcrypt.hash(password, salt)
        }

        const updateUser = await prisma.users.update({
            where: {
                user_id: userId
            },
            data: {
                ...(name && { name: name }),
                ...(email && { email: email }),
                ...(mobile && { mobile: mobile }),
                ... (password && { password: hashPassword })
            }
        })

        return res.status(200).send({ message: 'Info updated' })

    } catch (error) {
        return res.status(500).send({ message: error })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await prisma.users.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(200).json({ message: 'User not found' })
        }

        const otp = generateOtp()

        const expireTime = new Date(Date.now() + 3600 * 1000); // 1 hour from now

        const update = await prisma.users.update({
            where: {
                user_id: user.user_id
            },
            data: {
                forgot_password_otp: otp.toString(),
                forgot_password_expiry: expireTime
            }
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot password from Blinkit",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return res.status(201).json({ message: "Check your Email" })
    } catch (error) {
        return res.status(500).send({ message: error })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(200).json({ message: 'Provide required fields' })
        }

        const user = await prisma.users.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(200).json({ message: 'User not found' })
        }

        const timenow = new Date().toISOString()

        if (user.forgot_password_expiry < timenow) {
            return res.status(200).json({ message: 'OTP Invalid or Expired' })
        }

        if (user.forgot_password_otp !== otp) {
            return res.status(200).json({ message: 'OTP Invalid or Expired' })
        }

        const updateUser = await prisma.users.update({
            where: {
                user_id: user.user_id
            },
            data: {
                forgot_password_otp: null,
                forgot_password_expiry: null
            }
        })

        return res.status(201).json({ message: 'OTP verified' })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body

        if (!email || !newPassword || !confirmPassword) {
            return res.status(200).json({ message: 'Provide required fields: Email, New Password, Confirm Password' })
        }

        const user = await prisma.users.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(200).json({ message: 'User not found' })
        }

        if (newPassword !== confirmPassword) {
            return res.status(200).json({ message: 'Passwords do not match' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)

        const updatePassword = await prisma.users.update({
            where: {
                user_id: user.user_id
            },
            data: {
                password: hashPassword
            }
        })

        return res.status(201).json({ message: 'Password reset successful' })

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

exports.refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]

        if (!refreshToken) {
            return res.status(200).json({ message: "Unauthorized access" })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if (!verifyToken) {
            return res.status(200).json({ message: 'Token expired' })
        }

        const userId = verifyToken.id

        const newAccessToken = await generateAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('accessToken', newAccessToken, cookiesOption)

        return res.status(201).json({ message: 'New access token generated', data: newAccessToken })

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

exports.userDetails = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await prisma.users.findFirst({
            where: {
                user_id: userId
            },
            include: {
                addresses: true,
                order_history: true,
                shopping_cart: true
            },
            omit: {
                password: true,
                refresh_token: true
            }
        })
        
        return res.status(201).json({ user: user })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}