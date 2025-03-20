import { Dots } from './dots';

export class DotsBlock {
  private linkElement: HTMLAnchorElement;
  private dotsContainer: HTMLDivElement | null = null;

  constructor(
    element: HTMLElement,
    private colors: number[][]
  ) {
    this.linkElement = element as HTMLAnchorElement;
    this.showDots();
  }

  private showDots(): void {
    if (!this.dotsContainer) {
      this.dotsContainer = document.createElement('div');
      this.dotsContainer.className = 'absolute inset-0.5';
      this.dotsContainer.style.opacity = '0';
      this.linkElement.prepend(this.dotsContainer);

      new Dots(this.dotsContainer, {
        colors: this.colors,
        opacities: [0.3, 0.3, 0.5, 0.5, 0.8, 0.8, 0.8, 1, 1, 1],
        totalSize: 4,
        dotSize: 2,
        center: ['x'],
        shader:
          'float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15); opacity *= step(intro_offset, u_time); opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time)) * 1.25, 1.0, 1.25);',
      });
    }

    this.fadeIn(this.dotsContainer);
  }

  private fadeIn(element: HTMLElement): void {
    element.style.opacity = '0';
    element.style.display = 'block';
    void element.offsetWidth;
    element.style.transition = 'opacity 300ms';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }
}
