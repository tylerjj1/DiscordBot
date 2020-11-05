const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {

    //Code Start
    let time = parseFloat(args[0]);

    if(isNaN(time))
        return message.channel.send(bot.embed('Time is not a number'));

    bot.vc.time = time * 60 * 1000;
    fs.writeFileSync('./Storage/voiceChannels.json', JSON.stringify(bot.vc, null, 4));
    message.channel.send(bot.embed('Time set!'));
    bot.emit('ready', (true))
	//Code End

}

module.exports.config = {
    cmdPerms: ["EMBED_LINKS"],
    usage: "[time in minutes]", //if args is set to false you can remove this otherwise describe how to use the command
    command: "settime",
    cooldown: 5, //Cooldown in seconds
	args: true //If the command requires input aka if you need to write just the command name or command name with some more arguments/fields
}