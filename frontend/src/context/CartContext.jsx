import React, { createContext, useContext, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "add": {
      const { productId, qty } = action;
      const nextQty = (state.items[productId] || 0) + qty;
      return { ...state, items: { ...state.items, [productId]: nextQty } };
    }
    case "setQty": {
      const { productId, qty } = action;
      if (qty <= 0) {
        const { [productId]: _removed, ...rest } = state.items;
        return { ...state, items: rest };
      }
      return { ...state, items: { ...state.items, [productId]: qty } };
    }
    case "remove": {
      const { productId } = action;
      const { [productId]: _removed, ...rest } = state.items;
      return { ...state, items: rest };
    }
    case "clear":
      return { ...state, items: {} };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: {} });

  const api = useMemo(() => {
    const itemCount = Object.values(state.items).reduce((sum, n) => sum + n, 0);

    return {
      items: state.items,
      itemCount,
      addToCart: (productId, qty = 1) => dispatch({ type: "add", productId, qty }),
      setQty: (productId, qty) => dispatch({ type: "setQty", productId, qty }),
      removeFromCart: (productId) => dispatch({ type: "remove", productId }),
      clearCart: () => dispatch({ type: "clear" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
