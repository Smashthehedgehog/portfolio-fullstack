<!--
    Hand-maintained knowledge base for the chatbot's retrieval index.
    Sourced from frontend/src/pages/projects/projects-data.js. Update this file by hand
    when a project is added, removed, or its description changes — it is not auto-generated.
-->
# Projects

## Anime Vibe Recommender
**Subtitle:** Semantic Search + MCP Recommendation Agent
**Tech stack:** Python, FastAPI, pgvector, MCP
**GitHub:** https://github.com/Smashthehedgehog/anime-vibe-api
**Live demo:** https://www.michaelani.com/anime-vibe-recommender

A semantic "vibe" search engine over a curated AniList catalog — the 2,500 most popular anime and 2,500 most popular manga, kept as two separate searchable pools — describe a mood or theme in plain language and get back genuinely relevant matches, not keyword hits. Built with a FastAPI backend, Supabase/pgvector for embedding storage and similarity search, and fastembed for query embedding. Direct Search ranks results by a blended score (85% semantic similarity, 15% popularity) rather than similarity alone. It's exposed both as a conventional REST API and as a full MCP (Model Context Protocol) server, so any MCP-aware AI agent can call it as a tool — the live demo's AI Recommendation option is a Groq-hosted LLM acting as a genuine MCP client against this same API's MCP server, searching the catalog itself and ranking its own top 10 picks with reasoning. Ships with API-key auth and per-key rate limiting. Also an honest case study in free-tier infrastructure limits: it started as the full AniList catalog (120k+ titles), but that made a fast vector index (HNSW) too compute-intensive to build on Supabase's free tier, so trimming to a curated 5,000-title catalog fixed that at the cost of breadth — a tradeoff left visible on the demo page.

## The Collective
**Subtitle:** Sports Article Publishing Platform
**Tech stack:** Next.js, TypeScript, Payload CMS
**GitHub:** https://github.com/Smashthehedgehog/the-collective-test
**Live demo:** https://thehardwoodcollective.com/

A multi-writer basketball article publishing platform built on Next.js and Payload CMS, with a full editorial workflow (draft, review, publish), rich embeds for YouTube clips, tweets and live stat visuals, reader accounts, and visitor analytics. It ships with a legacy-content importer and cron-driven digest emails. Michael created the site from the ground up; his line brother and the site owner took it from there.

## ChessMind
**Subtitle:** Chess-Move Prediction Neural Network
**Tech stack:** Python, TensorFlow
**GitHub:** https://github.com/Smashthehedgehog/chess_neural_network

A chess-move-prediction neural network trained on a Lichess game database using TensorFlow and Keras, paired with a playable pygame chess interface to try it out move by move. The repo includes multiple trained model variants, including a more "aggressive" playstyle model.

## Q-Trader
**Subtitle:** Algorithmic Trading Bot
**Tech stack:** Python, FastAPI, Docker
**GitHub:** https://github.com/Smashthehedgehog/tradebot

A Python reinforcement-learning trading bot that studies years of hourly market data and builds a Q-learning "brain" out of technical signals like SMA ratio, Bollinger %B, MACD and RSI, with self-adjusting weights. It includes a full backtesting engine with walk-forward validation, Sharpe ratio and drawdown metrics, a FastAPI control/status API, and email alerting, and runs continuously on a self-hosted server via Docker and systemd.

## Backlog Buddy
**Subtitle:** Video Game Backlog Tracker
**Tech stack:** React, TypeScript, Node.js, Supabase
**GitHub:** https://github.com/Smashthehedgehog/video-game-backlog-project

A full-stack app for tracking a personal video-game backlog: an Express/Node API pulls game metadata from IGDB into Supabase on a weekly scheduled sync, and a React, Vite and TypeScript frontend (styled with Tailwind) lets you browse and manage the collection. The monorepo is already structured for a future React Native companion app.

## Sonic Action RPG
**Subtitle:** 2D Action RPG (Godot)
**Tech stack:** Godot, C#
**GitHub:** https://github.com/Smashthehedgehog/Action_RPG_Project

A 2D action-RPG built in the Godot engine starring a Sonic-the-Hedgehog-style playable character, driven by a custom finite state machine for both the player and enemies. It features spells, battle maps and enemy AI, and was built to learn game-design fundamentals while sharpening object-oriented design skills.

## AudioScribe
**Subtitle:** Generative-AI Music Transcription (Experimental)
**Tech stack:** Python
**GitHub:** https://github.com/Smashthehedgehog/gen-ai-mp3-to-musescore

An experimental project exploring whether AI source-separation and transcription models can turn an MP3 into readable sheet music, combining Demucs for stem separation with the MT3 model for note transcription. Still an early-stage workspace with mixed results, kept as an ongoing exploration.

## USFBC Admin Platform
**Subtitle:** Nonprofit Survey & Admin App
**Tech stack:** React, Bootstrap, Flask
**GitHub:** https://github.com/Usfbc-admin/app
**Note:** Team project, built with USFBC.

A full-stack survey and admin platform built for the nonprofit USFBC, with a Flask and SQLite backend for managing users and surveys, and a React and Bootstrap frontend deployed through AWS Amplify. Built with a small team, with Michael focused on frontend UI/UX components.

## NFL Analytics Dashboard
**Subtitle:** Data Visual Analytics
**Tech stack:** Python
**GitHub:** https://github.com/cutamar/cse6242-team079
**Note:** Team project, Georgia Tech.

An interactive NFL play-by-play analytics dashboard built for Georgia Tech's Data & Visual Analytics course, with team, player and situational breakdowns, EPA-based visualizations, and a win-probability model comparing Random Forest, linear and gradient-boosting approaches over nflverse data.

## Candidate Analytics Dashboard
**Subtitle:** Recruiting Analytics Dashboard
**Tech stack:** JavaScript, Bootstrap
**GitHub:** https://github.com/AutoNateAI/LinkedIn-Candidate-Analytics-And-Finder
**Live demo:** https://autonateai.github.io/LinkedIn-Candidate-Analytics-And-Finder/
**Note:** Client project for AutoNateAI.

A responsive, client-side dashboard for filtering, sorting and visualizing recruiting-candidate data exports, built as freelance client work for AutoNateAI. It parses CSV exports in the browser and renders sortable tables and charts, no backend required.
