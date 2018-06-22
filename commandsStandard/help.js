const   func = require('../func/propFunctions'),
        log = require('../enum/consoleLogging'),
        //Node Modules
        _ = require('lodash');

exports.run = (client, message, params, command_success, command_fail) => {

   //constrHelp(client, message, params, command_success, command_fail);
   if(params == false) {
       this.default(client,message);
   } else {
       constrHelp(client,message,params,command_success, command_fail);
   }
}

exports.default = (client, message) => {

    const categoryNames = Array.from(client.commandCategoriesCollection.keys());
    const longest = categoryNames.reduce((long, str) => Math.max(long, str.length), 0);

    constr = `= Command Categories List =
\nThis here lists all the commands based on categories, to see the commands within a category, click the reaction below this message corresponding to the category number.\n`;

    client.commandCategoriesCollection.map(c => {
        constr += `\n${c.iteration+1}). ${c.key}${' '.repeat(longest - c.key.length)} :: ${c.define}`;
    })
    message.channel.send(constr, { code: 'asciidoc' })
    .then(async message => {
        await message.react("1⃣").catch(error => {});
        await message.react("2⃣").catch(error => {});
        await message.react("3⃣").catch(error => {});
        await message.react("4⃣").catch(error => {});
    })
}

exports.category = (client, message, category) => {
    constrCategory(client,message,category);
}

function constrCategory(client, message, category) {
    const   settings = require('../config.json'),
    serverSettings = func.readFromFileSync('./config/serverSettings.json');

    prefix = settings.prefix;
    if(message.guild) prefix = serverSettings[message.guild.id]['configs'].prefix;

    const commandNames = Array.from(client.commands.keys());
    enabledCommands = `= Enabled Commands =`;
    disabledCommands = `\n= Disabled Commands =`;
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    client.commands.map(
        (c) => {
            if(c.conf.category == category) {
                if(!message.guild) {
                    disabledCommands =``;
                    return enabledCommands += `\n${prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`;
                }
                if(!serverSettings[c.help.name]['guilds'][message.guild.id]['conf'].enabled) {
                    disabledCommands += `\n${prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`;
                } else {
                    enabledCommands += `\n${prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`;
                }
            }
        }
    );

    if(message.author.id != client.id) {
        message.channel.send(`= Command List =\n\n[Use ${prefix}help <commandname> for details]\n\n${enabledCommands} \n${disabledCommands}`, { code: 'asciidoc' })
    } else {
        message.edit(`= Command List =\n\n[Use ${prefix}help <commandname> for details]\n\n${enabledCommands} \n${disabledCommands}`, { code: 'asciidoc' });
    }
    
}

function constrHelp(client, message, params, command_success, command_fail) {
    let command = params[0],
        to_show = params[1];

cat = command[0].toUpperCase() + command.slice(1).toLowerCase();

if(client.commandCategories.includes(cat)) {
    return constrCategory(client, message, cat);
}

if (client.commands.has(command)) {
    command = client.commands.get(command);
    let aliases = command.conf.aliases;

    if(to_show && to_show == 'show') 
    {
        message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\nusable in guild only:: ${command.conf.guildOnly}\naliases:: ${aliases}`, { code: 'asciidoc' })
        .then(() => message.react(command_success))
        .catch(err => {log.error(err); message.react(command_fail)});
    } else {
        message.author.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\nusable in guild only:: ${command.conf.guildOnly}\naliases:: ${aliases}`, { code: 'asciidoc' })
        .then(() => message.react(command_success))
        .catch(err => {log.error(err); message.react(command_fail)});
    }
            
    } else if (!client.commands.has(command)) {
        message.react(command_fail);
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h', 'halp', 'help', 'ineedanadult'],
    permLevel: 0,
    category: func.getDirForCategory(__dirname)
}

exports.help = {
    name: 'help',
    description: 'Displays all the available commands',
    usage: 'help <command> <show (to show it in channel, only works on specific commands)>'
}