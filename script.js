const BLOCK_SIZE = 80;
const images = {};
let imagesLoaded = 0;
const totalImages = 6;

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
    });
}


async function preloadImages() {
    try {
        images['R'] = await loadImage('img/R.png');
        images['V'] = await loadImage('img/V.png');
        images['I'] = await loadImage('img/I.png');
        images['G'] = await loadImage('img/G.png');
        images['C'] = await loadImage('img/C.png');
        images['space'] = await loadImage('img/space.png');
        images['line'] = await loadImage('img/line.png');
        images['angle'] = await loadImage('img/angle.png');
        images['3way'] = await loadImage('img/3.png');
        images['4way'] = await loadImage('img/4.png');
        document.querySelectorAll('button').forEach(btn => btn.disabled = false);
        updateStatusBar('Ready');
        renderMatrix();
    } catch (error) {
        updateStatusBar('Error loading images');
    }
}

function showInfoPopup() {
    const popup = document.getElementById('infoPopup');
    popup.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeInfoPopup(event) {
    if (event && event.target !== document.getElementById('infoPopup')) return;

    const popup = document.getElementById('infoPopup');
    popup.classList.remove('show');
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeInfoPopup();
    }
});

function updateLineNumbers() {
    const textarea = document.getElementById('matrixInput');
    const lineNumbers = document.getElementById('lineNumbers');
    const lines = textarea.value.split('\n');

    lineNumbers.innerHTML = '';

    let lastNonEmptyLine = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== '' || i < lines.length - 1) {
            lastNonEmptyLine = i + 1;
        }
    }

    const totalLines = Math.max(lastNonEmptyLine, 1);
    for (let i = 1; i <= totalLines; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = i;
        lineNumbers.appendChild(lineNumber);
    }
}

function updateCharCount() {
    const textarea = document.getElementById('matrixInput');
    const charCount = document.getElementById('charCount');
    charCount.textContent = `Characters: ${textarea.value.length}`;
}

function updateCanvasSize() {
    const canvas = document.getElementById('canvas');
    const canvasSize = document.getElementById('canvasSize');
    canvasSize.textContent = `${canvas.width}×${canvas.height}`;
}

function updateStatusBar(status) {
    const statusItems = document.querySelectorAll('.status-item span');
    if (statusItems[0]) {
        statusItems[0].textContent = status;
    }
}

document.querySelectorAll('button').forEach(btn => btn.disabled = true);

const textarea = document.getElementById('matrixInput');
textarea.addEventListener('input', () => {
    updateLineNumbers();
    updateCharCount();
});

window.addEventListener('DOMContentLoaded', () => {
    updateLineNumbers();
    updateCharCount();
    preloadImages();
});

function parseMatrix(input) {
    const lines = input.split('\n');
    const matrix = [];
    let maxWidth = 0;

    for (let line of lines) {
        const chars = [];
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === ' ') {
                chars.push(' ');
            } else {
                chars.push(char);
            }
        }
        matrix.push(chars);
        maxWidth = Math.max(maxWidth, chars.length);
    }

    for (let row of matrix) {
        while (row.length < maxWidth) {
            row.push(' ');
        }
    }

    return matrix;
}

function analyzeConnectionPattern(x, y, matrix) {
    const current = matrix[y][x];
    const height = matrix.length;
    const width = matrix[0].length;

    if (current === ' ') {
        return { symbol: 'space', rotation: 0 };
    }

    const up = y > 0 ? matrix[y - 1][x] : null;
    const down = y < height - 1 ? matrix[y + 1][x] : null;
    const left = x > 0 ? matrix[y][x - 1] : null;
    const right = x < width - 1 ? matrix[y][x + 1] : null;

    const connectableChars = ['+', '-', '|', 'R', 'G', 'V', 'I','C'];

    const hasUp = up && connectableChars.includes(up);
    const hasDown = down && connectableChars.includes(down);
    const hasLeft = left && connectableChars.includes(left);
    const hasRight = right && connectableChars.includes(right);

    if (current === 'R' || current === 'G' || current === 'V' || current === 'I' || current === 'C') {
        if (current === 'V') {
            if (left === '+') {
                return { symbol: current, rotation: 270 };
            } else if (right === '+') {
                return { symbol: current, rotation: 90 };
            } else if (up === '+') {
                return { symbol: current, rotation: 0 };
            } else if (down === '+') {
                return { symbol: current, rotation: 180 };
            }
        }
        if (current === 'I') {
            if (left === '+') {
                return { symbol: current, rotation: 270 };
            } else if (right === '+') {
                return { symbol: current, rotation: 90 };
            } else if (up === '+') {
                return { symbol: current, rotation: 0 };
            } else if (down === '+') {
                return { symbol: current, rotation: 180 };
            }
        }
        if ((hasLeft || hasRight) && !(hasUp || hasDown)) {
            if (current === 'G') {
                if (hasLeft && !hasRight) {
                    return { symbol: current, rotation: 270 };
                } else if (hasRight && !hasLeft) {
                    return { symbol: current, rotation: 90 };
                } else {
                    return { symbol: current, rotation: 90 };
                }
            } else {
                return { symbol: current, rotation: 90 };
            }
        }
        return { symbol: current, rotation: 0 };
    }

    if (current === '-') {
        if (hasUp || hasDown) {
            const connections = [hasUp, hasDown, hasLeft, hasRight].filter(Boolean).length;

            if (connections === 4) {
                return { symbol: '4way', rotation: 0 };
            } else if (connections === 3) {
                if (!hasUp) return { symbol: '3way', rotation: 0 };
                if (!hasDown) return { symbol: '3way', rotation: 180 };
                if (!hasLeft) return { symbol: '3way', rotation: 270 };
                if (!hasRight) return { symbol: '3way', rotation: 90 };
            } else if (connections === 2) {
                if (hasDown && hasRight) return { symbol: 'angle', rotation: 0 };
                if (hasDown && hasLeft) return { symbol: 'angle', rotation: 90 };
                if (hasUp && hasLeft) return { symbol: 'angle', rotation: 180 };
                if (hasUp && hasRight) return { symbol: 'angle', rotation: 270 };
            }
        }
        return { symbol: 'line', rotation: 90 };
    }

    if (current === '|') {
        if (hasLeft || hasRight) {
            const connections = [hasUp, hasDown, hasLeft, hasRight].filter(Boolean).length;

            if (connections === 4) {
                return { symbol: '4way', rotation: 0 };
            } else if (connections === 3) {
                if (!hasUp) return { symbol: '3way', rotation: 180 };
                if (!hasDown) return { symbol: '3way', rotation: 0 };
                if (!hasLeft) return { symbol: '3way', rotation: 270 };
                if (!hasRight) return { symbol: '3way', rotation: 90 };
            } else if (connections === 2) {
                if (hasDown && hasRight) return { symbol: 'angle', rotation: 0 };
                if (hasDown && hasLeft) return { symbol: 'angle', rotation: 90 };
                if (hasUp && hasLeft) return { symbol: 'angle', rotation: 180 };
                if (hasUp && hasRight) return { symbol: 'angle', rotation: 270 };
            }
        }
        return { symbol: 'line', rotation: 0 };
    }

    if (current === '+') {
        if (hasUp || hasDown) {
            const connections = [hasUp, hasDown, hasLeft, hasRight].filter(Boolean).length;

            if (connections === 4) {
                return { symbol: '4way', rotation: 0 };
            } else if (connections === 3) {
                if (!hasUp) return { symbol: '3way', rotation: 0 };
                if (!hasDown) return { symbol: '3way', rotation: 180 };
                if (!hasLeft) return { symbol: '3way', rotation: 270 };
                if (!hasRight) return { symbol: '3way', rotation: 90 };
            } else if (connections === 2) {
                if (hasDown && hasRight) return { symbol: 'angle', rotation: 0 };
                if (hasDown && hasLeft) return { symbol: 'angle', rotation: 90 };
                if (hasUp && hasLeft) return { symbol: 'angle', rotation: 180 };
                if (hasUp && hasRight) return { symbol: 'angle', rotation: 270 };
            }
        } else {
            return { symbol: 'line', rotation: 90 };
        }
        if (hasLeft || hasRight) {
            const connections = [hasUp, hasDown, hasLeft, hasRight].filter(Boolean).length;

            if (connections === 4) {
                return { symbol: '4way', rotation: 0 };
            } else if (connections === 3) {
                if (!hasUp) return { symbol: '3way', rotation: 180 };
                if (!hasDown) return { symbol: '3way', rotation: 0 };
                if (!hasLeft) return { symbol: '3way', rotation: 270 };
                if (!hasRight) return { symbol: '3way', rotation: 90 };
            } else if (connections === 2) {
                if (hasDown && hasRight) return { symbol: 'angle', rotation: 0 };
                if (hasDown && hasLeft) return { symbol: 'angle', rotation: 90 };
                if (hasUp && hasLeft) return { symbol: 'angle', rotation: 180 };
                if (hasUp && hasRight) return { symbol: 'angle', rotation: 270 };
            }
        } else {
            return { symbol: 'line', rotation: 0 };
        }
    }

    return { symbol: 'space', rotation: 0 };
}

function determineSymbolAndRotation(x, y, matrix, char) {
    return analyzeConnectionPattern(x, y, matrix);
}

function updateCanvasWrapperSize() {
    const canvas = document.getElementById('canvas');
    const wrapper = canvas.parentElement;
    wrapper.style.width = canvas.width + 'px';
    wrapper.style.height = canvas.height + 'px';
}

async function renderMatrix() {
    updateStatusBar('Generating...');
    const input = document.getElementById("matrixInput").value;
    const matrix = parseMatrix(input);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = matrix[0].length * BLOCK_SIZE;
    canvas.height = matrix.length * BLOCK_SIZE;
    updateCanvasWrapperSize();
    updateCanvasSize();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const char = matrix[y][x];
            const symbolInfo = determineSymbolAndRotation(x, y, matrix, char);

            const image = images[symbolInfo.symbol];
            const rotation = symbolInfo.rotation;

            if (image) {
                ctx.save();
                const centerX = x * BLOCK_SIZE + BLOCK_SIZE / 2;
                const centerY = y * BLOCK_SIZE + BLOCK_SIZE / 2;

                if (rotation !== 0) {
                    ctx.translate(centerX, centerY);
                    ctx.rotate(rotation * Math.PI / 180);
                    ctx.drawImage(image, -BLOCK_SIZE / 2, -BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE);
                } else {
                    ctx.drawImage(image, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }

                ctx.restore();
            }
        }
    }
    updateStatusBar('Ready');
}

function downloadImage() {
    renderMatrix();

    setTimeout(() => {
        const canvas = document.getElementById("canvas");
        if (canvas.width === 0 || canvas.height === 0) {
            updateStatusBar('Canvas vuoto, impossibile esportare');
            setTimeout(() => updateStatusBar('Ready'), 2000);
            return;
        }

        let dataURL;
        try {
            dataURL = canvas.toDataURL('image/png');
        } catch (err) {
            console.error(err);
            updateStatusBar('Errore CORS: servi le immagini via http://localhost e abilita crossOrigin');
            setTimeout(() => updateStatusBar('Ready'), 4000);
            return;
        }

        const link = document.createElement('a');
        link.download = 'circuit.png';
        link.href = dataURL;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        updateStatusBar('Image downloaded');
        setTimeout(() => updateStatusBar('Ready'), 2000);
    }, 100);
}
