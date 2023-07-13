
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Row from "react-bootstrap/Row"
import { Container } from "react-bootstrap"

import GoogleSignIn from "../components/GoogleSignIn"
import FacebookSignIn from "../components/FaceBookSignIn"

const API_URL = process.env.REACT_APP_API_URL

//--------------------------------------------------------------------------------------------------------------------------

function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState("")
  const [errorMsg, setErrorMessage] = useState(undefined)
  const [pwConMsg, setPwConMsg] = useState(undefined)
  const [emailMsg, setEmailMsg] = useState(undefined)
  const [pwMsg, setPwMsg] = useState(undefined)
  const [userMsg1, setUserMsg1] = useState(undefined)
  const [serverMsg, setServerMsg] = useState(undefined)
  const [validated, setValidated] = useState(false)

  const navigate = useNavigate()

  const handleEmail = (e) => setEmail(e.target.value)
  const handlePassword = (e) => setPassword(e.target.value)
  const handleConfirmPassword = (e) => setConfirmPassword(e.target.value)
  const handleName = (e) => setUsername(e.target.value)

  const handleUserLogin = () => {
    navigate("/login")
  }

  const handleSignupSubmit = (e) => {

    e.preventDefault()

    const requestBody = { email, password, username, confirmPassword }

    axios
      .post(`${API_URL}/signup`, requestBody) //sign up of users
      .then((response) => {
        console.log(response.data)
        navigate('/login')
      })
      .catch((error) => {
        if (error.response.data.msg) setErrorMessage(error.response.data.msg)
        else if (error.response.data.pwConMsg) setPwConMsg(error.response.data.pwConMsg)
        else if (error.response.data.emailMsg) setEmailMsg(error.response.data.emailMsg)
        else if (error.response.data.pwMsg) setPwMsg(error.response.data.pwMsg)
        else if (error.response.data.userMsg1) setUserMsg1(error.response.data.userMsg1)
        else if (error.response.data.serverMsg) setServerMsg(error.response.data.serverMsg)

        return;

      })

  }

  return (

    <Container className="d-flex justify-content-center">
      <div className="SignupPage fade-in text-center mw-75  ">
        <h1>
          Sign up to play<br />  Bug Wars!
        </h1>

        <Form
          style={{ padding: "0px 40px", justifyContent: "center", display: "flex", flexDirection: "column" }}
          noValidate
          validated={validated}
          onSubmit={handleSignupSubmit}>
          <Row
            className="mb-3"
            width="80vw">

            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustom01">
              <Form.Control
                className="mt-2"
                required
                placeholder="Your name"
                type="text"
                name="name"
                value={username}
                onChange={handleName}
              />

            </Form.Group>

            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustom02">
              <Form.Control
                className="mt-2"
                required
                placeholder="Your Email"
                type="email"
                name="email"
                value={email}
                onChange={handleEmail}
              />

            </Form.Group>

            <Form.Group
              as={Col}
              md="12"
              controlId="validationCustom03">
              <InputGroup hasValidation>
                <Form.Control
                  className="mt-2"
                  placeholder="Password"
                  aria-describedby="inputGroupPrepend"
                  required
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                />

              </InputGroup>

            </Form.Group>

            <Form.Group
              as={Col}
              md="12"
              controlId="validationCustom04">
              <InputGroup hasValidation>
                <Form.Control
                  className="mt-2"
                  placeholder="Confirm Password"
                  aria-describedby="inputGroupPrepend"
                  required
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPassword}
                />

              </InputGroup>
            </Form.Group>


          </Row>
          <Button
            variant="dark"
            type="submit">
            Sign Up
          </Button>
        </Form>

        <Container style={{ padding: "0px 40px 40px", justifyContent: "center", display: "flex", flexDirection: "column", textAlign: "center", gap: "8px" }}>
          <p className="mt-3">Already have account?</p>

          <Button
            variant="dark"
            type="submit"
            onClick={handleUserLogin}>
            Login
          </Button>

          {errorMsg && <p style={{ color: 'white' }}>{errorMsg}</p>}
          {pwConMsg && <p style={{ color: 'white' }}>{pwConMsg}</p>}
          {emailMsg && <p style={{ color: 'white' }}>{emailMsg}</p>}
          {pwMsg && <p style={{ color: 'white' }}>{pwMsg}</p>}
          {userMsg1 && <p style={{ color: 'white' }}>{userMsg1}</p>}
          {serverMsg && <p style={{ color: 'white' }}>{serverMsg}</p>}

          <div className="d-flex flex-column">
            <GoogleSignIn />
            <FacebookSignIn/> 
            
          </div>




        </Container>

      </div>

    </Container>

  )
}

export default SignupPage