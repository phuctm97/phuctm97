import type { ComponentPropsWithoutRef, FC } from "react";

import { clsx } from "clsx";
import Link from "next/link";
import { forwardRef } from "react";

import { Scroll } from "./scroll";

const DefaultLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof Link>
>(({ className, ...props }, ref) => (
  <Link
    ref={ref}
    className={clsx(
      "text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline",
      className
    )}
    {...props}
  />
));

if (process.env.NODE_ENV === "development")
  DefaultLink.displayName = "DefaultLink";

type ExternalLinkProps = Omit<
  ComponentPropsWithoutRef<typeof DefaultLink>,
  "target" | "rel"
>;

const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  (props, ref) => (
    <DefaultLink
      ref={ref}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  )
);

if (process.env.NODE_ENV === "development")
  ExternalLink.displayName = "ExternalLink";

const Page: FC = () => (
  <Scroll>
    <main className="mx-auto w-full max-w-2xl overflow-hidden px-5 py-10 md:py-12 lg:py-14">
      <p className="mb-5">Hi, I&apos;m Phuc!</p>
      <p className="mb-10">
        I&apos;m a full-time indie hacker. I build Internet products to solve
        problems for myself and others. I then charge a small fee to keep the
        lights on and live independently.
      </p>
      <h2 className="mb-5 font-semibold">Posts</h2>
      <p className="mb-10 text-gray-600">(No recent posts)</p>
      <h2 className="mb-5 font-semibold">Tweets</h2>
      <p className="mb-5">
        I build in public on Twitter. I tweet product updates and learnings{" "}
        <span className="italic">almost</span> every day, life updates
        sometimes, and epic shit-posts most often.
      </p>
      <p className="mb-10">
        See my tweets{" "}
        <ExternalLink href="https://twitter.com/phuctm97">
          @phuctm97
        </ExternalLink>
        .
      </p>
      <h2 className="mb-5 font-semibold">Sources</h2>
      <p className="mb-5">
        I open-source most of my recent work. It&apos;s building in public at
        its finest. Besides, it helps me get over the idea that my code is
        shitty, which it always is, to just ship it.
      </p>
      <p>
        See my sources{" "}
        <ExternalLink href="https://github.com/phuctm97">
          @phuctm97
        </ExternalLink>
        .
      </p>
    </main>
  </Scroll>
);

export default Page;
