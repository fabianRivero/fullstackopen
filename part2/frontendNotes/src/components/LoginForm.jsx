import { useState } from 'react'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const logUser = (event) => {
    event.preventDefault()
    login({
      username: username,
      password: password
    })
    setUsername('')
    setPassword('')
  }
  return (
    <div>
      <h2>Log in</h2>

      <form onSubmit={logUser}>
        <div>
          username
          <input
            data-testid='username'
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid='password'
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
      </div>
        <button type="submit">log in</button>
      </form>
    </div>
  )}

export default LoginForm