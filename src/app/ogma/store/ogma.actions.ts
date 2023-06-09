import { EdgeId, NodeId } from '@linkurious/ogma';
import { createAction, props } from '@ngrx/store';
import { FilterState } from '../service/transformation.service';

export const addNodes = createAction('[Ogma Component] AddNodes',
props<{ ids: NodeId[]; }>()
);
export const removeNodes = createAction('[Ogma Component] RemoveNodes',
props<{ ids: NodeId[]; }>()
);
export const addEdges = createAction('[Ogma Component] AddEdges',
props<{ ids: EdgeId[]; }>()
);
export const removeEdges = createAction('[Ogma Component] RemoveEdges',
props<{ ids: EdgeId[]; }>()
);
export const setView = createAction('[Ogma Component] SetView',
props<{ x: number; y: number; zoom: number }>()
);
export const addNodeFilter = createAction('[Ogma Component] AddNodeFilter',
props<{ options: FilterState }>()
);
export const removeNodeFilter = createAction('[Ogma Component] AddNodeFilter',
props<{ id: number }>()
);
export const updateNodeFilter = createAction('[Ogma Component] AddNodeFilter',
props<{ options: FilterState }>()
);
