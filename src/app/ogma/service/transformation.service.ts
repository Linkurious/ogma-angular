import { Injectable } from '@angular/core';
import Ogma, {
  Node,
  NodeFilterOptions,
  Transformation,
} from '@linkurious/ogma';
import { AppState } from '../store/ogma.reducer';
import { Store } from '@ngrx/store';
import { addNodeFilter, removeNodeFilter, updateNodeFilter } from '../store/ogma.actions';

export type Operator = 'equal' | 'notEqual' | 'greaterThan' | 'lessThan';
export interface FilterState {
  criteria: { key: string, value: string, operator: Operator };
  enabled: boolean;
  duration: number;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransformationService {
  public ogma: Ogma;
  constructor(private _store: Store<AppState>) {
    this.ogma = new Ogma();
  }

  public initConfig(ogma: Ogma) {
    this.ogma = ogma;
  }

  public createNodeFilter(opts: Omit<FilterState, 'id'>) {
    const transformation = this.ogma.transformations.addNodeFilter({
      criteria: (node: Node) => true,
    });
    const options = {
      ...opts,
      id: transformation.getId()
    }
    this._store.dispatch(addNodeFilter({ options }));
    this.updateNodeFilter(options);
    return options.id;
  }

  public removeNodeFilter(id: number) {
    const transformation = this.ogma.transformations.getById(id) as Transformation<NodeFilterOptions<any, any>, any, any>;
    if (!transformation) return;
    transformation.destroy();
    this._store.dispatch(removeNodeFilter({ id }));
  }

  public disableNodeFilter(id: number) {
    this._store.dispatch(removeNodeFilter({ id }));
    this.ogma.transformations.getById(id)?.destroy();
  }

  public updateNodeFilter(options: FilterState) {
    const { key, value, operator } = options.criteria;
    let criteria = (node: Node) => true;
    if (operator === 'equal') {
      criteria = (node: Node) => node.getData(key) === value;
    } else if (operator === 'notEqual') {
      criteria = (node: Node) => node.getData(key) !== value;
    } else if (operator === 'greaterThan') {
      criteria = (node: Node) => node.getData(key) > value;
    } else if (operator === 'lessThan') {
      criteria = (node: Node) => node.getData(key) < value;
    }
    const transformation = this.ogma.transformations.getById(options.id) as Transformation<NodeFilterOptions<any, any>, any, any>;
    if (!transformation) return options;
    this._store.dispatch(updateNodeFilter({ options }));
    return transformation.setOptions({
      criteria,
      enabled: options.enabled,
      duration: options.duration,
    });
  }
}
