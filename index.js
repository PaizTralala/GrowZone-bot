const { Client, Collection, Intents } = require("discord.js");
const { mongoURL } = require("./config.js");
const { Database } = require("quickmongo");
const client = new Client({
    allowedMentions: { parse: ['users', 'roles'] },
    fetchAllMembers: true,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ],
    partials: ["GUILD_MEMBERS"]
});

// Set collection
client.commands = new Collection();
client.slash = new Collection();
client.aliases = new Collection();
cooldowns = new Collection();

// Set utils
client.logger = require('./src/utils/logger.js');
client.color = require('./src/utils/color.js');
client.util = require('./src/utils/util.js');
client.db = new Database(mongoURL);

// Set config
client.config = require('./config');

// Load semua handler
["error", "command", "slashCommands", "event"].forEach(file => { require(`./src/utils/handlers/${file}`)(client) })

client.login(client.config.token);