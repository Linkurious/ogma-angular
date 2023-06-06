import Ogma, { Size, Overlay } from '@linkurious/ogma';

type Point = { x: number; y: number };
type PositionGetter = (ogma: Ogma) => Point | null;

export type Content = string | ((ogma: Ogma, position: Point | null) => string);
export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'center';

interface Options {
  position: Point | PositionGetter;
  content?: Content;
  size?: Size;
  visible?: boolean;
  placement?: Placement;
  tooltipClass?: string;
}

const defaultOptions: Required<Options> = {
  tooltipClass: 'ogma-tooltip',
  placement: 'right',
  size: { width: 'auto', height: 'auto' } as any as Size,
  visible: true,
  content: '',
  position: (ogma) => {
    return ogma.view.screenToGraphCoordinates(ogma.getPointerInformation());
  },
};

export class Tooltip {
  private ogma: Ogma;
  private options: Required<Options>;
  private timer = 0;
  public size: Size = { width: 0, height: 0 };
  public layer: Overlay;

  constructor(ogma: Ogma, options: Partial<Options>) {
    this.ogma = ogma;
    this.options = { ...defaultOptions, ...options };
    this.layer = this.createLayer();
  }

  private getPosition() {
    if (typeof this.options.position === 'function')
      return this.options.position(this.ogma);
    return this.options.position;
  }

  private getContent(position: Point | null) {
    const content = this.options.content;
    if (typeof content === 'string') return content;
    else if (typeof content === 'function') return content(this.ogma, position);
    return '';
  }

  private createLayer() {
    const { tooltipClass, placement, size, visible } = this.options;
    const className = getContainerClass(tooltipClass, placement);
    const wrapperHtml = `<div class="${className}"><div class="${tooltipClass}--content" /></div>`;
    const newCoords = this.getPosition();
    this.layer = this.ogma.layers.addOverlay({
      position: newCoords || { x: -9999, y: -9999 },
      element: wrapperHtml,
      scaled: false,
      size,
    });
    this.frame();
    return this.layer;
  }

  private frame = () => {
    this.update();
    this.timer = requestAnimationFrame(this.frame);
  };

  private updateSize() {
    this.size = {
      width: this.layer.element.offsetWidth,
      height: this.layer.element.offsetHeight,
    };
  }

  private update() {
    const coords = this.getPosition();
    const newContent = this.getContent(coords);
    this.layer.element.firstElementChild!.innerHTML = newContent;

    if (!newContent) {
      this.layer.hide();
      return;
    } else this.layer.show();

    this.updateSize();

    this.layer.element.className = getContainerClass(
      this.options.tooltipClass,
      getAdjustedPlacement(
        coords as Point,
        this.options.placement,
        this.size,
        this.ogma
      )
    );
    this.layer.setPosition(coords!);
  }

  setPosition(position: Point | PositionGetter) {
    this.options.position = position;
  }

  setContent(content: Content) {
    this.options.content = content;
  }

  getSize() {
    return { ...this.size };
  }

  destroy() {
    this.layer.destroy();
  }
}

function getAdjustedPlacement(
  coords: Point,
  placement: Placement,
  dimensions: Size,
  ogma: Ogma
): Placement {
  const { width: screenWidth, height: screenHeight } = ogma.view.getSize();
  const { x, y } = ogma.view.graphToScreenCoordinates(coords);
  let res = placement;
  const { width, height } = dimensions;

  if (placement === 'left' && x - width < 0) res = 'right';
  else if (placement === 'right' && x + width > screenWidth) res = 'left';
  else if (placement === 'bottom' && y + height > screenHeight) res = 'top';
  else if (placement === 'top' && y - height < 0) res = 'bottom';

  if (res === 'right' || res === 'left') {
    if (y + height / 2 > screenHeight) res = 'top';
    else if (y - height / 2 < 0) res = 'bottom';
  } else {
    if (x + width / 2 > screenWidth) res = 'left';
    else if (x - width / 2 < 0) res = 'right';
  }

  return res;
}

function getContainerClass(popupClass: string, placement: Placement) {
  return `${popupClass} ${popupClass}--${placement}`;
}
