import { Route, Routes, useLocation } from "react-router-dom"
import { AuthProvider } from './AuthContext';
import { useEffect, useState } from "react";
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
import Schedule from "./pages/Schedule";
import Footer from "./components/Footer";
import MentorNavBar from "./components/MentorNavBar";
import SignInMentor from "./pages/SignInMentor";
import SignUpMentor from "./pages/SignUpMentor";
import MentorDashboard from "./pages/MentorDashboard";
import About from "./pages/About";
import useScrollToTop from "./utils/scrollHook";
import withLoading from "./utils/useWithLoading";


function App() {
  //const noAuth = ['dashboard', 'profile', 'browse', 'booking', 'room', 'sign'];
  const location = useLocation().pathname;
  const [isLoading, setIsLoading] = useState(false);
  const NavBarWithLoading = withLoading(NavBar);
  const MentorNavBarWithLoading = withLoading(MentorNavBar);
  const HomeWithLoading = withLoading(Home);
  const JoinUsWithLoading = withLoading(JoinUs);
  const SignInMentorWithLoading = withLoading(SignInMentor);
  const SignUpMentorWithLoading = withLoading(SignUpMentor);
  const MentorDashboardWithLoading = withLoading(MentorDashboard);
  const ProfileWithLoading = withLoading(Profile);
  const SignInWithLoading = withLoading(SignIn);
  const SignUpWithLoading = withLoading(SignUp);
  const AboutWithLoading = withLoading(About);
  const BrowserWithLoading = withLoading(Browser);
  const DashboardWithLoading = withLoading(Dashboard);
  const RoomWithLoading = withLoading(Room);
  const ScheduleWithLoading = withLoading(Schedule);
  const NotFoundWithLoading = withLoading(NotFound);

  useScrollToTop();

  return <>
    <AuthProvider>

      {!location.includes('sign') && 
        (!location.includes('mentor')
        ?
        <NavBar isLoading={isLoading} setIsLoading={setIsLoading} />
        :
        <MentorNavBar isLoading={isLoading} setIsLoading={setIsLoading} />)
      }
      
      <Routes>
        <Route path="/" element={<HomeWithLoading isLoading={isLoading} setIsLoading={setIsLoading} />}></Route>
        <Route path="/mentor" element={<JoinUsWithLoading isLoading={isLoading} setIsLoading={setIsLoading} />}></Route>
        <Route path="/mentor/sign-in" element={<SignInMentorWithLoading isLoading={isLoading} setIsLoading={setIsLoading} />}></Route>
        <Route path="/mentor/sign-up" element={<SignUpMentorWithLoading isLoading={isLoading} setIsLoading={setIsLoading} />}></Route>
        <Route path="/mentor/dashboard" element={<MentorDashboardWithLoading isLoading={isLoading} setIsLoading={setIsLoading} />}></Route>
        <Route path="/mentor/profile" element={<ProfileWithLoading isLoading={isLoading} setIsLoading={setIsLoading} />}></Route>
        <Route path="/sign-in" element={<SignInWithLoading isLoading={isLoading} setIsLoading={setIsLoading} />}></Route>
        <Route path="/sign-up" element={<SignUpWithLoading isLoading={isLoading} setIsLoading={setIsLoading}  />}></Route>
        <Route path="/about" element={<AboutWithLoading isLoading={isLoading} setIsLoading={setIsLoading}  />}></Route>
        <Route path="/browse" element={<BrowserWithLoading isLoading={isLoading} setIsLoading={setIsLoading}  />}></Route>
        <Route path="/dashboard" element={<DashboardWithLoading isLoading={isLoading} setIsLoading={setIsLoading}  />}></Route>
        <Route path="/profile" element={<ProfileWithLoading isLoading={isLoading} setIsLoading={setIsLoading}  />}></Route>
        <Route path="/dashboard" element={<BrowserWithLoading isLoading={isLoading} setIsLoading={setIsLoading}  />}></Route>
        <Route path="/room/:sessionid" element={<RoomWithLoading isLoading={isLoading} setIsLoading={setIsLoading}  />}></Route>
        <Route path="/booking/:username" element={<ScheduleWithLoading isLoading={isLoading} setIsLoading={setIsLoading}  />}></Route>
        <Route path="*" element={<NotFoundWithLoading isLoading={isLoading} setIsLoading={setIsLoading}  />}></Route>
      </Routes>
    </AuthProvider>
  </>
}

export default App
