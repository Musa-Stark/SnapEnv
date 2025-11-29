# **SnapEnv**

A lightning-fast automation tool that lets you define and launch customized work environments with a single command.
Stop wasting time opening the same VS Code folders, browser tabs, and directories every single day. Save the setup once. Launch it instantly.

---

## 🚀 Features

* **Environment presets stored in JSON**
  Create unlimited environments through the Next.js UI.

* **VS Code automation**
  Opens VS Code directly into the configured directory.

* **Browser automation**
  Launches one or multiple URLs automatically.

* **Desktop toggle (Windows Virtual Desktops)**
  Opens your environment on a fresh or switched desktop to keep your workspace clean.

* **Python launcher**
  Choose an environment by index and fire it up instantly.

---

## 🔥 Virtual Desktop Automation

> If no extra desktops exist, SnapEnv automatically performs:
> • **Win + Ctrl + D** → creates a new virtual desktop
> • **Ctrl + Alt + Left/Right** → switches desktops
>
> Your environment always opens on a clean workspace.

---

## 🧩 How It Works

### 1. Create an Environment in the Next.js UI

You define:

* Environment name
* Whether to open a **new virtual desktop**
* Whether to open **VS Code**

  * If yes → specify folder path
* Whether to open **browser tabs**

  * Provide one or multiple URLs

These settings get saved to `config/environments.json`.

---

### 2. Launch an Environment with Python

Run the launcher.
It lists all environments.
Choose one → SnapEnv automatically:

1. Creates or switches to a new desktop
2. Opens VS Code (if configured)
3. Opens all specified browser tabs
4. Restores your exact environment layout

---

## 📁 Project Structure

```
/frontend  
/config/environments.json
/launcher   
```

---

## ▶️ Usage

### **Frontend (Environment Creator)**

```bash
cd frontend
npm install
npm run dev
```

Open the UI → add environments.
They’re saved to `config/environments.json`.

---

### **Launcher**

```bash
python launcher/main.py
```

Choose your environment index → everything launches automatically on the correct desktop.

---

## 🛠 Tech Stack

* **Next.js 15** → environment creator UI
* **Python** → system automation
* **JSON** → environment storage

---

## 💡 Why This Exists

Because opening VS Code, docs, YouTube tutorials, ChatGPT tabs, project directories, and dev tools every morning like a robot is a **colossal waste of time**.
SnapEnv kills that ritual.

---

## 📜 License

MIT
