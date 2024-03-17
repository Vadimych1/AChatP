import http.server as server

server_address = ("0.0.0.0", 5500)
handler = server.SimpleHTTPRequestHandler
server = server.HTTPServer(server_address, handler)
server.serve_forever()