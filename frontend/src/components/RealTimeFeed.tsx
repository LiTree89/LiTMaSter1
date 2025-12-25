import * as React from "react";
import * as signalR from "@microsoft/signalr";

export default function RealTimeFeed() {
  const [messages, setMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://<your-signalr-endpoint>")
      .withAutomaticReconnect()
      .build();

    connection.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    connection.start();
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div>
      <h3>Live Feed</h3>
      <ul>{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>
    </div>
  );
}
