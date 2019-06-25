const NewsAPI = require("newsapi");
const Discord = require("discord.js");

const { api_keys } = require("../config.json");
const api = new NewsAPI(api_keys.news_api_key);

module.exports.run = async (client, message, args) => {
    const query = args.join(" ");
    if (!query) return message.channel.send("Please provide a query.");

    api.v2.topHeadlines({
        q: query
    }).then(resp => {
        if (resp.articles.length === 0 || !resp.articles) return message.channel.send("No articles were found for that query.");
        let articles = "";

        for (let i = 0; i < resp.articles.length; i++) {
            articles += `${i + 1} ${resp.articles[i].title}\n`
        }

        message.channel.send(`I have found ${resp.articles.length} articles for \`${query}\`. Which would you like to view?\n\n\`\`\`${articles}\`\`\``);

        message.channel.awaitMessages(
            m => m.author === message.author,
            { max: 1, time: 60000 }
        ).then(collected => {
            const articleNumber = parseInt(collected.first().content);

            if (articleNumber > resp.articles.length) return message.channel.send("You entered too large of a number.");
            else if (articleNumber < 1) return message.channel.send("You entered too small of a number.");
            else articleNumber;

            const article = resp.articles[articleNumber - 1];

            return message.channel.send(
                new Discord.RichEmbed()
                    .setTitle(article.title)
                    .setAuthor(`${article.author} | ${article.source.name}`)
                    .setURL(article.url)
                    .setDescription(`${article.content.split("[+")[0]}\n\n**Please press the title to see more information on this article.**`)
                    .setThumbnail(article.urlToImage)
                    .setColor("BLUE")
                    .setFooter("Powered by NewsAPI.org")
            );
        }).catch(console.error);
    }).catch(console.error);
}

module.exports.config = {
    name: "news",
    aliases: [],
    permLevel: 0
}