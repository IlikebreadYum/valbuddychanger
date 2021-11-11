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

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

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

function searchGuns(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
            var fuzzyResult = fuzzy.filter(input, weaponManager.weaponsWithCharms.returnNameList());
            const results = fuzzyResult.map(function (el) {
                return el.original;
            });

            results.splice(5, 0, new inquirer.Separator());
            results.push(new inquirer.Separator());
            resolve(results);
        });
}


async function main() {
    gunsWithCharms = [];
    await client.init('na');
    await client.fetchPlayerLoadout().then(function (loadout) {
        playerloadout = loadout;
        for(i of loadout.Guns) {
            if(i.CharmID){
                weaponManager.weaponsWithCharms.addByJSON(weaponManager.fetchById(i.ID), )
            }
        }
    });

    questions = [];

    for (i of weaponManager.weaponsWithCharms.returnNameList()) {
        questions.push({
            type: "autocomplete",
            name: weaponManager.weaponsWithCharms.returnNameList()[i],
            message: `Pick buddy for ${weaponManager.weaponsWithCharms.returnNameList()[i]}`,
            pageSize: 10,
            searchText: "Searching...",
            emptyText: "Nothing Found!",
            source: searchBuddyList
        });
    }

    inquirer.prompt(questions).then((answers)=>{
        for(i in answers){
            playerloadout.Guns.find(e => e.ID == weapons.find(e => e.name == i).id).CharmID = buddies.find(e => e.name == answers[i]).id
            client.updatePlayerLoadout(playerloadout)
        }
    });

}

async function topPrompt(){
    questions = [];
    questions.push({
        "type":"list",
        "name":"command",
        "choices":["Set Specific","Set All","Save"],
        "message":"What would you like to do?"
    })
    inquirer.prompt(questions).then((answers)=>{
        switch (answers.command){
            case "Set Specific":
                specificPrompt();
            break

            case "Set All":
                allPrompt();
            break;

            case "Save":
                save();
            break
        }
    })
}

async function specificPrompt(){
    questions = [];
    weaponManager.weaponsWithCharms.returnNameList().forEach(element => {
        questions.push({
            type: "autocomplete",
            name: weaponManager.weaponsWithCharms.returnNameList()[i],
            message: `Pick buddy for ${weaponManager.weaponsWithCharms.returnNameList()[i]}`,
            pageSize: 10,
            searchText: "Searching...",
            emptyText: "Nothing Found!",
            source: searchBuddyList
        });
        await inquirer.prompt(questions).then((answers)=>{
            console.log(answers);
        })
    });
    topPrompt();
}

async function allPrompt(){
    questions = [];

    topPrompt();
}

async function save(){

}
