import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/video/${video._id}`)}
    >
      {/* Thumbnail */}
      <div style={styles.thumbnailContainer}>
        <img
          src={video.thumbnail}
          alt={video.title}
          style={styles.thumbnail}
        />
        <span style={styles.duration}>
          {Math.floor(video.duration / 60)}:
          {String(Math.floor(video.duration % 60)).padStart(2, "0")}
        </span>
      </div>

      {/* Video Info */}
      <div style={styles.info}>
        <h3 style={styles.title}>{video.title}</h3>
        <p style={styles.channel}>
          {video.owner?.username || "Unknown"}
        </p>
        <p style={styles.views}>
          {video.viewCount} views •{" "}
          {new Date(video.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s",
    width: "300px",
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
    overflow: "hidden",
  },
  thumbnail: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  duration: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    backgroundColor: "rgba(0,0,0,0.8)",
    color: "#ffffff",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  info: {
    padding: "12px",
  },
  title: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "6px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  channel: {
    color: "#aaaaaa",
    fontSize: "13px",
    marginBottom: "4px",
  },
  views: {
    color: "#aaaaaa",
    fontSize: "12px",
  },
};

export default VideoCard;