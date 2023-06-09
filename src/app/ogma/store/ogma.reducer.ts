import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset, addNodes, removeNodes } from './ogma.actions';
import { NodeId } from '@linkurious/ogma/dev';

export interface AppState {
    addedNodes: number;
    nodeIds: NodeId[];
}
export const initialState: AppState = {
    addedNodes: 0,
    nodeIds: [],
};

export const counterReducer = createReducer(
    initialState,
    on(increment, (state) => {
        return {
            ...state,
            addedNodes: state.addedNodes + 1
        }
    }),
    on(decrement, (state) => {
        return {
            ...state,
            addedNodes: state.addedNodes - 1
        }
    }),
    on(reset, (state) => {
        return {
            ...state,
            addedNodes: 0
        }
    })
);

export const nodeIdsReducer = createReducer(
    initialState,
    on(addNodes, (state, {ids}) => {
        console.log('Add nodes')
        const nodeIds = state.nodeIds.concat(ids);
        return {
            ...state,
            nodeIds
        }
    }),
    on(removeNodes, (state) => {
        const nodeIds = state.nodeIds;
        return {
            ...state,
            nodeIds: nodeIds
        }
    }),
);