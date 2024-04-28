import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme  } from '@chakra-ui/react';
import App from './App.jsx';
import './styles.css';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';


const colors = {
  brand: {
    900: '#f2e8dd',
    800: '#083d77',
    700: '#dd4e40',
    600: '#74b0ab',
    200: '#A9A9A9'
  },
  fonts: {
    body: "Work Sans, sans-serif", // For the body text
    heading: "Montserrat, sans-serif", // For headings
    // Add more font styles as needed
  }
}

const theme = extendTheme({ colors })


ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <GoogleOAuthProvider clientId="76995164858-097b9m0l06ct4h8342cdb70srium1abr.apps.googleusercontent.com">
      {/* <React.StrictMode> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      {/* </React.StrictMode> */}
    </GoogleOAuthProvider>
  </ChakraProvider>
);