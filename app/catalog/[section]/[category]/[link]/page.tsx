import { notFound } from "next/navigation";
import PageContent from "@/components/shared/pageContent";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Product } from "@/components/types";

interface Props {
	params: { link: string; section: string };
}

export default async function Category({ params }: Props) {
	const { link, section } = params;
	const product: Product = await prisma.products.findFirst({
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
	const sectionItem = await prisma.sections.findFirst({
		where: { url: section },
		select: { name: true },
	});

	if (!product) return notFound();

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
			title={product.name}
		>
			<div className="flex gap-2">

			
			<div className="relative w-2/6 h-auto">
			<Image width={1920} height={1080} src={product.imagePaths[0]} alt={product.short} className="w-full rounded-md"/></div>
			{/** biome-ignore lint/security/noDangerouslySetInnerHtml: <safe code from tiptap editor> */}
			<div dangerouslySetInnerHTML={{ __html: product.description }} className="w-4/6"/></div>
		</PageContent>
	);
}
