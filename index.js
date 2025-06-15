const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

// ملف الجلسة (سيتم حفظ الاتصال بعد مسح الـ QR)
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true // ✅ لإظهار رمز QR في السجل (Logs)
    });

    // الاستماع للرسائل الجديدة
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const sender = msg.key.remoteJid;
            console.log("📥 رسالة من:", sender);
            await sock.sendMessage(sender, { text: "🤖 أهلاً بك! هذا بوت واتساب يعمل مباشرة من GitHub Actions 🚀" });
        }
    });

    // حفظ الجلسة تلقائيًا عند أي تحديث
    sock.ev.on('creds.update', saveState);
}

startBot();

// ✅ هذا السطر يمنع البوت من الخروج تلقائيًا داخل GitHub Actions
setInterval(() => {}, 1 << 30);
