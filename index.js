const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');

bot.vc = JSON.parse(fs.readFileSync('./Storage/voiceChannels.json'));
bot.config = require('./Config.json');
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.cooldowns = new Discord.Collection();

require('./Handlers/Commands.js')(bot);
require('./Handlers/Events.js')(bot);

bot.embed = (m) => {
    return new Discord.MessageEmbed()
        .setDescription(m)
        .setColor('RANDOM');
}

bot.login(bot.config.token);