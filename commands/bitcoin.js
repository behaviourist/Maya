const Discord = require("discord.js");
const request = require("request");

module.exports.run = async (client, message, args) => {
    request("https://blockchain.info/ticker", (err, resp, body) => {
        request("https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday", (err1, resp1, body1) => {
            if (err && resp.statusCode !== 200) return;
            if (err1 && resp1.statusCode !== 200) return;

            try {
                body = JSON.parse(body);
                body1 = JSON.parse(body1);
            } catch (e) {
                console.error(e);
            }

            const objKeys = Object.keys(body);
            const objValues = Object.values(body1.bpi);

            const embed = new Discord.RichEmbed()
                .setTitle(`Exchange rate for BTC in ${objKeys.length} currencies`)
                .setColor("BLUE");

            let msg = "";

            for (let i = 0; i < objKeys.length; i++) {
                msg += `**${objKeys[i]}**: ${body[objKeys[i]].last.toLocaleString()} ${body[objKeys[i]].symbol}\n`;
            }

            embed.setDescription(msg);

            const change =
                (body["USD"].last - objValues[0])
                / ((body["USD"].last + objValues[0]) / 2)
                * 100;

            embed.setFooter(`${change.toFixed(2)}% change since yesterday.`);
            return message.channel.send(embed);
        });
    });
}

module.exports.config = {
    name: "bitcoin",
    aliases: ["btc", "btcprice"],
    permLevel: 0
}