import React, { useState, useEffect } from "react"
import axios from "axios"


const AuthContext = React.createContext()

const API_URL = process.env.REACT_APP_API_URL

//--------------------------------------------------------------------------------------------------------------------------

function AuthProviderWrapper(props) {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState({})


  const storedToken = (token) => {
    localStorage.setItem("authToken", token)
  }

  const authenticateUser = () => {

    const storedToken = localStorage.getItem("authToken")

    if (storedToken) {

      axios

        .get(`${API_URL}/userverify`, { headers: { Authorization: `Bearer ${storedToken}` } }) //this verifies the user

        .then((response) => {
          // If the server verifies that the JWT token is valid
          const user = response.data
          console.log(response.data)
          // Update state variables
          setIsLoggedIn(true)
          setIsLoading(false)
          setUser(user)
        })
        .catch((error) => {
          // If the server sends an error response (invalid token)
          // Update state variables
          console.error(error)
          setIsLoggedIn(false)
          setIsLoading(false)
          setUser({})
        })
    } 
    
    else {
      // If the token is not available (or is removed)
      setIsLoggedIn(false)
      setIsLoading(false)
      setUser({})
    }
  }

  const removeUserToken = () => {
    localStorage.removeItem("authToken")
  }



  const logOutUser = () => {
    if (user) {
      removeUserToken()
      authenticateUser()
    } 
  }

  useEffect(() => {
    authenticateUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storedToken,
        authenticateUser,
        logOutUser,
      }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthProviderWrapper, AuthContext }