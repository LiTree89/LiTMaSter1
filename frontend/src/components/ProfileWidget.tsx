import React, { useState } from "react";

export default function ProfileWidget() {
  const [bg, setBg] = useState("bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500");
  const [music, setMusic] = useState("");
  return (
    <div className={`rounded-xl shadow-lg p-4 widget-header ${bg}`}>
      <h2 className="text-xl font-bold mb-2 font-mono">MySpace Profile</h2>
      <img src="https://placekitten.com/120/120" alt="Avatar" className="rounded-full border-4 border-pink-400 mb-2" />
      <div className="font-bold text-pink-300">@yourMySpaceName</div>
      <div className="text-xs text-gray-300 mb-2">"Welcome to my crazy dashboard!"</div>
      <input
        className="w-full p-1 rounded mb-2 text-black"
        placeholder="Paste music embed URL (mp3)"
        value={music}
        onChange={e => setMusic(e.target.value)}
      />
      {music && (
        <audio controls autoPlay loop className="w-full">
          <source src={music} type="audio/mpeg" />
        </audio>
      )}
      <select className="w-full p-1 rounded mt-2 text-black" value={bg} onChange={e => setBg(e.target.value)} title="Select background style">
        <option value="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">Pink/Purple/Blue</option>
        <option value="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">Green/Blue/Purple</option>
        <option value="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">Yellow/Red/Pink</option>
        <option value="bg-black">Classic Black</option>
      </select>
    </div>
  );
}
