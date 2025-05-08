import { useState } from "react";
import PromptInput from "./components/PromptInput";

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePromptSubmit = async (input) => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResults(data.suggestions); // <- now shows up in the UI
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
      {loading && <p>Loading suggestions...</p>}

      {results.map((suggestion, i) => (
        <div key={i} className="border p-4 my-4 rounded shadow">
          <h2 className="text-xl font-bold mb-1">{suggestion.name}</h2>
          <p className="text-gray-600 mb-3">{suggestion.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {suggestion.products.map((product, j) => (
              <div key={j} className="border p-2 rounded shadow hover:shadow-lg">
                <img src={product.Image} alt={product.Name} className="h-32 object-contain mb-2 mx-auto" />
                <p className="font-medium text-sm">{product.Name}</p>
                <p className="text-green-600 text-sm">{product.Price}</p>
                <p className="text-yellow-600 text-xs">{product.Rating}</p>
                <a href={product.Link} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline block mt-1">
                  View on Amazon
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;