import Image from "next/image";
import { assetPath } from "@/lib/base-path";

type EditorialImageProps = {
  src: string;
  alt: string;
  eyebrow?: string;
  caption?: string;
  className?: string;
  sizes: string;
  priority?: boolean;
};

export function EditorialImage({
  src,
  alt,
  caption = "原创概念视觉 · 非客户或工厂实拍",
  className = "",
  sizes,
  priority = false,
}: EditorialImageProps) {
  return (
    <figure className={`media-frame ${className}`.trim()}>
      <div className="media-frame__image">
        <Image
          src={assetPath(src)}
          alt={alt}
          fill
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          quality={82}
          sizes={sizes}
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
