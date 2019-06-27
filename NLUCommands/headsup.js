const Discord = require("discord.js");
const { colours } = require("../config.json");
const { api_keys } = require("../config.json");
const request = require('request');

module.exports.run = async (client, message, args) => {
	let data = client.headsup.get(message.author.id);
	
	if(!data) {
		const embed = new Discord.RichEmbed()
			.setTitle(`You don't have any heads up configurations.`)
			.setDescription(`If you would like to set up your heads up configuration, use the command ${client.config.get(message.guild.id).prefix}headsup`)
			.setColor(colours.FAIL)
		return message.channel.send(embed);
	}

	request({
		uri: `https://newsapi.org/v2/top-headlines?country=${data.news_preference.country}${data.news_preference.category !== 'all' ? `&category=${data.news_preference.category}` : ''}&apiKey=${api_keys.news}`,
		json: true
	}, function(err, response, body) {
		if(err) {
			console.log(err);
			return message.channel.send(`Sorry, an unknown error occured when preparing your heads up data.`);
		}

		if(response.statusCode !== 200) {
			console.log(response.statusCode, body);
			return message.channel.send(`Sorry, an error occured when preparing your heads up data.`);
		}

		let articles = [body.articles[0], body.articles[1]];

		request({
			uri: `https://api.openweathermap.org/data/2.5/forecast?lat=${data.weather_address.lat}&lon=${data.weather_address.long}${data.weather_address.units === 'celsius' ? '&units=metric' : data.weather_address.units === 'fahrenheit' ? '&units=imperial' : ''}&APPID=${api_keys.weather}`,
			json: true
		}, function(err, response, body) {
			if(err) {
				console.log(err);
				return message.channel.send(`Sorry, an unknown error occured when preparing your heads up data.`);
			}
	
			if(response.statusCode !== 200) {
				console.log(response.statusCode, body);
				return message.channel.send(`Sorry, an error occured when preparing your heads up data.`);
			}

			let startTemp = body.list[0];
			let endTemp = lastOfDay(body.list);

			let lowest;
			let highest;

			if(endTemp) {
				lowest = startTemp.main.temp_min < endTemp.main.temp_min ? startTemp.main.temp_min : endTemp.main.temp_min	
				highest = startTemp.main.temp_max > endTemp.main.temp_max ? startTemp.main.temp_max : endTemp.main.temp_max
			}

			const embed = new Discord.RichEmbed()
				.setTitle(`Here is your heads up for today!`)
				.setDescription(`Take a read of these two articles recently published based on your preferences.
				\n[${articles[0].title}](${articles[0].url})
				\n[${articles[1].title}](${articles[1].url})
				\nThe weather appears to be ${body.list[0].weather[0].main}, ${body.list[3].weather[0].main !== body.list[0].weather[0].main ? `and turning to ${body.list[3].weather[0].main} at around ${new Date(body.list[3].dt).getUTCHours()}:${new Date(body.list[3].dt).getUTCMinutes()} UTC` : `and staying like this until later today.`}
				\nIt is currently ${Math.round(startTemp.main.temp)}${getUnit(data.weather_address.units)} ${lowest && highest ? `with a low of ${Math.round(lowest)}${getUnit(data.weather_address.units)} and a high of ${Math.round(highest)}${getUnit(data.weather_address.units)}` : ''}`)
				.setColor(colours.SUCCESS);
			return message.channel.send(embed);
		});
	});
}

function lastOfDay(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let val = arr[i];
        let stamp = new Date(val.dt * 1000);
        let today = new Date();

        if (stamp.toDateString() == today.toDateString()) {
            return val;
        }
    }
}

function getUnit(unit) {
	return unit === 'celsius' ? '°C' : unit === 'fahrenheit' ? '°F' : unit === 'kelvin' ? 'K' : '';
}

module.exports.config = {
	name: "headsup",
	permLevel: 0,
	params: []
}