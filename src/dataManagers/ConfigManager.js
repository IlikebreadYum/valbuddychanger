const fs = require('fs');
const axios = require('axios');

class ConfigManager {
    async getConfig(buddyManager, weaponManager) {
        return new Promise((resolve, reject) => {
            fs.access("./data.json", async (e) => {
                if (e == null) {
                    fs.readFile("./data.json", 'utf-8', (e, data) => {
                        if (e) throw new Error(e);
                        weaponManager.buildFromJSON(JSON.parse(JSON.parse(data).weapons))
                        buddyManager.buildFromJSON(JSON.parse(JSON.parse(data).buddies));
                        resolve();
                    })
                } else {
                    // fs.mkdirSync(process.env.APPDATA + "/val-buddy-changer", { recursive: true }, (err, data) => {
                    //     if (err) throw new Error(err);
                    // });

                    let weaponResponse = await axios.request("https://valorant-api.com/v1/weapons", {
                        method: "GET",
                    });
                    for (var weapon of weaponResponse.data.data) {
                        weaponManager.add(weapon.displayName, weapon.uuid);
                    }


                    let buddyResponse = await axios.request("https://valorant-api.com/v1/buddies", {
                        method: "GET",
                    });
                    for (var buddy of buddyResponse.data.data) {
                        buddyManager.add(buddy.displayName, buddy.uuid);
                    }

                    var data = {
                        "weapons": weaponManager.returnJSON(),
                        "buddies": buddyManager.returnJSON()
                    }

                    fs.writeFile("./data.json", JSON.stringify(data), (e) => {
                        if (e) throw new Error(e);
                        resolve()
                    });
                }
            })
        })
    }
}

module.exports = ConfigManager;
