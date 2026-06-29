import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _ from 'lodash';
import * as React from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { genCollectionLoadOrder, getModId } from './util';
import { ComponentEx, EmptyPlaceholder, FlexLayout, selectors, types, Usage, util } from 'vortex-api';
const NAMESPACE = 'generic-load-order-extension';
class CollectionsDataView extends ComponentEx {
    static getDerivedStateFromProps(newProps, state) {
        const { loadOrder, mods, collection } = newProps;
        const sortedMods = genCollectionLoadOrder(loadOrder, mods, collection);
        return (sortedMods !== state.sortedMods) ? { sortedMods } : null;
    }
    constructor(props) {
        super(props);
        const { loadOrder, mods, collection } = props;
        this.initState({
            sortedMods: genCollectionLoadOrder(loadOrder, mods, collection) || [],
        });
    }
    componentDidMount() {
        const { loadOrder, mods, collection } = this.props;
        this.nextState.sortedMods = genCollectionLoadOrder(loadOrder, mods, collection);
    }
    render() {
        const { t } = this.props;
        const { sortedMods } = this.state;
        return (!!sortedMods && Object.keys(sortedMods).length !== 0)
            ? (_jsxs("div", { style: { overflow: 'auto' }, children: [_jsx("h4", { children: t('Load Order') }), _jsx("p", { children: t('Below is a preview of the load order for the mods that ' +
                            'are included in the current collection. If you wish to modify the load ' +
                            'please do so by opening the Load Order page; any changes made there ' +
                            'will be reflected in this collection.') }), _jsx(ListGroup, { id: 'collections-load-order-list', children: sortedMods.map(this.renderModEntry) })] })) : this.renderPlaceholder();
    }
    openLoadOrderPage = () => {
        this.context.api.events.emit('show-main-page', 'generic-loadorder');
    };
    renderOpenLOButton = () => {
        const { t } = this.props;
        return (_jsx(Button, { id: 'btn-more-mods', className: 'collection-add-mods-btn', onClick: this.openLoadOrderPage, bsStyle: 'ghost', children: t('Open Load Order Page') }));
    };
    renderPlaceholder = () => {
        const { t } = this.props;
        return (_jsx(EmptyPlaceholder, { icon: 'sort-none', text: t('You have no load order entries (for the current mods in the collection)'), subtext: this.renderOpenLOButton() }));
    };
    renderModEntry = (loId) => {
        const { mods } = this.props;
        const { sortedMods } = this.state;
        const loEntry = this.state.sortedMods[loId];
        const idx = this.state.sortedMods.indexOf(loId);
        const key = `${idx}-${loId}`;
        const modId = getModId(mods, loId);
        const name = util.renderModName(this.props.mods[modId]) || modId;
        const classes = ['load-order-entry', 'collection-tab'];
        return (_jsx(ListGroupItem, { className: classes.join(' '), children: _jsxs(FlexLayout, { type: 'row', children: [_jsx("p", { className: 'load-order-index', children: idx }), _jsx("p", { children: name })] }) }, key));
    };
}
function mapStateToProps(state, ownProps) {
    const profile = selectors.activeProfile(state) || undefined;
    let loadOrder = [];
    if (!!profile?.gameId) {
        loadOrder = util.getSafe(state, ['persistent', 'loadOrder', profile.id], []);
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
export default withTranslation(['common', NAMESPACE])(connect(mapStateToProps, mapDispatchToProps)(CollectionsDataView));
//# sourceMappingURL=CollectionsDataView.js.map