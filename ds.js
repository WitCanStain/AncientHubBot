const { Client, GatewayIntentBits, Partials } = require("discord.js");
const ds_client = new Client({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages], partials: [
        Partials.Channel,
        Partials.Message
    ]
});
ds_client.login(process.env.BOT_TOKEN);

// When the ds_client is ready, run this code (only once)
ds_client.once('ready', () => {
    console.log('AncientHubBot Ready!');
});

// let member = ds_client.members.cache.get(582843080227422208);//guild.members.cache.get(userid);

// const test = async function() {
//     const guild = await ds_client.guilds.cache.get(process.env.GUILD_ID);
//     console.log(`guild: ${JSON.stringify(guild)}`)
//     console.log(`member: ${JSON.stringify(member)}`);
// }


module.exports = { ds_client };
