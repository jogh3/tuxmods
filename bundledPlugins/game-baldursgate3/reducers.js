import * as actions from './actions';
import { types, util } from 'vortex-api';
// reducer
const reducer = {
    reducers: {
        [actions.setMigration]: (state, payload) => util.setSafe(state, ['migration'], payload),
        [actions.setAutoExportLoadOrder]: (state, payload) => util.setSafe(state, ['autoExportLoadOrder'], payload),
        [actions.setPlayerProfile]: (state, payload) => util.setSafe(state, ['playerProfile'], payload),
        [actions.setBG3ExtensionVersion]: (state, payload) => util.setSafe(state, ['extensionVersion'], payload.version),
        [actions.settingsWritten]: (state, payload) => {
            const { profile, time, count } = payload;
            return util.setSafe(state, ['settingsWritten', profile], { time, count });
        },
    },
    defaults: {
        migration: true,
        autoExportLoadOrder: true,
        playerProfile: 'global',
        settingsWritten: {},
        extensionVersion: '0.0.0',
    },
};
export default reducer;
//# sourceMappingURL=reducers.js.map