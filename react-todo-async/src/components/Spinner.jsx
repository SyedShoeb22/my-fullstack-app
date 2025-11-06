// src/components/Spinner.jsx
import React from "react";

export default function Spinner({ size = 36 }) {
  const style = {
    width: size,
    height: size,
    border: `${Math.max(3, Math.floor(size / 8))}px solid rgba(0,0,0,0.1)`,
    borderTop: `${Math.max(3, Math.floor(size / 8))}px solid rgba(0,0,0,0.6)`,
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  };
  return <div style={style} aria-label="Loading" />;
}
