import {Bishop, BlackPawn, King, Knight, Queen, Rook, WhitePawn} from './pieceLogic.js'
import {fields, blackHeaven, whiteHeaven, audioPieceMove, audioPieceKill, audioGameOver} from "./setup.js";

export function classic () {
    const pawn1_white = new WhitePawn('white', true, 'a2', '♙')
    const pawn2_white = new WhitePawn('white', true, 'b2', '♙')
    const pawn3_white = new WhitePawn('white', true, 'c2', '♙')
    const pawn4_white = new WhitePawn('white', true, 'd2', '♙')
    const pawn5_white = new WhitePawn('white', true, 'e2', '♙')
    const pawn6_white = new WhitePawn('white', true, 'f2', '♙')
    const pawn7_white = new WhitePawn('white', true, 'g2', '♙')
    const pawn8_white = new WhitePawn('white', true, 'h2', '♙')

    const rook1_white = new Rook('white', true, 'a1', '♖')
    const rook2_white = new Rook('white', true, 'h1', '♖')

    const knight1_white = new Knight('white', true, 'b1', '♘')
    const knight2_white = new Knight('white', true, 'g1', '♘')

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

    let pieces = []
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

    return pieces
}

function startNewGame(pieces) {
    let chosenPiece
    let currentTeam = 'white'
    let checkmate = false
    renderBoard()
    addPickFieldEventListeners()
    addVisualEventListeners()
    highlightCurrentTeam()

    function renderBoard(){
        for (let piece of pieces) {
            piece.render()
        }
    }

    function pickField(event) {
        const field = event.target
        chosenPiece = pieces.find(piece => piece.currentPosition === field.id && piece.team === currentTeam)
        if (chosenPiece) {
            removeCSS_class('valid-fields')
            chosenPiece.getValidFields()
            if (chosenPiece.constructor.name === 'King') {
                chosenPiece.avoidCheckFields()
            } else {
                chosenPiece.checkIfMovePutsOwnKingInCheck()
            }
            highlightValidFields()
            removeCSS_class('valid-targets')
            highlightValidTargets()
            removeCSS_class('promotion-field')
            highlightPromotionField()
            removeHighlightCurrentTeam()
            removePickFieldEventListeners()
            addMoveEventListeners()
        }
    }

    function move(event) {
        const targetField = event.target
        const victim = pieces.find(piece => piece.currentPosition === targetField.id)

        if (chosenPiece.promotionFields.includes(targetField)) {
            if (victim) {
                kill(victim)
            }
            landOnPromotionField(event)
            audioPieceMove.play()
        } else if (chosenPiece.validTargets.includes(targetField)) {
            kill(victim)
            land(event)
            audioPieceKill.play()
        } else if (chosenPiece.validFields.includes(targetField)) {
            land(event)
            audioPieceMove.play()
        } else {
            if (victim && victim.team === chosenPiece.team) {
                pickField(event)
            }
        }
    }

    function land(event) {
        chosenPiece.emptyOldField()
        chosenPiece.currentPosition = event.target.id
        chosenPiece.render()
        removeCSS_class('check')

        if (scanForNoLegalMovesLeft()) {
            for (let piece of pieces) {
                if (piece.scanForCheck()) {
                    // Checkmate
                    checkmate = true
                    highlightCheckField()
                    audioGameOver.play()
                    announceWinner(currentTeam)
                    break;
                }
            }
            if (!checkmate) {
                // Stalemate
                audioGameOver.play()
                announceStalemate()
            }
        } else {
            for (let piece of pieces) {
                if (piece.scanForCheck()) {
                    // Check
                    highlightCheckField()
                }
            }
        }

        switchCurrentTeam()
        removeMoveEventListeners()
        addPickFieldEventListeners()
        removeVisualEventListeners()
        addVisualEventListeners()
        removeCSS_class('valid-fields')
        removeCSS_class('valid-targets')
        removeCSS_class('promotion-field')
        highlightCurrentTeam()
    }

    function highlightCheckField() {
        const enemyKingPiece = pieces.find(piece => piece.constructor.name === 'King' && piece.team !== chosenPiece.team)
        const enemyKingField = fields.find(field => field.id === enemyKingPiece.currentPosition)
        enemyKingField.classList.add('check')
    }

    function removeCSS_class(CSS_class) {
        for (let field of fields) {
            field.classList.remove(CSS_class)
        }
    }

    function scanForNoLegalMovesLeft() {
        const defendingPieces = pieces.filter(piece => piece.team !== chosenPiece.team)
        for (let piece of defendingPieces) {
            piece.getValidFields()
            if (piece.constructor.name === 'King') {
                piece.avoidCheckFields()
            } else {
                piece.checkIfMovePutsOwnKingInCheck()
            }
            if (piece.validTargets.length > 0 || piece.validFields.length > 0) {
                console.log('Legal moves left.')
                return false
            }
        }
        console.log('No legal moves left. Game over.')
        return true
    }

    function kill(victim) {
        const heavenID = 'heaven-' + victim.team
        victim.currentPosition = heavenID
        if (victim.team === 'white') {
            switch (victim.constructor.name) {
                case 'WhitePawn':
                    renderPieceToHeaven('pawns-white', victim);
                    break;
                case 'Rook'     :
                    renderPieceToHeaven('rooks-white', victim);
                    break;
                case 'Knight'   :
                    renderPieceToHeaven('knights-white', victim);
                    break;
                case 'Bishop'   :
                    renderPieceToHeaven('bishops-white', victim);
                    break;
                case 'Queen'    :
                    renderPieceToHeaven('queen-white', victim);
                    break;
            }
        } else {
            switch (victim.constructor.name) {
                case 'BlackPawn':
                    renderPieceToHeaven('pawns-black', victim);
                    break;
                case 'Rook'     :
                    renderPieceToHeaven('rooks-black', victim);
                    break;
                case 'Knight'   :
                    renderPieceToHeaven('knights-black', victim);
                    break;
                case 'Bishop'   :
                    renderPieceToHeaven('bishops-black', victim);
                    break;
                case 'Queen'    :
                    renderPieceToHeaven('queen-black', victim);
                    break;
            }
        }
        pieces = pieces.filter(victim => victim.currentPosition !== heavenID)
    }

    function renderPieceToHeaven(ID, victim) {
        document.getElementById(ID).textContent += victim.pieceUnicode
    }

    function switchCurrentTeam() {
        switch (chosenPiece.team) {
            case 'white':
                currentTeam = 'black';
                break;
            case 'black':
                currentTeam = 'white';
                break;
        }
        for (let piece of pieces) {
            piece.turn = !piece.turn
        }
    }

    function emptyBoard() {
        for (let field of fields) {
            field.textContent = ''
        }
        for (let subHeaven of document.getElementById('heaven-white').children) {
            subHeaven.textContent = ''
        }
        for (let subHeaven of document.getElementById('heaven-black').children) {
            subHeaven.textContent = ''
        }
        removePickFieldEventListeners()
        removeMoveEventListeners()
        removeVisualEventListeners()
        removePromoteEventListeners()
        removeCSS_class('valid-fields')
        removeCSS_class('valid-targets')
        removeCSS_class('promotion-field')
        removeCSS_class('check')
    }

    function landOnPromotionField(event) {
        chosenPiece.emptyOldField()
        chosenPiece.currentPosition = event.target.id
        chosenPiece.render()
        removeMoveEventListeners()
        removeVisualEventListeners()
        removeCSS_class('valid-fields')
        removeCSS_class('valid-targets')
        removeCSS_class('promotion-field')
        highlightPromotionOptions()
        addPromoteEventListeners()
    }

    function promote(event) {
        chosenPiece.emptyOldField()
        spawn(event).render()
        removeCSS_class('check')

        if (scanForNoLegalMovesLeft()) {
            for (let piece of pieces) {
                if (piece.scanForCheck()) {
                    // Checkmate
                    checkmate = true
                    highlightCheckField()
                    audioGameOver.play()
                    announceWinner(currentTeam)
                    break;
                }
            }
            if (!checkmate) {
                // Stalemate
                audioGameOver.play()
                announceStalemate()
            }
        } else {
            for (let piece of pieces) {
                if (piece.scanForCheck()) {
                    // Check
                    highlightCheckField()
                }
            }
        }

        switchCurrentTeam()
        pieces = pieces.filter(victim => victim !== chosenPiece)
        removePromoteEventListeners()
        removeHighlightPromotionOptions()
        addPickFieldEventListeners()
        addVisualEventListeners()
        highlightCurrentTeam()
    }

    function spawn(event) {
        let newPiece
        switch (event.target.id) {
            case 'rooks-white':
                newPiece = new Rook(currentTeam, true, chosenPiece.currentPosition, '♖');
                break;
            case 'knights-white':
                newPiece = new Knight(currentTeam, true, chosenPiece.currentPosition, '♘');
                break;
            case 'bishops-white':
                newPiece = new Bishop(currentTeam, true, chosenPiece.currentPosition, '♗');
                break;
            case 'queen-white':
                newPiece = new Queen(currentTeam, true, chosenPiece.currentPosition, '♕');
                break;
            case 'rooks-black':
                newPiece = new Rook(currentTeam, true, chosenPiece.currentPosition, '♜');
                break;
            case 'knights-black':
                newPiece = new Knight(currentTeam, true, chosenPiece.currentPosition, '♞');
                break;
            case 'bishops-black':
                newPiece = new Bishop(currentTeam, true, chosenPiece.currentPosition, '♝');
                break;
            case 'queen-black':
                newPiece = new Queen(currentTeam, true, chosenPiece.currentPosition, '♛');
                break;
        }
        pieces.push(newPiece)
        return newPiece
    }

    function addPromoteEventListeners() {
        if (currentTeam === 'white') {
            for (let subHeaven of whiteHeaven) {
                subHeaven.addEventListener('click', promote)
            }
        } else {
            for (let subHeaven of blackHeaven) {
                subHeaven.addEventListener('click', promote)
            }
        }
    }

    function removePromoteEventListeners() {
        for (let subHeaven of whiteHeaven) {
            subHeaven.removeEventListener('click', promote)
        }
        for (let subHeaven of blackHeaven) {
            subHeaven.removeEventListener('click', promote)
        }
    }

    function addPickFieldEventListeners() {
        for (let field of fields) {
            field.addEventListener('click', pickField)
        }
    }

    function removePickFieldEventListeners() {
        for (let field of fields) {
            field.removeEventListener('click', pickField)
        }
    }

    function addMoveEventListeners() {
        for (let field of fields) {
            field.addEventListener('click', move)
        }
    }

    function removeMoveEventListeners() {
        for (let field of fields) {
            field.removeEventListener('click', move)
        }
    }

    function addVisualEventListeners() {
        for (let field of fields) {
            const hoveredPiece = pieces.find(piece => piece.currentPosition === field.id)
            if (field.textContent !== '' && hoveredPiece && hoveredPiece.turn) {
                field.addEventListener('mouseover', toggle_CSS_hover_class)
                field.addEventListener('mouseout', toggle_CSS_hover_class)
            }
        }
    }

    function removeVisualEventListeners() {
        for (let field of fields) {
            field.removeEventListener('mouseover', toggle_CSS_hover_class)
            field.removeEventListener('mouseout', toggle_CSS_hover_class)
        }
    }

    function toggle_CSS_hover_class(event) {
        event.target.classList.toggle('hover')
    }

    function highlightValidFields() {
        for (let field of chosenPiece.validFields) {
            field.classList.add('valid-fields')
        }
    }

    function highlightValidTargets() {
        for (let field of chosenPiece.validTargets) {
            field.classList.add('valid-targets')
        }
    }

    function highlightPromotionField() {
        for (let field of chosenPiece.promotionFields) {
            field.classList.add('promotion-field')
        }
    }

    function highlightCurrentTeam() {
        for (let piece of pieces) {
            if (piece.team === currentTeam) {
                const field = fields.find(field => field.id === piece.currentPosition)
                field.classList.add('blink')
            }
        }
    }

    function removeHighlightCurrentTeam() {
        for (let field of fields) {
            field.classList.remove('blink')
        }
    }

    function highlightPromotionOptions() {
        if (currentTeam === 'white') {
            for (let subHeaven of whiteHeaven) {
                subHeaven.classList.add('blink')
            }
        } else {
            for (let subHeaven of blackHeaven) {
                subHeaven.classList.add('blink')
            }
        }
    }

    function removeHighlightPromotionOptions() {
        for (let subHeaven of whiteHeaven) {
            subHeaven.classList.remove('blink')
        }
        for (let subHeaven of blackHeaven) {
            subHeaven.classList.remove('blink')
        }
    }

    function announceWinner(winnerTeam) {
        document.getElementById('win-message').textContent = `Congratulations ${winnerTeam} Team, you've won! 🏆`
        const announcementWindow = document.getElementById('announce-winner')
        const confetti = document.getElementById('confetti')

        announcementWindow.style.display = 'flex'
        confetti.style.display = 'flex'
        setTimeout(function () {
            confetti.style.display = 'none'
        }, 5000);

        const rematchBtn = document.getElementsByClassName('rematch-btn')[0]
        rematchBtn.addEventListener('click', () => {
            announcementWindow.style.display = 'none'
            emptyBoard()
            startNewGame()
        })
    }

    function announceStalemate() {
        const kingPiece = pieces.find(piece => piece.constructor.name === 'King' && piece.team !== currentTeam)
        document.getElementById('stalemate-message').textContent = `Stalemate! ${kingPiece.team} King is not in check but there are no legal moves left.`
        const announcementWindow = document.getElementById('announce-stalemate')
        announcementWindow.style.display = 'flex'

        const rematchBtn = document.getElementsByClassName('rematch-btn')[1]
        rematchBtn.addEventListener('click', () => {
            announcementWindow.style.display = 'none'
            emptyBoard()
            startNewGame()
        })
    }
}

//window.addEventListener('load', startNewGame)
window.addEventListener('load', startNewGame.bind(null, classic() ) )