"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { content } from "@/content";
import { ZoomIcon } from "./ui";

// The lightbox code loads only when the photo is first opened.
const PhotoLightbox = dynamic(() => import("./PhotoLightbox"), { ssr: false });

const { photo } = content.person;

/** Headshot that opens full-screen on tap (FR-8). */
export function HeroPhoto() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        aria-label={content.ui.lightbox.openPhoto}
        className="group relative block w-full overflow-hidden rounded-[2rem] shadow-xl shadow-sage-900/10 ring-1 ring-sage-200"
      >
        <Image
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          preload
          sizes="(min-width: 1024px) 380px, 320px"
          className="aspect-square w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
        />
        <span className="absolute bottom-3 end-3 inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-sage-900 shadow">
          <ZoomIcon />
        </span>
      </button>
      {loaded && (
        <PhotoLightbox
          open={open}
          onClose={() => setOpen(false)}
          onExited={() => trigger.current?.focus()}
        />
      )}
    </>
  );
}
