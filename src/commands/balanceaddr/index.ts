import { Context } from "grammy";
import { createClient } from '@vercel/kv';
import { createPublicClient, http, isAddress, formatEther } from 'viem'
import { gnosis } from 'viem/chains'

interface KeyPair {
  address: string;
  privateKey: string;
}

const { KV_REST_API_URL, KV_REST_API_TOKEN, GNOSIS_URL } = process.env;

if (!KV_REST_API_URL || !KV_REST_API_TOKEN || !GNOSIS_URL) {
  throw new Error('Environment variables KV_REST_API_URL and KV_REST_API_TOKEN and ALCHEMY_URL and TELEGRAM_API_KEY must be defined');
}

const transport = http(GNOSIS_URL);

const client = createPublicClient({
  chain: gnosis,
  transport,
})

const kv = createClient({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
});

const getKeyPair = async (username: string): Promise<KeyPair | null> => {
  return await kv.get(`user:${username}`);
}

async function returnBalance(ethAddress: string) {
  if (!ethAddress || !isAddress(ethAddress)) {
    const message = 'Address not understood';
    return message;
  }

  try {
    const balanceWei = await client.getBalance({address: ethAddress});
    const balanceEth = formatEther(balanceWei);
    
    const balanceWeiNumber = Number(balanceWei);
    const message = `✅ The balance for address: *"${ethAddress}"* is ${balanceEth} xDAI\nHave a great day! 👋🏻`;
    return message;
  } catch (error) {
    console.error(error);
    const message = 'Error fetching balance';
    return message;
  }
}

const balanceaddr = async (ctx: Context): Promise<void> => {
  const ethAddress = ctx.message?.text?.replace('/balanceaddr', '').trim();
  const keyPair = ctx.from ? await getKeyPair(ctx.from.toString()) : null;
  if (ethAddress) {
    await ctx.reply(await returnBalance(ethAddress));
  } else if (keyPair?.address) {
    await ctx.reply(await returnBalance(keyPair?.address));
  }
}

export default balanceaddr;