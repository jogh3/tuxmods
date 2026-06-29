import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _ from 'lodash';
import * as React from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ComponentEx, EmptyPlaceholder, FlexLayout, Icon, selectors, types, util } from 'vortex-api';
import { IExtendedInterfaceProps, ILoadOrder, ILoadOrderEntry } from '../collections/types';
import { genCollectionLoadOrder } from '../collections/util';
import { IFBLOLoadOrderEntry } from 'vortex-api/lib/types/api';
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
        return (!!sortedMods && sortedMods.length !== 0)
            ? (_jsxs("div", { style: { overflow: 'auto' }, children: [_jsx("h4", { children: t('Witcher 3 Merged Data') }), _jsx("p", { children: t('The Witcher 3 game extension executes a series of file merges for UI/menu mods '
                            + 'whenever the mods are deployed - these will be included in the collection. '
                            + '(separate from the ones done using the script '
                            + 'merger utility) To ensure that Vortex includes the correct data when '
                            + 'uploading this collection, please make sure that the mods are enabled and '
                            + 'deployed before attempting to upload the collection.') }), _jsx("p", { children: t('Additionally - please remember that any script merges (if applicable) done '
                            + 'through the script merger utility, should be reviewed before uploading, to '
                            + 'only include merges that are necessary for the collection to function correctly. '
                            + 'Merged scripts referencing a mod that is not included in your collection will most '
                            + 'definitively cause the game to crash!') }), _jsx("h4", { children: t('Load Order') }), _jsx("p", { children: t('This is a snapshot of the load order information that '
                            + 'will be exported with this collection.') }), this.renderLoadOrderEditInfo(), _jsx(ListGroup, { id: 'collections-load-order-list', children: sortedMods.map(this.renderModEntry) })] })) : this.renderPlaceholder();
    }
    renderLoadOrderEditInfo = () => {
        const { t } = this.props;
        return (_jsxs(FlexLayout, { type: 'row', id: 'collection-edit-loadorder-edit-info-container', children: [_jsx(FlexLayout.Fixed, { className: 'loadorder-edit-info-icon', children: _jsx(Icon, { name: 'dialog-info' }) }), _jsxs(FlexLayout.Fixed, { className: 'collection-edit-loadorder-edit-info', children: [t('You can make changes to this data from the '), _jsx("a", { className: 'fake-link', onClick: this.openLoadOrderPage, title: t('Go to Load Order Page'), children: t('Load Order page.') }), t(' If you believe a load order entry is missing, please ensure the '
                            + 'relevant mod is enabled and has been added to the collection.')] })] }));
    };
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
    renderModEntry = (loEntry, index) => {
        const key = loEntry.modId + JSON.stringify(loEntry);
        const name = loEntry.modId
            ? `${util.renderModName(this.props.mods[loEntry.modId]) ?? loEntry.id} (${loEntry.name})`
            : loEntry.name ?? loEntry.id;
        const classes = ['load-order-entry', 'collection-tab'];
        return (_jsx(ListGroupItem, { className: classes.join(' '), children: _jsxs(FlexLayout, { type: 'row', children: [_jsx("p", { className: 'load-order-index', children: index + 1 }), _jsx("p", { children: name })] }) }, key));
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
export default withTranslation(['common', NAMESPACE])(connect(mapStateToProps)(CollectionsDataView));
//# sourceMappingURL=CollectionsDataView.js.map