const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;

    const perms = [];

    const permLevels = client.permLevels.get(message.guild.id);

    for (let i = Object.keys(permLevels).length - 1; i >= 0; i--) {
        if (permLevels[i].users.includes(member.id)) perms.push(`${i} : ${permLevels[i].data.name}`);
    }

    return message.channel.send(
        new Discord.RichEmbed()
            .setColor("BLUE")
            .setTitle(`${member.user.tag}'s permissions`)
            .setDescription(perms.join("\n"))
    );
}

module.exports.config = {
    name: "getperms",
    aliases: ["perms"],
    permLevel: 0
}