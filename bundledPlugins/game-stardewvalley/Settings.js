import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ControlLabel, FormGroup, HelpBlock, Panel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { Toggle, More, selectors, types } from 'vortex-api';
import { setRecommendations } from './actions';
import { GAME_ID } from './common';
function Settings(props) {
    const { onMergeConfigToggle } = props;
    const sdvSettings = useSelector((state) => state.settings['SDV']);
    const { useRecommendations, mergeConfigs } = sdvSettings;
    const store = useStore();
    const { profileId } = useSelector(mapStateToProps);
    const setUseRecommendations = React.useCallback((enabled) => {
        store.dispatch(setRecommendations(enabled));
    }, []);
    const setMergeConfigSetting = React.useCallback((enabled) => {
        onMergeConfigToggle(profileId, enabled);
    }, [onMergeConfigToggle, profileId]);
    const { t } = useTranslation();
    const mergeEnabled = mergeConfigs?.[profileId];
    return (_jsx("form", { children: _jsx(FormGroup, { controlId: 'default-enable', children: _jsx(Panel, { children: _jsxs(Panel.Body, { children: [_jsx(ControlLabel, { children: t('Stardew Valley') }), _jsxs(Toggle, { checked: useRecommendations, onToggle: setUseRecommendations, disabled: true, children: [t('Use recommendations from the mod manifests'), _jsx(More, { id: 'sdv_use_recommendations', name: 'SDV Use Recommendations', children: t('If checked, when you install a mod for Stardew Valley you may get '
                                        + 'suggestions for installing further mods, required or recommended by it.'
                                        + 'This information could be wrong or incomplete so please carefully '
                                        + 'consider before accepting them.') })] }), _jsxs(Toggle, { checked: mergeEnabled, onToggle: setMergeConfigSetting, children: [t('Manage SDV mod configuration files'), _jsx(More, { id: 'sdv_mod_configuration', name: 'SDV Mod Configuration', children: t('Vortex by default is configured to attempt to pull-in newly created files (mod configuration json files for example) '
                                        + 'created externally (by the game itself or tools) into their respective mod folders.\n\n'
                                        + 'Unfortunately the configuration files are lost during mod updates when using this method.\n\n'
                                        + 'Toggling this functionality creates a separate mod configuration "override" folder where all of your mod configuration files '
                                        + 'will be stored. This allows you to manage your mod configuration files on their own, regardless of mod updates. ') })] })] }) }) }) }));
}
function mapStateToProps(state) {
    const profileId = selectors.lastActiveProfileForGame(state, GAME_ID);
    return {
        profileId,
    };
}
export default Settings;
//# sourceMappingURL=Settings.js.map