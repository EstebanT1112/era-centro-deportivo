import type { Metadata } from "next";
import { NewsList } from "@/components/admin/content/news-list";

export const metadata: Metadata = { title: "Noticias" };

export default function AdminNewsPage() {
  return <NewsList />;
}
