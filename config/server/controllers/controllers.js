require('dotenv').config();
const User = require("../models/User");
const jwtUtils = require("../Utils/jwtUtils");
const passwordUtils = require("../Utils/passwordUtils");
// const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs');
exports.postUser = async (req, res) => {
    try {
        const existingUserbyEmail = await User.findOne({ email: req.body.email });
        const existingUserbyPhone = await User.findOne({ Phone: req.body.Phone });
        if (existingUserbyEmail || existingUserbyPhone) {
            res.status(409).jsonp({ data: false, message: "User already exists" });
        }
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            Phone: req.body.Phone,
            username: req.body.email,
            password: await passwordUtils.hashPassword(req.body.password),
        });

        await newUser.save();

        res.status(201).jsonp({ data: true, message: "New User has been added." });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .jsonp({ data: false, message: "An error occurred while adding a new User." });
    }
};



exports.me = async (req, res) => {
    try {
        const Users = await User.findById(req.user._id);
        res.status(200).jsonp({Users:Users});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: getErrorMessage(error) });
    }
};

exports.Singin = async (req, res) => {
    const newUser = await User.findOne({ email: req.body.email });

    if (newUser) {
        const token = jwtUtils.generateToken(newUser.toObject());
        const response = {
            token: token,
            expiresIn: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        };
        return res.status(200).send(response);
    } else {
        res
            .status(400)
            .jsonp({ data: false, message: "You are enter wrong email or password !" });
    }
};

exports.forgot = async (req, res) => {
    try {
        const htmlContent = fs.readFileSync('C:\\React Js\\app-nodejs\\server\\password-reset\\content.html', 'utf8');
        const email = String(req.body.email).toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            res.jsonp({ data: false, message: 'No account with that username or email has been found' });
        }

        let generateOtp = Math.floor(100000 + Math.random() * 9000);
        let otp = generateOtp;
        user.resetOTP = otp;
        user.resetOTPExpires = Date.now() + 3000000;

        const emailContent = htmlContent
            .replace('{{USER_NAME}}', user.firstName + " " + user.lastName)
            .replace('{{OTP_VALUE}}', otp);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "ajayupatil101@gmail.com",
                pass: process.env.password,
            },
        });

        // Define the email options
        const mailOptions = {
            from: "ajayupatil101@gmail.com",
            to: req.body.email,
            cc: process.env.CC_EMAIL,
            subject: 'Password Reset',
            text: `Hello ${user.name}, your OTP for password reset is: ${otp}`,
            html: emailContent,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        await user.save();
        res.jsonp({
            data: true,
            message: 'An email has been sent to the provided email with further instructions.'
        });
    } catch (e) {
        res.jsonp({ data: false, message: e.message });
    }
};



exports.validateResetOtp = async (req, res) => {
    try {
        const { email, resetOTP } = req.params;
        const user = await User.findOne({
            resetOTP,
            email,
            resetOTPExpires: { $gt: Date.now() },
        });
        if (!user) {
            // throw new errors.InvalidData('Invalid Otp');
            res.json({
                data: false,
                message: 'Invalid Otp'
            });
        }
        res.json({
            data: true,
            message: 'Reset Otp validated successfully.'
        });
    } catch (e) {
        res.jsonp({ data: false, message: e.message });
    }
};


exports.reset = async (req, res) => {
    try {
        const { resetOTP, newPassword, reEnterPassword } = req.body;
        var user = await User.findOne({
            resetOTP,
            resetOTPExpires: {
                $gt: Date.now(),
            },
        });
        if (!user) {
            res.json({
                data: false,
                message: 'Password reset OTP is invalid or has expired.'
            });
        }
        if (newPassword === reEnterPassword) {
            user.password = newPassword;
            await user.save();
            res.json({
                data: true,
                message: 'Password updated successfully'
            });
        } else {
            res.json({
                data: false,
                message: 'Passwords do not match'
            });
            // throw new errors.InvalidData();
        }
    } catch (e) {
        res.jsonp({ data: false, message: e.message });
    }
};
const getErrorMessage = (error) => {
    return error.message || 'Internal Server Error';
};