import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Checkbox, ListGroupItem } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions, Icon, LoadOrderIndexInput, tooltip, selectors, types, util, MainContext } from 'vortex-api';
import { I18N_NAMESPACE, GAME_ID } from '../common';
import { IItemRendererProps } from '../types';
export function ItemRenderer(props) {
    if (props?.item?.loEntry === undefined) {
        return null;
    }
    const stateProps = useSelector(mapStateToProps);
    const dispatch = useDispatch();
    const onSetLoadOrder = React.useCallback((profileId, loadOrder) => {
        dispatch(actions.setFBLoadOrder(profileId, loadOrder));
    }, [dispatch, stateProps.profile.id, stateProps.loadOrder]);
    return renderDraggable({ ...props, ...stateProps, onSetLoadOrder });
}
function renderValidationError(props) {
    const { invalidEntries, loEntry } = props.item;
    const invalidEntry = (invalidEntries !== undefined)
        ? invalidEntries.find(inv => inv.id.toLowerCase() === loEntry.id.toLowerCase())
        : undefined;
    return (invalidEntry !== undefined)
        ? (_jsx(tooltip.Icon, { className: 'fblo-invalid-entry', name: 'feedback-error', tooltip: invalidEntry.reason })) : null;
}
function renderViewModIcon(props) {
    const { item, mods } = props;
    if (isExternal(item.loEntry) || item.loEntry.modId === item.loEntry.name) {
        return null;
    }
    const context = React.useContext(MainContext);
    const [t] = useTranslation(I18N_NAMESPACE);
    const onClick = React.useCallback(() => {
        const { modId } = item.loEntry;
        const mod = mods?.[modId];
        if (mod === undefined) {
            return;
        }
        const batched = [
            actions.setAttributeFilter('mods', 'name', util.renderModName(mod)),
        ];
        util.batchDispatch(context.api.store.dispatch, batched);
        context.api.events.emit('show-main-page', 'Mods');
    }, [item, mods, context]);
    return item.loEntry.modId !== undefined ? (_jsx(tooltip.IconButton, { className: 'witcher3-view-mod-icon', icon: 'open-ext', tooltip: t('View source Mod'), onClick: onClick })) : null;
}
function renderExternalBanner(item) {
    const [t] = useTranslation(I18N_NAMESPACE);
    return isExternal(item) ? (_jsxs("div", { className: 'load-order-unmanaged-banner', children: [_jsx(Icon, { className: 'external-caution-logo', name: 'feedback-warning' }), _jsx("span", { className: 'external-text-area', children: t('Not managed by Vortex') })] })) : null;
}
function renderDraggable(props) {
    const { loadOrder, className, item, profile } = props;
    const key = !!item?.loEntry?.name ? `${item.loEntry.name}` : `${item.loEntry.id}`;
    const context = React.useContext(MainContext);
    const dispatch = useDispatch();
    const position = loadOrder.findIndex(entry => entry.id === item.loEntry.id) + 1;
    let classes = ['load-order-entry'];
    if (className !== undefined) {
        classes = classes.concat(className.split(' '));
    }
    if (isExternal(item.loEntry)) {
        classes = classes.concat('external');
    }
    const onStatusChange = React.useCallback((evt) => {
        const entry = {
            ...item.loEntry,
            enabled: evt.target.checked,
        };
        dispatch(actions.setFBLoadOrderEntry(profile.id, entry));
    }, [dispatch, profile, item]);
    const onApplyIndex = React.useCallback((idx) => {
        const { item, onSetLoadOrder, profile, loadOrder } = props;
        const currentIdx = currentPosition(props);
        if (currentIdx === idx) {
            return;
        }
        const entry = {
            ...item.loEntry,
            index: idx,
        };
        const newLO = loadOrder.filter((entry) => entry.id !== item.loEntry.id);
        newLO.splice(idx - 1, 0, entry);
        onSetLoadOrder(profile.id, newLO);
    }, [dispatch, profile, item]);
    const checkBox = () => (item.displayCheckboxes)
        ? (_jsx(Checkbox, { className: 'entry-checkbox', checked: item.loEntry.enabled, disabled: isLocked(item.loEntry), onChange: onStatusChange }))
        : null;
    const lock = () => (isLocked(item.loEntry))
        ? (_jsx(Icon, { className: 'locked-entry-logo', name: 'locked' })) : null;
    return (_jsxs(ListGroupItem, { className: classes.join(' '), ref: props.item.setRef, children: [_jsx(Icon, { className: 'drag-handle-icon', name: 'drag-handle' }), _jsx(LoadOrderIndexInput, { className: 'load-order-index', api: context.api, item: item.loEntry, currentPosition: currentPosition(props), lockedEntriesCount: lockedEntriesCount(props), loadOrder: loadOrder, isLocked: isLocked, onApplyIndex: onApplyIndex }), renderValidationError(props), _jsx("p", { className: 'load-order-name', children: key }), renderExternalBanner(item.loEntry), renderViewModIcon(props), checkBox(), lock()] }, key));
}
function isLocked(item) {
    return [true, 'true', 'always'].includes(item.locked);
}
function isExternal(item) {
    return (item.modId !== undefined) ? false : true;
}
const currentPosition = (props) => {
    const { item, loadOrder } = props;
    return loadOrder.findIndex(entry => entry.id === item.loEntry.id) + 1;
};
const lockedEntriesCount = (props) => {
    const { loadOrder } = props;
    const locked = loadOrder.filter(item => isLocked(item));
    return locked.length;
};
const empty = {};
function mapStateToProps(state) {
    const profile = selectors.activeProfile(state);
    return {
        profile,
        loadOrder: util.getSafe(state, ['persistent', 'loadOrder', profile.id], []),
        modState: util.getSafe(profile, ['modState'], empty),
        mods: util.getSafe(state, ['persistent', 'mods', GAME_ID], {}),
    };
}
export default ItemRenderer;
//# sourceMappingURL=ItemRenderer.js.map