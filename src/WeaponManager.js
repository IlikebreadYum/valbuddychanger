class WeaponManager {
    weapons = [];

    add(name, id) {
        this.weapons.push({ "name": name, "id": id })
    }

    fetchByName(name) {
        this.weapons.forEach((e) => {
            if (e.name == name) return e;
        })
    }

    fetchById(id) {
        this.weapons.forEach((e) => {
            if (e.id == id) return e;
        })
    }
    
    returnJSON() {
        return JSON.stringify(buddies);
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