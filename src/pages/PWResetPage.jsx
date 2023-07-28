


import { useState, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"



const API_URL = process.env.REACT_APP_API_URL

//--------------------------------------------------------------------------------------------------------------------------

const PWResetPage= () => {

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [validated, setValidated] = useState(false)

  const navigate = useNavigate()

  var  { userId, userToken } = useParams();

  const handlePassword = (e) => setPassword(e.target.value)
  const handleConfirmPassword = (e) => setConfirmPassword(e.target.value)

  const handleResetSubmit = (e) => {

    e.preventDefault()

    const requestBody = { password, confirmPassword }

    axios
      .put(`${API_URL}/passwordresetpage/${userId}/${userToken}`, requestBody)
      .then((response) => {

        console.log(response)
        navigate("/login") 

      })
      .catch((error) => {

        const errorDescription = error.response.data.message
        setErrorMessage(errorDescription)

      })

  }

  return (

    <Container className="LoginPage text-center justify-content-center d-flex text-white">
      <div className="mw-75 text-center">
        <h1 >Enter New Password</h1>

        <Form
          style={{ padding: "40px", justifyContent: "center", display: "flex", flexDirection: "column" }}
          noValidate
          validated={validated}
          onSubmit={handleResetSubmit}>
          <Row
            className="mb-3"
            width="80vw">
         
            <Form.Group>
              <Form.Label className="label ">Password</Form.Label>
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
                <Form.Control.Feedback type="invalid">Please enter a valid password.</Form.Control.Feedback>
              </InputGroup>

            </Form.Group>
            <Form.Group
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

export default PWResetPage;