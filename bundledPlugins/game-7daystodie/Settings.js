import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import path from 'path';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, ControlLabel, InputGroup, FormControl, HelpBlock, Panel, Label } from 'react-bootstrap';
import { Icon, More, util } from 'vortex-api';
import { GAME_ID, I18N_NAMESPACE } from './common';
export default function Settings(props) {
    const { t } = useTranslation(I18N_NAMESPACE);
    const { onSelectUDF } = props;
    const connectedProps = useSelector(mapStateToProps);
    const [currentUDF, setUDF] = React.useState(path.join(connectedProps.udf, 'Mods'));
    const onSelectUDFHandler = React.useCallback(() => {
        onSelectUDF().then((res) => {
            if (res) {
                setUDF(path.join(res, 'Mods'));
            }
        });
    }, [onSelectUDF]);
    return (_jsx("form", { id: `${GAME_ID}-settings-form`, children: _jsxs(FormGroup, { controlId: 'default-enable', children: [_jsx(ControlLabel, { className: `${GAME_ID}-settings-heading`, children: t('7DTD Settings') }), _jsx(Panel, { children: _jsxs(Panel.Body, { children: [_jsxs(ControlLabel, { className: `${GAME_ID}-settings-subheading`, children: [t('Current User Default Folder'), _jsx(More, { id: 'more-udf', name: t('Set User Data Folder'), children: t('This will allow you to re-select the User Data Folder (UDF) for 7 Days to Die.') })] }), _jsxs(InputGroup, { children: [_jsx(FormControl, { className: 'install-path-input', disabled: true, value: currentUDF }), _jsx(Button, { onClick: onSelectUDFHandler, children: _jsx(Icon, { name: 'browse' }) })] })] }) }, `${GAME_ID}-user-default-folder`)] }) }));
}
function mapStateToProps(state) {
    return {
        udf: util.getSafe(state, ['settings', '7daystodie', 'udf'], ''),
    };
}
//# sourceMappingURL=Settings.js.map