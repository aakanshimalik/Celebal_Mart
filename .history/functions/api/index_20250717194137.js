/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import nodemailer from "nodemailer";
const {setGlobalOptions} = require("firebase-functions");

const cors = require("cors");

const corsHandler = cors({
  origin: true,  // Allow all origins (you can restrict to your domain here)
});
// const functions = require("firebase-functions");
// const nodemailer = require("nodemailer");
// const cors = require("cors")({origin: true});
// const admin = require("firebase-admin");
// admin.initializeApp();


// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions( {maxInstances: 10} );
export default async function handler(req, res) {
  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins (change to your frontend URL if needed)
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  // Allow CORS for actual requests
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    try {
      const { to, subject, message, filename, base64pdf } = req.body;

      if (!to || !base64pdf) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Nodemailer setup (make sure to import and configure)
      const nodemailer = require('nodemailer');

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `Celebal-Mart <${process.env.GMAIL_EMAIL}>`,
        to,
        subject,
        text: message,
        attachments: [
          {
            filename,
            content: base64pdf,
            encoding: 'base64',
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

