# fastify + preact + islands

Minimal Client Side JS using existing tools and libraries.

The idea is to provide you with a simple app structure that allows you to
register and hydrate islands using fastify and preact without adding a lot of
generative code magic using bundler plugins. This is both a base to start with
for apps and a decent way to understand what goes into making sure the
interactive bits are runnings on the client(browser).

## Prerequisites

- Node.js 20 or higher
- pnpm

## Usage

The repository is a reusable template that you can setup with the following
steps

1. Install deps

```sh
pnpm i
```

2. Run Dev

```sh
pnpm dev
```

3. Open http://localhost:3000 in your browser

4. Run Build

```sh
pnpm build
```

5. Run Built asset

```sh
node .output/index.js
```

## Technologies

- [Fastify](https://www.fastify.io/) - Web server
- [Preact](https://preactjs.com/) - UI library
- [Islands Architecture](https://preactjs.com/blog/simplifying-islands-arch`) -
  Partial hydration

## LICENSE

[LICENSE](/LICENSE)
