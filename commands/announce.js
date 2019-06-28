const Discord = require("discord.js");
const { partialMatchChannelname } = require("../utils");
const { colours } = require("../config.json");

module.exports.run = async (client, message, args) => {
	let channel = args[this.config.params[0].name];
	const announcement = args[this.config.params[1].name];

	if (!channel) {
        const embed = new Discord.RichEmbed()
			.setDescription("You must provide a channel, id or channel name in order to make an announcement.")
			.setColor(colours.FAIL)
			.setTimestamp()
		return message.channel.send(embed);
	}
	
	if (typeof channel !== "object") {
		let newChannel = message.guild.channels.get(channel);

		if(!newChannel) {
			let matchedChannel = partialMatchChannelname(message, channel);
			if(!matchedChannel) {
				const embed = new Discord.RichEmbed()
					.setDescription("You must provide a channel, id or channel name in order to make an announcement.")
					.setColor(colours.FAIL)
					.setTimestamp()
				return message.channel.send(embed);
			} else if(matchedChannel.type !== 'text') {
				const embed = new Discord.RichEmbed()
					.setDescription("You must provide a TEXT channel to make an announcement to.")
					.setColor(colours.FAIL)
					.setTimestamp();
				return message.channel.send(embed);
			} else channel = matchedChannel
		} else if(newChannel.type !== 'text') {
			const embed = new Discord.RichEmbed()
				.setDescription("You must mention a TEXT channel to make an announcement to.")
				.setColor(colours.FAIL)
				.setTimestamp();
			return message.channel.send(embed);
		} else channel = newChannel;
	}

	const embed = new Discord.RichEmbed()
		.setDescription(`Announcement from ${message.author}
		\n${announcement}`)
		.setColor(colours.BLURPLE)
		.setTimestamp();
	channel.send(embed).then(msg => {
		const embedResponse = new Discord.RichEmbed()
			.setTitle(`Successfully posted announcement`)
			.setDescription(`[Message](https://discordapp.com/channels/${channel.guild.id}/${channel.id}/${msg.id})`)
			.setColor(colours.SUCCESS);
		return message.channel.send(embedResponse);
	}).catch(err => {
		switch(err.code) {
			case 50013: 
				const embedMissingPerms = new Discord.RichEmbed()
					.setTitle(`Missing permissions.`)
					.setDescription(`I do not have permissions to SEND_MESSAGES to that channel.`)
					.setColor(colours.FAIL);
				return message.channel.send(embedMissingPerms);
			default:
				const embedUnknown = new Discord.RichEmbed()
					.setTitle(`Error occured`)
					.setDescription(`An unknown error occured. Please try again later.`)
					.setColor(colours.FAIL);
				return message.channel.send(embedUnknown);
		}
	});
}

module.exports.config = {
    name: "announce",
    aliases: ["announcement"],
    permLevel: 8,
    params: [
        {
            name: "channel",
            required: true,
            multiword: false
		},
		{
			name: "announcement",
			required: true,
			multiword: true
		}
    ]
}