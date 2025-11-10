import { BrowserRouter, Routes, Route } from "react-router-dom";
import MvpLandingPage from "./pages/MvpLandingPage";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Games from "./pages/Games";
import GetStarted from "./pages/GetStarted";
import Profile from "./pages/Profile";
import Quiz1 from "./pages/Quiz1"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MvpLandingPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/games" element={<Games />} />
        <Route path="/get-started" element={<GetStarted />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/quiz1" element={<Quiz1 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
