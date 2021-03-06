import React, {useEffect, useState} from 'react';
import Canvas from './Components/Canvas'
import Login from './Components/Login'
import { Button, Container, Row, Col } from 'reactstrap'
import './App.css';
import './App.scss'
import Social from './Components/Social'

function App() {

  const [user, setUser] = useState(null);

  
  const token = localStorage.getItem("token")
  
 
  const logInHandler = (userObj = null) =>{
    console.log(token)
    if (token == "undefined" || token == null){
        if(userObj){
          fetch("https://game-of-tensorflow.herokuapp.com/api/v1/login", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              accept: "application/json"
            },
            body: JSON.stringify({ user: userObj })
          })
          .then(r => r.json())
          .then(data => {
            localStorage.setItem("token", data.jwt)
            setUser(data.user)
            console.log(data.user)
          })
        }
    }else{
      fetch("https://game-of-tensorflow.herokuapp.com/api/v1/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`}
      })
      .then(r => r.json())
      .then(data => setUser(data.user))
      .then(() => console.log("logged in as:", {user}))
    }
  }

  useEffect(()=>{
    logInHandler()
  },[])

  let handleLogout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }





  return (
    <>
    <div id="container">
        <Canvas user={user}/>
        <Login user={user} handleLogout={handleLogout} login={logInHandler} />
    </div>
        <Social/>
        </>
  );
}

export default App;
