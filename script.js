window.addEventListener("keyup", StartPlayingEnter);
window.addEventListener("keydown", DinoJump);
//window.addEventListener("click", StartPlayingClick);
let dino = document.getElementById("dino-png");
let playBtn = document.getElementById("playBtn");
let showBorder = document.getElementById("turnBorder");
showBorder.onclick = TurnBorder;
let border = "none";
playBtn.onclick = StartPlayingClick;
dino.style.border = border;
let gameIsInProcess = false;
let dinoInAir = false;
let cactusImages = ["images/cactus_0.png","images/cactus_1.png","images/cactus_2.png", "images/cactus_0.png"];
let score = 0;
let scorepoints = document.getElementById("scorepoints");
scorepoints.textContent = score;
let animationTime = 3.0;

function StartPlayingClick() {
    if(gameIsInProcess)
        return;
    if (!gameIsInProcess) {
        gameIsInProcess = true;
        playBtn.style.visibility ="hidden";
        playBtn.disabled = true;
        if(gameIsInProcess) {
            CactusSpawnProcess();
        }
    }
}

function StartPlayingEnter(e) {
    if (e.keyCode === 13) {
        if(!gameIsInProcess)
            StartPlayingClick();
    }
}

function DinoJump(e) {
    if(e.keyCode === 16 && gameIsInProcess == true) {
        if(dinoInAir != true) {
            dino.classList.add("dinoIsJumping");
            dino.style.animationDuration = animationTime * 333 + "ms";
            dinoInAir = true;
            setTimeout(() => {
                if(dinoInAir != false) {
                    dino.classList.remove("dinoIsJumping");
                    dinoInAir = false;
                }
            }, animationTime * 333);
        }
    }
}

function CactusSpawnProcess() {
        let intervalId = setInterval(() => {
            if(gameIsInProcess) {
                score += 10;
                scorepoints.textContent = score;
            }
            else if (!gameIsInProcess) {
                scorepoints.textContent = score;
                clearInterval(intervalId);
            }
        }, animationTime * 150);
        let intervalId1 = setInterval(() => {
            if (gameIsInProcess) {
                let i = 0;
                SpawnCactus(i);
                document.getElementById("existingCactus" + i).classList.add("cactusIsAnimated");
                document.getElementById("existingCactus" + i).style.animation = "cactusAnimation "+ animationTime * 800 + "ms linear";
                console.log(document.getElementById("existingCactus" + i).classList);
                DetectCactusCollision("existingCactus" + i);
                DeleteCactus("existingCactus" + i, animationTime * 800);
                i++;
            }
            else if (!gameIsInProcess)
                clearInterval(intervalId1);
        }, animationTime * 800 + 100);

        let intervalId0 = setInterval(() => {
            if(animationTime >= 1.0)
                animationTime = animationTime - 0.1;
            else if (animationTime < 1.0 || !gameIsInProcess)
                clearInterval(intervalId0);
        }, 10000);
}

function DeleteCactus(cactusId, delay) {
    setTimeout(() => {
        let currentCactus;
        if((currentCactus = document.getElementById(cactusId)) != null)
            currentCactus.remove();
    }, delay);
}

function DetectCactusCollision(cactusId) {

    let cactus = document.getElementById(cactusId);
    if(cactus == null)
        return;
    console.log(cactus.y + " " + dino.y);

    let checkCollision = setInterval(() => {
        if(!gameIsInProcess) {
            cactus.remove();
                score = 0;
                animationTime = 3.0;
                playBtn.style.visibility ="visible";
                playBtn.disabled = false;
                clearInterval(checkCollision);
        }
        console.log("gamestatus: " + gameIsInProcess);
        console.log("cactus: " + cactus.y);
        console.log("dino: " + dino.y);
        S = (dino.x + 20) - cactus.x;
        D = (dino.y - 10) - cactus.y;
        F = (dino.width - 20) + cactus.width;
        if(S * S + D * D <= F * F){
            gameIsInProcess = false;
        }
    }, animationTime * 33);
}

function SpawnCactus(count) {
    let existingCactus = document.createElement("img");
    let cactusImage = cactusImages[RandomImgSrc(1,3)];

    existingCactus.style.width = "3%";
    existingCactus.style.height = "5%";
    existingCactus.src = cactusImage;
    existingCactus.style.display = "block";
    existingCactus.style.margin = "0";
    existingCactus.style.position = "absolute";
    existingCactus.style.right = "0";
    existingCactus.style.top = "-5%";
    existingCactus.style.border = border;
    existingCactus.id = "existingCactus" + count;

    console.log("id: " + existingCactus.id);

    let game = document.getElementById("game");
    game.appendChild(existingCactus);
}

function RandomImgSrc(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function TurnBorder() {
    if(border == "none") {
        border = "dashed red 2px";
        dino.style.border = border;
    } 
    else {
        border = "none";
        dino.style.border = border;
    }

}

