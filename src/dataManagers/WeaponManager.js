class WeaponManager {
    weapons = [];

    constructor (charms=false) {
        if(!charms){
            this.weaponsWithCharms = new WeaponManager(true);
        }
    }

    add(name, id) {
        this.weapons.push({ "name": name, "id": id })
    }

    addByJSON(json){
        this.weapons.push(json)
    }

    fetchByName(name) {
        var found;
        this.weapons.forEach((e) => {
            if (e.name == name) found = e;
        })
        return found;
    }

    fetchById(id) {
        var found;
        this.weapons.forEach((e) => {
            if (e.id == id) found = e;
        })
        return found;
    }
    
    returnJSON() {
        return JSON.stringify(this.weapons);
    }

    buildFromJSON(data){
        this.weapons = data;
    }

    returnNameList(){
        if(this.NameList) return this.NameList;

        var list = [];
        this.weapons.forEach((e)=>{
            list.push(e.name);
        })
        this.NameList = list;
        return this.NameList;
    }
}

module.exports = WeaponManager;