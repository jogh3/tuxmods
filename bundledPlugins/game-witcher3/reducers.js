import { types, util } from 'vortex-api';
import { setPriorityType, setSuppressModLimitPatch } from './actions';
// reducer
export const W3Reducer = {
    reducers: {
        [setPriorityType]: (state, payload) => {
            return util.setSafe(state, ['prioritytype'], payload);
        },
        [setSuppressModLimitPatch]: (state, payload) => {
            return util.setSafe(state, ['suppressModLimitPatch'], payload);
        },
    },
    defaults: {
        prioritytype: 'prefix-based',
        suppressModLimitPatch: false,
    },
};
//# sourceMappingURL=reducers.js.map