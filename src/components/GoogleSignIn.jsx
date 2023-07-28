import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import jwt_decode from 'jwt-decode'
import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import axios from "axios"



const API_URL = process.env.REACT_APP_API_URL //Server URL
const GOOGLE_ID = process.env.REACT_APP_GOOGLE_ID //Google Client ID

//--------------------------------------------------------------------------------------------------------------------------

function GoogleSignIn() {

    const navigate = useNavigate()

    const { storedToken, authenticateUser } = useContext(AuthContext)

    function handleGoogleCallbackResponse(res) {

        let userObj = jwt_decode(res.credential)

        function create_UUID() {

            var dt = new Date().getTime()
            var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 16) % 16 | 0
                dt = Math.floor(dt / 16)
                return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
            })
            return uuid

        }

        const requestBody = { email: userObj.email, password: create_UUID(), username: userObj.given_name, picture: userObj.picture, route: 'Google' }

        axios
            .post(`${API_URL}/altsignup`, requestBody)
            .then((response) => {

                storedToken(response.data.authToken)
                authenticateUser()
                navigate('/home')

            })
            .catch((error) => {
                console.log(error)
                return;
            })

    }
    //document.getElementById('signInDiv')
    useEffect(() => {

        /* global google */

        google.accounts.id.initialize({
            client_id: `${GOOGLE_ID}`,
            callback: handleGoogleCallbackResponse
        })
        google.accounts.id.renderButton(document.getElementById('signInDiv'),
            { 'client_id': `${GOOGLE_ID}` })

    }, [])

    return (

        <div className='d-flex justify-content-center align-items-center rounded border p-2 col-md-12 col-sm-12 col'>

            <svg xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            fill="white" 
            viewBox="0 0 16 16" 
            className="col-3 col-sm-2 col-md-2 bi bi-google bg-dark rounded p-2">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
            <div id='signInDiv' className='d-flex justify-content-center align-items-center col-md-10 col-sm-10 col-9' >
                Sign in with Google

            </div>

        </div>

    )
}

export default GoogleSignIn