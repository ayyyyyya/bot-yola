require("./system/global")
const fs = require('fs')
const chalk = require('chalk')
const { default: makeWASocket, useMultiFileAuthState, makeInMemoryStore, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const pino = require('pino')
const func = require("./system/place")
const readline = require("readline")
const usePairingCode = true
const yargs = require("yargs")
const axios = require("axios")
const { Boom } = require('@hapi/boom')
const { load_Module } = require("./system/function.js")
global.status = 0
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
})
const question = (text) => {
return new Promise((resolve) => {
rl.question(text, resolve)
})}

const DataBase = require('./system/database.js');
const database = new DataBase();
(async () => {
const loadData = await database.read()
if (loadData && Object.keys(loadData).length === 0) {
global.db = {
users: {},
groups: {},
database: {},
settings : {},
...(loadData || {}),
}
await database.write(global.db)
} else {
global.db = loadData
}
setInterval(async () => {
if (global.db) await database.write(global.db)
}, 5000)
})()

async function startSesi() {
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const { version, isLatest } = await fetchLatestBaileysVersion()

const connectionOptions = {
version: version,
browser: ['Ubuntu', 'Chrome', '20.0.04'],
getMessage: async (key) => {
if (store) {
const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
return msg?.message || undefined
}
return {
conversation: 'hallo'
}},
printQRInTerminal: !usePairingCode,
logger: pino({ level: "silent" }),
auth: state
}

const yola = func.makeWASocket(connectionOptions)

if (!yola.authState.creds.registered && usePairingCode) {

    const boxWidth = 48;
    const scriptInfoTitle = '🌸 スクリプト情報 | INFO SCRIPT 🌸';
    const numInfoTitle = '📱 MASUKKAN NOMOR WA | WA番号 📱';
    const desc = ` DESKRIPSI: Yola Assistant`;
    const updated = ` PEMBARUAN TERAKHIR: 23/05/2025`;
    const author = ` PEMBUAT: Requime`;
    const statusText = ` STATUS: Active`;
    const countryCode = 'MULAI DENGAN KODE NEGARA (62)';
    const countryCodeJP = '国コード(62)から始めてください';

    const centerText = (text, width) => {
        const cleanText = text.replace(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]/gu, '');
        const textLength = cleanText.length + (text.length - cleanText.length) * 2;
        const padding = Math.max(0, Math.floor((width - textLength) / 2));
        const remainingSpace = width - textLength - padding;
        return ' '.repeat(padding) + text + ' '.repeat(remainingSpace);
    };


    console.log(chalk.hex('#FF69B4')('╔' + '═'.repeat(boxWidth) + '╗'));
    console.log(chalk.hex('#FF69B4')('║') + centerText(scriptInfoTitle, boxWidth) + chalk.hex('#FF69B4')('║'));
    console.log(chalk.hex('#FF69B4')('╠' + '═'.repeat(boxWidth) + '╣'));
    console.log(chalk.hex('#00FFFF')('║') + chalk.white(desc.padEnd(boxWidth)) + chalk.hex('#00FFFF')('║'));
    console.log(chalk.hex('#00FFFF')('║') + chalk.white(updated.padEnd(boxWidth)) + chalk.hex('#00FFFF')('║'));
    console.log(chalk.hex('#00FFFF')('║') + chalk.white(author.padEnd(boxWidth)) + chalk.hex('#00FFFF')('║'));
    console.log(chalk.hex('#00FFFF')('║') + chalk.white(statusText.padEnd(boxWidth)) + chalk.hex('#00FFFF')('║'));
    console.log(chalk.hex('#FF69B4')('╚' + '═'.repeat(boxWidth) + '╝'));

    console.log(chalk.hex('#FF0000')(`
    ⣇⣿⠘⣿⣿⣿⡿⡿⣟⣟⢟⢟⢝⠵⡝⣿⡿⢂⣼⣿⣷⣌⠩⡫⡻⣝⠹⢿⣿⣷
    ⡆⣿⣆⠱⣝⡵⣝⢅⠙⣿⢕⢕⢕⢕⢝⣥⢒⠅⣿⣿⣿⡿⣳⣌⠪⡪⣡⢑⢝⣇
    ⡆⣿⣿⣦⠹⣳⣳⣕⢅⠈⢗⢕⢕⢕⢕⢕⢈⢆⠟⠋⠉⠁⠉⠉⠁⠈⠼⢐⢕⢽
    ⡗⢰⣶⣶⣦⣝⢝⢕⢕⠅⡆⢕⢕⢕⢕⢕⣴⠏⣠⡶⠛⡉⡉⡛⢶⣦⡀⠐⣕⢕
    ⡝⡄⢻⢟⣿⣿⣷⣕⣕⣅⣿⣔⣕⣵⣵⣿⣿⢠⣿⢠⣮⡈⣌⠨⠅⠹⣷⡀⢱⢕
    ⡝⡵⠟⠈⢀⣀⣀⡀⠉⢿⣿⣿⣿⣿⣿⣿⣿⣼⣿⢈⡋⠴⢿⡟⣡⡇⣿⡇⡀⢕
    ⡝⠁⣠⣾⠟⡉⡉⡉⠻⣦⣻⣿⣿⣿⣿⣿⣿⣿⣿⣧⠸⣿⣦⣥⣿⡇⡿⣰⢗⢄
    ⠁⢰⣿⡏⣴⣌⠈⣌⠡⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣬⣉⣉⣁⣄⢖⢕⢕⢕
    ⡀⢻⣿⡇⢙⠁⠴⢿⡟⣡⡆⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣵⣵⣿
    ⡻⣄⣻⣿⣌⢿⣷⣥⣿⠇⣿⣿⣿⣿⣿⣿⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣷⢄⠻⣿⣟⠿⠦⠍⠉⣡⣾⣿⣿⣿⣿⣿⣿⢸⣿⣦⠙⣿⣿⣿⣿⣿⣿⣿⣿⠟
    ⡕⡑⣑⣈⣻⢗⢟⢞⢝⣻⣿⣿⣿⣿⣿⣿⣿⠸⣿⠿⠃⣿⣿⣿⣿⣿⣿⡿⠁⣠
    ⡝⡵⡈⢟⢕⢕⢕⢕⣵⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣿⣿⣿⣿⣿⠿⠋⣀⣈⠙
    ⡝⡵⡕⡀⠑⠳⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢉⡠⡲⡫⡪
    `));

console.log(chalk.hex('#FF69B4')('╔' + '═'.repeat(boxWidth) + '╗'));
console.log(chalk.hex('#FF69B4')('║') + centerText(numInfoTitle, boxWidth) + chalk.hex('#FF69B4')('║'));
console.log(chalk.hex('#FF69B4')('╠' + '═'.repeat(boxWidth) + '╣'));
console.log(chalk.hex('#00FFFF')('║') + chalk.white(centerText(countryCode, boxWidth)) + chalk.hex('#00FFFF')('║'));
console.log(chalk.hex('#00FFFF')('║') + chalk.white(centerText(countryCodeJP, boxWidth)) + chalk.hex('#00FFFF')('║'));
console.log(chalk.hex('#FF69B4')('╚' + '═'.repeat(boxWidth) + '╝'));
const phoneNumber = await question(chalk.hex('#00FFFF')('↳ '));

const customPairingCode = "ALIPELXZ";
const code = await yola.requestPairingCode(phoneNumber.trim(), customPairingCode);
console.log(chalk.hex('#FF69B4').bold('💻 KODE PAIRING ANDA | あなたのペアリングコード:') + ' ' + chalk.hex('#00FFFF').bold(code));

}

store?.bind(yola.ev)

yola.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
const reason = new Boom(lastDisconnect?.error)?.output.statusCode
console.log(chalk.redBright('❌ Connection Closed:'), lastDisconnect.error ? lastDisconnect.error : 'Unknown Error');
if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
    console.log(chalk.redBright('❌ Stream Error. Exiting...'))
    process.exit()
} else if (reason === DisconnectReason.badSession) {
    console.log(chalk.redBright(`❌ FILE SESI BURUK, SILAKAN HAPUS FOLDER 'session' DAN PINDAI LAGI`))
    process.exit()
} else if (reason === DisconnectReason.connectionClosed) {
    console.log(chalk.yellow('[SYSTEM]\n🟡 KONEKSI DITUTUP, MENYAMBUNG KEMBALI... | 接続が閉じられました、再接続中...'))
    startSesi()
} else if (reason === DisconnectReason.connectionLost) {
    console.log(chalk.yellow('[SYSTEM]\n🟡 KONEKSI HILANG, MENCOBA MENYAMBUNG KEMBALI | 接続が失われました、再接続試行中...'))
    startSesi()
} else if (reason === DisconnectReason.connectionReplaced) {
    console.log(chalk.redBright('❌ KONEKSI DIGANTI, SESI BARU LAIN DIBUKA, SILAKAN TUTUP SESI SAAT INI TERLEBIH DAHULU | 接続が置き換えられました'))
    yola.logout()
} else if (reason === DisconnectReason.restartRequired) {
    console.log(chalk.yellow('🟡 RESTART DIPERLUKAN, RESTARTING... | 再起動が必要です、再起動中...'));
    startSesi()
} else if (reason === DisconnectReason.loggedOut) {
    console.log(chalk.redBright(`❌ PERANGKAT KELUAR, SILAKAN HAPUS FOLDER 'session' DAN JALANKAN LAGI. | デバイスがログアウトしました`))
    yola.logout()
} else if (reason === DisconnectReason.timedOut) {
    console.log(chalk.yellow('🟡 KONEKSI TIMEOUT, MENYAMBUNG KEMBALI... | 接続タイムアウト、再接続中...'))
    startSesi()
} else {
    yola.end(chalk.redBright(`❌ ALASAN PEMUTUSAN TIDAK DIKETAHUI | 不明な切断理由: ${reason}|${lastDisconnect.error}`))
}
} else if (connection === 'open') {
 try {
  await yola.newsletterSubscribers("120363365678318064@newsletter");
 } catch (error) {
  console.warn(chalk.yellow("⚠️ Tidak dapat berlangganan newsletter:"), error);
 }
 await console.clear()
 console.log(chalk.hex('#FF69B4')('✨💖') + chalk.hex('#00FFFF').bold(' 接続成功！ | BERHASIL TERHUBUNG KE SERVER! ') + chalk.hex('#FF69B4')('💖✨'));
 }

});


yola.ev.on('messages.upsert', async (chatUpdate) => {
try {
let m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.key && m.key.remoteJid === 'status@broadcast') return
if (!yola.public && m.key.remoteJid !== global.owner+"@s.whatsapp.net" && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return;
m = await func.smsg(yola, m, store)
if (m.isBaileys) return
if (status == 0) {
await load_Module(yola)
global.status = 1 }

if (!m.isBaileys && m.message && m.sender) {
   const senderName = m.pushName || m.sender.split('@')[0];
   let chatName = m.chat;
   if (m.isGroup) {
       const groupMeta = await yola.groupMetadata(m.chat).catch(_ => null);
       chatName = groupMeta?.subject || m.chat;
   }
   const messageType = Object.keys(m.message)[0].replace(/message$/i, '').replace('Message', '');
   const messageText = m.body || m.text || `[${messageType}]`;
   const time = new Date().toLocaleTimeString('en-GB');

   console.log(
      chalk.hex('#FF69B4')(`[${time}]`) +
      chalk.hex('#FF4500')(` ${m.isGroup ? 'GRP' : 'PVT'}`) +
      chalk.hex('#00FFFF')(` ${senderName}`) +
      (m.isGroup ? chalk.white(` in `) + chalk.hex('#00FFFF')(`${chatName}`) : '') +
      chalk.white(': ') +
      chalk.whiteBright(`${messageText}`)
   );
}

require("./yola.js")(yola, m, store)
} catch (err) {
console.log(chalk.redBright('❌ Error processing message: '), err)
}
})

yola.ev.on('contacts.update', (update) => {
for (let contact of update) {
let id = yola.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

yola.ev.on('creds.update', saveCreds)
yola.public = true

return yola
}

startSesi()

process.on('uncaughtException', function (err) {
console.log(chalk.redBright('❌ PENGECUALIAN TERTANGKAP | Uncaught Exception: '), err)
})

process.on('unhandledRejection', (reason, promise) => {
 console.log(chalk.redBright('❌ PENOLAKAN TIDAK DITANGANI | Unhandled Rejection at:'), promise, chalk.redBright('ALASAN | reason:'), reason);
});


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.hex('#00FFFF')("🔄 PEMBARUAN FILE | File Update => "), chalk.hex('#FF69B4').bgHex('#00FFFF').bold(`${__filename}`))
delete require.cache[file]
require(file)
})