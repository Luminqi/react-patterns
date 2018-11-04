import React from 'react'
import { unstable_createResource as createResource } from 'react-cache'

const ImgResource= createResource(src => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = resolve
    img.onerror = reject
  })
})

export const Img = props => {
  ImgResource.read(props.src)
  return <img {...props} />
} 