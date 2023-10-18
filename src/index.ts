require("dotenv").config();

import commands from "./commands";
import bot from "./core/bot";
import { Menu, MenuRange } from "@grammyjs/menu";
import { development, production } from "./utils/launch";
import {
  constructZupassPcdGetRequestUrl,
} from "@pcd/passport-interface/src/PassportInterface";
import {
  ZKEdDSAEventTicketPCDArgs,
  ZKEdDSAEventTicketPCDPackage
} from "@pcd/zk-eddsa-event-ticket-pcd";

const menu = new Menu("zupass");

menu.dynamic(() => {
  const range = new MenuRange();
  const appUrl = `${process.env.VERCEL_URL}`;
  const returnUrl = `${process.env.VERCEL_URL}/api/zucheck`;
  const proofUrl = await constructZupassPcdGetRequestUrl(appUrl, returnUrl, ZKEdDSAEventTicketPCDPackage.name, {}, {
    genericProveScreen: true,
    title: "",
    description:
      "Fruitbot requests a zero-knowledge proof of your ticket to trade fruit"
  });
  menu.webApp('Validate proof', proofUrl);
})

bot.use(menu);
bot.use(commands);

process.env.NODE_ENV === "development" ? development(bot) : production(bot);

export {};
