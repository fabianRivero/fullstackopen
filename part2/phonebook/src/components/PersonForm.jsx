const PersonForm = (props) => {
    return(
      <form>
        <div>
          name: <input value={props.nameValue} onChange={props.nameOnChange} required/>
          number: <input value={props.numberValue} onChange={props.numberOnChange} required/>
        </div>
        <div>
          <button type="submit" onClick={props.onClick}>add</button>
        </div>
      </form>
    )
}

export default PersonForm