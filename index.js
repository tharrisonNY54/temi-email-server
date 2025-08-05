const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ─── KEEP-ALIVE ROUTE ────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.sendStatus(200));
app.head('/health', (req, res) => res.sendStatus(200));
// ───────────────────────────────────────────────────────────────────────────────

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
    … your existing HTML …
  `;

  const mailOptions = {
    from: `"TEMI Messenger" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📬 New Message from TEMI Robot (sent by ${name})`,
    html: htmlTemplate,
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
