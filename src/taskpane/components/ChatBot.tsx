import React, { useState } from "react";

import { getSelectedData, addParagraph, getDocumentText } from "../taskpane";

const ChatBot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSelection = () => {
    getSelectedData().then((data) => {
      setQuestion(data);
    });
  };

  interface ResponseData {
    response_time?: string;
    answer?: string;
    error?: string;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (res.ok) {
        const data: ResponseData = await res.json();
        setResponse(data);
      } else {
        setResponse({ error: "Failed to get a response from the server." });
      }
    } catch (error) {
      setResponse({ error: "An error occurred while connecting to the server." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContext = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);

    // set response to the document text for 5 seconds
    setResponse("Updating context with the current document.");

    try {
      const documentText = await getDocumentText();
      const res = await fetch("http://127.0.0.1:5000/tell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context: documentText }),
      });

      if (res.ok) {
        setResponse("Context updated with the current document.");
      } else {
        setResponse({ error: "Failed to get a response from the server." });
      }
    } catch (error) {
      setResponse({ error: "An error occurred while connecting to the server." });
    } finally {
      setLoading(false);
    }
  };
  const resetContext = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);
    setContext(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      } else {
        setResponse({ error: "Failed to get a response from the server." });
      }
    } catch (error) {
      setResponse({ error: "An error occurred while connecting to the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Chatbot</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <input
          type="text"
          value={question}
          onChange={handleInputChange}
          placeholder="Type your question here..."
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="button"
          onClick={handleSelection}
          className="w-full p-3 text-white font-bold rounded bg-gray-500 hover:bg-gray-600"
        >
          Get Selected Text
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white font-bold rounded ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 mt-4"}`}
        >
          {loading ? "Loading..." : "Ask"}
        </button>
        <button
          onClick={handleUpdateContext}
          className="w-50 p-3 text-white font-bold rounded bg-blue-500 hover:bg-blue-600 mt-4"
        >
          Update Context with current document
        </button>
        <button
          onClick={resetContext}
          className="w-50 p-3 text-white font-bold rounded bg-blue-500 hover:bg-blue-600 mt-4"
        >
          Reset Context
        </button>
      </form>

      {response && (
        <div className="w-full max-w-md mt-6 p-4 bg-white rounded shadow-md">
          {response.error ? (
            <p className="text-red-500 font-bold">{response.error}</p>
          ) : (
            <>
              <p className="text-gray-700">
                <strong>Response Time:</strong> {response.response_time}
              </p>
              <p className="text-gray-700">
                <strong>Answer:</strong> {response.answer}
              </p>
              <button
                onClick={() => addParagraph(response.answer)}
                className="w-full p-3 text-white font-bold rounded bg-blue-500 hover:bg-blue-600 mt-4"
              >
                Write to Document
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
