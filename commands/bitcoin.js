const { RichEmbed } = require("discord.js");
const request = require("request");

const { colours } = require("../config.json");

module.exports.run = async (client, message, args) => {
    request("https://blockchain.info/ticker", (err, resp, body) => {
        request("https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday", (err1, resp1, body1) => {
            if (err && resp.statusCode !== 200) {
                return message.channel.send(
                    new RichEmbed()
                        .setDescription("The API we use to get this information cannot be reached.")
                        .setColor(colours.FAIL)
                        .setTimestamp()
                );
            }
            if (err1 && resp1.statusCode !== 200) {
                return message.channel.send(
                    new RichEmbed()
                        .setDescription("The API we use to get this information cannot be reached.")
                        .setColor(colours.FAIL)
                        .setTimestamp()
                );
            }

            try {
                body = JSON.parse(body);
                body1 = JSON.parse(body1);
            } catch (e) {
                console.error(e);
            }

            const objKeys = Object.keys(body);
            const objValues = Object.values(body1.bpi);

            let msg = "";

            for (let i = 0; i < objKeys.length; i++) {
                msg += `**${objKeys[i]}**: ${body[objKeys[i]].last.toLocaleString()} ${body[objKeys[i]].symbol}\n`;
            }

            const change =
                (body["USD"].last - objValues[0])
                / ((body["USD"].last + objValues[0]) / 2)
                * 100;

            return message.channel.send(
                new RichEmbed()
                    .setTitle(`Exchange rate for BTC in ${objKeys.length} currencies`)
                    .setDescription(msg)
                    .setColor(colours.BLURPLE)
                    .setFooter(`${change.toFixed(2)}% change since yesterday.`)
                    .setTimestamp()
            );
        });
    });
}

module.exports.config = {
    name: "bitcoin",
    aliases: ["btc", "btcprice"],
    permLevel: 0,
    params: []
}