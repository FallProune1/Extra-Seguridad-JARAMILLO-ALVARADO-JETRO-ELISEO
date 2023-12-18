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
            const message = messageInput.value;
            hideMessage(imageData.data, message);
            ctx.putImageData(imageData, 0, 0);
            downloadImage(canvas.toDataURL());
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(inputFile.files[0]);
});

function hideMessage(data, message) {
    const messageBits = getBitsFromNumber(message.length);
    messageBits.forEach((bit, i) => {
        data[i] = setBit(data[i], 0, bit);
    });

    for (let i = 0; i < message.length; i++) {
        const messageBits = getBitsFromNumber(message.charCodeAt(i));
        for (let j = 0; j < messageBits.length; j++) {
            const dataIndex = i * 16 + j + 16;
            data[dataIndex] = setBit(data[dataIndex], 0, messageBits[j]);
        }
    }
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

function downloadImage(dataUrl) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'image.png';
    link.click();
}
