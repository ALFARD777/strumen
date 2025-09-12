import { IconFileTypePdf, IconFileTypeZip } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageContent from "@/components/shared/pageContent";
import { Table } from "@/components/shared/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Title } from "@/components/ui/title";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";
import AddToCart from "./addToCart";
import PhotoSystem from "./photoSystem";

interface Props {
	params: { link: string; section: string };
}

export default async function Category({ params }: Props) {
	const { link, section } = params;
	const product: Product | null = await prisma.products.findFirst({
		where: { eng: link },
		orderBy: {
			id: "asc",
		},
		include: {
			category: true,
			documents: true,
			softwares: true,
			extraCharacteristics: true,
		},
	});
	if (!product) return notFound();

	const sectionItem = await prisma.sections.findFirst({
		where: { url: section },
		select: { name: true },
	});

	return (
		<PageContent
			path={[
				{ href: "/", label: "Главная" },
				{ href: "/catalog", label: "Каталог" },
				{ href: `/catalog/${section}`, label: sectionItem?.name || "Секция" },
				{
					href: `/catalog/${section}/${product.category.url}`,
					label: product?.category.name || "Категория",
				},
				{
					href: `/catalog/${section}/${product.category.url}/${product.eng}`,
					label: product?.short || "Продукт",
				},
			]}
		>
			<div className="m-2">
				<div className="flex flex-col-reverse md:flex-row">
					<PhotoSystem photos={product.imagePaths} />
					<div className="w-full md:w-7/12">
						<Title className="text-center md:text-left">{product.name}</Title>
						<AddToCart />
					</div>
				</div>
				<Tabs defaultValue="description">
					<TabsList>
						<TabsTrigger value="description">Описание</TabsTrigger>
						{product.features && (
							<TabsTrigger value="features">Особенности</TabsTrigger>
						)}
						{(product.characteristics || product.extraCharacteristics) && (
							<TabsTrigger value="characteristics">Характеристики</TabsTrigger>
						)}
						{product.documents.length > 0 && (
							<TabsTrigger value="documents">Документация</TabsTrigger>
						)}
						{product.softwares.length > 0 && (
							<TabsTrigger value="softwares">Программы</TabsTrigger>
						)}
					</TabsList>
					<TabsContent value="description">
						<Title className="text-left">Описание {product.short}:</Title>
						<div
							/** biome-ignore lint/security/noDangerouslySetInnerHtml: <safe code from tiptap editor> */
							dangerouslySetInnerHTML={{ __html: product.description }}
							className="productDescription"
						/>
					</TabsContent>
					<TabsContent value="features">
						<Title className="text-left">Особенности {product.short}:</Title>
						<div
							/** biome-ignore lint/security/noDangerouslySetInnerHtml: <safe code from tiptap editor> */
							dangerouslySetInnerHTML={{ __html: product.features || "" }}
							className="productDescription"
						/>
					</TabsContent>
					<TabsContent value="characteristics">
						<Title className="text-left">
							Основные характеристики {product.short}:
						</Title>
						<div
							/** biome-ignore lint/security/noDangerouslySetInnerHtml: <safe code from tiptap editor> */
							dangerouslySetInnerHTML={{
								__html: product.characteristics || "",
							}}
							className="productDescription"
						/>
						<Title className="text-left mt-4">
							Доп. характеристики {product.short}:
						</Title>
						<Table
							columns={[
								{
									key: "key",
									label: "Название",
								},
								{
									key: "value",
									label: "Значение",
								},
							]}
							data={product.extraCharacteristics}
							rowKey={(row) => row.id}
						></Table>
					</TabsContent>
					<TabsContent value="documents">
						<Title className="text-left">Документация к {product.short}:</Title>
						<div className="flex flex-col gap-2">
							{product.documents.map((document) => (
								<Link
									key={document.id}
									href={document.path}
									target="_blank"
									className="flex gap-2 hover:scale-105 transition-all duration-300 underline w-fit"
								>
									<IconFileTypePdf />
									<p>{document.name}</p>
								</Link>
							))}
						</div>
					</TabsContent>
					<TabsContent value="softwares">
						<Title className="text-left">
							Программное обеспечение к {product.short}:
						</Title>
						<div className="flex flex-col gap-2">
							{product.softwares.map((soft) => (
								<Link
									key={soft.id}
									href={soft.path}
									className="flex gap-2 hover:scale-105 transition-all duration-300 underline w-fit"
								>
									<IconFileTypeZip />
									<p>{soft.name}</p>
								</Link>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</PageContent>
	);
}
