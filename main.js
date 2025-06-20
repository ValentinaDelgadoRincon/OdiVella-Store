 async function cargarProductos() {
    try {
      const respuesta = await fetch('https://fakestoreapi.com/products');
      const productos = await respuesta.json();

      const contenedor = document.getElementById('product-container');

      productos.forEach(producto => {
        const box = document.createElement('div');
        box.classList.add('box');

        box.innerHTML = `
          <span class="discount">Venta</span>
          <div class="image">
            <img src="${producto.image}" alt="${producto.title}">
            <div class="icons">
              <a href="login.html" class="fas fa-shopping-cart cart-btn">Add</a>
            </div>
          </div>
          <div class="content">
            <h3>${producto.title}</h3>
            <div class="price">$${producto.price}</div>
          </div>
        `;

        contenedor.appendChild(box);
      });
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }
  document.addEventListener('DOMContentLoaded', cargarProductos);







