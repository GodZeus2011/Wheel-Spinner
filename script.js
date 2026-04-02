let options = [];

const optionInput = document.getElementById("optionInput");
const addBtn = document.getElementById("addBtn");
const spinBtn = document.getElementById("spinBtn");
const clearBtn = document.getElementById("clearBtn");
const resultText = document.getElementById("resultText");
const optionsContainer = document.getElementById("optionsContainer");


const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
let rotation = 0;
let spinning = false;

addBtn.addEventListener("click", addOption);
spinBtn.addEventListener("click", spinWheel);
clearBtn.addEventListener("click", clearAllOptions);


function addOption() {
    const value = optionInput.value.trim()
    if (!value) return;

    options.push(value);
    optionInput.value = "";
    resultText.textContent = `${value} added`;

    renderOptions();
    drawWheel();
}

function renderOptions () {
    optionsContainer.innerHTML = "";

    options.forEach((option, index) => {
        const tag = document.createElement("div");
        tag.className = "option-tag";

        const text = document.createElement("span");
        text.textContent = option;

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-option";
        removeBtn.innerHTML = "&times;";
        removeBtn.addEventListener("click", () => removeOption(index));

        tag.appendChild(text);
        tag.appendChild(removeBtn);
        optionsContainer.appendChild(tag);
    });
}

function removeOption (index) {
    if (spinning) return;

    const removed = options[index];
    options.splice(index, 1);

    renderOptions();
    drawWheel();

    if (option.length === 0) {
        resultText.textContent = `${removed} removed. Wheel is empty.`
    } else {
        resultText.textContent = `${removed} removed.`
    };
}

function clearAllOptions () {
    if (spinning) return;

    options = [];
    rotation = 0;
    renderOptions();
    drawWheel();
    resultText.textContent = "All options cleared.";
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;
    const sliceAngle = (2 * Math.PI) / options.length;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (options.length === 0) return;

    options.forEach((option, i) => {
        const startAngle = rotation + i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX,centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = `hsl(${i * 60}, 70%, 60%)`;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.fillStyle = "#000000";
        ctx.font = "16px Arial";
        ctx.textAlign = "right";
        ctx.fillText(option, radius - 20, 5);
        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
}

function spinWheel() {
    if (spinning || options.length < 2) {
        if (options.length < 2) {
            resultText.textContent = "Add at least 2 options";
        }
        return;
    }

    spinning = true;
    resultText.textContent = "spinning....."
    let speed = Math.random() * 0.3 + 0.4;

    function animate() {
        rotation += speed;
        speed *= 0.98;

        drawWheel();

        if (speed > 0.002) {
            requestAnimationFrame(animate);
        }
        else {
            spinning = false;
            showResult();
        }
    }
    animate();
}

function showResult() {
    const sliceAngle = (2 * Math.PI) / options.length;

    const pointerAngle = -Math.PI / 2;

    let adjustedAngle = (pointerAngle - rotation) % (2 * Math.PI);

    if (adjustedAngle < 0) {
        adjustedAngle += 2 * Math.PI;
    }

    const index = Math.floor(adjustedAngle / sliceAngle) % options.length;
    const winner = options[index];

    resultText.textContent = `Result: ${winner}`
}

drawWheel();

optionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addOption();
    }
});

document.getElementById("spinBtn").addEventListener("click", spinWheel);
