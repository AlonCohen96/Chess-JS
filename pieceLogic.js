import {fields, field_coords, blackHeaven, whiteHeaven} from "./setup.js";
import {classic} from './startNewGame.js'



export class Pawn {
    constructor(team, turn, currentPosition, pieceUnicode) {
        this.team = team
        this.turn = turn
        this.currentPosition = currentPosition
        this.pieceUnicode = pieceUnicode
        this.validFields = []
        this.validTargets = []
        this.promotionFields = []
    }

    render(){
        document.getElementById(this.currentPosition).textContent = this.pieceUnicode
    }

    emptyOldField(){
        document.getElementById(this.currentPosition).textContent = ''
    }

    scanForCheck(){
        this.validTargets = []
        this.getValidFields()
        const enemyKingPiece = pieces.find(piece => piece.constructor.name === 'King' && piece.team !== this.team)
        for (let field of this.validTargets){
            if ( enemyKingPiece.currentPosition === field.id) {
                console.log(`${enemyKingPiece.team} King is in check!`)
                return true
            }
        }
    }

    checkIfMovePutsOwnKingInCheck(){
        const enemyPieces = pieces.filter(piece => piece.team !== this.team)
        const ownField = fields.find(field => field.id === this.currentPosition)
        const kingPiece = pieces.find(piece => piece.team === this.team && piece.constructor.name === 'King')
        const kingField = fields.find(field => field.id === kingPiece.currentPosition)
        ownField.textContent = ''
        for (let piece of enemyPieces){
            piece.getValidFields()
            if ( piece.validTargets.includes(kingField) ){
                const newValidFields = []
                for (let field of this.validFields){
                    field.textContent = 'f'
                    piece.getValidFields()
                    if ( !piece.validTargets.includes(kingField) ) {
                        newValidFields.push(field)
                    }
                    field.textContent = ''
                }
                this.validFields = newValidFields
                const pieceField = fields.find(field => field.id === piece.currentPosition)
                this.validTargets = this.validTargets.filter(field => field === pieceField)
                ownField.textContent = this.pieceUnicode
            }
        }
        ownField.textContent = this.pieceUnicode
    }
}


export class WhitePawn extends Pawn{
    getValidFields() {
        this.validFields = []
        this.validTargets = []
        this.promotionFields = []
        const pieceCoords = field_coords[this.currentPosition]

        if (pieceCoords[1] === 2){
            for (let i = 1; i <= 2; i++) {
                const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] + i)
                const targetField = fields.find(field => field.id === targetID)
                if (targetField && targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    break;
                }
            }
        } else {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] + 1)
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    if (this.checkPromoteOption(targetField)) {
                        this.promotionFields.push(targetField)
                    } else {
                        this.validFields.push(targetField)
                    }
                }
            }
        }

        for (let field of fields){
            const targetCoords = field_coords[field.id]
            if (field.textContent !== ''
                &&   ( (targetCoords[0] === pieceCoords[0]+1 && targetCoords[1] === pieceCoords[1]+1)
                    || (targetCoords[0] === pieceCoords[0]-1 && targetCoords[1] === pieceCoords[1]+1) ) ){
                const targetPiece = pieces.find(piece => piece.currentPosition === field.id)
                if (targetPiece && targetPiece.team !== this.team){
                    this.validTargets.push(field)
                    if (this.checkPromoteOption(field)) {
                        this.promotionFields.push(field)
                    }
                }
            }
        }
    }

    checkPromoteOption(targetField){
        let heavenIsEmpty = true
        for (let subHeaven of whiteHeaven){
            if (subHeaven.textContent !== ''){
                heavenIsEmpty = false
                break;
            }
        }
        if (heavenIsEmpty){
            return false
        }

        const promotionField_IDs = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']
        if ( promotionField_IDs.includes(targetField.id) ) {
            return true
        }
    }
}


export class BlackPawn extends Pawn{
    getValidFields() {
        this.validFields = []
        this.validTargets = []
        const pieceCoords = field_coords[this.currentPosition]

        if (pieceCoords[1] === 7){
            for (let i = 1; i <= 2; i++) {
                const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] - i)
                const targetField = fields.find(field => field.id === targetID)
                if (targetField && targetField.textContent === '') {
                    this.validFields.push(targetField)
                } else {
                    break;
                }
            }
        } else {
            const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] - 1)
            const targetField = fields.find(field => field.id === targetID)
            if (targetField) {
                if (targetField.textContent === '') {
                    if (this.checkPromoteOption(targetField)) {
                        this.promotionFields.push(targetField)
                    } else {
                        this.validFields.push(targetField)
                    }
                }
            }
        }

        for (let field of fields){
            const targetCoords = field_coords[field.id]
            if (field.textContent !== ''
                &&   ( (targetCoords[0] === pieceCoords[0]+1 && targetCoords[1] === pieceCoords[1]-1)
                    || (targetCoords[0] === pieceCoords[0]-1 && targetCoords[1] === pieceCoords[1]-1) ) ){
                const targetPiece = pieces.find(piece => piece.currentPosition === field.id)
                if (targetPiece && targetPiece.team !== this.team){
                    this.validTargets.push(field)
                    if (this.checkPromoteOption(field)) {
                        this.promotionFields.push(field)
                    }
                }
            }
        }
    }

    checkPromoteOption(targetField){
        let heavenIsEmpty = true
        for (let subHeaven of blackHeaven){
            if (subHeaven.textContent !== ''){
                heavenIsEmpty = false
                break;
            }
        }
        if (heavenIsEmpty){
            return false
        }

        const promotionField_IDs = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
        if ( promotionField_IDs.includes(targetField.id) ) {
            return true
        }
    }
}

export class Rook extends Pawn {
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
                    if (targetPiece && targetPiece.team === this.team) {
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
                    if (targetPiece && targetPiece.team === this.team) {
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
                    if (targetPiece && targetPiece.team === this.team) {
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
                    if (targetPiece && targetPiece.team === this.team) {
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
}


export class Knight extends Pawn {
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
}

export class Bishop extends Pawn {
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
                    if (targetPiece && targetPiece.team === this.team){
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
                    if (targetPiece && targetPiece.team === this.team){
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
                    if (targetPiece && targetPiece.team === this.team){
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
                    if (targetPiece && targetPiece.team === this.team){
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
}

export class Queen extends Pawn{
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
                    if (targetPiece && targetPiece.team === this.team) {
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
                    if (targetPiece && targetPiece.team === this.team) {
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
                    if (targetPiece && targetPiece.team === this.team) {
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
                    if (targetPiece && targetPiece.team === this.team) {
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
                    if (targetPiece && targetPiece.team === this.team){
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
                    if (targetPiece && targetPiece.team === this.team){
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
                    if (targetPiece && targetPiece.team === this.team){
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
                    if (targetPiece && targetPiece.team === this.team){
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
}

export class King extends Pawn{
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

    avoidCheckFields () {
        // First for all pieces except Pawns because those are annoying to deal with
        const enemyPieces = pieces.filter(piece => piece.team !== this.team && piece.constructor.name !== 'BlackPawn' && piece.constructor.name !== 'WhitePawn' )
        const kingField = fields.find(field => field.id === this.currentPosition)
        kingField.textContent = ''
        let allValidFields = []
        for (let piece of enemyPieces) {
            piece.getValidFields()
            allValidFields.push(...piece.validFields)
        }
        this.validFields = this.validFields.filter(field => !allValidFields.includes(field) )
        kingField.textContent = this.pieceUnicode

        // Now we deal with the Pawn logic
        if (this.team === 'black') {
            const enemyPawns = pieces.filter(piece => piece.team !== this.team && piece.constructor.name === 'WhitePawn')
            let pawnTargetFields = []
            for (let pawn of enemyPawns) {
                const pawnCoords = field_coords[pawn.currentPosition]
                const targetIDs = Object.keys(field_coords).filter(ID => (field_coords[ID][0] === pawnCoords[0] + 1 && field_coords[ID][1] === pawnCoords[1] + 1)
                    || field_coords[ID][0] === pawnCoords[0] - 1 && field_coords[ID][1] === pawnCoords[1] + 1)

                pawnTargetFields.push(...fields.filter(field => targetIDs.includes(field.id)))
            }
            this.validFields = this.validFields.filter(field => !pawnTargetFields.includes(field) )
            this.validTargets = this.validTargets.filter(field => !pawnTargetFields.includes(field) )
        }
        if (this.team === 'white') {
            const enemyPawns = pieces.filter(piece => piece.team !== this.team && piece.constructor.name === 'BlackPawn')
            let pawnTargetFields = []
            for (let pawn of enemyPawns) {
                const pawnCoords = field_coords[pawn.currentPosition]
                const targetIDs = Object.keys(field_coords).filter(ID => (field_coords[ID][0] === pawnCoords[0] + 1 && field_coords[ID][1] === pawnCoords[1] - 1)
                    || field_coords[ID][0] === pawnCoords[0] - 1 && field_coords[ID][1] === pawnCoords[1] - 1)

                pawnTargetFields.push( ...fields.filter( field => targetIDs.includes(field.id) ) )
            }
            this.validFields = this.validFields.filter( field => !pawnTargetFields.includes(field) )
            this.validTargets = this.validTargets.filter(field => !pawnTargetFields.includes(field) )
        }

        // Now we avoid targets that will put the King in check if he captures them
        kingField.textContent = ''
        for (let targetField of this.validTargets){
            const pieceUnicode = targetField.textContent
            targetField.textContent = ''
            for (let piece of enemyPieces){
                piece.getValidFields()
                if (piece.validFields.includes(targetField)) {
                    this.validTargets = this.validTargets.filter( field => field !== targetField)
                }
            }
            targetField.textContent = pieceUnicode
        }
        kingField.textContent = this.pieceUnicode
    }
}

const pieces = classic()