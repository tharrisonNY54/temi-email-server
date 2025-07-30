const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.post("/api/send-email", (req, res) => {
  const { to, message, name } = req.body;

  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Message from TEMI Robot</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 30px 40px;
      border-radius: 8px;
      box-shadow: 0 0 12px rgba(0,0,0,0.08);
    }
    h2 {
      color: #2a2a2a;
      margin-top: 0;
    }
    .message-box {
      background-color: #f1f1f1;
      border-left: 4px solid #0077cc;
      padding: 16px;
      margin-top: 20px;
      font-size: 16px;
      white-space: pre-wrap;
      text-indent: 0;
      margin-bottom: 20px;
    }
    .footer {
      font-size: 13px;
      color: #888;
      text-align: center;
      margin: 0;
    }
    .temi-tag {
      color: #0077cc;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://i.imgur.com/MncfIPn.png" alt="Center for Digital Humanities Logo"
         style="max-width: 250px; display: block; margin: 0 auto 20px auto;" />
    <h2>📬 New Message from <span class="temi-tag">TEMI Robot</span></h2>
    <p style="margin-top: 0;">
      You’ve received a new message from the TEMI robot located on the Africana Studies floor at the University of Arizona.
    </p>
    <div class="message-box">${message}</div>
    <p class="footer">
      This message was sent automatically by the TEMI robot messaging system.
    </p>
  </div>
</body>
</html>`;

  const mailOptions = {
    from: `"TEMI Messenger" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📬 New Message from TEMI Robot (sent by ${name})`,
    html: htmlTemplate, // <- Use HTML instead of plain text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("SendMail error:", error);
      return res.status(500).json({ error: "Failed to send email." });
    }
    res.status(200).json({ success: true, info });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
