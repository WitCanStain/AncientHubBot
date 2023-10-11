const { EmbedBuilder } = require('discord.js');

const verify_initiate_msg_template = `Welcome to the Ancient Hub.
To verify your account we require a screenshot of the following,

1. A screenshot of your character in-game this test showing the build number in the top right corner to verify you are an active ancient AND your unique verification code in local chat.

Your unique verification code is displayed in this message below.

When you have finished uploading your screenshot please type \`!verify_submit\` below.`


const buildVerificationRequestEmbedMsg = (img_url, username, userid, verification_code) => {
    const embed = new EmbedBuilder()
	.setColor('Red')
	.setTitle('New Verification Request')
	.setAuthor({ name: 'Ancient Hub', iconURL: 'https://i.imgur.com/bWEsAnV.png', url: 'https://discord.gg/gqVzrJRRUA' })
	.setDescription(`A user has sent a request for verification. Please review build number, screenshot content and unique code and respond with either \`!verify_accept\` or \`!verify_reject [optional reason]\`. The unique code you see should be ${verification_code}`)
    .addFields(
        { name: 'username', value: username },
		{ name: 'userid', value: userid.toString() }
	)
	.setImage(img_url)
	.setTimestamp()
	.setFooter({ text: 'If you have any questions or concerns as to the function of the bot, contact 0xbl00d.', iconURL: 'https://i.imgur.com/CZ278Y8.jpg' });
    return embed;
}



const buildVerificationCmdEmbedMsg = (verification_code) => {
    const embed = new EmbedBuilder()
	.setColor('Red')
	.setTitle('Verification Request Instructions')
	.setAuthor({ name: 'Ancient Hub', iconURL: 'https://i.imgur.com/bWEsAnV.png', url: 'https://discord.gg/gqVzrJRRUA' })
	// .setDescription(`User ${username} (${userid}) has sent a request for verification. Please review build number, screenshot content and unique code and respond with either \`!verify_submit\` or \`!verify_reject [optional reason]\`. The unique code you see should be ${verification_code}`)
	// .setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
        { name: 'Verification Instructions', value: verify_initiate_msg_template },
		{ name: 'Verification Code', value: verification_code.toString() }
	)
	.setTimestamp()
	.setFooter({ text: 'If you have any further questions or queries please contact a member of the the Ancient Hub admin team.', iconURL: 'https://i.imgur.com/bWEsAnV.png' });
    return embed;
}

const getFieldValueFromMessageEmbed = (message, field_name) => {
    let field_value;
    console.log(`message embeds: ${JSON.stringify(message.embeds)}`)
    message.embeds.forEach((embed) => {
        console.info(`embed: ${JSON.stringify(embed)}`)
        let fields = embed.fields;
        let field = fields.find((field) => {return field.name === field_name});
        console.log(`field: ${JSON.stringify(field)}`);
        field_value = field_value ?? field?.value;
        console.log(`field_value: ${JSON.stringify(field_value)}`);
    });
    return field_value;
}



exports.buildVerificationRequestEmbedMsg = buildVerificationRequestEmbedMsg;
exports.buildVerificationCmdEmbedMsg = buildVerificationCmdEmbedMsg;
exports.getFieldValueFromEmbed = getFieldValueFromMessageEmbed;
