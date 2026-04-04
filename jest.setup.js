Object.defineProperty(global, '__ExpoImportMetaRegistry', {
  value: {},
  writable: true,
});

if (typeof global.structuredClone !== 'function') {
  global.structuredClone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };
}
