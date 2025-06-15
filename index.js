const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

// ملف التخزين الآمن للجلسة
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true // ✅ لعرض كود QR في اللوج
    });

    // الرد على أي رسالة نصية
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const sender = msg.key.remoteJid;
            console.log("📥 رسالة من:", sender);
            await sock.sendMessage(sender, { text: "مرحبًا، أنا بوت واتساب يعمل من GitHub 🤖" });
        }
    });

    // حفظ الجلسة تلقائيًا
    sock.ev.on('creds.update', saveState);
}

startBot();