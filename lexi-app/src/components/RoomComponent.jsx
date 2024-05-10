import React, { useEffect, useState } from 'react';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useWithRefresh } from '../utils/useWithRefresh';



const RoomComponent = ({ sessionid }) => {
  const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });
  const { authToken } = useAuth();
  let token = null;
  let localUid = null;
  let channel = null;
  const getToken = async () => {
    await executor(
      (token) => axios.get(`http://127.0.0.1:5000/sessions/room/${sessionid}`, { headers: { Authorization: "Bearer " + token } }),
      (response) => {
        token = response.data.token;
        localUid = response.data.uid;
        channel = response.data.channel;
      }
    );
    return token, localUid, channel;
  };
  let config = {
    appid: import.meta.env.VITE_AGORA_APPID,
    token: token,
    uid: localUid,
    channel: channel
  };
  let localTracks = {
    audioTrack: null,
    videoTrack: null
  }
  let localTrackState = {
    audioTrackMuted: false,
    videoTrackMuted: false
  }
  let localUser = null
  let remoteTracks = {}
  let client = null
  let remoteUid = null
  const playerHtml = (uid) => (
    `<div class="video-containers" id="video-wrapper-${uid}">
      <p class="user-uid"><img class="volume-icon" id="volume-${uid}" src="/img/assets/volume-on.svg" /></p>
      <div class="video-player player" id="stream-${uid}"></div>
    </div>`
  );


  const joinStreams = async () => {
    client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);
    client.on('volume-indicator', handleVolumeIndicator);
    client.enableAudioVolumeIndicator();
    console.log('joinStreams called');
    console.log('config token', config.token);
    console.log('config uid', config.uid);
    console.log('config channel', config.channel);
    [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
      client.join(config.appid, config.channel, config.token || null, config.uid || null),
      AgoraRTC.createMicrophoneAudioTrack(
        // {
        //   encoderConfig: {
        //     sampleRate: { min: 8000, ideal: 16000, max: 16000 },
        //     channels: { min: 1, ideal: 2, max: 2 },
        //   },
        // },
        // true,
        // {
        //   encoderFallback: true,
        // }

      ),
      AgoraRTC.createCameraVideoTrack(
        // {
        //   encoderConfig: {
        //     width: { min: 640, ideal: 1920, max: 1920 },
        //     height: { min: 480, ideal: 1080, max: 1080 },
        //     frameRate: { min: 15, ideal: 30, max: 60 },
        //   },
        // },
        // true,
        // {
        //   encoderFallback: true,
        // }
      )
    ]).catch(err => {
      console.log('errortest');
      console.error(err);
    });
    localUid = config.uid;

    console.log('localTracks', localTracks);
    try {
      if (localTracks.audioTrack) {

        await localTracks.audioTrack.setEnabled(true);
        await localTracks.audioTrack.setMuted(localTrackState.audioTrackMuted);
      }
      if (localTracks.videoTrack) {
        await localTracks.videoTrack.setEnabled(true);
        await localTracks.videoTrack.setMuted(localTrackState.videoTrackMuted);
      }
    } catch (err) {
      console.error(err);
    }

    const player = document.getElementById('user-streams');
    if (!player) {
      console.error('Player element not found.');
    }
    if (localTracks.videoTrack && player) {
      //   const playerHtml = (uid) => (
      //     `<div class="video-containers" id="video-wrapper-${uid}">
      //   <p class="user-uid"><img class="volume-icon" id="volume-${uid}" src="/img/assets/volume-on.svg" /></p>
      //   <div class="video-player player" id="stream-${uid}"></div>
      // </div>`
      //   );


      player.insertAdjacentHTML('beforeend', playerHtml(config.uid));
      localTracks.videoTrack.play(`stream-${config.uid}`);
      const userVideo = document.getElementById(`video-wrapper-${config.uid}`);
      player.querySelector('p > img').insertAdjacentHTML('beforeend', `<p class="user-uid">${localUser}</p>`);
      userVideo.classList.add('video-player');
      if (localUid === config.uid) {
        userVideo.classList.add('small');
      }
      player.style.display = 'grid';
    }
    else {
      console.error('Local video track not found.');
    }
    console.log('publishing');
    await client.publish([localTracks.audioTrack, localTracks.videoTrack]);
  };



  const handleJoinButtonClick = async () => {
    console.log('handleJoinButtonClick called');
    token, localUid, channel = await getToken();
    config.token = token;
    config.uid = localUid;
    config.channel = channel;
    localUser = document.getElementById('username').value;
    if (!username) return;
    document.getElementById('join-wrapper').style.display = 'none';
    document.getElementById('foot').style.display = 'flex';
    await joinStreams();
  };




  const handleMicClick = () => {
    const handleMicButtonClick = async () => {
      console.log('handleMicButtonClick called');
      console.log('localTracks', localTracks);
      if (!localTracks.audioTrack) return;
      if (!localTrackState.audioTrackMuted) {
        await localTracks.audioTrack.setMuted(true);
        localTrackState.audioTrackMuted = true;
        console.log('localUid', localUid)
        document.getElementById(`volume-${localUid}`).src = '/img/assets/volume-off.svg';
        document.getElementById('mic-btn').style.backgroundColor = 'red';
      } else {
        await localTracks.audioTrack.setMuted(false);
        localTrackState.audioTrackMuted = false;
        document.getElementById(`volume-${localUid}`).src = '/img/assets/volume-on.svg';
        document.getElementById('mic-btn').style.backgroundColor = 'greenf';

        micvar = !micvar;
        t
      }
    };
    handleMicButtonClick();
  }

  const handleCameraButtonClick = async () => {
    // setcamera(!camera);
    console.log('handleCameraButtonClick called');
    if (!localTrackState.videoTrackMuted) {
      await localTracks.videoTrack.setMuted(true);
      localTrackState.videoTrackMuted = true;
      document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
    } else {
      await localTracks.videoTrack.setMuted(false);
      localTrackState.videoTrackMuted = false;
      document.getElementById('camera-btn').style.backgroundColor = '#1f1f1f8e';
    }
  };

  const handleLeaveButtonClick = async () => {
    console.log('handleLeaveButtonClick called');
    document.getElementById('join-wrapper').style.display = 'none';
    document.getElementById('foot').style.display = 'block';
    document.getElementById('user-streams').style.display = 'none';
    document.getElementById('user-streams').innerHTML = '';
    // add class to user-streams

    console.log('Disconnecting from channel');
    for (const trackName in localTracks) {
      let track = localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
        localTracks[trackName] = null;
        track = null;
      }
    }
    await client.leave();
    console.log('Disconnected from channel');
    // remove class from user-streams
    document.getElementById('user-streams').classList.remove('small');
    document.getElementById('user-streams').classList.remove('video-player');
    document.getElementById('user-streams').classList.remove('large');
    document.getElementById('user-streams').style.display = 'none';
    document.getElementById('user-streams').innerHTML = '';
    remoteTracks = {};
    localTracks = {};
    localTrackState = {};
    localUser = '';
    localUid = '';
    remoteUid = '';
    config = {};

    window.location.reload();
  };

  const handleUserJoined = async (user, mediaType) => {
    console.log('handleUserJoined called');
    console.log('user', user);
    console.log('mediaType', mediaType);
    console.log('remoteTracks', remoteTracks);
    remoteTracks[user.uid] = user;
    console.log('number of users connected pre join: ', client.remoteUsers.length);
    if (client.remoteUsers.length > 1) {
      //  block user from joining
      console.log('block user from joining');
      handleUserLeft(user);
      handleLeaveButtonClick();
      return;
    }
    console.log('number of users connected: ', client.remoteUsers.length);
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      const player = document.getElementById('user-streams');
      if (player) {
        player.style.display = 'flex';
        player.insertAdjacentHTML('beforeend', playerHtml(user.uid));
        const userVideo = document.getElementById(`video-wrapper-${user.uid}`);
        console.log('useid', user.uid)
        user.videoTrack.play(`stream-${user.uid}`);
        userVideo.classList.add('video-player');
        console.log('applyuing class')
        if (localUid === config.uid) {
          const videoWrapper = document.getElementById(`video-wrapper-${localUid}`);
          if (videoWrapper) {
            videoWrapper.classList.add('small');
            console.log('small class applied')
          } else {
            console.error(`Element with id video-wrapper-${config.uid} not found`);
          }
        }
        else {
          userVideo.classList.add('large');
        }
      }
      else {
        console.error('Player element not found.');
      }
    }

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    const newRemoteTracks = { ...remoteTracks };
    delete newRemoteTracks[user.uid];
    remoteTracks = newRemoteTracks;
    const player = document.getElementById(`video-wrapper-${user.uid}`);
    if (player) player.remove();
    client.unsubscribe(user);
    // handleLeaveButtonClick();
  };

  const handleVolumeIndicator = (evt) => {
    for (let i = 0; evt.length > i; i++) {
      const speaker = evt[i].uid;
      const volume = evt[i].level;
      const element = document.getElementById(`volume-${speaker}`);
      if (element) {
        element.src = volume > 0 ? '/img/assets/volume-on.svg' : '/img/assets/volume-off.svg';
      }
    }
  };


  return (
    <div className='room'>
      <div id="join-wrapper">
        <input type="text" id="username" />
        <button id="join-btn" onClick={handleJoinButtonClick}>Join</button>
      </div>
      <div id="user-streams">
        <div id="foot" style={{ display: 'block' }}>
          <button id='mic-btn' onClick={handleMicClick}>Toggle Microphone</button>
          <button id="camera-btn" onClick={handleCameraButtonClick}>Toggle Camera</button>
          <button id="leave-btn" onClick={handleLeaveButtonClick}>Leave Room</button>
        </div>
      </div>
    </div>
  );
};

export default RoomComponent;
