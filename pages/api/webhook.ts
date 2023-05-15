import * as lark from '@larksuiteoapi/node-sdk';
import { adaptNextjs } from '../../adaptor/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const client = new lark.Client({
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    appType: lark.AppType.SelfBuild
});

const eventDispatcher = new lark.EventDispatcher({
    verificationToken: process.env.TOKEN,
    encryptKey: process.env.ENCRYPT_KEY,
}).register({
    'im.message.receive_v1': async (data) => {
        const chatId = data.message.chat_id;

        const res = await client.im.message.create({
            params: {
                receive_id_type: 'chat_id',
            },
            data: {
                receive_id: chatId,
                content: JSON.stringify({text: 'hello world'}),
                msg_type: 'text'
            },
        });
        return res;
    }
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await adaptNextjs(eventDispatcher, {
        autoChallenge: true,
    })(req, res);
};