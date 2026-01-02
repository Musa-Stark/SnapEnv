from pathlib import Path
import json
from inputimeout import TimeoutOccurred, inputimeout
import re
import pyautogui
import time
import subprocess

last_env_file = Path(__file__).parent / "last_env.json"
json_file = Path(__file__).parent.parent / "config" / "environments.json"

with open(json_file, "r") as file:
    try:
        data = json.load(file)
    except json.JSONDecodeError or FileNotFoundError:
        data = []


def save_last_env(env):
    with open(last_env_file, "w") as file:
        json.dump({"env": env}, file, indent=4)


def get_last_env():
    with open(last_env_file, "r") as file:
        data = json.load(file)
        name = data.get("env", "")
        return name


def start_setup(item):
    save_last_env(item["name"])
    for _ in range(10):
        pyautogui.hotkey("ctrl", "win", "left")
        time.sleep(0.1)

    print("Starting setup...")
    time.sleep(2)

    steps = item["steps"]
    for i in steps:
        if i["type"] == "desktop":
            pyautogui.hotkey("ctrl", "win", i["direction"].lower())
            time.sleep(2)
        elif i["type"] == "editor":
            subprocess.run([i["IDE"], i["folder"]], shell=True)
            time.sleep(8)
        if i["type"] == "browser":
            urls = [j["url"] for j in i["window"]]
            subprocess.run(["cmd", "/c", "start", "chrome", *urls])
            time.sleep(5)


def find_env(user_input):
    # if index (1 or 2 or 3...)
    if re.fullmatch(r"\d+", str(user_input)):
        for idx, item in enumerate(data):
            if idx == int(user_input) - 1:
                start_setup(item)

    # if name
    else:
        target = "".join(user_input.lower().split())
        found = False

        for item in data:
            item_join_name = "".join(item.get("name", "").lower().split())
            if target == item_join_name:
                found = True
                start_setup(item)
                break
        
        if not found:
            print("Invalid Input!!!")


last_env = get_last_env()
if __name__ == "__main__":
    try:
        if len(data) == 0:
            print("No tasks found!")
        else:
            print(f"Select one within 60 seconds or I setup {last_env}")
            for idx, item in enumerate(data):
                print(f"{idx+1}. {item['name']}")
            user_input = inputimeout(
                prompt="> ",
                timeout=60,
            )
            find_env(user_input)

    except TimeoutOccurred:
        if not last_env:
            print("No last environment found.")
        else:
            print(f"No input was given!\nSetting up '{last_env}' environment")
            find_env(last_env)
