import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ComponentEx, EmptyPlaceholder, FlexLayout, Icon, selectors, types, util } from 'vortex-api';
import { IExtendedInterfaceProps, ILoadOrderEntry } from '../types/types';
import { NATIVE_PLUGINS } from '../constants';
import { deserializeLoadOrder } from '../loadorder';
const NAMESPACE = 'game-morrowind';
class MorrowindCollectionsDataView extends ComponentEx {
    constructor(props) {
        super(props);
        this.initState({
            sortedMods: [],
        });
    }
    componentDidMount() {
        this.updateSortedMods();
    }
    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.state.sortedMods) !== JSON.stringify(this.props.loadOrder)) {
            this.updateSortedMods();
        }
    }
    render() {
        const { t } = this.props;
        const { sortedMods } = this.state;
        return (!!sortedMods && Object.keys(sortedMods).length !== 0)
            ? (_jsxs("div", { style: { overflow: 'auto' }, children: [_jsx("h4", { children: t('Load Order') }), _jsx("p", { children: t('This is a snapshot of the load order information that '
                            + 'will be exported with this collection.') }), this.renderLoadOrderEditInfo(), _jsx(ListGroup, { id: 'collections-load-order-list', children: sortedMods.map((entry, idx) => this.renderModEntry(entry, idx)) })] })) : this.renderPlaceholder();
    }
    updateSortedMods() {
        const includedModIds = (this.props.collection?.rules || []).map(rule => rule.reference.id);
        const mods = Object.keys(this.props.mods).reduce((accum, iter) => {
            if (includedModIds.includes(iter)) {
                accum[iter] = this.props.mods[iter];
            }
            return accum;
        }, {});
        deserializeLoadOrder(this.props.api, mods)
            .then(lo => {
            const filtered = lo.filter(entry => (NATIVE_PLUGINS.includes(entry.id) || entry.modId !== undefined));
            this.nextState.sortedMods = filtered;
        });
    }
    renderLoadOrderEditInfo = () => {
        const { t } = this.props;
        return (_jsxs(FlexLayout, { type: 'row', id: 'collection-edit-loadorder-edit-info-container', children: [_jsx(FlexLayout.Fixed, { className: 'loadorder-edit-info-icon', children: _jsx(Icon, { name: 'dialog-info' }) }), _jsxs(FlexLayout.Fixed, { className: 'collection-edit-loadorder-edit-info', children: [t('You can make changes to this data from the '), _jsx("a", { className: 'fake-link', onClick: this.openLoadOrderPage, title: t('Go to Load Order Page'), children: t('Load Order page.') }), t(' If you believe a load order entry is missing, please ensure the '
                            + 'relevant mod is enabled and has been added to the collection.')] })] }));
    };
    openLoadOrderPage = () => {
        this.props.api.events.emit('show-main-page', 'file-based-loadorder');
    };
    renderOpenLOButton = () => {
        const { t } = this.props;
        return (_jsx(Button, { id: 'btn-more-mods', className: 'collection-add-mods-btn', onClick: this.openLoadOrderPage, bsStyle: 'ghost', children: t('Open Load Order Page') }));
    };
    renderPlaceholder = () => {
        const { t } = this.props;
        return (_jsx(EmptyPlaceholder, { icon: 'sort-none', text: t('You have no load order entries (for the current mods in the collection)'), subtext: this.renderOpenLOButton() }));
    };
    renderModEntry = (loEntry, idx) => {
        const key = loEntry.id + JSON.stringify(loEntry);
        const classes = ['load-order-entry', 'collection-tab'];
        return (_jsx(ListGroupItem, { className: classes.join(' '), children: _jsxs(FlexLayout, { type: 'row', children: [_jsx("p", { className: 'load-order-index', children: idx }), _jsx("p", { children: loEntry.name })] }) }, key));
    };
}
const empty = [];
function mapStateToProps(state, ownProps) {
    const profile = selectors.activeProfile(state) || undefined;
    let loadOrder = [];
    if (!!profile?.gameId) {
        loadOrder = util.getSafe(state, ['persistent', 'loadOrder', profile.id], empty);
    }
    return {
        gameId: profile?.gameId,
        loadOrder,
        mods: util.getSafe(state, ['persistent', 'mods', profile.gameId], {}),
        profile,
    };
}
function mapDispatchToProps(dispatch) {
    return {};
}
export default withTranslation(['common', NAMESPACE])(connect(mapStateToProps, mapDispatchToProps)(MorrowindCollectionsDataView));
//# sourceMappingURL=MorrowindCollectionsDataView.js.map