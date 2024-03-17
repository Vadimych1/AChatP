import websockets as wss
import asyncio
import json
import sqlite3

# Session class
class Session:
    def __init__(self, uid, username):
        self.uid = uid
        self.name = username

class Message:
    def __init__(self, message, uid):
        self.message = message
        self.uid = uid

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__)


conn = sqlite3.connect("database/database.db")
cur = conn.cursor()

# Create tables
cur.execute("""CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    message TEXT,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_uid TEXT
)""")
cur.execute("""CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    username TEXT,
    uid TEXT UNIQUE,
    rank TEXT
)""")
cur.execute("""CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    uid TEXT,
    auth_code TEXT UNIQUE
)""")
conn.commit()

# Loaded sessions
LOADED_SESSIONS = {
    "null": Session("null", "Аноним"),
}

async def get_session(auth_code):
    if auth_code in LOADED_SESSIONS:
        return LOADED_SESSIONS[auth_code]
    
    cur.execute("SELECT * FROM sessions WHERE auth_code = ?", (auth_code,))
    session = cur.fetchone()

    if session:
        return Session(session[1], session[2])

async def handler(websocket, path):
    async for message in websocket:
        data = json.loads(message)

        match data['type']:
            case 'send_message':
                if data['data']['auth_code'] in LOADED_SESSIONS:
                    session = LOADED_SESSIONS[data['data']['auth_code']]
                    cur.execute("INSERT INTO messages (message, owner_uid) VALUES (?,  ?)", (data['data']['message'], session.uid))
                    conn.commit()

                    await websocket.send(json.dumps({'status': 'success', "data": "ok"}))
                else:
                    await websocket.send(json.dumps({'status': 'error', "type": "send_message", "data": "auth first"}))

            case 'ping':
                await websocket.send(json.dumps({'status': 'success', "type": "ping", 'data': 'pong'}))

            case 'get_messages':
                cur.execute("SELECT * FROM messages")
                messages = cur.fetchall()

                to_send = []

                for message in messages:
                    message_ = {
                        'id': message[0],
                        'message': message[1],
                        'time': message[2],
                    }

                    uid = message[3]

                    if uid in LOADED_SESSIONS:
                        message_['owner'] = LOADED_SESSIONS[uid].name
                    else:
                        cur.execute("SELECT * FROM users WHERE uid = ?", (uid,))
                        user = cur.fetchone()

                        message_['owner'] = user[1]

                    to_send.append(message_)

                await websocket.send(json.dumps({'status': 'success', 'type': 'get_messages', 'data': to_send}))

            case _:
                print(data)

server = wss.serve(handler, '0.0.0.0', 8080)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()