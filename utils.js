module.exports.partialMatchUsername = (message, username) => {
    const match = message.guild.members.find(member => member.user.username.toLowerCase().includes(username.toLowerCase()));
    return match;
}