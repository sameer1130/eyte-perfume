import Image from "next/image";
import type { Product } from "@/data/products";
import { cn } from "@/lib/cn";

/**
 * A product's photograph, absolutely positioned inside a `relative` parent.
 * A cut-out bottle sits whole inside `cutoutClassName`, standing on the box's
 * bottom edge with a soft shadow; a full photograph fills `photoClassName`.
 */
export function ProductImage({
  product,
  sizes,
  cutoutClassName = "inset-[8%]",
  photoClassName = "inset-0",
  className,
  eager = false,
}: {
  product: Pick<Product, "name" | "house" | "image">;
  sizes: string;
  /** Position classes for a cut-out bottle's box. */
  cutoutClassName?: string;
  /** Position classes for a full photograph's box. */
  photoClassName?: string;
  /** Classes for either box, e.g. hover transitions. */
  className?: string;
  /** Load straight away, for the image that leads the page. */
  eager?: boolean;
}) {
  const { src, cutout, focus } = product.image;
  return (
    <div className={cn("absolute", cutout ? cutoutClassName : photoClassName, className)}>
      <Image
        src={src}
        alt={`${product.house} ${product.name}`}
        fill
        sizes={sizes}
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
        className={cutout ? "object-contain drop-shadow-[0_22px_26px_rgb(0_0_0/0.4)]" : "object-cover"}
        style={{ objectPosition: focus ?? (cutout ? "50% 100%" : "50% 50%") }}
      />
    </div>
  );
}
