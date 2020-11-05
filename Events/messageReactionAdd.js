module.exports = async (bot, reaction, user) => {
    
    if (reaction.partial)
		try { await reaction.fetch() } catch (error) { return console.log('Something went wrong when fetching the message: ', error) }
    
    if(user.bot)
        return;
    
};

