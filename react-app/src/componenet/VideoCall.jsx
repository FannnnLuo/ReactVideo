import React from 'react'
import {Button, TextField} from '@mui/material';
import {useRef, useState, useEffect} from 'react';
import io, {Manager} from 'socket.io-client'
import Peer from "simple-peer"


// const socket = io('https://10.0.0.45:8000', {
//     path: '/socket.io/',
//     transports: ["websocket"]
// })
// socket.on("connect_error", (err) => {
//     // revert to classic upgrade
//     console.log(err)
// });
//

const manager = new Manager('https://video-app-react-be.herokuapp.com', {rejectUnauthorized: false, transports: ["websocket"]})
const socket = manager.socket('/')

manager.on('error', (error) => {
    // Fired upon a connection error.
    console.log('socket error', error)
})

socket.on('connect_error', (error) => {
    // Fired when an namespace middleware error occurs.
    console.log('connection error', error)
})

export default function VideoCall() {
    const myVideo = useRef()
    const calleeVideo = useRef()
    const connectionRef = useRef()

    const [stream, setStream] = useState(null)
    const [me, setMe] = useState('')
    const [callerSignal, setCallerSignal] = useState(null)
    const [caller, setCaller] = useState(null)
    const [callee, setCallee] = useState('')


    useEffect(() => {
        socket.on('me', id => {
            setMe(id)
        })

        // io.to(callee).emit('call',{signal,caller})
        socket.on('call', ({signal, caller}) => {
            setCaller(caller)
            setCallerSignal(signal)
            console.log(`caller:${caller}, signal:${signal}`)
        })
    }, [])

    const clickHandler = () => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(stream => {
                setStream(stream)
                myVideo.current.srcObject = stream
            })
    }

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on('signal', signal => {
            socket.emit('call', {caller: me, callee: id, signal})
        })
        peer.on('stream', stream => {
            calleeVideo.current.srcObject = stream
        })
        socket.on('accepted', signal => {
            peer.signal(signal)
        })
        connectionRef.current = peer
    }
    const callClickHandler = () => {
        callUser(callee)
    }
    const answerClickHandler = () => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on('signal', signal => {
            socket.emit('answer', {signal, caller})
        })
        peer.on('stream', stream => {
            calleeVideo.current.srcObject = stream
        })
        peer.signal(callerSignal)
        connectionRef.current = peer

    }

    return (
        <div>
            <Button variant='outlined' onClick={clickHandler}>Start My Video</Button><br/><br/>
            <span>{`${caller} is calling`}</span>
            <Button variant='outlined' onClick={answerClickHandler}>Answer</Button>
            <div>
                <h3>My video</h3>
                <h5>My id:{me || 'error'}</h5>
                <video playsInline autoPlay muted ref={myVideo}></video>
                <br/>

                <TextField label='id to call' variant='standard' value={callee}
                           onChange={e => setCallee(e.target.value)}></TextField>
                <Button variant='outlined' onClick={callClickHandler}>Call</Button>
            </div>
            <hr/>
            <div>
                <h3>Callee's video</h3>
                <video playsInline autoPlay ref={calleeVideo}></video>
            </div>
        </div>
    )
}
