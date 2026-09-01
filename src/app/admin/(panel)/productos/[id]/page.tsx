import type { Metadata } from "next";

import { ProductForm } from "@/components/admin/content/product-form";
import { products } from "@/mocks";

export function generateStaticParams() { return [...products.map((product) => ({ id: product.id })), { id: "nuevo" }]; }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const product = products.find((item) => item.id === id); return { title: id === "nuevo" ? "Agregar producto" : product ? `Editar ${product.name}` : "Producto no encontrado" }; }
export default async function AdminProductPage({ params }: { params: Promise<{ id: string }> }) { return <ProductForm key={(await params).id} productId={(await params).id} />; }
