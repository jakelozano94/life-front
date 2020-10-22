import "react-input-range/lib/css/index.css";
import React from 'react'
import ReactDom from 'react-dom'
import { isDOMComponent } from 'react-dom/test-utils'
import * as tf from '@tensorflow/tfjs'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonGroup, Container, Row, Col } from 'reactstrap'
import UserMaps from './UserMaps'
import MathModal from './Math'
import Explain from './Explain'
import InputRange from 'react-input-range'
import UnderHood from './UnderHood'




class Canvas extends React.Component{
  
  state = {
    time: 500,
    intervalId: null,
    canvasRef: React.createRef(),
    modal: false,
    modal2: false,
    mathModal: false,
    explainModal: false,
    run: false,
    initialMap: new Array(625).fill(0),
    color: 'green',
    tileW: 15,
    tileH: 15,
    mapDim: 50,
    size: 0,
    gameMap: new Array(625).fill(0),
    offColor: "#808080",
    onColor: "#FFFF00"
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
    this.setState({gameMap: this.props.user.maps[2].position})
  }

  componentDidMount(){
    console.log(this.state.canvasRef)
    let length = this.state.mapDim*this.state.mapDim
    let newArray = new Array(length).fill(0)
    this.setState({gameMap: newArray, size: this.state.mapDim})
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
    let index = (this.state.mapDim)*(row) + column
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
  
  clearBoard = () => {
    let size = this.state.mapDim * this.state.mapDim
    this.setState({gameMap: new Array(size).fill(0), run: false})
  }

  toggleExplain = () => {
    this.setState({explainModal: !this.state.explainModal}, console.log(this.state.explainModal))
  }

  toggleMath = () => {
    this.setState({mathModal: !this.state.mathModal}, console.log(this.state.mathModal))
  }

  toggle = () => {
    this.setState({modal: !this.state.modal})
  }

  toggle2 = () => {
    this.setState({modal2: !this.state.modal2})
  }

  handleBoardUpdate = () => {
    this.setState({mapDim: this.state.size, gameMap: new Array(this.state.size * this.state.size).fill(0)})
  }

  changeMap = (gameMap) => {
    let gameMapDim = Math.sqrt(gameMap.length)
    let oldGameMapDim = Math.sqrt(this.state.gameMap.length)
    let lenDiff = oldGameMapDim-gameMapDim
    if (lenDiff > 0){
    let pad = Math.floor(lenDiff/2)
    let gameMap2d = tf.tensor4d(gameMap, [1, gameMapDim, gameMapDim, 1])
    if (pad%2){
      let args = {
          padding: [pad, pad],
          inputShape: [1, gameMapDim, gameMapDim, 1]
      }
      let y = tf.layers.zeroPadding2d(args)
      let finalMap = y.apply(gameMap2d).arraySync().flat(3)
      this.setState({gameMap: finalMap})
    }else{
      let extraPad = pad + 1
      let args = {
         padding: [[pad, extraPad],[pad, extraPad]],
         inputShape: [1, gameMapDim, gameMapDim, 1]
       }
       let y = tf.layers.zeroPadding2d(args)
       let finalMap = y.apply(gameMap2d).arraySync().flat(3)
       console.log(finalMap)
       this.setState({gameMap: finalMap})
    }}else{
      this.setState({gameMap: gameMap, mapDim: gameMapDim})
    }
    this.toggle()
  }


  runGame = () => {

    
    console.log("run")
    let input = tf.tensor3d(this.state.gameMap, [this.state.mapDim, this.state.mapDim, 1])
    let filter =  tf.tensor4d([1, 1, 1, 1, .5, 1, 1, 1, 1], [3, 3, 1, 1])
    let last = this.state.mapDim - 1
    let strides = [1, 1, 1, 1]
    let padding = 'same'
    
    const a = tf.slice(input, [0], [-1, 1])
    const b = tf.slice(input, [0,last], [-1, 1])
    const right = tf.concat([input, a], 1)
    const left = tf.concat([b, right], 1)
    const c = tf.slice(left, [0,0], [1, -1])
    const d = tf.slice(left, [last], [1, -1])
    const bottom = tf.concat([left, c])
    const top = tf.concat([d, bottom])

    let i_mask = tf.ones([1,this.state.mapDim]).pad([[0,0],[1, 1]]);
    let bool = tf.cast(i_mask, 'bool')
    let x_bool = bool.reshape([-1,1]).squeeze()
    console.log("x_bool:", x_bool,"bool_mask:", bool, top)

    let op = tf.conv2d(top, filter, strides, padding)
    let op2 = op.squeeze()
    console.log("op:", op)
    tf.booleanMaskAsync(op,x_bool, 1)
    .then(data => tf.booleanMaskAsync(data, x_bool, 0))
    .then(data=>
          data.arraySync().flat(2).map(x => 
          {return x >= 2.5 && x<=3.5 ? 1: 0}))
    .then(data =>
          this.setState({gameMap: data}))
  }

  


    intervalHandler = () => {
      clearInterval(this.state.intervalId)
      if (this.state.run ){
        this.intervalId = setInterval(this.runGame, this.state.time)
        this.setState({intervalId: this.intervalId})
      }
    }

  
  runToggle = () => {
    this.setState({run: !this.state.run}, this.intervalHandler)
  }

  
  // componentDidMount(){
  //   this.updateCanvas()
  //   requestAnimationFrame(drawGame)
  // }
  drawGame = () => {
    console.log("draw")

    // this.setState({canvasRef: React.createRef})
    const preCtx = this.state.canvasRef.current
    if(preCtx==null) { return; }
    const ctx = this.state.canvasRef.current.getContext('2d')
    ctx.font = "bold 10pt sans-serif"
    
    for(var y = 0; y < this.state.mapDim; ++y)
    {
      for(var x = 0; x < this.state.mapDim; ++x)
      {
        switch(this.state.gameMap[((y*this.state.mapDim)+x)])
        {
          case 0:
            ctx.fillStyle = this.state.offColor;
            break;
            default:
              ctx.fillStyle = this.state.onColor;

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

      
      
      
      render(){ 
        requestAnimationFrame(this.drawGame)
    return (
      <>
      <div id="game_board">
        <Modal centered={true} isOpen={this.state.modal} toggle={this.toggle}>
           <UserMaps changeMap= {this.changeMap} user = {this.props.user} />
        </Modal>
        <Modal size="lg" isOpen={this.state.explainModal} toggle={this.toggleExplain}>
            <Explain/>
        </Modal>
        <Modal isOpen={this.state.mathModal} toggle={this.toggleMath}>
          <MathModal/>
        </Modal>
        <Modal centered={true} isOpen={this.state.modal2} toggle={this.toggle2}>
          <UnderHood/>
        </Modal>

        <ButtonGroup vertical>
          <Button onClick={this.toggle2}>Under the Hood</Button>
          <Button onClick ={this.toggleExplain}>Whats the Game of Life?</Button>
        </ButtonGroup>
        <canvas id="main_canvas" onClick = {this.clickHandler} ref={this.state.canvasRef} width={this.state.mapDim*this.state.tileW} height={this.state.tileH*this.state.mapDim}/>
      <div id="range-cont">
        <div>
          <label id="slider-on-label">ALIVE</label>
          <label id="slider-off-label">DEAD</label>
        </div>
        <div id="color-cont">
          <input
           onChange={(e)=>this.setState({onColor: e.target.value})}
           type="color" value={this.state.onColor} id="on-color"/>
          <input
           onChange={(e)=>this.setState({offColor: e.target.value})}
          type="color" value={this.state.offColor} id="off-color"/>
        </div>
    
        <label id="slider-label">Board Size</label>
          <InputRange
            formatLabel={value => `${value}`}
            minValue={20}
            maxValue={50}
            value={this.state.size}
            onChange={size => this.setState({ size })}
            onChangeComplete={this.handleBoardUpdate} />

        <label id="slider-label">Interval</label>
        <InputRange
          formatLabel={value => `${value}`}
          minValue={10}
          maxValue={1000}
          value={this.state.time}
          onChange={time => this.setState({ time }, this.intervalHandler)}
          />
      </div>
      </div>
      <div class="multi-button">
          <button onClick={this.runToggle}>{this.state.run ? "Stop" : "Start"}</button>
          <button onClick={this.runGame}>Step</button>
          <button onClick={this.resetHandler}>Reset</button>
          <button onClick={this.clearBoard}>Clear</button>
          <button style={{display: this.props.user == undefined ? 'none' : 'block'}} onClick={this.saveInitial}>Save</button>
          <button style={{display: this.props.user == undefined ? 'none' : 'block'}} onClick={this.toggle}>Saved Maps</button>
        </div>

        </>
    )
  }
}
export default Canvas
