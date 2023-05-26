---
description: >-
  Deno v1 was released a couple of months ago with a lot of different opinions.
  Today, I decided to take a quick look into what it offers and what that
  potentially means.
tags: [deno, typescript, javascript, webdev]
cover:
  icons: [Deno, Node.js]
date: 2020-12-31
---

# A Quick Exploration Into **Deno**

Deno v1 was released a couple of months ago and there were a lot of different
opinions about it. Personally, I had a chance to quickly look at its
documentation and did _kinda_ like it, I also trust _Ryan Dahl_ - the creator
behind Deno (and Node.js).

So, here a deeper look into Deno and what it can potentially do.

## Deno's goals

First, we should understand why Deno was created in the first place, what
problems it is solving:

> Deno aims to be a productive and secure scripting environment for the modern
> programmer.
>
> - Deno's documentation

This definitely sounds very general. I had to look further into its
documentation to understand what problems Deno is solving.

First of all, although Deno and Node.js can co-exist, being **another**
TypeScript/JavaScript runtime, Deno's ultimate end goal is definitely to replace
Node.js, which means it was built to solve Node.js's problems. By describing
Deno "a productive and secure scripting environment" Deno creator is saying that
Deno is solving the problem of **Node.js being not productive and insecure**. As
I worked with Node.js and a few other modern languages (Go, Kotlin) before, I
definitely can relate that Node.js has these two issues:

- Not productive:

  - Did you ever switch from TypeScript back to JavaScript then realize that was
    a wrong choice? The number of LOCs in JavaScript codebase although can be
    fewer than the same project in TypeScript and no restriction seems to be
    easier, writing and collaborating in JavaScript is just much slower
    nowadays.

  - The Node.js devtool ecosystem though is powerful, is very fragmented: npm,
    yarn, CDN, linter, formatter, TypeScript, Flow, etc. You see all the
    "starter" projects with tons of configuration files?

- Insecure: I don't know if you have this feeling but every time I installed a
  new Node.js package, I wish the developer didn't push a virus script into it.
  The `node_modules` and installation process always feel cumbersome and
  insecure.

## How Deno solve these problems?

- TypeScript out of the box, no configuration.

- Ship only an executable file, no `node_modules`, and run everywhere without an
  installation process (except for the executable itself).

- Secure by default, you have to explicitly grant certain permissions before a
  script can do certain critical tasks.

- Have builtin devtools (`deno fmt`, `deno bundle`, `deno lint`, etc) and is a
  package manager itself.

- ES Modules native. Imports via URLs.

- Be browser-compatible.

### What does that mean?

Looking at Deno's features set, I had to say its vision is more ambitious than I
thought. All with a single executable:

- Write secure-by-default system scripts and server-side applications in
  TypeScript with zero configuration. TypeScript compilation is also abstracted
  away, for scripting experience, it is like running TypeScript natively (what
  [ts-node] does).

- Have builtin _fast_ ([swc]) compiler and bundler for modern ES syntax
  supported by modern browsers, essentially replacing `webpack`, `parcel`,
  `rollup`, etc.

- Have builtin `fmt` and `lint` tools, essentially replacing `prettier`,
  `eslint`, etc.

- Write, compile, and deploy code for both servers and modern browsers.

### Common misconception

#### Import by URLs??

A lot of people are skeptical about this and are afraid of unexpected changes
upstream. However, this concept was originally designed in ES standard and is
implemented in most modern browsers, Deno doesn't reinvent the wheel here.

First of all, there shouldn't be concern about changes upstream, **production
software should always vendor 3rd packages**, we have always been doing that by
bundling applications. Lock versions can also be done easily by keeping
checksums of previously downloaded packages.

This pattern also helps to have truly on-demand imports, you only load a package
when your execution reach its import, while in Node.js everything is fetched no
matter when and whether you'll use it.

Web protocol also enables more advanced import features (by communicating
metadata in HTTP headers, etc), allows to opt in interceptors doing complex
tasks, for example [on-demand compilation][vite].

#### Top-level await

This isn't just about allowing us to do "cool" `async` and `await` at top-level
in our `index.ts` or `app.ts`. This is built in combination with native ESM to
further enable async on-demand imports and secure-by-default features:

- A package is only loaded (downloaded) when a user did a certain action (went
  to a screen, used a feature), we can display a loading while importing the
  package.

- A permission may be asked and granted only until an import is loaded.

## Summary

I love it! I can picture a bright future with Deno, where you can write,
compile, bundle, and deploy performance TypeScript applications to both server
and client, with just a single Deno executable and little-to-zero configuration.

<!-- Links -->

[swc]: https://swc.rs
[ts-node]: https://www.npmjs.com/package/ts-node
[vite]: https://github.com/vitejs/vite#how-and-why
