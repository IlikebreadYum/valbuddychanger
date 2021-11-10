console.clear();

const valapi = require('./valapi');
const inquirer = require('inquirer');
const axios = require('axios');
const fuzzy = require('fuzzy');
const fs = require('fs');


var client = new valapi.LocalClient();
var buddyManager = new valapi.BuddyManager();
var weaponManager = new valapi.WeaponManager();
var configManager = new valapi.ConfigManager();



function searchBuddyList(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
            var fuzzyResult = fuzzy.filter(input, buddyManager.returnNameList());
            const results = fuzzyResult.map(function (el) {
                return el.original;
            });

            results.splice(5, 0, new inquirer.Separator());
            results.push(new inquirer.Separator());
            resolve(results);
        });
}

(async()=>{
    await configManager.getConfig(buddyManager, weaponManager);

    var gunsWithCharms = [];
    var playerLoadout;
    await client.init('na');
    await client.fetchPlayerLoadout().then(function (loadout) {
        playerloadout = loadout;
        for(i of loadout.Guns) {
            if(i.CharmID){
                gunsWithCharms.push(weaponManager.fetchById(i.ID))
            }
        }
    });

    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
    questions = [];

    for (i in gunsWithCharms) {
        questions.push({
            type: "autocomplete",
            name: gunsWithCharms[i].name,
            message: `Pick buddy for ${gunsWithCharms[i].name}`,
            pageSize: 10,
            searchText: "Searching...",
            emptyText: "Nothing Found!",
            source: searchBuddyList
        });
    }

    inquirer.prompt(questions).then((answers)=>{
        for(i in answers){
            playerloadout.Guns.find(e => e.ID == weaponManager.fetchByName(i).id).CharmID = buddyManager.fetchByName(answers[i]).id
            
        }
        client.updatePlayerLoadout(playerloadout);
        console.clear();
    });
})()
