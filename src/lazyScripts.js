/** @format */

/**!
 * lazyScripts
 * JS Plugin to lazy load scripts
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 *
 * version 0.3
 */
export default class lazyScripts {
  static initializer(container) {
    // lazy-load scripts
    const elements = container.querySelectorAll(
      `[data-lazy-script]:not([data-lazyscript-init])`
    );
    if (elements.length) {
      elements.forEach(element => {
        new activateOnScroll(element, {
          initAttribute: 'lazyscriptInit',
          options: {
            rootMargin: '600px 200px',
          },
          callback: target => {
            let scripts = target.dataset.lazyScript;
            try {
              const scriptsArray = JSON.parse(scripts);
              scripts = scriptsArray;
            } catch (e) {
              scripts = [scripts];
            }
            scripts.forEach(script => {
              const scriptElement = document.createElement('script');
              scriptElement.src = script;
              document.head.appendChild(scriptElement);
            });
          },
        });
      });
    }
  }
}
