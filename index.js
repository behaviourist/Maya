const Discord = require("discord.js");
const client = new Discord.Client();
const Enmap = require("enmap")
const NLU = require('./nlu.js');

const fs = require("fs");

const { token } = require("./config.json");

client.commands = new Enmap();
client.aliases = new Enmap();
client.nlucommands = new Enmap();
client.config = new Enmap({ name: "Config" });
client.permLevels = new Enmap({ name: "PermLevels" });
client.headsup = new Enmap({ name: "HeadsupConfig" });

fs.readdir("./commands/", async (err, files) => {
    if (err) return console.error(err);

    files.forEach(file => {
        if (!file.endsWith('js')) return;

        const properties = require(`./commands/${file}`);

        client.commands.set(properties.config.name, properties);

        properties.config.aliases.forEach(alias => {
            client.aliases.set(alias, properties.config.name);
        });
    });
});

fs.readdir("./NLUCommands/", async (err, files) => {
    if (err) return console.error(err);

    files.forEach(file => {
        if (!file.endsWith('js')) return;

        const properties = require(`./NLUCommands/${file}`);

        client.nlucommands.set(properties.config.name, properties);
    });
});

fs.readdir('./events/', async (err, files) => {
    if (err) return console.error(err);

    files.forEach(file => {
        if (!file.endsWith('js')) return;

        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];

        client.on(eventName, event.bind(null, client));
    });
});


console.log(`Initializing NLU Manager`);
NLU.init();

client.login(token);