"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { content } from "@/content";

const { photo } = content.person;
const { lightbox } = content.ui;

/**
 * Full-screen photo viewer (FR-8): close button, Esc and backdrop click
 * close it; focus stays inside while open. Prev/next stay hidden while
 * there is only one photo.
 */
export default function PhotoLightbox({
  open,
  onClose,
  onExited,
}: {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      on={{ exited: onExited }}
      slides={[{ src: photo.src, width: photo.width, height: photo.height, alt: photo.alt }]}
      carousel={{ finite: true }}
      controller={{ closeOnBackdropClick: true }}
      render={{ buttonPrev: () => null, buttonNext: () => null }}
      labels={{ Close: lightbox.close, Lightbox: lightbox.dialogLabel }}
      styles={{ container: { backgroundColor: "rgba(28, 30, 26, 0.94)" } }}
    />
  );
}
