const Discord = require("discord.js");
const request = require("request-promise");

const { colours } = require("../config.json")
const { api_keys } = require("../config.json");

const langs = {
    "af": "Afrikaans",
    "am": "Amharic",
    "ar": "Arabic",
    "az": "Azerbaijani",
    "ba": "Bashkir",
    "be": "Belarusian",
    "bg": "Bulgarian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "cs": "Czech",
    "cy": "Welsh",
    "da": "Danish",
    "de": "German",
    "el": "Greek",
    "en": "English",
    "eo": "Esperanto",
    "es": "Spanish",
    "et": "Estonian",
    "eu": "Basque",
    "fa": "Persian",
    "fi": "Finnish",
    "fr": "French",
    "ga": "Irish",
    "gd": "Scottish Gaelic",
    "gl": "Galician",
    "gu": "Gujarati",
    "he": "Hebrew",
    "hi": "Hindi",
    "hr": "Croatian",
    "ht": "Haitian",
    "hu": "Hungarian",
    "hy": "Armenian",
    "id": "Indonesian",
    "is": "Icelandic",
    "it": "Italian",
    "ja": "Japanese",
    "jv": "Javanese",
    "ka": "Georgian",
    "kk": "Kazakh",
    "km": "Khmer",
    "kn": "Kannada",
    "ko": "Korean",
    "ky": "Kyrgyz",
    "la": "Latin",
    "lb": "Luxembourgish",
    "lo": "Lao",
    "lt": "Lithuanian",
    "lv": "Latvian",
    "mg": "Malagasy",
    "mhr": "Mari",
    "mi": "Maori",
    "mk": "Macedonian",
    "ml": "Malayalam",
    "mn": "Mongolian",
    "mr": "Marathi",
    "mrj": "Hill Mari",
    "ms": "Malay",
    "mt": "Maltese",
    "my": "Burmese",
    "ne": "Nepali",
    "nl": "Dutch",
    "no": "Norwegian",
    "pa": "Punjabi",
    "pap": "Papiamento",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "si": "Sinhalese",
    "sk": "Slovak",
    "sl": "Slovenian",
    "sq": "Albanian",
    "sr": "Serbian",
    "su": "Sundanese",
    "sv": "Swedish",
    "sw": "Swahili",
    "ta": "Tamil",
    "te": "Telugu",
    "tg": "Tajik",
    "th": "Thai",
    "tl": "Tagalog",
    "tr": "Turkish",
    "tt": "Tatar",
    "udm": "Udmurt",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "zh": "Chinese"
}

module.exports.run = async (client, message, args) => {
    let lang = args[this.config.params[0].name];
    const text = args[this.config.params[1].name];

    if(langs[lang.toLowerCase()]) lang = lang.toLowerCase();
    else {
        let x = Object.keys(langs).find(y => langs[y].toLowerCase() === lang.toLowerCase());
        if(x) {
            lang = x;
        } else {
            return message.channel.send(`Invalid language`);
        }
    }

    message.channel.send("Detecting language...").then(msg => {
        request({
            uri: `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${api_keys.yandex_api_key}&text=${encodeURI(text)}`,
            json: true
        }).then(language => {
            msg.edit(`Detected language... ${language.lang}`)

            request({
                uri: `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${api_keys.yandex_api_key}&text=${encodeURI(text)}&lang=${language.lang}-${encodeURI(lang)}&format=html`,
                json: true
            }).then(data => {
                msg.edit(data.text);
            })
        })
    })
}

module.exports.config = {
    name: "translate",
    aliases: [],
    permLevel: 0,
    params: [
        {
            name: "from",
            required: true,
            multiword: false
        },
        {
            name: "text",
            required: true,
            multiword: true
        }
    ]
}