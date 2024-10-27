const Country = ({ cn, onClick }) => {

    return(
        <li>
        {cn.name.common}
        <button onClick={onClick}>show</button>
        </li>        
    )
}
export default Country