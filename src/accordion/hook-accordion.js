import React, { useState, useReducer } from 'react'
import './accordion.css'

function callAll (...fns) {
  return (...args) => {
    fns.forEach(fn => {
      if (fn) {
        fn(...args)
      }
    })
  }
}

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

export const combineReducers = (...reducers) => (state, action) => 
  reducers.reduce((newState, reducer) => reducer(newState, action), state)

    
export function useAccordion (stateReducer = (state, action) => state, initialOpenIndexes) {
  const openIndexes = initialOpenIndexes ? initialOpenIndexes : [0]
  const [state, dispatch] = useReducer(combineReducers(accordionReducer, stateReducer), {openIndexes})
  const getButtonProps = ({onClick, index, ...props} = {}) => ({
    onClick: callAll(onClick, () => handleButtonClick(index)),
    ...props
  })
  const handleButtonClick = index =>  {
    const type = state.openIndexes.includes(index) ? 'close' : 'open'
    dispatch({type, index})
  }
  return {
    openIndexes: state.openIndexes,
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



