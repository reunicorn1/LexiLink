import React, { useState } from "react";
import { useParams } from "react-router-dom";
import RoomComponent from "../components/RoomComponent";

export default function Room() {
	const [joined, setJoined] = useState(false);
	const { sessionid } = useParams();
	// const sessionid = "0cd0f587-0d58-4cbe-babf-4679c19b97be";
	return (
		<div className="Video-Room">
			<h1>Agora Video Chat</h1>
			{!joined && <button onClick={() => setJoined(true)}>Join Room</button>}
			{joined && <RoomComponent sessionid={sessionid} />}
			{joined && <button onClick={() => setJoined(false)}>Leave Room</button>}
		</div>
	);
}
