const field_IDs = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
    'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
    'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
    'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8',
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8']

export const field_coords = {
    a1: [1, 1], a2: [1, 2], a3: [1, 3], a4: [1, 4], a5: [1, 5], a6: [1, 6], a7: [1, 7], a8: [1, 8],
    b1: [2, 1], b2: [2, 2], b3: [2, 3], b4: [2, 4], b5: [2, 5], b6: [2, 6], b7: [2, 7], b8: [2, 8],
    c1: [3, 1], c2: [3, 2], c3: [3, 3], c4: [3, 4], c5: [3, 5], c6: [3, 6], c7: [3, 7], c8: [3, 8],
    d1: [4, 1], d2: [4, 2], d3: [4, 3], d4: [4, 4], d5: [4, 5], d6: [4, 6], d7: [4, 7], d8: [4, 8],
    e1: [5, 1], e2: [5, 2], e3: [5, 3], e4: [5, 4], e5: [5, 5], e6: [5, 6], e7: [5, 7], e8: [5, 8],
    f1: [6, 1], f2: [6, 2], f3: [6, 3], f4: [6, 4], f5: [6, 5], f6: [6, 6], f7: [6, 7], f8: [6, 8],
    g1: [7, 1], g2: [7, 2], g3: [7, 3], g4: [7, 4], g5: [7, 5], g6: [7, 6], g7: [7, 7], g8: [7, 8],
    h1: [8, 1], h2: [8, 2], h3: [8, 3], h4: [8, 4], h5: [8, 5], h6: [8, 6], h7: [8, 7], h8: [8, 8]
}

export const fields = []
for (let field_ID of field_IDs) {
    fields.push(document.getElementById(field_ID))
}

export const whiteHeaven = [document.getElementById('rooks-white'),
    document.getElementById('knights-white'),
    document.getElementById('bishops-white'),
    document.getElementById('queen-white')]

export const blackHeaven = [document.getElementById('rooks-black'),
    document.getElementById('knights-black'),
    document.getElementById('bishops-black'),
    document.getElementById('queen-black')]

export const audioPieceMove = new Audio('dependencies/piece_move.wav')
export const audioPieceKill = new Audio('dependencies/piece_kill.wav')
export const audioGameOver = new Audio('dependencies/game_over.wav')

/*
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

    export const pieces = {list: []}
    pieces.list.push(pawn1_white, pawn2_white, pawn3_white, pawn4_white, pawn5_white, pawn6_white, pawn7_white, pawn8_white,
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

    // Setting the fields
    const field_IDs = [
        'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
        'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
        'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
        'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
        'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8',
        'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8',
        'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8']

    export const field_coords = {
        a1: [1, 1], a2: [1, 2], a3: [1, 3], a4: [1, 4], a5: [1, 5], a6: [1, 6], a7: [1, 7], a8: [1, 8],
        b1: [2, 1], b2: [2, 2], b3: [2, 3], b4: [2, 4], b5: [2, 5], b6: [2, 6], b7: [2, 7], b8: [2, 8],
        c1: [3, 1], c2: [3, 2], c3: [3, 3], c4: [3, 4], c5: [3, 5], c6: [3, 6], c7: [3, 7], c8: [3, 8],
        d1: [4, 1], d2: [4, 2], d3: [4, 3], d4: [4, 4], d5: [4, 5], d6: [4, 6], d7: [4, 7], d8: [4, 8],
        e1: [5, 1], e2: [5, 2], e3: [5, 3], e4: [5, 4], e5: [5, 5], e6: [5, 6], e7: [5, 7], e8: [5, 8],
        f1: [6, 1], f2: [6, 2], f3: [6, 3], f4: [6, 4], f5: [6, 5], f6: [6, 6], f7: [6, 7], f8: [6, 8],
        g1: [7, 1], g2: [7, 2], g3: [7, 3], g4: [7, 4], g5: [7, 5], g6: [7, 6], g7: [7, 7], g8: [7, 8],
        h1: [8, 1], h2: [8, 2], h3: [8, 3], h4: [8, 4], h5: [8, 5], h6: [8, 6], h7: [8, 7], h8: [8, 8]
    }

    export const fields = []
    for (let field_ID of field_IDs) {
        fields.push(document.getElementById(field_ID))
    }

    export const whiteHeaven = [document.getElementById('rooks-white'),
        document.getElementById('knights-white'),
        document.getElementById('bishops-white'),
        document.getElementById('queen-white')]

    export const blackHeaven = [document.getElementById('rooks-black'),
        document.getElementById('knights-black'),
        document.getElementById('bishops-black'),
        document.getElementById('queen-black')]


    // Declaring Piece later chosen by Player (default undefined), current Team, and checkmate status
    //export let chosenPiece
    export const chosenPiece = {piece: undefined}
    export const currentTeam = {team: 'white'}
    export const checkmate = {status: false}

    // Loading Audio files
    export const audioPieceMove = new Audio('dependencies/piece_move.wav')
    export const audioPieceKill = new Audio('dependencies/piece_kill.wav')
    export const audioGameOver = new Audio('dependencies/game_over.wav')
*/
