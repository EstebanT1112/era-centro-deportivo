export type PostStatus = "draft" | "published";

export type PostContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  status: PostStatus;
  isFeatured: boolean;
  publishedAt?: string;
  content: PostContentBlock[];
  secondaryImages?: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}
