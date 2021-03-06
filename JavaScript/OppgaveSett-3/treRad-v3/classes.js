﻿// JavaScript source code
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
        cell.classList.add('gameboard');
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
        if (validCells.length <= 1) {
            this._isGameStopped = true;
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
    constructor(game, gameBoard) {
        this._game = game;
        this._gameBoard = document.getElementById(gameBoard);
        this._cellViews = []
        this._outputField;

        let cells = game.getCells();
        for (let cell of cells) {
            this._cellViews.push(new CellView(cell));
        }
    }

    show() {
        this._gameBoard.innerHTML = '';
        for (let cellView of this._cellViews) {
            this._gameBoard.appendChild(cellView.getCell());
        }

        if (game.isStopped()) {
            let output = this.getOutputField();
            if (game.getWinner() === null) {
                output.innerHTML = 'Ingen vant :(';
            }
            else {
                output.innerHTML = game.getWinner() + ' vant!'
            }
            output.innerHTML += '<br /><a href="javascript:gameController.restart()">Start på nytt<a>';
        }
    }

    getOutputField() {
        if (this._outputField === undefined || this._outputField === null) {
            this._outputField = document.createElement('div');
            this._outputField.classList.add('first');
        }
        this._gameBoard.appendChild(this._outputField);
        return this._outputField;
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
        clearTimeout(timeout);
        this._game.setX(index);
        updateView();
    }
}

var timeout = setTimeout(function () {
    gameView.getOutputField().innerHTML = `Ok, I guess I'll start then.`;
    game.setO();
    updateView();
}, 60000);
