module.exports.partialMatchUsername = (message, username) => {
    return message.guild.members
        .find(member => member.displayName.toLowerCase().includes(username.toLowerCase()));
}