
import { Container } from "react-bootstrap"
import Bug from "../components/Bug"
import { useEffect } from "react"

function Home() {


    return (
        <Container >
            
            <div className="SignupPage text-center mw-75 text-white p-2">
                <h1 className="translate-right">
                    Welcome to Bug Wars!
                </h1>
            </div>

                       <Bug/>
             
        </Container>
    )



}

export default Home