window.addEventListener("keyup", StartPlayingEnter);
window.addEventListener("keydown", DinoJumpShift);
document.body.addEventListener("click", DinoJumpClick);
let container = document.getElementById("game");
let dino = document.getElementById("dino-png");
dino.src = "images/dino.png";
let playBtn = document.getElementById("playBtn");
let showBorder = document.getElementById("turnBorder");
showBorder.onclick = TurnBorder;
let border = "none";
playBtn.onclick = StartPlayingClick;

let dinoTop = 0;
let cactusTop = 0;
let cactusWidth = 0;
let cactusHeight = 0;
let animationTime = 3.0;
let dinoJumpTime;

let gameIsInProcess = false;
let dinoInAir = false;
let cactusImages = ["images/cactus_0.png", "images/cactus_1.png", "images/cactus_2.png", "images/cactus_0.png", "images/flying_1.png"];
let score = 0;
let scorepoints = document.getElementById("scorepoints");
scorepoints.textContent = score;

let animateDinoInterval;
let scoreInterval, cactusInterval, timeInterval, checkCollisionInterval;

function clearAllIntervals() {
    clearInterval(scoreInterval);
    clearInterval(cactusInterval);
    clearInterval(timeInterval);
    clearInterval(checkCollisionInterval);
}

function updateLayout() {
    if (window.innerWidth < window.innerHeight) {
        playBtn.style.width = "20%";
        playBtn.style.height = "8%";
        dino.style.width = "10%";
        dino.style.height = "6%";
        dino.style.top = "-6%";
        cactusWidth = window.innerWidth * 0.07 + "px";
        cactusHeight = window.innerHeight * 0.06 + "px";
        cactusTop = "-6%";
        dinoJumpTime = 1.5;
        container.style.margin = "40% 20% 0 0";
    } else {
        playBtn.style.width = "8%";
        playBtn.style.height = "5%";
        dino.style.width = "6%";
        dino.style.height = "8%";
        dino.style.top = "-8%";
        cactusWidth = window.innerWidth * 0.03 + "px";
        cactusHeight = window.innerHeight * 0.05 + "px";
        cactusTop = "-5%";
        dinoJumpTime = 1.0;
        container.style.margin = "20% 10% 0 20%";
    }
}

let checkWindow = setInterval(updateLayout, 500);

dino.style.border = border;

async function StartPlayingClick() {
    if (gameIsInProcess) return;
    clearAllIntervals();
    gameIsInProcess = true;
    playBtn.style.visibility = "hidden";
    playBtn.disabled = true;
    score = 0;
    animationTime = 3.0;
    if (gameIsInProcess) {
        await CactusSpawnProcess();
        await AnimateDino();
    }
}

function StartPlayingEnter(e) {
    if (e.keyCode === 13 && !gameIsInProcess) {
        StartPlayingClick();
    }
}

async function DinoJump() {
    if(!dinoInAir ) {
        dino.classList.add("dinoIsJumping");
        dino.style.animationDuration = (dinoJumpTime * animationTime) / 3 + "s";
        dinoInAir = true;
        clearInterval(animateDinoInterval);
        await new Promise(resolve => setTimeout(resolve, dinoJumpTime * animationTime * 333));
        if (dinoInAir) {
            dino.classList.remove("dinoIsJumping");
            dinoInAir = false;
            AnimateDino();
        }
    }

}

function DinoJumpClick() {
    if (gameIsInProcess) {
        DinoJump();
    }
}

function DinoJumpShift(e) {
    if (e.keyCode === 16 && gameIsInProcess) {
        DinoJump();
    }
}

async function AnimateDino() {
    let f = true;
    animateDinoInterval = setInterval(() => {
        dino.src = f ? "images/dino.png" : "images/dino_2.png";
        f = !f;
        if (!gameIsInProcess) clearInterval(animateDinoInterval);
    }, animationTime * 50);
}

async function CactusSpawnProcess() {
    scoreInterval = setInterval(() => {
        if (gameIsInProcess) {
            score += 10;
            scorepoints.textContent = score;
        } else {
            scorepoints.textContent = score;
            clearInterval(scoreInterval);
        }
    }, animationTime * 150);

    cactusInterval = setInterval(async () => {
        if(!gameIsInProcess) {
            clearInterval(cactusInterval);
        }
        if (gameIsInProcess) {
            let i = 0;
            await SpawnCactus(i);
            await DetectCactusCollision("existingCactus" + i);
            await DeleteCactus("existingCactus" + i, animationTime * 800);
            i++;
        }
    }, animationTime * 700);

    timeInterval = setInterval(() => {
        if (animationTime >= 1.0) {
            animationTime -= 0.1;
        } else {
            clearInterval(timeInterval);
        }
        if (!gameIsInProcess) {
            clearInterval(timeInterval);
        }
    }, 10000);
}

async function DeleteCactus(cactusId, delay) {
    await new Promise(resolve => setTimeout(resolve, delay));
    let currentCactus = document.getElementById(cactusId);
    if (currentCactus) currentCactus.remove();
}

async function DetectCactusCollision(cactusId) {
    let cactus = document.getElementById(cactusId);
    if (!cactus) return;
    

    checkCollisionInterval = setInterval(() => {
        if (!gameIsInProcess) {
            cactus.remove();
            score = 0;
            animationTime = 3.0;
            playBtn.style.visibility = "visible";
            playBtn.disabled = false;
            clearAllIntervals();
        }

        if (DetectCollision(dino, cactus)) {
            gameIsInProcess = false;
        }
    }, animationTime * 33);
}
function DetectCollision(dino, object) {
    const dinoRect = dino.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    const XColl = dinoRect.left < objectRect.right && dinoRect.right > objectRect.left;
    const YColl = dinoRect.top < objectRect.bottom && dinoRect.bottom > objectRect.top;

    return XColl && YColl;
}

async function SpawnCactus(count) {
    let existingCactus = document.createElement("img");
    let cactusImage = cactusImages[RandomImgSrc(1, 4)];
    if (cactusImage === cactusImages[4]) {
        existingCactus.style.top = "-15%";
        existingCactus.style.width = cactusHeight * 1.5;
        existingCactus.style.height = cactusWidth;

        let flyingAnimate = setInterval(() => {
            if (!existingCactus) clearInterval(flyingAnimate);
            cactusImage = cactusImage === "images/flying_1.png" ? "images/flying_2.png" : "images/flying_1.png";
            existingCactus.src = cactusImage;
        }, animationTime * 33);
    } else {
        existingCactus.style.top = cactusTop;
        existingCactus.style.width = cactusWidth;
        existingCactus.style.height = cactusHeight;
        existingCactus.src = cactusImage;
    }

    existingCactus.style.display = "block";
    existingCactus.style.margin = "0";
    existingCactus.style.position = "absolute";
    existingCactus.style.right = "0";
    existingCactus.style.border = border;
    existingCactus.id = "existingCactus" + count;
    existingCactus.classList.add("cactusIsAnimated");
    existingCactus.style.animation = "cactusAnimation " + animationTime * 800 + "ms linear";

    document.getElementById("game").appendChild(existingCactus);
}

function RandomImgSrc(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function TurnBorder() {
    border = border === "none" ? "dashed red 2px" : "none";
    dino.style.border = border;
}
