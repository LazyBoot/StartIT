// JavaScript source code
'use strict';

class Cell {
    constructor(index) {
        this._content = null;
        this._index = index;
    }

    setX() {
        this._content = 'x';
    }

    setO() {
        this._content = 'o';
    }

    getContent() {
        if (this._content === null) return '';
        return this._content;
    }

    index() {
        return this._index;
    }

    isFirstInRow() {
        return this._index % 3 === 0
    }

    isBlank() {
        return this._content === null;
    }

    isX() {
        return this._content === 'x';
    }
}

class CellView {
    constructor(cell) {
        this._cell = cell;
    }

    getCell() {
        let index = this._cell.index();
        let cell = document.createElement('div');
        let content = this._cell.getContent();

        if (this._cell.isFirstInRow())
            cell.classList.add('first');
        cell.classList.add('color' + content.toUpperCase());
        cell.addEventListener('click', function () { gameController.setX(index) });
        cell.innerHTML = content;

        return cell;
    }
}

class Game {
    constructor() {
        this._cells = [];
        for (let i = 0; i < 9; i++) {
            this._cells.push(new Cell(i));
        }

        this._isGameStopped = false;
        this._winner = null;
    }

    getCells() {
        return this._cells;
    }

    setX(index) {
        if (this._isGameStopped || !this._cells[index].isBlank()) return;

        this._cells[index].setX();
        this.checkWin();
        this.setO();
    }

    setO() {
        if (this._isGameStopped) return;
        let validCells = [];
        for (let i = 0; i < this._cells.length; i++) {
            if (this._cells[i].isBlank())
                validCells.push(this._cells[i]);
        }
        if (validCells.length > 0) {
            let index = Math.floor(Math.random() * validCells.length);
            validCells[index].setO();
        }
        this.checkWin();
    }

    checkWin() {
        return this.checkCells(0, 1, 2)
            || this.checkCells(3, 4, 5)
            || this.checkCells(6, 7, 8)
            || this.checkCells(0, 3, 6)
            || this.checkCells(1, 4, 7)
            || this.checkCells(2, 5, 8)
            || this.checkCells(0, 4, 8)
            || this.checkCells(2, 4, 6);

    }

    checkCells(index0, index1, index2) {
        let cell0 = this._cells[index0];
        let cell1 = this._cells[index1];
        let cell2 = this._cells[index2];
        if (
            !cell0.isBlank()
            && cell1.getContent() === cell0.getContent()
            && cell2.getContent() === cell0.getContent()
        ) {
            this._winner = cell0.isX() ? 'Du' : 'Datamaskinen';
            this._isGameStopped = true;
            return true;
        }
    }

    isStopped() {
        return this._isGameStopped;
    }

    getWinner() {
        return this._winner;
    }
}

class GameView {
    constructor(game) {
        this._game = game;
        this._gameBoard = document.getElementById('grid');
        this._cellViews = []

        let cells = game.getCells();
        for (let i in cells) {
            let cell = cells[i];
            this._cellViews.push(new CellView(cell));
        }
    }

    show() {
        this._gameBoard.innerHTML = '';
        for (let i in this._cellViews) {
            let cellView = this._cellViews[i];
            this._gameBoard.appendChild(cellView.getCell());
        }

        if (game.isStopped()) {
            let output = document.getElementById('output');
            if (output === null) {
                let output = document.createElement('div');
                output.setAttribute('id', 'output');
            }
            this._gameBoard.parentNode.appendChild(output);
            output.classList.add('first');
            if (game.getWinner === null) {
                output.innerHTML = 'Ingen vant :(';
            }
            else {
                output.innerHTML = game.getWinner() + ' vant!'
            }
            output.innerHTML += '<br /><a href="javascript:gameController.restart()">Start på nytt<a>';
        }
    }
}

class GameController {
    constructor(game) {
        this._game = game;
    }

    restart() {
        location.reload();
    }

    setX(index) {
        this._game.setX(index);
        updateView();
    }
}

setTimeout(function () {
    alert(`Ok, I'll start then`);
    game.setO();
    updateView();
}, 120000);
