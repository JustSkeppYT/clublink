import { MessageEmbed, WebhookClient } from "discord.js"
import { config } from "dotenv";
import mineflayer from "mineflayer";
import colors from "colors";
import { mineflayer as mineflayerViewer } from 'prismarine-viewer';
import readline from "node:readline";
import formatDuration from "format-duration";

import ConsoleCosmeticLib from "./resources/console";
import emojis from "./resources/emojis";
import sequences from "./resources/sequences";
import DateUtil from "./util/date";

var Minecraft: mineflayer.Bot;
var Discord: WebhookClient;
var ChatBridge: readline.Interface = readline.createInterface(process.stdin, process.stdout);

const embedColor = "#ADD8E6";

/**
 * Under our license, you are required to keep this section of code in.
 * If you remove or modify it, you are legally liable and can be taken
 * to court. I don't mind you modifying my code to fit your needs, but
 * I don't at all give you permission to entirely take credit for my
 * work. If you want to take credit, write your own bot. No one likes
 * having their code stolen. Please don't do it to me <3 - Hannah
 */
const footer = "Powered by ClubLink | A GemDev Platform"

var sessionStats = {
    gems: 0,
    tokens: 0,
    sessionStart: new Date(),
    sessionEnd: new Date(),
    goodnights: 0
};

var playerData = {
    UUID: ""
};

var logGUIData = false;
var logChatData = false;

config();
console.clear();
ConsoleCosmeticLib.startUpSequence(() => {
 
    if (process.argv.includes("--gui")) {
        logGUIData = true;
        console.log(colors.red("[$]") + colors.gray(" GUI flag detected, logging GUI data"));
    }

    if (process.argv.includes("--chat")) {
        logChatData = true;
        console.log(colors.red("[$]") + colors.gray(" Chat flag detected, logging all chat messages"));
    }

    Discord = new WebhookClient({ url: process.env.URL as string });
    console.log(colors.green("[+]") + colors.gray(" Webhook client created")); 

    const options = {
        host: "play.mineclub.com",
        username: process.env.EMAIL as string,
        password: process.env.PASSWORD as string,
        auth: process.env.AUTH as "microsoft" | "mojang",
        version: "1.17.1",
        brand: "ClubLink"
    };
    
    Minecraft = mineflayer.createBot(options);
    console.log(colors.green("[+]") + colors.gray(" Established MineClub connection on version 1.17.1"));

    
    console.log(colors.yellow("[@]") + colors.gray(" Connecting to lobby server..."));
    Minecraft.once("spawn", () =>  {

        mineflayerViewer(Minecraft, { port: 4000, firstPerson: false })
        console.log(colors.cyan("[!]") + colors.gray(" Live view is reachable over this connection! Go to http://localhost:4000 to view it. Please note: textures don't work correctly due to some querks with our rendering engine."));

        playerData.UUID = Minecraft.player.uuid;
        Minecraft.acceptResourcePack();

        Discord.send({
            username: "ClubLink - " + Minecraft.username,
            avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
            embeds: [
                new MessageEmbed({
                    color: embedColor,
                    title: "Connection established",
                    footer: {
                        text: footer
                    }
                })
            ],
        }).then(() => {            
            console.log(colors.green("[+]") + colors.gray(" Successfully joined an available lobby server"));
            sessionStats.sessionStart = new Date();
        })
    });

    Minecraft.on("kicked", (reason) => {
        if (reason === "{\"text\":\"You seem to be logged in already. Try again later!\"}") {
            console.log(colors.red("[-]") + colors.gray(" Account lost connection to the server. This is because it's already connected to MineClub. If you frequently restart this process, open your task manager to ensure you haven't got a " + colors.bold.red("'phantom process'") + " open by accident. Otherwise, make sure your Java Edition account isn't connected in any windows. If this doesn't solve your issue, change your account credentials immediately."));
        }
    });

    ChatBridge.on("line", (input) => {
        
        if (input.startsWith("?")) {
            switch (input) {
                case "?list":
                    ChatBridge.close();
                    ChatBridge = readline.createInterface(process.stdin, process.stdout);
                    console.log(colors.magenta("[*]") + colors.gray(` There are currently ${Object.keys(Minecraft.players).length} players online.`));
                    ChatBridge.setPrompt("");
                    ChatBridge.prompt();
                    break;
                case "?leave":
                    ChatBridge.close();
                    ChatBridge = readline.createInterface(process.stdin, process.stdout);
                    Minecraft.end();
                    console.log(colors.red("[-]") + colors.gray(" Disconnected from MineClub"));
                    ChatBridge.setPrompt("");
                    ChatBridge.prompt();
                case "?disconnect":
                    ChatBridge.close();
                    ChatBridge = readline.createInterface(process.stdin, process.stdout);
                    Minecraft.end();
                    console.log(colors.red("[-]") + colors.gray(" Disconnected from MineClub"));
                    ChatBridge.setPrompt("");
                    ChatBridge.prompt();
		case "?stats":
                    ChatBridge.close();
                    ChatBridge = readline.createInterface(process.stdin, process.stdout);
                    console.log(colors.magenta("[*]") + colors.gray(` You have won ${sessionStats.tokens} tokens and ${sessionStats.gems} gems during this session!`));
                    ChatBridge.setPrompt("");
                    ChatBridge.prompt();
                    break;
            }
        } else if (input.startsWith("/home")) {
	  console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/afk")) {
	  console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/stafflounge")) {
	  console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/hub")) {
	  console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/")) {
            Minecraft.chat(input);
            Discord.send({
                username: "ClubLink " + "[" + Minecraft.username + "] ",
                avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                embeds: [
                    new MessageEmbed({
                        color: embedColor,
                        title: "USED COMMAND!",
                        description: `You have just ran a command via the panel.`,
                        footer: {
                            text: footer
                        }
                    })
                ],
            })
	} else {
            Minecraft.chat(input);
        }

    });

    Minecraft.on("windowOpen", (window) => {
        if (logGUIData) console.log(colors.cyan("[$]") + colors.gray(" GUI opened with title \"" + window.title + "\""));
    });

    Minecraft.on("messagestr", async (message, messagePosition, jsonMsg) => {

        const formattedMessage = message.replace(sequences.ADMIN_TITLE, " [Admin]").replace(/[^a-zA-Z0-9 &/$£"^%&{}[\]@,<>/`!?~#:;\-_=+*.]/g, "").replace(Minecraft.username, colors.blue(Minecraft.username)).replace("@everyone", colors.yellow("@everyone")).replace(Minecraft.username, colors.blue(Minecraft.username)).replace("@everyone", colors.yellow("@everyone"));

        if (formattedMessage.length < 8) {
            console.log(colors.magenta("[#]") + colors.gray(" Console Message - IGNORE"));
        } else {
            console.log(colors.cyan("[<]") + colors.cyan(formattedMessage));
        }

        

        if (messagePosition == "system") {
            if (message.match(/[\W]* You won ([0-9]) (\w*) Token[s]?!/g) != null) {
                let amount = Number.parseInt(message.replace(/[^0-9]+/, "")) 

                sessionStats.tokens += Number.parseInt(message.replace(/[^0-9]+/g, ""));
                
                Discord.send({
                    username: "ClubLink " + "[" + Minecraft.username + "] ",
                    avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                    embeds: [
                        new MessageEmbed({
                            color: embedColor,
                            title: emojis.CHRISTMAS_TOKEN + " YOU WON " + Number.parseInt(message.replace(/[^0-9]+/g, "")) + " CHRISTMAS TOKEN(S)!",
                            description: `You've now won ${sessionStats.tokens} during this session!`,
                            footer: {
                                text: footer
                            }
                        })
                    ],
                })

                console.log(colors.magenta("[#]") + colors.gray(" Account earned tokens"));

            }

            if (message.includes("阵")) {
                sessionStats.gems += 50;
                Discord.send({
                    username: "ClubLink " + "[" + Minecraft.username + "] ",
                    avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                    embeds: [
                        new MessageEmbed({
                            color: embedColor,
                            title: emojis.GEMS + " YOU EARNT 50 GEMS",
                            description: `You've now earnt ${sessionStats.gems} during this session!`,
                            footer: {
                                text: footer
                            }
                        })
                    ],
                })
            }
        } else if (messagePosition == "chat") {
            if (message.match(/[\W]+(\w+) -> ME: ([\w\W]+)/g)) {
                Discord.send({
                    content: `<@${process.env.USERID}> - you got a private message!`,
                    username: "ClubLink " + "[" + Minecraft.username + "] ",
                    avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                    embeds: [
                        new MessageEmbed({
                            color: embedColor,
                            description: "**" + message.replace(/[\W]+(\w+) -> ME: ([\w\W]+)/g, "$1") + "**: " + message.replace(/[\W]+(\w+) -> ME: ([\w\W]+)/g, "$2"),
                            footer: {
                                text: footer
                            }
                        })
                    ],
                })
                
                console.log(colors.magenta("[#]") + colors.cyan(" Account recieved private message from " + message.replace(/[\W]+(\w+) -> ME: ([\w\W]+)/g, "$1")));
            }
        }

    });

    Minecraft.on("chat", async (username, message, translate, jsonMsg, matches) => {
        if (username == Minecraft.username) {
            return;
        }

        if ((message.includes(Minecraft.username)) || (message.includes("@everyone"))) {
            Discord.send({
                content: `<@${process.env.USERID}>, you were mentioned in public chat!`,
                username: "ClubLink " + "[" + Minecraft.username + "] ",
                avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                embeds: [
                    new MessageEmbed({
                        color: embedColor,
                        description: username + ": " + message,
                        footer: {
                            text: footer
                        }
                    })
                ],
            })
            
            console.log(colors.magenta("[#]") + colors.cyan(" Account was mentioned in public chat either by username or by use of @everyone"));
        }

        if ((message.match(/\bgoodnight\b/g) || message.match(/\bnight\b/g) || message.match(/\bnini\b/g) ||message.match(/\bgn\b/g)) && message.includes(Minecraft.username)) {
            sessionStats.goodnights++;
            console.log(colors.magenta("[#]") + colors.cyan(" Account recieved a goodnight from a player"));
        }
        
    });

    Minecraft.on("end", (reason) => {

        sessionStats.sessionEnd = new Date();

        var formattedDiff = formatDuration(sessionStats.sessionEnd.valueOf() - sessionStats.sessionStart.valueOf());

        Discord.send({
            username: "ClubLink - " + Minecraft.username,
            avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
            embeds: [
                new MessageEmbed({
                    color: embedColor,
                    title: "Disconnected from MineClub!",
                    fields: [
                        {
                            name: "Session Length:",
                            value: formattedDiff
                        },
                        {
                            name: "Gems Earnt:",
                            value: sessionStats.gems + " " + emojis.GEMS
                        },
                        {
                            name: "Tokens Won:",
                            value: sessionStats.tokens + " " + emojis.CHRISTMAS_TOKEN
                        },
                    ],
                    footer: {
                        text: footer
                    }
                })
            ],
        })
    	process.on("SIGINT", () => {
            console.clear();
            console.log(colors.red("[-]") + colors.gray(" Process ended"));
            console.log(colors.bold.gray("Thank you for using ClubLink!"));
            console.log(colors.gray("ClubLink is developed & maintained by " + colors.bold.cyan("hanatic (aka Hannah)") + ".\nWe'd like to thank " + colors.bold.magenta("xCrystalz_ (aka Josh)") + " for his work testing the bot and " + colors.bold.red("LostAndDead") + " accidentally for calming Hannah down when she thought her account had been hacked."));
        })
	setTimeout(processend,3000)
	function processend() { 
    	    console.log(colors.red("Shutting down Clublink...."));
	    process.exit()
	}
    });

});
