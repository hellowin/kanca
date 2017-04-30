// @flow
export const syncToPromise = (func: Function) => new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve(func());
    }, 0);
  } catch (e) {
    reject(e);
  }
});

export default {
  syncToPromise,
};
