export default {
  assoc: (key, value) => object => Object.assign({}, object, { [key]: value }),

  createSet: (prop, array) =>
    array.reduce((acc, item) =>
      Object.assign(acc, { [item[prop]]: item }), {}),

  bind: (fn, ...args) => fn.bind(null, ...args),

  every: fn => array => array.every(fn),

  filter: fn => array => array.filter(fn),

  map: fn => array => array.map(fn),

  propEq: (prop, value) => object => object[prop] === value,

  sleep: time => new Promise(res => setTimeout(res, time)),

  sort: fn => array => array.sort(fn),

  tap: fn => arg => { fn(...arg); return arg },

  values: object => Object.values(object)
}
