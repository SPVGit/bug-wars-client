import axios from "axios"
import io from "socket.io-client"

import { createRef, useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/auth.context"

import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import Spider from "../components/Spider"
import Leaf from "../components/Leaf"
import Ladybug from "../components/Ladybug"

import GameRules from "../components/GameRules"

const API_URL = process.env.REACT_APP_API_URL
let socket = ""

//--------------------------------------------------------------------------------------------------------------------------

function BugWarsPage() {

  const [bugCards, setBugCards] = useState([])
  const [pickedCards, setPickedCards] = useState('')
  const [messageList, setMessageList] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [win, setWin] = useState(false)

  const { user } = useContext(AuthContext)
  const { gameId } = useParams()
  let messagesEnd = createRef()

  const storedToken = localStorage.getItem("authToken")

  const setCards = () => {

    if (pickedCards.length < 8) {
      if (bugCards.length === 0 && pickedCards.length === 0) {
        const bugsArray = []
        for (let i = 0; i < 5; i++) {
          bugsArray.push(<Spider />)
          bugsArray.push(<Leaf />)
          bugsArray.push(<Ladybug />)
        }
        const shuffledArray = [...bugsArray].sort((a, b) => 0.5 - Math.random());
        setBugCards(shuffledArray.slice(0, 5))
      }
      else {
        setErrorMsg('Finish playing cards in hand before picking a new set')
      }

    }
    else {
      setErrorMsg('Maximum pick - 3 cards')
    }
  }

  const handlePick = async () => {

    setErrorMsg('')

    if (win === true) {
      setWin(false)
      setMessageList([])
      setCards()

      axios
        .delete(`${API_URL}/messages/${gameId}`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })

    //  await socket.emit("clear_messages", { gameId: gameId })
    }
    else {
      setCards()
    }

  }

  const handleBugsClick = (e) => {

    setErrorMsg('')
    if (messageList.length > 0 && messageList[messageList.length - 1].senderName === user.username) {
      setErrorMsg('Await your turn')
    }
   
    else if (pickedCards.length > 0 && e.target.innerHTML !== pickedCards[pickedCards.length - 1]) {
      setErrorMsg('Cards picked must be of same type')
    }
    else if (pickedCards.length === 3) {
      setErrorMsg('Max 3 cards can be played at a time')
    }
    else {
      setPickedCards([...pickedCards, e.target.innerHTML])
      setBugCards(bugCards.slice(1))
    }

  }

  const handleMessageInput = () => {

    setErrorMsg('')
    setCurrentMessage(`${pickedCards}`)

  }

  const handleErrorMsg = () => {

    setErrorMsg("Pick left most card")

  }

  const handlePass = () => {

    setErrorMsg('')
    if(win===false){
      if (messageList.length > 0 && messageList[messageList.length - 1].senderName === user.username) {
        setErrorMsg('Await your turn')
      }
      else if (pickedCards.length === 1 && pickedCards[0]==='✋🏽') {
        setErrorMsg('Click Play')
      }
      else if(pickedCards.length>0 && pickedCards[pickedCards.length-1]!== '✋🏽'){
        setErrorMsg('Cards picked must be of same type')
      }
      else{
        setPickedCards([...pickedCards, "✋🏽"])
      }
    }
    else{
      setErrorMsg('Click pick to start game again')
    }
    
    
  }

  const handleOnSubmit = async (e) => {

    if (currentMessage === "") {
      e.preventDefault()
      setErrorMsg('Pick cards to play, or click Pass')
    }
    else {

      e.preventDefault()
      let messageContent = ""
      setErrorMsg('')

      function create_UUID() {
        var dt = new Date().getTime()
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0
          dt = Math.floor(dt / 16)
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
        })
        return uuid
      }

      messageContent = {
        uniqueId: create_UUID(),
        gameId,
        sender: user,
        senderName: user.username,
        picture: user.picture,
        message: currentMessage,
        winMsg: (calculateWin())
      }

      await socket.emit("send_message", messageContent) //sends the message to the backend and also sets it into State
      setMessageList([...messageList, messageContent])
      setCurrentMessage("")
      setPickedCards('')

    }

  }

  const calculateWin = () => {


    console.log(messageList)
    console.log(pickedCards)
    

    if (messageList.length > 0) {

      let playerCard = pickedCards[pickedCards.length - 1]
      let opponentCard = messageList[messageList.length - 1].message

      if ((opponentCard === '🕷,🕷,🕷' &&
        (playerCard === '🐞' ||
          playerCard === '🐞,🐞' ||
          playerCard === '🐞,🐞,🐞'))

        ||

        (opponentCard === '🕷,🕷' &&
          (playerCard === '🐞' ||
            playerCard === '🐞,🐞'))

        ||

        (opponentCard === '🕷' &&
          playerCard === '🐞')

        ||

        (opponentCard === '🐞,🐞,🐞' &&
          (playerCard === '🕷' ||
            playerCard === '🕷,🕷'))

        ||

        (opponentCard === '🐞,🐞' &&
          playerCard === '🕷')

        ||

        (opponentCard === '🐞,🐞,🐞' &&
          (playerCard === '🌿' ||
            playerCard === '🌿,🌿' ||
            playerCard === '🌿,🌿,🌿'))

        ||

        (opponentCard === '🐞,🐞' &&
          (playerCard === '🌿' ||
            playerCard === '🌿,🌿'))

        ||

        (opponentCard === '🐞' &&
          playerCard === '🌿')

        ||

        (opponentCard === '🌿,🌿,🌿' &&
          (playerCard === '🐞' ||
            playerCard === '🐞,🐞'))

        ||

        (opponentCard === '🌿,🌿' &&
          playerCard === '🐞')

      ) {
        setWin(true)
        setBugCards([])
        return `${messageList[messageList.length - 1].senderName} wins!`
      }

      else if(
        (playerCard === '🕷,🕷,🕷' &&
          (opponentCard === '🐞' ||
          opponentCard === '🐞,🐞' ||
          opponentCard === '🐞,🐞,🐞'))
  
          ||
  
          (playerCard === '🕷,🕷' &&
            (opponentCard === '🐞' ||
            opponentCard === '🐞,🐞'))
  
          ||
  
          (playerCard === '🕷' &&
          opponentCard === '🐞')
  
          ||
  
          (playerCard === '🐞,🐞,🐞' &&
            (opponentCard === '🕷' ||
            opponentCard === '🕷,🕷'))
  
          ||
  
          (playerCard === '🐞,🐞' &&
          opponentCard === '🕷')
  
          ||
  
          (playerCard === '🐞,🐞,🐞' &&
            (opponentCard === '🌿' ||
            opponentCard === '🌿,🌿' ||
            opponentCard === '🌿,🌿,🌿'))
  
          ||
  
          (playerCard === '🐞,🐞' &&
            (opponentCard === '🌿' ||
            opponentCard === '🌿,🌿'))
  
          ||
  
          (playerCard === '🐞' &&
          opponentCard === '🌿')
  
          ||
  
          (playerCard === '🌿,🌿,🌿' &&
            (opponentCard === '🐞' ||
            opponentCard === '🐞,🐞'))
  
          ||
  
          (playerCard === '🌿,🌿' &&
          opponentCard === '🐞')
      )
      {
        setWin(true)
        setBugCards([])
        return `${user.username} wins!`
      }

      else if(messageList.length>=2){

        console.log('don')

        let previousPlayerCard = messageList[messageList.length - 2].message
  
        if(playerCard==='✋🏽' && previousPlayerCard === '✋🏽'){
          console.log('monkey')
          setWin(true)
          setBugCards([])
          return `${messageList[messageList.length - 1].senderName} wins!`
        }
        
      }
    }
  
  }

  useEffect(() => {

    socket = io(`${API_URL}`)

    const getMessages = async () => {

      let response = await axios.get(`${API_URL}/messages/${gameId}`,
        { headers: { Authorization: `Bearer ${storedToken}` } })

      setMessageList(response.data)

      socket.emit("join_chat", gameId)

      socket.on("receive_message", (data) => {

        setMessageList(data)

        if (data.length === 0) {
          setWin(false)
        }
        else if (!data[data.length - 1].winMsg) {
          setWin(false)
        }
        else {
          setWin(true)
          setBugCards([])
        }

      })
    }

    getMessages()

  }, [])

  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messageList])

  return (

    <Container className="d-flex flex-column align-items-center rounded">
      <h3 className='text-white'>The War Begins!</h3>
      <Container className="chatContainer border rounded d-flex justify-content-center ">
        <GameRules />
        <div className="messages">
          {messageList.map((val) => {
            return (
              <div
                key={val.uniqueId}
                className="messageContainer"
                id={val.senderName === user.username ? "You" : "Other"}>
                <div
                  className="messageIndividual d-flex flex-row border rounded col-8 col-sm-8 col-md-8"
                  style={{ height: "auto", padding: "10px" }}>
                  <div
                    className="d-flex flex-column align-items-stretch"
                    style={{ wordBreak: "break-word" }}>
                    {" "}
                    <div className="d-flex flex-row align-items-stretch">
                      <img className="border rounded bg-light" src={val.picture} style={{ height: 30, width: 30, marginRight: 5 }} />
                      <p><strong>{val.senderName}:</strong> {" "}</p>
                    </div>
                    <p style={{ fontSize: 50 }}>{val.message}</p>
                    <p style={{ fontSize: 20 }}>{val.winMsg}</p>
                  </div>
                </div>
              </div>
            )
          })}
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              messagesEnd = el
            }}></div>
        </div>
        <div className="d-flex flex-column">
          <Form
            className="messageInputs mb-2 p-1 col-12 col-md-12 col-sm-12 d-flex flex-row justify-content-center"
            onSubmit={handleOnSubmit}
          >
            <input className="rounded" style={{ fontSize: 50 }} value={pickedCards} readOnly
            />
            <div className="d-flex flex-column" >
              <Button
                className="rounded border"
                onClick={handlePick}
              >
                Pick
              </Button>
              <Button
                className="rounded border"
                type='submit'
                onClick={handleMessageInput}
              >
                Play
              </Button>
              <Button
                className="rounded border"
                onClick={handlePass}
              >
                Pass
              </Button>
            </div>
          </Form>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <svg xmlns="http:/www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
            </svg>
            {bugCards.map((cards, index) => {
              return (<div>
                {index === 0 ?
                  <div onClick={handleBugsClick}>{cards}</div>
                  :
                  <div onClick={handleErrorMsg} >{cards}</div>}
              </div>)
            }
            )}
          </div>
          {errorMsg && <h1 className="text-white text-center">{errorMsg}</h1>}
        </div>
      </Container>
    </Container>

  )
}

export default BugWarsPage;