

import { Route, Routes } from "react-router-dom"

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

//--------------------------------------------------------------------------------------------------------------------------

function App() {

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
          element={ //After Login
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
          path="/home"
          element={ //Before Login
            <IsPrivate>
              <HomePage />
            </IsPrivate>}
        />
        <Route
          path="/bugwars"
          element={
            <IsPrivate>
              <BugWarsPage />
            </IsPrivate>}
        />

        <Route
          path="/accounts/:userId"
          element={
            <IsPrivate>
              <AccountsPage />
            </IsPrivate>}
        />

        <Route
          path="/bugwars/:gameId"
          element={
            <IsPrivate>
              <BugWarsPage />
            </IsPrivate>}
        />


      </Routes>

    </div>
  );
}

export default App;
