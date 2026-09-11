const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const levelText = document.getElementById("level");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");

const shapeName = document.getElementById("shapeName");

const clearBtn = document.getElementById("clearBtn");
const checkBtn = document.getElementById("checkBtn");

const result = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const nextBtn = document.getElementById("nextBtn");


let level = 1;

let drawing = false;

let points = [];

let time = 30;

let timer;

let targetPoints = [];

let circlePosition = null;

let circleMovementTimer;


// ------------------------------------
// CANVAS SIZE
// ------------------------------------

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    drawTarget();
}


// ------------------------------------
// SHAPES
// ------------------------------------

function createCircle() {

    let points = [];

    const radius = 130;

    const cx = circlePosition ? circlePosition.x : canvas.clientWidth / 2;
    const cy = circlePosition ? circlePosition.y : canvas.clientHeight / 2;

    for (let i = 0; i <= 360; i += 3) {

        const angle = i * Math.PI / 180;

        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        points.push({ x, y });
    }

    return points;
}


function moveCircleRandomly() {

    const radius = 130;
    const padding = 20;

    circlePosition = {
        x: radius + padding + Math.random() * (canvas.clientWidth - 2 * (radius + padding)),
        y: radius + padding + Math.random() * (canvas.clientHeight - 2 * (radius + padding))
    };

    redrawCanvas();
}


function redrawCanvas() {

    drawTarget();

    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
}


function createTriangle() {

    return [
        { x: 200, y: 350 },
        { x: 450, y: 100 },
        { x: 700, y: 350 },
        { x: 200, y: 350 }
    ];
}


function createSquare() {

    return [
        { x: 250, y: 130 },
        { x: 650, y: 130 },
        { x: 650, y: 370 },
        { x: 250, y: 370 },
        { x: 250, y: 130 }
    ];
}


function createHeart() {

    let points = [];

    const cx = canvas.clientWidth / 2;
    const cy = canvas.clientHeight / 2;

    for (let t = 0; t <= Math.PI * 2; t += 0.03) {

        const x =
            16 * Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        points.push({
            x: cx + x * 12,
            y: cy - y * 12
        });
    }

    return points;
}


function createStar() {

    let points = [];

    const cx = canvas.clientWidth / 2;
    const cy = canvas.clientHeight / 2;

    const outer = 160;
    const inner = 70;

    for (let i = 0; i <= 10; i++) {

        const angle =
            -Math.PI / 2 +
            i * Math.PI / 5;

        const radius =
            i % 2 === 0 ? outer : inner;

        points.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius
        });
    }

    return points;
}


// ------------------------------------
// GET CURRENT SHAPE
// ------------------------------------

function getShape() {

    if (level === 1) {
        shapeName.textContent = "Circle";
        return createCircle();
    }

    if (level === 2) {
        shapeName.textContent = "Triangle";
        return createTriangle();
    }

    if (level === 3) {
        shapeName.textContent = "Square";
        return createSquare();
    }

    if (level === 4) {
        shapeName.textContent = "Heart";
        return createHeart();
    }

    if (level === 5) {
        shapeName.textContent = "Star";
        return createStar();
    }

    shapeName.textContent = "Difficult Shape";

    return createHeart();
}


// ------------------------------------
// DRAW TARGET
// ------------------------------------

function drawTarget() {

    ctx.clearRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
    );

    targetPoints = getShape();

    if (targetPoints.length === 0) return;

    ctx.beginPath();

    ctx.moveTo(
        targetPoints[0].x,
        targetPoints[0].y
    );

    for (let i = 1; i < targetPoints.length; i++) {

        ctx.lineTo(
            targetPoints[i].x,
            targetPoints[i].y
        );
    }

    ctx.strokeStyle = "rgba(255,255,255,0.15)";

    ctx.lineWidth = 4;

    ctx.setLineDash([8, 10]);

    ctx.stroke();

    ctx.setLineDash([]);
}


// ------------------------------------
// POINTER POSITION
// ------------------------------------

function getPosition(event) {

    const rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}


// ------------------------------------
// START DRAWING
// ------------------------------------

canvas.addEventListener("pointerdown", function(event) {

    drawing = true;

    points = [];

    const position = getPosition(event);

    points.push(position);

    clearInterval(circleMovementTimer);

    if (level === 1) {
        circleMovementTimer = setInterval(function() {
            moveCircleRandomly();
        }, 700);
    }

    ctx.beginPath();

    ctx.moveTo(
        position.x,
        position.y
    );

    event.preventDefault();
});


// ------------------------------------
// DRAW
// ------------------------------------

canvas.addEventListener("pointermove", function(event) {

    if (!drawing) return;

    const position = getPosition(event);

    points.push(position);

    ctx.lineTo(
        position.x,
        position.y
    );

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 5;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.stroke();

    event.preventDefault();
});


// ------------------------------------
// STOP DRAWING
// ------------------------------------

canvas.addEventListener("pointerup", function() {

    drawing = false;

    clearInterval(circleMovementTimer);

    ctx.closePath();

});


canvas.addEventListener("pointerleave", function() {

    drawing = false;

    clearInterval(circleMovementTimer);

});


// ------------------------------------
// CLEAR
// ------------------------------------

clearBtn.addEventListener("click", function() {

    points = [];

    drawTarget();

});


// ------------------------------------
// DISTANCE BETWEEN TWO POINTS
// ------------------------------------

function distance(p1, p2) {

    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;

    return Math.sqrt(
        dx * dx + dy * dy
    );
}


// ------------------------------------
// CALCULATE SCORE
// ------------------------------------

function calculateScore() {

    if (points.length < 10) {

        return 0;
    }

    let totalDistance = 0;

    let checkedPoints = 0;


    for (let userPoint of points) {

        let closest = Infinity;

        for (let targetPoint of targetPoints) {

            const d =
                distance(
                    userPoint,
                    targetPoint
                );

            if (d < closest) {

                closest = d;
            }
        }

        totalDistance += closest;

        checkedPoints++;
    }


    const averageDistance =
        totalDistance / checkedPoints;


    let accuracy =
        100 - averageDistance / 2;


    if (accuracy < 0) {
        accuracy = 0;
    }


    if (accuracy > 100) {
        accuracy = 100;
    }


    return Math.round(accuracy);
}


// ------------------------------------
// CHECK DRAWING
// ------------------------------------

checkBtn.addEventListener("click", function() {

    const score = calculateScore();

    scoreText.textContent = score;


    result.classList.remove("hidden");


    if (score >= 70) {

        resultTitle.textContent =
            "🎉 Level Complete!";

        resultText.textContent =
            `Amazing! Your accuracy is ${score}%.`;

        nextBtn.style.display = "inline-block";

    } else {

        resultTitle.textContent =
            "Try Again!";

        resultText.textContent =
            `Your accuracy is ${score}%. Try drawing closer to the target.`;

        nextBtn.style.display = "none";
    }

});


// ------------------------------------
// NEXT LEVEL
// ------------------------------------

nextBtn.addEventListener("click", function() {

    level++;

    if (level > 5) {

        level = 1;
    }

    levelText.textContent = level;

    points = [];

    result.classList.add("hidden");

    time = 30;

    timerText.textContent = time;

    startTimer();

    drawTarget();

});


// ------------------------------------
// TIMER
// ------------------------------------

function startTimer() {

    clearInterval(timer);

    timer = setInterval(function() {

        time--;

        timerText.textContent = time;


        if (time <= 0) {

            clearInterval(timer);

            result.classList.remove("hidden");

            resultTitle.textContent =
                "⏰ Time's Up!";

            resultText.textContent =
                "Try again and complete the shape faster.";

            nextBtn.style.display = "none";
        }

    }, 1000);
}


// ------------------------------------
// START GAME
// ------------------------------------

window.addEventListener("resize", function() {

    resizeCanvas();

});


resizeCanvas();

startTimer();