const { RichEmbed } = require("discord.js");
const { colours } = require("../config.json");

module.exports.run = async (client, message, args) => {
    const newPrefix = args[this.config.params[0].name];
    if (!newPrefix || newPrefix.length <= 0) {
        return message.channel.send(
            new RichEmbed()
                .setDescription("You must provide a prefix in order to change it.")
                .setColor(colours.FAIL)
                .setTimestamp()
        );
    }

    client.config.set(message.guild.id, newPrefix, "prefix");

    return message.channel.send(
        new RichEmbed()
            .setDescription(`**${message.author.tag}** has changed the prefix to **${newPrefix}**`)
            .setColor(colours.BLURPLE)
            .setTimestamp()
    );
}

module.exports.config = {
    name: "setprefix",
    aliases: [],
    permLevel: 8,
    params: [
        {
            name: "prefix",
            required: true,
            multiword: false
        }
    ]
}