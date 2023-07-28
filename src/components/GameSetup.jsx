import Spider from "./Spider"
import Aphid from "./Leaf"
import Ladybug from "./Ladybug"
import { useState } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

function GameSetup(props) {

    const [bugCards, setBugCards] = useState(createBugsArray())

    const [pickedCards, setPickedCards] = useState([])


    function createBugsArray() {

        const bugsArray = []

        for (let i = 0; i < 5; i++) {
            bugsArray.push(<Spider />)
            bugsArray.push(<Aphid />)
            bugsArray.push(<Ladybug />)
        }
        const shuffledArray = [...bugsArray].sort((a, b) => 0.5 - Math.random());
        return shuffledArray

    }


    const handleClick = (e) => {
        setPickedCards(pickedCards)
        setPickedCards([...pickedCards, e.target.innerHTML])
    }


    console.log(pickedCards)

    return (
        <div className="d-flex flex-column">

            <div
                className="messageInputs mb-2 p-1"
            >

                {<div
                    className="rounded input"
                >
                    <h1 className="bugs">{pickedCards}</h1>
                </div>}


                <div className="d-flex flex-column" >

                    <Button className="rounded border">
                        Start

                    </Button>

                    <Button
                        className="rounded border"
                    >
                        Pick

                    </Button>

                    <Button
                        className="rounded border"
                       >
                        Deal
                    </Button>
                </div>

            </div>
            <div className="d-flex flex-row">

                {bugCards.map((cards, index) => {

                    if (index < 5) {
                        return (
                            <div onClick={handleClick}>{cards}</div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default GameSetup