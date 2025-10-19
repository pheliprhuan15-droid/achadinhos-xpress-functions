# Achadinhos Xpress Functions — Passo a Passo

## 1️⃣ Instalar ferramentas
npm i -g firebase-tools
firebase login

## 2️⃣ Inicializar projeto
firebase init functions

## 3️⃣ Instalar dependências
cd functions
npm install

## 4️⃣ Configurar variáveis de ambiente (.env)
Preencha o arquivo .env com suas chaves de Gmail, Twilio e OpenAI.

## 5️⃣ Testar localmente
firebase emulators:start

## 6️⃣ Fazer deploy
firebase deploy --only functions

## 7️⃣ Modelos IA disponíveis
- GPT-4 (padrão)
- GPT-5 Plus
- GPT-5 Pro
Pode alternar o modelo pelo painel administrativo.
