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
