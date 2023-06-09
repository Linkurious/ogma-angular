import {createFeatureSelector, createSelector, MemoizedSelector} from "@ngrx/store";
import {AppState} from "./ogma.reducer";


export const getCounterState: MemoizedSelector<AppState, AppState> = createFeatureSelector('counter');


export const getCounterSelector: MemoizedSelector<AppState, number> = createSelector(
    getCounterState,
    (state): number => state.addedNodes
);