require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { OpenAI } = require('openai');

admin.initializeApp();

// E-mail automático
const gmailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASS }
});

exports.sendEmail = functions.https.onCall(async (data) => {
  const { to, subject, html } = data;
  await gmailTransport.sendMail({
    from: `Achadinhos Xpress <${process.env.GMAIL_USER}>`, to, subject, html
  });
  return { ok: true };
});

// SMS via Twilio
exports.sendSMS = functions.https.onCall(async (data) => {
  const { to, text } = data;
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  await client.messages.create({
    from: process.env.TWILIO_FROM || '', to, body: text
  });
  return { ok: true };
});

// IA GPT-4 / 5 Plus / 5 Pro
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
exports.yana = functions.https.onCall(async (data) => {
  const prompt = data.prompt || 'Olá!';
  const model = data.model || process.env.OPENAI_MODEL || 'gpt-4';
  const r = await openai.chat.completions.create({
    model, messages: [{ role: 'user', content: prompt }], temperature: 0.3
  });
  return { ok: true, result: r.choices[0].message.content };
});
