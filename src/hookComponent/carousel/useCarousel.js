import React, { useState, useReducer, useEffect } from 'react'
import { callAll, combineReducers } from '../uitls/util'
import img1 from './images/img1.jpg'
import img2 from './images/img2.jpg'
import img3 from './images/img3.jpg'
import './index.css'

const carouselReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT':
    case 'PROGRESS':
      return {
        ...state,
        isPlaying: action.type === 'PROGRESS',
        currentIndex: (state.currentIndex + 1) % state.slideNum
      }
    case 'PREV':
      return {
        ...state,
        isPlaying: false,
        currentIndex: (state.currentIndex - 1 + state.slideNum) % state.slideNum
      }
    case 'GOTO':
      return {
        ...state,
        currentIndex: action.index
      }
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false
      }
    case 'PLAY':
      return {
        ...state,
        isPlaying: true
      }
    default:
      return state
  }
}

function useCarousel ({
  stateReducer = (state, action) => state,
  isPlaying = true,
  currentIndex = 0,
  slideNum = 1,
  duration = 1000,
  state,
  onStateChange
} = {}) {
  isPlaying = (state && state.isPlaying) || isPlaying
  currentIndex = (state && state.currentIndex) || currentIndex
  slideNum = (state && state.slideNum) || slideNum
  const [carouselState, dispatch] = useReducer(
    combineReducers(carouselReducer, stateReducer),
    {
      isPlaying,
      currentIndex,
      slideNum
    }
  )
  const [act, setAction] = useState(null)
  const getState = () => {
    return Object.entries(carouselState).reduce(
      (combinedState, [key, value]) => {
        if (state && state[key] !== undefined) {
          combinedState[key] = state[key]
        } else {
          combinedState[key] = value
        }
        return combinedState
      },
      {}
    )
  }
  useEffect(
    () => {
      if (carouselState.isPlaying) {
        let timeout = setTimeout(() => {
          dispatch({type: 'PROGRESS'})
        }, duration);
        return () => clearTimeout(timeout)
      }
    },
    [carouselState.currentIndex, carouselState.isPlaying]
  )
  const handleClick = (action) => () => {
    setAction(action)
    dispatch(action)
  }
  useEffect(()=> {
    if (typeof onStateChange === 'function') {
      const state = getState()
      onStateChange(state, act)
    }
  }, [carouselState])

  const getNextButtonProps = ({onClick, ...props} = {}) => {
    return {
      onClick: callAll(onClick, handleClick({type: 'NEXT'})),
      ...props
    }
  }
  const getPrevButtonProps =  ({onClick, ...props} = {}) => {
    return {
      onClick: callAll(onClick, handleClick({type: 'PREV'})),
      ...props
    }
  }
  const getPlayButtonProps = ({onClick, ...props} = {}) => {
    return {
      onClick: callAll(onClick, handleClick({type: 'PLAY'})),
      ...props
    }
  }
  const getPauseButtonProps = ({onClick, ...props} = {}) => {
    return {
      onClick: callAll(onClick, handleClick({type: 'PAUSE'})),
      ...props
    }
  }
  const getGotoButtonProps = ({onClick, index, ...props} = {}) => {
    return {
      onClick: callAll(onClick, handleClick({type: 'GOTO', index})),
      ...props
    }
  }
  return {
    state: getState(),
    getNextButtonProps,
    getPrevButtonProps,
    getPlayButtonProps,
    getPauseButtonProps,
    getGotoButtonProps,
  }
}


export function Carousel () {
  const {
    state,
    getNextButtonProps,
    getPrevButtonProps,
    getPlayButtonProps,
    getPauseButtonProps,
    getGotoButtonProps
  } = useCarousel({slideNum: 3, duration: 3000})
  console.log(state)
  return (
    <div className="carousel">
      <Slides>
        <img className="slide" key="0" aria-hidden={state.currentIndex !== 0} src={img1} />
        <img className="slide" key="1" aria-hidden={state.currentIndex !== 1} src={img2} />
        <img className="slide" key="2" aria-hidden={state.currentIndex !== 2} src={img3} />
      </Slides>
      <button {...getNextButtonProps()}> + </button>
      <button {...getPrevButtonProps()}> - </button>
      {
        state.isPlaying
         ? <button {...getPauseButtonProps()}> pause </button>
         : <button {...getPlayButtonProps()}> play </button>
      }
      {
        [0, 1 ,2].map(index => (
          <button {...getGotoButtonProps({index})} key={index}>{index}</button>
        ))
      }
    </div>
  )
}

function Slides (props) {
  return <div className="slides" {...props} />
}