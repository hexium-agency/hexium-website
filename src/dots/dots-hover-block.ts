import { Dots } from './dots';
import { DotsHoverGroup } from './dots-hover-group';

export class DotsHoverBlock {
  private element: HTMLElement;
  private linkElement: HTMLAnchorElement;
  private dotsContainer: HTMLDivElement | null = null;
  private dots: Dots | null = null;
  private isHovered = false;
  private zIndex = 0;

  constructor(
    element: HTMLElement,
    private group: DotsHoverGroup,
    private href: string,
    private colors: number[][]
  ) {
    this.element = element;
    this.setupElement();
    // this.linkElement = this.createLinkElement();
    this.linkElement = element as HTMLAnchorElement;
    this.addEventListeners();
  }

  private setupElement(): void {
    //this.element.style.display = 'block';
    //this.element.style.position = 'relative';
    //this.element.style.width = '100%';
    //this.element.style.height = '100%';
  }

  private createLinkElement(): HTMLAnchorElement {
    const link = document.createElement('a');
    link.href = this.href;
    link.className =
      'group h-full relative -ml-px -mt-px flex w-full flex-none items-center justify-center border bg-gray-950 py-8 transition-[border-color,z-index] delay-150 hover:delay-0 hover:duration-300 focus:!z-[--focus-z] focus:transition-none border-gray-800';

    // Add content slot
    const contentSlot = Array.from(this.element.childNodes);
    contentSlot.forEach((node) => {
      link.appendChild(node.cloneNode(true));
    });

    // Clear original content
    this.element.innerHTML = '';

    // Add link to element
    this.element.appendChild(link);

    return link;
  }

  private addEventListeners(): void {
    this.linkElement.addEventListener('mouseenter', this.onHover.bind(this));
    this.linkElement.addEventListener('focus', this.onHover.bind(this));
    this.linkElement.addEventListener('mouseleave', this.onUnhover.bind(this));
    this.linkElement.addEventListener('blur', this.onUnhover.bind(this));
  }

  private onHover(): void {
    // Only respond to hover on devices with hover capability
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      this.isHovered = true;
      this.updateZIndex();
      this.showDots();
    }
  }

  private onUnhover(): void {
    this.isHovered = false;
    this.hideDots();
  }

  private updateZIndex(): void {
    const newZIndex = this.group.incrementZIndex();
    this.zIndex = newZIndex;
    this.linkElement.style.zIndex = String(newZIndex);
  }

  private showDots(): void {
    if (!this.dotsContainer) {
      this.dotsContainer = document.createElement('div');
      this.dotsContainer.className = 'absolute inset-0.5';
      this.dotsContainer.style.opacity = '0';
      this.linkElement.prepend(this.dotsContainer);

      // Initialize dots
      this.dots = new Dots(this.dotsContainer, {
        colors: this.colors,
        opacities: [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
        totalSize: 3,
        dotSize: 1,
        center: ['x'],
        shader:
          'float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15); opacity *= step(intro_offset, u_time); opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time)) * 1.25, 1.0, 1.25);',
      });
    }

    // Animate the dots in
    this.fadeIn(this.dotsContainer);
  }

  private hideDots(): void {
    if (this.dotsContainer) {
      this.fadeOut(this.dotsContainer, () => {
        if (this.dotsContainer) {
          this.dots?.destroy();
          this.dots = null;
          this.dotsContainer.remove();
          this.dotsContainer = null;
        }
      });
    }
  }

  private fadeIn(element: HTMLElement): void {
    // Reset opacity
    element.style.opacity = '0';
    element.style.display = 'block';

    // Trigger reflow
    void element.offsetWidth;

    // Add transition
    element.style.transition = 'opacity 300ms';

    // Fade in
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  private fadeOut(element: HTMLElement, callback?: () => void): void {
    // Add transition
    element.style.transition = 'opacity 300ms';

    // Fade out
    element.style.opacity = '0';

    // Execute callback after transition
    setTimeout(() => {
      callback?.();
    }, 300);
  }
}
