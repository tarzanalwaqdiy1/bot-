const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const sender = msg.key.remoteJid;
            console.log("📥 رسالة من:", sender);
            await sock.sendMessage(sender, { text: "مرحبًا، أنا بوت واتساب يعمل من GitHub 🤖" });
        }
    });

    sock.ev.on('creds.update', saveState);
}

startBot();

// ✅ هذا السطر يجعل البوت يظل يعمل ولا يخرج:
setInterval(() => {}, 1 << 30);
