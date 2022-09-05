const cart_items = document.querySelector('#cart .cart-items')
const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click',(e)=>{
    if(e.target.className == 'shop-item-button'){
        const id = e.target.parentNode.parentNode.id
        const name = document.querySelector(`#${id} h3`).innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;

        const cart_item = document.createElement('div');
        cart_item.innerHTML = `
        <span class='cart-item cart-column'>
        <img class='cart-img' src="${img_src}" alt="">
            <span>${name}</span>
    </span>
    <span class='cart-price cart-column'>${price}</span>
    <span class='cart-quantity cart-column'>
        <input type="text" value="1">
        <button>REMOVE</button>
    </span>`
        cart_items.appendChild(cart_item)
            const container = document.getElementById('container');
            const notification = document.createElement('div');
            notification.classList.add('notification');
            notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
            notification.style = `background-color: steelblue; padding: 20px`
            container.appendChild(notification);
            setTimeout(()=>{
                notification.remove();
            },2500)
        }

        if (e.target.className=='cart-holder'){
                    document.querySelector('#cart').style = "display:block;"
        }

        if (e.target.className=='cancel'){
                    document.querySelector('#cart').style = "display:none;"
        }
})
