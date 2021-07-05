# Lazy-loaded Assets

This library contains some JavaScript plugins to allow lazy-loading images, scripts, stylesheets, iframes and more. The lazy-load functionality also works with Foundation Interchange, and with pictures tags.

## Initializing in JavaScript

To initialize the library, you need to do create a new instance of the `lazyLoadAssets` class:

```javascript
new lazyLoadAssets(document.body, {
  plugins: [...]
})
```

For example:

```javascript
import {
  activateOnScroll,
  lazyIframe,
  lazyScripts,
  lazyStyles,
  lazyCssBg,
  lazyLoadAssets,
  animate,
} from 'lazyload-assets';
import { onInteractive } from 'lazyload-assets/utils/onReady';

onInteractive(() => {
  new lazyLoadAssets(document.body, {
    plugins: [activateOnScroll, lazyIframe, lazyCssBg, lazyScripts, lazyStyles, animate],
  });
});
```
