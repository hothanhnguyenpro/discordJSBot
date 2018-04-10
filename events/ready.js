const   func = require('../func/propFunctions'),
        log = require('../enum/consoleLogging'),
        twitch = require('../getters/twitchGetter');

module.exports = client => {

    settings = require('../config.json');

    //Sets a default channel and creates a timestamp from that
    const channel = client.channels.get('411571330585067530');
    const date = new Date(channel.createdTimestamp);

    //Sets the activity of the bot
    client.user.setActivity(settings.botActivity);

    //Start of initialization logging
    log.splitter('Init Bot');
    log.success(`I am ${client.user.tag} and I'm ready to be of use :) `);
    log.success(`My activity is currently set to be: ${settings.botActivity}`);
    log.success(`Currently residing in ${client.guilds.size} servers: `);
    client.guilds.map( (g) => log.success(`${g.name} Created at: ${g.createdAt} Owned by: ${g.owner.user.tag}`));

    //Just a dirty linebreak
    console.log();

    //Start of error Checking on storage
    log.splitter('Error Checking');
        //Checks Storage
        func.checkDirectory("./storage/", function(err) {
            if(err) {
                log.error("Something went wrong: ",err);
            } else {
                log.success("No errors detected and I am good to go.\n");
            }
        });
        //Checks Config
        func.checkDirectory("./config/", function(err) {
            if(err) {
                log.error("Something went wrong: ",err);
            } else {
                log.success("No errors detected and I am good to go.\n");
            }
        });
        setTimeout(function() {
            log.splitter('Populated Directories');
            //Checks Storage Directories for JSON files
            func.checkAllDeps("./storage/defaultTwitch.json");
            func.checkAllDeps("./storage/clientLog.json");
            func.checkAllDeps("./storage/playlist.json");
            func.checkAllDeps("./storage/suggestionBox.json");
            func.checkAllDeps("./storage/twitterFolk.json");
            //Checks Config Directories for JSON files
            func.constructServerSetting("./config/serverSettings.json", client)
            
        }, 50);
    //End of error checking on storage

        setTimeout(function() {
            func.constructConfig("./config.json");
        }, 85)

        setTimeout(function() {
            console.log();
            log.splitter("Starting normal usage logging");            
        }, 120);

    /////////////
    //  ####   //
    // Modules //
    //  ####   //
    /////////////

    //Twitch module
    let timerTime = 1;

    let calced_time = (1 * 1000) * 60;

    //setInterval(twitch(msg,'16964788'), calced_time);
}