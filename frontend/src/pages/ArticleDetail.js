import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './ArticleDetail.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://u7uk2ych80.execute-api.us-east-1.amazonaws.com';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});

// Relative paths (e.g. "/article-images/...") come from the backend and need
// the API base prepended, same convention as the Backloggd game covers.
const resolveImageSrc = (src) => (src && src.startsWith('/') ? `${API_BASE}${src}` : src);

const markdownComponents = {
    p: ({ node, ...props }) => <p className='newspaper-body' {...props} />,
    li: ({ node, ...props }) => <li className='newspaper-body' {...props} />,
    img: ({ node, src, ...props }) => <img src={resolveImageSrc(src)} {...props} />,
    a: ({ node, href, ...props }) => (
        <a
            href={href}
            className='no-decoration'
            target={href && href.startsWith('http') ? '_blank' : undefined}
            rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
        />
    ),
};

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        setLoading(true);
        setNotFound(false);
        axios.get(`${API_BASE}/articles/${slug}`)
            .then(res => setArticle(res.data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    return (
        <div className="App-content-stuff d-flex flex-column">
            <div data-aos="fade-left" className='blog-container d-flex flex-column mb-2 p-4'>
                {loading && <p className='newspaper-body'>Loading...</p>}
                {!loading && notFound && <p className='newspaper-body'>Article not found.</p>}
                {!loading && article && (
                    <>
                        <div className='d-flex justify-content-center mb-2'>
                            <h1 className='newspaper-title text-center mb-3'>{article.title}</h1>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p className='newspaper-legal'>{formatDate(article.date)}</p>
                            <p className='newspaper-legal'>{article.author}</p>
                        </div>
                        <div className='horizontal-line-grey mt-3 mb-3'></div>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={markdownComponents}
                        >
                            {article.body}
                        </ReactMarkdown>
                    </>
                )}
            </div>
        </div>
    )
}

export default ArticleDetail
