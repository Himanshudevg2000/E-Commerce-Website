const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order')

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  // Product.findAll({limit:2})
  const page = req.query.page;
  let totalItems;
  Product.count()
  .then((numProducts) => {
    totalItems = numProducts;
    console.log(totalItems);
    return Product.findAll({offset:(page-1) * 4, limit: 4})
  })
  
  .then(products => {
    console.log(products)
    res.json({products, success: true,
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE* page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page +1,
     PreviousPage: page - 1,
     lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)})
    // res.render('shop/product-list', {
    //   prods: products,
    //   pageTitle: 'All Products',
    //   path: '/products'
    // });
  })
  .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  //  Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products'
        })
    })
    .catch(err => console.log(err));
}

// exports.getIndex = (req, res, next) => {
//   Product.findAll()
//   .then(products => {
//     res.render('shop/index', {
//       prods: products,
//       pageTitle: 'Shop',
//       path: '/'
//     });
//   })
//   .catch(err => console.log(err));
// };

exports.getIndex = (req, res, next) => {
  const page = req.query.page || 1;
  let totalItems;
  Product.count()
  .then((numProducts) => {
    totalItems = numProducts;
    console.log(totalItems);
    return Product.findAll({offset:(page-1) * 2, limit: 2})
  })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE* page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page +1,
       PreviousPage: page - 1,
       lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.getCart = (req, res, next) => {
  console.log(req.user.cart);
  req.user
    .getCart()
    .then(cart => {
      return cart
      .getProducts()
      .then(products => {
        res.status(200).json({success: true, products: products})
      //   res.render('shop/cart', {
      //   path: '/cart',
      //   pageTitle: 'Your Cart',
      //   products: products
      // });
      })
      .catch(err => console.log(err))
    })
    .catch(err => {
      console.log(err)
    })
};

exports.postCart = (req, res, next) => {

  if(!req.body.productId){
    return res.status(400).json({ sucess: false, message: 'Products id not found'})
  }

  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({where: {id: prodId}})
    })
    .then(products => {
      let product;
      // if(products.length > 0) {
      //   product = products[0];
      // }
      
      if(product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity } 
        })
      })
    .catch(err => console.log(err))
    .then(() => {
      // res.redirect('/cart')
      res.status(200).json({success:true, message: 'Successfully added to the cart' })
    })
    .catch(err => {
      // console.log(err));
      res.status(500).json({success: false, message: 'Error Occurred'})
    })
}

// exports.postCartDeleteProduct = (req, res, next) => {
//   if (!req.body.productId) {
//     return res.status(400).json({ success: false, message: 'product id is missing' })
//   }
//   const prodId = req.body.productId;
//   req.user
//     .getCart()
//     .then(cart => {
//       return cart.getProducts({where: {id: prodId}})
//     })
//     .then(products => {
//       const product = products[0];
//       product.cartItem.destroy();
//       res.status(200).json({success: true, message: 'Succesfully Deleted'})
//     })
//     .then(result => {
//       res.redirect('/cart')
//     })
//     .catch(err => console.log(err))
// };

exports.postCartDeleteProduct = (req, res, next) => {
  if (!req.body.productId) {
    return res.status(400).json({ success: false, message: 'product id is missing' })
  }
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
       product.cartItem.destroy();
       res.status(200).json({success: true, message: 'Succesfully Deleted'})
    })
    // .then(result => {
    //   // res.redirect('/cart');
    //   res.status(200).json({success : true});
    // })
    // res.status(500).json({success: false, message: "EROOR"})
    // .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product
            })
          )
        })
        .catch(err => console.log(err))
      // console.log(products)
    })
    .then(result => {
      return fetchedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}


exports.getOrders = (req, res, next) => {
  req.user
    // .getOrders()
    // .then(orders => {
    //   return orders
    //   .getProducts()
    //   .then(products => {
    //     res.status(200).json({success: true, products: products})
    //   })
    .getOrders({include: ['products']})
    .then(products => {
      res.status(200).json({success: true, products: products})
      // res.render('shop/orders', {
      //   path: '/order',
      //   pageTitle: 'Your Orders',
      //   orders: orders
      // })
    })
    .catch(err => console.log(err))
    
};


// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
