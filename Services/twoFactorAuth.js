const crypto = require("crypto");
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function getGlobalIpAddress() {
    try {
        const response = await axios.get('https://api.ipify.org/?format=json');
        return response.data.ip;
    } catch (error) {
        return null;
    }
}

async function sendEmail(email,password) {
    let token;
    let ipAddress = await getGlobalIpAddress();
    const transporter = nodemailer.createTransport(sendGridTransport({
        service: 'gmail',
        auth: {
            api_key: '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'
        }
    }));

    const code = crypto.randomBytes(3).toString('hex').toUpperCase();
    token = jwt.sign({email,password, code}, 'authzzzz', {expiresIn: '600s'});
    const mailOptions = {
        from: 'dcdgraduationproject@gmail.com',
        to: email,
        subject: 'Website Sign In Alert',
        html:
           `<div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
                <h2 style="text-align: center;">Forensics fingerprint elicitation system</h2>
                <p style="letter-spacing: 3px;">Did You Log in Now?</p>
                <p>Ip Address: <strong>${ipAddress}</strong></p>
                <p>If this is you, you can use this code for verification: <strong>${code}</strong></p>
                <p>If this is not you, you can neglect the message and be sure that no one will enter your account.</p>
                <p><strong>Alert: This code will expire in 1 min.</strong></p>
                <p style="opacity: 0.9;">Best regards,</p>
                <p style="opacity: 0.9;">Your Website Team</p>
           </div>`
    };

    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log('Error: Unable to send notification email.');
        } else {
            console.log('Notification email sent successfully!');
        }
    });
    return token;
}

module.exports = {
    sendEmail
}