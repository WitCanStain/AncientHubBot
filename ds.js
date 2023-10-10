const { Client, GatewayIntentBits, Partials } = require("discord.js");
const ds_client = new Client({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages], partials: [
        Partials.Channel,
        Partials.Message
    ]
});

// When the ds_client is ready, run this code (only once)
ds_client.once('ready', () => {
    console.log('Ready!');
});
ds_client.login(process.env.BOT_TOKEN);

module.exports = { ds_client };
