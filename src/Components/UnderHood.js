

import React from 'react';
import image1 from '../images/basic_kernel_and_board.jpg'
import { ModalBody, ModalFooter, UncontrolledCarousel } from 'reactstrap';

const items = [
  {
    src: image1,
    key: '1'
  },
  {
    src: 'https://media1.giphy.com/media/uHaZa235y80ZIU1LGF/giphy.gif',
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