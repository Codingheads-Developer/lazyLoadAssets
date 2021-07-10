import activateOnScroll from './activateOnScroll';

/**
 * lazyScripts
 * JS Plugin to lazy load scripts
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class lazyScripts {
  static initializer(container: HTMLElement = document.body) {
    // lazy-load scripts
    const elements = container.querySelectorAll(
      `[data-lazy-script]:not([data-lazyscript-init])`
    );
    if (elements.length) {
      elements.forEach(element => {
        new activateOnScroll(element as HTMLElement, {
          initAttribute: 'lazyscriptInit',
          options: {
            rootMargin: '600px 200px',
          },
          callback: (target: HTMLElement) => {
            let scriptsData: string = target.dataset.lazyScript;
            let scripts: string[];
            try {
              const scriptsArray = JSON.parse(scriptsData);
              scripts = scriptsArray;
            } catch (e) {
              scripts = [scriptsData];
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
