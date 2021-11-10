

class BuddyManager {
    buddies = [];

    constructor(data) {
        if (data) this.buddies = data;
    }
    
    buildFromJSON(data){
        this.buddies = data;
    }

    add(name, id) {
        this.buddies.push({ "name": name, "id": id });
    }

    fetchByName(name) {
        var found;
        this.buddies.forEach((e) => {
            if (e.name == name) found = e;
        })
        return found;
    }

    fetchById(id) {
        var found;
        this.buddies.forEach((e) => {
            if (e.id == id) found = e;
        })
        return found;
    }
    
    returnJSON() {
        return JSON.stringify(this.buddies);
    }

    returnNameList(){
        if(this.NameList) return this.NameList;

        var list = [];
        this.buddies.forEach((e)=>{
            list.push(e.name);
        })
        this.NameList = list;
        return this.NameList;
    }
}

module.exports = BuddyManager;