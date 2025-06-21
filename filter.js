function filterProducts (category,){
    const select= products.filter(product=>
        product.category === category
    );
    const container= document.getElementById ('box-container');

    container.innerHTML = "";
    select.forEach (tarjet =>{
        const group= `
        <span class="discount">Venta</span>
          <div class="image">
            <img src="${tarjet.image}" alt="${tarjet.title}">
            <div class="icons">
              <a href="login.html" class="fas fa-shopping-cart cart-btn">Add</a>
            </div>
          </div>
          <div class="content">
            <h3>${tarjet.title}</h3>
            <div class="price">$${tarjet.price}</div>
          </div>`;
        
          container.innerHTML+=group
    });
};

const buttonPrice = document.getElementById('price-btn');
buttonPrice.addEventListener('click', ()=>{
    filterProducts('price')
});


const imagen = document.getElementById('filter-icon');
const text = document.getElementById('filter-options');
imagen.addEventListener('click', ()=>{
    if (text.style.display==='none'){
        text.style.display='flex'
    }
    else{
        text.style.display='none'
    };
});



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
});


