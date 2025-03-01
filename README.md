<img src="https://github.com/user-attachments/assets/b69e5f17-1e50-41e5-8771-be6a84daa750" width="48" height="48"/>

# Zolve Extension 

### A Chrome extension that uses AI to solve online exams, currently supporting Microsoft Forms with multiple AI backends.





https://github.com/user-attachments/assets/bb9bdf03-164a-4e55-9efd-29951f87d2f6




## ✨ Features
- 🤖 **Multiple AI Backends Support** (Claude, Cloudflare Workers AI, [Zolve AI](https://github.com/gitnasr/zolve-agent))
- 📝 **Microsoft Forms Integration**
- 🔄 **Context Menu Integration**
- ⚙️ **Customizable Shortcuts**
- 🎯 **Chunk-based Question Processing**
- 📋 **In-page Answer Display**
- ⌨️ **Keyboard Shortcuts** (to show/hide answers)

---

### Basic Usage 🎯
#### On Microsoft Forms:
1. Open any Microsoft Forms exam. ✍️
2. Right-click anywhere on the page. 🖱️
3. Select **Zolve** and Choose the agent you want 🤖
4. Wait for answers to appear in the bottom-right corner. ⏳

#### Controls:
- **Double-click**: Hide answers window 👁️
- **Ctrl+Enter**: Toggle answers window 🔄
- **bottom-right corner hover**: Show answers window ⚙️

## 📥 Installation

### 1️⃣ Use Latest Version
1. Download **Zolve** [latest release](https://github.com/gitnasr/zolve/releases) (Currently tested on Chrome only)
2. Unzip the file.
3. Enable **Developer Mode** in Chrome via `chrome://extensions/`.
4. Drag and drop the folder.
5. Open the options page in the extension to tune your settings!

### 2️⃣ Use the Repository
```bash
# Clone the repo
git clone https://github.com/gitnasr/zolve.git
cd zolve

# Install dependencies
npm install

# Build for production
npm run build

# Development mode with hot reload
npm run watch
```

---

## ⚙️ Configuration

We recommend using [Zolve AI](https://github.com/gitnasr/zolve-agent) agent; it's the default agent, and we programmed it to be specifically your guardian angel.
However, we still support using Cloudflare and our Customized Claude Agent 

### 🤖 **Claude AI**  
We provide a fully functional reverse API server for the Claude.ai service.  
Simply download the latest release from [here](https://github.com/gitnasr/claude-engine/releases),  
log in to Claude on Chrome using your account, and the integration will be established automatically.  

- **Server URL 🌐**  
- **Port 🔌**

### ☁️ **Cloudflare Workers AI**
- API Endpoint 🛠️
- Account ID 🆔
- Model Name 🤖
- API Key 🔑


---

### ➕ New Exam Platform
1. Create a new engine in `engines/`
2. Implement scraping logic
3. Add to `ContentScript.tsx`

#### Example:
```ts
export class NewPlatformScraper {
  public async Scrape(): Promise<string[][]> {
    const questions = // Scraping logic
    return Helper.SplitArrayIntoChunks(questions, 5);
  }
}
```





---

## 🛠️ Build System
- **Webpack** for bundling 🏗️
- **PostCSS/Tailwind** for styling 🎨
- **TypeScript compilation** 📜
- **Asset management** 📦
- **Environment-specific builds** (dev/prod) 🚀

---

## 🤝 Contributing

1. **Fork** the repository 🍴
2. **Create a feature branch** (`git checkout -b feature-name`) 🌿
3. **Commit changes** (`git commit -m "Add new feature"`) 📌
4. **Push to branch** (`git push origin feature-name`) 🚀
5. **Create a Pull Request** 🔄

---

Made with ❤️ by [Nasr](https://github.com/gitnasr) 🚀
