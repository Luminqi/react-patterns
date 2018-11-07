import React, { useReducer } from 'react'
import { callAll, combineReducers } from '../uitls/util'
import './accordion.css'

function accordionReducer (state, action) {
  switch (action.type) {
    case 'close':
      return {...state, openIndexes: state.openIndexes.filter(i => i !== action.index)}
    case 'open':
      return {...state, openIndexes: [...state.openIndexes, action.index]}
  }
}

export function single (state, action) {
  switch (action.type) {
    case 'close':
      return state
    case 'open':
      return {...state, openIndexes: state.openIndexes.slice(-1)} 
  }
}

export function preventClose (state, action) {
  switch (action.type) {
    case 'close':
      if (!state.openIndexes.length) {
        return {...state, openIndexes: [action.index]}
      }
      return state
    case 'open':
      return state 
  }
}
    
export function useAccordion ({
  stateReducer = (state, action) => state,
  initialOpenIndexes = [0],
  state,
  onStateChange
} = {}) {
  console.log('useAccordion')
  const openIndexes = (state && state.openIndexes) || initialOpenIndexes
  const [accordionState, dispatch] = useReducer(combineReducers(accordionReducer, stateReducer), {openIndexes})
  const getIndexes = () => {
    return (state && state.openIndexes) || accordionState.openIndexes
  }
  const getButtonProps = ({onClick, index, ...props}) => {
    const openIndexes = getIndexes()
    const type = openIndexes.includes(index) ? 'close' : 'open'
    const action = {type, index}
    return {
      onClick: callAll(
        (...arg) => onClick(action, ...arg), 
        () => handleButtonClick(action)
      ),
      ...props
    }
  }
  const handleButtonClick = action =>  {
    dispatch(action)
    if (typeof onStateChange === 'function') {
      const openIndexes = getIndexes()
      onStateChange(openIndexes, action)
    }
  }
  return {
    openIndexes: getIndexes(),
    getButtonProps
  }
}

export function Accordion ({items, ...props}) {
  const {openIndexes, getButtonProps} = useAccordion(combineReducers(single, preventClose), [2])
  const onClick = () => {
    console.log('user defined onClick')
  }
  return (
    <div className='accordion' {...props}>
      {items.map((item, index) => (
        <AccordionItem key={item.title} direction='vertical'>
          <AccordionButton {...getButtonProps({index})}>
            {item.title}
          </AccordionButton>
          <AccordionContent isOpen={openIndexes.includes(index)}>
            {item.contents}
          </AccordionContent>
        </AccordionItem>
      ))}
    </div>
  )
}


function AccordionItem ({direction, children, ...props}) {
  return (
    <div className={`accordionItem ${direction}`} {...props}>
      {children}
    </div>
  )
}

function AccordionButton ({children, ...props}) {
  return (
    <div className="button" {...props}>
      {children}
    </div>
  )
}

function AccordionContent ({isOpen, children, ...props}) {
  return (
    <div className="content" {...props}>
      {isOpen ? children : null}
    </div>
  )
}



