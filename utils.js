module.exports.partialMatchUsername = (message, username) => {
    return message.guild.members
        .find(member => member.user.username.toLowerCase().includes(username.toLowerCase()));
}