const cards = document.getElementById('cards');
const cards2 = document.getElementById('cards2');
const cards3 = document.getElementById('cards3');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', ()=>{
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e=>{
    addCarrito(e)
})

cards2.addEventListener('click', e=>{
    addCarrito(e)
})

cards3.addEventListener('click', e=>{
    addCarrito(e)
})

items.addEventListener('click', e=>{
    btnAcction(e)
})

const fetchData =async () =>{
    try{
        const res = await fetch('api.json')
        //console.log(res)
        const data_1 = await res.json()
        const data = data_1.producto
        const dataNew = data_1.producto_2
        const dataNew2 = data_1.producto_3
        //console.log(dataNew)
        printCards(data)
        printCards_2(dataNew)
        printCards_3(dataNew2)

    }catch(error){
        console.log(error)
    }
}

const printCards = data =>{
    data.forEach(product => {
        //console.log(product.precio)
        templateCard.querySelector('h5').textContent = product.title
       templateCard.querySelector('p').textContent = product.precio
        templateCard.querySelector('img').setAttribute("src", product.img)
       templateCard.querySelector('.btn-dark').dataset.id = product.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const printCards_2 = dataNew =>{
    dataNew.forEach(product => {
        //console.log(product.precio)
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('p').textContent = product.precio
        templateCard.querySelector('img').setAttribute("src", product.img)
        templateCard.querySelector('.btn-dark').dataset.id = product.id
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards2.appendChild(fragment)
}

const printCards_3 = dataNew2 =>{
    dataNew2.forEach(product => {
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('p').textContent = product.precio
        templateCard.querySelector('img').setAttribute("src", product.img)
        templateCard.querySelector('.btn-dark').dataset.id = product.id
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards3.appendChild(fragment)
}

const addCarrito = e =>{
    //console.log(e.target)
    //console.log(e.target.classList.contains('btn-dark'))

    if(e.target.classList.contains('btn-dark')){
        //console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto =>{
   // console.log(objeto)

   const producto = {
    id: objeto.querySelector('.btn-dark').dataset.id,
    title: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad:1
   }
   //console.log(producto)

   if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad +1
   }

   carrito[producto.id] = {...producto}
   //console.log(producto)
   pintarCarrito()

   localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarCarrito = () =>{
    //console.log(carrito)
    items.innerHTML =''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent= producto.title
        templateCarrito.querySelectorAll('td')[1].textContent= producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
}

const pintarFooter= ()=>{
    footer.innerHTML = ''
    if(Object.keys(carrito).length ===0){
        footer.innerHTML =  `<th scope="row" colspan="5" id="adv">
        <p>Carrito vacío - comience a comprar!</p>
    </th>`
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad,0)
    //console.log(nCantidad)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio}) => acc + cantidad * precio,0)
    //console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click',() => {
        carrito = {}
        pintarCarrito()
        localStorage.removeItem('carrito', JSON.stringify(carrito))
    })
    
}

const btnAcction = e => {
    //console.log(e.target)
    if(e.target.classList.contains('btn-info')){
        //console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad +1
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad -1
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
        localStorage.removeItem('carrito', JSON.stringify(carrito))
    }
    
    e.stopPropagation()
}