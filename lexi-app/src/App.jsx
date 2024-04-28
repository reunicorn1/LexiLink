import { Route, Routes, useLocation } from "react-router-dom"
import { AuthProvider } from './AuthContext';
import Home from "./pages/Home"
import NavBar from "./components/NavBar"
import JoinUs from "./pages/JoinUs"
import SignIn from "./pages/SignIn"
import Browser from "./pages/Browser"
import SignUp from "./pages/SignUp"
import NotFound from "./pages/NotFound"
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Room from "./pages/Room"


function App() {
  const location = useLocation().pathname;
  return <>
    
    <AuthProvider>
      {!location.includes('sign') && <NavBar />}
      <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/join-us" element={<JoinUs />}></Route>
            <Route path="/sign-in" element= {<SignIn />}></Route>
            <Route path="/sign-up" element={<SignUp />}></Route>
            <Route path="/browse" element={<Browser />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/dashboard" element={<Browser />}></Route>
			      <Route path="/room" element={<Room />}></Route>
            <Route path="*" element={<NotFound />}></Route>
      </Routes>
   </AuthProvider>
  </>
}

export default App
