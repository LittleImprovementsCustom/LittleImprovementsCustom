# Little Improvements: Custom
[![Website](https://img.shields.io/website?down_color=critical&up_color=success&url=https%3A%2F%2Fwww.littleimprovements-custom.tk&logo=firefox-browser&style=flat-square)](https://www.littleimprovements-custom.tk/)
[![Build](https://img.shields.io/github/workflow/status/LittleImprovementsCustom/LittleImprovementsCustom/Node.js%20CI?logo=github-actions&style=flat-square)](https://github.com/LittleImprovementsCustom/LittleImprovementsCustom/actions?query=workflow%3A%22Node.js+CI%22)
[![GPL-3.0 License](https://img.shields.io/github/license/LittleImprovementsCustom/LittleImprovementsCustom?logo=gnu&style=flat-square)](https://github.com/LittleImprovementsCustom/LittleImprovementsCustom/blob/master/LICENSE)
[![Discord](https://img.shields.io/discord/738126248194211960?color=7289da&logo=discord&style=flat-square&label=discord)](https://discord.gg/bNcZjFe)

Little Improvements: Custom is a resource pack picker, created by [Beatso](https://www.beatso.tk/), [Daggsy](https://www.planetminecraft.com/member/daggsy/) and [Kemiu](https://www.planetminecraft.com/member/kemiu/). There is a nice range of small aesthetic tweaks, and utility tweaks.

Choose and download your pack [here](https://www.littleimprovements-custom.tk/).\
Be sure to support this project on [its PMC page](https://www.planetminecraft.com/texture-pack/little-improvements-custom/)!

[![Example of pack picker](https://api.apiflash.com/v1/urltoimage?access_key=a253347deb8747fa8ced27e5239223bf&no_ads=true&no_cookie_banners=true&no_tracking=true&url=https%3A%2F%2Fwww.littleimprovements-custom.tk%2F)](https://www.littleimprovements-custom.tk/)

## Contact

If you have found a bug, or would like to suggest something, please [open an issue](https://github.com/LittleImprovementsCustom/LittleImprovementsCustom/issues/new).

Alternatively, you can get in touch on the [discord server](beatso.tk/discord).

If you have found a security vulnerability or something that should be sensitive, please learn how to responsibly report it [here](https://github.com/LittleImprovementsCustom/LittleImprovementsCustom/blob/master/.github/SECURITY.md).

## Hosting Locally

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)

### Setup

In the command line:
```sh
git clone https://github.com/LittleImprovementsCustom/LittleImprovementsCustom
cd src
npm install
```

> Note the following step is only necessary if you are wanting to download packs. If you are just trying to develop the frontend, you don't need to set up dropbox.

Create a new app at https://www.dropbox.com/developers/apps and give it the permissions `files.content.write`, `files.content.read` and `sharing.write`. Generate an access token.  
Create a new file `.env.example` (in `/src/` based off of `.env.example`). The `DBXACCESSTOKEN` should be the access token you just generated on dropbox.com.

### Running

To run and host the project, run the following your command line from the `src` folder:
```sh
npm start
```
