import { Composer } from "grammy";

import hello from "./hello";
import generate from "./generate";
import balance from "./balance";
import balanceaddr from "./balanceaddr";

const composer = new Composer();

composer.command("hello", hello);
composer.command("generate", generate);
composer.command("balance", balance);
composer.command("balanceaddr", balanceaddr);

export default composer;
