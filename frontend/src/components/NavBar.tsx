import React from "react";

export default function NavBar() {
  return (
    <nav className="flex gap-4 p-4 bg-black/70 rounded-xl mb-6 justify-center">
      <a href="#profile" className="drip-btn">Profile</a>
      <a href="#wallet" className="drip-btn">Wallet</a>
      <a href="#missions" className="drip-btn">Missions</a>
      <a href="#media" className="drip-btn">Media</a>
      <a href="#copilot" className="drip-btn">Copilot</a>
      <a href="#youtube" className="drip-btn">YouTube</a>
      <a href="#realtime" className="drip-btn">Live Feed</a>
      <a href="#chart" className="drip-btn">Stats</a>
    </nav>
  );
}
