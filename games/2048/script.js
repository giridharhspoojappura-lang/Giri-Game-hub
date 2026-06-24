const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const bestDisplay =
document.getElementById("best");

let best =
localStorage.getItem("best2048") || 0;

bestDisplay.innerText = best;

const restartBtn = document.getElementById("restartBtn");
let gameOver = false;
let grid = [];
let score = 0;
let won = false;
function createBoard() {
    board.innerHTML = "";
    
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        board.appendChild(tile);
    }

    grid = Array(16).fill(0);

    addNumber();
    addNumber();

    updateBoard();
}

function addNumber() {
    let empty = [];

    for (let i = 0; i < grid.length; i++) {
        if (grid[i] === 0) {
            empty.push(i);
        }
    }

    if (empty.length === 0) return;

    const randomIndex =
        empty[Math.floor(Math.random() * empty.length)];

    grid[randomIndex] =
        Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    const tiles = document.querySelectorAll(".tile");

    tiles.forEach((tile, index) => {
        const value = grid[index];

        tile.textContent = value === 0 ? "" : value;

        tile.style.background = getTileColor(value);
        tile.style.color = value <= 4 ? "#fff" : "#000";
    });

    scoreDisplay.textContent = score;
    if(score > best){

    best = score;

    localStorage.setItem(
        "best2048",
        best
    );

    bestDisplay.textContent = best;

    bestDisplay.parentElement
        .classList.add("record");
}
}

function getTileColor(value) {
    const colors = {
        0: "#330066",
        2: "#9be7ff",
        4: "#7cd1ff",
        8: "#00ffff",
        16: "#00ff99",
        32: "#66ff66",
        64: "#ffff00",
        128: "#ffb347",
        256: "#ff8800",
        512: "#ff5e00",
        1024: "#ff00ff",
        2048: "#ffffff"
    };

    return colors[value] || "#ffffff";
}

function slide(row) {
    row = row.filter(val => val);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }

    row = row.filter(val => val);

    while (row.length < 4) {
        row.push(0);
    }

    return row;
}

function moveLeft() {
    let changed = false;

    for (let r = 0; r < 4; r++) {
        let row = grid.slice(r * 4, r * 4 + 4);
        let newRow = slide(row);

        if (row.toString() !== newRow.toString()) {
            changed = true;
        }

        for (let c = 0; c < 4; c++) {
            grid[r * 4 + c] = newRow[c];
        }
    }

    if (changed) {
        addNumber();
        updateBoard();
checkWin();
checkGameOver();
    }
}

function moveRight() {
    let changed = false;

    for (let r = 0; r < 4; r++) {
        let row = grid.slice(r * 4, r * 4 + 4).reverse();
        let newRow = slide(row).reverse();

        if (row.reverse().toString() !== newRow.toString()) {
            changed = true;
        }

        for (let c = 0; c < 4; c++) {
            grid[r * 4 + c] = newRow[c];
        }
    }

    if (changed) {
        addNumber();
        updateBoard();
checkWin();
checkGameOver();
    }
}

function moveUp() {
    let changed = false;

    for (let c = 0; c < 4; c++) {
        let col = [];

        for (let r = 0; r < 4; r++) {
            col.push(grid[r * 4 + c]);
        }

        let newCol = slide(col);

        if (col.toString() !== newCol.toString()) {
            changed = true;
        }

        for (let r = 0; r < 4; r++) {
            grid[r * 4 + c] = newCol[r];
        }
    }

    if (changed) {
        addNumber();
        updateBoard();
checkWin();
checkGameOver();
    }
}

function moveDown() {
    let changed = false;

    for (let c = 0; c < 4; c++) {
        let col = [];

        for (let r = 0; r < 4; r++) {
            col.push(grid[r * 4 + c]);
        }

        let newCol = slide(col.reverse()).reverse();

        if (col.reverse().toString() !== newCol.toString()) {
            changed = true;
        }

        for (let r = 0; r < 4; r++) {
            grid[r * 4 + c] = newCol[r];
        }
    }

    if (changed) {
        addNumber();
        updateBoard();
checkWin();
checkGameOver();
    }
}

const swipeSound = new Audio("assets/swipe.mp3");
const loseSound = new Audio("assets/lose.mp3");
const winSound = new Audio("assets/win.mp3");


function playSwipe() {
    swipeSound.currentTime = 0;
    swipeSound.play();
}
document.addEventListener("keydown", (e) => {

    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
        "w","a","s","d"].includes(e.key)){

        playSwipe();
    }

});

function checkWin() {

    if (won) return;

    if (grid.includes(2048)) {

        won = true;

        winSound.currentTime = 0;
        winSound.play();

        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 }
        });

        alert("🎉 YOU REACHED 2048!");
    }
}

function checkGameOver() {

    if (gameOver) return;

    if (grid.includes(0)) return;

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
            if (grid[r * 4 + c] === grid[r * 4 + c + 1]) return;
        }
    }

    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 3; r++) {
            if (grid[r * 4 + c] === grid[(r + 1) * 4 + c]) return;
        }
    }
console.log("NO MOVES LEFT");
    gameOver = true;

    loseSound.currentTime = 0;
    loseSound.play();
document.body.classList.add("shake");

setTimeout(() => {
    document.body.classList.remove("shake");
}, 500);
    setTimeout(() => {
        alert("💀 GAME OVER!");
    }, 500);
}

document.addEventListener("keydown", e => {
    

    switch (e.key) {

        case "ArrowLeft":
        case "a":
        case "A":
            moveLeft();
            break;

        case "ArrowRight":
        case "d":
        case "D":
            moveRight();
            break;

        case "ArrowUp":
        case "w":
        case "W":
            moveUp();
            break;

        case "ArrowDown":
        case "s":
        case "S":
            moveDown();
            break;
    }
});

restartBtn.addEventListener("click", () => {

    loseSound.pause();
    loseSound.currentTime = 0;

    winSound.pause();
    winSound.currentTime = 0;

    document.body.classList.remove("shake");

    gameOver = false;
    won = false;

    score = 0;

    createBoard();
    updateBoard();

});

createBoard();




let startX = 0;
let startY = 0;

document.addEventListener("touchstart", (e) => {

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

});

document.addEventListener("touchend", (e) => {

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 50) {
            moveRight();
            playSwipe();
        }

        else if (dx < -50) {
            moveLeft();
            playSwipe();
        }

    } else {

        if (dy > 50) {
            moveDown();
            playSwipe();
        }

        else if (dy < -50) {
            moveUp();
            playSwipe();
        }

    }

});


async function shareScore(){

    const tempCanvas =
    document.createElement("canvas");

    tempCanvas.width = 800;
    tempCanvas.height = 800;

    const tctx =
    tempCanvas.getContext("2d");

    // Background
    tctx.fillStyle = "#12003d";
    tctx.fillRect(
        0,
        0,
        800,
        800
    );

    // Title
    tctx.fillStyle = "#00ffff";
    tctx.font = "bold 50px Arial";
    tctx.textAlign = "center";

    tctx.fillText(
        "🎮 Giri's Game Hub",
        400,
        80
    );

    tctx.fillStyle = "white";
    tctx.font = "40px Arial";

    tctx.fillText(
        "🧩 2048",
        400,
        150
    );

    tctx.fillText(
        "🏆 SCORE : " + score,
        400,
        230
    );

    tctx.fillText(
        "⭐ BEST : " + best,
        400,
        290
    );

    // Big score
    tctx.fillStyle = "#ffffff";
    tctx.font = "bold 120px Arial";

    tctx.fillText(
        score,
        400,
        500
    );

    tctx.font = "40px Arial";

    tctx.fillText(
        "Current Score",
        400,
        580
    );

    // Footer
    tctx.fillStyle = "#00ffff";
    tctx.font = "24px Arial";

    tctx.fillText(
        "https://girighub.netlify.app",
        400,
        760
    );

    tctx.fillText(
        "Can you beat me?",
        400,
        795
    );

    const dataUrl =
    tempCanvas.toDataURL("image/png");

    try{

        const blob =
        await (
            await fetch(dataUrl)
        ).blob();

        const file =
        new File(
            [blob],
            "2048-score.png",
            {
                type:"image/png"
            }
        );

        if(
            navigator.canShare &&
            navigator.canShare({
                files:[file]
            })
        ){

            await navigator.share({
                title:"Giri's Game Hub",
                text:
                "🧩 I scored " +
                score +
                " points in 2048!\n\n" +
                "🔥 Can you beat me?\n\n" +
                "🎮 Play here:\n" +
                "https://girighub.netlify.app/games/2048/",
                files:[file]
            });

            return;
        }

    }catch(err){

        console.log(err);

    }

    // Fallback download
    const link =
    document.createElement("a");

    link.download =
    "2048-score.png";

    link.href =
    dataUrl;

    link.click();
}

const shareBtn =
document.getElementById("shareBtn");

shareBtn.addEventListener(
    "click",
    shareScore
);