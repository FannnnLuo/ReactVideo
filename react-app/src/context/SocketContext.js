// import React, { createContext, useEffect, useRef, useState } from 'react'
// import { io } from 'socket.io-client'
// import Peer from 'simple-peer'

// const SocketContext = createContext();
// const socket = io('http://localhost:8000')

// const ContextProvider = ({ children }) => {
//     const [stream, setStream] = useState(null)
//     const [myId, setMyId] = useState('')

//     const [callAccepted, setCallAccepted] = useState(false)
//     const [callEnded,setCallEnded] = useState(false)

//     const [caller, setCaller] = useState({})
    
//     const myVideo = useRef()
//     const calleeVideo = useRef()
//     const connectionRef = useRef();

//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then((stream) => {
//                 setStream(stream)
//                 myVideo.current.srcObject = stream
//             })
//         socket.on('me', id => setMyId(id))
        
//         socket.on('call', ({signal,caller}) => {
//             setCaller({caller,signal})
//         })
//     },[])

//     const answerCall = () => {
//         setCallAccepted(true)

//         const peer = new Peer({ initiator: false, trickle: false, stream })
//         peer.on('signal', signal => {
//             socket.emit('answer',{signal,caller})
//         })
//         peer.on('stream', (stream) => {
//             calleeVideo.current.srcObject = stream
//         })
//     }

//     const callUser = (callee) => {
//         const peer = new Peer({ initiator: true, trickle: false, stream })
//         peer.on('signal', signal => {
//             socket.emit('call',{myId,callee,signal})
//         })
//         peer.on('stream', stream => {
//             calleeVideo.current.srcObject = stream
//         })

//         socket.on('callAccepted', signal => {
//             setCallAccepted(true)
//             peer.signal(signal)
//         })
//         connectionRef.current = peer
//     }

//     const callEnd = () => {
//         setCallEnded(true)
//         connectionRef.current.destroy()

//         window.location.reload()
//     }

//     return (<SocketContext.Provider value={{ stream, myId, callAccepted, myVideo,calleeVideo, callEnd, answerCall, callUser, callEnded }}>{children}</SocketContext.Provider>)
// }

// export {ContextProvider,SocketContext}