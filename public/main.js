let getById = (id) => {
    return document.getElementById(id);
}

// EMIT EVENT
//socket.emit('chat message', 'test');

socket.on('game', (data) => {
    console.log(data);
    let existingUnits = document.getElementsByClassName('unit');
    let existingObjs = document.getElementsByClassName('objective');
    if (existingUnits) {
        while (existingUnits[0]) {
            existingUnits[0].parentNode.removeChild(existingUnits[0]);
        }
    }
    if (existingObjs) {
        while (existingObjs[0]) {
            existingObjs[0].parentNode.removeChild(existingObjs[0]);
        }
    }
    for (unit in data.currentUsers) {
        let newUnit = document.createElement('DIV');
        newUnit.className = 'unit';
        newUnit.style.left = data.currentUsers[unit].left + 'px';
        newUnit.style.top = data.currentUsers[unit].top + 'px';
        newUnit.style.width = data.currentUsers[unit].size + 'px';
        newUnit.style.height = data.currentUsers[unit].size + 'px';
        newUnit.style.borderRadius = data.currentUsers[unit].size / 2 + 'px';
        document.getElementsByTagName('body')[0].appendChild(newUnit);
    }
    for (obj in data.objectives) {
        let newObj = document.createElement('DIV');
        newObj.className = 'objective';
        newObj.style.left = data.objectives[obj].left + 'px';
        newObj.style.top = data.objectives[obj].top + 'px';
        document.getElementsByTagName('body')[0].appendChild(newObj);
    }
})


getById('moveUp').addEventListener('click', () => moveUp());
getById('moveDown').addEventListener('click', () => moveDown());
getById('moveLeft').addEventListener('click', () => moveLeft());
getById('moveRight').addEventListener('click', () => moveRight());

let moveUp = () => {
    socket.emit('move', 'up');
}

let moveDown = () => {
    socket.emit('move', 'down');
}

let moveLeft = () => {
    socket.emit('move', 'left');
}

let moveRight = () => {
    socket.emit('move', 'right');
}