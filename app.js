import Chatroom from './classes/chat.js'
import ChatUI from './classes/ui.js'

let chatUL = document.getElementById("chatDiv");
let chatUI = new ChatUI(chatUL);
let msg = document.getElementById("messageInput");
let msgForm = document.getElementById("msgForm");
let userName = document.getElementById("usernameInput");
let unForm = document.getElementById("usernameForm");
let roomNav = document.getElementById("nav");
let navButtons = document.querySelectorAll("#nav > button");

let checkRoom = () => { // checks for a saved room in Local Storage
    if (localStorage.getItem("roomLS")) {
        return localStorage.getItem("roomLS")
    }
    else {
        return "general"
    }
}

let checkUserName = () => { // checks for a username in Local Storage
    if (localStorage.getItem("userNameLS")) {
        return localStorage.getItem("userNameLS")
    }
    else {
        return "anonymus"
    }
}

let chat = new Chatroom(checkRoom(), checkUserName());

chat.getChats((doc) => {
    chatUI.templateLi(doc)
})

navButtons.forEach(button => {
    button.classList.remove("active");
    console.log(button.getAttribute("id"));
    if (button.getAttribute("id") == chat.room) {
        button.classList.add("active");
    }
})

msgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (msg.value.replace(/\s/g, '').length != 0) {
        
        chat.addChat(msg.value)
        .then( () => msgForm.reset )
        .catch( err => console.log(err) )
        
        msg.value = null;
    }
    else {
        alert("The message can not be empty")
        msg.value = null;
    }
})

msg.addEventListener("keydown", (e) => {
    if (e.key == "Enter"){  
        e.preventDefault();
        if (msg.value.replace(/\s/g, '').length != 0) {
            
            chat.addChat(msg.value)
            .then( () => msgForm.reset )
            .catch( err => console.log(err) )
            
            msg.value = null;
        }
        else {
            alert("The message can not be empty")
            msg.value = null;
        }
    }
})

unForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (userName.value.replace(/\s/g, '').length != 0 && userName.value.length >= 2 && userName.value.length <= 10) {

        chat.updateUsername(userName.value)

        let result = document.createElement("p");
        result.style.color = "white"
        result.innerHTML = `Your New Username is: ${userName.value}`;

        unForm.appendChild(result);
        setTimeout(() => {
            // unForm.removeChild(result);
            location.reload();
            }, 3000);

        userName.value = null;
    }
    else {
        alert(`this is not a viable username.
    the username must have between 2 and 10 characters,
    and must not contain spaces.`)
        userName.value = null;
    }
})

userName.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
        e.preventDefault();
        if (userName.value.replace(/\s/g, '').length != 0 && userName.value.length >= 2 && userName.value.length <= 10) {
            chat.updateUsername(userName.value)

            let result = document.createElement("p");
            result.style.color = "white"
            result.innerHTML = `Your New Username is: ${userName.value}`;

            unForm.appendChild(result);
            setTimeout(() => {
                // unForm.removeChild(result);
                location.reload();
                }, 3000);

            userName.value = null;
        }
        else {
            alert(`this is not a viable username.
        the username must have between 2 and 10 characters,
        and must not contain spaces.`)
            userName.value = null;
        }
    }
})

roomNav.addEventListener("click", (e) => {
    if (e.target.tagName == "BUTTON") {
        let nr = e.target.getAttribute("id");
        
        chat.updateRoom(nr);
        navButtons.forEach(button => {
            button.classList.remove("active");
            if (button.getAttribute("id") == chat.room) {
                button.classList.add("active");
            }
        })

        chatUI.clear();

        chat.getChats((doc) => {
            chatUI.templateLi(doc)
        });
    }
})