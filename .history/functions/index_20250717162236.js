/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
admin.initializeApp();

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

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const gmailEmail = functions.config().gmail.email;
const gmailPass = functions.config().gmail.pass;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {user: gmailEmail, pass: gmailPass},
});

exports.sendReceipt = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const {to, subject, message, filename, base64pdf} = req.body;
    if (!to || !base64pdf){
      return res.status(400).send("Missing required fields");
    }

    const mailOptions = {
      from: `Celebal‑Mart <${gmailEmail}>`,
      to,
      subject,
      text: message,
      attachments: [
        {
          filename,
          content: base64pdf,
          encoding: "base64",
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send("Email sent");
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).send("Failed to send");
    }
  });
});
