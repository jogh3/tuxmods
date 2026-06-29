import { setPrefixOffset, setPreviousLO, setUDF } from './actions';
import { types, util } from 'vortex-api';
export const reducer = {
    reducers: {
        [setPrefixOffset]: (state, payload) => {
            const { profile, offset } = payload;
            return util.setSafe(state, ['prefixOffset', profile], offset);
        },
        [setUDF]: (state, payload) => {
            const { udf } = payload;
            return util.setSafe(state, ['udf'], udf);
        },
        [setPreviousLO]: (state, payload) => {
            const { profile, previousLO } = payload;
            return util.setSafe(state, ['previousLO', profile], previousLO);
        }
    },
    defaults: {},
};
//# sourceMappingURL=reducers.js.map