module.exports.partialMatchUsername = (message, username) => {
    return message.guild.members
        .find(member => member.displayName.toLowerCase().includes(username.toLowerCase()));
}

module.exports.capitalize = (string) => {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
}