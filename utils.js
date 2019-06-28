module.exports.partialMatchUsername = (message, username) => {
    return message.guild.members
        .find(member => member.displayName.toLowerCase().includes(username.toLowerCase()));
}

module.exports.partialMatchChannelname = (message, channelname) => {
    return message.guild.channels.find(
        channel => channel.type === 'text' && channel.name.toLowerCase().includes(channelname.toLowerCase())
    );
};

module.exports.capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}