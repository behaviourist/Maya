const Discord = require("discord.js");
const { colours } = require('../config.json');

module.exports.run = async (client, message, args) => {
	let perms = client.permLevels.get(message.guild.id);

    if(!args[this.config.params[0].name]) {
		let str = "";
		client.commands.map(x => {
			str += `${x.config.name} - ${perms[x.config.permLevel].data.name}\n`
		});

		const embed = new Discord.RichEmbed()
			.setTitle(`Help for Maya`)
			.setDescription(str)
			.setColor(colours.BLURPLE);
		return message.channel.send(embed);
	}
	
	const command = args[this.config.params[0].name];
	const retrievedCommand = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	
	if(!retrievedCommand) {
		const embed = new Discord.RichEmbed()
			.setTitle(`Invalid command`)
			.setDescription(`Use help without a command name to see all available commands.`)
			.setColor(colours.FAIL);
		return message.channel.send(embed);
	}

	const embed = new Discord.RichEmbed()
		.setTitle(`Help for ${retrievedCommand.config.name}`)
		.setDescription(`Name: ${retrievedCommand.config.name}
		Permisson Level: ${perms[retrievedCommand.config.permLevel].data.name} (${retrievedCommand.config.permLevel})
		Aliases: ${retrievedCommand.config.aliases.join(", ")}
		Parameters: ${retrievedCommand.config.params.map(param => {return `${param.name}, `})}`)
	message.channel.send(embed);
}

module.exports.config = {
    name: "help",
    aliases: [],
    permLevel: 0,
    params: [
        {
            name: "command",
            required: false,
            multiword: false
        }
    ]
}