const Discord = require('discord.js');
const { missingPerms, hasPerms } = require('../../Util/missingPerms.js');
const { formatTime } = require('../../Util/utils.js');

module.exports.run = async(bot, message, prefix) => {

    const args = message.content.slice(bot.config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    let command;

    if(bot.commands.has(commandName))
        command = bot.commands.get(commandName);
    else if(bot.aliases.has(commandName))
        command = bot.commands.get(bot.aliases.get(commandName));
    else 
        return;// console.log("Unknown command");
    
    const permArr = command.config.cmdPerms;
    const cmdName = command.config.command;

    if(message.channel.type != "dm"){
        if(!message.guild.me.hasPermission('SEND_MESSAGES')) 
            return console.log("No SEND_MESSAGES Permission - ", message.guild.name);

        if(permArr){
            const hasEmbedPerm = message.guild.me.permissionsIn(message.channel.id).has('EMBED_LINKS');
            if(!hasPerms(message, permArr, 'role')) 
                return missingPerms(cmdName, message, permArr, 'role', hasEmbedPerm);
            if(!hasPerms(message, permArr, 'channel')) 
                return missingPerms(cmdName, message, permArr, 'channel', hasEmbedPerm)
        }
    }

    if(command.config.args && !args.length) {
        let reply = `You didn\'t provide enough arguments for that command, ${message.author}`;
        if(command.config.usage)
            reply += `\nThe proper usage would be: \`\`\`\n${prefix}${command.config.command} ${command.config.usage}\`\`\``;

        return message.channel.send(reply);
    }

    if(bot.config.developers.includes(message.author.id)){
        try { command.run(bot, message, args, prefix) } catch(err) { console.log(err) }
        return;
    }

    if(command.config.permission && !message.member.hasPermission(command.config.permission))
        return message.channel.send(`To use command **${command.config.command}** you need ${command.config.permission} permission.`);

        
    //----------------------------------------------------------------------------------
    //-----------------------------------COOLDOWN---------------------------------------
    roles:
    if(command.config.roles){
        for(let roleID of command.config.roles){
            for(let userRole of message.member.roles.cache.array()){
                if(roleID == userRole.id){
                    break roles;//do nothing this is work around so if you dont have the role you dont get the cooldown
                }
            }
        }
        return message.channel.send(bot.embed(`To use this command you need one of the following roles: **${command.config.roles.map(id => message.guild.roles.resolve(id).name).join(', ')}**`))
    }

    if(!bot.cooldowns.has(command.config.command))
        bot.cooldowns.set(command.config.command, new Discord.Collection());

    const now = Date.now();
    const timestamps = bot.cooldowns.get(command.config.command);
    const cooldownAmount = (command.config.cooldown || 0) * 1000;

    if(timestamps.has(message.author.id)) {
        const expDate = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expDate){
            const timeLeft = expDate - now;
            const embed = new Discord.MessageEmbed()
                .setTitle("You're on cooldown")
                .setDescription(`You can use this command in **${formatTime(timeLeft)}**`)
                .setColor('RANDOM');

            return message.channel.send(embed);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    if(command.config.roles)
        for(let roleID of command.config.roles)
            for(let userRole of message.member.roles.cache.array())
                if(roleID == userRole.id)
                    try { return command.run(bot, message, args) } catch (err) { return console.log("Unknown error", command.config.command) }

    //======================================================================
    try { 
        command.run(bot, message, args, prefix); 
    } catch (err) { 
        console.log("Unknown error", command.config.command); 
        message.channel.send("Unknown error"); 
    }
    //======================================================================
};