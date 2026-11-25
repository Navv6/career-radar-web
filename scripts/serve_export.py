from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from urllib.parse import urlsplit
class Handler(SimpleHTTPRequestHandler):
    def translate_path(self,path):
        if path.startswith('/career-radar-web/'):
            path=path[len('/career-radar-web'):]
        return super().translate_path(path)
    def log_message(self,*args):pass
import os
os.chdir('out')
ThreadingHTTPServer(('127.0.0.1',4173),Handler).serve_forever()
