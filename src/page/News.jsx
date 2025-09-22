import React from 'react';
import { Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';

const News = () => {
  return (
    <div className="news-page">
      <header className="page-header">
        <Link to="/" className="back-btn">
          <RiArrowLeftLine />
          Back to Chat
        </Link>
        <h1>Latest News</h1>
      </header>
      <div className="page-content">
        <p>Coming soon......</p>
      </div>
    </div>
  );
};

export default News;
