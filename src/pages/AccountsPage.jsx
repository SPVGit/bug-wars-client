import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/auth.context"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"
import { Link } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"

import ImageUpload from "../components/ImageUpload"

const API_URL = process.env.REACT_APP_API_URL

function AccountsPage() {

    // const [picture, setPicture] = useState('')
    // const [username, setUsername] = useState('')
    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")

    const [detail, setDetail] = useState({})
    const [errorMessage, setErrorMessage] = useState(undefined)
    const [pwErrorMessage, setPwErrorMessage] = useState(undefined)
    const [emailMessage, setEmailMessage] = useState(undefined)
    const [validated, setValidated] = useState(false)

    const { user, logOutUser } = useContext(AuthContext)
    const { userId } = useParams()
    const navigate = useNavigate()

    const storedToken = localStorage.getItem("authToken")

    const getDetails = async () => {

        let response = await axios.get(`${API_URL}/accounts/${userId}`,
            { headers: { Authorization: `Bearer ${storedToken}` } })

        setDetail({
            username: response.data.username,
            email: response.data.email,
            password: "",
            picture: response.data.picture
        })
    }

    useEffect(() => {
        getDetails()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setDetail((userDetail) => ({ ...userDetail, [name]: value })) //this sets all changes in the form in the State

    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const requestBody = {
            username: detail.username,
            email: detail.email,
            password: detail.password
        }

        axios.put(`${API_URL}/accounts/${user._id}`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
            .then((response) => {
                setErrorMessage(undefined)
                setEmailMessage(undefined)
                setPwErrorMessage(undefined)
                if (response.data.errorMsg) {
                    setErrorMessage(response.data.errorMsg)
                }
                else if (response.data.pwErrorMsg) {
                    setPwErrorMessage(response.data.pwErrorMsg)
                }
                else if (response.data.emailMsg) {
                    setEmailMessage(response.data.emailMsg)
                }
                else {
                    navigate('/home')
                }

            })
            .catch(err => console.log(err))
    }


    return (
        <Container className="LoginPage text-center justify-content-center d-flex text-white" style={{ padding: '40px' }}>
            <div className="mw-75 text-center">
                <h1 className="mb-3">Edit your Profile Picture</h1>

                <ImageUpload />

                <h1 className="mt-3 mb-3" >Edit your Details</h1>
                <Form
                    style={{ padding: "40px", justifyContent: "center", display: "flex", flexDirection: "column" }}
                    noValidate
                    validated={validated}
                    className="border rounded"
                    onSubmit={handleSubmit}
                >
                    <Row
                        className="mb-3"
                        width="80vw">


                        <Form.Group>
                            <Form.Label className="label mt-2">Username</Form.Label>
                            <Form.Control
                                required
                                type="username"
                                name="username"
                                value={detail.username}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="label mt-2">Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                name="email"
                                value={detail.email}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        {emailMessage &&
                            <p className="error-message mt-2">{emailMessage}</p>}
                        <Form.Group>
                            <Form.Label className="label mt-2">Password</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control

                                    aria-describedby="inputGroupPrepend"
                                    required
                                    type="password"
                                    name="password"
                                    placeholder="Enter password to confirm change"
                                    value={detail.password}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        {pwErrorMessage && 
                        <p className="error-message mt-2">{pwErrorMessage}</p>}
                        {errorMessage &&
                            <div>
                                <p className="error-message mt-2">{errorMessage}</p>
                                <Link className='mt-3 text-white' onClick={logOutUser} to={'/passwordresetemail'}>Otherwise, please reset your password!</Link>
                            </div>}
                    </Row>
                    <Button
                        style={{ width: "100%", margin: "16px 0px" }}
                        variant="dark"
                        type="submit">
                        Save
                    </Button>



                </Form>
            </div>
        </Container>
    )
}

export default AccountsPage