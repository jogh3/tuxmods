import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ControlLabel, FormGroup, HelpBlock, Panel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { Toggle, types } from 'vortex-api';
import { setAutoExportLoadOrder } from './actions';
function Settings() {
    const store = useStore();
    const autoExportLoadOrder = useSelector((state) => state.settings['baldursgate3']?.autoExportLoadOrder);
    const setUseAutoExportLoadOrderToGame = React.useCallback((enabled) => {
        console.log(`setAutoExportLoadOrder=${enabled}`);
        store.dispatch(setAutoExportLoadOrder(enabled));
    }, []);
    const { t } = useTranslation();
    return (_jsx("form", { children: _jsx(FormGroup, { controlId: 'default-enable', children: _jsx(Panel, { children: _jsxs(Panel.Body, { children: [_jsx(ControlLabel, { children: t('Baldur\'s Gate 3') }), _jsx(Toggle, { checked: autoExportLoadOrder, onToggle: setUseAutoExportLoadOrderToGame, children: t('Auto export load order') }), _jsx(HelpBlock, { children: t(`If enabled, when Vortex saves it's load order, it will also update the games load order. 
              If disabled, and you wish the game to use your load order, then this will need to be completed 
              manually using the Export to Game button on the load order screen`) })] }) }) }) }));
}
export default Settings;
//# sourceMappingURL=Settings.js.map