import React, { Suspense } from 'react'
import { unstable_createResource as createResource } from 'react-cache'
import { Spinner } from '../spinner'
import { Img } from '../img'
import { fetchArtists } from '../../api'

const ArtistResource = createResource(fetchArtists)

export function HomePage (props) {
  const artists = ArtistResource.read()
  return (
    <Suspense maxDuration={1000} fallback={<Spinner size="medium" />}>
      {artists.map(artist => (
        <Artist name={artist.name} key={artist.id} imgs={artist.images} />  
      ))}
    </Suspense>
  )
}

function Artist ({name, imgs, ...props}) {
  return (
    <Suspense
    maxDuration={1000}
    fallback={<img src={imgs.slice(-1).url} />}
    >
      <Img src={imgs[0].url} />
      <span>{name}</span>
    </Suspense>
  )  
}
