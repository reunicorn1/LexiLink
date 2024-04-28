import React, { useEffect, useRef } from 'react'


const VideoPlayer = ({ user }) => {
    const ref = useRef()
    useEffect(() => {
        user.videoTrack.play(ref.current)
        const video = document.querySelector('video')
        video.play()
    }, [])



    return (
        <div className='video'>
            <video ref={ref}  autoPlay={true} />
        </div>
    )
}

export default VideoPlayer;