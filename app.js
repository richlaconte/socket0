var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/js', (req, res) => {
    res.sendFile(__dirname + '/public/main.js');
})
app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/main.css');
})

let game = {
    currentUsers: [],
    objectives: [
        { left: Math.floor(Math.random() * 400), top: Math.floor(Math.random() * 400) }
    ]
}

const newObj = () => {
    game.objectives[0].left = Math.floor(Math.random() * 400);
    game.objectives[0].top = Math.floor(Math.random() * 400)
}

// CURRENT USERS HANDLING
const createUser = (id) => {
    return {
        id,
        moveUp() {
            this.top -= this.speed;
            return;
        },
        moveDown() {
            this.top += this.speed;
            return;
        },
        moveRight() {
            this.left += this.speed;
            return;
        },
        moveLeft() {
            this.left -= this.speed;
            return;
        },
        levelUp() {
            this.size += 5;
            this.speed += 1;
        },
        top: Math.floor(Math.random() * 400),
        left: Math.floor(Math.random() * 300),
        size: 10,
        speed: 10
    }
}
const addUser = (id) => {
    game.currentUsers.push(createUser(id));
}
const getUserById = (id) => {
    for (user in game.currentUsers) {
        if (game.currentUsers[user].id === id) {
            return game.currentUsers[user];
        }
    }
}
const removeUser = (id) => {
    for (let i = 0; i < game.currentUsers.length; i++) {
        if (game.currentUsers[i].id === id) {
            game.currentUsers.splice(i, i + 1);
        }
    }
}

const checkUserObj = (user) => {
    let objCenterLeft = game.objectives[0].left + 10;
    let objCenterTop = game.objectives[0].top + 10;
    let userCenterLeft = user.left + (user.size / 2);
    let userCenterTop = user.top + (user.size / 2);


    let xDiff;
    let yDiff;
    if (objCenterLeft > userCenterLeft) {
        xDiff = objCenterLeft - userCenterLeft;
    } else {
        xDiff = userCenterLeft - objCenterLeft;
    }
    if (objCenterTop > userCenterTop) {
        yDiff = objCenterTop - userCenterTop;
    } else {
        yDiff = userCenterTop - objCenterTop;
    }

    let yDiff2 = yDiff * yDiff;
    let xDiff2 = xDiff * xDiff;

    let distance = Math.sqrt(xDiff2 + yDiff2);

    if (distance < (user.size / 2) + 10) {
        user.levelUp();
        newObj();
    }
}

io.on('connection', function (socket) {
    console.log(`user id: ${socket.id} - connected`);
    addUser(socket.id)
    console.log(game.currentUsers);
    io.emit('game', game);
    socket.on('disconnect', function () {
        console.log(`user id: ${socket.id} - disconnected`);
        removeUser(socket.id);
        io.emit('game', game)
    });
    socket.on('chat message', (data) => {
        console.log(data);
    });
    socket.on('move', (data) => {
        switch (data) {
            case 'up':
                getUserById(socket.id).moveUp();
                break;
            case 'down':
                getUserById(socket.id).moveDown();
                break;
            case 'right':
                getUserById(socket.id).moveRight();
                break;
            case 'left':
                getUserById(socket.id).moveLeft();
                break;
        }
        checkUserObj(getUserById(socket.id));
        io.emit('game', game);
    })
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, function () {
    console.log(`listening on ${PORT}`);
});