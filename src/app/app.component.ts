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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  providers: [OgmaService],
  imports: [FormsModule, TooltipComponent]
})
export class AppComponent implements OnInit, AfterContentInit {
  @ViewChild('ogmaContainer', { static: true })
  public container!: ElementRef<HTMLElement>;

  constructor(private ogmaService: OgmaService) {}

  ngOnInit() {
    // pass the ogma instance configuration on init
    this.ogmaService.initConfig({
      options: {
        backgroundColor: 'rgb(240, 240, 240)'
      }
    });
    // setup more Ogma stuff here, like event listeners and more
  }

  /**
   * Ogma container must be set when content is initialized
   */
  async ngAfterContentInit() {
    const response = await fetch('assets/data.json');
    const data = await response.json();
    // atach the Ogma instance to the DOM
    this.ogmaService.ogma.setContainer(this.container.nativeElement);
    await this.ogmaService.addData(data);
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

  public countNodes() {
    return this.ogmaService.getNodesCount();
  }
}
