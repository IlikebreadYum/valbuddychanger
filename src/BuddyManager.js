

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
        this.buddies.forEach((e) => {
            if (e.name == name) return e;
        })
    }

    fetchById(id) {
        this.buddies.forEach((e) => {
            if (e.id == id) return e;
        })
    }
    
    returnJSON() {
        return JSON.stringify(buddies);
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