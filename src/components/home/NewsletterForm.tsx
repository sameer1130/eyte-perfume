"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Frontend only for now: wire this to the mailing provider later.
    setDone(true);
  };

  if (done) {
    return (
      <p className="text-[14px] text-ink-2" role="status">
        Thank you. You&apos;re on the list for new arrivals.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md items-center gap-2 rounded-full border hairline bg-paper/70 p-1.5 pl-5 backdrop-blur">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email address"
        className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-mute"
      />
      <button type="submit" className="btn btn-ink h-11 shrink-0 px-5">
        Subscribe
      </button>
    </form>
  );
}
