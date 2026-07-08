import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";

function VideoWatch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchVideo();
    fetchComments();
    if (user) {
      fetchLikeStatus();
    }
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${id}`);
      setVideo(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch video");
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/video/${id}`);
      setComments(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const response = await api.get(`/likes/video/${id}/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLiked(response.data.data.isLiked);
      setLikeCount(response.data.data.likeCount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!user) return alert("Please login to like videos");
    try {
      await api.post(`/likes/video/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return alert("Please login to subscribe");
    try {
      await api.post(`/subscriptions/channel/${video.owner._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscribed(!subscribed);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    if (!newComment.trim()) return;

    try {
      const response = await api.post(
        `/comments/video/${id}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([response.data.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <p>Loading video...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div style={styles.center}>
        <p style={styles.error}>{error || "Video not found"}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Video Player */}
      <div style={styles.playerSection}>
        <video
          style={styles.player}
          src={video.videoFile}
          controls
          autoPlay
        />

        {/* Video Info */}
        <div style={styles.videoInfo}>
          <h1 style={styles.title}>{video.title}</h1>

          <div style={styles.metaRow}>
            <span style={styles.views}>
              {video.viewCount} views
            </span>

            <div style={styles.actions}>
              {/* Like Button */}
              <button
                style={{
                  ...styles.actionBtn,
                  backgroundColor: liked ? "#ff0000" : "transparent",
                }}
                onClick={handleLike}
              >
                👍 {likeCount}
              </button>
            </div>
          </div>

          {/* Channel Info */}
          <div style={styles.channelRow}>
            <div style={styles.channelInfo}>
              <div style={styles.avatar}>
                {video.owner?.username?.[0]?.toUpperCase()}
              </div>
              <span style={styles.channelName}>
                {video.owner?.username}
              </span>
            </div>

            {user && user._id !== video.owner?._id && (
              <button
                style={{
                  ...styles.subscribeBtn,
                  backgroundColor: subscribed ? "#333" : "#ff0000",
                }}
                onClick={handleSubscribe}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>

          {/* Description */}
          {video.description && (
            <div style={styles.description}>
              <p>{video.description}</p>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div style={styles.commentsSection}>
          <h3 style={styles.commentsTitle}>
            {comments.length} Comments
          </h3>

          {/* Add Comment */}
          {user && (
            <form onSubmit={handleComment} style={styles.commentForm}>
              <input
                style={styles.commentInput}
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button style={styles.commentBtn} type="submit">
                Post
              </button>
            </form>
          )}

          {/* Comments List */}
          <div style={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment._id} style={styles.comment}>
                <div style={styles.commentAvatar}>
                  {comment.owner?.username?.[0]?.toUpperCase()}
                </div>
                <div style={styles.commentContent}>
                  <span style={styles.commentUsername}>
                    {comment.owner?.username}
                  </span>
                  <p style={styles.commentText}>{comment.content}</p>
                </div>
                {user && user._id === comment.owner?._id && (
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px",
  },
  playerSection: {
    width: "100%",
  },
  player: {
    width: "100%",
    borderRadius: "8px",
    backgroundColor: "#000",
    maxHeight: "500px",
  },
  videoInfo: {
    padding: "16px 0",
  },
  title: {
    color: "#ffffff",
    fontSize: "20px",
    marginBottom: "12px",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  views: {
    color: "#aaaaaa",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  actionBtn: {
    padding: "8px 16px",
    border: "1px solid #333",
    borderRadius: "20px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  },
  channelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderTop: "1px solid #333",
    borderBottom: "1px solid #333",
    marginBottom: "16px",
  },
  channelInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ff0000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "16px",
  },
  channelName: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
  },
  subscribeBtn: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  description: {
    backgroundColor: "#2a2a2a",
    padding: "16px",
    borderRadius: "8px",
    color: "#aaaaaa",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  commentsSection: {
    marginTop: "24px",
  },
  commentsTitle: {
    color: "#ffffff",
    fontSize: "16px",
    marginBottom: "16px",
  },
  commentForm: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  commentInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
  },
  commentBtn: {
    padding: "10px 20px",
    backgroundColor: "#ff0000",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  commentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  comment: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  commentAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "14px",
    flexShrink: 0,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "bold",
    marginRight: "8px",
  },
  commentText: {
    color: "#aaaaaa",
    fontSize: "14px",
    marginTop: "4px",
  },
  deleteBtn: {
    padding: "4px 8px",
    backgroundColor: "transparent",
    color: "#ff4444",
    border: "1px solid #ff4444",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
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
};

export default VideoWatch;