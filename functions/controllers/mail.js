const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

async function sendMail(req, res) {
    const { type } = req.query;
    let body = req.body;
    let output = '';
    let subject = '';
    let to = 'applications@theabelatrust.co.za';
    console.log(body)
    switch (type) {
        case 'email':
            subject = "Contact Form From Website";
            output = generateEmailLayout(body);
            break;
        case 'application':
            subject = `New Application From - ${body.personalDetails.name}`;
            output = generateApplicationLayout(body);
            break;
        case 'statusUpdate':
            subject = `Abela Trust - Application Status`;
            output = generateStatusUpdateEmailLayout(body);
            to = body?.addressDetails?.email;
            break;
        case 'adminDocsUploaded':
            subject = `Abela Trust - Application Documents`;
            output = adminDocsUploadedMail(body);
            break;
        case 'forgotPassword':
            subject = `Abela Trust - Forgot Password`;
            output = forgotPassword(body);
            to = body?.email
            break;
        default:
            break;
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "mail.theabelatrust.co.za",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "applications@theabelatrust.co.za", // generated ethereal user
            pass: "Funding2023", // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `applications@theabelatrust.co.za`, // sender address
        to, // list of receivers
        subject, // Subject line
        html: `<div style="padding: 1em">${output}</div>` // html body
    });

    if (info.messageId) {
        logger(info.messageId);
    } else {
        const msg = "Email not sent, try again later.";
        if (type == 'email') res.status(500).send({ msg });
        logger(msg);
    }
}


const generateEmailLayout = (body) => {
    return `
    <h3 style='margin: 0 !important; padding: 5px 0;'>New application received from the website</h3>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Message:</h3>
        <p>${body.message}</a></p>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Contact Details</h3>
    <ul>
        <li style='list-style: none;'> <b>Requestor</b>: ${body.name}  ${body?.surname}</li>
        <li style='list-style: none;'> <b>Email</b>:  ${body.email}</li>
        <li style='list-style: none;'> <b>Phone</b>:  ${body.cellOne}</li>
    </ul>
    </br>
    Warm Regards<br>
    This email was sent from the Abela Trust Website through WEBGOORU PTY LTD's Email Server
    `;
}

const generateStatusUpdateEmailLayout = (body) => {
    const reqId = body['_id'];
    return `
    <h3 style='margin: 0 !important; padding: 5px 0;'>Your application status update.</h3>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Message:</h3>
        <p>Hi, your application status has been updated to: <span style="font-weight: bold">${body?.status?.current}</span> </p>
        <p>Comments: <span style="font-weight: bold">${body?.status?.comment || "N/A"}</span> </p>
        <p style='${body?.status?.current === "Approved" ? "display: block;" : "display: none;"}'>Please login, open your application and click on the "Upload Docs" button and upload the required documents:  </p>
        <ul style='${body?.status?.current === "Approved" ? "display: block;" : "display: none;"}'>
            <li>Your ID / Birth Certificate Copy</li>
            <li>Parent / Guardian ID Copy (For applicants under 18 years)</li>
            <li>Statement of Fees / Invoice</li>
        </ul>
        <h3 >Login and check the application on the Beneficiary Panel. Link: <a style='color: #e01a72; font-weight: bold;' href="https://apply.theabelatrust.co.za/beneficiary/applications/view/${reqId}"><span style='color: #e01a72'>here</span></a></h3>
    </br>
    Warm Regards<br>
    This email was sent from the Abela Trust Website through WEBGOORU PTY LTD's Email Server
    `;
}

const generateApplicationLayout = (body) => {
    const reqId = body['_id'];
    return `
    <h3 style='margin: 0 !important; padding: 5px 0;'>New application received from the website</h3>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Requesting For: ${body.personalDetails.requestingFor}</h3>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Requestor Details</h3>
    <ul>
        <li style='list-style: none;'> <b>Requestor</b>: ${body.personalDetails.name}</li>
        <li style='list-style: none;'> <b>Email</b>:  ${body.addressDetails.email}</li>
        <li style='list-style: none;'> <b>Phone</b>:  ${body.addressDetails.cellOne}</li>
    </ul>
    <h3 >Login and check the request on the Admin Panel. Link: <a style='color: #e01a72; font-weight: bold;' href="https://apply.theabelatrust.co.za/admin/applications/view/${reqId}"><span style='color: #e01a72'>here</span></a></h3>
    </br>
    Warm Regards<br>
    This email was sent from the Abela Trust Website through WEBGOORU PTY LTD's Email Server
    `;
}

const adminDocsUploadedMail = (body) => {
    const reqId = body['_id'];
    return `
    <h3 style='margin: 0 !important; padding: 5px 0;'>Application documents received from the website</h3>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Requestor Details</h3>
    <ul>
        <li style='list-style: none;'> <b>Requestor</b>: ${body.personalDetails.name}</li>
        <li style='list-style: none;'> <b>Email</b>:  ${body.addressDetails.email}</li>
        <li style='list-style: none;'> <b>Phone</b>:  ${body.addressDetails.cellOne}</li>
    </ul>
    <h3 >Login and check the request on the Admin Panel. Link: <a style='color: #e01a72; font-weight: bold;' href="https://apply.theabelatrust.co.za/admin/applications/view/${reqId}"><span style='color: #e01a72'>here</span></a></h3>
    </br>
    Warm Regards<br>
    This email was sent from the Abela Trust Website through WEBGOORU PTY LTD's Email Server
    `;
}

const forgotPassword = (body) => {
    return `
    <h3 style='margin: 0 !important; padding: 5px 0;'>Request for forgotten password</h3>
    <h5 style='margin: 0 !important; padding: 5px 0;'>Use your registered email and password: <b>${body._password}</b> to login</h5>
    <h5 >Next step: Navigate to the "Profile" page to update your password. </h5>
    </br>
    Warm Regards<br>
    This email was sent from the Abela Trust Website through WEBGOORU PTY LTD's Email Server
    `;
}

const logger = (text) => {
    console.log(text);
}

router.post('/sendEmail', (req, res) => {
    sendMail(req, res);
});

module.exports = {
    logger,
    sendMail,
    router
}
