console.clear();


const valapi = require('./valapi');
const inquirer = require('inquirer');
const axios = require('axios');
const fuzzy = require('fuzzy');
const fs = require('fs');

var client = new valapi.LocalClient();
var weapons = [];
var buddies = [];
var buddylist;
var Playerloadout;
fs.access(process.env.APPDATA + "/val-buddy-changer/data/data.json", (e) => {
    if (e == null) {
        fs.readFile(process.env.APPDATA + "/val-buddy-changer/data/data.json", 'utf-8', (e, data) => {
            if (e) throw new Error(e);
            weapons = JSON.parse(data).weapons;
            buddies = JSON.parse(data).buddies;
            main();
        })
    } else {
        makeWeaponsFile();
    }
})


async function makeWeaponsFile() {
    fs.mkdirSync(process.env.APPDATA + "/val-buddy-changer", {recursive:true}, (err, data) => {
        if (err) throw new Error(err);
    });

    let weaponResponse = await axios.request("https://valorant-api.com/v1/weapons", {
        method: "GET",
    });
    for (weapon of weaponResponse.data.data) {
        weapons.push({
            "name": weapon.displayName,
            "id": weapon.uuid
        })
    }


    let buddyResponse = await axios.request("https://valorant-api.com/v1/buddies", {
        method: "GET",
    });
    for (buddy of buddyResponse.data.data) {
        buddies.push({
            "name": buddy.displayName,
            "id": buddy.uuid
        })
    }

    var data = {
        "weapons": weapons,
        "buddies": buddies
    }

    fs.writeFile(process.env.APPDATA + "/val-buddy-changer/data.json", JSON.stringify(data), (e) => {
        if (e) throw new Error(e);
    });
    main();
    
}

function makeBuddyList() {
    var buddylist = [];

    for (i of buddies) {
        buddylist.push(i.name);
    }

    return buddylist;
}

function searchBuddyList(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
            var fuzzyResult = fuzzy.filter(input, buddylist);
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
                gunsWithCharms.push(weapons.find(e => e.id === i.ID))
            }
        }
    });

    buddylist = makeBuddyList();
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
            playerloadout.Guns.find(e => e.ID == weapons.find(e => e.name == i).id).CharmID = buddies.find(e => e.name == answers[i]).id
            client.updatePlayerLoadout(playerloadout)
        }
    });

}
