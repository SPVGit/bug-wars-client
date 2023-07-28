
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useNavigate } from "react-router-dom"
import { Card } from 'react-bootstrap';
import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import axios from 'axios';

const FACEBOOK_ID = process.env.REACT_APP_FACEBOOK_ID //Facebook APP ID
const API_URL = process.env.REACT_APP_API_URL //Server URL
const FB_EMAIL = process.env.REACT_APP_FACEBOOK_EMAIL //Placeholder Email


function FacebookSignIn() {

  const navigate = useNavigate()

  const { storedToken, authenticateUser } = useContext(AuthContext)

  const responseFacebook = (response) => {

    console.log(response)

    if (response.accessToken) {

      const fbUser = response

      function create_UUID() {

        var dt = new Date().getTime()
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0
          dt = Math.floor(dt / 16)
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
        })
        return uuid

      }

      const requestBody = { email: FB_EMAIL, password: create_UUID(), username: fbUser.name, picture: fbUser.picture.data.url, route: 'Facebook' }

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
    <div>

      <div className='d-flex justify-content-center rounded border p-2 col-md-12 col-sm-12 col mt-2'>

        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="btn btn-primary bi bi-facebook col-md-2 col-sm-2 col-3" viewBox="0 0 16 16">
          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
        </svg>

        <FacebookLogin
          appId={FACEBOOK_ID}
          autoLoad={false}
          fields="name,email,picture"
          scope="public_profile,user_friends"
          callback={responseFacebook}
          render={renderProps => (
            <button className='bg-light border col-md-10 col-sm-10 col-9 rounded' onClick={renderProps.onClick} style={{fontSize:14, fontWeight:'bold'}}>Facebook Log In</button>
          )}
        />

      </div>

    </div>

  );
}

export default FacebookSignIn