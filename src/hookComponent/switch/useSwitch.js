import React, { useState, useReducer, useEffect } from 'react'
import { callAll, combineReducers } from '../uitls/util'

const switchReducer = (state, action) => {
  switch(action.type) {
    case 'on': 
      return {...state, checked: true}
    case 'off':
      return {...state, checked: false}
  }
} 

export const useSwitch = ({
  stateReducer = (state, action) => state,
  defaultChecked = true,
  state,
  onStateChange
} = {}) => {
  const checked = (state && state.checked) || defaultChecked
  const [switchState, dispatch] = useReducer(combineReducers(switchReducer, stateReducer), {checked})
  const [act, setAction] = useState(null)
  const getChecked = () => {
    return (state && state.checked) || switchState.checked
  }
  const getSwitchProps = ({onClick, ...props} = {}) => {
    const checked = getChecked()
    const type = checked ? 'off' : 'on'
    const action = {type}
    const handler = typeof onClick === 'function'
      ? callAll(
          (...arg) => onClick(action, ...arg), 
          () => handleSwitchClick(action)
        )
      : () => handleSwitchClick(action)
    return {
      onClick: handler,
      ...props
    }
  }
  const handleSwitchClick = action => {
    setAction(action)
    dispatch(action)
  }
  useEffect(()=> {
    if (typeof onStateChange === 'function') {
      const checked= getChecked()
      onStateChange(checked, act)
    }
  }, [switchState.checked])
  return {
    checked: getChecked(),
    getSwitchProps
  }
}