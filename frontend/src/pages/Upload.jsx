import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProgress("Uploading video...");

    try {
      // use FormData for file uploads
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      const response = await api.post("/videos/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProgress("Upload complete!");
      navigate(`/video/${response.data.data._id}`);

    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  // check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Upload Video</h2>

        {error && <p style={styles.error}>{error}</p>}
        {progress && <p style={styles.progress}>{progress}</p>}

        <form onSubmit={handleUpload}>
          <label style={styles.label}>Title</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            placeholder="Enter video description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          <label style={styles.label}>Video File</label>
          <input
            style={styles.fileInput}
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
          />

          <label style={styles.label}>Thumbnail</label>
          <input
            style={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            required
          />

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Uploading... Please wait" : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 24px",
    backgroundColor: "#0f0f0f",
    minHeight: "100vh",
  },
  box: {
    backgroundColor: "#1a1a1a",
    padding: "40px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "600px",
    height: "fit-content",
  },
  title: {
    color: "#ffffff",
    fontSize: "24px",
    marginBottom: "24px",
  },
  label: {
    display: "block",
    color: "#aaaaaa",
    fontSize: "14px",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  fileInput: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#2a2a2a",
    color: "#aaaaaa",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#ff0000",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    marginTop: "8px",
  },
  error: {
    color: "#ff4444",
    marginBottom: "16px",
    fontSize: "14px",
  },
  progress: {
    color: "#44ff44",
    marginBottom: "16px",
    fontSize: "14px",
  },
};

export default Upload;