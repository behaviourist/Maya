module.exports.partialMatchUsername = (message, username) => {
    return message.guild.members
        .find(member => member.displayName.toLowerCase().includes(username.toLowerCase()));
}

module.exports.capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}