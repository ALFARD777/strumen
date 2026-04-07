"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function VideoPlayground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // Ignore autoplay rejections; the element is still valid and can start later.
      }
    };

    void tryPlay();
    video.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);

    return () => {
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {!loaded && (
        <Image
          width={959}
          height={720}
          src="https://avatars.mds.yandex.net/get-altay/11563767/2a000001923905c6f20a9e56522a0d54e95e/XXXL"
          alt="Заглушка видео"
          className="w-full h-full object-cover"
        />
      )}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        className={`w-full h-full object-cover ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        onLoadedData={() => setLoaded(true)}
      >
        <source src="/about.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

// Убрать комментарии для фото при загрузке видео
