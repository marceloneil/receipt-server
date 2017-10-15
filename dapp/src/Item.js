import React from 'react'
import { Icon, Label, Segment } from 'semantic-ui-react'

const Quantity = (props) => {
  if (props.quantity > 0) {
    return <Label color='green' floating>{props.quantity}</Label>
  } else {
    return null
  }
}

const Item = (props) => {
  return (
    <Segment>
      {props.name} - {props.price} eth
      <Icon name="plus" link className='plus-minus' size='large' onClick={props.handleAdd} />
      <Icon name="minus" link={props.quantity > 0} disabled={props.quantity < 1} className='plus-minus' size='large' onClick={props.handleRemove} />
      <Quantity quantity={props.quantity} />
    </Segment>
  )
}

export default Item