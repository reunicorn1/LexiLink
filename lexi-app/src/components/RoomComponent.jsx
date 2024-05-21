import React, { useEffect, useState } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from 'axios';
import { useAuth } from '../AuthContext';
import  useAxiosPrivate  from '../utils/useAxiosPrivate';
import { Button, Heading, Text, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const RoomComponent = ({ sessionid,  }) => {
  const executor = useAxiosPrivate();
  const navigate = useNavigate();
  let token = null;
  let localUid = null;
  let channel = null;

  const getToken = async () => {
      const response = await executor.get(`/sessions/room/${sessionid}`);     
      if (!response || response.status !== 200) {
        throw new Error('Failed to get token');
      }
      else {
        token = response.data.token;
        localUid = response.data.uid;
        channel = response.data.channel;
        return token, localUid, channel;
      }
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
      console.error(err);
    });
    localUid = config.uid;

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
    await client.publish([localTracks.audioTrack, localTracks.videoTrack]);
  };



  const handleJoinButtonClick = async () => {
    token, localUid, channel = await getToken();
    config.token = token;
    config.uid = localUid;
    config.channel = channel;
    // get user's name 
    // localUser = ;
    // if (!username) return;
    document.getElementById('join-wrapper').style.display = 'none';
    document.getElementById('foot').style.display = 'flex';
    await joinStreams();
  };




  const handleMicClick = () => {
    const handleMicButtonClick = async () => {
      if (!localTracks.audioTrack) return;
      if (!localTrackState.audioTrackMuted) {
        await localTracks.audioTrack.setMuted(true);
        localTrackState.audioTrackMuted = true;
        document.getElementById(`volume-${localUid}`).src = '/img/assets/volume-off.svg';

        document.getElementById('mic-btn').style.backgroundColor = 'red';
      } else {
        await localTracks.audioTrack.setMuted(false);
        localTrackState.audioTrackMuted = false;
        document.getElementById(`volume-${localUid}`).src = '/img/assets/volume-on.svg';
        document.getElementById('mic-btn').style.backgroundColor = '';

      }
    };
    handleMicButtonClick();
  }

  const handleCameraButtonClick = async () => {
    // setcamera(!camera);
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
    document.getElementById('join-wrapper').style.display = 'none';
    document.getElementById('foot').style.display = 'block';
    document.getElementById('user-streams').style.display = 'none';
    document.getElementById('user-streams').innerHTML = '';
    // add class to user-streams

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

    navigate('/');
  };

  const handleUserJoined = async (user, mediaType) => {
    remoteTracks[user.uid] = user;
    if (client.remoteUsers.length > 1) {
      //  block user from joining
      handleUserLeft(user);
      handleLeaveButtonClick();
      return;
    }
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      const player = document.getElementById('user-streams');
      if (player) {
        player.style.display = 'flex';
        player.insertAdjacentHTML('beforeend', playerHtml(user.uid));
        const userVideo = document.getElementById(`video-wrapper-${user.uid}`);
        user.videoTrack.play(`stream-${user.uid}`);
        userVideo.classList.add('video-player');
        if (localUid === config.uid) {
          const videoWrapper = document.getElementById(`video-wrapper-${localUid}`);
          if (videoWrapper) {
            videoWrapper.classList.add('small');
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
        const agora_video_player = document.getElementsByClassName('agora_video_player');
    if (agora_video_player) {
        agora_video_player[1].style = 'object-fit: contain; width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;';
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
        <Flex  id='join-wrapper'
          direction={'row'}
          justify={'space-around'}
          align={'center'}
          wrap={'wrap'}
        >
        <Heading>You are in the waiting room</Heading>
        <Text fontSize={'xl'}>Click the button below to join the meeting</Text>
        <Button width={'50%'} mt={4} bg='brand.700' color={'white'} fontSize={'x-large'} size={'lg'} onClick={handleJoinButtonClick}>Join</Button>
        </Flex>
      <div id="user-streams">
        <div id="foot" style={{ display: 'block' }}>
          <button id='mic-btn' onClick={handleMicClick}><img height={20} width={20} src="/img/assets/microphone.svg" alt="Toggle Mic"></img></button>
          <button id="camera-btn" onClick={handleCameraButtonClick}><img height={30} width={30} src="/img/assets/video.svg" alt="Toggle Camera"></img></button>
          <button id="leave-btn" onClick={handleLeaveButtonClick}><img height={25} width={25} src="/img/assets/leave.svg" alt="Leave"></img></button>
        </div>
      </div>
    </div>
  );
};

export default RoomComponent;