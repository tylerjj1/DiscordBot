const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {

    //Code Start
    let ids = args.filter(id => bot.channels.cache.has(id));
    ids = ids.filter(id => !bot.vc.voice.includes(id))
    if(!ids.length)
        return message.channel.send(bot.embed('Already monitoring or invalid ID'))
    bot.vc.voice.push(...ids);
    bot.monitored = bot.vc.voice.map(id => bot.channels.resolve(id))
    fs.writeFileSync('./Storage/voiceChannels.json', JSON.stringify(bot.vc, null, 4));
    message.channel.send(bot.embed('Monitoring `' + ids.map(id => bot.channels.resolve(id).name).join(', ') + '` channels'));

    bot.emit('ready', (true))
	//Code End

}

module.exports.config = {
    cmdPerms: ["EMBED_LINKS"],
    usage: "[vc ID 1] <vc ID 2> <vc ID n>", //if args is set to false you can remove this otherwise describe how to use the command
    command: "monitor",
    cooldown: 5, //Cooldown in seconds
	args: true //If the command requires input aka if you need to write just the command name or command name with some more arguments/fields
}