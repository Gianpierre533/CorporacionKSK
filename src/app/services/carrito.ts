import { Injectable, signal, computed } from '@angular/core';
export interface CarritoItem {
  id: string;
  nombre: string;
  precio: number;
  imagen?:string;
  cantidad: number;
  codigo?: string;
}
@Injectable({
  providedIn: 'root',
})
export class Carrito {
  //estado privado del carrito usando signals
  private _items = signal<CarritoItem[]>([]);
  items = this._items.asReadonly();
  totalPagar = computed(() => {
    return this._items().reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  });

totalProductos = computed(() => {
    return this._items().reduce((acc, item) => acc + item.cantidad, 0);
  });

constructor() {
  //se recupera el carrito guardado por si el app se cierra 
  const guardado = localStorage.getItem('ksk_carrito');
  if (guardado) {
    try {
      this._items.set(JSON.parse(guardado));
    } catch (e) {
      console.error('Error al cargar el carrito guardado', e);
    }
  }
}

//agregar producto o talvez aumentar mas cantidad en el carrito
agregarProducto(producto: Omit<CarritoItem, 'cantidad'>) {
  const actuales = this._items();
  const existe = actuales.find (item => item.id === producto.id);
  if (existe) {
    const nuevosItems = actuales.map(item => 
      item.id === producto.id ? {...item, cantidad: item.cantidad + 1} : item
    );
    this._items.set(nuevosItems);

  }else{
    this._items.set([...actuales, {...producto, cantidad: 1}]);
  }
  this.guardarEnStorage();
}
//disminuir cantidad o eliminar producto del carrito
reducirCantidad(id: string) {
  const actuales = this._items();
  const existe = actuales.find (item => item.id === id);
  if (!existe) return;
  if (existe.cantidad > 1) {
    const nuevosItems = actuales.map(item =>
      item.id === id ? {...item, cantidad: item.cantidad - 1} : item);
    this._items.set(nuevosItems);
  } else {
    this.eliminarProducto(id);
  }
  this.guardarEnStorage();
}
//eliminar completamente un producto del carrito
eliminarProducto(id: string) {
  this._items.set(this._items().filter(item => item.id !== id));
  this.guardarEnStorage();
}
//vaciar el carrito
vaciarCarrito() {
  this._items.set([]);
  localStorage.removeItem('ksk_carrito');
}
//guardado el estado del carrito en el localStorage para persistencia
private guardarEnStorage() {
  localStorage.setItem('ksk_carrito', JSON.stringify(this._items()));
}}