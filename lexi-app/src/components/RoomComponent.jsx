import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import AgoraRTC from 'agora-rtc-sdk-ng';

import {
  onCameraChanged,
  onMicrophoneChanged
} from "agora-rtc-sdk-ng/esm"

import VideoPlayer from './VideoPlayer';

const token = '007eJxTYAjN/lD9uKLRMSQi5LrBzqZKbgHFy89uRB92XFzjsD/iVLkCg5lFWlKKsXFSorG5sYmBgamlcUpKcmJqoolZkolFWooR+2KdtIZARgYr8WJmRgYIBPFZGHJSKzIZGABIAx6j';
const appID = '68fbd33ba373400593ddcaea46b48fd2';
const channel = 'lexi';
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
onCameraChanged((device) => {
  console.log("oncamerachanged: ", device);
})
onMicrophoneChanged((device) => {
  console.log("onmicrophonechanged: ", device);
})
const RoomComponent = () => {

  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const uid = String(Math.floor(Math.random() * 1000000));
  const [localUid, setLocalUid] = useState(uid);
  const [audioTrack, setAudioTrack] = useState();
  const [videoTrack, setVideoTrack] = useState();


  const turnOnCamera = async (flag) => {
    flag = flag ?? !isVideoOn;
    setIsVideoOn(flag);

    if (videoTrack) {

      return videoTrack.setEnabled(flag);
    }
    videoTrack = await createCameraVideoTrack();
  };

  const turnOnMicrophone = async (flag) => {
    flag = flag ?? !isAudioOn;
    setIsAudioOn(flag);

    if (audioTrack) {
      return audioTrack.setEnabled(flag);
    }

    audioTrack = await createMicrophoneAudioTrack();
    // audioTrack.play();
  };

  const [isJoined, setIsJoined] = useState(false);
  const joinChannel = async () => {
    if (!channel.current) {
      channel.current = "react-room";
    }

    if (isJoined) {
      await leaveChannel();
    }

    client.on("user-published", handleUserJoined);

    ID
    console.log("joined channel");
    setIsJoined(true);
  };


  const leaveCall = async () => {
    await client.leave();
    window.location.reload();
  };
  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      // const remoteTrack = await client.subscribe(user, mediaType);
      // remoteTrack.play(user.uid);
      setVideoTrack(user.videoTrack);
      setUsers((previousUsers) => [...previousUsers, user]);
    }
    if (mediaType === 'audio') {
      // const remoteTrack = await client.subscribe(user, mediaType);
      // remoteTrack.play();
      setAudioTrack(user.audioTrack);
      user.audioTrack.play();
    }
    // make video class large
    document.querySelector(`.video-player`).classList.replace('large');

  };


  const handleUserLeft = (user) => {
    setUsers((previousUsers) => previousUsers.filter((u) => u.uid !== user.uid));
  };
  useEffect(() => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client
      .join(appID, channel, token, uid)
      .then((uid) =>
        Promise.all([
          AgoraRTC.createMicrophoneAndCameraTracks(
            {
              audio: {
                autoGainControl: true,
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 48000,
              },
              video: {
                frameRate: 30,
                facingMode: "user",
              },
            }

          ).catch((e) => console.error(e)),

          uid,
        ])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks)
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);




      });
    return () => {

      // cleanup
      const tracks = localTracks.map((track) => track.trackId);

      client.off('user-published', handleUserJoined);
      client.off('user-left', handleUserLeft);
      client.unpublish(tracks).then(() => client.leave());
    };

  }, []);




  return (
    <section className="room">
      <div id="videos">
        {users.map((user) => {
          return (
            <div
              key={user.uid}
              className={`video-player ${user.uid === localUid && isVideoOn ? 'small' : 'large'}`}
              hidden={user.uid === localUid ? !isVideoOn : false}
            >
              <VideoPlayer user={user} />
            </div>
          );
        })}

        <div className="controls">
          {(
            <>
              <button
                onClick={() => turnOnMicrophone()}
                className={isAudioOn ? "button-on" : ""}
              >
                Turn {isAudioOn ? "off" : "on"} Microphone
              </button>
              <button
                onClick={() => turnOnCamera()}
                className={isVideoOn ? "button-on" : ""}
              >
                Turn {isVideoOn ? "off" : "on"} camera
              </button>
              <button onClick={leaveCall}>Leave Call</button>
            </>
          )}
        </div>
      </div>

      {/* <div className="chat-room">
				<ul className="messages">
					{messages.map((message, index) => (
						<li key={index}>{message}</li>
					))}
				</ul>
				<form onSubmit={handleSendMessage}>
					<input
						type="text"
						value={newMessage}
						onChange={handleNewMessageChange}
						placeholder="Type your message here"
					/>
					<button className='text-md p-2 pt-1 pb-1 rounded text-white' type="submit">Send</button>
				</form>
			</div> */}
    </section>
  );
};

export default RoomComponent;