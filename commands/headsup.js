const Discord = require("discord.js");
const { colours } = require("../config.json");
const { api_keys } = require("../config.json");
const request = require('request');

const newsCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology", "all"];
const newsCountries = ["ae", "ar", "at", "au", "be", "bg", "br", "ca", "ch", "cn", "co", "cu", "cz", "de", "eg", "fr", "gb", "gr", "hk", "hu", "id", "ie", "il", "in", "it", "jp", "kr", "lt", "lv", "ma", "mx", "my", "ng", "nl", "no", "nz", "ph", "pl", "pt", "ro", "rs", "ru", "sa", "se", "sg", "si", "sk", "th", "tr", "tw", "ua", "us", "ve", "za"];
const tempUnits = ["celsius", "fahrenheit", "kelvin"];

module.exports.run = async (client, message, args) => {
	if (client.headsup.get(message.author.id)) {
		const embed = new Discord.RichEmbed()
			.setTitle(`You already have configurations for your heads up.`)
			.setDescription(`Would you like to view these settings or update them?
			\nValid responses: view, update`)
			.setColor(colours.WARNING);
		message.channel.send(embed);

		message.channel.awaitMessages(
			msg => msg.author === message.author,
			{max: 1, time: 60000}
		).then(messages => {
			let response = messages.first().content;

			if(!(response.toLowerCase() === "view" || response.toLowerCase() === "update")) {
				const embed = new Discord.RichEmbed()
					.setTitle(`Invalid response.`)
					.setDescription(`Please choose one of the responses provided in the previous step. Cancelled prompt.`)
					.setColor(colours.FAIL);
				return message.channel.send(embed);
			}

			if(response.toLowerCase() === "view") {
				const data = client.headsup.get(message.author.id);
				const embed = new Discord.RichEmbed()
					.setTitle(`Heads up settings`)
					.setDescription(`
					Weather Location: ${data.weather_address.name} (Lat: ${data.weather_address.lat} | Long: ${data.weather_address.long})
					Temperature Units: ${data.weather_address.units},
					News Category: ${data.news_preference.category},
					News Country: ${data.news_preference.country},
					Reminder about reminders: ${data.reminder_preference}
					`)
					.setColor(colours.BLURPLE);
				return message.channel.send(embed);
			} else if(response.toLowerCase() === "update") {
				settings(false);
			}
		});
	} else settings(true);

	function settings(existing) {
	
		const embed = new Discord.RichEmbed()
			.setDescription(`First, please provide the area that you wish to receive weather data about.
			\nThis can be a city, country, postcode/zipcode or an exact address.
			\nThe data that you provide will be stored in order to get your weather data when you request it.`)
			.setColor(colours.BLURPLE);
		if(existing) embed.setTitle(`It looks like you don't have any heads up configurations. Let's help you get them set up.`)
		message.channel.send(embed);

		message.channel.awaitMessages(
			msg => msg.author === message.author,
			{max: 1, time: 60000}
		).then(messages => {
			let addr = messages.first().content;

			message.channel.send(`Searching address...`).then(searchingAddrMsg => {
				request({
					uri: `https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(addr)}&key=${api_keys.opencage_geo}&pretty=1&limit=1&no_annotations=1`
				}, function(err, response, body) {
					if(err) {
						const embed = new Discord.RichEmbed()
							.setTitle(`An unknown error occured.`)
							.setDescription(`Please try again later...`)
							.setColor(colours.FAIL);
						return message.channel.send(embed);
					}

					if(response.statusCode !== 200) {
						const embed = new Discord.RichEmbed()
							.setTitle(`An error occured.`)
							.setDescription(`Please try again later...`)
							.setColor(colours.FAIL);
						return message.channel.send(embed);
						
					}

					let geoData = JSON.parse(body);
					let location = geoData.results[0];
					let weatherObj = {
						name: addr,
						lat: location.geometry.lat,
						long: location.geometry.lng
					}
					
					const embed = new Discord.RichEmbed()
						.setTitle(`Successfully found address!`)
						.setDescription(`We have found the geo coordinates for the closest match of the address provided.
						\nNext, what unit would you like your temperature in?
						\nValid responses: ${tempUnits.map(unit => {return `\`${unit}\``})}`)
						.setColor(colours.SUCCESS);
					searchingAddrMsg.edit(embed);

					message.channel.awaitMessages(
						msg => msg.author === message.author,
						{max: 1, time: 60000}
					).then(messages => {
						const tempUnit = messages.first().content;

						if(!tempUnits.includes(tempUnit.toLowerCase())) {
							const embed = new Discord.RichEmbed()
								.setTitle(`Invalid temperature unit.`)
								.setDescription(`Please choose one of the temperature units provided in the previous step. Cancelled prompt.`)
								.setColor(colours.FAIL);
							return message.channel.send(embed);
						}

						weatherObj.units = tempUnit.toLowerCase();

						const embed = new Discord.RichEmbed()
							.setTitle(`Successfully found temperature!`)
							.setDescription(`Next, what type of news would you like to hear about?
							\nValid responses: ${newsCategories.map(cat => {return `\`${cat}\``})}`)
							.setColor(colours.SUCCESS);
						message.channel.send(embed);
						message.channel.awaitMessages(
							msg => msg.author === message.author,
							{max: 1, time: 60000}
						).then(messages => {
							let newsCategory = messages.first().content;

							if(!newsCategories.includes(newsCategory.toLowerCase())) {
								const embed = new Discord.RichEmbed()
									.setTitle(`Invalid news category.`)
									.setDescription(`Please choose one of the categories provided in the previous step. Cancelled prompt.`)
									.setColor(colours.FAIL);
								return message.channel.send(embed);
							}

							const embed = new Discord.RichEmbed()
								.setTitle(`Successfully found news category!`)
								.setDescription(`Next, which region do you want to hear news about?
								\nYou can find a list of 2-letter ISO 3166-1 country codes [here](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)
								\nValid responses: ${newsCountries.map(country => {return `\`${country}\``})}`)
								.setColor(colours.SUCCESS);
							message.channel.send(embed);
							message.channel.awaitMessages(
								msg => msg.author === message.author,
								{max: 1, time: 60000}
							).then(messages => {
								let newsCountry = messages.first().content;
								let newsData = {
									category: newsCategory.toLowerCase(),
									country: newsCountry.toLowerCase()
								}

								if(!newsCountries.includes(newsCountry.toLowerCase())) {
									const embed = new Discord.RichEmbed()
										.setTitle(`Invalid news country.`)
										.setDescription(`Please choose one of the countries provided in the previous step. Cancelled prompt.`)
										.setColor(colours.FAIL);
									return message.channel.send(embed);
								}

								const embed = new Discord.RichEmbed()
									.setTitle(`Successfully found news country!`)
									.setDescription(`Next, would you like me to notify you of your reminders in your heads up?
									\nValid responses:\nyes, no`)
									.setColor(colours.SUCCESS);

								message.channel.send(embed);
								message.channel.awaitMessages(
									msg => msg.author === message.author,
									{max: 1, time: 60000}
								).then(messages => {
									let reminders = messages.first().content;

									if(!(reminders.toLowerCase() === "yes" || reminders.toLowerCase() === "no")) {
										const embed = new Discord.RichEmbed()
											.setTitle(`Invalid response.`)
											.setDescription(`Please choose yes or no. Cancelled prompt.`)
											.setColor(colours.FAIL);
										return message.channel.send(embed);
									}

									reminders.toLowerCase() === "yes" ? reminders = true : reminders = false;

									client.headsup.set(message.author.id, weatherObj, "weather_address");
									client.headsup.set(message.author.id, newsData, "news_preference");
									client.headsup.set(message.author.id, reminders, "reminder_preference");

									const embed = new Discord.RichEmbed()
										.setTitle(`Successfully saved your preferences.`)
										.setDescription(`To get your heads up, simply ping ${client.user} and ask for your heads up or ask what your day is going to be like today.
										\nMaya uses Natural Language Processing to attempt to understand when you want your heads up.`)
										.setColor(colours.SUCCESS);
									return message.channel.send(embed);
								});
							});
						});
					});
				});
			});
		});
	}
}

module.exports.config = {
	name: "headsup",
	aliases: ["headsup"],
	permLevel: 0,
	params: []
}