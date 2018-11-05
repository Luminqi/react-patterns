import {
  ArtistsJSON,
  ArtistsListJSON,
  DrakeAlbums,
  EminemAlbums,
  KanyeAlbums,
  DrakeRelated,
  EminemRelated,
  KanyeRelated,
} from './data'

const token = ''

const fetch = (url, options) => {
  return window.fetch(
    `https://api.spotify.com/v1/${url}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      ...options
    }
  )
}

export async function fetchArtist (id) {
  const res = await fetch(`artists/${id}`)
  const result = await res.json()
  const { images, name} = result
  return {
    images,
    name,
    id
  }
}

export async function fetchArtists () {
  const res = await Promise.all(Object.keys(ArtistsJSON).map(key => {
    const id = ArtistsJSON[key].id
    return fetchArtist(id)
  }))
  return res 
}

export async function fetchArtistAlbums (id) {
  const res = await fetch(`artists/${id}/albums`)
  return (await res.json()).items.map(album => {
    const { images, name, release_date } = album
    return {
      images,
      name,
      release_date
    }
  })
}

export async function fetchArtistRelated (id) {
  const res = await fetch(`artist/${id}/related-artists`)
  return (await res.json()).artists.map(related => {
    const { images, name } = related
    return {
      images,
      name
    }
  })
} 

const delay = 2000

export function fakeFetchArtists () {
  return new Promise(resolve => setTimeout(resolve(ArtistsListJSON), delay))
}

export function fakeFetchDrakeAlbums () {
  return new Promise(resolve => setTimeout(resolve(DrakeAlbums), delay))
}

export function fakeFetchEminemAlbums () {
  return new Promise(resolve => setTimeout(resolve(EminemAlbums), delay))
}

export function fakeFetchKanyeAlbums () {
  return new Promise(resolve => setTimeout(resolve(KanyeAlbums), delay))
}

export function fakeFetchDrakeRelated () {
  return new Promise(resolve => setTimeout(resolve(DrakeRelated), delay))
}

export function fakeFetchEminemRelated () {
  return new Promise(resolve => setTimeout(resolve(EminemRelated), delay))
}

export function fakeFetchKanyeRelated () {
  return new Promise(resolve => setTimeout(resolve(KanyeRelated), delay))
}