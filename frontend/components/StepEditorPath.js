"use client";

import { useState } from "react";

export default function StepEditorPath({ onSubmit, onCancel }) {
  const [folderPath, setFolderPath] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [IDE, setIDE] = useState("");

  const handleOk = () => {
    if (folderPath.trim() && IDE) {
      onSubmit(folderPath.trim(), IDE);
    }
  };

  return (
    <div className="step-container">
      <h2 className="step-title">SELECT FOLDER</h2>

      <div className="form-group">
        <label htmlFor="folder-path" className="form-label">
          Folder path:
        </label>
        <div className="input-wrapper">
          <input
            id="folder-path"
            type="text"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="/path/to/folder"
            className={`neon-input ${isFocused ? "focused" : ""}`}
          />
        </div>
        <div className="button-row">
          <button
            onClick={() => setIDE("Antigravity")}
            className={`secondary-button action-button ${
              IDE.toLowerCase() === "antigravity" ? "selected" : ""
            }`}
          >
            Antigravity
          </button>

          <button
            onClick={() => setIDE("VSCode")}
            className={`secondary-button action-button ${
              IDE.toLowerCase() === "vscode" ? "selected" : ""
            }`}
          >
            VSCode
          </button>
        </div>
      </div>

      <div className="button-row">
        <button
          onClick={handleOk}
          disabled={!folderPath.trim() || !IDE}
          className="primary-button"
        >
          OK
        </button>

        <button onClick={onCancel} className="secondary-button">
          Cancel
        </button>
      </div>
    </div>
  );
}
