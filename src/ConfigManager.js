
class configManager {
    async getConfig(buddyManager, weaponManager) {
        return new Promise((resolve, reject) => {
            fs.access(process.env.APPDATA + "/val-buddy-changer/data/data.json", (e) => {
                if (e == null) {
                    fs.readFile(process.env.APPDATA + "/val-buddy-changer/data/data.json", 'utf-8', (e, data) => {
                        if (e) throw new Error(e);
                        weapons = JSON.parse(data).weapons;
                        buddyManager.buildFromJSON(JSON.parse(data).buddies);
                        resolve();
                    })
                } else {
                    fs.mkdirSync(process.env.APPDATA + "/val-buddy-changer", { recursive: true }, (err, data) => {
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
                        buddyManager.add(buddy.displayName, buddy.uuid);
                    }

                    var data = {
                        "weapons": weapons,
                        "buddies": buddyManager.returnJSON()
                    }

                    fs.writeFile(process.env.APPDATA + "/val-buddy-changer/data.json", JSON.stringify(data), (e) => {
                        if (e) throw new Error(e);
                    });
                    resolve()
                }
            })
        })
    }
}
