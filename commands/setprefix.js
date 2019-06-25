module.exports.run = async (client, message, args) => {
    const newPrefix = args.join(" ");
    if (!newPrefix || newPrefix.length <= 0) return message.channel.send("Please provide a **VALID** prefix.");

    client.config.set(message.guild.id, newPrefix, "prefix");

    return message.channel.send(`New server prefix: \`${newPrefix}\`.`);
}

module.exports.config = {
    name: "setprefix",
    aliases: [],
    permLevel: 8
}