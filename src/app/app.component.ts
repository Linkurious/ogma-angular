import {
  OnInit,
  AfterContentInit,
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OgmaService, createEdge, createNode } from './ogma/service/ogma.service';
import { TooltipComponent } from './tooltip.component';
import { MemoizedSelector, Store } from "@ngrx/store";
import { getEdgesSelector, getNodesSelector } from "./ogma/store/ogma.selector";
import { map, Observable } from "rxjs";
import { AppState } from "./ogma/store/ogma.reducer";
import { AsyncPipe } from "@angular/common";
import { EdgeId, NodeId, View } from '@linkurious/ogma/dev';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  providers: [OgmaService],
  imports: [FormsModule, TooltipComponent, AsyncPipe]
})
export class AppComponent implements OnInit, AfterContentInit {
  @ViewChild('ogmaContainer', { static: true })
  public container!: ElementRef<HTMLElement>;
  public addedNodes$!: Observable<number>;
  public nodeIds$!: Observable<NodeId[]>;
  public edgeIds$!: Observable<EdgeId[]>;


  constructor(private ogmaService: OgmaService, private _store: Store<AppState>) { }

  ngOnInit() {
    // pass the ogma instance configuration on init
    this.ogmaService.initConfig({
      options: {
        backgroundColor: 'rgb(240, 240, 240)'
      }
    });
    // ngRx selector
    this.nodeIds$ = this.select(getNodesSelector);
    this.edgeIds$ = this.select(getEdgesSelector);
  }

  /**
   * Ogma container must be set when content is initialized
   */
  async ngAfterContentInit() {
    const response = await fetch('assets/data.json');
    const graph = await response.json();
    // atach the Ogma instance to the DOM
    this.ogmaService.ogma.setContainer(this.container.nativeElement);
    await this.ogmaService.addData({
      nodes: graph.nodes.slice(0, 5),
      edges: []
    });
    await this.ogmaService.applyStyles({
      nodeAttributes: {
        color: node => {
          const id = node
            .getId()
            .toString()
            .replace(/[a-z]+/g, '');
          return parseInt(id) % 2 === 0 ? 'purple' : 'orange';
        }
      }
    });
    return await this.ogmaService.runLayout();
  }

  public async addNode() {
    const node = createNode(this.countNodes());
    const existingNodes = this.ogmaService.getNodes();
    const randomId = existingNodes
      .get(Math.floor(Math.random() * existingNodes.size))
      .getId();
    const edge = createEdge(node.id!, randomId);

    // add it to the graph as a subgraph and run layout
    await this.ogmaService.addData({ nodes: [node], edges: [edge] });
    await this.ogmaService.runLayout();
  }

  public async removeNode() {
    const existingNodes = this.ogmaService.getNodes();
    const randomId = existingNodes
      .get(Math.floor(Math.random() * existingNodes.size))
      .getId();
    const nodes = this.ogmaService.ogma.getNodes([randomId]);
    await this.ogmaService.removeData({ nodes });
    await this.ogmaService.runLayout();
  }

  public async addEdge() {
    const ids = this.ogmaService.getNodes().getId();
    const source = ids[Math.floor(Math.random() * ids.length)];
    const target = ids[Math.floor(Math.random() * ids.length)];
    await this.ogmaService.addData({
      nodes: [],
      edges: [{
        source,
        target
      }]
    });
    await this.ogmaService.runLayout();
  }

  public async removeEdge() {
    const existingEdges = this.ogmaService.getEdges();
    const randomId = existingEdges
      .get(Math.floor(Math.random() * existingEdges.size))
      .getId();
    const edges = this.ogmaService.ogma.getEdges([randomId]);
    await this.ogmaService.removeData({ edges });
    await this.ogmaService.runLayout();
  }


  public countNodes() {
    return this.ogmaService.getNodes().size;
  }

  public countEdges() {
    return this.ogmaService.getEdges().size;
  }

  public select<T>(selector: MemoizedSelector<AppState, T>): Observable<T> {
    return this._store.pipe(map((state): T => selector(state)));
  }
}
