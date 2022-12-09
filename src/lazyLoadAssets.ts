/** @format */
import { debounce } from './utils/utils';
import activateOnScroll from './activateOnScroll';

/**!
 * lazyLoadAssets
 * JS Plugin to lazy load assets (images, iframes, scripts and css files)
 * depends on activateOnScroll
 * requires IntersectionObserver, MutationObserver, activateOnScroll
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class lazyLoadAssets {
  container: HTMLElement;
  useMutationObserver: boolean;
  #observer: MutationObserver | null = null;
  plugins: Array<any>;
  imagesLoaded: ImagesLoaded.ImagesLoadedConstructor | null = null;

  constructor(
    container: HTMLElement = document.body,
    {
      useMutationObserver = true,
      init = true,
      imagesLoaded = null,
      plugins = [activateOnScroll],
    }: {
      useMutationObserver?: boolean;
      init?: boolean;
      plugins?: Array<any>;
      imagesLoaded?: ImagesLoaded.ImagesLoadedConstructor;
    } = {}
  ) {
    // save the settings
    this.container = container;
    this.useMutationObserver = useMutationObserver;
    this.plugins = plugins;
    this.imagesLoaded = imagesLoaded;
    if (init) this.init();
  }

  activate() {
    this.plugins.forEach(plugin => {
      plugin.parent = this;
      plugin.initializer(this.container);
    });
  }

  debouncedActivate = debounce(() => this.activate(), 100);

  clean(node: HTMLElement) {
    this.plugins.forEach(plugin => plugin.cleaner && plugin.cleaner(node));
  }

  init() {
    // activate the lazy assets
    this.activate();

    // observe if new elements are added - for example, by AJAX or infinite scroll
    if (this.useMutationObserver && 'MutationObserver' in window) {
      this.#observer = new MutationObserver(mutationList => {
        // check if new elements are added
        const addedNodes = mutationList.reduce(
          (added, mutation) => [
            ...added,
            Array.from(mutation.addedNodes).filter(
              node =>
                node.nodeType == Node.ELEMENT_NODE &&
                !['SCRIPT', 'LINK'].includes((node as HTMLElement).tagName)
            ),
          ],
          []
        );
        if (addedNodes.length) {
          // clear the initialization attributes on the new nodes, to allow lazy-load to work
          addedNodes.forEach(node => {
            this.clean(node);
            const toClear = node.querySelectorAll(
              [
                '[data-lazyimg-init]',
                '[data-lazyiframe-init]',
                '[data-lazycssbg-init]',
                '[data-lazy-video-init]',
              ].join(', ')
            );
            if (toClear.length)
              toClear.forEach(item => {
                if (!item.activateOnScrollInstance) {
                  this.clean(item);
                }
              });
          });
          this.debouncedActivate();
        }
      });
      this.#observer.observe(this.container, {
        attributes: false,
        childList: true,
        subtree: true,
      });
    }
  }
}
