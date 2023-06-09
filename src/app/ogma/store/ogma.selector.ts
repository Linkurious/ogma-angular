import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { AppState } from "./ogma.reducer";
import { EdgeId, NodeId } from "@linkurious/ogma/dev";


export const getNodesState: MemoizedSelector<AppState, AppState> = createFeatureSelector('nodeIds');
export const getEdgesState: MemoizedSelector<AppState, AppState> = createFeatureSelector('edgeIds');

export const getNodesSelector: MemoizedSelector<AppState, NodeId[]> = createSelector(
    getNodesState,
    (state): NodeId[] => {
        return state.nodeIds;
    }
);
export const getEdgesSelector: MemoizedSelector<AppState, EdgeId[]> = createSelector(
    getEdgesState,
    (state): EdgeId[] => {
        return state.edgeIds;
    }
);