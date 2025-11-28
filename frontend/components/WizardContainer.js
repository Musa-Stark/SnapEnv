"use client";

import { useState } from "react";
import StepSelectAction from "./StepSelectAction";
import StepVSCodePath from "./StepVSCodePath";
import StepBrowserUrl from "./StepBrowserUrl";
import StepBrowserAdditionalTab from "./StepBrowserAdditionalTab";
import Summary from "./Summary";
import AlertBox from "./Alert";

export default function WizardContainer() {
  const [data, setData] = useState({ name: "", steps: [] });
  const [envName, setEnvName] = useState("");
  const [steps, setSteps] = useState([]);
  const [tabsCount, setTabsCount] = useState(0);
  const [currentView, setCurrentView] = useState("select-action");
  const [tempData, setTempData] = useState({});
  const [slideDirection, setSlideDirection] = useState("forward");
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");

  const navigateForward = (view) => {
    setSlideDirection("forward");
    setCurrentView(view);
  };

  const navigateBackward = (view) => {
    setSlideDirection("backward");
    setCurrentView(view);
  };

  const handleSelectAction = (action) => {
    if (action === "cancel") {
      const lastItem = steps[steps.length - 1];
      if (lastItem.type === "browser" && lastItem.window.length > 1) {
        lastItem.window.pop();

        let newSteps = [...steps];
        newSteps.pop();
        newSteps.push({ type: "browser", window: lastItem.window });
        setSteps(newSteps);
      } else if (steps.length > 0) {
        setSteps(steps.slice(0, -1));
      }
      return;
    }

    if (action === "new-desktop") {
      setSteps([...steps, { type: "new-desktop" }]);
      return;
    }

    if (action === "vscode") {
      navigateForward("vscode-path");
      return;
    }

    if (action === "browser") {
      setTempData({ urls: [] });
      navigateForward("browser-url");
      return;
    }
  };

  const handleVSCodePath = (folderPath) => {
    if (folderPath) {
      setSteps([...steps, { type: "vscode", folder: folderPath }]);
    }
    navigateBackward("select-action");
  };

  const handleBrowserUrl = (url) => {
    setTempData({ ...tempData, urls: [{ url }] });
    navigateForward("browser-additional");
  };

  const handleBrowserAdditional = (action, url) => {
    if (action === "add-tab") {
      const newUrls = [...tempData.urls, { url }];
      setTempData({ ...tempData, urls: newUrls });
      navigateForward("browser-additional");
    } else if (action === "same-window") {
      setSteps([...steps, { type: "browser", window: tempData.urls }]);
      setTempData({});
      navigateBackward("select-action");
    }
  };

  const handleFinish = () => {
    navigateForward("summary");
    setData((prev) => ({ ...prev, name: envName, steps }));
  };

  const handleSubmit = async () => {
    localStorage.clear();
    if (Object.keys(data) === 0) return;

    const r = await fetch("/api/upload", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const res = await r.json();
    setSuccess(res.success);
    setMessage(res.message);
    setTimeout(() => {
      setSuccess(null);
    }, 4000);
  };

  const handleBackToSelect = () => {
    navigateBackward("select-action");
  };

  const handleBackToBrowser = () => {
    navigateBackward("browser-url");
  };

  return (
    <div className="wizard-container">
      {success !== null && <AlertBox success={success} message={message} />}
      <div className="wizard-header">
        <h1 className="wizard-title">AUTOMATION SETUP WIZARD</h1>
        <div className="glow-line"></div>
      </div>

      <div
        className={`wizard-content slide-${slideDirection}`}
        key={currentView}
      >
        {currentView === "select-action" && (
          <StepSelectAction
            onSelectAction={handleSelectAction}
            onFinish={handleFinish}
            hasSteps={steps.length > 0}
            steps={steps}
            tabsCount={tabsCount}
            setTabsCount={setTabsCount}
            envName={envName}
            setEnvName={setEnvName}
          />
        )}

        {currentView === "vscode-path" && (
          <StepVSCodePath
            onSubmit={handleVSCodePath}
            onCancel={handleBackToSelect}
          />
        )}

        {currentView === "browser-url" && (
          <StepBrowserUrl
            onSubmit={handleBrowserUrl}
            onBack={handleBackToSelect}
            isFirstUrl={tempData.urls?.length === 0}
          />
        )}

        {currentView === "browser-additional" && (
          <StepBrowserAdditionalTab
            onSubmit={handleBrowserAdditional}
            onBack={handleBackToBrowser}
          />
        )}

        {currentView === "summary" && (
          <Summary
            data={data}
            onSubmit={handleSubmit}
            onBack={handleBackToSelect}
          />
        )}
      </div>
    </div>
  );
}
