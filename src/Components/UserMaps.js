import React from 'react'
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'

class UserMaps extends React.Component{

state = {
    user: null,
    canvasRef2: React.createRef(),
    modal: false,
    run: false,
    color: 'green',
    tileW: 15,
    tileH: 15,
    mapDim: 25,
    mapH: 25,
    gameMap: new Array(625).fill(0),
    counter: 0
    }

    componentDidMount(){
      const token = localStorage.getItem("token")

      fetch("http://localhost:3000/api/v1/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`}
      })
      .then(r => r.json())
      .then(data => this.setState({user: data}, ))
      .then(() => {if(this.state.user.user.maps.length > 0){
        this.setState({gameMap: this.state.user.user.maps[0].position})}})
      .then(() => console.log("logged in as:", this.state.user))
    }

    prevMap = () => {
      if(!this.state.user){
        return;
      }
      if(this.state.user.user.maps.length === 0){
        console.log("skip")
        return;
      }
      if (this.state.counter === 0){
        let allMaps = this.state.user.user.maps
        const newCounter = allMaps.length-1
        this.setState({counter: newCounter, gameMap: this.state.user.user.maps[newCounter].position}, console.log(this.state.counter))
      }
      else{
  
        this.setState({counter: --this.state.counter}, this.setState({gameMap: this.state.user.user.maps[this.state.counter].position}))
      }
    }

    nextMap = () => {
      if(!this.state.user){
        console.log("no user")
        return;
      }
      if(this.state.user.user.maps.length === 0){
        console.log("skip")
        return;
      }
      if (this.state.counter === this.state.user.user.maps.length - 1){
        this.setState({counter: 0, gameMap: this.state.user.user.maps[0].position}, console.log(this.state.counter))
      }
      else{
        this.setState({counter: ++this.state.counter}, this.setState({gameMap: this.state.user.user.maps[this.state.counter].position}))
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
        
        for(var y = 0; y < Math.sqrt(this.state.gameMap.length); ++y)
        {
          for(var x = 0; x < Math.sqrt(this.state.gameMap.length); ++x)
          {
            switch(this.state.gameMap[((y*Math.sqrt(this.state.gameMap.length))+x)])
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
               <canvas ref={this.state.canvasRef2} width={Math.sqrt(this.state.gameMap.length)*this.state.tileW} height={this.state.tileH*Math.sqrt(this.state.gameMap.length)}/>
            </ModalBody>
            <ModalFooter id="buttons_container">
              <div id="nav_buttons">
                <button onClick={this.prevMap}>&#8249;</button>
                <button onClick={this.nextMap}>&#8250;</button>
              </div>
              <div id="select_buttons">
                <button onClick={this.mapSelect}>Select</button>
              </div>
            </ModalFooter>
            </>
      
        )
    }
}

export default UserMaps