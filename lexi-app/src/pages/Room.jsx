import React, { useState } from "react";
import RoomComponent from "../components/RoomComponent";

export default function Room() {
	const [joined, setJoined] = useState(false);

	return (
		<div className="Video-Room">
			<h1>Agora Video Chat</h1>
			{!joined && <button onClick={() => setJoined(true)}>Join Room</button>}
			{joined && <RoomComponent />}
			{joined && <button onClick={() => setJoined(false)}>Leave Room</button>}
		</div>
	);
}
