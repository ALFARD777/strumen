"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function PhotoSystem({ photos }: { photos: string[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(photos[0]);

  return (
    <div className="w-full md:w-5/12 mr-4 mb-2">
      <div className="rounded-md overflow-hidden h-[300px] bg-gray-100 relative">
        <Image
          src={selectedPhoto}
          alt={selectedPhoto}
          fill
          className="object-contain"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex items-center mt-2 gap-2 overflow-x-auto">
          {photos.map((image) => (
            <button
              type="button"
              key={image}
              onClick={() => setSelectedPhoto(image)}
              className="flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-blue-500"
            >
              <div className="w-24 h-14 relative">
                <Image
                  src={image}
                  alt={image}
                  fill
                  className={cn(
                    "object-cover transition-all",
                    selectedPhoto !== image && "opacity-50",
                  )}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
