import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset } from './ogma.actions';

export interface AppState {
    addedNodes: number;
}
export const initialState: AppState = {
    addedNodes: 0
};

export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => {
      return {
          addedNodes: state.addedNodes + 1
      }
  }),
  on(decrement, (state) => {
      return {
          addedNodes: state.addedNodes -1
      }
  }),
  on(reset, (state) => {
      return {
          addedNodes: 0
      }
  })
);