import React, { Suspense } from 'react'
import { unstable_createResource as createResource } from 'react-cache'
import { Spinner } from '../spinner'
import { Img } from '../img'
import { fakeFetchArtists } from '../../api'
import { useAccordion, combineReducers, single, preventClose} from '../../accordion/hook-accordion'
import './HomePage.css'

const ArtistResource = createResource(fakeFetchArtists)

function HomePage (props) {
  const {openIndexes, getButtonProps} = useAccordion(combineReducers(single, preventClose))
  const artists = ArtistResource.read()
  const onClick = () => {
    console.log('user defined onClick')
  }
  return (
    <div className="homePage">
      <Artists>
        {artists.map((artist, index) => (
           <Artist name={artist.name} key={artist.id} imgs={artist.images} {...getButtonProps({onClick, index})} />
        ))}
      </Artists>
      <ArtistPanels activeIndex={openIndexes[0]}>
        <Drake></Drake>
        <Eminem></Eminem>
        <Kanye></Kanye>
      </ArtistPanels>
    </div>
  )
}

function Drake () {
  return (
    <div>Drake</div>
  )
}
function Eminem () {
  return (
    <div>Eminem</div>
  )
}
function Kanye () {
  return (
    <div>Kanye</div>
  )
}

const Artists = ({children, ...props}) => (
  <div className="artists" {...props}>
    {children}
  </div>
) 

const Artist = ({name, imgs, ...props}) => (
  <Suspense
  maxDuration={1000}
  fallback={<img src={imgs.slice(-1).url} />}
  >
    <div className="artist">
      <Img className="artistImg" src={imgs[0].url} {...props}/>
      <span className="artistName">{name}</span>
    </div>
  </Suspense>
)  

const ArtistPanels = ({activeIndex, children, ...props}) => (
  <div className="artistPanels" {...props}>
    {children[activeIndex]}
  </div>
)


export default HomePage
