/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
require("dotenv").config();
const functions = require("firebase-functions");

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const { mongoose } = require('./db');

const authController = require('./controllers/auth');
const applicationController = require('./controllers/applications');
const userController = require('./controllers/user');
const referrerController = require('./controllers/referrer');
const mailController = require('./controllers/mail');

app.use(express.json({ limit: '5MB' }));
app.use(cors({origin: '*'}));

app.use('/auth', authController);
app.use('/applications', applicationController);
app.use('/users', userController);
app.use('/referrer', referrerController);
app.use('/mail', mailController.router);



exports.api = functions.https.onRequest(app);
