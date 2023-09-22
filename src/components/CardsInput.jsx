

function CardsInput (props) {


    return(
        <input className="rounded" style={{ fontSize: 50 }} value={props.pickedCards} readOnly
        />
    )
}

export default CardsInput