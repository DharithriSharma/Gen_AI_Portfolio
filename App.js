import React, { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return alert("Please enter a prompt!");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/generate",
        { prompt },
        { responseType: "blob" }
      );
      const imageUrl = URL.createObjectURL(response.data);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>DreamScape - AI Art Generator</h1>
      <textarea
        placeholder="Enter your prompt (e.g., 'a futuristic cityscape at sunset')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={styles.textarea}
      />
      <button onClick={generateImage} disabled={loading} style={styles.button}>
        {loading ? "Generating..." : "Generate Art"}
      </button>
      {image && (
        <div style={styles.imageContainer}>
          <img src={image} alt="Generated Art" style={styles.image} />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  textarea: {
    width: "300px",
    height: "100px",
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  imageContainer: {
    marginTop: "20px",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "10px",
  },
};

export default App;