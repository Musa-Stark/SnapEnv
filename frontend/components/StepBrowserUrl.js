'use client';

import { useState } from 'react';

export default function StepBrowserUrl({ onSubmit, onBack, isFirstUrl }) {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleNext = () => {
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl('');
    }
  };

  return (
    <div className="step-container">
      <h2 className="step-title">
        {isFirstUrl ? 'BROWSER WINDOW - ENTER URL' : 'ADD ANOTHER TAB "b"'}
      </h2>
      
      <div className="form-group">
        <label htmlFor="browser-url" className="form-label">
          URL:
        </label>
        <div className="input-wrapper">
          <input
            id="browser-url"
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
          onClick={handleNext}
          disabled={!url.trim()}
          className="primary-button"
        >
          Next →
        </button>

        <button
          onClick={onBack}
          className="secondary-button"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}