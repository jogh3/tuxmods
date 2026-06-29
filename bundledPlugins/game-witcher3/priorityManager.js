/* eslint-disable */
import { selectors, types } from 'vortex-api';
import { GAME_ID } from './common';
import { getPersistentLoadOrder } from './migrations';
export class PriorityManager {
    mApi;
    mPriorityType;
    mMaxPriority;
    constructor(api, priorityType) {
        this.mApi = api;
        this.mPriorityType = priorityType;
        this.resetMaxPriority();
    }
    set priorityType(type) {
        this.mPriorityType = type;
    }
    get priorityType() {
        return this.mPriorityType;
    }
    resetMaxPriority = (min) => {
        const props = this.genProps(min);
        if (props === undefined) {
            this.mMaxPriority = 0;
            return;
        }
        this.mMaxPriority = this.getMaxPriority(props);
    };
    getPriority = (loadOrder, item) => {
        if (item === undefined) {
            // Send it off to the end.
            return ++this.mMaxPriority;
        }
        const minPriority = Object.keys(loadOrder).filter(key => loadOrder[key]?.locked).length + 1;
        const itemIdx = loadOrder.findIndex(x => x?.id === item.id);
        if (itemIdx !== -1) {
            if (this.mPriorityType === 'position-based') {
                const position = itemIdx + 1;
                return (position > minPriority)
                    ? position : ++this.mMaxPriority;
            }
            else {
                const prefixVal = loadOrder[itemIdx]?.data?.prefix ?? loadOrder[itemIdx]?.['prefix'];
                const intVal = prefixVal !== undefined
                    ? parseInt(prefixVal, 10)
                    : itemIdx;
                const posVal = itemIdx;
                if (posVal !== intVal && intVal > minPriority) {
                    return intVal;
                }
                else {
                    return (posVal > minPriority)
                        ? posVal : ++this.mMaxPriority;
                }
            }
        }
        return ++this.mMaxPriority;
    };
    genProps = (min) => {
        const state = this.mApi.getState();
        const lastProfId = selectors.lastActiveProfileForGame(state, GAME_ID);
        if (lastProfId === undefined) {
            return undefined;
        }
        const profile = selectors.profileById(state, lastProfId);
        if (profile === undefined) {
            return undefined;
        }
        const loadOrder = getPersistentLoadOrder(this.mApi);
        const lockedEntries = Object.keys(loadOrder).filter(key => loadOrder[key]?.locked);
        const minPriority = (min) ? min : lockedEntries.length;
        return { state, profile, loadOrder, minPriority };
    };
    getMaxPriority = (props) => {
        const { loadOrder, minPriority } = props;
        return Object.keys(loadOrder).reduce((prev, key) => {
            const prefixVal = loadOrder[key]?.data?.prefix ?? loadOrder[key]?.prefix;
            const intVal = prefixVal !== undefined
                ? parseInt(loadOrder[key].prefix, 10)
                : loadOrder[key].pos;
            const posVal = loadOrder[key].pos;
            if (posVal !== intVal) {
                prev = (intVal > prev)
                    ? intVal : prev;
            }
            else {
                prev = (posVal > prev)
                    ? posVal : prev;
            }
            return prev;
        }, minPriority);
    };
}
//# sourceMappingURL=priorityManager.js.map