let carritoGlobal = JSON.parse(localStorage.getItem("carrito")) || [];
let productosGlobales = [];
let todosProductos = []; 

async function cargarProductos() {
  try {
    const respuesta = await fetch('https://fakestoreapi.com/products');
    productosGlobales = await respuesta.json();
    todosProductos = productosGlobales; 
    mostrarProductos(productosGlobales);
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById('product-container');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  productos.forEach(producto => {
    const box = document.createElement('div');
    box.classList.add('box');
    box.innerHTML = `
      <span class="discount">Sale</span>
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

  asignarEventosAdd();
}

function agregarAlCarrito(idProducto) {
  const productoExistente = carritoGlobal.find(p => p.id === idProducto);
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    const producto = productosGlobales.find(p => p.id === idProducto);
    if (producto) {
      carritoGlobal.push({ ...producto, cantidad: 1 });
    }
  }
  localStorage.setItem("carrito", JSON.stringify(carritoGlobal));
  actualizarVistaCarrito();
  document.getElementById('numero').innerText = contarProductosTotales();
  document.getElementById('numero').classList.add("diseñoNumero");
}

function actualizarVistaCarrito() {
  const contenedorCompra = document.getElementById('productosCompra');
  const total = document.getElementById('total');
  contenedorCompra.innerHTML = "";
  total.innerHTML = "";

  if (carritoGlobal.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.textContent = "There are no products in your cart";
    mensaje.classList.add('carrito-vacio');
    contenedorCompra.appendChild(mensaje);
    return;
  }

  let totalCarrito = 0;
  carritoGlobal.forEach(producto => {
    const divProducto = document.createElement('div');
    const divImg = document.createElement('div');
    divImg.classList.add('img');

    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('botonTrash');
    btnEliminar.innerHTML = `<img src="./multimedia/trash.png" alt="Eliminar" />`;
    btnEliminar.addEventListener('click', () => eliminarDelCarrito(producto.id));

    const btnRestar = document.createElement('button');
    btnRestar.classList.add('botonRestar');
    btnRestar.textContent = '-';
    btnRestar.addEventListener('click', () => restarUnidadDelCarrito(producto.id));

    const pTitulo = document.createElement('p');
    pTitulo.textContent = `${producto.title} (x${producto.cantidad})`;

    const pPrecio = document.createElement('p');
    pPrecio.textContent = `$${(producto.price * producto.cantidad).toFixed(2)}`;

    divImg.appendChild(btnEliminar);
    divImg.appendChild(btnRestar);
    divImg.appendChild(pTitulo);
    divProducto.appendChild(divImg);
    divProducto.appendChild(pPrecio);
    contenedorCompra.appendChild(divProducto);

    totalCarrito += producto.price * producto.cantidad;
  });

  total.innerHTML = `<p>Total value</p><p><span>$${totalCarrito.toFixed(2)}</span></p>`;
}

function eliminarDelCarrito(idProducto) {
  carritoGlobal = carritoGlobal.filter(p => p.id !== idProducto);
  localStorage.setItem("carrito", JSON.stringify(carritoGlobal));
  actualizarVistaCarrito();
  document.getElementById('numero').innerText = contarProductosTotales();
  if (carritoGlobal.length === 0) document.getElementById('numero').classList.remove("diseñoNumero");
}

function restarUnidadDelCarrito(idProducto) {
  const producto = carritoGlobal.find(p => p.id === idProducto);
  if (producto) {
    producto.cantidad -= 1;
    if (producto.cantidad <= 0) eliminarDelCarrito(idProducto);
    else {
      localStorage.setItem("carrito", JSON.stringify(carritoGlobal));
      actualizarVistaCarrito();
      document.getElementById('numero').innerText = contarProductosTotales();
    }
  }
}

function contarProductosTotales() {
  return carritoGlobal.reduce((acc, prod) => acc + prod.cantidad, 0);
}

function asignarEventosAdd() {
  const botonesCarrito = document.querySelectorAll('.cart-btn');
  botonesCarrito.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idProducto = parseInt(btn.dataset.id);
      if (!isNaN(idProducto)) agregarAlCarrito(idProducto);
    });
  });
}

function finalizarCompra() {
  const mensaje = document.getElementById("mensaje");
  mensaje.classList.add("mostrar");
  setTimeout(() => mensaje.classList.remove("mostrar"), 3000);

  carritoGlobal = [];
  localStorage.removeItem("carrito");
  actualizarVistaCarrito();
  document.getElementById('numero').innerText = 0;
  document.getElementById('numero').classList.remove("diseñoNumero");
}

function filtrarProductos(texto) {
  const textoLower = texto.toLowerCase();
  const filtrados = productosGlobales.filter(producto => producto.title.toLowerCase().includes(textoLower));
  mostrarProductos(filtrados);
}

function filtrarPorPrecio(precio) {
  const filtrados = productosGlobales.filter(producto => producto.price <= precio);
  mostrarProductos(filtrados);
}

function filterCategory(category) {
  const filtro = todosProductos.filter(product => product.category === category);
  localStorage.setItem("filtered", JSON.stringify(filtro));
  window.location.href = "category.html";
}

function mostrarFiltradosEnCategory() {
  const productosFiltrados = JSON.parse(localStorage.getItem("filtered")) || [];

  if (productosFiltrados.length > 0 && productosFiltrados[0].category === "electronics") {
    document.body.classList.add("technology-page");
  }

  const contenedor = document.getElementById("filtered-container");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  productosFiltrados.forEach(producto => {
    const box = document.createElement('div');
    box.classList.add("box");

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

  asignarEventosAdd();
}


document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();

  document.getElementById('carrito')?.addEventListener('click', () => {
    document.body.style.overflow = 'hidden';
    document.getElementById('contenedorCompra').classList.remove('none');
    document.getElementById('contenedorCompra').classList.add('contenedorCompra');
    document.getElementById('informacionCompra').classList.add('informacionCompra');
    actualizarVistaCarrito();
  });

  document.getElementById('x')?.addEventListener('click', () => {
    document.body.style.overflow = 'auto';
    document.getElementById('contenedorCompra').classList.add('none');
    document.getElementById('contenedorCompra').classList.remove('contenedorCompra');
    document.getElementById('informacionCompra').classList.remove('informacionCompra');
  });

  document.getElementById("btnFinalizar")?.addEventListener("click", finalizarCompra);

  document.querySelector('.input')?.addEventListener('input', e => filtrarProductos(e.target.value));

  const priceInput = document.getElementById('price-input');
  const priceBtn = document.getElementById('price-btn');

  priceBtn?.addEventListener('click', () => {
    priceInput.style.display = priceInput.style.display === 'none' ? 'block' : 'none';
  });

  priceInput?.addEventListener('input', () => {
    const precio = parseFloat(priceInput.value);
    if (!isNaN(precio)) filtrarPorPrecio(precio);
    else mostrarProductos(productosGlobales);
  });

  document.getElementById('filter-icon')?.addEventListener('click', () => {
    const text = document.getElementById('filter-options');
    text.style.display = (text.style.display === 'none' || !text.style.display) ? 'flex' : 'none';
  });


  document.getElementById("man")?.addEventListener("click", () => filterCategory("men's clothing"));
  document.getElementById("women")?.addEventListener("click", () => filterCategory("women's clothing"));
  document.getElementById("jewelry")?.addEventListener("click", () => filterCategory("jewelery"));
  document.getElementById("technology")?.addEventListener("click", () => filterCategory("electronics"));

  
  if (window.location.pathname.includes("category.html")) {
    mostrarFiltradosEnCategory();
  }
});
