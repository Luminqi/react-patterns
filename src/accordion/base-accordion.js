import React, { Component } from 'react'

function callAll (...fns) {
  return (...args) => {
    fns.forEach(fn => {
      if (fn) {
        fn(...args)
      }
    })
  }
}

export class Accordion extends Component {
  static defaultProps = {
    stateReducer: (state, changes) => changes,
    onStateChange: () => {}
  }
  state = {
    openIndexes: [0]
  }
  isControlledProp (prop) {
    return this.props[prop] !== undefined 
  }
  getState (state = this.state) {
    return Object.entries(state).reduce(
      (combinedState, [key, value]) => {
        if (this.isControlledProp(key)) {
          combinedState[key] = this.props[key]
        } else {
          combinedState[key] = value
        }
        return combinedState
      },
      {}
    )
  }
  getButtonProps = ({onClick, index, ...props} = {}) => ({
    onClick: callAll(onClick, () => this.handleButtonClick(index)),
    ...props
  })
  internalSetState (changes, callback) {
    let allChanges
    this.setState(
      state => {
        const combinedState = this.getState(state)
        const changesObject = typeof changes === 'function' ? changes(combinedState) : changes
        console.log(changesObject)
        const reducedChanges = this.props.stateReducer(state, changesObject) || {}
        allChanges = reducedChanges
        const nonControlledChanges = Object.entries(reducedChanges).reduce(
          (newChanges, [key, value]) => {
            if (!this.isControlledProp(key) && key !== 'type') {
              newChanges[key] = value
            }
            return newChanges
          },
          {}
        )
        return Object.keys(nonControlledChanges).length ? nonControlledChanges : null
      },
      () => {
        this.props.onStateChange(allChanges, this.getStateAndHelpers())
        if (typeof callback === 'function') {
          callback()
        }
      }
    )
  }
  handleButtonClick = index =>  {
    console.log('click')
    this.internalSetState(state => {
      const closing = state.openIndexes.includes(index)
      return {
        type: closing ? 'closing': 'opening',
        openIndexes: closing ? state.openIndexes.filter(i => i !== index) : [...state.openIndexes, index]
      }
    })
  }
  getStateAndHelpers () {
    const { openIndexes } = this.getState()
    return {
      openIndexes,
      getButtonProps: this.getButtonProps
    }
  }
  render () {
    return this.props.children(this.getStateAndHelpers())
  }
}

