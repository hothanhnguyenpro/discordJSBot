const fs = require("fs"),
      log = require('../enum/consoleLogging');

module.exports = {
  
    //Standard functions
    arrayifyJSON: function(arrayToJSON) {
        return JSON.parse(arrayToJSON, null, 4);
    },
    beautifyJSON: function(jsonToString){
        return JSON.stringify(jsonToString, null, 4);
    },
    writeToFileAsync: function(file, input) {
        fs.writeFile(file, input, (err) => {
            if (err) console.error(err);
        });
    },
    writeToFileSync: function(file, input) {
        fs.writeFileSync(file, input);
    },
    readFromFileSync: function(file) {
        return JSON.parse(fs.readFileSync(file,'utf8'));
    },
    
    //Function to check if a directory exists
    checkDirectory: function(directory, callback){
        fs.stat(directory, function(err, stats) {
        //Check if error defined and the error code is "not exists"
            if (err && err.errno === -4058) {
                //Create the directory, call the callback.
                fs.mkdir(directory, callback);
            } else {
                //just in case there was a different error:
                callback(err)
            }
        });
    },

    //Function to check if a certain file exists
    checkAllDeps: function(FilePos) {
    
        fs.open(FilePos, 'wx', (err, fd) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    log.success(`${FilePos} already exists and is valid.`);
                    return;
                }
                throw err;
            }
            log.warning(`${FilePos} does not exist, creating it.`);
            this.writeToFileSync(FilePos, " { } ");
            log.success(`Successfully created file at: ${FilePos}`);
        });
    },

    //Function to construct a file for handling server specific settings
    constructServerSetting:function(FilePos, client) {
        fs.open(FilePos, 'wx', (err, fd) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    log.success(`${FilePos} already exists and is valid.`);
                    return true;
                }
                throw err;
            }
            log.warning(`${FilePos} does not exist, creating it.`);
            commandList = new Object;

            client.commands.map((c) => {
                if(!commandList[c.help.name]) {
                    commandList[c.help.name] = { 'command_Name' : c.help.name };
                    commandList[c.help.name]['guilds'] = new Object;
                    client.guilds.map((g) => {
                        commandList[c.help.name][`guilds`][g.id] = { 'guild_Name' : g.name }
                        commandList[c.help.name][`guilds`][g.id]['conf'] = new Object;
                        commandList[c.help.name][`guilds`][g.id]['conf'] = {
                            'enabled' : c.conf.enabled,
                            'perm_Level' : c.conf.permLevel,
                            'custom_Text' : 'custom'
                        }
                    });
                }
            });
            client.guilds.map((g) => {
                commandList[g.id] = new Object;
                commandList[g.id]['configs'] = new Object;
                commandList[g.id]['configs'] = {
                    "prefix": "!",
                    "enable_twitter_module": true,
                    "enable_twitch_module" : true,
                    "enable_imgur_module" : true
                };
            });
            this.writeToFileSync(FilePos,this.beautifyJSON(commandList));
            log.success(`Successfully created file at: ${FilePos}`);
        });
    },

    //Function to construct a standard config
    constructConfig:function(FilePos) {
        fs.open(FilePos, 'wx', (err, fd) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    log.success(`${FilePos} already exists and is valid.`);
                    return true;
                }
                throw err;
            }
            log.warning(`${FilePos} does not exist, creating it.`);
            this.writeToFileSync(FilePos, ` {
                \n"token": "###",
                \n"prefix": "!",
                \n"mprefix": "m",
                \n"ytKey": "###",
                \n"nothing" : 0,
                \n"botActivity": "Being a wee lil bitch",
                \n\n"mysql" : {
                    \n"host": "localhost",
                    \n"user": "none",
                    \n"password": "none",
                    \n"db": "none"
                \n},
                \n\n"twitter_module" : {
                    \n"twitter_consumer_key": "###",
                    \n"twitter_consumer_secret": "###",
                    \n"twitter_access_token_key": "###",
                    \n"twitter_access_token_secret": "###",
                    \n"enable_twitter_module": false,
                    \n"check_reply_to_tweets": false
                    \n},
                \n\n"twitch_module" : {
                    \n"enable_twitch_module": false,
                    \n"twitch_client_id" : "###"
                    \n},
                    \n"imgur_module" : {
                        \n"enable_imgur_module" : false,
                        \n"imgur_client_id" : "###"
                    \n}
                \n} `);
            log.success(`Successfully created file at: ${FilePos}`);
        });

    },

    getDirForCategory:function (directory) {

        fullPath = directory;
        path = fullPath.split("\\");
        cwd = path[path.length-1];
    
        category = cwd.replace('commands','');
    
        if(category == '') category = 'Standard';
        return category;
    
    },
    
    //Function to convert seconds to Hours, Minutes and Seconds and then format it in proper string
    secondsToHms:function (d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "0 minutes";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "0 seconds";
        return hDisplay + mDisplay + sDisplay; 
    }
}