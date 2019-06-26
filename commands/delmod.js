const { RichEmbed } = require("discord.js")
const { partialMatchUsername } = require("../utils");

const { colours } = require("../config.json");

module.exports.run = async (client, message, args) => {
    let member = args[this.config.params[0].name];
    if (!member) {
        return message.channel.send(
            new RichEmbed()
                .setDescription("You must provide a member, id or username in order to remove them from permssion level `Moderator`.")
                .setColor(colours.FAIL)
                .setTimestamp()
        );
    }

    if (typeof member !== "object") member = partialMatchUsername(message, member);

    if (!client.permLevels.get(message.guild.id)[7].users.includes(member.id)) {
        return message.channel.send(
            new RichEmbed()
                .setDescription("That member is not permission level `Moderator`.")
                .setColor(colours.FAIL)
                .setTimestamp()
        );
    }

    client.permLevels.remove(message.guild.id, member.id, `7.users`);

    return message.channel.send(
        new RichEmbed()
            .setDescription(`**${member.user.tag}** has had permission level \`Moderator\` revoked.`)
            .setColor(colours.BLURPLE)
            .setTimestamp()
    );
}

module.exports.config = {
    name: "delmod",
    aliases: ["deletemoderator", "delmoderator", "deletemod"],
    permLevel: 8,
    params: [
        {
            name: "member",
            required: true,
            multiword: false
        }
    ]
}