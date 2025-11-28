from pathlib import Path
import json
from inputimeout import TimeoutOccurred, inputimeout
import re
import pyautogui
import time
import subprocess

last_env_file = Path(__file__).parent / "last_env.txt"
json_file = Path(__file__).parent.parent / "config" / "environments.json"

with open(json_file, "r") as file:
    try:
        data = json.load(file)
    except json.JSONDecodeError or FileNotFoundError:
        data = []


def save_last_env(env):
    with open(last_env_file, "w") as file:
        file.write(env)


def get_last_env():
    with open(last_env_file, "r") as file:
        return file.read()


def start_setup(item):
    save_last_env(item["name"])
    for _ in range(10):
        pyautogui.hotkey("ctrl", "win", "left")
        time.sleep(0.1)

    print("Starting setup...")
    time.sleep(2)

    steps = item["steps"]
    for i in steps:
        if i["type"] == "new-desktop":
            pyautogui.hotkey("ctrl", "win", "right")
            time.sleep(1)
        elif i["type"] == "vscode":
            subprocess.run(["code", i["folder"]], shell=True)
            time.sleep(2)
        elif i["type"] == "browser":
            urls = [j["url"] for j in i["window"]]
            subprocess.run(["cmd", "/c", "start", "chrome", *urls])
            time.sleep(4)


def find_env(user_input):
    if re.fullmatch(r"[0-9]", str(user_input)):
        for idx, item in enumerate(data):
            if idx == int(user_input) - 1:
                start_setup(item)
    elif re.fullmatch(r"[A-Z]?[a-z0-9]+(?:\s[A-Z]?[a-z0-9]+)*", user_input):
        target = user_input.split(" ")
        for item in data:
            if len(target) == 1:
                if target[0] in item["name"].lower().split():
                    start_setup(item)
                    break
            else:
                for i in target:
                    if i.lower() in item["name"].lower().split():
                        start_setup(item)
                        break
                break


if __name__ == "__main__":
    try:
        if len(data) == 0:
            print("No tasks found!")
        else:
            print("Select one within 60 seconds")
            for idx, item in enumerate(data):
                print(f"{idx+1}. {item['name']}")
            user_input = inputimeout(
                prompt="> ",
                timeout=60,
            )
            find_env(user_input)

    except TimeoutOccurred:
        last_env = get_last_env()
        if not last_env:
            print("No last environment found.")
        else:
            print(f"No input was given!\nSetting up '{last_env}' environment")
            find_env(last_env)
