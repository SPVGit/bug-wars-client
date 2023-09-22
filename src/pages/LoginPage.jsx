import { useState, useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { useNavigate, Link } from "react-router-dom"

import axios from "axios"

import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/esm/Card"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"

import GoogleSignIn from "../components/GoogleSignIn"
import FacebookSignIn from "../components/FaceBookSignIn"

const API_URL = process.env.REACT_APP_API_URL

//--------------------------------------------------------------------------------------------------------------------------

const LoginPage = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [validated, setValidated] = useState(false)

  const navigate = useNavigate()

  const { storedToken, authenticateUser } = useContext(AuthContext)

  const handleEmail = (e) => setEmail(e.target.value)
  const handlePassword = (e) => setPassword(e.target.value)

  const handleSignup = () => {
    navigate("/home")
  }

  const handleLoginSubmit = (e) => {

    e.preventDefault()

    const requestBody = { email, password }

    axios
      .post(`${API_URL}/login`, requestBody)
      .then((response) => {

        storedToken(response.data.authToken)
        authenticateUser()
        navigate("/home") 

      })
      .catch((error) => {
        if(error){
          const errorDescription = error.response.data.message
        setErrorMessage(errorDescription)
        }
        
      })

  }

  return (

    <Container className="LoginPage text-center justify-content-center d-flex text-white">
      <div className="mw-75 text-center">

        <h1 >Login to Play Bug Wars!</h1>

        <Card className='bg-transparent border border-white border-5 rounded p-1'>

        <Form
          style={{ padding: "40px", justifyContent: "center", display: "flex", flexDirection: "column" }}
          noValidate
          validated={validated}
          onSubmit={handleLoginSubmit}>
          <Row
            className="mb-3"
            width="80vw">
            <Form.Group>
              
              <Form.Control
                required
                placeholder="Your Email"
                type="email"
                name="email"
                value={email}
                onChange={handleEmail}
                className='mb-3'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              
              <InputGroup hasValidation>
                <Form.Control
                  placeholder="Password"
                  aria-describedby="inputGroupPrepend"
                  required
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                />
                <Form.Control.Feedback type="invalid">Please choose a valid password.</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Link className='mt-3 text-white' to={'/passwordresetemail'}>Forgot your password?</Link>
          </Row>
          <Button
            style={{ width: "100%", margin: "10px 0px" }}
            variant="dark"
            type="submit">
            Log in
          </Button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <p className="text-white">Don't have an account yet?</p>

          <Button
            className="mb-2"
            style={{ width: "100%" }}
            variant="dark"
            onClick={handleSignup}>
            {" "}
            Sign Up
          </Button>

          <GoogleSignIn/>
          <FacebookSignIn/>

        </Form>
        </Card>
      </div>
    </Container>

  )
}

export default LoginPage