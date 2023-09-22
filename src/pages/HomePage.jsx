
//Bug Avatar source https://www.vhv.rs/viewpic/hmwobwJ_ladybug-clipart-outline-ladybug-silhouette-clip-art-hd/

import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"

//--------------------------------------------------------------------------------------------------------------------------

const API_URL = process.env.REACT_APP_API_URL

function HomePage(props) {

  console.log(props.notification)

  const [users, setUsers] = useState([])
  const [thisUser, setThisUser] = useState('')
  const [profileImg, setProfileImg] = useState('')
  const [playerName, setPlayerName] = useState('')

  const { user } = useContext(AuthContext)

  const navigate = useNavigate()

  const storedToken = localStorage.getItem("authToken")

  const getUsers = () => {

    axios
      .get(`${API_URL}/home`, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then((response) => {

        const allUsers = response.data

        if (playerName === '') {
          const filteredUsers = allUsers.filter(filteredUser => filteredUser._id !== user._id)
          const currentUser = allUsers.filter(thisUser => thisUser._id === user._id)
          setUsers(filteredUsers)
          setThisUser(currentUser[0].username)
          setProfileImg(currentUser[0].picture)
        }
        else {
          const filterSearchedUsers = allUsers.filter(filteredUser => filteredUser._id !== user._id && filteredUser.username.toUpperCase().includes(playerName.toUpperCase()))
          const currentUser = allUsers.filter(thisUser => thisUser._id === user._id)
          setUsers(filterSearchedUsers)
          setThisUser(currentUser[0].username)
          setProfileImg(currentUser[0].picture)
        }

      })
      .catch((error) => console.log(error))

  }

  useEffect(() => {
    getUsers()
  }, [playerName])

  const handleGameClick = (otherUserId) => {

    props.switchOffNotification(otherUserId)

    let data = {
      participants: [otherUserId, user._id],

    }
    axios.post(`${API_URL}/game`, data, { headers: { Authorization: `Bearer ${storedToken}` } }).then((response) => {
      navigate(`/bugwars/${response.data._id}/${otherUserId}/${user._id}`)
    })

  }

  const handlePlayerName = (e) => {
    setPlayerName(e.target.value)
  }

  const getNotificationFromStorage = (senderId, userId) => {
    if(userId){
      const notification = JSON.parse(localStorage.getItem(`${senderId}notification`))
      if (notification){
        return notification.msgRcvd
      }
    }
   
  }

  return (

    <Container className="p-2" >
      <Card className="d-flex flex-column bg-transparent justify-content-center align-items-center text-white border p-3 border-5 rounded">
        {user &&
          <div >
            <Card className='bg-transparent border border-3 d-flex flex-row justify-content-center align-items-center text-white col col-sm-12 col-md-12 p-2'>
              <img src={profileImg} style={{ width: 100, height: 100 }} className="border rounded bg-light m-3" />

              <h3 className='text-center '>Hi {thisUser}!</h3>
            </Card>

            <Form.Group
              className="col col-sm-12 col-md-12 d-flex flex-col justify-content-center mt-3"

            >

              <Form.Control
                required
                placeholder="Type player's name..."
                type="email"
                name="email"
                value={playerName}
                onChange={handlePlayerName}
                className="mb-3"


              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>



            <h3>Select a player to start...</h3>
            </div>}

    

      <Row
        className="d-flex justify-content-cente"
        style={{ padding: "10px 10px" }}>

        {users.map((otherUser, index) => {

          return (

            <Col
              key={otherUser._id}
              className="d-flex justify-content-center text-center users"
            >

              <Card className='user-card d-flex flex-row col-md-12 col-sm-12 col text-white'
                style={{ margin: "10px", padding: 10, width: "40vw" }}
                onClick={() => {
                  handleGameClick(otherUser._id)
                }}
              >
                <img src={otherUser.picture} className="border rounded bg-light" style={{ width: 50, height: 50 }} />

                <Card.Header className='d-flex flex-row'>
                  <Card.Title>
                    <h5>{otherUser.username.charAt(0).toUpperCase() + otherUser.username.slice(1)}</h5>
                  </Card.Title>
                 
                  <div 
                  style = {{
                    height:10, 
                    width:10,  
                    backgroundColor: 
                    (props.notification.sender===otherUser._id && props.notification.msgRcvd) 
                    || getNotificationFromStorage(otherUser._id, user._id)

                    ? 'green' : ''}}></div>
                  
                 
                </Card.Header>

              </Card>

            </Col>

          )

        })}
      </Row>
      </Card>


    </Container>

  )
}

export default HomePage;