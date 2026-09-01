"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { clonePost, cloneProduct, type PostDraft, type ProductDraft } from "@/lib/admin-content";
import { posts as initialPosts, products as initialProducts } from "@/mocks";
import type { Post, Product } from "@/types";

interface AdminContentContextValue {
  posts: Post[];
  products: Product[];
  addPost: (draft: PostDraft) => Post;
  updatePost: (id: string, draft: PostDraft) => Post | undefined;
  addProduct: (draft: ProductDraft) => Product;
  updateProduct: (id: string, draft: ProductDraft) => Product | undefined;
  setFeaturedProducts: (ids: string[]) => void;
}

const AdminContentContext = createContext<AdminContentContextValue | null>(null);

function AdminContentProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState(() => initialPosts.map(clonePost));
  const [products, setProducts] = useState(() => initialProducts.map(cloneProduct));

  const value = useMemo<AdminContentContextValue>(() => ({
    posts,
    products,
    addPost(draft) {
      const post = clonePost({ ...draft, id: `post-${Math.random().toString(36).slice(2, 9)}` });
      setPosts((items) => [post, ...items]);
      return post;
    },
    updatePost(id, draft) {
      const current = posts.find((post) => post.id === id);
      if (!current) return undefined;
      const post = clonePost({ ...draft, id });
      setPosts((items) => items.map((item) => item.id === id ? post : item));
      return post;
    },
    addProduct(draft) {
      const product = cloneProduct({ ...draft, id: `product-${Math.random().toString(36).slice(2, 9)}` });
      setProducts((items) => [product, ...items]);
      return product;
    },
    updateProduct(id, draft) {
      const current = products.find((product) => product.id === id);
      if (!current) return undefined;
      const product = cloneProduct({ ...draft, id });
      setProducts((items) => items.map((item) => item.id === id ? product : item));
      return product;
    },
    setFeaturedProducts(ids) {
      const featuredIds = new Set(ids);
      setProducts((items) => items.map((product) => ({ ...product, isFeatured: featuredIds.has(product.id) })));
    },
  }), [posts, products]);

  return <AdminContentContext.Provider value={value}>{children}</AdminContentContext.Provider>;
}

function useAdminContent() {
  const context = useContext(AdminContentContext);
  if (!context) throw new Error("useAdminContent debe usarse dentro de AdminContentProvider");
  return context;
}

export { AdminContentProvider, useAdminContent };
