import React, { useRef, useState } from "react";

const demoPlaylist = [
  { title: "Big Buck Bunny", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { title: "Sample Audio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
];

export default function MediaPlayerWidget() {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (playerRef.current) {
      if (!fullscreen) {
        playerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setFullscreen(!fullscreen);
    }
  };

  const media = demoPlaylist[current];
  const isVideo = media.url.endsWith(".mp4");

  return (
    <div ref={playerRef} className="rounded-xl shadow-lg p-4 bg-black/80 widget-header">
      <h2 className="text-xl font-bold mb-2 font-mono">Kodi-Style Media Player</h2>
      <div className="mb-2">
        {isVideo ? (
          <video controls className="w-full rounded-lg">
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <audio controls className="w-full">
            <source src={media.url} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        )}
      </div>
      <div className="flex gap-2 mb-2">
        {demoPlaylist.map((item, idx) => (
          <button
            key={item.title}
            className={`px-2 py-1 rounded ${idx === current ? "bg-blue-500" : "bg-gray-700"}`}
            onClick={() => setCurrent(idx)}
          >
            {item.title}
          </button>
        ))}
        <button className="ml-auto px-2 py-1 rounded bg-purple-600" onClick={handleFullscreen}>
          {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>
    </div>
  );
}
