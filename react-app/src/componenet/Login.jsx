import React,{useState} from 'react'

import { Button,TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const clickHandler = () => {
        console.log(`email:${email}`)
        navigate('/video-call')
    }
  return (
      <div>
            <form>
              <TextField label='Username' variant='standard' value={email} onChange={e => setEmail(e.target.value)}></TextField><br/>
              <TextField label='Password' variant='standard' value={password} onChange={e => setPassword(e.target.value)}></TextField><br/><br/>
              <Button variant='outlined' onClick={clickHandler}>Login</Button>

            </form>     
    </div>
  )
}
