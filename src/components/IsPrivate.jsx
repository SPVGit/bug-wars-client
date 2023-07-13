import { useContext } from "react"
import { AuthContext } from "../context/auth.context"

//--------------------------------------------------------------------------------------------------------------------------

function IsPrivate({ children }) {
  const { isLoading, isLoggedIn } = useContext(AuthContext)

  // If the authentication is still loading, then show the spinner

  if (isLoading) {
    return (
      <div className="outer-spinner-div">
        <div className="lds-default">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }  else if (isLoggedIn) {

    // If the user is logged in, allow to see the page
    return children
  }
 

}

export default IsPrivate