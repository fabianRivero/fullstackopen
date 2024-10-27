const Notification = ({ confirmationMessage, errorMessage }) => {
    if (confirmationMessage === null) {
        return (
             <div className="error">
               {errorMessage}
             </div>
        )
    }
  
    return (
      <div className="confirmation">
        {confirmationMessage}
      </div>
    )
  }

  export default Notification