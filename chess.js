// Code by Alon Cohen
//-to-do:
// instead of bold when hovered, do a text-shadow or smth
// instead of border around valid fields, make background color effect change or smth
// when pawn reaches enemy line it should light up purple and player can trade the pawn for dead player
// Rochade
// touchscreen
// Design

function pickField(event) {
    const field = event.target
    chosenPiece = pieces.find(piece => piece.currentPosition === field.id && piece.team === currentTeam)
    if (chosenPiece) {
        removeHighlightValidFields()
        chosenPiece.getValidFields()
        highlightValidFields()
        removeHighlightValidTargets()
        chosenPiece.getValidTargets()
        highlightValidTargets()
        removeHighlightCurrentTeam()
        removePickFieldEventListeners()
        addMoveEventListeners()
    }
}


function move(event){
    const field = event.target
    const victim = pieces.find(piece => piece.currentPosition === field.id)

    if (chosenPiece.validFields.includes(field)) {
        land(event)
    } else if (chosenPiece.validTargets.includes(field)){
        kill(victim)
        land(event)
    } else {
        if (victim === undefined) {
            // Do nothing.
        } else {
            if (victim.team === chosenPiece.team){
                pickField(event)
            }
        }
    }
}

function land(event){
    chosenPiece.emptyOldField()
    chosenPiece.currentPosition = event.target.id
    chosenPiece.render()
    switchCurrentTeam()
    renderInfo(currentTeamDisplay, 'Current Team: ' + currentTeam)
    removeMoveEventListeners()
    addPickFieldEventListeners()
    removeVisualEventListeners()
    addVisualEventListeners()
    removeHighlightValidFields()
    removeHighlightValidTargets()
    highlightCurrentTeam()
}

function kill(victim){
    const heavenID = 'heaven-'+victim.team
    victim.currentPosition = heavenID
    document.getElementById(heavenID).textContent += victim.pieceUnicode
    switch (victim.team){
        case 'white': heavenWhite.push(victim); break;
        case 'black': heavenBlack.push(victim); break;
    }
    pieces = pieces.filter(victim => victim.currentPosition !== heavenID)
}

function switchCurrentTeam(){
    switch (chosenPiece.team){
        case 'white': currentTeam = 'black'; break;
        case 'black': currentTeam = 'white'; break;
    }
    for (let piece of pieces){
        piece.turn = !piece.turn
    }
}

function addPickFieldEventListeners(){
    for (let field of fields){
        field.addEventListener('click', pickField)
    }
}

function removePickFieldEventListeners() {
    for (let field of fields){
        field.removeEventListener('click', pickField)
    }
}

function addMoveEventListeners(){
    for (let field of fields){
        field.addEventListener('click', move)
    }
}

function removeMoveEventListeners(){
    for (let field of fields){
        field.removeEventListener('click', move)
    }
}

function addVisualEventListeners(){
    for (let field of fields){
        const hoveredPiece = pieces.find(piece => piece.currentPosition === field.id)
        if (field.textContent !== '' && hoveredPiece.turn) {
            field.addEventListener('mouseover', toggle_CSS_hover_class)
            field.addEventListener('mouseout', toggle_CSS_hover_class)
        }
    }
}

function removeVisualEventListeners(){
    for (let field of fields){
        field.removeEventListener('mouseover', toggle_CSS_hover_class)
        field.removeEventListener('mouseout', toggle_CSS_hover_class)
    }
}

function toggle_CSS_hover_class(event){
    event.target.classList.toggle('hover')
}


function highlightValidFields(){
    for (let field of chosenPiece.validFields){
        field.classList.add('valid-fields')
    }
}

function removeHighlightValidFields(){
    for (let field of fields){
        field.classList.remove('valid-fields')
    }
}

function removeHighlightValidTargets(){
    for (let field of fields){
        field.classList.remove('valid-targets')
    }
}

function highlightValidTargets(){
    for (let field of chosenPiece.validTargets){
        field.classList.add('valid-targets')
    }
}

function highlightCurrentTeam(){
    for (let piece of pieces){
        if (piece.team === currentTeam){
            const field = fields.find(field => field.id === piece.currentPosition)
            field.classList.add('blink')
        }
    }
}

function removeHighlightCurrentTeam(){
    for (let field of fields){
        field.classList.remove('blink')
    }
}

function renderInfo(node, content){
    document.getElementById(node.id).textContent = content
}


class Pawn {
    constructor(team, turn, currentPosition, pieceUnicode) {
        this.team = team
        this.turn = turn
        this.currentPosition = currentPosition
        this.pieceUnicode = pieceUnicode
        this.validFields = []
        this.validTargets = []
    }

    render(){
        document.getElementById(this.currentPosition).textContent = this.pieceUnicode
    }

    emptyOldField(){
        document.getElementById(this.currentPosition).textContent = ''
    }
}


class WhitePawn extends Pawn{
    getValidFields(){
        this.validFields = []
        for (let field of fields){
            const startFieldIDLetter = this.currentPosition[0]
            const targetFieldIDLetter = field.id[0]
            const startFieldIDNumber = Number(this.currentPosition[1])
            const targetFieldIDNumber = Number(field.id[1])
            const inBetweenFieldID = targetFieldIDLetter + (targetFieldIDNumber-1).toString()
            const inBetweenField = fields.find(field => inBetweenFieldID === field.id)
            if (startFieldIDLetter === targetFieldIDLetter
                && startFieldIDNumber < targetFieldIDNumber
                && startFieldIDNumber + 2 >= targetFieldIDNumber
                && field.textContent === ''
                && ( inBetweenField.textContent === '' || this.currentPosition === inBetweenFieldID ) )  {
                this.validFields.push(field)
            }
        }
    }

    getValidTargets(){
        this.validTargets = []
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        for (let field of fields){
            const target = pieces.find(piece => piece.currentPosition === field.id)
            if (target){
                const startFieldIDLetterIndex = letters.indexOf( this.currentPosition[0] )
                const targetFieldIDLetterIndex = letters.indexOf( target.currentPosition[0] )
                const startFieldIDNumber = Number( this.currentPosition[1] )
                const targetFieldIDNumber = Number( target.currentPosition[1] )
                if (target.team !== this.team
                    && startFieldIDNumber + 1 === targetFieldIDNumber
                    && ( startFieldIDLetterIndex + 1 === targetFieldIDLetterIndex || startFieldIDLetterIndex - 1 === targetFieldIDLetterIndex ) ){
                    this.validTargets.push(field)
                }
            }
        }
    }
}


class BlackPawn extends Pawn{
    getValidFields(){
        this.validFields = []
        for (let field of fields){
            const startFieldIDLetter = this.currentPosition[0]
            const targetFieldIDLetter = field.id[0]
            const startFieldIDNumber = Number(this.currentPosition[1])
            const targetFieldIDNumber = Number(field.id[1])
            const inBetweenFieldID = targetFieldIDLetter + (targetFieldIDNumber+1).toString()
            const inBetweenField = fields.find(field => inBetweenFieldID === field.id)
            if (startFieldIDLetter === targetFieldIDLetter
                && startFieldIDNumber > targetFieldIDNumber
                && startFieldIDNumber - 2 <= targetFieldIDNumber
                && field.textContent === ''
                && ( inBetweenField.textContent === '' || this.currentPosition === inBetweenFieldID ) )  {
                this.validFields.push(field)
            }
        }
    }

    getValidTargets(){
        this.validTargets = []
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        for (let field of fields){
            const target = pieces.find(piece => piece.currentPosition === field.id)
            if (target){
                const startFieldIDLetterIndex = letters.indexOf( this.currentPosition[0] )
                const targetFieldIDLetterIndex = letters.indexOf( target.currentPosition[0] )
                const startFieldIDNumber = Number( this.currentPosition[1] )
                const targetFieldIDNumber = Number( target.currentPosition[1] )
                if (target.team !== this.team
                    && startFieldIDNumber - 1 === targetFieldIDNumber
                    && ( startFieldIDLetterIndex + 1 === targetFieldIDLetterIndex || startFieldIDLetterIndex - 1 === targetFieldIDLetterIndex ) ){
                    this.validTargets.push(field)
                }
            }
        }
    }
}


class Rook extends Pawn {
    getValidFields() {
        this.validFields = []
        this.validTargets = []
        const pieceCoords = field_coords[this.currentPosition]

        for (let i = 1; i <= 7; i++) {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] + i)
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team) {
                        break;
                    } else {
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i = 1; i <= 7; i++) {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] - i)
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team) {
                        break;
                    } else {
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i = 1; i <= 7; i++) {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] + i && field_coords[ID][1] === pieceCoords[1] )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team) {
                        break;
                    } else {
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i = 1; i <= 7; i++) {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] - i && field_coords[ID][1] === pieceCoords[1] )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team) {
                        break;
                    } else {
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }
    }
    getValidTargets(){
        //
    }

}

class Knight extends Pawn {
    getValidFields() {
        this.validFields = []
        this.validTargets = []
        const pieceCoords = field_coords[this.currentPosition]
        for (let field of fields){
            const targetCoords = field_coords[field.id]
            if (   ( targetCoords[0] === pieceCoords[0]-1 && targetCoords[1] === pieceCoords[1]+2 )
                || ( targetCoords[0] === pieceCoords[0]+1 && targetCoords[1] === pieceCoords[1]+2 )
                || ( targetCoords[0] === pieceCoords[0]-1 && targetCoords[1] === pieceCoords[1]-2 )
                || ( targetCoords[0] === pieceCoords[0]+1 && targetCoords[1] === pieceCoords[1]-2 )
                || ( targetCoords[0] === pieceCoords[0]-2 && targetCoords[1] === pieceCoords[1]+1 )
                || ( targetCoords[0] === pieceCoords[0]+2 && targetCoords[1] === pieceCoords[1]+1 )
                || ( targetCoords[0] === pieceCoords[0]-2 && targetCoords[1] === pieceCoords[1]-1 )
                || ( targetCoords[0] === pieceCoords[0]+2 && targetCoords[1] === pieceCoords[1]-1 ) ){
                if (field.textContent === ''){
                    this.validFields.push(field)
                } if (field.textContent !== '') {
                    const targetPiece = pieces.find(piece => piece.currentPosition === field.id)
                    if (targetPiece && targetPiece.team !== this.team) {
                        this.validTargets.push(field)
                    }
                }
            }
        }
    }

    getValidTargets() {
        // chill
    }
}

class Bishop extends Pawn {
    getValidFields() {
        this.validFields = []
        this.validTargets = []
        const pieceCoords = field_coords[this.currentPosition]

        for (let i=1; i <= 7; i++){
            const targetID = Object.keys(field_coords).find( ID => field_coords[ID][0] === pieceCoords[0]+i && field_coords[ID][1] === pieceCoords[1]+i )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if ( targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team){
                        break;
                    } else{
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i=1; i <= 7; i++){
            const targetID = Object.keys(field_coords).find( ID => field_coords[ID][0] === pieceCoords[0]-i && field_coords[ID][1] === pieceCoords[1]+i )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if ( targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team){
                        break;
                    } else{
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i=1; i <= 7; i++){
            const targetID = Object.keys(field_coords).find( ID => field_coords[ID][0] === pieceCoords[0]+i && field_coords[ID][1] === pieceCoords[1]-i )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if ( targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team){
                        break;
                    } else{
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i=1; i <= 7; i++){
            const targetID = Object.keys(field_coords).find( ID => field_coords[ID][0] === pieceCoords[0]-i && field_coords[ID][1] === pieceCoords[1]-i )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if ( targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team){
                        break;
                    } else{
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }
    }

    getValidTargets() {
        // Later code for all pieces should be refactored to combine getValidFields() and getValidTarget() into one method, as they depend heavily on each other
    }
}

class Queen extends Pawn{
    getValidFields() {
        this.validFields = []
        this.validTargets = []
        const pieceCoords = field_coords[this.currentPosition]

        for (let i = 1; i <= 7; i++) {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] + i)
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team) {
                        break;
                    } else {
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i = 1; i <= 7; i++) {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] - i)
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team) {
                        break;
                    } else {
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i = 1; i <= 7; i++) {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] + i && field_coords[ID][1] === pieceCoords[1] )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team) {
                        break;
                    } else {
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i = 1; i <= 7; i++) {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] - i && field_coords[ID][1] === pieceCoords[1] )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team) {
                        break;
                    } else {
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }
        for (let i=1; i <= 7; i++){
            const targetID = Object.keys(field_coords).find( ID => field_coords[ID][0] === pieceCoords[0]+i && field_coords[ID][1] === pieceCoords[1]+i )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if ( targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team){
                        break;
                    } else{
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i=1; i <= 7; i++){
            const targetID = Object.keys(field_coords).find( ID => field_coords[ID][0] === pieceCoords[0]-i && field_coords[ID][1] === pieceCoords[1]+i )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if ( targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team){
                        break;
                    } else{
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i=1; i <= 7; i++){
            const targetID = Object.keys(field_coords).find( ID => field_coords[ID][0] === pieceCoords[0]+i && field_coords[ID][1] === pieceCoords[1]-i )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if ( targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team){
                        break;
                    } else{
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }

        for (let i=1; i <= 7; i++){
            const targetID = Object.keys(field_coords).find( ID => field_coords[ID][0] === pieceCoords[0]-i && field_coords[ID][1] === pieceCoords[1]-i )
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if ( targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    const targetPiece = pieces.find(piece => piece.currentPosition === targetField.id)
                    if (targetPiece.team === this.team){
                        break;
                    } else{
                        this.validTargets.push(targetField)
                        break;
                    }
                }
            } else {
                break;
            }
        }
    }
    getValidTargets(){
        //
    }
}

class King extends Pawn{
    getValidFields(){
        this.validFields = []
        this.validTargets = []
        const pieceCoords = field_coords[this.currentPosition]
        for (let field of fields){
            const targetCoords = field_coords[field.id]
            if (   ( targetCoords[0] === pieceCoords[0] && targetCoords[1] === pieceCoords[1]+1 )
                || ( targetCoords[0] === pieceCoords[0] && targetCoords[1] === pieceCoords[1]-1 )
                || ( targetCoords[0] === pieceCoords[0]+1 && targetCoords[1] === pieceCoords[1]+1 )
                || ( targetCoords[0] === pieceCoords[0]+1 && targetCoords[1] === pieceCoords[1]-1 )
                || ( targetCoords[0] === pieceCoords[0]+1 && targetCoords[1] === pieceCoords[1] )
                || ( targetCoords[0] === pieceCoords[0]-1 && targetCoords[1] === pieceCoords[1]+1 )
                || ( targetCoords[0] === pieceCoords[0]-1 && targetCoords[1] === pieceCoords[1]-1 )
                || ( targetCoords[0] === pieceCoords[0]-1 && targetCoords[1] === pieceCoords[1] ) ){
                if (field.textContent === ''){
                    this.validFields.push(field)
                } if (field.textContent !== '') {
                    const targetPiece = pieces.find(piece => piece.currentPosition === field.id)
                    if (targetPiece && targetPiece.team !== this.team) {
                        this.validTargets.push(field)
                    }
                }
            }
        }
    }
    getValidTargets(){
        //
    }
}

// Creating pieces
let pieces = []
let heavenWhite = []
let heavenBlack = []

const pawn1_white = new WhitePawn('white', true,'a2', '♙')
const pawn2_white = new WhitePawn('white', true,'b2', '♙')
const pawn3_white = new WhitePawn('white', true,'c2', '♙')
const pawn4_white = new WhitePawn('white', true,'d2', '♙')
const pawn5_white = new WhitePawn('white', true,'e2', '♙')
const pawn6_white = new WhitePawn('white', true,'f2', '♙')
const pawn7_white = new WhitePawn('white', true,'g2', '♙')
const pawn8_white = new WhitePawn('white', true,'h2', '♙')

const rook1_white = new Rook('white', true, 'a1', '♖')
const rook2_white = new Rook('white', true, 'h1', '♖')

const knight1_white = new Knight('white', true, 'b1', '♘')
const knight2_white = new Knight('white', true, 'c1', '♘')

const bishop1_white = new Bishop('white', true, 'c1', '♗')
const bishop2_white = new Bishop('white', true, 'f1', '♗')

const queen_white = new Queen('white', true, 'd1', '♕')

const king_white = new King('white', true, 'e1', '♔')

const pawn1_black = new BlackPawn('black', false, 'a7', '♟')
const pawn2_black = new BlackPawn('black', false, 'b7', '♟')
const pawn3_black = new BlackPawn('black', false, 'c7', '♟')
const pawn4_black = new BlackPawn('black', false, 'd7', '♟')
const pawn5_black = new BlackPawn('black', false, 'e7', '♟')
const pawn6_black = new BlackPawn('black', false, 'f7', '♟')
const pawn7_black = new BlackPawn('black', false, 'g7', '♟')
const pawn8_black = new BlackPawn('black', false, 'h7', '♟')

const rook1_black = new Rook('black', false, 'a8', '♜')
const rook2_black = new Rook('black', false, 'h8', '♜')

const knight1_black = new Knight('black', false, 'b8', '♞')
const knight2_black = new Knight('black', false, 'g8', '♞')

const bishop1_black = new Bishop('black', false, 'c8', '♝')
const bishop2_black = new Bishop('black', false, 'f8', '♝')

const queen_black = new Queen('black', false, 'd8', '♛')

const king_black = new King('black', false, 'e8', '♚')

pieces.push(pawn1_white, pawn2_white, pawn3_white, pawn4_white, pawn5_white, pawn6_white, pawn7_white, pawn8_white,
            rook1_white, rook2_white,
            knight1_white, knight2_white,
            bishop1_white, bishop2_white,
            queen_white,
            king_white,
            pawn1_black, pawn2_black, pawn3_black, pawn4_black, pawn5_black, pawn6_black, pawn7_black, pawn8_black,
            rook1_black, rook2_black,
            knight1_black, knight2_black,
            bishop1_black, bishop2_black,
            queen_black,
            king_black)


//Rendering pieces on the board
for (let piece of pieces){
    piece.render()
}


// Setting the fields
const field_IDs = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
                   'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
                   'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
                   'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
                   'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8',
                   'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8',
                   'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
                   'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8']

const field_coords = {a1: [1, 1], a2: [1, 2], a3: [1, 3], a4: [1, 4], a5: [1, 5], a6: [1, 6], a7: [1, 7], a8: [1, 8],
                      b1: [2, 1], b2: [2, 2], b3: [2, 3], b4: [2, 4], b5: [2, 5], b6: [2, 6], b7: [2, 7], b8: [2, 8],
                      c1: [3, 1], c2: [3, 2], c3: [3, 3], c4: [3, 4], c5: [3, 5], c6: [3, 6], c7: [3, 7], c8: [3, 8],
                      d1: [4, 1], d2: [4, 2], d3: [4, 3], d4: [4, 4], d5: [4, 5], d6: [4, 6], d7: [4, 7], d8: [4, 8],
                      e1: [5, 1], e2: [5, 2], e3: [5, 3], e4: [5, 4], e5: [5, 5], e6: [5, 6], e7: [5, 7], e8: [5, 8],
                      f1: [6, 1], f2: [6, 2], f3: [6, 3], f4: [6, 4], f5: [6, 5], f6: [6, 6], f7: [6, 7], f8: [6, 8],
                      g1: [7, 1], g2: [7, 2], g3: [7, 3], g4: [7, 4], g5: [7, 5], g6: [7, 6], g7: [7, 7], g8: [7, 8],
                      h1: [8, 1], h2: [8, 2], h3: [8, 3], h4: [8, 4], h5: [8, 5], h6: [8, 6], h7: [8, 7], h8: [8, 8]}

const fields = []
for (let field of field_IDs){
    fields.push(document.getElementById(field))
}


// Declaring Piece later chosen by Player (at start undefined) and turn
let chosenPiece
let currentTeam = 'white'
const currentTeamDisplay = document.getElementById('current-team-display')

renderInfo(currentTeamDisplay, 'Current Team: ' + currentTeam)

// Setting Event Handlers
addPickFieldEventListeners()
addVisualEventListeners()
highlightCurrentTeam()

/*
class Rook extends Pawn{
    getValidFields(){
        this.validFields = []
        const startField_X = field_coords[this.currentPosition][0]
        const startField_Y = field_coords[this.currentPosition][1]
        for (let field of fields){
            const targetField_X = field_coords[field.id][0]
            const targetField_Y = field_coords[field.id][1]
            if (field.id !== this.currentPosition
                && ( targetField_X === startField_X || targetField_Y === startField_Y ) ){
                this.validFields.push(field)
            }
        }
        const stopFields_Y = []
        for (let field of this.validFields){
            const targetField_X = field_coords[field.id][0]
            const targetField_Y = field_coords[field.id][1]
            if (field.textContent !== ''
                && targetField_X === startField_X ) {
                stopFields_Y.push(targetField_Y)
            }
        }
        let closestOccupiedFieldUp_Y = Math.max(...stopFields_Y)
        let closestOccupiedFieldDown_Y = Math.min(...stopFields_Y)
        const tempList = []
        for (let field of this.validFields){
            const targetField_Y = field_coords[field.id][1]
            if (targetField_Y < closestOccupiedFieldDown_Y
                && targetField_Y > closestOccupiedFieldUp_Y){
                tempList.push(field)
            }
        }
        this.validFields = tempList
    }

    getValidTargets(){
        this.validTargets = []
    }
}
*/



/*
class Rook extends Pawn{
    getValidFields(){
        this.validFields = []
        this.stopFieldsY_Axis = []
        this.stopFieldsY_Axis_IDNumbers = []
        const startFieldIDLetter = this.currentPosition[0]
        for (let field of fields){
            const targetFieldIDLetter = field.id[0]
            const startFieldIDNumber = Number(this.currentPosition[1])
            const targetFieldIDNumber = Number(field.id[1])
            if (field.textContent !== ''
                && field.id !== this.currentPosition
                && targetFieldIDLetter === startFieldIDLetter){
                this.stopFieldsY_Axis.push(field)
                this.stopFieldsY_Axis_IDNumbers.push(targetFieldIDNumber)
            }
            if ( startFieldIDLetter === targetFieldIDLetter || startFieldIDNumber === targetFieldIDNumber ) {
                this.validFields.push(field)
            }
        }
        const lowestFieldsY_Axis_IDNumber = Math.min(...this.stopFieldsY_Axis_IDNumbers)
        const stopFieldDown = this.stopFieldsY_Axis.find(field => Number(field.id[1]) === lowestFieldsY_Axis_IDNumber)

        for (let field of this.validFields){
            const targetFieldIDLetter = field.id[0]
            const targetFieldIDNumber = Number(field.id[1])
            if (targetFieldIDLetter === startFieldIDLetter
                && stopFieldDown.id[1] > targetFieldIDNumber){
                this.validFields = this.validFields.filter(e => e === field )
            }
        }
    }

    getValidTargets(){
        this.validTargets = []
    }
}
*/