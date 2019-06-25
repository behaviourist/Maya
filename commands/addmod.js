const { partialMatchUsername } = require("../utils");

module.exports.run = async (client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || partialMatchUsername(message, args.join(" "));
    if (!member) return message.channel.send("Please provide a member.");

    if (client.permLevels.get(message.guild.id)[7].users.includes(member.id)) return message.channel.send("That member is already at permission level: Moderator.");

    client.permLevels.push(message.guild.id, member.id, "7.users");

    return message.channel.send(`Added ${member} to permission level: Moderator.`);
}

module.exports.config = {
    name: "addmod",
    aliases: ["addmoderator"],
    permLevel: 9
}