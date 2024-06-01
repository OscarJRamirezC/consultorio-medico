const videoElement = document.getElementById('video');

function handleError(error) {
    console.error('Error al acceder a la cámara: ', error);
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
    } catch (error) {
        handleError(error);
    }
}

window.onload = startCamera;

document.getElementById('send').addEventListener('click', async () => {
    const question = document.getElementById('input').value;
    const url = 'http://localhost:8000/consultar';
    const data = { question };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al enviar la pregunta al servidor');
        }

        const responseData = await response.json();
        const responseArea = document.getElementById('ia-response');
        responseArea.textContent = `Respuesta de la IA: ${responseData.respuesta}`;
    } catch (error) {
        console.error('Error:', error);
    }
});
