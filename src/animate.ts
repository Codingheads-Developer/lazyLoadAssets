import activateOnScroll from './activateOnScroll';

/**
 * add a class on object when they come into view
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class animate {
  /**
   * initializer to be used with lazyLoadAssets
   */
  static initializer(container: HTMLElement = document.body) {
    const elements = container.querySelectorAll(
      `[data-animate]:not([data-animate-init])`
    );
    if (elements.length) {
      [...elements].forEach(element => {
        new activateOnScroll(element as HTMLElement, {
          initAttribute: 'animateInit',
          callback: (target: HTMLElement) => {
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
          },
        });
      });
    }
  }

  // the cleaner, to be used in lazyLoadAssets
  static cleaner(node: HTMLElement) {
    node.removeAttribute('data-animate-init');
  }
}
