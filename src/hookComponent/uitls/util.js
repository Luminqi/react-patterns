export function callAll (...fns) {
  return (...args) => {
    fns.forEach(fn => {
      if (fn) {
        fn(...args)
      }
    })
  }
}

export const combineReducers = (...reducers) => (state, action) => 
reducers.reduce((newState, reducer) => reducer(newState, action), state)
