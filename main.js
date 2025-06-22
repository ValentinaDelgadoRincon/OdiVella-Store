let carritoGlobal = JSON.parse(localStorage.getItem("carrito")) || [];
let productosGlobales = [];

async function cargarProductos() {
  try {
    const respuesta = await fetch('https://fakestoreapi.com/products');
    const productos = await respuesta.json();

    productosGlobales = productos;
    mostrarProductos(productosGlobales);
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById('product-container');
  contenedor.innerHTML = '';

  productos.forEach(producto => {
    const box = document.createElement('div');
    box.classList.add('box');

    box.innerHTML = `
      <span class="discount">Venta</span>
      <div class="image">
        <img src="${producto.image}" alt="${producto.title}">
        <div class="icons">
        
<a href="#" class="cart-btn" data-id="${producto.id}">
  <i class="fas fa-shopping-cart"></i> Add
</a>

        </div>
      </div>
      <div class="content">
        <h3>${producto.title}</h3>
        <div class="price">$${producto.price}</div>
      </div>
    `;

    contenedor.appendChild(box);
  });

  const botonesCarrito = document.querySelectorAll('.cart-btn');
  botonesCarrito.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idProducto = parseInt(btn.dataset.id);
      if (!isNaN(idProducto)) {
        agregarAlCarrito(idProducto);
      }
    });
  });
}

function agregarAlCarrito(idProducto) {
  const productoExistente = carritoGlobal.find(p => p.id === idProducto);

  if (!productoExistente) {
    const producto = productosGlobales.find(p => p.id === idProducto);
    if (producto) {
      carritoGlobal.push(producto);
      localStorage.setItem("carrito", JSON.stringify(carritoGlobal));
      document.getElementById('numero').innerText = carritoGlobal.length;
      document.getElementById('numero').classList.add("diseñoNumero");
      actualizarVistaCarrito();
    }
  } else {
    alert("Este producto ya está en el carrito.");
  }
}

function actualizarVistaCarrito() {
  const contenedorCompra = document.getElementById('productosCompra');
  const total = document.getElementById('total');
  contenedorCompra.innerHTML = "";

  let totalCarrito = 0;

  carritoGlobal.forEach(producto => {
    const divProducto = document.createElement('div');
    const divImg = document.createElement('div');
    divImg.classList.add('img');

    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('botonTrash');
    btnEliminar.innerHTML = `<img src="./multimedia/trash.png" alt="Eliminar" />`;
    btnEliminar.addEventListener('click', () => {
      eliminarDelCarrito(producto.id);
    });

    const pTitulo = document.createElement('p');
    pTitulo.textContent = producto.title;

    const pPrecio = document.createElement('p');
    pPrecio.textContent = `$${producto.price}`;

    divImg.appendChild(btnEliminar);
    divImg.appendChild(pTitulo);
    divProducto.appendChild(divImg);
    divProducto.appendChild(pPrecio);
    contenedorCompra.appendChild(divProducto);

    totalCarrito += producto.price;
  });

  total.innerHTML = `
    <p>Valor Total</p>
    <p><span>$${totalCarrito.toFixed(2)}</span></p>
  `;
}

function eliminarDelCarrito(idProducto) {
  carritoGlobal = carritoGlobal.filter(p => p.id !== idProducto);
  localStorage.setItem("carrito", JSON.stringify(carritoGlobal));
  actualizarVistaCarrito();
  document.getElementById('numero').innerText = carritoGlobal.length;

  if (carritoGlobal.length === 0) {
    document.getElementById('numero').classList.remove("diseñoNumero");
  }
}

document.getElementById('carrito').addEventListener('click', () => {
  document.body.style.overflow = 'hidden';
  document.getElementById('contenedorCompra').classList.remove('none');
  document.getElementById('contenedorCompra').classList.add('contenedorCompra');
  document.getElementById('informacionCompra').classList.add('informacionCompra');
  actualizarVistaCarrito();
});

document.getElementById('x').addEventListener('click', () => {
  document.body.style.overflow = 'auto';
  document.getElementById('contenedorCompra').classList.add('none');
  document.getElementById('contenedorCompra').classList.remove('contenedorCompra');
  document.getElementById('informacionCompra').classList.remove('informacionCompra');
});

window.addEventListener('load', () => {
  cargarProductos();
});

