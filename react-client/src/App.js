import { useState } from "react";
import PromptInput from "./components/PromptInput";
import SuggestionCard from "./components/SuggestionCard";


function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const SERVER_URL = process.env.REACT_APP_API_URL;

  const handlePromptSubmit = async (input) => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`${SERVER_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResults(data.suggestions);
    } catch (err) {
      console.error("❌ Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">🛍️ AI Shopping Assistant For Amazon</h1>
      <PromptInput onSubmit={handlePromptSubmit} />
      {loading && (
        <div className="flex justify-center items-center my-6">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-blue-600">Loading suggestions...</span>
        </div>
      )}
      {results.map((s, idx) => (
        <SuggestionCard key={idx} suggestion={s} />
      ))}

    </div>
  );
}

export default App;