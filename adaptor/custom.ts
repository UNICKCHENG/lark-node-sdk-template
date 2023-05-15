import get from 'lodash.get';
import * as lark from '@larksuiteoapi/node-sdk';

export const adaptCustom = 
    (
        dispatcher: lark.EventDispatcher | lark.CardActionHandler,
        options?: {
            autoChallenge?: boolean;
        }
    ) =>
    async (headers, body) => {
        if (!body || !headers) {
            return;
        }
        
        const data = Object.assign(
            Object.create({
                headers: headers,
            }),
            body
        );

        const autoChallenge = get(options, 'autoChallenge', false);
        if (autoChallenge) {
            const { isChallenge, challenge } = lark.generateChallenge(data, {
                encryptKey: dispatcher.encryptKey,
            });

            if (isChallenge) {
                return JSON.stringify(challenge);
            }
        }

        const value = await dispatcher.invoke(data);

        // event don't need response
        if (dispatcher instanceof lark.CardActionHandler) {
            return JSON.stringify(value);
        }
        return '';
    };