import React from "react";

const missions = [
  { title: "Watch a video", progress: 1, reward: 10 },
  { title: "Customize your profile", progress: 0.5, reward: 5 },
  { title: "Invite a friend", progress: 0, reward: 20 }
];

export default function MissionsWidget() {
  return (
    <div className="rounded-xl shadow-lg p-4 bg-black/80 widget-header">
      <h2 className="text-xl font-bold mb-2 font-mono">Missions</h2>
      <ul className="space-y-2">
        {missions.map((m, i) => (
          <li key={i} className="flex flex-col">
            <span>{m.title} <span className="text-yellow-300">(+{m.reward} LITBIT)</span></span>
            <div className="w-full bg-gray-700 rounded h-2 mt-1">
              <div className="bg-yellow-400 h-2 rounded mission-progress-bar" data-progress={m.progress}></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
