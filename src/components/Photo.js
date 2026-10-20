import Image from "next/image";
import brand from "@/brand.config";
import images from "@/lib/images";

/** next/image + the "Your photos go here" pill. Parent must be position:relative with a size. */
export default function Photo({ id, sizes, priority = false, quality, className = "", note = true, style }) {
  const img = images[id];
  if (!img) return null;
  return (
    <>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        quality={quality}
        className={`object-cover ${className}`}
        style={style}
      />
      {note && brand.showPhotoNotes ? <span className="photo-note">Your photos go here</span> : null}
    </>
  );
}
