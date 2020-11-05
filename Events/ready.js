const { MessageEmbed } = require("discord.js");

let interval;

module.exports = async (bot, update) => {
    bot.user.setActivity(bot.config.activity, { type: 'PLAYING'}).catch(console.error);

    bot.monitored = bot.vc.voice.map(id => bot.channels.resolve(id))
    console.log(bot, update)
    if(update)
        clearInterval(interval);

    interval = setInterval(() => {
        let embed = new MessageEmbed()
            .setTitle('Attendance')
            .setColor('RANDOM');

        for(let vc of bot.monitored){
            embed.addField(vc.name, vc.members.map(m => m.user.username).join(', ') || 'none', true);
        }

        if(bot.vc.log)
            bot.channels.resolve(bot.vc.log).send(embed);
    }, bot.vc.time)
    
    if(!update)
        console.log('Bot is Online')
};

