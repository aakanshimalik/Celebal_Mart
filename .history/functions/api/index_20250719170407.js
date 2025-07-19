/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// setGlobalOptions( {maxInstances: 10} );
// const gmailEmail = process.env.GMAIL_EMAIL;
// const gmailPass = process.env.GMAIL_PASS;
// const {setGlobalOptions} = require("firebase-functions");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: { user: gmailEmail, pass: gmailPass },
// });



// export default async function handler(req, res) {
//     res.setHeader("Access-Control-Allow-Origin", "https://functions-fnwoaiedk-aakanshi-maliks-projects.vercel.app/api"); // Change '*' to your frontend origin for security
//   res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   // Handle OPTIONS preflight request
//   if (req.method === 'OPTIONS') {
//     return res.status(204).end();
   
//   }

//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { to, subject, message, filename, base64pdf } = req.body;

//   if (!to || !base64pdf) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const mailOptions = {
//     from: `Celebal‑Mart <${gmailEmail}>`,
//     to,
//     subject,
//     text: message,
//     attachments: [
//       {
//         filename,
//         content: base64pdf,
//         encoding: "base64",
//       },
//     ],
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return res.status(200).json({ message: "Email sent" });
//   } catch (error) {
//     console.error("Email error:", error);
//     return res.status(500).json({ message: "Failed to send email" });
//   }
// };

