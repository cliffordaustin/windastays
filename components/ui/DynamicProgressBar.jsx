import React, { useEffect, useState } from "react";

function ProgressBar({ time, className = "" }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((prevWidth) => prevWidth + 1);
    }, time / 100);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div
      style={{
        width: `${width}%`,
        height: "2px",
        background: "black",
      }}
      className={className}
    ></div>
  );
}

export default ProgressBar;
