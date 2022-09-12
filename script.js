
const cart_items = document.querySelector('#cart .cart-items')
const parentContainer = document.getElementById("EcommerceContainer");

parentContainer.addEventListener('click', (e)=> {
    // e.preventDefault();

    if (e.target.className=='cart-holder'){
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = ' '
        let price = document.querySelector('#total-value').innerText;
        price.innerText = ' '
        document.querySelector('#total-value').innerText = `0`;
        showCartDetails()
   }
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }
})


window.addEventListener('DOMContentLoaded', (e) => {
            axios.get(`http://localhost:3000/products?page=1`).then((data) => {
                // console.log(data)
            if(data.request.status === 200){
                const products = data.data.products;
                const parentSection = document.getElementById('Products');
                
                products.forEach(product => {
                    const productHtml = `
                    <div id='album1'>
                        <div class="image-container">
                            <img class="prod-images"  src=${product.imageUrl}> </img>
                        </div>
                        <div class="prod-details">
                            <span> ₹ ${product.price}</span>
                            <button class="shop-item-button" onClick="addToCart(${product.id})"  type='button'>ADD TO CART</button>
                        </div>
                    </div>
                    `
                    parentSection.innerHTML = parentSection.innerHTML + productHtml;
                });
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
    // e.preventDefault()
    axios.get('http://localhost:3000/cart')
        .then(response => {
            // console.log(response)
            if(response.status === 200){
                response.data.products.forEach(product => {
                        
                        const cartContainer = document.getElementById('cart-items');
                        cartContainer.innerHTML += `<li id='cart_li'> <img style="width: 80px" src=${product.imageUrl}> </img> - ${product.price} <button id='Rmvcrt_btn' onclick='cartRemove(${product.id})' >REMOVE</button>  </li>`
                        cartContainer.style = "list-style-type: none; padding: 1rem;"

                        let price = document.querySelector('#total-value').innerText;
                        price = parseFloat(price) + parseFloat(product.price);
                        document.querySelector('#total-value').innerText = `${price}`;
                })
                document.querySelector('#cart').style = "display:block;"
            }
            else{
                throw new Error('Error: Something went wrong')
            }
        })
        .catch(err => {
            console.log(err)
        })
}


function cartRemove(productId) {
    axios.post(`http://localhost:3000/cart-delete-item`, {productId: productId} )
        .then(response => {
            if(response.status === 200){
                let price = document.querySelector('#total-value').innerText;
                price = parseFloat(price) - parseFloat(document.querySelector('#total-value').innerText)
                document.querySelector('#total-value').innerText = parseInt(document.querySelector('.cart-number').innerText) - 1
                document.querySelector('#total-value').innerText = `${price}`
                productId.target.parentNode.parentNode.remove()
            }
        })
        .catch(err => {
            console.log("Removed from cart")
        })
        console.log('button working')
}

const pagination_btn = document.querySelector('.pagination');
pagination_btn.addEventListener('click',(e)=>{

    if(e.target.id=="?page=1" || e.target.id=="?page=2" || e.target.id=="?page=3"){
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
                        <span> ₹ ${product.price}</span>
                        <button class="shop-item-button" onClick="addToCart(${product.id})"  type='button'>ADD TO CART</button>
                    </div>
                </div>
                `
                parentSection.innerHTML = parentSection.innerHTML + productHtml;
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
                        <button class="shop-item-button" onClick="addToCart(${product.id})"  type='button'>ADD TO CART</button>
                    </div>
                </div>
                `
                parentSection.innerHTML = parentSection.innerHTML + productHtml;
            });
        })    
    }
})

const purchaseBtn = document.getElementById('purchase-btn')
purchaseBtn.addEventListener('click', (productId) =>{
    if(parseInt(document.getElementById('total-value').innerText) === 0){
        alert("First add something in your cart! ")
    }
    else{
        axios.post('http://localhost:3000/create-order', { productId: productId})
        .then(response => {
            console.log('purchased')
            if(response.status === 200){
                // notify(response.data.message)
                alert("Purchased successfully")
            }else{
                throw new Error(response.data.message)
            }
        })
        .catch(error => {
            console.log('Error: something went wrong')
        })
    }
})
