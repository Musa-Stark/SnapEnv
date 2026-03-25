"use client";

export default function DesktopDirection({ onSubmit, onCancel }) {
  return (
    <div className="step-container">
      <h2 className="step-title">SELECT DIRECTION</h2>

      <div className="form-group">
        <label htmlFor="folder-path" className="form-label">
          Direction:
        </label>
        <div className="button-row">
          <button
            onClick={() => onSubmit("Left")}
            className="primary-button"
          >
            &larr; Left
          </button>
          <button
            onClick={() => onSubmit("Right")}
            className="primary-button"
          >
            Right &rarr;
          </button>
          <button onClick={onCancel} className="secondary-button">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
