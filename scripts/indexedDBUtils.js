// Открываем или создаем базу данных
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("myDatabase", 1);

        request.onerror = (event) => {
            reject("Error opening database");
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore("myStore", { keyPath: "id" });
        };
    });
};

// Добавляем данные в базу данных
const addData = (data) => {
    openDB()
        .then((db) => {
            const transaction = db.transaction(["myStore"], "readwrite");
            const store = transaction.objectStore("myStore");
            store.add(data);
        })
        .catch((error) => {
            console.error(error);
        });
};

// Удаляем данные из базы данных по ключу
const deleteData = (key) => {
    openDB()
        .then((db) => {
            const transaction = db.transaction(["myStore"], "readwrite");
            const store = transaction.objectStore("myStore");
            store.delete(key);
        })
        .catch((error) => {
            console.error(error);
        });
};

// Получаем все данные из базы данных
const getAllData = () => {
    return new Promise((resolve, reject) => {
        openDB()
            .then((db) => {
                const transaction = db.transaction(["myStore"], "readonly");
                const store = transaction.objectStore("myStore");
                const request = store.getAll();

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };

                request.onerror = (event) => {
                    reject("Error getting data from database");
                };
            })
            .catch((error) => {
                console.error(error);
            });
    });
};

// Устанавливаем новую версию базы данных
const setVersion = (newVersion) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("myDatabase", newVersion);

        request.onerror = (event) => {
            reject("Error setting database version");
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };
    });
};

// Открываем курсор для базы данных
const openCursor = () => {
    return new Promise((resolve, reject) => {
        openDB()
            .then((db) => {
                const transaction = db.transaction(["myStore"], "readonly");
                const store = transaction.objectStore("myStore");
                const request = store.openCursor();

                const results = [];

                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                request.onerror = (event) => {
                    reject("Error opening cursor in database");
                };
            })
            .catch((error) => {
                console.error(error);
            });
    });
};