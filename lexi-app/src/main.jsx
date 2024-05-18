import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme  } from '@chakra-ui/react';
import App from './App.jsx';
import './styles.css';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "@fontsource/work-sans";
import "@fontsource/montserrat";
import "@fontsource-variable/montserrat"

const client_id= import.meta.env.VITE_CLIENT_ID

const colors = {
  brand: {
    900: '#f2e8dd',
    800: '#083d77',
    700:'#dd4e40', 
    600: '#74b0ab',
    200: '#A9A9A9',
    100: '#191919'
  },
  fonts: {
    body: `'Work Sans', 'sans-serif'`,
    heading: `'Montserrat', 'sans-serif'`
  }
}

const theme = extendTheme({ colors })


ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <GoogleOAuthProvider clientId={client_id}> 
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </GoogleOAuthProvider>
  </ChakraProvider>
);