const {ds_client} = require("./ds");
const {userIsVerified} = require("./ds_util");
const {buildVerificationRequestEmbedMsg, buildVerificationCmdEmbedMsg, getFieldValueFromEmbed: getFieldValueFromMessageEmbed} = require("./embedHelper");

const generateVerificationCode = () => {
    return Math.floor(Math.random() * 10000)

}

const sendVerificationMessageToUser = (message) => {
    if (userIsVerified(message)) {
        message.author.send('You are currently verified, and do not need to verify again this test.')
        return null;
    };
    let verification_code = generateVerificationCode()
    console.log(`verification code: ${verification_code}`)
    let embed = buildVerificationCmdEmbedMsg(verification_code)
    message.author.send({ embeds: [embed] })
}

const processVerificationSubmission = (message) => {
    message.channel.messages.fetch({ limit: 10 }).then(messages => {
        console.log(`Received ${messages.size} messages`);
        //Iterate through the messages here with the variable "messages".

        // messages.forEach((dm_message) => { 
        //     let messageAttachment = dm_message.attachments.size > 0 ? dm_message.attachments.first().url : null;
        //     console.log(dm_message.content);
        //     console.log(`url: ${messageAttachment}`)
        // })
        let verify_img_url;
        let verification_code
        for (const msg of messages.values()) {
            console.log(msg.attachments)
            verify_img_url = verify_img_url ?? (msg.attachments.size > 0 ? msg.attachments.first()?.url : null);
            // console.info(`verify_img_url 0: ${verify_img_url}`)
            msg.embeds.forEach((embed) => {
                let fields = embed.fields;
                let verification_code_field = fields.find((field) => {
                    return field.name === 'Verification Code';
                });
                verification_code = verification_code ?? verification_code_field?.value;
            });
        }
        console.info(`verify_img_url: ${verify_img_url}, verification_code: ${verification_code}`)
        if (verify_img_url && verification_code) {
            let username = message.author.username;
            let userid = message.author.id;
            let embed = buildVerificationRequestEmbedMsg(verify_img_url, username, userid, verification_code)
            message.author.send('Thank you for submitting your verification details. Please wait for the Ancient Hub team to review your request.')
            ds_client.channels.cache.get(process.env.VERIFICATION_CHANNEL_ID).send({ embeds: [embed] })
        }
      })
}

const acceptUserVerification = async (message) => {
    let repliedTo;
    try {
        repliedTo = await message.fetchReference();
    } catch (e) {
        message.reply(`Could not find referenced message.`)
        return null;
    }
    try {
        console.info(`repliedTo: ${JSON.stringify(repliedTo)}`)
        let userid = getFieldValueFromMessageEmbed(repliedTo, 'userid');
        let username = getFieldValueFromMessageEmbed(repliedTo, 'username');
        console.log(`user_id: ${userid}`)
        console.log(`username: ${username}`)
        if (userid) {
            // const guild = ds_client.guilds.cache.get(process.env.GUILD_ID);
            let member = await message.guild.members.fetch(String(userid));//guild.members.cache.get(userid);
            // let member = await ds_client.members.fetch(String(userid));
            console.log(`member: ${JSON.stringify(member)}`)
            let ancient_role = message.guild.roles.cache.find(role => role.name.toLowerCase() === "ancient");
            console.log(`ancient_role: ${JSON.stringify(ancient_role)}`);
            let ancient_unverified_role_to_remove = message.guild.roles.cache.find(role => role.name.toLowerCase() === "ancient (unverified)");
            let pagan_role_to_remove = message.guild.roles.cache.find(role => role.name.toLowerCase() === "pagan");
            let remnant_role_to_remove = message.guild.roles.cache.find(role => role.name.toLowerCase() === "remnant");
            let neutral_role_to_remove = message.guild.roles.cache.find(role => role.name.toLowerCase() === "neutral");
            await member.roles.add(ancient_role);
            await member.roles.remove(ancient_unverified_role_to_remove);
            await member.roles.remove(remnant_role_to_remove);
            await member.roles.remove(pagan_role_to_remove);
            await member.roles.remove(neutral_role_to_remove);
            member.send('Your verification request was accepted. Welcome, Ancient.');
            // ds_client.users.cache.get(userid).send('Your verification request was accepted. Welcome, Ancient.');
            message.reply(`The user has been informed.`);
            ds_client.channels.cache.get(process.env.VERIFICATION_LOG_CHANNEL_ID).send(`<@${message.author.id}> has approved the verification request of user ${username} (${userid})`, {"allowedMentions": { "users" : []}});
            repliedTo.delete();
        };
    } catch (e) {
        console.error(`error in acceptUserVerification:`);
        console.error(e);
        return null
    }
    

}

const rejectUserVerification = async (message, reject_reason) => {
    let repliedTo;
    try {
        repliedTo = await message.fetchReference();
    } catch (e) {
        message.reply(`Could not find referenced message.`)
        return null;
    }
    let userid = getFieldValueFromMessageEmbed(repliedTo, 'userid');
    let username = getFieldValueFromMessageEmbed(repliedTo, 'username');
    repliedTo.embeds.forEach((embed) => {
        let fields = embed.fields;
        let userid_field = fields.find((field) => {
            return field.name === 'userid';
        });
        userid = userid ?? Number(userid_field?.value);
    });
    let reject_msg = !reject_reason ? 'Your verification request was rejected. Please read the instructions carefully and try again.' : `Your verification request was rejected. The following reason was provided: ${reject_reason}`;
    if (userid) {
        ds_client.users.cache.get(userid).send(reject_msg);
        message.reply(`The user has been informed.`);
        ds_client.channels.cache.get(process.env.VERIFICATION_LOG_CHANNEL_ID).send(`<@${message.author.id}> has rejected the verification request of user ${username} (${userid})`, {"allowedMentions": { "users" : []}})
        repliedTo.delete();
    };
    
}


exports.sendVerificationMessageToUser = sendVerificationMessageToUser;
exports.processVerificationSubmission = processVerificationSubmission;
exports.acceptUserVerification = acceptUserVerification;
exports.rejectUserVerification = rejectUserVerification;