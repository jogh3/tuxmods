import { createAction } from 'redux-act';
export const setRecommendations = createAction('SET_SDV_RECOMMENDATIONS', (enabled) => enabled);
export const setMergeConfigs = createAction('SET_SDV_MERGE_CONFIGS', (profileId, enabled) => ({ profileId, enabled }));
//# sourceMappingURL=actions.js.map