import { Bot } from "grammy";

console.log(process.env.BOT_TOKEN);
const bot = new Bot(String(process.env.BOT_TOKEN));

export default bot;
