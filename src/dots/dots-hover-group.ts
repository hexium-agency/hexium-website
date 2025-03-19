export class DotsHoverGroup {
  private currentZIndex = 0;
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
    this.setupElement();
  }

  private setupElement(): void {
    this.element.classList.add(
      'relative',
      '-mr-[3px]',
      'flex',
      'flex-auto',
      'flex-wrap',
      'pl-px',
      'pt-px',
      'h-full'
    );
  }

  incrementZIndex(): number {
    return ++this.currentZIndex;
  }

  addBlock(block: HTMLElement): void {
    this.element.appendChild(block);
  }
}
