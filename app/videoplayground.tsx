"use client";

// import Image from "next/image";
// import { useState } from "react";

export default function VideoPlayground() {
  // const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {/* {!loaded && (
        <Image
          width={959}
          height={720}
          src="https://avatars.mds.yandex.net/get-altay/11563767/2a000001923905c6f20a9e56522a0d54e95e/XXXL"
          alt="Заглушка видео"
          className="w-full h-full object-cover"
        />
      )} */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        // onLoadedData={() => setLoaded(true)}
      >
        <source src="/about.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

// Убрать комментарии для фото при загрузке видео
