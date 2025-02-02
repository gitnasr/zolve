import requests
import uvicorn

from app import ServerAPI
from version import version as current_version

if __name__ == "__main__":
    endpoint = "https://api.github.com/repos/gitnasr/zolve/releases"

    response = requests.get(endpoint)
    data = response.json()
    
    for release in data:
        if "claude" in release["tag_name"]:
            latest_version = release["tag_name"]
            break
    print(latest_version, current_version)
    if latest_version > current_version:
        print("There's a new version of Claude available. Please update your version.")
        print(f"Your version: claude-v1.0.1, Latest version: {latest_version}")
        print("You can download the latest version from https://github.com/gitnasr/zolve/releases")
        input("Press Enter to continue...")
        exit()
    else:
        print("You're using the latest version of Claude.")

    server_api = ServerAPI()
 
    uvicorn.run(server_api.app, host="0.0.0.0", port=3005, )
