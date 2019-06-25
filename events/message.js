const Enmap = require("enmap");

module.exports = (client, message) => {
    if (message.author.bot) return;

    const permLevels = client.permLevels.ensure(message.guild.id, {
        0: { data: { name: "Default", description: "Default Users" }, users: [] },
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

    if (!command) return;
    if (!client.commands.has(command) && !client.aliases.has(command)) return;

    if (message.content.match(prefixRegex)[0] === client.user
        && message.mentions.users.length === 1
        && message.mentions.users.length === 1
        && message.content.split(" ")[0] === client.user) {

        message.mentions.users.delete(client.user.id); message.mentions.members.delete(client.user.id);
    }

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
                    return message.channel.send(`${retrievedCommand.config.params[j].name.substring(0, 1).toUpperCase() + retrievedCommand.config.params[j].name.substring(1)} is a required argument.`)
                } else {
                    argsObj[retrievedCommand.config.params[j].name] = args[j];

                    if (message.mentions.members) {
                        message.mentions.members
                            .map(member => argsObj[retrievedCommand.config.params[j].name] = member);
                    }

                }
            }
        }

        retrievedCommand.run(client, message, argsObj);
    }

    else return;
}