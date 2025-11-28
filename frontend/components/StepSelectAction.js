"use client";
import { useState, useEffect } from "react";

export default function StepSelectAction({
  onSelectAction,
  onFinish,
  hasSteps,
  steps,
  tabsCount,
  setTabsCount,
  envName,
  setEnvName,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const newDesktopCount = steps.filter(
    (step) => step.type === "new-desktop"
  ).length;
  const [isVSCode, setIsVSCode] = useState(false);
  const isNewDesktopSelected = newDesktopCount > 0;

  useEffect(() => {
    const browsers = steps.filter((step) => step.type === "browser");
    let count = 0;
    for (const item of browsers) {
      count += item.window.length;
    }
    setTabsCount(count);
  }, [steps]);

  useEffect(() => {
    const name = JSON.parse(localStorage.getItem("env-name"));
    if (name) {
      setEnvName(name);
    }
  }, []);

  useEffect(() => {
    const found = steps.some((step) => step.type === "vscode");
    if (found) {
      setIsVSCode(true);
    } else {
      setIsVSCode(false);
    }
  }, [steps]);

  return (
    <div className="step-container">
      <h2 className="step-title">SELECT ACTION</h2>

      <div className="button-grid">
        <input
          id="name"
          type="text"
          value={envName}
          onChange={(e) => setEnvName(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            localStorage.setItem("env-name", JSON.stringify(envName));
          }}
          placeholder="Name"
          className={`neon-input ${isFocused ? "focused" : ""} !pl-6`}
        />
        <button
          onClick={() => onSelectAction("new-desktop")}
          className={`action-button ${isNewDesktopSelected ? "selected" : ""}`}
        >
          <span className="button-icon">🖥️</span>
          <span>New Desktop</span>
          {newDesktopCount > 0 && (
            <span className="count-badge">{newDesktopCount}</span>
          )}
        </button>

        <button
          onClick={() => onSelectAction("vscode")}
          className={`action-button ${isVSCode === true && "selected"}`}
        >
          <span className="button-icon">💻</span>
          <span>VS Code</span>
        </button>

        <button
          onClick={() => onSelectAction("browser")}
          className="action-button"
        >
          <span className="button-icon">🌐</span>
          <span>Browser Window</span>
          {tabsCount > 0 && <span className="count-badge">{tabsCount}</span>}
        </button>

        {hasSteps && (
          <button
            onClick={() => onSelectAction("cancel")}
            className="action-button cancel-button"
          >
            <span className="button-icon">✕</span>
            <span>Cancel</span>
          </button>
        )}
      </div>

      {hasSteps && (
        <button onClick={onFinish} className="primary-button finish-button">
          Finish & Review →
        </button>
      )}
    </div>
  );
}
