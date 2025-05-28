
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {formatISO} from 'date-fns';
import { slugify } from '@/lib/utils';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  featuredImage?: string;
  tags?: string[];
  [key: string]: any; 
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary:string;
  featuredImage?: string;
  tags?: string[];
  [key: string]: any;
}

export interface CreatePostResult {
  slug: string;
  status: 'created' | 'generated_not_saved' | 'error';
  message?: string;
  fullContent?: string; // The full MDX content if generated_not_saved or on EROFS error
}


export function getPostSlugs(): string[] {
  try {
    // Ensure the posts directory exists before trying to read from it
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    // If it's a different error after attempting to create the directory, rethrow it.
    console.error("Error reading post slugs:", error);
    return []; // Return empty array if directory check/creation failed for some reason
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
      featuredImage: data.featuredImage,
      tags: data.tags || [],
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
    // Ensure the posts directory exists
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }
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
          featuredImage: data.featuredImage,
          tags: data.tags || [],
          ...data,
        };
      })
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return allPostsData;
  } catch (error) {
    console.error("Error in getAllPosts (could be after directory creation attempt):", error);
    return [];
  }
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const allTags = new Set<string>();
  allPosts.forEach(post => {
    post.tags?.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags).sort();
}


export async function createPostFile(
  title: string, 
  content: string, 
  summary: string,
  featuredImage?: string,
  tags?: string[]
): Promise<CreatePostResult> {
  const slug = slugify(title);
  const date = formatISO(new Date());

  let frontmatterContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
slug: "${slug}"
summary: "${summary.replace(/"/g, '\\"')}"
`;

  if (featuredImage) {
    frontmatterContent += `featuredImage: "${featuredImage}"\n`;
  }

  if (tags && tags.length > 0) {
    frontmatterContent += `tags:\n${tags.map(tag => `  - "${tag.replace(/"/g, '\\"')}"`).join('\n')}\n`;
  }

  frontmatterContent += `---

${content}
`;

  // Check if in a Vercel deployment (where filesystem is read-only except /tmp)
  // or if POST_WRITING_DISABLED is set for local testing of this path.
  const isReadOnlyEnvironment = process.env.VERCEL_ENV || process.env.POST_WRITING_DISABLED === 'true';

  if (isReadOnlyEnvironment) {
    console.warn(`[SKIPPING FILE WRITE] Post generation to filesystem is disabled in this environment. Slug: ${slug}`);
    return {
      slug,
      status: 'generated_not_saved',
      message: 'Post content generated. Manual step required to save to project filesystem.',
      fullContent: frontmatterContent,
    };
  }

  try {
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    const filePath = path.join(postsDirectory, `${slug}.mdx`);
    fs.writeFileSync(filePath, frontmatterContent);
    return { slug, status: 'created' };
  } catch (e: any) {
    console.error('Error during createPostFile:', e);
    if (e.code === 'EROFS') {
      return {
        slug, // slug is still generated
        status: 'error',
        message: 'Read-only filesystem. Could not save post automatically. Please save content manually.',
        fullContent: frontmatterContent, // Provide content for manual saving
      };
    }
    return { slug: 'error-slug', status: 'error', message: e.message || 'Unknown error saving post.' };
  }
}
