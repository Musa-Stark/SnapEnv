'use client';

import { useState } from 'react';

export default function StepBrowserAdditionalTab({ onSubmit, onBack }) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleAddTab = () => {
    if (url.trim()) {
      onSubmit('add-tab', url.trim());
      setUrl('');
      setShowUrlInput(false);
    }
  };

  const handleSameWindow = () => {
    onSubmit('same-window');
  };

  if (showUrlInput) {
    return (
      <div className="step-container">
        <h2 className="step-title">ADD ANOTHER TAB - ENTER URL 'a'</h2>
        
        <div className="form-group">
          <label htmlFor="tab-url" className="form-label">
            URL:
          </label>
          <div className="input-wrapper">
            <input
              id="tab-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="https://example.com"
              className={`neon-input ${isFocused ? 'focused' : ''}`}
            />
          </div>
        </div>

        <div className="button-row">
          <button
            onClick={handleAddTab}
            disabled={!url.trim()}
            className="primary-button"
          >
            Add
          </button>

          <button
            onClick={() => setShowUrlInput(false)}
            className="secondary-button"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <h2 className="step-title">BROWSER WINDOW - OPTIONS</h2>
      
      <div className="button-grid">
        <button
          onClick={() => setShowUrlInput(true)}
          className="action-button"
        >
          <span className="button-icon">➕</span>
          <span>Add new tab</span>
        </button>

        <button
          onClick={handleSameWindow}
          className="action-button"
        >
          <span className="button-icon">✓</span>
          <span>Use same window</span>
        </button>
      </div>

      <button
        onClick={onBack}
        className="secondary-button back-button"
      >
        ← Back
      </button>
    </div>
  );
}