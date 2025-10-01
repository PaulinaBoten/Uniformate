// frontend/Paginas/JS/uniformBasketManager.js (anteriormente cartManager.js)

let uniformBasket = JSON.parse(sessionStorage.getItem('uniformBasket')) || [];

function saveUniformBasket() {
    sessionStorage.setItem('uniformBasket', JSON.stringify(uniformBasket));
    document.dispatchEvent(new Event('uniformBasketUpdated')); // Disparar evento para actualizar UI
}

function getUniformBasket() {
    return uniformBasket;
}

// Añade un uniforme a la cesta (ahora solo se añade si no está, y siempre cantidad 1)
function addToUniformBasket(uniforme) {
    const existingUniform = uniformBasket.find(item => item.id === uniforme.id);
    if (!existingUniform) {
        // Añade el uniforme con todos sus detalles para la visualización
        uniformBasket.push({ ...uniforme, quantity: 1 }); // quantity es siempre 1 para solicitudes
        saveUniformBasket();
        return true; // Indicador de éxito
    }
    return false; // Ya estaba en la cesta
}

// Elimina un uniforme de la cesta
function removeUniformFromBasket(uniformeId) {
    const initialLength = uniformBasket.length;
    uniformBasket = uniformBasket.filter(item => item.id !== uniformeId);
    if (uniformBasket.length < initialLength) {
        saveUniformBasket();
        return true; // Eliminado con éxito
    }
    return false; // No encontrado
}

function clearUniformBasket() {
    uniformBasket = [];
    saveUniformBasket();
}

export { uniformBasket, saveUniformBasket, getUniformBasket, addToUniformBasket, removeUniformFromBasket, clearUniformBasket };