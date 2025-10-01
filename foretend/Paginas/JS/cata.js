// frontend/Paginas/JS/cata.js
import { addToUniformBasket, getUniformBasket } from './uniformBasketManager.js'; // Importa el nuevo manager

document.addEventListener('DOMContentLoaded', () => {
    // Maneja los clics en los botones "Solicitar Uniforme"
    document.querySelectorAll('.add-to-basket-btn').forEach(button => { // Cambiado a add-to-basket-btn
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            const talla = e.target.dataset.talla; // Nuevo campo
            const estado = e.target.dataset.estado; // Nuevo campo
            const image = e.target.dataset.image;

            const uniformeParaCesta = { id, name, talla, estado, image }; // Objeto completo

            if (addToUniformBasket(uniformeParaCesta)) { // Usa la función centralizada
                alert(`${name} (Talla: ${talla}) añadido a tu cesta de solicitudes.`);
            } else {
                alert(`${name} (Talla: ${talla}) ya está en tu cesta de solicitudes.`);
            }
            console.log('Cesta actual:', getUniformBasket());
        });
    });
});