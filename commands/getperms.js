const { RichEmbed } = require("discord.js");
const { partialMatchUsername } = require("../utils");

module.exports.run = async (client, message, args) => {
    let member = args[this.config.params[0].name] || message.member;
    if (typeof member !== "object") member = partialMatchUsername(message, member);

    const perms = [];

    const permLevels = client.permLevels.get(message.guild.id);

    for (let i = Object.keys(permLevels).length - 1; i >= 0; i--) {
        if (permLevels[i].users.includes(member.id)) perms.push(`${i} : ${permLevels[i].data.name}`);
    }

    return message.channel.send(
        new RichEmbed()
            .setColor("BLUE")
            .setTitle(`${member.user.tag}'s permissions`)
            .setDescription(perms.join("\n"))
            .setTimestamp()
    );
}

module.exports.config = {
    name: "getperms",
    aliases: ["perms"],
    permLevel: 0,
    params: [
        {
            name: "member",
            required: false,
            multiword: false
        }
    ]
}