const inputFile = document.querySelector("input[type='file']");
const messageInput = document.querySelector("textarea");
const keyInput = document.querySelector(".clave input");
const button = document.querySelector(".show button");

button.addEventListener('click', function() {
    if (keyInput.value !== 'Extrapapu') {
        alert('Clave incorrecta');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const message = showMessage(imageData.data);
            messageInput.value = message;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(inputFile.files[0]);
});

function showMessage(data) {
    const lengthBits = [];
    for (let i = 0; i < 16; i++) {
        lengthBits.push(getBit(data[i], 0));
    }
    const messageLength = getNumberFromBits(lengthBits);

    let message = '';
    for (let i = 0; i < messageLength; i++) {
        const charBits = [];
        for (let j = 0; j < 16; j++) {
            const dataIndex = i * 16 + j + 16;
            charBits.push(getBit(data[dataIndex], 0));
        }
        message += String.fromCharCode(getNumberFromBits(charBits));
    }

    return message;
}

function getBitsFromNumber(number) {
    const bits = [];
    for (let i = 0; i < 16; i++) {
        bits.push(getBit(number, i));
    }
    return bits;
}

function getBit(number, bitPosition) {
    return (number & (1 << bitPosition)) === 0 ? 0 : 1;
}

function setBit(number, bitPosition, bit) {
    if (bit === 1) {
        return number | (1 << bitPosition);
    } else {
        return number & ~(1 << bitPosition);
    }
}

function getNumberFromBits(bits) {
    let number = 0;
    for (let i = 0; i < bits.length; i++) {
        number += bits[i] * Math.pow(2, i);
    }
    return number;
}
