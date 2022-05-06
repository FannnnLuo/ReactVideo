const app = require('express')()
const path = require('path');
const cors = require('cors')
const fs = require("fs");

const options = {
    key: fs.readFileSync(path.join(__dirname, '.', 'ssl', 'key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname, '.', 'ssl', 'cert.pem'), 'utf-8')
}

const server = require('https').createServer(options, app);

const io = require('socket.io')(server, {
    rejectUnauthorized: false,
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'OPTION']
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

    socket.on('call', ({caller, callee, signal}) => {
        io.to(callee).emit('call', {signal, caller})
    })

    socket.on('answer', ({caller, signal}) => {
        io.to(caller).emit('accepted', signal)
    })
})

server.listen(PORT, () => console.log(`server is runing on ${PORT}`))
