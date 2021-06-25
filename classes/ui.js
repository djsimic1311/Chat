export default class ChatUI {
    constructor (ul) {
        this.ul = ul
    }

    set ul(x) {
        this._ul = x;
    }

    get ul() {return this._ul}

    clear(){
        this.ul.innerHTML = "";
    }

    formatDate(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let minute = date.getMinutes();

        day = `${day}`.padStart(2, 0)
        month = `${month}`.padStart(2, 0)
        hour = `${hour}`.padStart(2, 0)
        minute = `${minute}`.padStart(2, 0)

        if (date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
            return `${hour}:${minute}`
        }
        else {
            return `${day}.${month}.${year}. - ${hour}:${minute}`
        }
    }
    
    templateLi(doc) {
        //doc je objekat iz baze
        this.ul.innerHTML == ""
        let li = document.createElement("li")
        let trashB = document.createElement("div")
        let trash = document.createElement("img")
        if (localStorage.getItem("userNameLS") == doc.username) {
            li.classList.add("listMessageMe")
            trash.classList.add("bcgMe")
        }
        else {
            li.classList.add("listMessage")
            trash.classList.add("bcg")
        }
        let msg = document.createElement("p")
        msg.innerHTML = `<b>${doc.username}: </b>${doc.message}`;
        let timeStamp = document.createElement("p")
        trashB.appendChild(trash)
        trash.setAttribute("src", "images/trash-alt-regular.svg")
        trashB.classList.add("trash")
        li.appendChild(trashB);

        timeStamp.innerHTML = `${this.formatDate(doc.created_at.toDate())}`;
        li.appendChild(msg)
        li.appendChild(timeStamp)
        this.ul.appendChild(li);
        this.ul.scrollTop= this.ul.scrollHeight;

        trashB.addEventListener("click", (e) => {
            e.preventDefault();
            let msg = e.target.parentElement.parentElement
            
            if(e.target.classList == "bcgMe") {
                if (confirm("do you really want to delete the message?")) {
                    this.ul.removeChild(msg)
                    db.collection("chats")
                    .where("username", "==", doc.username)
                    .where("message", "==", doc.message)
                    .where("created_at", "==", doc.created_at)
                    .get()
                    .then(querrySnapshot => {
                        querrySnapshot.forEach(data => {
                            db.collection("chats").doc(`${data.id}`).delete()
                        })
                    })
                    .catch(err => console.log(err))                 
                }
            }
            else {
                this.ul.removeChild(msg)
            }

        })
    }
}