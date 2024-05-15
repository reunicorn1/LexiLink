import React, { useState } from "react";
import { useParams } from "react-router-dom";
import RoomComponent from "../components/RoomComponent";

export default function Room() {
	const [joined, setJoined] = useState(false);
	const { sessionid } = useParams();
	return (
		<div className="Video-Room">
			{<RoomComponent sessionid={sessionid} />}
		</div>
	);
}
