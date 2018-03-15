const   Discord = require('discord.js'),
        embed = require('../model/embeds');

exports.run = (client, message) => {

    message.channel.send("Fetching Developer list...")
    .then(msg => {

        msg.edit(embed.RichEmbed(
            null,
            ['Developer list'],
            ['I were created by these lovely people over at the L&B server', `🔹@DaizNaew - Main Developer \n🔸@THICCBOI - Trusty Partner In Science`]
        ));
    })
    .catch(error => {
        message.channel.send('Something went wrong inside me. 😞 : \n '+ error);
    });
    
}

exports.conf = {
   enabled: true,
   guildOnly: false,
   aliases: ['Dev', 'Devs', 'devs', 'credits', 'Credits'],
   permLevel: 0
}

exports.help = {
   name: 'dev',
   description: 'Lists who made this bot',
   usage: 'dev'
}
