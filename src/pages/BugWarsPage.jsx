import axios from "axios"
import io from "socket.io-client"

import { createRef, useState, useEffect, useContext } from "react"
import { useLocation, useParams } from "react-router-dom"
import { AuthContext } from "../context/auth.context"

import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import Spider from "../components/Spider"
import Leaf from "../components/Leaf"
import Ladybug from "../components/Ladybug"

import CardsInput from "../components/CardsInput"

import GameRules from "../components/GameRules"

const API_URL = process.env.REACT_APP_API_URL
let socket = ""

//---------------------------------------------------------------------------------------------------------------------------------------

function BugWarsPage(props) {

  //-----------------------------------------------GET ITEMS FROM LOCAL STORAGE----------------------------------------------------------------



  const { gameId, opponentId, thisUserId } = useParams()

  let getCardsFromStorage = () => {

    const cardsArray = []
    const cards = JSON.parse(localStorage.getItem(`${opponentId}Cards`));

    if (cards) {

      for (let i = 0; i < cards.length; i++) {

        if (cards[i] && cards[i].slice(0, cards[i].indexOf(cards[i][cards[i].length - 1])) === 'Ladybug') {
          cardsArray.push(<Ladybug index={cards[i].slice(-1)} />)
        }
        else if (cards[i] && cards[i].slice(0, cards[i].indexOf(cards[i][cards[i].length - 1])) === 'Spider') {
          cardsArray.push(<Spider index={cards[i].slice(-1)} />)
        }
        else if (cards[i] && cards[i].slice(0, cards[i].indexOf(cards[i][cards[i].length - 1])) === 'Leaf') {
          cardsArray.push(<Leaf index={cards[i].slice(-1)} />)
        }

      }
      return cardsArray;
    }
    else {
      return []
    }

  }

  const getInputFromStorage = () => {

    let inputCards = localStorage.getItem(`${opponentId}Input`)

    if (inputCards === '' || inputCards === null) return ''
    else return (JSON.parse(inputCards))

  }


  //-----------------------------------------------------GET AUTH TOKEN FROM LOCAL STORAGE------------------------------------------------------------


  const storedToken = localStorage.getItem("authToken")


  //-----------------------------------------USE STATES------------------------------------------------------------------------------------------


  const [bugCards, setBugCards] = useState(getCardsFromStorage())
  const [pickedCards, setPickedCards] = useState(getInputFromStorage())
  const [messageList, setMessageList] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [win, setWin] = useState(localStorage.getItem(`${opponentId}WinState`))
  const [thisUser, setThisUser] = useState('')
  const [opponent, setOpponent] = useState('')


  //-----------------------------------------------SET ITEMS TO LOCAL STORAGE----------------------------------------------------------------------


  const setCardsToStorage = (cards) => { //To set cards to local storage

    if (cards) {
      const cardNames = cards.map((card) => `${card.type.name}${card.props.index}`)
      localStorage.setItem(`${opponentId}Cards`, JSON.stringify(cardNames));
    }

  }

  useEffect(() => {

    if (pickedCards) {
      localStorage.setItem(`${opponentId}Input`, JSON.stringify(pickedCards))
    }
    else {
      localStorage.setItem(`${opponentId}Input`, '')
    }

  }, [pickedCards])


  //----------------------------------------OTHER REACT HOOKS_-------------------------------------------------------------------------------------------


  const { user } = useContext(AuthContext)

  let location = useLocation()


  let messagesEnd = createRef()


  //--------------------------------------------------DEAL CARDS------------------------------------------------------------------------------------------

  const setCardsToPlay = () => {

    if (pickedCards.length < 8) {

      if (bugCards.length === 0 && pickedCards.length === 0) {
        const bugsArray = []
        for (let i = 0; i < 5; i++) {
          bugsArray.push(<Spider index={i} />)
          bugsArray.push(<Leaf index={i} />)
          bugsArray.push(<Ladybug index={i} />)
        }
        const shuffledArray = [...bugsArray].sort((a, b) => 0.5 - Math.random());
        setBugCards(shuffledArray.slice(0, 5))
        return shuffledArray.slice(0, 5)

      }
      else {
        setErrorMsg('Finish playing cards in hand before picking a new set')
      }

    }
    else {
      setErrorMsg('Maximum pick - 3 cards')
    }
  }

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const handlePick = async () => {

    setErrorMsg('')

    if (win === 'true') {
      toBeWon()
      localStorage.removeItem(`${opponentId}Cards`)
      setMessageList([])
      setBugCards([])
      const bugsArrayAtStart = setCardsToPlay()
      setCardsToStorage(bugsArrayAtStart)
      axios
        .delete(`${API_URL}/messages/${gameId}`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
    }

    else {
      const bugsArrayAtStart = setCardsToPlay()
      setCardsToStorage(bugsArrayAtStart)
    }

  }


  //--------------------------------------------------CHOOSE CARDS / HANDLER FUNCTIONS--------------------------------------------------------------------


  const handleBugsClick = (e) => {

    setErrorMsg('')

    if (messageList.length > 0 && messageList[messageList.length - 1].senderName === thisUser.username) {
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

      for (let i = 0; i < bugCards.length; i++) {
        if (`${bugCards[i].type.name}${bugCards[i].props.index}` === e.target.id) {
          delete bugCards[i]
        }
      }

      let newBugCards = bugCards.filter(bug => bug !== undefined)
      setBugCards(newBugCards)
      setCardsToStorage(bugCards)

    }

  }

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  const handleMessageInput = () => {

    setErrorMsg('')
    setCurrentMessage(`${pickedCards}`)

  }

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  const handlePass = () => {

    setErrorMsg('')

    if (win === 'false') {

      if (messageList.length > 0 && messageList[messageList.length - 1].senderName === thisUser.username) {
        setErrorMsg('Await your turn')
      }
      else if (pickedCards.length === 1 && pickedCards[0] === '✋🏽') {
        setErrorMsg('Click Play')
      }
      else if (pickedCards.length > 0 && pickedCards[pickedCards.length - 1] !== '✋🏽') {
        setErrorMsg('Cards picked must be of same type')
      }

      else if (messageList.length > 0 && messageList[messageList.length - 1].message === '✋🏽') {
        console.log('budonkey')
        setErrorMsg('You may not pass after your opponent')
      }

      else {
        setPickedCards([...pickedCards, "✋🏽"])
      }

    }
    else {

      setErrorMsg('Click pick to start game again')

    }

  }

  //--------------------------------------------------SUBMIT CHOSEN CARDS------------------------------------------------------------------------------------------

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
        sender: thisUser,
        senderName: thisUser.username,
        picture: thisUser.picture,
        message: currentMessage,
        winMsg: (calculateWin())
      }

      await socket.emit("send_message", messageContent)
      setMessageList([...messageList, messageContent])
      setCurrentMessage("")
      setPickedCards('')

    }

  }

  //----------------------------------------- WIN CONFIRMED FUNCTION------------------------------------------------------------

  const gameWon = () => {
    setWin('true')
    localStorage.setItem(`${opponentId}WinState`, 'true')
    localStorage.removeItem(`${opponentId}Cards`)
    setBugCards([])
  }

  //----------------------------------------- WIN TO BE CONFIRMED FUNCTION------------------------------------------------------


  const toBeWon = () => {
    setWin('false')
    localStorage.setItem(`${opponentId}WinState`, 'false')
  }


  //------------------------------------------COMPARE PLAYER CARDS FUNCTION----------------------------------------------------

  const comparePlayerCards = (a, b) => {

    if ((a === '🕷,🕷,🕷' &&
      (b === '🐞' ||
        b === '🐞,🐞' ||
        b === '🐞,🐞,🐞'))

      ||

      (a === '🕷,🕷' &&
        (b === '🐞' ||
          b === '🐞,🐞'))

      ||

      (a === '🕷' &&
        b === '🐞')

      ||

      (a === '🐞,🐞,🐞' &&
        (b === '🕷' ||
          b === '🕷,🕷'))

      ||

      (a === '🐞,🐞' &&
        b === '🕷')

      ||

      (a === '🐞,🐞,🐞' &&
        (b === '🌿' ||
          b === '🌿,🌿' ||
          b === '🌿,🌿,🌿'))

      ||

      (a === '🐞,🐞' &&
        (b === '🌿' ||
          b === '🌿,🌿'))

      ||

      (a === '🐞' &&
        b === '🌿')

      ||

      (a === '🌿,🌿,🌿' &&
        (b === '🐞' ||
          b === '🐞,🐞'))

      ||

      (a === '🌿,🌿' &&
        b === '🐞')) {
      return 'a'
    }

  }

  //---------------------------------------------CALCULATE WIN FUNCTION--------------------------------------------------------------------

  const calculateWin = () => { // prevOpp  prevPlay  Opp  Play

    if (messageList.length > 0) {

      let playerCard = pickedCards[pickedCards.length - 1]
      let opponentCard = messageList[messageList.length - 1].message


      if (comparePlayerCards(opponentCard, playerCard) === 'a') {

        gameWon()
        return `${messageList[messageList.length - 1].senderName} wins!`

      }

      else if (comparePlayerCards(playerCard, opponentCard) === 'a') {

        gameWon()
        return `${thisUser.username} wins!`

      }

      else if (messageList.length >= 2) {

        let previousPlayerCard = messageList[messageList.length - 2].message

        if (playerCard === '✋🏽' && previousPlayerCard === '✋🏽') {

          gameWon()
          return `${messageList[messageList.length - 1].senderName} wins!`

        }

      }

    }

  }


  //--------------------------------------------GET ALL MESSAGES--------------------------------------------------------------------


  useEffect(() => {

    socket = io(`${API_URL}`)

    const getMessages = async () => {

      let response = await axios.get(`${API_URL}/messages/${gameId}`,
        { headers: { Authorization: `Bearer ${storedToken}` } })

      setMessageList(response.data)

      socket.emit("join_chat", gameId)

      socket.on("receive_message", (data) => {

        console.log(data)

        props.collectNotification(data[data.length - 1].sender)

       // axios.put(`${API_URL}/notification/${opponentId}/${thisUserId}`, { headers: { Authorization: `Bearer ${storedToken}` } } )
        /// .then(response => console.log(response))

        setMessageList(data)
        //  if (data.length === 0) {
        //    toBeWon()
        //  }
        if (!data[data.length - 1].winMsg) {
          toBeWon()
        }
        else {
          gameWon()

        }

      })
    }

    const getPlayers = () => {

      axios.get(`${API_URL}/bugwars/${gameId}/${opponentId}/${thisUserId}`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then((response) => {
          if (response) {

            setThisUser(response.data.filter((currentUser) => currentUser._id === thisUserId)[0])
            setOpponent(response.data.filter((currentOpponent) => currentOpponent._id === opponentId)[0])
          }

        })

    }


    getMessages()
    getPlayers()
   

  }, [])


  useEffect(() => {
    window.addEventListener('beforeunload', endNotification)
    window.addEventListener('unload', pageChanges)
    return () => {
      window.removeEventListener('beforeunload', endNotification)
      window.removeEventListener('unload', pageChanges)
      pageChanges()
    }
  }, [])

  const endNotification = e => {
    e.preventDefault()
    e.returnValue = ''
    
  }

  const pageChanges = async () => {
    props.switchOffNotification(opponentId)
   
    console.log('page has changed')
    }
  
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messageList])


  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


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
                id={val.senderName === thisUser.username ? "You" : "Other"}>
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

            <CardsInput pickedCards={pickedCards} />

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

            {bugCards.map((cards, index) => {
              return (
                <div key={index} className='bugContainer'>
                  {<div onClick={handleBugsClick}>{cards}</div>}
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