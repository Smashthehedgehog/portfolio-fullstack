import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Articles.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://u7uk2ych80.execute-api.us-east-1.amazonaws.com';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
}).toUpperCase();

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      axios.get(`${API_BASE}/articles`)
          .then(res => setArticles(res.data))
          .catch(err => console.error('Failed to load articles:', err))
          .finally(() => setLoading(false));
  }, []);

  return (
    <div>
        <div className="App-content-stuff d-flex flex-column">
            <p data-aos="fade-left" className='display-3-large sonic-blue-text'>Articles</p>
            <div data-aos="fade-left" className='topic-line sonic-red'></div>
            <div data-aos="fade-left" className='subhead-1-large text-dark mb-5'>
                <p>Here is where I will put journal entries throughout my life and carrer. Essentially,
                    this will just be a mini-blog. The entries I plan to write at the moment will be a
                    reflection on my undergraduate college life and my thought process throughout blueprinting
                    this website.
                </p>
            </div>
            <div data-aos="fade-left" className='d-flex flex-column gap-4'>
              {loading && <p className='subhead-1-large text-dark'>Loading articles...</p>}
              {!loading && articles.length === 0 && <p className='subhead-1-large text-dark'>No articles yet — check back soon.</p>}
              {articles.map(article => (
                <Link key={article.slug} to={`/articles/${article.slug}`} className='blog-card position-relative no-decoration'>
                    <p className='text-light headline-5-medium'>{formatDate(article.date)}</p>
                    <p className='headline-1-large sonic-beige-text'>{article.title}</p>
                    <p className='headline-5-large text-light'>{article.teaser}</p>
                </Link>
              ))}
            </div>
        </div>
    </div>
  )
}

export default Articles
