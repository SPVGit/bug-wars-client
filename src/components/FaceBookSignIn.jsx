
import FacebookLogin from 'react-facebook-login';
import { useNavigate } from "react-router-dom"
import { Card, Image } from 'react-bootstrap';
import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import axios from 'axios';

const APP_ID = process.env.REACT_APP_FACEBOOK_ID //Facebook APP ID
const API_URL = process.env.REACT_APP_API_URL //Server URL
const FB_PW = process.env.REACT_APP_FACEBOOK_PW //Placeholder password
const FB_EMAIL = process.env.REACT_APP_FACEBOOK_EMAIL //Placeholder Email


function FacebookSignIn(){

 const navigate = useNavigate()

 const { storedToken, authenticateUser } = useContext(AuthContext)

  const responseFacebook = (response) => {

    console.log(response)

    if(response.accessToken){

    const fbUser = response
    const requestBody = { email: FB_EMAIL, password: FB_PW, username: fbUser.name, picture:fbUser.picture.data.url, route:'Facebook' }

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
  
  }


  return (
    <div className='d-flex justify-content-center rounded border p-2 col-md-12 mt-2'>
        
        <Card >
          
            <FacebookLogin
              appId={APP_ID}
              autoLoad={false}
              fields="name,email,picture"
              scope="public_profile,user_friends"
              callback={responseFacebook}
              icon="fa-facebook" 
              />
            
        </Card>
  
    </div>
  );
}

export default FacebookSignIn