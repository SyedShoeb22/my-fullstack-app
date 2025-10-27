import { useEffect, useState } from 'react'

function App() {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/hello')
      .then(r => r.json())
      .then(d => setMsg(d.msg))
      .catch(e => setMsg('error'))
  }, [])

  return <div>
    <h1>React + Express</h1>
    <p>Backend says: {msg}</p>
  </div>
}

export default App
