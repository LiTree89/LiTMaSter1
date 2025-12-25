import React from "react";

import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import "./styles/tailwind.css";
import "./styles/custom.css";
import LiveStats from './components/LiveStats';
import RuntimeStatsWidget from './components/RuntimeStatsWidget';
import ChatWidget from './components/ChatWidget';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export default function App() {
  return (
    <>
      <NavBar />
      <LiveStats />
      <RuntimeStatsWidget />
      <ChatWidget />
      <Dashboard />
    </>
  );
}
