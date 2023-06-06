import { Injectable } from '@angular/core';
import Ogma, {
  NodeId,
  RawEdge,
  RawGraph,
  RawNode,
  NodeStyleRuleDefinition,
} from '@linkurious/ogma';

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

  public constructor() {
    console.log('ogma service constructor');
  }

  public initConfig(configuration = {}) {
    this.ogma = new Ogma(configuration);
  }

  public runLayout() {
    return this.ogma.layouts.force({ locate: true });
  }

  public async addData(data: RawGraph) {
    await this.ogma.addGraph(data);
  }

  public getNodesCount() {
    return this.ogma.getNodes().size;
  }

  public getNodes() {
    return this.ogma.getNodes();
  }

  public applyStyles(styles: NodeStyleRuleDefinition<unknown, unknown>) {
    return this.ogma.styles.addRule(styles);
  }
}
