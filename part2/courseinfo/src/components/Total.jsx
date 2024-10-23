const Total = ( {course} ) => {

    const total = course.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.exercises
      },0)
      
    return(
        <p>Total of {total} exercises</p>
    )
}

export default Total