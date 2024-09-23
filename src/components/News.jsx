import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("technology");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY; // Replace with your API key

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=50&page=${page}&apiKey=${API_KEY}`
        );

        if (!response.ok) {
          const errorMsg = `Error ${response.status}: ${response.statusText}`;
          throw new Error(errorMsg);
        }

        const data = await response.json();
        setArticles(data.articles);
        setTotalResults(data.totalResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query, page]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setPage(1); // Reset to the first page when query changes
  };

  const handleNextPage = () => {
    if (page * 50 < totalResults) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (loading)
    return <div className="text-center text-xl animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-500 text-xl">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-around mb-6 bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg shadow-lg">
        <button
          onClick={() => setQuery("science")}
          className="text-white hover:underline transition-transform transform hover:scale-105"
        >
          Science
        </button>
        <button
          onClick={() => setQuery("international")}
          className="text-white hover:underline transition-transform transform hover:scale-105"
        >
          International
        </button>
        <button
          onClick={() => setQuery("economy")}
          className="text-white hover:underline transition-transform transform hover:scale-105"
        >
          Economy
        </button>
        <button
          onClick={() => setQuery("technology")}
          className="text-white hover:underline transition-transform transform hover:scale-105"
        >
          Technology
        </button>
        <button
          onClick={() => setQuery("india")}
          className="text-white hover:underline transition-transform transform hover:scale-105 bg-green-800 p-3 rounded-lg hover:bg-pink-800"
        >
          India
        </button>
      </nav>
      <div className="">
        <Link
          to="/"
          className="bg-orange-700 w-1/8 p-3 hover:underline transition-transform transform hover:scale-105"
        >
          Back To AI
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-center">News Articles</h1>
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="Search news..."
        className="border border-gray-300 rounded-lg p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.url}
            className="border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
            )}
            <h2 className="text-xl font-semibold text-blue-700">
              {article.title}
            </h2>
            <p className="text-gray-800 mt-2">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-2 inline-block hover:text-blue-700"
            >
              Read more
            </a>
            <p className="text-gray-600 mt-2">
              <strong>Published at:</strong>{" "}
              {new Date(article.publishedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`bg-blue-600 text-white rounded-lg px-4 py-2 transition-transform duration-300 transform hover:scale-105 ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page * 50 >= totalResults}
          className={`bg-blue-600 text-white rounded-lg px-4 py-2 transition-transform duration-300 transform hover:scale-105 ${
            page * 50 >= totalResults
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default News;
