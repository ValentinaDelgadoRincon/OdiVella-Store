let todosProductos = [];

async function cargarProductos() {
  try {
    const respuesta = await fetch('https://fakestoreapi.com/products');
    todosProductos = await respuesta.json(); 
    mostrarProductos(todosProductos);  
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
          <a class="fas fa-shopping-cart cart-btn">Add</a>
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


function filterProducts(category) {
  const select = todosProductos.filter(product => 
    product.category === category
  );
  mostrarProductos(select);
}

function filtrarPorPrecio(precio) {
  const filtrados = todosProductos.filter(producto => producto.price <= precio);
  mostrarProductos(filtrados);
}

function filtrarProductos(texto) {
  const textoLower = texto.toLowerCase();
  const filtrados = todosProductos.filter(producto =>
    producto.title.toLowerCase().includes(textoLower)
  );
  mostrarProductos(filtrados);
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
