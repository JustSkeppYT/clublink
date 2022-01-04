

# ClubLink: the future of MineClub.
With ClubLink, you can track tokens and gems earnt while AFKing without even having to open Minecraft. More features coming soon! Built using Discord.JS, Mineflayer & Typescript.

### Dev Team
- Hannah: Lead Developer (works on ClubLinker)
- Josh: Developer & Discord Manager (works on ClubLink client)

### Credit
- TheMysterys for the original concept (https://github.com/TheMysterys/Mineclub-Link)
- unknownsy and vivi for helping with Title Management (which Josh was meant to do)

### Setup Instructions (written for MacOS but should be universal)

#### Setup
You will need Node.JS 16 or above. Install it from https://nodejs.org/en.
1. Clone or download the source code. It will be a folder which might contain a second one inside called "clublink-main"
2. Open the folder and run `npm i` in a terminal to install the needed packages.
3. Then run `npm i -g typescript ts-node`
4. In the folder, create a file called `.env`. Add the following **without quotation marks**:
```
URL=<Add your webhook URL here>
AUTH=<Either microsoft or mojang, depending on whether your account is migrated - make sure lowercase>
EMAIL=<Your account email>
PASSWORD=<Your account password>
```
6. Finally, run `ts-node ./src/index.ts`

#### Common Bugs
If it says "Shutting down ClubLink", or doesn't work after Connecting to lobby this means that something in your .env file is wrong. This is most likely the AUTH section. Make sure that Microsoft or Mojang is ALL lowercase.

#### Flags
If you want to view chat messages & send them, add the `--chat` flag to the end of the command.
If you want to view data about GUIs that are opened, add the `--gui` flag to the end of the command.
  
### Bugs
Report bugs in our Discord: https://discord.com/invite/G3XyxRCd3v
