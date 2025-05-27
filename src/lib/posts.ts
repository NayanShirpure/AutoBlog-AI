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
  featuredImage?: string; // Added for AI generated image
  [key: string]: any; // For any other frontmatter properties
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  featuredImage?: string; // Added for AI generated image
  [key: string]: any;
}

export function getPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
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
      featuredImage: data.featuredImage, // Read featuredImage
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
          featuredImage: data.featuredImage, // Read featuredImage
          ...data,
        };
      })
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return allPostsData;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      fs.mkdirSync(postsDirectory, { recursive: true });
      return [];
    }
    throw error;
  }
}

export async function createPostFile(
  title: string, 
  content: string, 
  summary: string,
  featuredImage?: string // New parameter for image data URI
): Promise<string> {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/--+/g, '-') 
    .replace(/^-+|-+$/g, ''); 

  const date = formatISO(new Date());

  let frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
slug: "${slug}"
summary: "${summary.replace(/"/g, '\\"')}"
`;

  if (featuredImage) {
    // Ensure the data URI is properly quoted if it contains special characters,
    // though base64 itself should be fine. Using double quotes for consistency.
    frontmatter += `featuredImage: "${featuredImage}"\n`;
  }

  frontmatter += `---

${content}
`;

  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  fs.writeFileSync(filePath, frontmatter);
  
  return slug;
}
