import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { AppState } from "./ogma.reducer";
import { NodeId } from "@linkurious/ogma/dev";


export const getCounterState: MemoizedSelector<AppState, AppState> = createFeatureSelector('counter');
export const getNodesState: MemoizedSelector<AppState, AppState> = createFeatureSelector('nodeIds');

export const getCounterSelector: MemoizedSelector<AppState, number> = createSelector(
    getCounterState,
    (state): number => {
        return state.addedNodes
    }
);
export const getNodesSelector: MemoizedSelector<AppState, NodeId[]> = createSelector(
    getNodesState,
    (state): NodeId[] => {
        return state.nodeIds;
    }
);