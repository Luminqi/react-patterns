import React from 'react'
import { Accordion as BaseAccordion} from './base-accordion'
import { single, preventClose, combineReducers } from './reducers'
import './accordion.css'

export class Accordion extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      randNum: 1
    }
  }
  onStateChange = (changes, stateAndHelpers) => {
    this.setState({
      randNum: Math.floor(Math.random()*3)
    })
  }
  onClick = () => {
    console.log('user defined onClick')
  }
  render () {
    return (
      <BaseAccordion
        openIndexes={[this.state.randNum]}
        onStateChange={this.onStateChange}
        stateReducer={combineReducers(single, preventClose)}
        {...this.props}
      >
        {
          ({openIndexes, getButtonProps}) => (
            <div>
              {items.map((item, index) => (
                <AccordionItem key={item.title} direction='vertical'>
                  <AccordionButton {...getButtonProps({onClick: this.onClick,  index})}>
                    {item.title}
                  </AccordionButton>
                  <AccordionContent isOpen={openIndexes.includes(index)}>
                    {item.contents}
                  </AccordionContent>
                </AccordionItem>
              ))
              }
            </div>
          )
        }
      </BaseAccordion>
    )
  }
}


// export function Accordion ({items, ...props}) {
//   const onClick = () => {
//     console.log('user defined onClick')
//   }
//   return (
//     <BaseAccordion stateReducer={combineReducers(single, preventClose)} {...props}>
//       {
//         ({openIndexes, getButtonProps}) => (
//           <div>
//             {items.map((item, index) => (
//               <AccordionItem key={item.title} direction='vertical'>
//                 <AccordionButton {...getButtonProps({onClick, index})}>
//                   {item.title}
//                 </AccordionButton>
//                 <AccordionContent isOpen={openIndexes.includes(index)}>
//                   {item.contents}
//                 </AccordionContent>
//               </AccordionItem>
//             ))
//             }
//           </div>
//         )
//       }
//     </BaseAccordion>
//   )
// }

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

function BaseTabs ({stateReducer = (state, changes) => changes, ...props}) {
  return (
    <BaseAccordion
      stateReducer={combineReducers(single, preventClose, stateReducer)}
      {...props}
    />
  )
}

export function Tabs ({items}) {
  return (
    <BaseTabs>
      {
        ({openIndexes, getButtonProps}) => (
          <div>
            <TabList>
              {
                items.map((item, index) => (
                  <Tab key={index} {...getButtonProps({index})}>
                    {item.title}
                  </Tab>
                ))
              }
            </TabList>
            <TabPanels activeIndex={openIndexes[0]}>
              {
                items.map((item, index) => (
                  <TabPanel key={index}>
                    {item.contents}
                  </TabPanel>
                ))
              }
            </TabPanels>
          </div>
        )
      }
    </BaseTabs>
  )
}

const TabList = ({children, ...props}) => (
  <div className="tabList" {...props}>
    {children}
  </div>
) 
  

const Tab = ({children, ...props}) => (
  <div className="tab" {...props}>
    {children}
  </div>
)

const TabPanels = ({activeIndex, children, ...props}) => (
  <div className="tabPanels" {...props}>
    {children[activeIndex]}
  </div>
)

const TabPanel = ({children, ...props}) => (
  <div className="tabPanel" {...props}>
    {children}
  </div>
)