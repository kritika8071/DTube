import { useState, useEffect } from "react";
import api from "../utils/axios";
import VideoCard from "../components/VideoCard";

function Trending() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await api.get("/trending");
      setVideos(response.data.data);
    } catch (err) {
      setError("Failed to fetch trending videos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <p>Loading trending videos...</p>
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
      <h2 style={styles.heading}>🔥 Trending Videos</h2>
      {videos.length === 0 ? (
        <div style={styles.center}>
          <p style={styles.noVideos}>No trending videos yet!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {videos.map((video, index) => (
            <div key={video._id} style={styles.trendingItem}>
              <span style={styles.rank}>#{index + 1}</span>
              <VideoCard video={video} />
            </div>
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
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  trendingItem: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  rank: {
    color: "#ff0000",
    fontSize: "32px",
    fontWeight: "bold",
    minWidth: "60px",
    textAlign: "center",
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

export default Trending;