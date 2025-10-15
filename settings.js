require("./system/module.js")

//=========[Setting BOT / OWNER]=========//
global.owner = ['6287892083741'];
global.namabot = "Yola-Asisten" 
global.namaowner = "ThanDz"
global.packname = "Yola"
global.author = "ThanDz"
global.thumb = "https://files.catbox.moe/gwx59h.jpg"
global.githubToken = "-"; 
global.githubUsername = "yola-ai";  
global.vercelToken = "-"; 

//=========[Setting Message]=========//
global.msg = {
wait: "Memproses . . .", 
owner: "Fitur Khusus Developper", 
group: "Fitur ini untuk dalam grup", 
admin: "Fitur ini untuk admin grup", 
botadmin: "Fitur ini hanya untuk bot menjadi admin"
}


let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.cyan("File Update => "), chalk.cyan.bgBlue.bold(`${__filename}`))
delete require.cache[file]
require(file)
})