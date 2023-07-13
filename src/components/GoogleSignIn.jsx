import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import jwt_decode from 'jwt-decode'
import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import axios from "axios"



const API_URL = process.env.REACT_APP_API_URL //Server URL
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID //Google Client ID
const GOOGLE_PW = process.env.REACT_APP_GOOGLE_PW //Placeholder password 

//--------------------------------------------------------------------------------------------------------------------------

function GoogleSignIn() {

    const navigate = useNavigate()

    const { storedToken, authenticateUser } = useContext(AuthContext)

    function handleGoogleCallbackResponse(res) {

        let userObj = jwt_decode(res.credential)

        const requestBody = { email: userObj.email, password: GOOGLE_PW, username: userObj.given_name, picture: userObj.picture, route:'Google' }

        axios
            .post(`${API_URL}/altsignup`, requestBody)
            .then((response) => {
                console.log(response.data)
                storedToken(response.data.authToken)
                authenticateUser()
                navigate('/home')
            })
            .catch((error) => {
                console.log(error)
                return;
            })

    }

    useEffect(() => {

        /* global google */
        google.accounts.id.initialize({
            client_id: `${CLIENT_ID}`,
            callback: handleGoogleCallbackResponse
        })
        google.accounts.id.renderButton(document.getElementById('signInDiv'),
            { size:'large' })

    }, [])

    return (
        <div  variant="outline" id='signInDiv' className='d-flex justify-content-center rounded border p-3 col-md-12' > 

        </div>
    )
}

export default GoogleSignIn