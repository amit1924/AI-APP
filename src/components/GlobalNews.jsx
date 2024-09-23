import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const topics = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

const GlobalNews = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6; // Change this to fit your grid layout

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://saurav.tech/NewsAPI/top-headlines/category/${selectedTopic}/in.json`
        );
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedTopic]);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 relative">
      <div
        className="absolute right-3 top-3  bg-orange-700 p-3 rounded-xl
        "
      >
        <Link to="/gnews">Back To AI</Link>
      </div>

      <h2 className="text-2xl font-bold mb-4">Global News</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <nav className="mb-4">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-4 py-2 mx-1 rounded ${
              selectedTopic === topic ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentArticles.map((article) => (
          <div
            key={article.url}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="mt-2 text-gray-600">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 block"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GlobalNews;
