# A Hybrid CMS based on [Strapi](https://strapi.io/)
## Description
- Building up the core functions and utilities of backend using JavaScript language and NodeJS based on Strapi - A headless CMS.
MongoDB database.
- Support access APIs through GraphQL or RestAPI.
- Building up the core functions, framework, and utilities of client-side using Preact (a ReactJS alternative) and TypeScript language.
- Building up shared components and widgets - using Preact and TypeScript support web developers who want to build a website easily.
- Support multi-languages management at the client-side UI.
- The cached-server using Redis supports caching of preload and list data.
- Server side rendering (SSR) using ExpressJS with NodeJS.
- Deploy on production server via CAKE build.

Upcoming features:

- The WebBuilder using Preact and TypeScript language that supports web designers who want to make website through dragging & dropping.
- Using Docker to deploy all in one image that is able to adapt with all the platforms.
- Remote deploy by CLI can deploy and publish to the production server.
- The Package Libraries will be built with Verdaccio for contributors can share their components easily.
- The Package Management (that included inside the core) will help to download and distribute the shared components to the consumers (web developers or web designers).
- The Market where the contributors will share or sell their components.

## Install

Install via [Lutex api's installer](https://github.com/khiemnd777/project_lutex_api_install), recommend to fork then clone above project and run the **init.ps1** in Powershell bash.
```powershell
.\init.ps1
```
## Build for development
Recommend to use in [Yarn](https://yarnpkg.com/)
- Run with env:development
```
yarn build
```
```
yarn develop
```
- Run with env:production
```
yarn build:prod
```
```
yarn develop:prod
```
Read more detail in **package.json** file.
