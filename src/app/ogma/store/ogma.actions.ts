import { NodeId } from '@linkurious/ogma';
import { createAction, props } from '@ngrx/store';

export const increment = createAction('[Ogma Component] Increment');
export const decrement = createAction('[Ogma Component] Decrement');
export const reset = createAction('[Ogma Component] Reset');
export const addNodes = createAction('[Ogma Component] AddNodes',
props<{ ids: NodeId[]; }>()
);
export const removeNodes = createAction('[Ogma Component] RemoveNodes',
props<{ ids: NodeId[]; }>()
);
