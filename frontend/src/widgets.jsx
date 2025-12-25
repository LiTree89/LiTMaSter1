import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const widgetsList = [
  { id: "profile", title: "MySpace Profile", content: <ProfileWidget /> },
  { id: "media", title: "Kodi Media Player", content: <MediaWidget /> },
  { id: "wallet", title: "Wallet Balance", content: <WalletWidget /> },
  { id: "missions", title: "Missions", content: <MissionsWidget /> },
];

export function Widget({ id, title, content }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="bg-black/70 rounded-xl shadow-xl p-6 flex flex-col gap-2 border-2 border-purple-700 hover:border-blue-400 cursor-move"
      {...attributes}
      {...listeners}
    >
      <h2 className="text-xl font-bold mb-2 font-mono">{title}</h2>
      <div>{content}</div>
    </div>
  );
}

function ProfileWidget() {
  return (
    <div className="flex flex-col items-center">
      <img src="https://placekitten.com/120/120" alt="Avatar" className="rounded-full border-4 border-pink-400 mb-2" />
      <div className="font-bold text-pink-300">@yourMySpaceName</div>
      <div className="text-xs text-gray-300">"Welcome to my crazy dashboard!"</div>
    </div>
  );
}

function MediaWidget() {
  return (
    <div>
      <video controls className="w-full rounded-lg">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="text-xs mt-2 text-blue-200">Kodi-style media player (demo)</div>
    </div>
  );
}

function WalletWidget() {
  return <div className="text-green-400 font-mono">LITBIT Balance: <span className="font-bold">420</span></div>;
}

function MissionsWidget() {
  return <div className="text-yellow-300">Complete missions to earn more LITBITs!</div>;
}
