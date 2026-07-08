import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VideoWatch from "./pages/VideoWatch";
import Upload from "./pages/Upload";
import Trending from "./pages/Trending";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/video/:id" element={<VideoWatch />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/trending" element={<Trending />} />
      </Routes>
    </>
  );
}

export default App;
