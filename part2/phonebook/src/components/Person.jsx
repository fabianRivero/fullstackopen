const Person = ({ person, confirmation }) => {
    return(
        <li key={person.id}>
        {person.name} {person.number}
        <button onClick={confirmation}>delete</button>
        </li>        
    )
}

export default Person