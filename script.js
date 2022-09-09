// const cart_items = document.querySelector('#cart .cart-items')
// const parentContainer = document.getElementById('EcommerceContainer');
// parentContainer.addEventListener('click',(e)=>{
//     if(e.target.className == 'shop-item-button'){
//         const id = e.target.parentNode.parentNode.id
//         const name = document.querySelector(`#${id} h3`).innerText;
//         const img_src = document.querySelector(`#${id} img`).src;
//         const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;

        // const cart_item = document.createElement('div');
        // cart_item.innerHTML = `
        // <span class='cart-item cart-column'>
        // <img class='cart-img' src="${img_src}" alt="">
        //     <span>${name}</span>
        // </span>
        // <span class='cart-price cart-column'>${price}</span>
        // <span class='cart-quantity cart-column'>
        //     <input type="text" value="1">
        //     <button>REMOVE</button>
        // </span>`
        // cart_items.appendChild(cart_item)
        //     const container = document.getElementById('container');
        //     const notification = document.createElement('div');
        //     notification.classList.add('notification');
        //     notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
        //     notification.style = `background-color: steelblue; padding: 20px`
        //     container.appendChild(notification);
        //     setTimeout(()=>{
        //         notification.remove();
        //     },2500)
//         }

//         if (e.target.className=='cart-holder'){
//                     document.querySelector('#cart').style = "display:block;"
//         }

//         if (e.target.className=='cancel'){
//                     document.querySelector('#cart').style = "display:none;"
//         }
// })


const cart_items = document.querySelector('#cart .cart-items')
const parentContainer = document.getElementById("EcommerceContainer");

parentContainer.addEventListener('click', (e)=> {

    if (e.target.className=='cart-holder'){
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = ''
        showCartDetails()
   }
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }

    // if (e.target.cartContainer =='REMOVE'){
        // let total_cart_price = document.querySelector('#total-value').innerText;
        // total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2) ;
        // document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)-1
        // document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`


        // e.target.parentNode.parentNode.remove()
    // }
})


window.addEventListener('DOMContentLoaded', (e) => {
    // e.preventDefault()
            axios.get(`http://localhost:3000/products`).then((data) => {
                // console.log(data)
            if(data.request.status === 200){
                // for(let i=0; i< data.data.length; i++){
                const products = data.data.products;
                const parentSection = document.getElementById('Products');
                
                products.forEach(product => {
                    const productHtml = `
                    <div id='album1'>
                        <div class="image-container">
                            <img class="prod-images"  src=${product.imageUrl}> </img>
                        </div>
                        <div class="prod-details">
                            <button class="shop-item-button" onClick="addToCart(${product.id})"  type='button'>ADD TO CART</button>.
                        </div>
                    </div>
                    `
                    parentSection.innerHTML = parentSection.innerHTML + productHtml;
                });
            // }
            }
        })
})

function addToCart(productId){
    axios.post('http://localhost:3000/cart', { productId: productId})
        .then(response => {
            // console.log(response)
            if(response.status === 200){
                notify(response.data.message)
            }else{
                throw new Error(response.data.message)
            }
        })
        .catch((err) => {
            // console.log(err)
            notify(err)
        })
}

function notify(message){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}<h4>`;
    notification.style = `background-color: steelblue; padding: 20px`
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500)
}

function showCartDetails(){
    axios.get('http://localhost:3000/cart')
        .then(response => {
            // console.log(response)
            if(response.status === 200){
                response.data.products.forEach(product => {
                    const cartContainer = document.getElementById('cart-items');
                    cartContainer.innerHTML += `<li id='cart_li'> <img style="width: 80px" src=${product.imageUrl}> </img> - ${product.price} <button id='Rmvcrt_btn' onclick="cartRemove()" >REMOVE</button>  </li>`
                    cartContainer.style = "list-style-type: none; padding: 1rem;"
                    // console.log(product);
                })
                document.querySelector('#cart').style = "display:block;"
            }
        })
        .catch(err => {
            console.log(err)
        })
}


function cartRemove(productId) {
    axios.delete('http://localhost:3000/cart',  { data: productId })
        .then(response => {
            console.log("deleted from cart")
        })
        .catch(err => {
            console.log("Error Somethinf went Wrong")
        })
    // const cartContainer = document.getElementById('cart_li');
    // cartContainer.innerHTML = ' '
}

// const cartRemove = document.getElementById('Rmvcrt_btn')
// const cartContainer = document.getElementById('cart-items');

// if(cartRemove){

//     cartRemove.addEventListener('click', ((e)=> {
//         if (e.target.innerText == 'REMOVE'){
//             // let total_cart_price = document.querySelector('#total-value').innerText;
//             // total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2) ;
//             // document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)-1
//             // document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
//             cartRemove.innerHTML = ' '
            
//             e.target.cartRemove.remove()
//         }
//     })
//     )
// }
    
    


const pagination_btn = document.querySelector('.pagination');
pagination_btn.addEventListener('click',(e)=>{

    if(e.target.id=="?page=1" || e.target.id=="?page=2" || e.target.id=="?page=3"){
        axios.get(`http://localhost:3000/products/${e.target.id}`) .then((data) => {
            console.log(data.data);
            
            
            const products = data.data.products;
            
            const parentSection = document.getElementById('Products');
            parentSection.innerHTML = ' '
            
            products.forEach(product => {
                // for(let i=0; i<products; i++){
                const productHtml = `
                <div id='album1'>
                    <div class="image-container">
                        <img class="prod-images"  src=${product.imageUrl}> </img>
                    </div>
                    <div class="prod-details">
                        <button class="shop-item-button" onClick="addToCart(${product.id})"  type='button'>ADD TO CART</button>.
                    </div>
                </div>
                `
                parentSection.innerHTML = parentSection.innerHTML + productHtml;
            // }
            });
        })    
    }
})


const last_btn = document.querySelector('.pagination');
last_btn.addEventListener('click',(e)=>{
    if(e.target.id=="?page=3"){
        axios.get(`http://localhost:3000/products/${e.target.id}`) .then((data) => {
            console.log(data.data);
            const products = data.data.products;
            const parentSection = document.getElementById('Products');
            parentSection.innerHTML = ' '
            products.forEach(product => {
                const productHtml = `
                <div id='album1'>
                    <div class="image-container">
                        <img class="prod-images"  src=${product.imageUrl}> </img>
                    </div>
                    <div class="prod-details">
                        <button class="shop-item-button" onClick="addToCart(${product.id})"  type='button'>ADD TO CART</button>.
                    </div>
                </div>
                `
                parentSection.innerHTML = parentSection.innerHTML + productHtml;
            });
        })    
    }
})

