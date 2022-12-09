/** @format */

const documentReadyStateValues: DocumentReadyState[] = [
  'loading',
  'interactive',
  'complete',
];

/**
 * Run a callback when the document.readyState has a certain value
 * @param {DocumentReadyState | DocumentReadyState[]} state - the state(s) when to run the callback
 * @param {Function} callback - the callback to run
 */
export const onReadyState = (
  state: DocumentReadyState | DocumentReadyState[],
  callback: Function
): void => {
  const validStates = (Array.isArray(state) ? state : [state]).filter(state =>
    documentReadyStateValues.includes(state)
  );
  const checkAndRun = () => {
    const minValidStateIndex = validStates.reduce(
      (minIndex, state) => Math.min(minIndex, documentReadyStateValues.indexOf(state)),
      Infinity
    );

    if (
      validStates.includes(document.readyState) ||
      documentReadyStateValues.indexOf(document.readyState) > minValidStateIndex
    ) {
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
  onReadyState('complete', callback);

/**
 * Run a callback when the document.readyState is 'interactive'
 * (DOM is loaded - equivalent to DOMContentLoaded)
 * @param {Function} callback - the callback to run
 */
export const onInteractive = (callback: Function): void =>
  onReadyState('interactive', callback);
export const onReady = onInteractive;

export default onReady;
