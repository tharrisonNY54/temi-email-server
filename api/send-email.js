import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    // Manually parse body from stream
    let body = '';
    await new Promise((resolve, reject) => {
      req.on('data', chunk => (body += chunk));
      req.on('end', resolve);
      req.on('error', reject);
    });

    const { name, message, to } = JSON.parse(body);

    const { data, error } = await resend.emails.send({
      from: 'TEMI Robot <onboarding@resend.dev>',
      to: [to],
      subject: 'New Message from TEMI',
      html: `<strong>${name}</strong> says:<br><br>${message}`,
    });

    if (error) {
      console.error('Resend SDK Error:', error);
      return res.status(500).json({ error: 'Resend failed', detail: error });
    }

    console.log('Resend success:', data);
    return res.status(200).json({ success: true, resendId: data.id });
  } catch (err) {
    console.error('Server crash:', err);
    return res.status(500).json({ error: 'Internal Server Error', detail: err.toString() });
  }
};
