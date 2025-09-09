"use client";

import { IconInfoCircle, IconNews } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { previewText } from "@/components/functions";
import type { News } from "@/components/types";
import { ButtonLink } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Title } from "@/components/ui/title";

export default function NewsBlock() {
	const [lastNews, setLastNews] = useState<News | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchNews = async () => {
			setLoading(true);
			try {
				const axios = (await import("axios")).default;
				const res = await axios.get("/api/news");
				const data = res.data;

				if (data.news) {
					data.news = data.news.filter((item: News) => item.published);
				}

				const now = new Date();

				if (!(data.news && data.news.length > 0)) {
					setLastNews(null);
					setError(null);

					return;
				}

				if (
					data.news[0].createdAt <
					new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
				) {
					setLastNews(null);
					setError(null);

					return;
				}

				setLastNews(data.news[0]);
				setError(null);
			} catch (ex) {
				console.log(ex);
				setError("Ошибка загрузки новостей хуй");
			} finally {
				setLoading(false);
			}
		};

		fetchNews();
	}, []);

	if (loading || error || !lastNews) {
		return null;
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<hr className="w-full opacity-10" />
			<Container className="p-5 mb-5 flex-col justify-center gap-4">
				<Title>Новости</Title>
				<div className="shadow-lg p-4 rounded-md">
					<div className="flex gap-8">
						<Image
							src={
								lastNews.imagePath ||
								"https://placehold.co/128x200?text=Нет\\nФото"
							}
							alt="Картинка новости"
							width={128}
							height={64}
							className="mb-2 max-h-64 object-cover rounded-md shadow-md"
						/>
						<div className="flex flex-col gap-2">
							<h3 className="text-lg font-bold">{lastNews.title}</h3>
							<p className="text-sm text-gray-500">
								{new Date(lastNews.createdAt).toLocaleDateString("ru-RU", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
							<div className="text-base hidden sm:inline">
								{previewText(lastNews.content)}
							</div>
							<div className="text-base inline sm:hidden">
								{previewText(lastNews.content, 240)}
							</div>
							<div className="mt-2 justify-center gap-2 hidden lg:flex">
								<ButtonLink
									href={`/static/news/${lastNews.id}`}
									className="w-1/3"
								>
									<IconInfoCircle size={20} />
									Подробнее
								</ButtonLink>
								<ButtonLink
									href="/static/news"
									variant="secondary"
									className="w-1/3"
								>
									<IconNews size={20} />
									Все новости
								</ButtonLink>
							</div>
						</div>
					</div>
					<div className="mt-2 flex-col gap-2 w-full mx-auto sm:justify-center flex lg:hidden">
						<ButtonLink href={`/static/news/${lastNews.id}`} className="w-full">
							<IconInfoCircle size={20} />
							Подробнее
						</ButtonLink>
						<ButtonLink
							href="/static/news"
							variant="secondary"
							className="w-full"
						>
							<IconNews size={20} />
							Все новости
						</ButtonLink>
					</div>
				</div>
			</Container>
		</div>
	);
}
