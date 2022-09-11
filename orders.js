
document.addEventListener('DOMContentLoaded', () =>{

    axios.get('http://localhost:3000/orders')
        .then(response => {
            console.log('got orders')
            if(response.status === 200){
                response.data.products.forEach(product => {
                    // console.log(product)
                    const cartContainer = document.getElementById('main-content');
                    cartContainer.innerHTML += `<li> orderId = ${product.id} </li>`
                    for(let i=0; i< product.products.length; i++){
                        cartContainer.innerHTML += `<li> title = ${product.products[i].title}  OrderId = ${product.id}  userId = ${product.userId}  price = ${product.products[i].price}   <img width="100px" src=${product.products[i].imageUrl}> </img></li>`
                    }
                    // cartContainer.style = "list-style-type: none; padding: 30px;  "
                })
            }
            else{
                throw new Error('it is not working')
            }
        })
        .catch(error => {
            console.log('Error: something went wrong')
        })
})