import { EdgeId, NodeId } from '@linkurious/ogma';
import { createAction, props } from '@ngrx/store';

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
