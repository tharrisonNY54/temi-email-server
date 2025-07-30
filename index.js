const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/send-email", (req, res) => {
  const { to, message, name } = req.body;

  const mailOptions = {
    from: `"TEMI Messenger" <${process.env.EMAIL_USER}>`,
    to,
    subject: `New Message from ${name}`,
    text: message,
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
