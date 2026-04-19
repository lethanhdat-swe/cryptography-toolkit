import { useState } from "react";
import CryptoJS from "crypto-js";

function Hashing() {
  const [text, setText] = useState("");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [result, setResult] = useState("");

  const handleHash = () => {
    if (!text) return;

    let hash = "";

    if (algorithm === "SHA-256") {
      hash = CryptoJS.SHA256(text).toString();
    } else if (algorithm === "MD5") {
      hash = CryptoJS.MD5(text).toString();
    }

    setResult(hash);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>Hashing Tool</h3>

        <label style={styles.label}>Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          style={styles.input}
        >
          <option>SHA-256</option>
          <option>MD5</option>
        </select>

        <label style={styles.label}>Input</label>
        <textarea
          placeholder="Enter text to hash..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ ...styles.input, height: "100px" }}
        />

        <button onClick={handleHash} style={styles.buttonPrimary}>
          Generate Hash
        </button>

        <label style={styles.label}>Result</label>
        <textarea
          value={result}
          readOnly
          style={{ ...styles.input, height: "100px", background: "#f3f4f6" }}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "#f9fafb",
    minHeight: "100vh",
  },
  card: {
    width: "500px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "20px",
    fontWeight: "bold",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  buttonPrimary: {
    width: "100%",
    padding: "12px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "15px",
  },
};

export default Hashing;