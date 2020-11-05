const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {

    //Code Start
    let channel = message.mentions.channels.first() || message.channel;

    bot.vc.log = channel.id;
    fs.writeFileSync('./Storage/voiceChannels.json', JSON.stringify(bot.vc, null, 4));
    message.channel.send(bot.embed('Channel set!'))
    bot.emit('ready', (true))
	//Code End

}

module.exports.config = {
    cmdPerms: ["EMBED_LINKS"],
    usage: "<#channel>", //if args is set to false you can remove this otherwise describe how to use the command
    command: "logchannel",
    cooldown: 5, //Cooldown in seconds
	args: false //If the command requires input aka if you need to write just the command name or command name with some more arguments/fields
}