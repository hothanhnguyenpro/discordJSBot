const   logging = require('../enum/logging'),
        log = require('../enum/consoleLogging'),
        func = require('../func/propFunctions'),
        m = require('chalk');

module.exports = (message) => {
    const settings = require('../config.json');
    const client = message.client;

    var command_success = client.emojis.find("name", "white_check_mark");
    var command_fail = client.emojis.find("name", "negative_squared_cross_mark");

    if(client.emojis.find("name", "command_successful")) command_success = client.emojis.find("name", "command_successful");
    if(client.emojis.find("name", "command_failed")) command_fail = client.emojis.find("name", "command_failed");

    if (message.author.bot) return;
    serverSettings = func.readFromFileSync('./config/serverSettings.json');
    let prefix = '';
    
    if(!message.guild) {
        prefix = settings.prefix;
    } else {
        prefix = serverSettings[message.guild.id]['configs'].prefix;
    }

    if(message.mentions.members != null) {
        let member = message.mentions.members.first();
        if(member){
        if(member.id == client.user.id){
            message.react('❓');
        }}
    }
    
    logging(message);
    if (!message.content.startsWith(prefix)) return;

    const command = message.content.split(' ')[0].slice(prefix.length).toLowerCase();
    const params = message.content.split(' ').slice(1);

    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        let permLevel,
            enabled,
            response;

        updateServerSettings(serverSettings, cmd, client);

        if(!message.guild) {
            enabled = cmd.conf.enabled;
            permLevel = cmd.conf.permLevel;
            response = message.author;
        } else {
            enabled = serverSettings[cmd.help.name]['guilds'][message.guild.id]['conf'].enabled;
            permLevel = serverSettings[cmd.help.name]['guilds'][message.guild.id]['conf'].permLevel;
            response = message.channel;
        }
        if(!enabled) return response.send('This command has been disabled by an admin on this server');
        if(cmd.conf.guildOnly && !message.guild) return response.send('This command only works in a server');
        if(permLevel > 0) {message.react('🔒');return response.send('You do not have the permissions to do this')}
        cmd.run(client, message, params, command_success, command_fail);
        let guildName = ``;
        let channelName = `a private message`;
        if(message.guild) guildName = `on ${m.cyan.bold(message.guild.name)}`;
        if(message.channel.name) channelName = message.channel.name;
        log(`${m.cyan.bold(cmd.help.name)} command used by ${m.cyan.bold(message.author.tag)} in ${m.cyan.bold(channelName)} ${guildName}`);
        //message.react(command_success);
        delete serverSettings;
    }
}

function updateServerSettings(serverSettings, cmd, client) {
    if(!serverSettings[cmd.help.name]) {
        if(!serverSettings[cmd.help.name]) {
            serverSettings[cmd.help.name] = { 'command_Name' : cmd.help.name };
            serverSettings[cmd.help.name]['guilds'] = new Object;
            client.guilds.map((g) => {
                serverSettings[cmd.help.name][`guilds`][g.id] = { 'guild_Name' : g.name }
                serverSettings[cmd.help.name][`guilds`][g.id]['conf'] = new Object;
                serverSettings[cmd.help.name][`guilds`][g.id]['conf'] = {
                    'enabled' : cmd.conf.enabled,
                    'perm_Level' : cmd.conf.permLevel,
                    'custom_Text' : 'custom'
                }
            });
        }
        func.writeToFileSync('./config/serverSettings.json',func.beautifyJSON(serverSettings));
    }
}