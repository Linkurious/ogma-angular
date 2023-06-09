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
import {MemoizedSelector, select, Store} from "@ngrx/store";
import {increment} from "./ogma/store/ogma.actions";
import {getCounterSelector, getNodesSelector} from "./ogma/store/ogma.selector";
import {map, Observable} from "rxjs";
import {AppState} from "./ogma/store/ogma.reducer";
import {AsyncPipe} from "@angular/common";
import { NodeId } from '@linkurious/ogma/dev';

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

  constructor(private ogmaService: OgmaService, private _store: Store<AppState>) {}

  ngOnInit() {
    // pass the ogma instance configuration on init
    this.ogmaService.initConfig({
      options: {
        backgroundColor: 'rgb(240, 240, 240)'
      }
    });
    // ngRx selector
    this.addedNodes$ = this.select(getCounterSelector);
    this.nodeIds$ = this.select(getNodesSelector);
    // setup more Ogma stuff here, like event listeners and more
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
      nodes: graph.nodes.slice(0,5),
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
    this._store.dispatch(increment())
  }

  public countNodes() {
    return this.ogmaService.getNodesCount();
  }

  public select<T>(selector:  MemoizedSelector<AppState, T>): Observable<T>{
    return this._store.pipe(map((state):T => selector(state)));
  }
}
