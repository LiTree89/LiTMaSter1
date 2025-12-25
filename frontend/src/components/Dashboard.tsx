import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import ProfileWidget from "./ProfileWidget";
import MediaPlayerWidget from "./MediaPlayerWidget";
import WalletWidget from "./WalletWidget";
import MissionsWidget from "./MissionsWidget";
import CopilotWidget from "./CopilotWidget";
import YouTubeWidget from "./YouTubeWidget";
import "../styles/tailwind.css";
import "../styles/custom.css";

const initialLayout = [
  { i: "profile", x: 0, y: 0, w: 2, h: 3 },
  { i: "media", x: 2, y: 0, w: 4, h: 3 },
  { i: "wallet", x: 0, y: 3, w: 2, h: 2 },
  { i: "missions", x: 2, y: 3, w: 2, h: 2 },
  { i: "copilot", x: 4, y: 3, w: 2, h: 2 },
  { i: "youtube", x: 0, y: 5, w: 6, h: 4 }
];

export default function Dashboard() {
  const [layout, setLayout] = useState(initialLayout);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-center font-mono drop-shadow-lg">LiTreeLabStudio™ Dashboard</h1>
      <GridLayout
        className="layout"
        layout={layout}
        cols={6}
        rowHeight={80}
        width={1200}
        onLayoutChange={setLayout}
        draggableHandle=".widget-header"
      >
        <div key="profile"><ProfileWidget /></div>
        <div key="media"><MediaPlayerWidget /></div>
        <div key="wallet"><WalletWidget /></div>
        <div key="missions"><MissionsWidget /></div>
        <div key="copilot"><CopilotWidget /></div>
        <div key="youtube"><YouTubeWidget /></div>
      </GridLayout>
      <footer className="mt-12 text-center text-xs opacity-60">Drag, drop, and customize your dashboard. More widgets coming soon!</footer>
    </div>
  );
}
