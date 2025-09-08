import { removeFromCart } from '../services/Order.js';
import { interpolate } from '../utils/interpolate.js';

export default class CartItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const item = JSON.parse(this.dataset.item);
    this.innerHTML = ''; // Clear the element

    const template = document.getElementById('cart-item-template');

    // Use the shared interpolation function
    this.innerHTML = interpolate(template.innerHTML, {
      qty: `${item.quantity}x`,
      name: item.product.name,
      price: `$${item.product.price.toFixed(2)}`,
    });

    this.querySelector('a.delete-button').addEventListener('click', (event) => {
      removeFromCart(item.product.id);
    });
  }
}

customElements.define('cart-item', CartItem);
