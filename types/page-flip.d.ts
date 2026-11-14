declare module 'page-flip' {
  export class PageFlip {
    constructor(container: HTMLElement, options: Record<string, unknown>);
    loadFromHTML(elements: NodeListOf<HTMLElement>): void;
    loadFromImages(images: string[]): void;
    on(event: string, callback: (e: { data: number }) => void): void;
    turnToPage(pageIndex: number): void;
    flip(pageIndex: number, corner?: 'top' | 'bottom'): void;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): 'portrait' | 'landscape';
    getState(): string;
    destroy(): void;
  }
}
