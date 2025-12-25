import React from "react";

import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import "./styles/tailwind.css";
import "./styles/custom.css";
import LiveStats from './components/LiveStats';
import RuntimeStatsWidget from './components/RuntimeStatsWidget';
import ChatWidget from './components/ChatWidget';
import ChartWidget from './components/ChartWidget';

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
      <ChartWidget />
      <ChatWidget />
      <Dashboard />
    </>
  );
}
