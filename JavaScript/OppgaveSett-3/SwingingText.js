class SwingingText {
    constructor(speed, id, text, color) {
        this._speed = speed;
        this._id = id;
        this._text = text;
        this._color = color;
        this._x = 0;
        this._angle = 0;
    }

    getHtml() {
        return '<text id="' + this._id
            + '" x="' + this._x + '" y="40" fill="'
            + this._color + '">'
            + this._text + '</text>';
    }

    moveAndGetX() {
        this._angle = (this._angle + this._speed) % 360;
        this._x = Math.round(40 + 40 * Math.sin(Math.PI * this._angle / 180));
        var txtElement = document.getElementById(this._id);
        txtElement.setAttribute('x', this._x + '%');
    }

}
