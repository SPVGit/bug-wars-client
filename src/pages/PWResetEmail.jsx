


import { useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"



const API_URL = process.env.REACT_APP_API_URL

//--------------------------------------------------------------------------------------------------------------------------

const PWResetEmail = () => {

  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [validated, setValidated] = useState(false)

  const navigate = useNavigate()


  const handleEmail = (e) => setEmail(e.target.value)

  const handleEmailSubmit = (e) => {

    e.preventDefault()

    const requestBody = { email }

    axios
      .post(`${API_URL}/passwordresetemail`, requestBody)
      .then((response) => {
        navigate("/emailsubmit") 

      })
      .catch((error) => {

        const errorDescription = error.response.data.message
        setErrorMessage(errorDescription)

      })

  }

  return (

    <Container className="LoginPage text-center justify-content-center d-flex text-white">
      <div className="mw-75 text-center">
        <h1 >Receive password reset link in your email</h1>

        <Form
          style={{ padding: "40px", justifyContent: "center", display: "flex", flexDirection: "column" }}
          noValidate
          validated={validated}
          onSubmit={handleEmailSubmit}>
          <Row
            className="mb-3"
            width="80vw">
         
            <Form.Group>
              <Form.Label className="label ">Email</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  placeholder="Email"
                  aria-describedby="inputGroupPrepend"
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmail}
                />
                <Form.Control.Feedback type="invalid">Please enter a valid email.</Form.Control.Feedback>
              </InputGroup>

            </Form.Group>
            
          </Row>
          <Button
            style={{ width: "100%", margin: "16px 0px" }}
            variant="dark"
            type="submit">
            Submit
          </Button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

     


        </Form>
      </div>
    </Container>

  )
}

export default PWResetEmail;