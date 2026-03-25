from pathlib import Path
import json
from inputimeout import TimeoutOccurred, inputimeout
import re
import pyautogui
import time
import subprocess
import platform
import shutil
import difflib

# ======================
# SYSTEM SETUP
# ======================
OS = platform.system().lower()

BASE_DIR = Path(__file__).resolve().parent
CONFIG_FILE = BASE_DIR.parent / "config" / "environments.json"
LAST_ENV_FILE = BASE_DIR / "last_env.json"

# ======================
# UTILS
# ======================
def normalize(text: str) -> str:
    """Normalize text for reliable matching"""
    return re.sub(r'[^a-z0-9]', '', text.lower())

def command_exists(cmd):
    return shutil.which(cmd) is not None

# ======================
# DATA HANDLING
# ======================
def load_data():
    if not CONFIG_FILE.exists():
        return []
    try:
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(CONFIG_FILE, "w") as f:
        json.dump(data, f, indent=4)

data = load_data()

# ======================
# LAST ENV
# ======================
def save_last_env(env):
    with open(LAST_ENV_FILE, "w") as f:
        json.dump({"env": env}, f, indent=4)

def get_last_env():
    if not LAST_ENV_FILE.exists():
        return ""
    try:
        with open(LAST_ENV_FILE, "r") as f:
            return json.load(f).get("env", "")
    except:
        return ""

# ======================
# SYSTEM ACTIONS
# ======================
def open_browser(urls):
    if not urls:
        return

    if OS == "windows":
        subprocess.run(["cmd", "/c", "start", "chrome", *urls], shell=True)

    elif OS == "linux":
        if command_exists("google-chrome"):
            subprocess.run(["google-chrome", *urls])
        elif command_exists("chromium"):
            subprocess.run(["chromium", *urls])
        else:
            subprocess.run(["xdg-open", urls[0]])

    elif OS == "darwin":
        subprocess.run(["open", "-a", "Google Chrome", *urls])

def open_editor(ide, folder):
    if ide.lower() == "vscode":
        ide = "code"

    if not command_exists(ide):
        print(f"[ERROR] Editor '{ide}' not found.")
        return

    subprocess.run([ide, folder])

def switch_desktop(direction):
    try:
        if OS == "windows":
            pyautogui.hotkey("ctrl", "win", direction)

        elif OS == "linux":
            pyautogui.hotkey("ctrl", "alt", direction)

        elif OS == "darwin":
            pyautogui.hotkey("ctrl", direction)

    except Exception as e:
        print(f"[WARN] Desktop switch failed: {e}")

def reset_desktops():
    for _ in range(10):
        switch_desktop("left")
        time.sleep(0.05)

# ======================
# CORE EXECUTION
# ======================
def start_setup(env):
    print(f"\n[INFO] Starting: {env['name']}")
    save_last_env(env["name"])

    reset_desktops()
    time.sleep(1)

    for step in env.get("steps", []):
        step_type = step.get("type")

        if step_type == "desktop":
            switch_desktop(step.get("direction", "right"))

        elif step_type == "editor":
            open_editor(step.get("IDE", ""), step.get("folder", ""))

        elif step_type == "browser":
            urls = [w.get("url") for w in step.get("window", []) if w.get("url")]
            open_browser(urls)

        time.sleep(2)

# ======================
# DELETE
# ======================
def delete_env(env):
    global data

    data = [e for e in data if e["name"] != env["name"]]
    save_data(data)

    if env["name"] == get_last_env():
        with open(LAST_ENV_FILE, "w") as f:
            json.dump({}, f)

    print(f"[INFO] Deleted: {env['name']}")

# ======================
# SEARCH (SMART)
# ======================
def find_env(user_input, intent="setup"):
    cleaned = user_input.strip().strip('"').strip("'")
    target = normalize(cleaned)

    # 1. Try index
    if cleaned.isdigit():
        idx = int(cleaned) - 1
        if 0 <= idx < len(data):
            env = data[idx]
            return execute(env, intent)

    # 2. Exact match
    for env in data:
        if normalize(env["name"]) == target:
            return execute(env, intent)

    # 3. Fuzzy match (suggestion)
    names = [env["name"] for env in data]
    matches = difflib.get_close_matches(cleaned, names, n=1, cutoff=0.5)

    if matches:
        print(f"[HINT] Did you mean: {matches[0]} ?")
    else:
        print("[ERROR] Environment not found!")

def execute(env, intent):
    if intent == "delete":
        delete_env(env)
    else:
        start_setup(env)

# ======================
# INPUT HANDLER
# ======================
def analyze_input(user_input):
    user_input = user_input.strip()

    if user_input.lower() == "q":
        print("Exiting...")
        exit()

    elif user_input.lower().startswith("delete"):
        cleaned = re.sub(r"\bdelete\b", "", user_input, flags=re.IGNORECASE)
        find_env(cleaned, intent="delete")

    else:
        find_env(user_input, intent="setup")

# ======================
# UI
# ======================
def show_menu():
    last_env = get_last_env()

    print("\nAvailable Environments")
    print("----------------------")

    for i, env in enumerate(data, 1):
        print(f"{i}. {env.get('name')}")

    print(f"\nDefault: {last_env if last_env else 'None'}")
    print("\nCommands:")
    print("  • <number|name> → start")
    print("  • delete <number|name>")
    print("  • q → quit")
    print("  • wait 60s → auto start\n")

# ======================
# MAIN
# ======================
if __name__ == "__main__":
    try:
        if not data:
            print("No environments found!")
            exit()

        show_menu()
        
        while True:
            user_input = inputimeout(prompt="> ", timeout=60)

            if user_input.lower() == "q":
                print("Exiting...")
                exit()

            analyze_input(user_input)

    except TimeoutOccurred:
        last_env = get_last_env()
        if last_env:
            print(f"\n[INFO] Auto-starting: {last_env}")
            find_env(last_env)
        else:
            print("No default environment set.")