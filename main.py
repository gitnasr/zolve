import uvicorn
from app import ServerAPI

if __name__ == "__main__":
    server_api = ServerAPI()
    # Now we use `uvicorn.run()` with the `reload=True` option
    uvicorn.run(server_api.app, host="0.0.0.0", port=3005, )
