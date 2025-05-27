import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {formatISO} from 'date-fns';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  [key: string]: any; // For any other frontmatter properties
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  [key: string]: any;
}

export function getPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    // If the directory doesn't exist, return an empty array
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled Post',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      summary: data.summary || '',
      content,
      ...data,
    };
  } catch (error) {
     if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export function getAllPosts(): PostMeta[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title || 'Untitled Post',
          date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
          summary: data.summary || 'No summary available.',
          ...data,
        };
      })
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return allPostsData;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // If the directory doesn't exist, create it and return an empty array
      fs.mkdirSync(postsDirectory, { recursive: true });
      return [];
    }
    throw error;
  }
}

export async function createPostFile(title: string, content: string, summary: string): Promise<string> {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end

  const date = formatISO(new Date());

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
slug: "${slug}"
summary: "${summary.replace(/"/g, '\\"')}"
---

${content}
`;

  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  fs.writeFileSync(filePath, frontmatter);
  
  return slug;
}
