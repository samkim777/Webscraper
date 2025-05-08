import { useState } from "react";

export default function PromptInput({ onSubmit }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        placeholder="What are you shopping for?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded mb-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate
      </button>
    </form>
  );
}
