const chatWindow = document.getElementById("chat-window");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

let messages = [];

sendButton.addEventListener("click", function (e) {
    e.preventDefault();

    const message = messageInput.value;
    const authcode = getCookie("auth_code");

    if (message === "") {
        var popup = document.createElement("div");
        popup.classList.add("popup");

        var text = document.createElement("p");
        text.textContent = "Сообщение не может быть пустым!";

        popup.appendChild(text);

        popup.style.top = "-100px";

        document.body.append(popup);

        setTimeout(function () {
            popup.style.top = "20px";
        }, 20);

        setTimeout(function () {
            popup.style.top = "-100px";

            setTimeout(function () {
                popup.remove();    
            }, 400);
        }, 3000);
    } else {
        sendMessage(message, authcode == "" ? "null" : authcode)

        getMessages()
    }

    messageInput.value = "";
});