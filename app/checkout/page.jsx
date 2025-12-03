const res = await axios.post("/orders", {
  userId: user.id,
  items: cart.map((item) => ({
    productId: item._id,   // <-- use _id from product
    title: item.title,
    price: item.price,
    quantity: 1,
    image: item.images?.[0],
    sellerId: item.sellerId // optional
  })),
  total,
  shipping,
});
