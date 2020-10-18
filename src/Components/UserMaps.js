import React from 'react'
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'

class UserMaps extends React.Component{

state = {
    canvasRef2: React.createRef(),
    modal: false,
    run: false,
    initialMap: new Array(100).fill(0),
    color: 'green',
    tileW: 10,
    tileH: 10,
    mapW: 25,
    mapH: 25,
    gameMap: this.props.user.user.maps[2].position
    
    }

    drawGame = () => {
        const preCtx = this.state.canvasRef2
        console.log("here:", preCtx)
        if(preCtx.current==null) { return; }
        const ctx = this.state.canvasRef2.current.getContext('2d')
        ctx.font = "bold 10pt sans-serif"
        
        for(var y = 0; y < this.state.mapH; ++y)
        {
          for(var x = 0; x < this.state.mapW; ++x)
          {
            switch(this.state.gameMap[((y*this.state.mapW)+x)])
            {
              case 0:
                ctx.fillStyle = "gray";
                break;
                default:
                  ctx.fillStyle = "yellow";
                }
                ctx.fillRect( x*this.state.tileW, y*this.state.tileH, this.state.tileW, this.state.tileH);
                ctx.lineWidth = 2
                ctx.strokeRect( x*this.state.tileW, y*this.state.tileH, this.state.tileW, this.state.tileH);
                ctx.strokeStyle = "black";
              }
            }
            ctx.fillStyle = "#ff0000";
            ctx.strokeStyle="black"
            // requestAnimationFrame(this.drawGame);
          }

          toggle = () => {
            this.setState({modal: !this.state.modal})
          }
    
          
          
          
          render(){  
              console.log("this:", this.props.user.user.maps)
                requestAnimationFrame(this.drawGame)
     
    
        return (
            <>
            <ModalBody>
               <canvas ref={this.state.canvasRef2} width="250" height="250"/>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
            </>
      
        )
    }
}

export default UserMaps