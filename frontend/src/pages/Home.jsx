import { useState, useEffect } from "react";
import api from "../utils/axios";
import VideoCard from "../components/VideoCard";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get("/videos");
      setVideos(response.data.data);
    } catch (err) {
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <p>Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Videos</h2>
      {videos.length === 0 ? (
        <div style={styles.center}>
          <p style={styles.noVideos}>
            No videos yet. Be the first to upload!
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heading: {
    color: "#ffffff",
    fontSize: "20px",
    marginBottom: "24px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  },
  error: {
    color: "#ff4444",
    fontSize: "16px",
  },
  noVideos: {
    color: "#aaaaaa",
    fontSize: "16px",
  },
};

export default Home;