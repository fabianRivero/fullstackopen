const Filter = (props) => {
    return(
        <>
            <div>filter shown with<input type="text" value={props.value} onChange={props.onChange}/><button onClick={props.onClick}>search</button></div>
            <ul>
            {props.persons.map((person) => (
                <li key={person.name}>
                    {person.name} {person.number}
                </li>
            ))}
            </ul>
        </>
    )
}

export default Filter