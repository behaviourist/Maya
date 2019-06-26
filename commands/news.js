const NewsAPI = require("newsapi");
const { RichEmbed } = require("discord.js");

const { api_keys } = require("../config.json");
const api = new NewsAPI(api_keys.news);

const { colours } = require("../config.json");

module.exports.run = async (client, message, args) => {
    const query = args[this.config.params[0].name];
    if (!query) {
        return message.channel.send(
            new RichEmbed()
                .setDescription("You must provide a query in order to find news.")
                .setColor(colours.FAIL)
                .setTimestamp()
        );
    }

    api.v2.topHeadlines({
        q: query
    }).then(resp => {
        if (resp.articles.length === 0 || !resp.articles) {
            return message.channel.send(
                new RichEmbed()
                    .setDescription("We couldn't find any articles related to your query.")
                    .setColor(colours.FAIL)
                    .setTimestamp()
            );
        }

        let articles = "";

        for (let i = 0; i < resp.articles.length; i++) {
            articles += `${i + 1}) ${resp.articles[i].title}\n`
        }

        message.channel.send(
            new RichEmbed()
                .setDescription(`I have found ${resp.articles.length} articles for \`${query}\`. Which would you like to see?\n\n\`\`\`${articles}\`\`\``)
                .setColor(colours.SUCCESS)
        );

        message.channel.awaitMessages(
            m => m.author === message.author,
            { max: 1, time: 60000 }
        ).then(collected => {
            const articleNumber = parseInt(collected.first().content);

            if (articleNumber > resp.articles.length || articleNumber < 1) {
                return message.channel.send(
                    new RichEmbed()
                        .setDescription("You entered a number out of the range of articles.")
                        .setColor(colours.FAIL)
                        .setTimestamp()
                );
            } else articleNumber;

            const article = resp.articles[articleNumber - 1];

            return message.channel.send(
                new RichEmbed()
                    .setTitle(article.title)
                    .setAuthor(`${article.author} | ${article.source.name}`)
                    .setURL(article.url)
                    .setDescription(`${article.content.split("[+")[0]}\n\n**Please press the title to see more information on this article.**`)
                    .setThumbnail(article.urlToImage)
                    .setColor(colours.BLURPLE)
                    .setFooter("Powered by NewsAPI.org")
                    .setTimestamp()
            );
        }).catch(err => {
            return message.channel.send(
                new RichEmbed()
                    .setDescription("Invalid choice, try again.")
                    .setColor(colours.FAIL)
                    .setTimestamp()
            );
        });
    }).catch(err => {
        return message.channel.send(
            new RichEmbed()
                .setDescription("Sorry, we had a server-side error.")
                .setColor(colours.FAIL)
                .setTimestamp()
        );
    });
}

module.exports.config = {
    name: "news",
    aliases: [],
    permLevel: 0,
    params: [
        {
            name: "query",
            required: true,
            multiword: true
        }
    ]
}