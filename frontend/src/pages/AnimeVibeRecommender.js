import React, { useState } from 'react';
import axios from 'axios';
import './AnimeVibeRecommender.css';

const API_BASE = process.env.REACT_APP_ANIME_VIBE_API_BASE;
const API_KEY = process.env.REACT_APP_ANIME_VIBE_API_KEY;

const TYPE_OPTIONS = ['ANIME', 'MANGA'];

function MediaCard({ media, showScore, rank, reason }) {
    const tags = [...(media.genres || []), ...(media.tags || [])].slice(0, 8);
    return (
        <div className="avr-card d-flex">
            {media.cover_image_url ? (
                <img src={media.cover_image_url} alt="" className="avr-card-image" loading="lazy" />
            ) : (
                <div className="avr-card-image avr-card-image-empty" />
            )}
            <div className="avr-card-body">
                {showScore && (
                    <span className="avr-card-score">score {media.score.toFixed(3)}</span>
                )}
                <div className="d-flex align-items-center gap-2 mb-1">
                    {rank && <span className="avr-rank-badge">#{rank}</span>}
                    <span className={`avr-type-badge avr-type-${media.type === 'ANIME' ? 'anime' : 'manga'}`}>
                        {media.type}
                    </span>
                    <span className="subhead-1-large">{media.title_english || '(untitled)'}</span>
                </div>
                <div className="avr-card-meta legal-1-demi">
                    popularity {media.popularity}
                    {showScore && <> &middot; similarity {media.similarity.toFixed(3)}</>}
                </div>
                {reason && <p className="avr-reason body-1-large">{reason}</p>}
                <p className="avr-synopsis legal-1-demi">
                    {media.synopsis
                        ? (media.synopsis.length > 220 ? `${media.synopsis.slice(0, 220)}...` : media.synopsis)
                        : 'No synopsis.'}
                </p>
                {tags.length > 0 && (
                    <div className="avr-tags legal-1-demi">{tags.join(' · ')}</div>
                )}
            </div>
        </div>
    );
}

const AnimeVibeRecommender = () => {
    const [method, setMethod] = useState('recommend');
    const [vibe, setVibe] = useState('a cozy slow-burn romance with found family themes');
    const [type, setType] = useState('ANIME');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [recommendResults, setRecommendResults] = useState(null);
    const [elapsed, setElapsed] = useState(null);

    const configured = Boolean(API_BASE && API_KEY);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!vibe.trim() || loading) return;

        setLoading(true);
        setError(null);
        setSearchResults(null);
        setRecommendResults(null);
        const started = performance.now();

        try {
            if (method === 'search') {
                const res = await axios.post(
                    `${API_BASE}/api/v1/search/vibe`,
                    { query: vibe, type, limit: 10 },
                    { headers: { 'X-API-Key': API_KEY } }
                );
                setSearchResults(res.data.results);
            } else {
                const res = await axios.post(
                    `${API_BASE}/api/v1/recommend`,
                    { vibe, type },
                    { headers: { 'X-API-Key': API_KEY } }
                );
                setRecommendResults(res.data.recommendations);
            }
            setElapsed(((performance.now() - started) / 1000).toFixed(1));
        } catch (err) {
            const detail = err.response?.data?.detail;
            setError(detail || 'Something went wrong reaching the API. Please try again in a moment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App-content-stuff d-flex flex-column">
            <p data-aos="fade-left" className="display-3-large sonic-blue-text">Anime Vibe Recommender</p>
            <div data-aos="fade-left" className="topic-line sonic-red"></div>
            <div data-aos="fade-left" className="subhead-1-large text-dark mb-4">
                <p>Semantic Search + MCP Recommendation Agent</p>
            </div>

            <div data-aos="fade-left" className="avr-about body-1-large mb-5">
                <p>
                    A semantic "vibe" search engine over a curated AniList catalog — the
                    2,500 most popular anime and 2,500 most popular manga, kept as two
                    separate pools (search picks one, not both at once) — describe a mood
                    or theme in plain language and get back genuinely relevant matches, not
                    keyword hits. Built with a FastAPI backend, Supabase/pgvector for
                    embedding storage and similarity search, and SentenceTransformers for
                    query embedding.
                </p>
                <p>
                    The interesting part: it's exposed both as a conventional REST API{' '}
                    <em>and</em> as a full MCP (Model Context Protocol) server, so any
                    MCP-aware AI agent can call it as a tool. The AI Recommendation option
                    below is a real demonstration of that — a Groq-hosted LLM acts as a
                    genuine MCP client against this same API's MCP server, searches the
                    catalog itself, and ranks its own top 10 picks with reasoning, rather
                    than the app just handing back a raw similarity-ranked list. Ships with
                    API-key auth and per-key rate limiting.
                </p>
                <p>
                    Also an honest case study in free-tier infrastructure limits: this
                    started as the *full* AniList catalog (120k+ titles), but that made the
                    fast vector index (HNSW) too compute-intensive to build on Supabase's
                    free tier, so Direct Search ran unindexed and slower than it should.
                    Trimming to a curated 5,000-title catalog fixed that outright — HNSW
                    builds trivially at this size — at the cost of breadth. The catalog is
                    also still refreshed from AniList manually rather than on an automated
                    schedule (a real cron job has a minimum cost even on Render's paid
                    plans) — real tradeoffs, left visible rather than hidden.
                </p>
                <div className="d-flex flex-wrap gap-3 mt-3">
                    <a className="project-link no-decoration" href="https://github.com/Smashthehedgehog/anime-vibe-api" target="_blank" rel="noreferrer">View on GitHub</a>
                    <a className="project-link no-decoration" href="https://github.com/Smashthehedgehog/anime-vibe-api/blob/main/docs/MCP.md" target="_blank" rel="noreferrer">MCP docs</a>
                    <a className="project-link no-decoration" href="https://github.com/Smashthehedgehog/anime-vibe-api/blob/main/docs/RECOMMEND.md" target="_blank" rel="noreferrer">Recommendation agent docs</a>
                </div>
            </div>

            {!configured ? (
                <div className="avr-panel">
                    <p className="body-1-large mb-0">
                        The demo isn't configured in this environment yet — set
                        <code> REACT_APP_ANIME_VIBE_API_BASE</code> and
                        <code> REACT_APP_ANIME_VIBE_API_KEY</code>.
                    </p>
                </div>
            ) : (
                <div data-aos="fade-left" className="avr-panel">
                    <div className="avr-method-toggle">
                        <button
                            type="button"
                            className={`avr-method-option${method === 'search' ? ' active' : ''}`}
                            onClick={() => setMethod('search')}
                        >
                            <strong>Direct Search</strong>
                            <span>Ranked list from cosine similarity + popularity. Deterministic, no LLM.</span>
                        </button>
                        <button
                            type="button"
                            className={`avr-method-option${method === 'recommend' ? ' active' : ''}`}
                            onClick={() => setMethod('recommend')}
                        >
                            <strong>AI Recommendation</strong>
                            <span>A Groq-powered agent calls the MCP search tool itself and ranks its top 10 picks.</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="avr-form">
                        <div>
                            <label htmlFor="avr-vibe" className="legal-1-demi d-block mb-1">Vibe</label>
                            <textarea
                                id="avr-vibe"
                                className="avr-textarea"
                                value={vibe}
                                onChange={(e) => setVibe(e.target.value)}
                                placeholder="e.g. a hopeful post-apocalyptic story about rebuilding"
                            />
                        </div>
                        <div className="avr-form-row">
                            <div>
                                <label htmlFor="avr-type" className="legal-1-demi d-block mb-1">Type</label>
                                <select
                                    id="avr-type"
                                    className="avr-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    {TYPE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="avr-submit" disabled={loading}>
                                {loading ? 'Working...' : method === 'search' ? 'Search' : 'Ask the agent'}
                            </button>
                        </div>
                    </form>

                    <div className="avr-status legal-1-demi">
                        {loading && method === 'search' && 'Searching...'}
                        {loading && method === 'recommend' && "Asking the agent... this can take up to 30 seconds — it's really searching the catalog and reasoning about results, not a static response."}
                        {!loading && error && <span className="avr-error">{error}</span>}
                        {!loading && !error && searchResults && `${searchResults.length} result(s) in ${elapsed}s`}
                        {!loading && !error && recommendResults && `${recommendResults.length} recommendation(s) in ${elapsed}s`}
                    </div>

                    <div className="avr-results">
                        {searchResults && searchResults.length === 0 && <p className="text-muted">No matches.</p>}
                        {searchResults && searchResults.map((r) => (
                            <MediaCard key={r.id} media={r} showScore />
                        ))}
                        {recommendResults && recommendResults.length === 0 && (
                            <p className="text-muted">The agent didn't settle on any specific titles from its search.</p>
                        )}
                        {recommendResults && recommendResults.map((rec) => (
                            <MediaCard key={rec.media.id} media={rec.media} rank={rec.rank} reason={rec.reason} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimeVibeRecommender;
