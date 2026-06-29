import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable */
import * as React from 'react';
import { types, tooltip } from 'vortex-api';
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import * as Redux from 'redux';
import { forceRefresh } from './util';
import { ThunkDispatch } from 'redux-thunk';
import { setPlayerProfile } from './actions';
import { GAME_ID } from './common';
export function InfoPanelWrap(props) {
    const { api, getOwnGameVersion, readStoredLO, installLSLib, getLatestLSLibMod } = props;
    const currentProfile = useSelector((state) => state.settings['baldursgate3']?.playerProfile);
    const [gameVersion, setGameVersion] = React.useState();
    React.useEffect(() => {
        (async () => {
            if (!gameVersion) {
                setGameVersion(await getOwnGameVersion(api.getState()));
            }
        })();
    }, [gameVersion, setGameVersion]);
    const onSetProfile = React.useCallback((profileName) => {
        const impl = async () => {
            api.store.dispatch(setPlayerProfile(profileName));
            try {
                await readStoredLO(api);
            }
            catch (err) {
                api.showErrorNotification('Failed to read load order', err, {
                    message: 'Please run the game before you start modding',
                    allowReport: false,
                });
            }
            forceRefresh(api);
        };
        impl();
    }, [api]);
    const isLsLibInstalled = React.useCallback(() => {
        return getLatestLSLibMod(api) !== undefined;
    }, [api]);
    const onInstallLSLib = React.useCallback(() => {
        installLSLib(api, GAME_ID);
    }, [api]);
    if (!gameVersion) {
        return null;
    }
    return (_jsx(InfoPanel, { t: api.translate, gameVersion: gameVersion, currentProfile: currentProfile, onSetPlayerProfile: onSetProfile, isLsLibInstalled: isLsLibInstalled, onInstallLSLib: onInstallLSLib }));
}
function InfoPanel(props) {
    const { t, onInstallLSLib, isLsLibInstalled } = props;
    return isLsLibInstalled() ? (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginRight: '16px' }, children: [_jsx(Alert, { bsStyle: 'warning', style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: _jsxs("div", { children: [t('To successfully switch between different game versions/patches please follow these steps:'), _jsxs("ul", { children: [_jsx("li", { children: t('Purge your mods') }), _jsx("li", { children: t('Run the game so that the modsettings.lsx file gets reset to the default values') }), _jsx("li", { children: t('Close the game') }), _jsx("li", { children: t('Deploy your mods') }), _jsx("li", { children: t('Run the game again - your load order will be maintained') })] })] }) }), _jsx("div", { children: t(`A backup is made of the game's modsettings.lsx file before anything is changed.
        This can be found at %APPDATA%\\Local\\Larian Studios\\Baldur's Gate 3\\PlayerProfiles\\Public\\modsettings.lsx.backup`) }), _jsx("div", { children: t(`Drag and Drop PAK files to reorder how the game loads them. Please note, some mods contain multiple PAK files.`) }), _jsx("div", { children: t(`Mod descriptions from mod authors may have information to determine the best order.`) }), _jsx("div", { children: t(`Some mods may be locked in this list because they are loaded differently by the game and can therefore not be load-ordered by mod managers. 
        If you need to disable such a mod, please do so in Vortex\'s Mods page.`) }), _jsx("h4", { style: { margin: 0 }, children: t('Import and Export') }), _jsx("div", { children: t(`Import is an experimental tool to help migration from a game load order (.lsx file) to Vortex. It works by importing the game's modsettings file
        and attempts to match up mods that have been installed by Vortex.`) }), _jsx("div", { children: t(`Export can be used to manually update the game's modsettings.lsx file if 'Settings > Mods > Auto export load order' isn't set to do this automatically. 
        It can also be used to export to a different file as a backup.`) }), _jsx("h4", { style: { margin: 0 }, children: t('Import from Baldur\'s Gate 3 Mod Manager') }), _jsx("div", { children: t('Vortex can sort your load order based on a BG3MM .json load order file. Any mods that are not installed through Vortex will be ignored.') }), _jsx("div", { children: t('Please note that any mods that are not present in the BG3MM load order file will be placed at the bottom of the load order.') })] })) : (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: [_jsx("h4", { style: { margin: 0 }, children: t('LSLib is not installed') }), _jsx("div", { children: t('To take full advantage of Vortex\'s Baldur\s Gate 3 modding capabilities such as managing the '
                    + 'order in which mods are loaded into the game; Vortex requires a 3rd party tool called LSLib.') }), _jsx("div", { children: t('Please install the library using the buttons below to manage your load order.') }), _jsx(tooltip.Button, { tooltip: 'Install LSLib', onClick: onInstallLSLib, children: t('Install LSLib') })] }));
}
// function mapStateToProps(state: any): IConnectedProps {
//   return {
//     currentTheme: state.settings.interface.currentTheme,
//   };
// }
function mapDispatchToProps(dispatch) {
    return {
        onSetProfile: (profile) => dispatch(setPlayerProfile(profile)),
    };
}
//# sourceMappingURL=InfoPanel.js.map