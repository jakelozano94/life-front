import React from 'react'
import { isDOMComponent } from 'react-dom/test-utils'
import * as tf from '@tensorflow/tfjs'





class Canvas extends React.Component{
  
  state = {
    initialMap: new Array(100).fill(0),
    color: 'green',
    tileW: 10,
    tileH: 10,
    mapW: 10,
    mapH: 10,
    currentSecond: 0,
    frameCount: 0,
    framesLastSecond: 0,
    gameMap: new Array(100).fill(0)
    
  }

  isDOMComponent(){
    let newArray = new Array(10000).fill(0)
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
    console.log(row, column)
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
    
    let input = tf.tensor3d(this.state.gameMap, [10, 10, 1])
    let filter =  tf.tensor4d([1, 1, 1, 1, .5, 1, 1, 1, 1], [3, 3, 1, 1])
    let strides = [1, 1, 1, 1]
    let padding = 'same'
    
  
  let op = tf.conv2d(input, filter, strides, padding).arraySync().flat(2)
  let final = op.map(x => 
    {return x >= 2.5 && x<=3.5 ? 1: 0})
    this.setState({gameMap: final})
    }

  
  

  
  // componentDidMount(){
  //   this.updateCanvas()
  //   requestAnimationFrame(drawGame)
  // }
  
  
  render(){
  
  let drawGame = () => {
    var tileW = 10, tileH = 10;
    var mapW = 10, mapH = 10;
    var currentSecond = 0, frameCount = 0, framesLastSecond = 0;

    const ctx = this.refs.canvas.getContext('2d')
    ctx.font = "bold 10pt sans-serif"
    if(ctx==null) { return; }
    
    var sec = Math.floor(Date.now()/1000);
    if(sec!=currentSecond)
    {
      currentSecond = sec;
      framesLastSecond = frameCount;
      frameCount = 1;
    }
    else { frameCount++; }
    
    for(var y = 0; y < mapH; ++y)
    {
      for(var x = 0; x < mapW; ++x)
      {
        switch(this.state.gameMap[((y*mapW)+x)])
        {
          case 0:
            ctx.fillStyle = "gray";
            break;
            default:
              ctx.fillStyle = "black";

            }
            
            ctx.fillRect( x*tileW, y*tileH, tileW, tileH);
            ctx.lineWidth = 2
            ctx.strokeRect( x*tileW, y*tileH, tileW, tileH);
            ctx.strokeStyle = "black";

          }
        }
        
        ctx.fillStyle = "#ff0000";
                      ctx.strokeStyle="black"

        ctx.fillText("FPS: " + framesLastSecond, 10, 20);
        
        requestAnimationFrame(drawGame);
      }

      requestAnimationFrame(drawGame)
      

    return (
      <>
      <canvas id="canvas" onClick = {this.clickHandler} ref="canvas" width={100} height={100}/>
      <button onClick={() => setInterval(this.runGame, 1000)}>Start</button>
      <button onClick={() => clearInterval()}>Stop</button>
      <button onClick={this.resetHandler}>Reset</button>

      </>
    )
  }
}
export default Canvas