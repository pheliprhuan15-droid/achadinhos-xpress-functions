require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { OpenAI } = require('openai');
const express = require('express');

admin.initializeApp();

// === CONFIGURAÇÕES GERAIS ===

// E-mail automático (Gmail)
const gmailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_APP_PASS 
  }
});

// Cliente OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// === FUNÇÕES FIREBASE ===

// Envio de e-mail (chamado via Firebase)
exports.sendEmail = functions.https.onCall(async (data) => {
  const { to, subject, html } = data;
  await gmailTransport.sendMail({
    from: `Achadinhos Xpress <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  });
  return { ok: true };
});

// Envio de SMS via Twilio (Firebase)
exports.sendSMS = functions.https.onCall(async (data) => {
  const { to, text } = data;
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  await client.messages.create({
    from: process.env.TWILIO_FROM || '',
    to,
    body: text
  });
  return { ok: true };
});

// IA GPT (Firebase)
exports.yana = functions.https.onCall(async (data) => {
  const prompt = data.prompt || 'Olá!';
  const model = data.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const r = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });
  return { ok: true, result: r.choices[0].message.content };
});

// === SERVIDOR EXPRESS PARA TESTES DIRETOS (Railway) ===

const app = express();

// Teste do servidor
app.get('/', (req, res) => {
  res.send('🚀 Servidor Achadinhos Xpress ativo com Firebase Functions e Railway.');
});

app.get('/test', (req, res) => {
  res.send('✅ Servidor local do Achadinhos Xpress ativo e funcionando!');
});

// Teste de envio de e-mail
app.get('/test-email', async (req, res) => {
  try {
    await gmailTransport.sendMail({
      from: Achadinhos Xpress <${process.env.GMAIL_USER}>,
      to: process.env.GMAIL_USER,
      subject: 'Teste de e-mail automático 🚀',
      html: '<h3>Servidor Railway + Gmail funcionando ✅</h3>'
    });
    res.send('📧 E-mail enviado com sucesso.');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Erro ao enviar e-mail.');
  }
});

// Teste de IA
app.get('/test-ai', async (req, res) => {
  try {
    const r = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Diga apenas: Servidor funcionando corretamente.' }]
    });
    res.send('🤖 ' + r.choices[0].message.content);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Erro ao acessar IA.');
  }
});

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Servidor rodando na porta ${PORT}));