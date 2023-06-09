import { createReducer, on } from '@ngrx/store';
import { addNodes, removeNodes, addEdges, removeEdges, setView, addNodeFilter, updateNodeFilter, removeNodeFilter } from './ogma.actions';
import { EdgeId, NodeId, View } from '@linkurious/ogma';
import { FilterState } from '../service/transformation.service';

export interface AppState {
    nodeIds: NodeId[];
    edgeIds: EdgeId[];
    view: View;
    transformations: FilterState[];
}
export const initialState: AppState = {
    nodeIds: [],
    edgeIds: [],
    view: { x: 0, y: 0, zoom: 1 },
    transformations: []
};

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


export const viewReducer = createReducer(
    initialState,
    on(setView, (state, { x, y, zoom }) => {
        return {
            ...state,
            view: { x, y, zoom }
        }
    }),
);


export const transformationsReducer = createReducer(
    initialState,
    on(addNodeFilter, (state, {options}) => {
        return {
            ...state,
            transformations: state.transformations.concat(options)
        }
    }),
    on(removeNodeFilter, (state, {id}) => {
        return {
            ...state,
            transformations: state.transformations.filter(o => o.id !== id)
        }
    }),
    on(updateNodeFilter, (state, {options}) => {
        return {
            ...state,
            transformations: state.transformations.filter(o => o.id !== options.id)
                .concat(options)
        }
    }),
);