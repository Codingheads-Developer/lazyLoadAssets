import activateOnScroll from './activateOnScroll';

/**
 * LazyVideo
 * JS Plugin to lazy load videos
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class lazyVideo {
  /**
   * Options to be set on the intersection observer
   */
  static observerOptions: IntersectionObserverInit = {
    rootMargin: '200px 100px',
  };

  /**
   * Initialize a lazy video element
   */
  static initializeVideo(video: HTMLVideoElement): void {
    [...video.children].forEach(child => {
      if (typeof child.tagName === 'string' && child.tagName === 'SOURCE') {
        const source = child as HTMLSourceElement;
        source.src = source.dataset.src;
        delete source.dataset.src;
      }
    });

    video.load();
  }

  static initializer(container: HTMLElement = document.body) {
    const elements = container.querySelectorAll(
      `video[data-lazy-video]:not([data-lazy-video-init])`
    );
    if (elements.length) {
      elements.forEach(element => {
        new activateOnScroll(element as HTMLVideoElement, {
          initAttribute: 'lazyVideoInit',
          options: this.observerOptions,
          callback: (target: HTMLVideoElement) => {
            this.initializeVideo(target);
          },
        });
      });
    }
  }

  // the cleaner, to be used in lazyLoadAssets
  static cleaner(node: HTMLElement) {
    node.removeAttribute('data-lazy-video-init');
  }

  // save to the window object
  static saveToGlobal(global = window) {
    (global as any).lazyVideo = this;
  }
}
