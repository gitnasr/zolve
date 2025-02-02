import uvicorn
from claude_api import Client
from typing import Literal, List
from fastapi import FastAPI, Request
from pydantic import BaseModel

class ClaudeServer:
    def __init__(self):
        self.client = None

    def set_client(self, cookie: str):
        self.client = Client(cookie)

    def send_message(self, message: str, conversation_id: str):
        return self.client.send_message(message, conversation_id, None, 1000)
    
    def create_new_chat(self, message: str):
        res = self.client.create_new_chat()['uuid']
        self.client.send_message(message, res)
        return res

class Message(BaseModel):
    role: Literal["system", "user"]
    content: str

class Prompt(BaseModel):
    messages: List[Message]
    conversationId: str

class SystemPrompt(BaseModel):
    message: str

class ServerAPI:
    def __init__(self):
        self.app = FastAPI()
        self.server = ClaudeServer()
        self.register_routes()

    def register_routes(self):
        @self.app.post("/claude")
        async def send_prompt(payload: Prompt, request: Request):
        
            cookie = request.headers.get("Cookies")
            if cookie:
                self.server.set_client(cookie)

            response = ""
            for message in payload.messages:
                res = self.server.send_message(message.content, payload.conversationId)
                if res == "":
                    response = "Too many requests"
                    break
                else:
                    response += res
            
            return {"response": response}

        @self.app.post("/claude/new_chat")
        async def new_chat(payload: SystemPrompt, request: Request):
            cookie = request.headers.get("Cookies")
            if cookie:
                self.server.set_client(cookie)

            res = self.server.create_new_chat(payload.message)
            return {"conversationId": res}

    def run(self, host="0.0.0.0", port=3005):
        uvicorn.run(self.app, host=host, port=port)
