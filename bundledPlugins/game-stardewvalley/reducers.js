import * as actions from './actions';
import { types, util } from 'vortex-api';
const sdvReducers = {
    reducers: {
        [actions.setRecommendations]: (state, payload) => {
            return util.setSafe(state, ['useRecommendations'], payload);
        },
        [actions.setMergeConfigs]: (state, payload) => {
            const { profileId, enabled } = payload;
            return util.setSafe(state, ['mergeConfigs', profileId], enabled);
        },
    },
    defaults: {
        useRecommendations: undefined,
    },
};
export default sdvReducers;
//# sourceMappingURL=reducers.js.map