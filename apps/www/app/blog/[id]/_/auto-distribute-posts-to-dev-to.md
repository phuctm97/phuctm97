---
description: >-
  To maximize distributions of my future posts with zero effort, I'm writing a
  bot to distribute all my posts to DEV.to using their API.
tags: [blog, devops, automation, github]
cover:
  icons: [dev.to, Github Actions]
date: 2020-12-20
---

# Automate Distributing My Posts to DEV.to

To maximize distributions of my blog posts with zero effort, I'm writing a bot
to distribute all my posts to [DEV.to] using [their API][dev.to api].

## Requirements

- Every MDX page on `master` are automatically created (if not) and updated on
  DEV.to when there are changes.

- It doesn't have to happen in real-time, <3 days is acceptable.

## How?

Because I host my repository on Github, the obvious option is to use [Github
Actions]. There is another option is to write a [Github Probot], which gives me
more control but gonna be more complicated and introduce some server cost. I
decided to go with Github Actions because I don't need a lot of control now,
just need to get things done in the cheapest way possible, Github Actions is
also free (for open-source).

### Concept

To be able to track new and updated articles, I'm going to create a file to
store all articles that are created on DEV.to, each has a DEV.to-specific `id`
and `url` so that I can reference to update or redirect to later. I name the
file `data/devto-sync.json`, it looks like this:

```json
{
  "blog/auto-distribute-posts-to-dev-to": {
    "id": 548400,
    "url": "https://dev.to/phuctm97/automate-distributing-my-posts-to-dev-to-gmn-temp-slug-8615862",
    "md5": "<hash>"
  },
  "blog/hello-world-start-blog-in-html": {
    "id": 548401,
    "url": "https://dev.to/phuctm97/hello-world-i-started-my-blog-in-plain-html-19ii-temp-slug-8835697",
    "md5": "<hash>"
  },
  "blog/my-custom-md-language": {
    "id": 548402,
    "url": "https://dev.to/phuctm97/create-an-mdx-plugin-to-have-my-own-markdown-language-502-temp-slug-1959146",
    "md5": "<hash>"
  },
  "blog/switch-to-next-js-and-mdx": {
    "id": 548403,
    "url": "https://dev.to/phuctm97/switch-to-next-js-and-mdx-1214-temp-slug-8266681",
    "md5": "<hash>"
  }
}
```

The JSON is a map of the article path/slug on my website ➡️ its DEV.to
information. Each item has an `md5` value which is a hash of the DEV.to
article's content, I use this to detect whether an article is updated and
therefore should be synced to DEV.to.

For every commit pushed to `master`, I'll iterate through all existing articles
on my website, if an article is not recorded in `devto-sync.json`, I'll create
one, if it is recorded, I'll compare the `md5` value, if the two `md5` values
differ, I'll make an update to DEV.to, otherwise, the article is up to date.

#### Pros

I only run a minimum number of API calls to DEV.to, which helps avoid rate limit
as well as increase performance and save resources.

This workflow is generic enough that I can apply for other platforms (Hashnode,
Medium).

#### Cons

On every push, I'll have to regenerate DEV.to content, compute, and compare MD5
for all articles. This is okay when I have a small number of articles, however
it can be a problem when I have >100 articles. To further optimize this, the
easiest way that I have in mind is to record the commit hash that was processed
last time and do computation only on files changed since that commit.

### Implementation

Following is the main sync script I wrote that can give you an overview of how
it works in practice:

```js
const path = require("path");
const fs = require("fs");
const md5 = require("md5");

const logger = require("./logger");
const pageUtils = require("../mdx/page-utils");

const DEVto = require("./devto");
const DEVtoSyncJSONPath = path.resolve(__dirname, "../data/devto-sync.json");

const toDEVto = ({ frontmatter, content }) => ({
  frontmatter: {
    title: frontmatter.title,
    description: frontmatter.description,
    canonical_url: frontmatter.canonicalURL,
  },
  content,
});

const toDEVtoSyncJSON = ({ id, url }, md5) => ({ id, url, md5 });

const sync = async () => {
  const devtoSync = require(DEVtoSyncJSONPath);

  const pagePaths = pageUtils.all();
  for (let pagePath of pagePaths) {
    const { subpage, slug } = pageUtils.getURLParam(pagePath);
    const pageID = `${subpage}/${slug}`;

    const page = pageUtils.read(subpage, slug);

    const devtoPage = toDEVto(page);
    const devtoMD5 = md5(pageUtils.stringify(devtoPage));

    if (!devtoSync[pageID]) {
      logger.debug(`New page '${pageID}': creating DEV.to article...`);

      devtoSync[pageID] = toDEVtoSyncJSON(
        await DEVto.createArticle(devtoPage),
        devtoMD5
      );

      logger.success(`Created DEV.to article '${devtoSync[pageID].url}'.`);
    } else {
      const { id, url, md5: prevMD5 } = devtoSync[pageID];
      if (prevMD5 !== devtoMD5) {
        logger.debug(
          `Page '${pageID}' changed: updating DEV.to article '${url}'...`
        );

        devtoSync[pageID] = toDEVtoSyncJSON(
          await DEVto.updateArticle(id, devtoPage),
          devtoMD5
        );

        logger.success(`Updated DEV.to article '${devtoSync[pageID].url}'.`);
      }
    }
  }

  fs.writeFileSync(DEVtoSyncJSONPath, JSON.stringify(devtoSync, null, 2));
  logger.info("DEV.to articles are up to date.");
};

sync().catch((err) => {
  logger.error(err);
  process.exit(1);
});
```

I then call this in [my Github Actions workflow][github workflow]. [The workflow
took about 56s][workflow run] to update 4 articles (normally it would only
update once).

[Checkout my full repo at this commit][commit source] to see full source code
and implement for your own, feel free to DM [me on Twitter] if you need any
help.

<!-- Links -->

[dev.to]: https://dev.to
[dev.to api]: https://docs.dev.to/api
[github actions]: https://github.com/features/actions
[github probot]: https://probot.github.io
[github workflow]: https://github.com/phuctm97/phuctm97.com/blob/3c16361016a5db279b9b7dd915449bc201a45472/.github/workflows/sync.yml
[workflow run]: https://github.com/phuctm97/phuctm97.com/runs/1588494827?check_suite_focus=true
[commit source]: https://github.com/phuctm97/phuctm97.com/tree/3c16361016a5db279b9b7dd915449bc201a45472
[me on twitter]: https://twitter.com/phuctm97
