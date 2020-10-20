import React from 'react'
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'

class UserMaps extends React.Component{

state = {
    canvasRef2: React.createRef(),
    modal: false,
    run: false,
    color: 'green',
    tileW: 10,
    tileH: 10,
    mapDim: 25,
    mapH: 25,
    gameMap: new Array(2500).fill(0),
    counter: 0
    }

    prevMap = () => {
      if (this.state.counter === 0){
        let allMaps = this.props.user.maps
        const newCounter = allMaps.length-1
        this.setState({counter: newCounter, gameMap: this.props.user.maps[newCounter].position}, console.log(this.state.counter))
      }
      else{
  
        this.setState({counter: --this.state.counter}, this.setState({gameMap: this.props.user.maps[this.state.counter].position}))
      }
    }

    nextMap = () => {
      if (this.state.counter === this.props.user.maps.length - 1){
        this.setState({counter: 0, gameMap: this.props.user.maps[0].position}, console.log(this.state.counter))
      }
      else{
        this.setState({counter: ++this.state.counter}, this.setState({gameMap: this.props.user.maps[this.state.counter].position}))
      }
    }

    mapSelect = () => {
      this.props.changeMap(this.state.gameMap)
    }


    drawGame = () => {
        const preCtx = this.state.canvasRef2
        console.log("here:", preCtx)
        if(preCtx.current==null) { return; }
        const ctx = this.state.canvasRef2.current.getContext('2d')
        ctx.font = "bold 10pt sans-serif"
        
        for(var y = 0; y < this.state.mapDim; ++y)
        {
          for(var x = 0; x < this.state.mapDim; ++x)
          {
            switch(this.state.gameMap[((y*this.state.mapDim)+x)])
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
                requestAnimationFrame(this.drawGame)
                console.log(this.props)
     
    
        return (
            <>
            <ModalBody>
               <canvas ref={this.state.canvasRef2} width="250" height="250"/>
            </ModalBody>
            <ModalFooter id="buttons_container">
              <div id="nav_buttons">
                <a href="#" onClick={this.prevMap} class="previous round">&#8249;</a>
                <a href="#" onClick={this.nextMap}class="next round">&#8250;</a>
              </div>
              <div id="select_container">
                <button id="select_button" onClick={this.mapSelect}>Select</button>
              </div>
            </ModalFooter>
            </>
      
        )
    }
}

export default UserMaps