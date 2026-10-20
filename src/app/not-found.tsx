import Link from "next/link";
import { Scene } from "@/components/botanica/Scene";

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 text-center">
      <Scene family="woody" sides={["right", "left"]} plantWidth="min(36vw, 520px)" />
      <div className="relative">
        <p className="eyebrow text-ink-2">Error 404</p>
        <h1 className="display mt-6 text-[clamp(4rem,12vw,11rem)]">Lost the</h1>
        <p className="script -mt-[0.2em] text-[clamp(3rem,8vw,7rem)] text-gold">trail</p>
        <p className="mx-auto mt-6 max-w-sm text-[15px] text-ink-2">This page has drifted away like smoke. Let&apos;s find you another scent.</p>
        <Link href="/shop" className="btn btn-ink mt-10">
          Back to the collection
        </Link>
      </div>
    </section>
  );
}
