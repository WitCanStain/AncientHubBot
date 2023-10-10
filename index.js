const dotenv = require('dotenv');
dotenv.config();
const {ds_client} = require("./ds");
const {sendVerificationMessageToUser, processVerificationSubmission, acceptUserVerification } = require("./verifyHandler");
const {messageIsInApprovedChannels} = require("./ds_util");

const PREFIX = '!';

ds_client.on("messageCreate", async message => {
    console.log(`Received request`)
    if (message.author.bot || !message.content.startsWith(PREFIX) || (!messageIsInApprovedChannels(message) && message.guild)) {
        return;
    }

    // let parent = message.channel.parent;
    // let parent_name;


    const regx = /(?:[^\s"]+|"[^"]*")+/g;
    const commandBody = message.content.slice(PREFIX.length);
    const params = commandBody.match(regx);
    const command = params.shift().toLowerCase();
    const commandMsgBody = message.content.slice(PREFIX.length + command.length).trim();
    // console.log(`commandMsgBody: ${commandMsgBody}`)
    switch (command) {
        case 'ping':
            message.reply(`pong`);
            break;
        case 'ping_dev':
            message.reply(`username: ${message.author.username}, id: ${message.author.id}`)
            break;
        case 'ping_dm':
            message.author.send('pong');
            break;
        case 'ping_roles':
            let has_ancient_role = message.member.roles.cache.some(r => r.name.toLowerCase() === "ancient" || r.name.toLowerCase() === "ancient no test access")
            has_ancient_role ? message.reply('Already verified.') : message.reply('User not verified.')
            break;            
        case 'verify':
            await sendVerificationMessageToUser(message)
            break;            
        case 'verify_submit':
            console.log(`verify submit`)
            await processVerificationSubmission(message);
            break;
        case 'verify_accept':
            await acceptUserVerification(message);
            break;            
        case 'verify_reject':
            await rejectUserVerification(message, commandMsgBody);
            break;
        case 'credits':
            await credits(message)
            break;
        default:
            break;
    }
});

const credits = function(message) {
    message.reply(`This Anvil Empires Ancient Hub bot was created by Oxblood, who is very handsome and cool.`);
}

// Login to Discord with your client's token


