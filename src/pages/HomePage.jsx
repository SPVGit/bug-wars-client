
//Bug Avatar source https://www.vhv.rs/viewpic/hmwobwJ_ladybug-clipart-outline-ladybug-silhouette-clip-art-hd/

import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"

//--------------------------------------------------------------------------------------------------------------------------

const API_URL = process.env.REACT_APP_API_URL

function HomePage() {

  const [users, setUsers] = useState([])
  const [thisUser, setThisUser] = useState('')
  const [profileImg, setProfileImg] = useState('')

  const { user } = useContext(AuthContext)

  const navigate = useNavigate()

  const storedToken = localStorage.getItem("authToken")

  const getUsers = () => {

    axios
      .get(`${API_URL}/home`, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then((response) => {
        const allUsers = response.data
        const filteredUsers = allUsers.filter(filteredUser => filteredUser._id !== user._id)
        const currentUser = allUsers.filter(thisUser => thisUser._id === user._id)
        setUsers(filteredUsers)
        setThisUser(currentUser[0].username)
        setProfileImg(currentUser[0].picture)
      })
      .catch((error) => console.log(error))

  }

  useEffect(() => {
    getUsers()
  }, [])

  const handleGameClick = (gameUserId) => {

    
    let data = {
      participants: [gameUserId, user._id],
 
    }
    axios.post(`${API_URL}/game`, data, { headers: { Authorization: `Bearer ${storedToken}` } }).then((response) => {
      navigate(`/bugwars/${response.data._id}`)
    })

  }

  return (

    <Container >

      <div>

        {user &&
          <div className="d-flex flex-column justify-content-center align-items-center text-white">
            <img src={profileImg} style={{ width: 100, height: 100 }} className="border rounded bg-light mb-2"/>
            <h3 className='text-center'>Welcome {thisUser}!</h3>
            <h3>Select a player to start...</h3>
          </div>}

      </div>

      <Row
        className="d-flex justify-content-cente"
        style={{ padding: "10px 10px"}}>

        {users.map((gameUser) => {

          return (

            <Col
              key={gameUser._id}
              className="d-flex justify-content-center text-center"
              >

              <Card className='user-card text-white d-flex flex-row col-md-12 col-sm-12 col'
                style={{ margin: "10px", padding: 10, width: "40vw" }}
                onClick={() => {
                  handleGameClick(gameUser._id)
                }}
              >
                <img src={gameUser.picture} className="border rounded bg-light" style={{width:50, height:50}} />

                <Card.Header className='d-flex flex-row'>
                  <Card.Title>
                    <h5>{gameUser.username.charAt(0).toUpperCase() + gameUser.username.slice(1)}</h5>
                  </Card.Title>
                </Card.Header>

              </Card>

            </Col>

          )

        })}
      </Row>

    </Container>

  )
}

export default HomePage;