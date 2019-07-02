const { RichEmbed } = require("discord.js");
const { colours } = require("../config.json");
const Enmap = require("enmap");
const utils = require("../utils");
const NLU = require('../nlu.js');
const config = require('../nlu_data/config.json');

module.exports = (client, message) => {
    if (message.author.bot) return;

    const permLevels = client.permLevels.ensure(message.guild.id, {
        0: { data: { name: "Default", description: "Default Users" }, users: [message.author.id] },
        1: { data: { name: "", description: "" }, users: [] },
        2: { data: { name: "", description: "" }, users: [] },
        3: { data: { name: "", description: "" }, users: [] },
        4: { data: { name: "", description: "" }, users: [] },
        5: { data: { name: "", description: "" }, users: [] },
        6: { data: { name: "", description: "" }, users: [] },
        7: { data: { name: "Moderator", description: "A member specified by the server owner." }, users: [] },
        8: { data: { name: "Administrator", description: "A member with the 'ADMINISTRATOR' permission." }, users: [] },
        9: { data: { name: "Server Owner", description: "Owner of the Discord server." }, users: [message.guild.ownerID] },
        10: { data: { name: "Developer", description: "Maya Developers." }, users: ["169516316124905473", "276911608565989378", "204095557642354689", "347765999996502017"] }
    });

    const config = client.config.ensure(message.guild.id, { prefix: "-" });

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${config.prefix})\\s*`);

    if (!prefixRegex.test(message.content)) return;

    let args = message.content.slice(message.content.match(prefixRegex)[0].length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.content.split(" ")[0].match(`^(<@!?${client.user.id}>)`)) {
        message.mentions.users.delete(client.user.id);
        message.mentions.members.delete(client.user.id);

        if (!client.commands.has(command) && !client.aliases.has(command)) {
            NLU.manager.process(`${command} ${args.join(" ")}`).then(result => {
                if (result < config.threshold) {
                    return message.channel.send(`Sorry. I don't understand`);
                }

                let intent = result.intent;

                let retrievedCommand = client.nlucommands.get(intent);

                if (!retrievedCommand) {
                    return message.channel.send(`Sorry. I don't understand`);
                }

                retrievedCommand.run(client, message);
            });
        }
    }

    if (!command) return;
    if (!client.commands.has(command) && !client.aliases.has(command)) return;

    const retrievedCommand = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    let allow = false;

    for (let i = 0; i < Object.keys(permLevels).length; i++) {
        const found = client.permLevels.find(c => c[i].users.includes(message.author.id));
        found !== null && retrievedCommand.config.permLevel <= i ? allow = true : null;
    }

    if (retrievedCommand && allow) {
        argsObj = {};
        if (retrievedCommand.config.params.length > 0) {
            for (let l in retrievedCommand.config.params) {
                if (retrievedCommand.config.params[l].multiword) {
                    if (typeof args[l] === "object") args[l] = args.slice(l);
                    else args[l] = args.slice(l).join(" ");
                    args = args.slice(0, l + 1);
                }
            }

            for (let j in retrievedCommand.config.params) {
                if (retrievedCommand.config.params[j].required && !args[j]) {
                    return message.channel.send(
                        new RichEmbed()
                            .setDescription(`${utils.capitalize(retrievedCommand.config.params[j].name)} is a required argument.`)
                            .setColor(colours.FAIL)
                            .setTimestamp()
                    );
                } else {
                    argsObj[retrievedCommand.config.params[j].name] = args[j];

                    if (message.mentions.members) {
                        message.mentions.members
                            .map(member => argsObj[retrievedCommand.config.params[j].name] = member);
                    }

                    if (message.mentions.channels) {
                        message.mentions.channels
                            .map(channel => argsObj[retrievedCommand.config.params[j].name] = channel);
                    }
                }
            }
        }

        retrievedCommand.run(client, message, argsObj);
    }

    else return;
}