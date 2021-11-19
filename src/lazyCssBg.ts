import activateOnScroll from './activateOnScroll';
import imagesLoaded from 'imagesloaded';

/**
 * lazyCssBg
 * JS Plugin to lazy load css image backgrounds
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class lazyCssBg {
  /**
   * Options to be set on the intersection observer
   */
  static observerOptions: IntersectionObserverInit = {};

  static initializeElement = (target: HTMLElement) => {
    window.requestAnimationFrame(() => {
      imagesLoaded(target, { background: true }, function () {
        requestAnimationFrame(() => {
          target.dataset.cssBgLoaded = 'true';
          target.dispatchEvent(
            new CustomEvent('lazyCssBgLoaded', {
              bubbles: true,
            })
          );
        });
      });
    });
  };

  /**
   * initializer to be used with lazyLoadAssets
   */
  static initializer(container: HTMLElement = document.body) {
    const elements = container.querySelectorAll(
      `[data-lazy-css-bg]:not([data-lazycssbg-init])`
    );
    if (elements.length) {
      [...elements].forEach(element => {
        new activateOnScroll(element as HTMLElement, {
          initAttribute: 'lazycssbgInit',
          options: this.observerOptions,
          callback: this.initializeElement,
        });
      });
    }
  }

  // the cleaner, to be used in lazyLoadAssets
  static cleaner(node: HTMLElement) {
    node.removeAttribute('data-lazycssbg-init');
  }

  // save to the window object
  static saveToGlobal(global = window) {
    (global as any).lazyCssBg = this;
  }
}
