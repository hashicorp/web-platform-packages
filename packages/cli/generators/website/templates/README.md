# Website Template

This repository contains a generic template for creating a new website based on the standard platform used by HashiCorp.

## Installation

A copy of this base template can be created using [nextjs-scripts](https://github.com/hashicorp/nextjs-scripts/), using the binary command `next-hashicorp generate website`. We suggest running it with `npx` to avoid a global installation, the command for this would look like `npx @hashicorp/nextjs-scripts generate website`.

After the template is generates, make sure to run `npm install` to install dependencies.

## Local Development

There are two ways that the website can be run locally. If you do not have node installed and prefer not to, it can be run through Docker. The caveat here is that everything will be a little bit slower due to the additional overhead, so for frequent contributors it may be worth it to install node. Additionally, if the modifications you are introducing change the node dependencies, you will need to rebuild the Docker container in order for the dependency changes to appear, as the Docker workflow build pre-installed dependencies into the image so that they do not need to be re-installed each time it runs.

### Setting Up Docker (For template author, delete before release)

There are a couple steps you need to take in order to set up the environment for the "easy mode" Docker local dev:

1. Get Kyle to make you a docker hub repo called "<%= name %>-website"
2. Go to circleci.com and set up circle to watch your repo
3. In the circleci settings, add `DOCKER_USER` and `DOCKER_PASS` environment variables, set to your docker hub login. The values are not visible to anyone else so no worries about security here.

That's all, docker images should be automatically published whenever dependencies change! Once this is all set up, please delete this section from the readme.

### Local Development with Docker

To run the website in a Docker container, you must have Docker installed, but do not need node to be installed. First run `make build-image` to build a Docker image with node dependencies installed. After this, you can run `make website` to run the website in development mode. You only need to run `make build-image` the first time you start working on the site, or if dependencies change.

#### Docker on Windows
Local development with Docker on Windows is supported but comes with a few caveats. 

- Only the equivalent to `make website` (described above) is supported. Our equivalent PowerShell script `Website.ps1` will however pull the Docker image for you if necessary so long as the proper image name is configured when the site was generated by `nextjs-scripts`.
- Windows users should be using [PowerShell Core](https://github.com/PowerShell/PowerShell) to start and manage local development with Docker for compatibility with `.ps1` scripts we provide. This allows us to share these scripts in this repo more easily.

To run the website in development mode with Docker for Windows, open PowerShell Core at the root of the website and run `.\scripts\powershell\Website.ps1`. 

A detailed explanation of these scripts is available in a README within the `.\scripts\powershell` directory.


### Local Development with Node

To start the website in development mode if [you have node installed](https://nodejs.org/en/), you can run `npm start`. This will start the site in dynamic mode, booting up quickly and compiling each page as its loaded.

To export a static version of the website, run `npm run static`. It will be exported to a folder called `out`.

To run the website with a server in production mode, run `npm run dynamic` to build the assets in production mode and kick off an express server.

In both scenarios, you can **visit the local website at `http://localhost:3000`**. When you modify content, the website will automatically reload, you do not have to stop and restart the development environment.

#### Node on Windows
Since our stack often leverages the filesytem and a variety of NodeJS scripts to handle various complex tasks, local NodeJS development on Windows is most effectively done using [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install-win10). With WSL, `node` & `npm` config, file paths, system utilities such as `git` & `make`, and other compatibility concerns become a non-issue.

WSL2 can be configured according to the following [Microsoft guide.](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-wsl2)

WSL1 (the original) is also an option if the Windows Insiders program process seems too cumbersome. 

It's important to note the [major differences to be aware of between these versions.](https://docs.microsoft.com/en-us/windows/wsl/wsl2-ux-changes)

In general, with WSL, it's easy to leverage any and all commonly used Unix-based tools such as `bash` (& other shells), [brew](https://docs.brew.sh/Homebrew-on-Linux), [nvm](https://github.com/nvm-sh/nvm), etc.

### Creating Content

#### Pages

To create a page, create a Markdown (`mdx`), TypeScript (`tsx` or `ts`), or JavaScript (`jsx` or `js`) file in the `pages/` directory. The path to the file will also be the URL to the page.

Markdown files can be used for mostly static, text-based content. You can read the documentation for that in the [Markdown section](#markdown).

TypeScript and JavaScript files enable more complex behavior, data querying, and more. These should be used for layout files, dynamic pages, etc. For TypeScript or JavaScript files, the defaut ES6 export should be a
React Component. This will be rendered for the page. More documentation can be found on the [Next.js website](https://nextjs.org/docs/#fetching-data-and-component-lifecycle). You will see examples of both of these types of content in the `/pages` folder.

#### Markdown

HashiCorp websites often use Markdown for content authoring. To create a new page with Markdown, create a file ending in `.mdx` in the `pages/` directory. The path in the pages directory will be the URL route. For example, `pages/hello/world.mdx` will be served from the `/hello/world` URL.

This file can be standard Markdown and also supports [YAML frontmatter](https://middlemanapp.com/basics/frontmatter/). YAML frontmatter is optional, there are defaults for all keys.

```yaml
---
layout: 'custom'
title: 'My Title'
---

```

The significant keys in the YAML frontmatter are:

- `layout` `(string)` - This is the name of the layout file to wrap the Markdown page with, found in `pages/layouts`
- `title` `(string)` - This is the title of the page that will be set in the HTML title.

#### Analytics

If your project needs to implement analytics, you can run the provided npm script, `npm run generate:analytics` to generate a typed analytics client based on a specific [Tracking Plan](https://github.com/hashicorp/web-tracking-plans). By default the generated files will be located within an `analytics/generated` directory. Pass an `-o` or `--outputPath` flag to specify a specific output directory. i.e. `next-hashicorp analytics --outputPath ./analytics/typewriter`

### Deployment

Websites can be configured to deploy in one or more ways:

- **Manually** - This requires manually clicking a deploy button on Netlify.com. This is usefulf or humans.

- **On Git Push** - This will automatically deploy the website anytime you push to a configured Git branch. This is useful for patterns such as having a `stable-website` branch outside of `master`.

- **Webhook** - This will give you one or more URLs to `GET` to trigger a deploy. No auth is required, the URL is security through obscurity. This is useful for other automation systems, such as CI.

The methods for deployment are all configured via the Terraform automation explained in the next section.

#### Initial Setup

When you're ready to deploy your website publicly, you'll have to start by configuring all the services that our platform uses, such as Netlify. We've automated this with [Terraform](https://www.terraform.io/).

Copy the `terraform.tfvars.example` file to `terraform.tfvars` in this folderand change the settings that are there. They should be documented with comments.

Set the following environment variables for auth:

- `GITHUB_TOKEN` - This should be a valid GitHub access token with `repo` access to the repository with your website. You can [create tokens here](https://github.com/settings/tokens).

- `NETLIFY_TOKEN` - This should be a valid Netlify personal access token. You can [create a personal access token here](https://app.netlify.com/account/applications).

Then run `make terraform`. This will create and configure the website and the outputs from Terraform will show where you can view the website, view deploy progress, and more.

You shouldn't have to run Terraform again unless noted otherwise.

#### Teardown/Destroy

**To destroy your website,** run `terraform destroy`. This will remove all Netlify configuration, delete deployment keys, and more.
