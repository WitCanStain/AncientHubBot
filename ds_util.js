
const approved_channels = ['get-verified', 'bot-test', 'verification-requests']

const messageIsInApprovedChannels = (message) => {
    console.log(approved_channels.includes(message.channel.name))
    return approved_channels.includes(message.channel.name)
}

const userIsVerified = (message) => {
    return message.member.roles.cache.some(r => r.name.toLowerCase() === "ancient")
}

exports.messageIsInApprovedChannels = messageIsInApprovedChannels;
exports.userIsVerified = userIsVerified;