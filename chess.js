// Code by Alon Cohen
//-to-do:
// instead of bold when hovered, do a text-shadow or smth
// instead of border around valid fields, make background color effect change or smth
// Rochade
// checkmate check
// additional game modes: trojan horse, spartan battle, battle royale, boss fight?
// touchscreen
// Design

function startNewGame() {
    function pickField(event) {
        const field = event.target
        chosenPiece = pieces.find(piece => piece.currentPosition === field.id && piece.team === currentTeam)
        if (chosenPiece) {
            removeHighlightValidFields()
            chosenPiece.getValidFields()
            highlightValidFields()
            removeHighlightValidTargets()
            highlightValidTargets()
            removeHighlightPromotionField()
            highlightPromotionField()
            removeHighlightCurrentTeam()
            removePickFieldEventListeners()
            addMoveEventListeners()
        }
    }

    function move(event){
        const targetField = event.target
        const victim = pieces.find(piece => piece.currentPosition === targetField.id)

        if (chosenPiece.promotionFields.includes(targetField)){
            if (victim){
                kill(victim)
            }
            landOnPromotionField(event)
        } else if (chosenPiece.validTargets.includes(targetField)){
            kill(victim)
            land(event)
        } else if (chosenPiece.validFields.includes(targetField)) {
            land(event)
        } else {
            if (victim && victim.team === chosenPiece.team) {
                pickField(event)
            }
        }
    }

    function land(event){
        chosenPiece.emptyOldField()
        chosenPiece.currentPosition = event.target.id
        chosenPiece.render()
        if ( checkGameOver() ) { return }
        switchCurrentTeam()
        //renderInfo(currentTeamDisplay, `${currentTeam} team, your turn!`)
        removeMoveEventListeners()
        addPickFieldEventListeners()
        removeVisualEventListeners()
        addVisualEventListeners()
        removeHighlightValidFields()
        removeHighlightValidTargets()
        removeHighlightPromotionField()
        highlightCurrentTeam()
    }

    function kill(victim){
        const heavenID = 'heaven-'+victim.team
        victim.currentPosition = heavenID
        if (victim.team === 'white') {
            switch (victim.constructor.name){
                case 'WhitePawn': renderPieceToHeaven('pawns-white', victim); break;
                case 'Rook'     : renderPieceToHeaven('rooks-white', victim); break;
                case 'Knight'   : renderPieceToHeaven('knights-white', victim); break;
                case 'Bishop'   : renderPieceToHeaven('bishops-white', victim); break;
                case 'Queen'    : renderPieceToHeaven('queen-white', victim); break;
            }
        } else {
            switch (victim.constructor.name){
                case 'BlackPawn': renderPieceToHeaven('pawns-black', victim); break;
                case 'Rook'     : renderPieceToHeaven('rooks-black', victim); break;
                case 'Knight'   : renderPieceToHeaven('knights-black', victim); break;
                case 'Bishop'   : renderPieceToHeaven('bishops-black', victim); break;
                case 'Queen'    : renderPieceToHeaven('queen-black', victim); break;
            }
        }
        pieces = pieces.filter(victim => victim.currentPosition !== heavenID)
    }


    function renderPieceToHeaven(ID, victim){
        document.getElementById(ID).textContent += victim.pieceUnicode
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


    function checkGameOver(){
        if (!pieces.includes(king_white) ){
            announceWinner('Black')
            emptyBoard()
            startNewGame()
            return true
        }
        if (!pieces.includes(king_black) ){
            announceWinner('White')
            emptyBoard()
            startNewGame()
            return true
        }
    }

    function emptyBoard(){
        for (let field of fields){
            field.textContent = ''
        }
        removePickFieldEventListeners()
        removeMoveEventListeners()
        removeVisualEventListeners()
        removePromoteEventListeners()
        removeHighlightValidFields()
        removeHighlightValidTargets()
        removeHighlightPromotionOptions()
    }

    function landOnPromotionField(event){
        chosenPiece.emptyOldField()
        chosenPiece.currentPosition = event.target.id
        chosenPiece.render()
        removeMoveEventListeners()
        removeVisualEventListeners()
        removeHighlightValidFields()
        removeHighlightValidTargets()
        removeHighlightPromotionField()
        highlightPromotionOptions()
        addPromoteEventListeners()
    }

    function promote(event){
        chosenPiece.emptyOldField()
        spawn(event).render()
        switchCurrentTeam()
        //renderInfo(currentTeamDisplay, `${currentTeam} team, your turn!`)
        pieces = pieces.filter(victim => victim !== chosenPiece)
        removePromoteEventListeners()
        removeHighlightPromotionOptions()
        addPickFieldEventListeners()
        addVisualEventListeners()
        highlightCurrentTeam()
    }

    function spawn (event){
        let newPiece
        switch (event.target.id){
            case 'rooks-white': newPiece = new Rook(currentTeam, true, chosenPiece.currentPosition, '♖'); break;
            case 'knights-white': newPiece = new Knight(currentTeam, true, chosenPiece.currentPosition, '♘'); break;
            case 'bishops-white': newPiece = new Bishop(currentTeam, true, chosenPiece.currentPosition, '♗'); break;
            case 'queen-white': newPiece = new Queen(currentTeam, true, chosenPiece.currentPosition, '♕'); break;
            case 'rooks-black': newPiece = new Rook(currentTeam, true, chosenPiece.currentPosition, '♜'); break;
            case 'knights-black': newPiece = new Knight(currentTeam, true, chosenPiece.currentPosition, '♞'); break;
            case 'bishops-black': newPiece = new Bishop(currentTeam, true, chosenPiece.currentPosition, '♝'); break;
            case 'queen-black': newPiece = new Queen(currentTeam, true, chosenPiece.currentPosition, '♛'); break;
        }
        pieces.push(newPiece)
        return newPiece
    }

    function addPromoteEventListeners(){
        document.getElementById('rooks-white').addEventListener('click', promote)
        document.getElementById('knights-white').addEventListener('click', promote)
        document.getElementById('bishops-white').addEventListener('click', promote)
        document.getElementById('queen-white').addEventListener('click', promote)

        document.getElementById('rooks-black').addEventListener('click', promote)
        document.getElementById('knights-black').addEventListener('click', promote)
        document.getElementById('bishops-black').addEventListener('click', promote)
        document.getElementById('queen-black').addEventListener('click', promote)
    }

    function removePromoteEventListeners(){
        document.getElementById('rooks-white').removeEventListener('click', promote)
        document.getElementById('knights-white').removeEventListener('click', promote)
        document.getElementById('bishops-white').removeEventListener('click', promote)
        document.getElementById('queen-white').removeEventListener('click', promote)

        document.getElementById('rooks-black').removeEventListener('click', promote)
        document.getElementById('knights-black').removeEventListener('click', promote)
        document.getElementById('bishops-black').removeEventListener('click', promote)
        document.getElementById('queen-black').removeEventListener('click', promote)
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
            if (field.textContent !== '' && hoveredPiece && hoveredPiece.turn) {
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

    function highlightPromotionField(){
        for (let field of chosenPiece.promotionFields){
            field.classList.add('promotion-field')
        }
    }

    function removeHighlightPromotionField(){
        for (let field of fields){
            field.classList.remove('promotion-field')
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

    function highlightPromotionOptions(){
        if (currentTeam === 'white'){
            document.getElementById('rooks-white').classList.add('blink')
            document.getElementById('bishops-white').classList.add('blink')
            document.getElementById('knights-white').classList.add('blink')
            document.getElementById('queen-white').classList.add('blink')
        } else {
            document.getElementById('rooks-black').classList.add('blink')
            document.getElementById('bishops-black').classList.add('blink')
            document.getElementById('knights-black').classList.add('blink')
            document.getElementById('queen-black').classList.add('blink')
        }
    }

    function removeHighlightPromotionOptions(){
        document.getElementById('rooks-white').classList.remove('blink')
        document.getElementById('bishops-white').classList.remove('blink')
        document.getElementById('knights-white').classList.remove('blink')
        document.getElementById('queen-white').classList.remove('blink')

        document.getElementById('rooks-black').classList.remove('blink')
        document.getElementById('bishops-black').classList.remove('blink')
        document.getElementById('knights-black').classList.remove('blink')
        document.getElementById('queen-black').classList.remove('blink')
    }

    function announceWinner(winnerTeam){
        const announcementWindow = document.getElementById('announce-winner')
        const winMessage = `Congratulations ${winnerTeam}, you won!`
        renderInfo(announcementWindow,winMessage)
        announcementWindow.style.display = 'block'
        setTimeout(function(){
            announcementWindow.style.display = 'none';
        }, 3000);
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
            this.promotionFields = []
        }

        render(){
            document.getElementById(this.currentPosition).textContent = this.pieceUnicode
        }

        emptyOldField(){
            document.getElementById(this.currentPosition).textContent = ''
        }
    }


    class WhitePawn extends Pawn{
        getValidFields() {
            this.validFields = []
            this.validTargets = []
            this.promotionFields = []
            const pieceCoords = field_coords[this.currentPosition]

            if (pieceCoords[1] === 2){
                for (let i = 1; i <= 2; i++) {
                    const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] + i)
                    const targetField = fields.find(field => field.id === targetID)
                    if (targetField) {
                        if (targetField.textContent === '') {
                            if (this.checkPromoteOption(targetField)){
                                this.promotionFields.push(targetField)
                            } else{
                                this.validFields.push(targetField)
                            }
                        } else {
                            break;
                        }
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
            const promotionField_IDs = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']
            if ( promotionField_IDs.includes(targetField.id) ) {
                return true
            }
        }

    }


    class BlackPawn extends Pawn{
        getValidFields() {
            this.validFields = []
            this.validTargets = []
            const pieceCoords = field_coords[this.currentPosition]

            if (pieceCoords[1] === 7){
                for (let i = 1; i <= 2; i++) {
                    const targetID = Object.keys(field_coords).find(ID => field_coords[ID][0] === pieceCoords[0] && field_coords[ID][1] === pieceCoords[1] - i)
                    const targetField = fields.find(field => field.id === targetID)
                    if (targetField) {
                        if (targetField.textContent === '') {
                            if (this.checkPromoteOption(targetField)){
                                this.promotionFields.push(targetField)
                            } else{
                                this.validFields.push(targetField)
                            }
                        } else {
                            break;
                        }
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
            const promotionField_IDs = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
            if ( promotionField_IDs.includes(targetField.id) ) {
                return true
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
    }


    // Creating pieces
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

    //Rendering pieces on the board
    for (let piece of pieces) {
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

    const field_coords = {
        a1: [1, 1], a2: [1, 2], a3: [1, 3], a4: [1, 4], a5: [1, 5], a6: [1, 6], a7: [1, 7], a8: [1, 8],
        b1: [2, 1], b2: [2, 2], b3: [2, 3], b4: [2, 4], b5: [2, 5], b6: [2, 6], b7: [2, 7], b8: [2, 8],
        c1: [3, 1], c2: [3, 2], c3: [3, 3], c4: [3, 4], c5: [3, 5], c6: [3, 6], c7: [3, 7], c8: [3, 8],
        d1: [4, 1], d2: [4, 2], d3: [4, 3], d4: [4, 4], d5: [4, 5], d6: [4, 6], d7: [4, 7], d8: [4, 8],
        e1: [5, 1], e2: [5, 2], e3: [5, 3], e4: [5, 4], e5: [5, 5], e6: [5, 6], e7: [5, 7], e8: [5, 8],
        f1: [6, 1], f2: [6, 2], f3: [6, 3], f4: [6, 4], f5: [6, 5], f6: [6, 6], f7: [6, 7], f8: [6, 8],
        g1: [7, 1], g2: [7, 2], g3: [7, 3], g4: [7, 4], g5: [7, 5], g6: [7, 6], g7: [7, 7], g8: [7, 8],
        h1: [8, 1], h2: [8, 2], h3: [8, 3], h4: [8, 4], h5: [8, 5], h6: [8, 6], h7: [8, 7], h8: [8, 8]
    }

    const fields = []
    for (let field_ID of field_IDs) {
        fields.push(document.getElementById(field_ID))
    }

    // Declaring Piece later chosen by Player (at start undefined) and turn
    let chosenPiece
    let currentTeam = 'white'
    const currentTeamDisplay = document.getElementById('current-team-display')

    //renderInfo(currentTeamDisplay, `${currentTeam} team, your turn!`)

    // Setting Event Handlers
    addPickFieldEventListeners()
    addVisualEventListeners()
    highlightCurrentTeam()
}

window.addEventListener('load', startNewGame)



/*
function scanForCheck(kingPiece, kingField){
    const attackingPieces = pieces.filter(piece => piece.team === chosenPiece.team)
    for (let attackingPiece of attackingPieces){
        attackingPiece.getValidFields()
        if (attackingPiece.validTargets.includes(kingField)) {
            switch ( scanForCheckmate(kingPiece,kingField,attackingPiece) ){
                //if returns true call gameOver()
                case true : console.log('game over'); return; break;
                case false: console.log('check but not checkmate'); break;
            }
            highlightCheck()
            //break; maybe this is needed
        }
    }
}


function scanForCheckmate(kingPiece, kingField, attackingPiece){
    console.log('checking for checkmate')
    const defendingPieces = pieces.filter(piece => piece.team !== chosenPiece.team)

    // First we scan if the king can escape from check to another field
    //const intersection = !attackingPiece.validFields.some( field => kingPiece.validFields.includes(field) )
    //console.log('intersection' + intersection)
    attackingPiece.getValidFields()
    for (let field of kingPiece.validFields){
        if ( attackingPiece.validFields.includes(field) === false){
            return false
        }
    }

    // Second we scan if a defending Piece can throw itself between the King and the Attacker
    for (let defendingPiece of defendingPieces){
        defendingPiece.getValidFields()
        for (let field of defendingPiece.validFields){
            field.textContent = 'f'
        }
    }
    attackingPiece.getValidFields()
    if ( attackingPiece.validTargets.includes(kingField) ) {
        console.log('checkmate confirmed')
        return true
    }
    for (let field of fields){
        if (field.textContent === 'f'){
            field.textContent = ''
        }
    }
}


function highlightCheck(){
    console.log('highlited check')
}
*/