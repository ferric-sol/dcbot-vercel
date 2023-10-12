import { Context } from "grammy";
import { createClient } from '@vercel/kv';
import { createPublicClient, http, isAddress, formatEther } from 'viem'
import { gnosis } from 'viem/chains'
import { normalize } from 'viem/ens'
import { privateKeyToAccount } from 'viem/accounts'
import { generatePrivateKey } from 'viem/accounts'

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


const generate = async (ctx: Context): Promise<void> => {
  const username =  ctx.from?.toString();
  if(!username) {
    await ctx.reply('No username');
    return;
  }

  let keyPair = await getKeyPair(username);
  if(!keyPair) {
    await ctx.reply('Generating keypair...');
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    keyPair = {
      address: account.address,
      privateKey: privateKey,
    };
    await ctx.reply('Generated keypair...');

    try {
      await kv.set(`user:${username}`, JSON.stringify(keyPair));
    } catch (error) {
      console.error('Error storing the key pair:', error);
    }
  }
  try {
    const message = `✅ Key pair generated successfully:\n- Address: ${keyPair.address}`;
    await ctx.reply(message);
  } catch (error) {
    await ctx.reply('failed to send message');
    console.error('Error sending message:', error);
  }
}
export default generate;