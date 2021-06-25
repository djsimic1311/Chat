export default class Chatroom {
    constructor (room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection("chats");
        this.unsub
    }

    set room(str) { this._room = str }
    set username(str) {
        if (str.length >= 2 && str.length <= 10 && (str.replace(/\s/, '').length != 0)) {
            this._username = str
        }
        else {
            alert(`${str} is not a viable username.
            the username must have between 2 and 10 characters,
            and must not contain spaces.`)
        }
    }
    
    get room() {return this._room}
    get username() {return this._username}

    async addChat(msg) {
        let message = {
            message: msg,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(new Date())
        }

        let response = await this.chats.add(message);
        return response;
    }

    getChats(callBack) {
        this.unsub = this.chats
            .where("room", "==" , this.room)
            .orderBy("created_at", "asc")
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == "added") {
                        callBack(change.doc.data());
                    }
                })
            })
    }

    updateRoom(str) {
        this.room = str;
        if(this.unsub) {
            this.unsub();
        }
        localStorage.setItem("roomLS", str);
    }

    updateUsername(str) {
        this.username = str;
        localStorage.setItem("userNameLS", str);
    }
}
