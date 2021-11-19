import activateOnScroll from './activateOnScroll';

/**
 * add a class on object when they come into view
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class animate {
  /**
   * Options to be set on the intersection observer
   */
  static observerOptions = {
    rootMargin: '300px 100px',
  };

  /**
   * Initialize an animated element
   */
  static initializeElement = (target: HTMLElement) => {
    requestAnimationFrame(() => {
      target.dataset.animationLoaded = 'true';
      const toAdd = target.dataset.animate;
      if (toAdd.length) {
        target.classList.add(toAdd);
      }
      target.dispatchEvent(
        new CustomEvent('animateLoaded', {
          bubbles: true,
        })
      );
    });
  };

  /**
   * initializer to be used with lazyLoadAssets
   */
  static initializer(container: HTMLElement = document.body) {
    const elements = container.querySelectorAll(
      `[data-animate]:not([data-animate-init])`
    );
    if (elements.length) {
      ([...elements] as HTMLElement[]).forEach(element => {
        const options =
          'rootMargin' in element.dataset
            ? { rootMargin: element.dataset.rootMargin }
            : {};
        new activateOnScroll(element, {
          initAttribute: 'animateInit',
          options: { ...options, ...this.observerOptions },
          callback: this.initializeElement,
        });
      });
    }
  }

  // the cleaner, to be used in lazyLoadAssets
  static cleaner(node: HTMLElement) {
    node.removeAttribute('data-animate-init');
  }
}
