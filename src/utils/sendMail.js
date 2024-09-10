// const path = require('path');
// const nodemailer = require('nodemailer')
// const { objectConfig } = require('../config')

// const transport = nodemailer.createTransport({
//     service: 'gmail',
//     port: 587,
//     auth: {
//         user: objectConfig.gmail_user,
//         pass: objectConfig.gmail_pass
//     }
// })

// const sendEmail = async ({email, subject, html}) => {
//     return await transport.sendMail({
//         from: 'Coder Test',
//         to: email,
//         subject,
//         html,
//         attachments: [{
//             filename: 'logo.png',
//             path: path.join(__dirname, 'logo.png'),
//             cid: 'logo'
//         }]
//     })
// }

// module.exports = sendEmail;