/** @format */

import activateOnScroll from './activateOnScroll';
import imagesLoaded from 'imagesloaded';

/**!
 * lazyCssBg
 * JS Plugin to lazy load css image backgrounds
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 *
 * version 0.3
 */
export default class lazyCssBg {
  /**
   * initializer to be used with lazyLoadAssets
   */
  static initializer(container) {
    const elements = container.querySelectorAll(
      `[data-lazy-css-bg]:not([data-lazycssbg-init])`
    );
    if (elements.length) {
      elements.forEach(element => {
        new activateOnScroll(element, {
          initAttribute: 'lazycssbgInit',
          callback: target => {
            setTimeout(() => {
              imagesLoaded(target, { background: true }, function () {
                requestAnimationFrame(() => {
                  target.dataset.cssBgLoaded = true;
                  target.dispatchEvent(
                    new CustomEvent('lazyCssBgLoaded', {
                      bubbles: true,
                    })
                  );
                });
              });
            });
          },
        });
      });
    }
  }

  // the cleaner, to be used in lazyLoadAssets
  static cleaner(node) {
    node.removeAttribute('data-lazycssbg-init');
  }

  // save to the window object
  static saveToGlobal(global = window) {
    global.lazyCssBg = lazyCssBg;
  }
}
