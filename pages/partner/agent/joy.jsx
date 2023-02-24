import React from "react";
import ReactJoyride from "react-joyride";
import ClientOnly from "../../../components/ClientOnly";
import dynamic from "next/dynamic";

const JoyRideNoSSR = dynamic(() => import("react-joyride"), { ssr: false });

export default function Joy() {
  const steps = [
    {
      target: "#step1",
      content: "This is super awesome feature ",
      title: "Joyride",
    },
    { target: "#step2", content: "Everyone's learning Joyride!" },
  ];
  return (
    <div>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <ReactJoyride
        continuous
        hideCloseButton
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
      />
      <button id="step1">Step 1</button>
      <button id="step2">Step 2</button>
    </div>
  );
}
