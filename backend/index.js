const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods:['GET','POST']
    }
})

app.use(cors())

const PORT = process.env.PORT || 8000

app.get('/', (req, res) => {
    res.send('server is running')
})

io.on('connection', socket => {
    console.log(socket.id)
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
    })
    
    socket.on('call', ({ caller, callee, signal }) => {
        io.to(callee).emit('call',{signal,caller})
    })

    socket.on('answer', ({caller,signal}) => {
        io.to(caller).emit('accepted',signal)
    })
})

server.listen(PORT,()=>console.log(`server is runing on ${PORT}`))
