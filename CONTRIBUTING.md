Thanks for contributing to Custom! Before you make changes, there are a few things you might want to consider:



# Style Guide


* Use [`lowerCamelCase`](http://wiki.c2.com/?LowerCamelCase) in code and in pack IDs.

* Use British English wherever possible.

* When naming items/mobs/etc in the game, use the name stated by the [Minecraft Wiki](https://minecraft.gamepedia.com/Minecraft_Wiki), and use lowercase.



# Guide to creating new modules

## Deciding on an ID

Decide on an ID for your module, which is normally very similar to the name. 

For example, if my module's name was `Animated Campfire Items`, my ID would be `animatedCampfireItems`.

Be sure to use [`lowerCamelCase`](http://wiki.c2.com/?LowerCamelCase).

## Adding the module files

Add the files for the resource pack into `/storage/modules/[moduleID]/`.

Imagine the folder with the ID of your pack is the `/assets/minecraft/` folder of a normal resource pack.

## Adding the module icon

> Note: If this is a hidden (merged for incompatibilies) pack, this stage is not necessary. 

Add the icon for the module. Usually this is just an upscaled version of a texture included.

Upscale the the texture [here](https://lospec.com/pixel-art-scaler/) to a max size of 300 pixels tall or wide. Save as a `png` or `gif` file.

Then, if it is a PNG, optimise it [here](https://tinypng.com/).

Once the icon is made, upload it to `/public/icons/` and name it the ID of your module, with the relevant file extension.

## Updating [modules.json](https://github.com/LittleImprovementsCustom/LittleImprovementsCustom/blob/master/storage/data/modules.json)

Next, you need to add the data from your pack to [`/storage/data/modules.json`](https://github.com/LittleImprovementsCustom/LittleImprovementsCustom/blob/master/storage/data/modules.json).

Open the file, create a new object, and see [here](https://github.com/LittleImprovementsCustom/LittleImprovementsCustom/blob/master/CONTRIBUTING.md#modulesjson-layout) for the layout.

## Committing your changes

Commit and push your changes.

If you are not confident and would like someone to review your changes, create a new branch, commit to there and submit a new pull request.

If you do not have push permission, fork the repo, and submit a new pull request.



# `modules.json` layout

A `*` denotes that this is optional if the module is hidden.

```js
[  // the root of the file
    {  // each module has its own object

        "id": "honeyJar",  // the id of the pack

        "label": "Honey Jar",  // the label displayed on the website *

        "description": "Changes honey bottle to a jar of honey, and renames the item.",  // the description displayed on the website *

        "icontype": "png",  // the file extension of the pack icon *
        
        "hidden": false,  // [optional] if this is set to true, this pack will not be displayed on the website. used for invisible merged packs

        "incompatibilities": [  // [optional] the list of modules this is incompatible with
            {
                "id": "connectedSmoothStone",  // the id of the incompatible pack
                "useInstead": "honeyJarPlusConnectedSmoothStone"  // the id of the pack to replace the two incompatible packs with
            }
        ],

        "storageFiles": ["storage/modules/honeyJar/textures/item/honey_bottle.png"],  // the file paths of the module's files in storage
        "packFiles": ["/assets/minecraft/textures/item/honey_bottle.png"]  // the file paths of the assets in a resource pack
    }
]
```
