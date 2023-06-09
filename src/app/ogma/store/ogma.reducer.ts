import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset, addNodes, removeNodes, addEdges, removeEdges } from './ogma.actions';
import { EdgeId, NodeId } from '@linkurious/ogma/dev';

export interface AppState {
    addedNodes: number;
    nodeIds: NodeId[];
    edgeIds: EdgeId[];

}
export const initialState: AppState = {
    addedNodes: 0,
    nodeIds: [],
    edgeIds: [],
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
    on(addNodes, (state, { ids }) => {
        const nodeIds = state.nodeIds.concat(ids);
        return {
            ...state,
            nodeIds
        }
    }),
    on(removeNodes, (state, { ids }) => {
        const idsSet = ids.reduce((acc, id) => acc.add(id), new Set<NodeId>());
        const nodeIds = state.nodeIds.filter(id => !idsSet.has(id));
        return {
            ...state,
            nodeIds
        }
    }),
);

export const edgeIdsReducer = createReducer(
    initialState,
    on(addEdges, (state, { ids }) => {
        const edgeIds = state.edgeIds.concat(ids);
        return {
            ...state,
            edgeIds
        }
    }),
    on(removeEdges, (state, { ids }) => {
        const idsSet = ids.reduce((acc, id) => acc.add(id), new Set<NodeId>());
        const edgeIds = state.edgeIds.filter(id => !idsSet.has(id));
        return {
            ...state,
            edgeIds
        }
    }),
);