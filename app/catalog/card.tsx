"use client";
import Image from "next/image";

export default function CategoryCard({
  section,
}: {
  section: {
    url: string;
    id: number;
    name: string;
    imagePath: string | null;
    sectionId?: number;
  };
}) {
  const handleNavigate = () => {
    window.location.href += "/" + section.url;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="bg-background-300 rounded-xl shadow-md overflow-hidden transform hover:scale-105 duration-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
    >
      <div className="relative w-full h-48 sm:h-56">
        <Image fill src={section.imagePath || "https://placehold.co/600x400?text=Без+Фото"} alt={section.name} className="object-contain drop-shadow-2xl hover:drop-shadow-black/70 transition-all duration-500 mt-2" />
      </div>
      <div className="p-4 text-center bg-background-300">
        <p className="text-lg sm:text-xl font-semibold">{section.name}</p>
      </div>
    </div>
  );
}
