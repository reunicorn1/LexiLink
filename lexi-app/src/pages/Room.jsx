import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomComponent from "../components/RoomComponent";
import { useEffect } from "react";
import { useAuth } from '../AuthContext';



export default function Room() {
	const { sessionid } = useParams();
	const navigate = useNavigate();
	const { role } = useAuth();

	useEffect(() => {
        if (!role) {
            navigate("/");
        }
    }, [])
	return (
		<div className="Video-Room">
			{<RoomComponent sessionid={sessionid}  />}
		</div>
	);
}
