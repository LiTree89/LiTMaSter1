import React from "react";
import Dashboard from "./components/Dashboard";
import "./styles/tailwind.css";
import "./styles/custom.css";

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export default function App() {
  return <Dashboard />;
}
