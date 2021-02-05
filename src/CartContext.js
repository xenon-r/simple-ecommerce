import React, { createContext, useState, useEffect, useReducer } from "react";
export const CartContext = createContext();

function reducer(items, action) {


  if(action.type == "init" && action.payload != null){
    console.log(items,action.payload)
    items = action.payload
    return items
  }


  if(action.type == "checkout")
    items.orders = []

  let pe = -1
  let tPrice = 0
  items.orders.forEach((item,index) => {
    if(item.id === action.payload.id){
      pe = index
      
    }
    if(item.quantity != undefined)
      tPrice = tPrice + (item.quantity * item.price)
  })
  
  if(action.type == "add"){
    tPrice = tPrice + (action.payload.price)
    items.price = tPrice

    if(pe>-1){
      items.orders[pe].quantity = items.orders[pe].quantity + 1
    } else {
      items.orders = [...items.orders,action.payload]
    }
  } 
  else if(action.type == 'delete'){
    items.price = items.price - (items.orders[pe].quantity * items.orders[pe].price )
    items.orders.splice(pe, 1)
  }
  localStorage.setItem("items", JSON.stringify(items))
  return items
}
// This context provider is passed to any component requiring the context

export const CartProvider = ({ children }) => {
  
  const [quantity, setQuantity] = useState(Number(0))
  
  let ordersInit = {
    orders: [ 
    ], price: 0
  }
  const [items, dispatch] = useReducer(reducer, ordersInit)
  

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("items")) 
    dispatch({type:'init', payload: s})
    setQuantity(Number(localStorage.getItem("quantity")))
  },[])

  

  return (
    <CartContext.Provider
      value={{
        quantity,
        items,
        setQuantity,
        dispatch
      }}
    >
      {children}
    </CartContext.Provider>
  );
};