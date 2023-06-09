import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { AppState } from "./ogma.reducer";
import { EdgeId, NodeId, View } from "@linkurious/ogma/dev";
import { FilterState } from "../service/transformation.service";


export const getNodesState: MemoizedSelector<AppState, AppState> = createFeatureSelector('nodeIds');
export const getEdgesState: MemoizedSelector<AppState, AppState> = createFeatureSelector('edgeIds');
export const getViewState: MemoizedSelector<AppState, AppState> = createFeatureSelector('view');
export const selectTransformations = (state: AppState) => state.transformations;

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
export const getViewSelector: MemoizedSelector<AppState, View> = createSelector(
    getViewState,
    (state): View => {
        return state.view;
    }
);
export const getTransformationById = (id: number) => createSelector(
    selectTransformations,
    (transformations) => transformations.find(t => t.id === id)
);
