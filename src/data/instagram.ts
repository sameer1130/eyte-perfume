/*
 * Real posts from instagram.com/eyte.perfumes, downloaded into
 * /public/images/instagram. Refresh by replacing the files and entries.
 */

export const INSTAGRAM_HANDLE = "eyte.perfumes";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export type InstagramPost = {
  href: string;
  image: string;
  alt: string;
  kind: "post" | "reel";
  /** object-position when the tile crops the image */
  focus?: string;
};

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    href: "https://www.instagram.com/p/DerCVqcCpFT/",
    image: "/images/instagram/post-naseem.webp",
    alt: "Naseem Pink & Blue, a modern fragrance for every mood",
    kind: "post",
  },
  {
    href: "https://www.instagram.com/reel/DeeynEjKSVd/",
    image: "/images/instagram/post-laathani.webp",
    alt: "Laathani by Ahsab, held in a softly lit dressing room",
    kind: "reel",
  },
  {
    href: "https://www.instagram.com/p/DeahqFyCr8M/",
    image: "/images/instagram/post-three-acts.webp",
    alt: "Every perfume tells a story in 3 acts. Which one is yours?",
    kind: "post",
  },
  {
    href: "https://www.instagram.com/reel/DeUWQEhKuGD/",
    image: "/images/instagram/khamrah-qahwa.webp",
    alt: "Lattafa Khamrah Qahwa with coffee beans and a brass dallah",
    kind: "reel",
  },
  {
    href: "https://www.instagram.com/reel/DecEZJiq33m/",
    image: "/images/instagram/oud-roses-box.webp",
    alt: "The Oud & Roses gift box",
    kind: "reel",
    focus: "68% 50%",
  },
  {
    href: "https://www.instagram.com/reel/DeZlaIOKaBq/",
    image: "/images/instagram/post-hawas.webp",
    alt: "Rasasi Hawas: guess the scent",
    kind: "reel",
  },
];
