let carritoGlobal = JSON.parse(localStorage.getItem("carrito")) || [];
let productosGlobales = [];
let todosProductos = [];

const API = 'https://fakestoreapi.com/products';

async function cargarProductos() {
  try {
    const respuesta = await fetch(API);
    productosGlobales = await respuesta.json();
    todosProductos = productosGlobales;


    localStorage.setItem("todosProductos", JSON.stringify(todosProductos));

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


    const discount = document.createElement('span');
    discount.classList.add('discount');
    discount.textContent = 'Sale';
  

    const fav = document.createElement('span');
    fav.classList.add('fav');
    fav.textContent = 'Fav';

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');

    const img = document.createElement('img');
    img.src = producto.image;
    img.alt = producto.title;

    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add('icons');

    const cartBtn = document.createElement('a');
    cartBtn.href = '#';
    cartBtn.classList.add('cart-btn');
    cartBtn.setAttribute('data-id', producto.id);

    const cartIcon = document.createElement('i');
    cartIcon.classList.add('fas', 'fa-shopping-cart');

  

    cartBtn.appendChild(cartIcon);
    cartBtn.appendChild(document.createTextNode('Add'));
    iconsDiv.appendChild(cartBtn);
    imageDiv.appendChild(img);
    imageDiv.appendChild(iconsDiv);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    const title = document.createElement('h3');
    title.textContent = producto.title;

    const price = document.createElement('div');
    price.classList.add('price');
    price.textContent = `$${producto.price}`;

    contentDiv.appendChild(title);
    contentDiv.appendChild(price);

    box.appendChild(discount);
    box.appendChild(fav);
    box.appendChild(imageDiv);
    box.appendChild(contentDiv);

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
  actualizarNumeroCarrito();
  actualizarVistaCarrito();
}




function actualizarVistaCarrito() {
  const contenedorCompra = document.getElementById('productosCompra');
  const total = document.getElementById('total');
  if (!contenedorCompra || !total) return;

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
    const imgTrash = document.createElement('img');
    imgTrash.src = "./multimedia/trash.png";
    imgTrash.alt = "Eliminar";
    btnEliminar.appendChild(imgTrash);

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

  const p1 = document.createElement('p');
  p1.textContent = "Total value";

  const p2 = document.createElement('p');
  const span = document.createElement('span');
  span.textContent = `$${totalCarrito.toFixed(2)}`;
  p2.appendChild(span);

  total.appendChild(p1);
  total.appendChild(p2);

}

function eliminarDelCarrito(idProducto) {
  carritoGlobal = carritoGlobal.filter(p => p.id !== idProducto);
  localStorage.setItem("carrito", JSON.stringify(carritoGlobal));
  actualizarVistaCarrito();
  actualizarNumeroCarrito();
}

function restarUnidadDelCarrito(idProducto) {
  const producto = carritoGlobal.find(p => p.id === idProducto);
  if (producto) {
    producto.cantidad -= 1;
    if (producto.cantidad <= 0) eliminarDelCarrito(idProducto);
    else {
      localStorage.setItem("carrito", JSON.stringify(carritoGlobal));
      actualizarVistaCarrito();
      actualizarNumeroCarrito();
    }
  }
}

function contarProductosTotales() {
  return carritoGlobal.reduce((acc, prod) => acc + prod.cantidad, 0);
}

function actualizarNumeroCarrito() {
  const numero = document.getElementById('numero');
  if (!numero) return;

  const total = contarProductosTotales();
  numero.innerText = total;

  if (total > 0) {
    numero.classList.add("diseñoNumero");
  } else {
    numero.classList.remove("diseñoNumero");
  }
}

function asignarEventosAdd() {
  const botonesCarrito = document.querySelectorAll('.cart-btn');
  botonesCarrito.forEach(btn => {
    btn.addEventListener('click', (evento) => {
      evento.preventDefault();
      const idProducto = parseInt(btn.dataset.id);
      if (!isNaN(idProducto)) agregarAlCarrito(idProducto);
    });
  });
}



function asignarEventosFav() {
  const botonFav = document.querySelectorAll('.cart-btn');
  botonFav.forEach(btn => {
    btn.addEventListener('click', (evento) => {
      evento.preventDefault();
      const idProducto = parseInt(btn.dataset.id);
      if (!isNaN(idProducto)) agregar(idProducto);
    });
  });
}



function finalizarCompra() {
  const mensaje = document.getElementById("mensaje");
  mensaje?.classList.add("mostrar");
  setTimeout(() => mensaje?.classList.remove("mostrar"), 3000);

  carritoGlobal = [];
  localStorage.removeItem("carrito");
  actualizarVistaCarrito();
  actualizarNumeroCarrito();
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
  const productosLocales = JSON.parse(localStorage.getItem("todosProductos")) || [];
  const filtro = productosLocales.filter(product => product.category === category);
  localStorage.setItem("filtered", JSON.stringify(filtro));
  window.location.href = "category.html";
}

function mostrarFiltradosEnCategory() {
  const productosFiltrados = JSON.parse(localStorage.getItem("filtered")) || [];
  const contenedor = document.getElementById("filtered-container");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  productosFiltrados.forEach(producto => {
    const box = document.createElement('div');
    box.classList.add("box");

    const discount = document.createElement('span');
    discount.classList.add('discount');
    discount.textContent = "Venta";

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');

    const img = document.createElement('img');
    img.src = producto.image;
    img.alt = producto.title;

    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add('icons');

    const cartBtn = document.createElement('a');
    cartBtn.href = '#';
    cartBtn.classList.add('cart-btn');
    cartBtn.dataset.id = producto.id;

    const cartIcon = document.createElement('i');
    cartIcon.classList.add('fas', 'fa-shopping-cart');

    cartBtn.appendChild(cartIcon);
    cartBtn.appendChild(document.createTextNode(' Add'));
    iconsDiv.appendChild(cartBtn);
    imageDiv.appendChild(img);
    imageDiv.appendChild(iconsDiv);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    const title = document.createElement('h3');
    title.textContent = producto.title;

    const price = document.createElement('div');
    price.classList.add('price');
    price.textContent = `$${producto.price}`;

    contentDiv.appendChild(title);
    contentDiv.appendChild(price);

    box.appendChild(discount);
    box.appendChild(imageDiv);
    box.appendChild(contentDiv);
    box.appendChild(fav);

    contenedor.appendChild(box);
  });

  asignarEventosAdd();
}


document.addEventListener('DOMContentLoaded', () => {
  actualizarNumeroCarrito();

  if (window.location.pathname.includes("category.html")) {
    const data = JSON.parse(localStorage.getItem("todosProductos")) || [];
    productosGlobales = data;
    todosProductos = data;

    mostrarFiltradosEnCategory();

    document.getElementById("man")?.addEventListener("click", () => filterCategory("men's clothing"));
    document.getElementById("women")?.addEventListener("click", () => filterCategory("women's clothing"));
    document.getElementById("jewelry")?.addEventListener("click", () => filterCategory("jewelery"));
    document.getElementById("technology")?.addEventListener("click", () => filterCategory("electronics"));
  } else {
    cargarProductos();

    document.getElementById("man")?.addEventListener("click", () => filterCategory("men's clothing"));
    document.getElementById("women")?.addEventListener("click", () => filterCategory("women's clothing"));
    document.getElementById("jewelry")?.addEventListener("click", () => filterCategory("jewelery"));
    document.getElementById("technology")?.addEventListener("click", () => filterCategory("electronics"));
  }

  document.getElementById('carrito')?.addEventListener('click', () => {
    document.body.style.overflow = 'hidden';
    document.getElementById('contenedorCompra')?.classList.remove('none');
    document.getElementById('contenedorCompra')?.classList.add('contenedorCompra');
    document.getElementById('informacionCompra')?.classList.add('informacionCompra');
    actualizarVistaCarrito();
  });

  document.getElementById('x')?.addEventListener('click', () => {
    document.body.style.overflow = 'auto';
    document.getElementById('contenedorCompra')?.classList.add('none');
    document.getElementById('contenedorCompra')?.classList.remove('contenedorCompra');
    document.getElementById('informacionCompra')?.classList.remove('informacionCompra');
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
});
