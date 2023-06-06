import { Tooltip } from './tootlip.plugin';
import { OgmaService } from './ogma/service/ogma.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tooltip',
  template: '',
  styleUrls: ['./tooltip.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class TooltipComponent implements OnInit {
  private tooltip!: Tooltip;
  constructor(private ogmaService: OgmaService) {}
  ngOnInit() {
    // add the tooltip plugin
    this.tooltip = new Tooltip(this.ogmaService.ogma, {
      placement: 'right',
      // here you can use your HTML templates
      content: (ogma) => {
        const { target } = ogma.getPointerInformation();
        if (target)
          return `${
            target.isNode ? 'node' : 'edge'
          }: <span class="info">${target.getId()}</span>`;
        return '';
      },
    });
  }
}
