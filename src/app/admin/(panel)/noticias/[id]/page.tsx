import type { Metadata } from "next";

import { PostForm } from "@/components/admin/content/post-form";
import { posts } from "@/mocks";

export function generateStaticParams() { return [...posts.map((post) => ({ id: post.id })), { id: "nueva" }]; }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const post = posts.find((item) => item.id === id); return { title: id === "nueva" ? "Crear noticia" : post ? `Editar ${post.title}` : "Noticia no encontrada" }; }
export default async function AdminPostPage({ params }: { params: Promise<{ id: string }> }) { return <PostForm key={(await params).id} postId={(await params).id} />; }
