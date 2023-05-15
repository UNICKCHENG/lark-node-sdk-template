import * as lark from '@larksuiteoapi/node-sdk';
import {adaptCustom} from './custom';
import get from 'lodash.get';

export const adaptNextjs = 
    (
        dispatcher: lark.EventDispatcher | lark.CardActionHandler,
        options?: {
            autoChallenge?: boolean;
        }
    ) =>
    async (req, res) => {
        if (!req?.body || !req?.headers) {
            return;
        }
        res.end(
            await adaptCustom(dispatcher, {
                autoChallenge: get(options, 'autoChallenge', false),
            })(req.headers, req.body)
        );
    };