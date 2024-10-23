const Part = ({ props }) => {
    return(
        <ul>
            {props.map((part) => 
                <li key={part.id}>
                     <p>{part.name} {part.exercises}</p>     
                </li>
            )}
        </ul>
    )
}    
export default Part