import React from 'react';
import 'ldrs/ring'
import { helix } from 'ldrs'

helix.register()

// Default values shown
const LoadingSpinner = () => (
    <div
    style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    }}
>
    <l-helix
        size="150"
        speed="4.5"
        color="black"
 
    ></l-helix>
</div>

);

export default LoadingSpinner;