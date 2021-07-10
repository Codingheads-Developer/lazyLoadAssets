/** @format */

/**
 * Run a callback when the document.readyState has a certain value
 * @param {string|string[]} state - the state(s) when to run the callback
 * @param {Function} callback - the callback to run
 */
export const onReadyState = (state: string | string[], callback: Function): void => {
  const validStates = Array.isArray(state) ? state : [state];
  const checkAndRun = () => {
    if (validStates.includes(document.readyState)) {
      document.removeEventListener('readystatechange', checkAndRun);
      callback();
      return true;
    }
    return false;
  };
  if (!checkAndRun()) {
    document.addEventListener('readystatechange', checkAndRun);
  }
};

/**
 * Run a callback when the document.readyState is 'complete'
 * (DOM + assets are loaded)
 * @param {Function} callback - the callback to run
 */
export const onComplete = (callback: Function): void =>
  onReadyState(['complete', 'loaded'], callback);

/**
 * Run a callback when the document.readyState is 'interactive'
 * (DOM is loaded - equivalent to DOMContentLoaded)
 * @param {Function} callback - the callback to run
 */
export const onInteractive = (callback: Function): void =>
  onReadyState('interactive', callback);
export const onReady = onInteractive;

export default onReady;
