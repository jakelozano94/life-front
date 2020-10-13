import React from 'react'
import { isDOMComponent } from 'react-dom/test-utils'
import * as tf from '@tensorflow/tfjs'
import { Button, ButtonGroup, Container, Row, Col } from 'reactstrap'





class Canvas extends React.Component{
  
  state = {
    run: false,
    initialMap: new Array(100).fill(0),
    color: 'green',
    tileW: 10,
    tileH: 10,
    mapW: 25,
    mapH: 25,
    gameMap: new Array(625).fill(0)
    
  }

  saveInitial = () => {
    const token = localStorage.getItem("token")
    let array = this.state.initialMap
    fetch("http://localhost:3000/api/v1/maps", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
            accepts: "application/json"
          },
          body: JSON.stringify({ array: array })
        })
  }

  showMaps = () => {
    this.setState({gameMap: this.props.user.user? this.props.user.user.maps[2].position : this.props.user.maps[2].position})
  }

  componentDidMount(){
    let newArray = new Array(625).fill(0)
    this.setState({gameMap: newArray})

  }
  
  clickHandler = (e) => {
    
    let canvas = e.target
    let ctx = canvas.getContext("2d")
    let BB=canvas.getBoundingClientRect()
    let offsetX = BB.left
    let offsetY = BB.top
    e.preventDefault()
    e.stopPropagation()
    var mouseX=e.clientX-offsetX
    var mouseY=e.clientY-offsetY
    var column = parseInt(mouseX/this.state.tileW)
    var row = parseInt(mouseY/this.state.tileH)
    let index = (this.state.mapW)*(row) + column
    let newArray = this.state.gameMap
    newArray[index] == 0 ? newArray[index] = 1 : newArray[index] = 0
    this.setState({initialMap: newArray})
    //  this.setState({gameMap: newArray})
    // console.log(this.state.gameMap)
  
    // console.log(op)

  }

  resetHandler = (e) => {
    clearInterval()
    this.setState({gameMap: this.state.initialMap})
  }

  runGame = () => {
    
    let input = tf.tensor3d(this.state.gameMap, [25, 25, 1])
    let filter =  tf.tensor4d([1, 1, 1, 1, .5, 1, 1, 1, 1], [3, 3, 1, 1])
    let strides = [1, 1, 1, 1]
    let padding = 'same'
    
  
  let op = tf.conv2d(input, filter, strides, padding).arraySync().flat(2)
  let final = op.map(x => 
    {return x >= 2.5 && x<=3.5 ? 1: 0})
    this.setState({gameMap: final})
    }

    intervalHandler = () => {
      if (this.state.run){
        this.intervalId = setInterval(this.runGame, 1000)
      }else{
        clearInterval(this.intervalId)
      }
    }

  
  runToggle = () => {
    this.setState({run: !this.state.run}, this.intervalHandler)
  }

  
  // componentDidMount(){
  //   this.updateCanvas()
  //   requestAnimationFrame(drawGame)
  // }
  
  
  render(){
  
  let drawGame = () => {
    const ctx = this.refs.canvas.getContext('2d')
    ctx.font = "bold 10pt sans-serif"
    if(ctx==null) { return; }
    
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
        
        requestAnimationFrame(drawGame);
      }

      requestAnimationFrame(drawGame)
      

    return (
      <>
        <Row className="justify-content-md-center">
          
            <canvas id="canvas" onClick = {this.clickHandler} ref="canvas" width="250" height="250"/>
        
        </Row>
        <Row className="justify-content-md-center">
            <ButtonGroup id="game-buttons">
              <Button outline color= "info"   onClick={this.runToggle}>{this.state.run? "Stop" : "Start"}</Button>
              <Button outline color= "info"  onClick={this.resetHandler}>Reset</Button>
              <Button outline color= "info" style={{display: this.props.user == undefined ? 'none' : 'block'}} onClick={this.saveInitial}>Save</Button>
              <Button outline color= "info" style={{display: this.props.user == undefined ? 'none' : 'block'}} onClick={this.showMaps}>Saved Maps</Button>
            </ButtonGroup>
        </Row>
      </>
    )
  }
}
export default Canvas