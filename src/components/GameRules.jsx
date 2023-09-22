

function GameRules() {

    return (
        <div className="dropdown rounded">
            <span className="text-white">>>Rules</span>
            <div className="dropdown-content rounded col-12 col-sm-12 col-md-12 bg-dark">
                <div className="d-flex flex-column justify-content-start bg-dark text-white" style={{ fontSize: '0.7rem',lineHeight:"100%"}}>
                    <p>To start game click 'Pick'.</p>
                    <p>Picked cards cannot be undone.</p>
                    <p>1 Spider can eat 1 Bug.</p>
                    <p>1 Bug can eat 1 Leaf branch.</p>
                    <p>2 Leaf branches make 1 Bug ill.</p>
                    <p>3 Leaf branches make 1-2 Bugs ill.</p>
                    <p>2-3 Bugs overpower 1 Spider. </p>
                    <p>Spider & Leaf are equal.</p>
                    <p>Spider & Spider are equal.</p>
                    <p>Bug & Bug are equal.</p>
                    <p>Leaf & Leaf are equal.</p>
                    <p>Play max 3 cards at a time.</p>
                    <p>Pick new cards only once cards in hand are used up.</p>
                    <p>Game is over when a player passes twice in a row.</p>
                    <p>Game is lost by player who passes twice in a row</p>
                </div>
            </div>

        </div>
    )
}

export default GameRules