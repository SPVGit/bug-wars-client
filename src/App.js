

import { Route, Routes, useLocation} from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import IsAnon from "./components/IsAnon"
import IsPrivate from "./components/IsPrivate"
import BugWarsPage from './pages/BugWarsPage';
import HomePage from './pages/HomePage';
import Home from './pages/Home';
import AccountsPage from "./pages/AccountsPage"
import PWResetPage from "./pages/PWResetPage"
import PWResetEmail from "./pages/PWResetEmail"
import EmailSubmit from "./pages/EmailSubmit"
import { useState, useEffect } from "react"
import { AuthContext } from "./context/auth.context"

//--------------------------------------------------------------------------------------------------------------------------



function App() {


 /* function allStorage() {

    var archive = [],
        keys = Object.keys(localStorage),
        i = 0, key;
  
    for (; key = keys[i]; i++) {
        archive.push( key + '=' + localStorage.getItem(key));
    }
  
    return archive;
  }*/

  const [notification, setNotification] = useState({msgRcvd:false, sender:''})
  

  const collectNotification = (senderId) =>{

      setNotification({msgRcvd:true, sender:senderId})
      localStorage.setItem(`${senderId}notification`, JSON.stringify({msgRcvd:true, sender:senderId}))
      
  }

  const switchOffNotification = (senderId) => {
   
    setNotification({msgRcvd:false, sender:senderId})
    localStorage.removeItem(`${senderId}notification`)
   
  }



  return (
    <div className="App">

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <Home />}
        />



        <Route
          path="/signup"
          element={ 
            <IsAnon>
              <SignUpPage />
            </IsAnon>
          }
        />

        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />
        <Route
          path="/passwordresetpage/:userId/:userToken"
          element={
            <IsAnon>
              <PWResetPage />
            </IsAnon>

          }
        />

        <Route
          path="/passwordresetemail"
          element={
            <IsAnon>
              <PWResetEmail />
            </IsAnon>

          }
        />

        <Route
          path="/emailsubmit"
          element={
            <IsAnon>
              <EmailSubmit />
            </IsAnon>

          }
        />

        <Route
          path="/home"
          element={ //Before Login
            <IsPrivate>
              <HomePage notification={notification} switchOffNotification={switchOffNotification}/>
            </IsPrivate>}
        />
       {/* <Route
          path="/bugwars"
          element={
            <IsPrivate>
              <BugWarsPage />
            </IsPrivate>}
        />*/}

        <Route
          path="/accounts/:userId"
          element={
            <IsPrivate>
              <AccountsPage />
            </IsPrivate>}
        />

        <Route
          path="/bugwars/:gameId/:opponentId/:thisUserId"
          element={
            <IsPrivate>
              <BugWarsPage collectNotification={collectNotification} switchOffNotification={switchOffNotification} />
            </IsPrivate>}
        />


      </Routes>

    </div>
  );
}

export default App;
