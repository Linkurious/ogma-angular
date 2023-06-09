import { Injectable } from '@angular/core';
import Ogma, {
  NodeId,
  RawEdge,
  RawGraph,
  RawNode,
  NodeStyleRuleDefinition,
  EdgeList,
  NodeList,
} from '@linkurious/ogma';
import { AppState } from '../store/ogma.reducer';
import { Store } from '@ngrx/store';
import { addEdges, addNodes, removeEdges, removeNodes, setView } from '../store/ogma.actions';

export const createNode = (id: number): RawNode => ({
  id,
  attributes: {
    color: id % 2 ? 'purple' : 'orange',
  },
});

export const createEdge = (source: NodeId, target: NodeId): RawEdge => ({
  source,
  target,
});

@Injectable({
  providedIn: 'root',
})
export class OgmaService {
  // expose an instance of Ogma from the service
  public ogma!: Ogma;
  constructor(private _store: Store<AppState>) { }

  public initConfig(configuration = {}) {
    this.ogma = new Ogma(configuration);

    this.ogma.events.on('addNodes', ({ nodes }) => {
      this._store.dispatch(addNodes({ ids: nodes.getId() }));
    });

    this.ogma.events.on('removeNodes', ({ nodes }) => {
      this._store.dispatch(removeNodes({ ids: nodes.getId() }));
    });

    this.ogma.events.on('addEdges', ({ edges }) => {
      this._store.dispatch(addEdges({ ids: edges.getId() }));
    });

    this.ogma.events.on('removeEdges', ({ edges }) => {
      this._store.dispatch(removeEdges({ ids: edges.getId() }));
    });

    this.ogma.events.on('viewChanged', (evt) => {
      const { x, y, zoom } = this.ogma.view.get();
      this._store.dispatch(setView({ x, y, zoom }));
    });
  }

  public runLayout() {
    return this.ogma.layouts.force({ locate: true });
  }

  public async addData(data: RawGraph) {
    await this.ogma.addGraph(data);
  }

  public async removeData(data: { nodes?: NodeList, edges?: EdgeList }) {
    if (data.nodes) {
      await this.ogma.removeNodes(data.nodes);
    }
    if (data.edges) {
      await this.ogma.removeEdges(data.edges);
    }
  }

  public getNodes() {
    return this.ogma.getNodes();
  }
  public getEdges() {
    return this.ogma.getEdges();
  }


  public applyStyles(styles: NodeStyleRuleDefinition<unknown, unknown>) {
    return this.ogma.styles.addRule(styles);
  }
}
