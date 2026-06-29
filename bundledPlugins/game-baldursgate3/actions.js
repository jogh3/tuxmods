import { createAction } from 'redux-act';
// actions
export const setAutoExportLoadOrder = createAction('BG3_SETTINGS_AUTO_EXPORT', (enabled) => enabled);
export const setMigration = createAction('BG3_SET_MIGRATION', (enabled) => enabled);
export const setPlayerProfile = createAction('BG3_SET_PLAYERPROFILE', name => name);
export const settingsWritten = createAction('BG3_SETTINGS_WRITTEN', (profile, time, count) => ({ profile, time, count }));
export const setBG3ExtensionVersion = createAction('BG3_SET_EXTENSION_VERSION', (version) => ({ version }));
//# sourceMappingURL=actions.js.map