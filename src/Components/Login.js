import React, { useState } from 'react'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { Popover, PopoverHeader, PopoverBody, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'

const Login = (props) => {
    
    const [modal, setModal] = useState(false);
    const [popOpen, setpopOpen] = useState(false)

     let handleValidSubmit = (event, values) => {
        let username = values.username
        let password = values.password
        let userObj = {
            username: username,
            password: password
        }
        signupHandler(userObj)
        setModal(false)
    }

    

   let signupHandler = (userObj) => {
       console.log(userObj)
        fetch("http://localhost:3000/api/v1/users", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accepts: "application/json"
          },
          body: JSON.stringify({ user: userObj })
        })
          .then(resp => resp.json())
          .then(data => {
            localStorage.setItem("token", data.jwt)
            props.login(userObj)
          })
          .catch(function (error) {
            props.login(userObj)
            setpopOpen(true)
          })
      }

    
    
    
      return (
        <div id="login-cont">
            {props.user != null ? 
            <button id="log-button" color="danger" onClick={props.handleLogout}>Logout</button>
            :
            <button id="log-button" color="primary" onClick={() => {setModal(!modal)}}>Login</button>
            
            }
            <Modal className="login-modal" isOpen={modal} size ='sm' toggle={() => {setModal(!modal)}}>
                <ModalHeader toggle={() => {setModal(!modal)}}>Please Login</ModalHeader>
                <ModalBody>
                <AvForm onValidSubmit={handleValidSubmit}>
                <AvField name="username" label="Username" type="text" errorMessage="Invalid name" validate={{
                      required: {value: true, errorMessage: 'Please enter a name'}
                    }} />
               <AvField name="password" label="Password" type="password" errorMessage="Invalid password" validate={{
                    required: {value: true, errorMessage: 'Please enter a password'}
                }} />
                    {/* <Popover placement="bottom" isOpen={popOpen} target="Popover2" toggle={() => {setModal(!modal)}}>
                        <PopoverHeader>Try Again!</PopoverHeader>
                        <PopoverBody>Username or password is Incorrect </PopoverBody>
                    </Popover> */}
                <Button id="Popover2" color="primary">Submit</Button>

                    </AvForm>
                </ModalBody>
            </Modal>
        </div>
    )
    }

      export default Login
