// Получаем элементы из DOM
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// При клике на кнопку "Отправить"
sendButton.addEventListener('click', function() {
    const message = messageInput.value.trim();
    if (message) {
        const messageElement = document.createElement('div');
        const messageText = document.createElement('p');
        const senderText = document.createElement('span');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        messageText.textContent = message;
        senderText.textContent = 'Отправитель: Гость';
        editButton.textContent = 'Редактировать';
        deleteButton.textContent = 'Удалить';

        editButton.addEventListener('click', () => {
            const newMessage = prompt('Введите новое сообщение:');
            if (newMessage) {
                messageText.textContent = newMessage;
                saveMessagesToLocalStorage();
            }
        });

        deleteButton.addEventListener('click', () => {
            chatMessages.removeChild(messageElement);
            saveMessagesToLocalStorage();
        });

        messageElement.appendChild(messageText);
        messageElement.appendChild(senderText);
        messageElement.appendChild(editButton);
        messageElement.appendChild(deleteButton);

        chatMessages.appendChild(messageElement);
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        saveMessagesToLocalStorage();
    }
});

// Функция для сохранения сообщений в localStorage
function saveMessagesToLocalStorage() {
    const messages = [];
    chatMessages.childNodes.forEach(node => {
        if (node.tagName === 'DIV') {
            messages.push(node.firstChild.textContent);
        }
    });
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// При загрузке страницы
window.addEventListener('load', function() {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    
    if (storedMessages) {
        storedMessages.forEach(message => {
            const messageElement = document.createElement('div');
            const messageText = document.createElement('p');
            const senderText = document.createElement('span');
            
            messageText.textContent = message;
            senderText.textContent = 'Отправитель: Гость';
            
            messageElement.appendChild(messageText);
            messageElement.appendChild(senderText);
            
            chatMessages.appendChild(messageElement);
        });
    }
});

