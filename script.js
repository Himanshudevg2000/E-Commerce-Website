// const cart_items = document.querySelector('#cart .cart-items')
// const parentContainer = document.getElementById('EcommerceContainer');
// parentContainer.addEventListener('click',(e)=>{
//     if(e.target.className == 'shop-item-button'){
//         const id = e.target.parentNode.parentNode.id
//         const name = document.querySelector(`#${id} h3`).innerText;
//         const img_src = document.querySelector(`#${id} img`).src;
//         const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;

//         const cart_item = document.createElement('div');
//         cart_item.innerHTML = `
//         <span class='cart-item cart-column'>
//         <img class='cart-img' src="${img_src}" alt="">
//             <span>${name}</span>
//     </span>
//     <span class='cart-price cart-column'>${price}</span>
//     <span class='cart-quantity cart-column'>
//         <input type="text" value="1">
//         <button>REMOVE</button>
//     </span>`
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
        document.querySelector('#cart').style = "display:block;"
   }
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }

})


window.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/products').then((data) => {
        // console.log(data)
        if(data.request.status === 200){
            const products = data.data.products;
            const parentSection = document.getElementById('Products');
            
            products.forEach(product => {
                const productHtml = `
                <div>
                    <h1> ${product.title} </h1>
                    <img style="width: 300px" src=${product.imageUrl}> </img>
                    <button onClick="addToCart(${product.id})"  type='button'>ADD TO CART</button>
                `
                parentSection.innerHTML = parentSection.innerHTML + productHtml;
            });
            
        }
    })
})

function addToCart(productId){
    axios.post('http://localhost:3000/cart', {productId : productId})
        .then(response => {
            // console.log(response)
            if(response.status === 200){
                notify(response.data.message)
            }else{
                throw new Error()
            }
        })
        .catch((err) => {
            // console.log(err)
            notify(err.data.message)
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