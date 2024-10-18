import { useState } from 'react'

const StatisticLine = (props) => {
  if (props.statName === 'positive') {
    return(
      <div>{props.statName}: {props.stat}%</div>  
    )
  }
  return(
    <div>{props.statName}: {props.stat}</div>
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return <h2>No feedback given</h2>
  }
  return(
    <>
      <h2>statistics</h2>
      <StatisticLine statName='good' stat={props.good}/>
      <StatisticLine statName='neutral' stat={props.neutral}/>
      <StatisticLine statName='bad' stat={props.bad}/>
      <StatisticLine statName='all' stat={props.all}/>
      <StatisticLine statName='average' stat={props.average}/>
      <StatisticLine statName='positive' stat={props.positive}/>
    </>
  )
}



const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [punctuation, setPunctuation] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)


  const goodReview = () => {
    setGood(good+1)
    setAll(all+1)
    setPunctuation(punctuation+1)
    const updatedGood = good + 1 
    const updatedPunctuation = punctuation + 1
    const updatedAll = all + 1
    setAverage(updatedPunctuation/updatedAll)
    setPositive(updatedGood/updatedAll*100)
  }
  const neutralReview = () => {
    setNeutral(neutral+1)
    setAll(all+1)
    setPunctuation(punctuation+0)
    const updatedGood = good + 0 
    const updatedPunctuation = punctuation + 0
    const updatedAll = all + 1
    setAverage(updatedPunctuation/updatedAll)
    setPositive(updatedGood/updatedAll*100)
    

  }
  const badReview = () => {
    setBad(bad+1)
    setAll(all+1)
    setPunctuation(punctuation-1)
    const updatedGood = good + 0 
    const updatedPunctuation = punctuation - 1
    const updatedAll = all + 1
    setAverage(updatedPunctuation/updatedAll)
    setPositive(updatedGood/updatedAll*100)
  }



  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={goodReview}>good</button>
      <button onClick={neutralReview}>neutral</button>
      <button onClick={badReview}>bad</button>

      <Statistics good={good} neutral={neutral} bad={bad} average={average} positive={positive} all={all}/>
    </div>
  )
}

export default App