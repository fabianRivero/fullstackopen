import Parts from "./Parts"

const Course = ({ course }) => {
    return(
        <>
        <h2>{course.name}</h2>
        <Parts props={course.parts}/> 
        </>
    )
}

export default Course