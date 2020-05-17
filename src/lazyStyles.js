/** @format */

/**!
 * lazyStyles
 * JS Plugin to lazy load styles
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 *
 * version 0.3
 */
export default class lazyStyles {
  static initializer(container) {
    const elements = container.querySelectorAll(
      `[data-lazy-stylesheet]:not([data-lazystylesheet-init])`
    );
    if (elements.length) {
      elements.forEach(element => {
        new activateOnScroll(element, {
          initAttribute: 'lazystylesheetInit',
          options: {
            rootMargin: '600px 200px',
          },
          callback: target => {
            let styles = target.dataset.lazyStylesheet;
            try {
              const scriptsArray = JSON.parse(styles);
              styles = scriptsArray;
            } catch (e) {
              styles = [styles];
            }
            styles.forEach(style => {
              const styleElement = document.createElement('link');
              styleElement.rel = 'stylesheet';
              styleElement.type = 'text/css';
              styleElement.href = style;
              document.head.appendChild(styleElement);
            });
          },
        });
      });
    }
  }
}
