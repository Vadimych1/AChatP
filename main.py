import websockets as wss
import asyncio
import json
import time
import os
import requests
import sys
import threading
import sqlite3

async def handler(websocket, path):
    async for message in websocket:
        data = json.loads(message)

        match data['type']:
            case 'send_message':
                print(data["data"])
            case 'ping':
                await websocket.send(json.dumps({'type': 'success', 'data': 'pong'}))
            case 'get_messages':
                with open('messages.txt', 'r') as f:
                    await websocket.send(json.dumps({'type': 'success', 'data': f.readlines()}))
            case _:
                print(data)

server = wss.serve(handler, '0.0.0.0', 8080)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()