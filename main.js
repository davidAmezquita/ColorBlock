
let colors = ["darkblue", "aqua", "violet", "maroon", "steelblue"];
let difficulty = 0;
let squares_per_row;
let numSquares;
let chained = new Array(numSquares);  //will keep track of the current chain of same color blocks
let currentColor = "";
let numMoves;
let unvisited;

//sets up the size of each block in the grid
function setupGrid(difficulty) {
    let grid = document.getElementById("board");
    console.log('Hello');

    if (difficulty === 1) {
        //default grid, simply return
        return 0;   
    }
    else if (difficulty === 2) {
        //medium difficulty, grid width is divided by 10
        grid.style.gridTemplateColumns = "50px 50px 50px 50px 50px 50px 50px 50px 50px 50px";
        grid.style.gridTemplateRows = "50px 50px 50px 50px 50px 50px 50px 50px 50px 50px";
    }
    else if (difficulty === 3) {
        grid.style.gridTemplateColumns = "33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px";
        grid.style.gridTemplateRows = "33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px 33.3px";
    }
}


//sets the random colors of the board
function initGame() {

    //sets difficulty
    let selectedDiff = document.getElementById("difficulty").options;
    difficulty = selectedDiff.selectedIndex + 1;
    document.getElementById("diff-setting").textContent = selectedDiff[difficulty-1].text;

    setupGrid(difficulty);

    //variables that keep track of number of blocks
    squares_per_row = difficulty * 5;
    numSquares = squares_per_row * squares_per_row;
    unvisited = numSquares;

    //displays the amount of moves the player has to complete the game
    numMoves = 10 * difficulty;
    document.getElementById("numMoves").textContent = numMoves;

    //creates blocks of random colors
    for (let index = 0; index < numSquares; index++) {
        let randColor = colors[Math.floor(Math.random() * 5)];
        let square = document.createElement("div");
        square.style.backgroundColor = randColor;
        square.setAttribute("id", index);
        document.getElementById("board").appendChild(square);
    }

    //grabs the color of the first block in the chain
    currentColor = document.getElementById('0').style.backgroundColor;
    //first block is always the starting root for the game
    chained[0] = 1;
    unvisited -= 1;
    //initialize chain
    for(let i=1; i <numSquares; i++) {
        chained[i] = 0;
    }

}

function checkAdj(id) {

    //checks every block adjecent to the block with given id
    if (chained[id-1] === 1 && (id%squares_per_row) > 0) {
        return true;
    }
    else if (chained[id+1] === 1) {
        return true;
    }
    else if(chained[id + squares_per_row] === 1) {
        return true;
    }
    else if(chained[id - squares_per_row]===1) {
        return true;
    }
    else {
        return false;
    }
}

function gameLogic() {
    let blockClicked = parseInt(this.id);

    //check if the block that was clicked is adjecent to any block in the chain
    if (checkAdj(blockClicked)){

        //if so make the clicked block part of the chain and grab its color
        chained[blockClicked] = 1;
        unvisited -= 1;
        currentColor = this.style.backgroundColor;
    }

    //sets all chained blocks to the same color
    for (let i = 0; i < chained.length; i++) {
        let currBlock = document.getElementById(i.toString());
        if (chained[i] === 1) {
            currBlock.style.backgroundColor = currentColor;
        }

        /*  if a block is not part of the chain, but has the same color as the chain
        *   check if its adjecent to the chain, if so add it the chain
        */
        if (chained[i] === 0 && currBlock.style.backgroundColor === currentColor) {
            if (checkAdj(i)) {
                chained[i] = 1;
                unvisited -= 1;
            }
        }
    }

    numMoves -= 1;
    document.getElementById("numMoves").textContent = numMoves;

    //no more blocks to chain, game has been won
    if (unvisited === 0) {
        alert("Game over, you won!\n Reload page to play again.");
    }
    //ran out of moves before chaining all blocks, game is lost
    else if (numMoves === 0){
        alert("Out of moves, you lost ): \n Reload page to play again.");
    }
    
}


function setUpGame() {
    
    initGame();
    
    //adds blocks to the chained that are already adjecent and have similar color
    for (let i = 1; i < numSquares; i++) {
        let block = document.getElementById(i.toString());
        if (currentColor === block.style.backgroundColor){
            if (checkAdj(i)) {
                chained[i] = 1;
                unvisited -=1;
            }
        }
    }

    let board = document.getElementById("board").childNodes;
    board.forEach(element => {
    element.addEventListener("click", gameLogic);
    });
}

//start button is disabled after the game has started
let startBtn = document.getElementById("startButton");
startBtn.addEventListener("click", ()=>{
    startBtn.disabled = true;
    setUpGame();
});

