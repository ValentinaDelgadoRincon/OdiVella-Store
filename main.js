let carritoGlobal = JSON.parse(localStorage.getItem("carrito")) || [];
let productosGlobales = [];

async function cargarProductos() {
  try {
    const respuesta = await fetch('https://fakestoreapi.com/products');
    const productos = await respuesta.json();
    console.log(productos);
    

    
    productosGlobales = productos;
    mostrarProductos1(productosGlobales);
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

function mostrarProductos1(productos) {
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
    mensaje.textContent = "No hay productos en tu carrito";
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
    btnEliminar.addEventListener('click', () => {
      eliminarDelCarrito(producto.id);
    });

    const btnRestar = document.createElement('button');
    btnRestar.classList.add('botonRestar');
    btnRestar.textContent = '-';
    btnRestar.addEventListener('click', () => {
      restarUnidadDelCarrito(producto.id);
    });

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

  total.innerHTML = `
    <p>Total value</p>
    <p><span>$${totalCarrito.toFixed(2)}</span></p>
  `;
}

function restarUnidadDelCarrito(idProducto) {
  const producto = carritoGlobal.find(p => p.id === idProducto);
  if (producto) {
    producto.cantidad -= 1;
    if (producto.cantidad <= 0) {
      carritoGlobal = carritoGlobal.filter(p => p.id !== idProducto);
    }
    localStorage.setItem("carrito", JSON.stringify(carritoGlobal));
    actualizarVistaCarrito();
    document.getElementById('numero').innerText = contarProductosTotales();

    if (carritoGlobal.length === 0) {
      document.getElementById('numero').classList.remove("diseñoNumero");
    }
  }
}


function contarProductosTotales() {
  return carritoGlobal.reduce((acc, prod) => acc + prod.cantidad, 0);
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



function finalizarCompra() {
  const mensaje = document.getElementById("mensaje");

  mensaje.classList.add("mostrar");

  setTimeout(() => {
    mensaje.classList.remove("mostrar");
  }, 3000);

  
  carritoGlobal = [];
  localStorage.removeItem("carrito");
  actualizarVistaCarrito();
  document.getElementById('numero').innerText = 0;
  document.getElementById('numero').classList.remove("diseñoNumero");
}


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnFinalizar");
  if (btn) {
    btn.addEventListener("click", finalizarCompra);
  }
});

function asignarEventosAdd() {
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

let todosProductos = [];



function filterProducts(category) {
  const select = todosProductos.filter(product => 
    product.category === category
  );
  mostrarProductos1(select);
}

function filtrarPorPrecio(precio) {
  const filtrados = todosProductos.filter(producto => producto.price <= precio);
  mostrarProductos1(filtrados);
}

function filtrarProductos(texto) {
  const textoLower = texto.toLowerCase();
  const filtrados = todosProductos.filter(producto =>
    producto.title.toLowerCase().includes(textoLower)
  );
  mostrarProductos1(filtrados);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();

  
  const input = document.querySelector('.input');
  input.addEventListener('input', evento => {
    filtrarProductos(evento.target.value);
  });


  const priceBtn = document.getElementById('price-btn');
  const priceInput = document.getElementById('price-input');
  priceBtn.addEventListener('click', () => {
    if (priceInput.style.display === 'none' || priceInput.style.display === '') {
      priceInput.style.display = 'block';
    } else {
      priceInput.style.display = 'none';
    }
  });

 
  priceInput.addEventListener('input', () => {
    const precio = parseFloat(priceInput.value); 
    if (!isNaN(precio)) {
      filtrarPorPrecio(precio);  
    } else {
    
      mostrarProductos(todosProductos);
    }
  });

 
  const imagen = document.getElementById('filter-icon');
  const text = document.getElementById('filter-options');
  imagen.addEventListener('click', () => {
    if (text.style.display === 'none') {
      text.style.display = 'flex';
    } else {
      text.style.display = 'none';
    }
  });
});


function filterCategory(category) {
  const filter = todosProductos.filter((product) => product.category === category);
  localStorage.setItem("filtered", JSON.stringify(filter));
  window.location.href = "category.html";
}


const divMen  = document.getElementById("man")
const divWomen  = document.getElementById("women")
const divJewelry  = document.getElementById("jewelry")
const divTechnology  = document.getElementById("technology")

divMen.addEventListener("click", () => {
  filterCategory("men's clothing");
});
divWomen.addEventListener("click", () => {
  filterCategory("women's clothing");
});

divJewelry.addEventListener("click", () => {
  filterCategory("jewelery");
});

divTechnology.addEventListener("click", () => {
  filterCategory("electronics");
});


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
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarFiltradosEnCategory(); 
});
