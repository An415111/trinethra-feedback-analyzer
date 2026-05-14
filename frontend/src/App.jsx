import { useState } from "react";
import axios from "axios";

function App() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeTranscript = async () => {
    if (!transcript.trim()) {
      alert("Please paste a transcript");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/analyze",
        { transcript }
      );

      setResult(response.data);

    } catch (error) {
      console.log(error);
      alert("Error analyzing transcript");

    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  };

  const cardStyle = {
    background: "#334155",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "12px"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "Arial",
        padding: "20px"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "38px",
            marginBottom: "10px"
          }}
        >
          Trinethra Supervisor Feedback Analyzer
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "30px",
            fontSize: "18px"
          }}
        >
          AI-assisted supervisor transcript analysis using Ollama LLM.
          Final decisions must be reviewed by a human evaluator.
        </p>

        <textarea
          rows="14"
          placeholder="Paste supervisor transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            padding: "20px",
            borderRadius: "16px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
            marginBottom: "25px"
          }}
        />

        <div style={{ textAlign: "center" }}>
          <button
            onClick={analyzeTranscript}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "14px 30px",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {loading ? "Analyzing..." : "Run Analysis"}
          </button>
        </div>

        <br /><br />

        {result && (
          <div>

            <div style={sectionStyle}>
              <h2>Suggested Score</h2>

              <p>
                <strong>Score:</strong> {result.score?.value}
              </p>

              <p>
                <strong>Label:</strong> {result.score?.label}
              </p>

              <p>
                <strong>Justification:</strong>
                <br />
                {result.score?.justification}
              </p>
            </div>

            <div style={sectionStyle}>
              <h2>Evidence</h2>

              {result.evidence?.map((item, index) => (
                <div key={index} style={cardStyle}>
                  <p>
                    <strong>Type:</strong> {item.type}
                  </p>

                  <p>
                    <strong>Description:</strong>
                    <br />
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={sectionStyle}>
              <h2>KPI Mapping</h2>

              {result.kpiMapping?.map((item, index) => (
                <div key={index} style={cardStyle}>
                  <p>
                    <strong>KPI:</strong> {item.kpi}
                  </p>

                  <p>
                    <strong>Evidence:</strong>
                    <br />
                    {item.evidence}
                  </p>
                </div>
              ))}
            </div>

            <div style={sectionStyle}>
              <h2>Gap Analysis</h2>

              {result.gaps?.map((item, index) => (
                <div key={index} style={cardStyle}>
                  <p>
                    <strong>Type:</strong> {item.type}
                  </p>

                  <p>
                    <strong>Description:</strong>
                    <br />
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={sectionStyle}>
              <h2>Follow-up Questions</h2>

              {result.followUpQuestions?.map((item, index) => (
                <div key={index} style={cardStyle}>
                  <p>
                    <strong>Question:</strong>
                    <br />
                    {item.question}
                  </p>
                </div>
              ))}
            </div>

            <p
              style={{
                textAlign: "center",
                color: "#f87171",
                fontWeight: "bold",
                marginTop: "20px",
                fontSize: "16px"
              }}
            >
              AI-generated draft. Human review required.
            </p>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;