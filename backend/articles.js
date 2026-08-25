import fs from 'fs';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Articles are markdown files with frontmatter, committed to backend/articles/
// (edited via the Decap CMS admin at /admin, which commits straight to this repo).
export const ARTICLES_DIR = join(__dirname, 'articles');

export function readArticle(slug) {
    const filePath = join(ARTICLES_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
    return { slug, data, content };
}

export function listArticles() {
    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
    return files
        .map(file => readArticle(file.replace(/\.md$/, '')))
        .filter(Boolean)
        .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
}
