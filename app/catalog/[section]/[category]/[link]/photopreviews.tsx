"use client";
import Image from "next/image";
import { useSelectedPhotoStore } from "@/components/store/photo";
import { cn } from "@/lib/utils";

export default function PhotoPreviews({ photos }: { photos: string[] }) {
  const { photo, set } = useSelectedPhotoStore();

  return (
    photo && (
      <div className="flex items-center mt-2 gap-2 overflow-x-auto">
        {photos.map((image) => (
          <button
            type="button"
            key={image}
            onClick={() => set(image)}
            className="bg-white flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 border-transparent transition-all hover:border-blue-500"
          >
            <div className="w-24 h-14 relative">
              <Image
                src={image}
                alt={image}
                fill
                className={cn("object-cover transition-all", photo !== image && "opacity-50")}
              />
            </div>
          </button>
        ))}
      </div>
    )
  );
}
