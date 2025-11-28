"use client";
import { useState } from "react";

export default function Summary({ data, onSubmit, onBack }) {
  const [disabled, setDisabled] = useState(false);
  const steps = data.steps;

  return (
    <div className="step-container summary-container">
      <h2 className="step-title">SUMMARY</h2>

      {steps.length === 0 ? (
        <div className="empty-state">
          <p>No automation steps configured yet.</p>
        </div>
      ) : (
        <div className="summary-panel">
          <div className="step-detail mb-2 !pl-0">
            <span className="meta-label !text-2xl">{data.name}</span>
          </div>
          <h3 className="summary-subtitle">Configured Steps:</h3>
          <ol className="steps-list">
            {steps.map((step, index) => (
              <li key={index} className="step-item">
                {step.type === "new-desktop" && (
                  <div className="step-detail">
                    <div className="step-type">New Desktop</div>
                  </div>
                )}

                {step.type === "vscode" && (
                  <div className="step-detail">
                    <div className="step-type">VS Code</div>
                    <div className="step-meta">
                      <span className="meta-label">Folder:</span> {step.folder}
                    </div>
                  </div>
                )}

                {step.type === "browser" && (
                  <div className="step-detail">
                    <div className="step-type">Browser Window</div>
                    <div className="step-meta">
                      {step.window.map((tab, tabIndex) => (
                        <div key={tabIndex} className="tab-entry">
                          <span className="meta-label">
                            Tab {tabIndex + 1}:
                          </span>{" "}
                          {tab.url}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="button-row">
        {steps.length > 0 && (
          <button
            onClick={() => {
              onSubmit();
              setDisabled(true);
            }}
            disabled={disabled}
            className="primary-button submit-button"
          >
            Submit →
          </button>
        )}

        <button onClick={onBack} className="secondary-button">
          ← Back to Actions
        </button>
      </div>
    </div>
  );
}
