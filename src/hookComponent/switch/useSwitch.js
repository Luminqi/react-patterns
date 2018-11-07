import React, { useReducer } from 'react'
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
  const getChecked = () => {
    return (state && state.checked) || switchState.checked
  }
  const getSwitchProps = ({onClick, ...props}) => {
    const checked = getChecked()
    const type = checked ? 'off' : 'on'
    const action = {type}
    return {
      onClick: callAll(
        (...arg) => onClick(action, ...arg), 
        () => handleSwitchClick(action)
      ),
      ...props
    }
  }
  const handleSwitchClick = action => {
    dispatch(action)
    if (typeof onStateChange === 'function') {
      const checked= getChecked()
      onStateChange(checked, action)
    }
  }
  return {
    checked: getChecked(),
    getSwitchProps
  }
}