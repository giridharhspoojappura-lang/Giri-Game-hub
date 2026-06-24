const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImg = new Image();
birdImg.src = "assets/bird.png";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";

const cityImg = new Image();
cityImg.src = "assets/city.png";
let bgX = 0;

const flapSound = new Audio("assets/flap.mp3");
const pointSound = new Audio("assets/point.mp3");
const hitSound = new Audio("assets/hit.mp3");

const scoreDisplay = document.getElementById("score");
const gameOverBox = document.getElementById("gameOver");
let bestScore =
    localStorage.getItem("flappyBest") || 0;

let bird;
let pipes;
let score;
let gameRunning;
let started = false;

function createBird() {
    bird = {
        x: 80,
        y: 250,
        width: 55,
        height: 43,
        velocity: 0
    };
}

function restartGame() {

    createBird();

    pipes = [];

    score = 0;
    scoreDisplay.innerText = score;

    started = false;
    gameRunning = true;

    hitSound.pause();
    hitSound.currentTime = 0;

    gameOverBox.style.display = "none";
}

function drawBackground(){

    bgX -= 1;

    if(bgX <= -canvas.width){
        bgX = 0;
    }

    ctx.drawImage(
        cityImg,
        bgX,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        cityImg,
        bgX + canvas.width,
        0,
        canvas.width,
        canvas.height
    );
}

restartGame();
document.getElementById("bestScore").innerText =
bestScore;

function flap() {

    if (!started) {
        started = true;
    }

    if (!gameRunning) return;

    flapSound.currentTime = 0;
    flapSound.play();

    bird.velocity = -8;
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") flap();
});

canvas.addEventListener("click", flap);
canvas.addEventListener("touchstart", flap);

function createPipe() {

    let gap = 180;

    let topHeight =
        Math.random() * 180 + 80;

    pipes.push({
        x: canvas.width,
        width: 80,
        topHeight,
        gap,
        scored: false
    });
}

setInterval(() => {

    if (gameRunning && started) {
        createPipe();
    }

}, 1500);

function drawBird() {

    ctx.save();

    ctx.translate(
        bird.x,
        bird.y
    );

    let angle =
        Math.max(
            -0.5,
            Math.min(
                bird.velocity * 0.05,
                1
            )
        );

    ctx.rotate(angle);

    ctx.drawImage(
        birdImg,
        -bird.width / 2,
        -bird.height / 2,
        bird.width,
        bird.height
    );

    ctx.restore();
}

function drawPipes() {

    pipes.forEach(pipe => {

        // TOP PIPE

        ctx.save();

        ctx.translate(
            pipe.x + pipe.width / 2,
            pipe.topHeight / 2
        );

        ctx.rotate(Math.PI);

        ctx.drawImage(
            pipeImg,
            -pipe.width / 2,
            -pipe.topHeight / 2,
            pipe.width,
            pipe.topHeight
        );

        ctx.restore();

        // BOTTOM PIPE

        ctx.drawImage(
            pipeImg,
            pipe.x,
            pipe.topHeight + pipe.gap,
            pipe.width,
            canvas.height -
            pipe.topHeight -
            pipe.gap
        );
    });
}

function updatePipes() {

    pipes.forEach(pipe => {

        pipe.x -= 3;

        if (
            !pipe.scored &&
            pipe.x + pipe.width < bird.x
        ) {

            pipe.scored = true;

            score++;

            pointSound.currentTime = 0;
            pointSound.play();

            scoreDisplay.innerText = score;

if(score > bestScore){

    bestScore = score;

    localStorage.setItem(
        "flappyBest",
        bestScore
    );

    document.getElementById(
        "bestScore"
    ).innerText = bestScore;
}
        }

        const HITBOX = 0.6;

        const birdLeft =
            bird.x -
            (bird.width * HITBOX) / 2;

        const birdRight =
            bird.x +
            (bird.width * HITBOX) / 2;

        const birdTop =
            bird.y -
            (bird.height * HITBOX) / 2;

        const birdBottom =
            bird.y +
            (bird.height * HITBOX) / 2;

        if (
            birdRight > pipe.x &&
            birdLeft < pipe.x + pipe.width
        ) {

            if (
                birdTop < pipe.topHeight ||
                birdBottom >
                pipe.topHeight + pipe.gap
            ) {
                gameOver();
            }
        }
    });

    pipes = pipes.filter(
        pipe => pipe.x > -100
    );
}

function gameOver() {

    if (!gameRunning) return;

    gameRunning = false;

    hitSound.currentTime = 0;
    hitSound.play();

    gameOverBox.style.display = "block";
}

function update() {
drawBackground();
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();

    ctx.fillStyle =
    "rgba(10,0,40,0.35)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (gameRunning && started) {

        bird.velocity += 0.4;
        bird.y += bird.velocity;

        if (
            bird.y > canvas.height ||
            bird.y < 0
        ) {
            gameOver();
        }

        updatePipes();
    }

    drawPipes();
    drawBird();

    if (!started) {

        ctx.fillStyle = "white";
        ctx.font = "22px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "Tap To Start",
            canvas.width / 2,
            canvas.height / 2
        );
    }

    requestAnimationFrame(update);
}

update();

canvas.classList.add("new-record");

setTimeout(()=>{
    canvas.classList.remove(
        "new-record"
    );
},1000);

async function shareScore(){

    const tempCanvas =
    document.createElement("canvas");

    tempCanvas.width = 800;
    tempCanvas.height = 900;

    const tctx =
    tempCanvas.getContext("2d");

    // Background
    tctx.fillStyle = "#12003d";
    tctx.fillRect(0,0,800,900);

    // Title
    tctx.fillStyle = "#00ffff";
    tctx.textAlign = "center";

    tctx.font = "bold 50px Arial";
    tctx.fillText(
        "🎮 Giri's Game Hub",
        400,
        70
    );

    tctx.fillStyle = "#ffffff";
    tctx.font = "40px Arial";

    tctx.fillText(
        "🐦 Flappy Bird",
        400,
        130
    );

    tctx.fillText(
        "🏆 SCORE : " + score,
        400,
        200
    );

    tctx.fillText(
        "⭐ BEST : " + bestScore,
        400,
        260
    );

    // Screenshot border
    tctx.strokeStyle = "#00ffff";
    tctx.lineWidth = 4;

    tctx.strokeRect(
        40,
        300,
        720,
        500
    );

    // Game screenshot
    tctx.drawImage(
        canvas,
        50,
        310,
        700,
        480
    );

    // Footer
    tctx.fillStyle = "#00ffff";
    tctx.font = "24px Arial";

    tctx.fillText(
        "🔥 Can you beat me?",
        400,
        845
    );

    tctx.fillText(
        "https://girighub.netlify.app/games/flappybird/",
        400,
        880
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
            "flappy-score.png",
            {
                type:"image/png"
            }
        );

        // Mobile share with image
        if(
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files:[file]
            })
        ){

            await navigator.share({

                title:
                "Giri's Game Hub",

                text:
                "🐦 I scored " +
                score +
                " points in Flappy Bird!\n\n" +
                "🔥 Can you beat me?\n\n" +
                "🎮 Play here:\n" +
                "https://girighub.netlify.app/games/flappybird/",

                files:[file]
            });

            return;
        }

    }catch(err){

        console.log(
            "Share failed:",
            err
        );
    }

    // Desktop fallback
    const link =
    document.createElement("a");

    link.href =
    dataUrl;

    link.download =
    "flappy-score.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

const shareBtn =
document.getElementById("shareBtn");

shareBtn.addEventListener(
    "click",
    shareScore
);