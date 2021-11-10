class WeaponManager {
    weapons = [];

    add(name, id) {
        this.weapons.push({ "name": name, "id": id })
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