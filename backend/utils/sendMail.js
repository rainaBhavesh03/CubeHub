const nodeMailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (email, title, body) => {
    try {
        console.log(email, title, body);
        const transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {user: process.env.MAIL_USER, pass: process.env.MAIL_PASS}
        })

        let info = await transporter.sendMail({
            from: 'CubeHub',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log(info);
        return info;
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = sendMail;
