const SERVER_URL = "ws://127.0.0.1:8080";
const ws = new WebSocket(SERVER_URL);

function sendRequest(type, data) {
    ws.send(JSON.stringify({"type": type, "data": data}));
}

function getMessages() {
    sendRequest("get_messages", "");
}

function sendMessage(message, auth_code) {
    sendRequest("send_message", {"message": message, "auth_code": auth_code});
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

ws.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.type === "get_messages") {
        const messages = data.data;

        if (messages.length > 0) {
            const chatWindow = document.getElementById("chat-window");
            const chatMessages = document.getElementById("chat-messages");

            chatMessages.innerHTML = "";

            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];

                const messageElement = document.createElement("div");
                messageElement.classList.add("message");

                const nameElement = document.createElement("p");
                nameElement.classList.add("message-name");
                nameElement.textContent = message["owner"];
                messageElement.appendChild(nameElement);
                
                const messageTextElement = document.createElement("p");
                messageTextElement.classList.add("message-text");
                messageTextElement.textContent = message["message"];
                messageElement.appendChild(messageTextElement);

                const dateElement = document.createElement("p");
                dateElement.classList.add("message-date");
                dateElement.textContent = message["time"];
                messageElement.appendChild(dateElement);

                chatMessages.appendChild(messageElement);
            }

            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }
}

ws.onopen = function () {
    getMessages();

    setInterval(function () {
        getMessages();
    }, 3000);
}