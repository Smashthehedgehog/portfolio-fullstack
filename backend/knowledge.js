import fs from 'fs';
import { Document } from 'flexsearch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { listArticles } from './articles.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = join(__dirname, 'knowledge');
export const DEFAULT_TOP_K = 4;

let index = null;
let nextId = 0;

// Splits a knowledge markdown file's body into one chunk per "## " heading;
// the heading line stays part of the chunk so it's self-contained context.
// Content before the first "## " (the "# Title" and any leading HTML
// comment) is discarded.
function splitIntoChunks(markdownBody, sourceLabel) {
    return markdownBody
        .split(/\n(?=## )/g)
        .map(section => {
            const heading = section.match(/^##\s+(.+)$/m);
            if (!heading) return null;
            return { title: heading[1].trim(), text: section.trim(), source: sourceLabel };
        })
        .filter(Boolean);
}

function loadKnowledgeChunks() {
    const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.md'));
    return files.flatMap(file =>
        splitIntoChunks(fs.readFileSync(join(KNOWLEDGE_DIR, file), 'utf8'), file.replace(/\.md$/, ''))
    );
}

function loadArticleChunks() {
    return listArticles().map(({ slug, data, content }) => ({
        title: data.title,
        text: `${data.title}\n\n${content.trim()}`,
        source: `article:${slug}`,
    }));
}

export function buildIndex() {
    index = new Document({
        document: { id: 'id', index: ['title', 'text'], store: ['title', 'text', 'source'] },
        tokenize: 'forward',
    });

    const chunks = [...loadKnowledgeChunks(), ...loadArticleChunks()];
    chunks.forEach(chunk => index.add({ id: nextId++, ...chunk }));

    console.log(`Knowledge index built: ${chunks.length} chunks.`);
    return chunks.length;
}

// Returns up to k relevant chunks as { title, text, source }, ranked by relevance.
export function retrieve(query, k = DEFAULT_TOP_K) {
    if (!index) return [];
    // suggest:true is required here -- without it FlexSearch only returns a
    // chunk when EVERY query term matches, so a full natural-language chat
    // question (full of stopwords/filler no chunk contains verbatim) matches
    // nothing. suggest:true relaxes this to partial-term matching, ranked by
    // closeness, which is what makes chat-style queries actually retrieve.
    const results = index.search(query, { limit: k, enrich: true, merge: true, suggest: true });
    return results.slice(0, k).map(r => r.doc);
}
