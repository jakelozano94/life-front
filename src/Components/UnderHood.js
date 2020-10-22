

import React from 'react';
import image1 from '../images/basic_kernel_and_board.jpg'
import { ModalBody, ModalFooter, UncontrolledCarousel } from 'reactstrap';

const items = [
  {
    src: image1,
    key: '1'
  },
  {
    src: require('../images/board_to_array.png'),
    key: '2'
  },
  {
    src: require('../images/convo_cycle (1).png'),
    key: '3'
  }
];

const UnderHood = () => {
return (
    <ModalBody>
        <UncontrolledCarousel controls={false} interval={false} items={items} />
    </ModalBody>  
)}

export default UnderHood;