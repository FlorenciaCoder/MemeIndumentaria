// Proyecto Meme Indumentaria
// Bienvenida
let nombre = prompt("Bienvenido a Meme Indumentaria, ingresa tu nombre");

if (nombre && nombre.trim() !== "") {
  alert("Hola " + nombre + ", gracias por visitarnos");
} else {
  alert("Gracias por visitarnos");
}

// Lista de productos
let productos = [
  { id: 1, nombre: "Remera", precio: 15000 },
  { id: 2, nombre: "Pantalón", precio: 30000 },
  { id: 3, nombre: "Campera", precio: 45000 },
  { id: 4, nombre: "Zapatillas", precio: 60000 },
  { id: 5, nombre: "Gorra", precio: 12000 }
];

let carrito = [];
let totalGeneral = 0;
let continuar = true;

// Función para mostrar productos en consola
function mostrarProductos() {
  console.log("Lista de productos disponibles:");
  for (let producto of productos) {
    console.log(`${producto.id}. ${producto.nombre} - $${producto.precio}`);
  }
}

// Función para seleccionar producto
function seleccionarProducto() {
  let lista = "";
  for (let producto of productos) {
    lista += `${producto.id}. ${producto.nombre} - $${producto.precio}\n`;
  }
  let opcion = prompt("Ingrese el número del producto que desea comprar:\n" + lista);
  return productos.find(p => p.id === parseInt(opcion));
}

// Función para calcular total con IVA
function calcularTotal(precio, cantidad) {
  const iva = 0.21;
  let subtotal = precio * cantidad;
  return Math.round(subtotal * (1 + iva));
}

// Bucle de compra
while (continuar) {
  mostrarProductos();
  let producto = seleccionarProducto();

  if (producto) {
    let cantidad = prompt(`¿Cuántas unidades de ${producto.nombre} desea comprar?`);
    cantidad = parseInt(cantidad);

    if (cantidad > 0) {
      let total = calcularTotal(producto.precio, cantidad);
      totalGeneral += total;
      carrito.push(`${cantidad} x ${producto.nombre} = $${total}`);
      alert(`Agregaste ${cantidad} ${producto.nombre}.\nSubtotal con IVA: $${total}`);
    } else {
      alert("Cantidad inválida.");
    }
  } else {
    alert("Producto no encontrado.");
  }

  continuar = confirm("¿Desea seguir comprando?");
}

// Resumen final
let resumen = "Resumen de tu compra:\n";
for (let item of carrito) {
  resumen += item + "\n";
}
resumen += `\nTOTAL GENERAL: $${totalGeneral}`;
alert(resumen);
console.log(resumen);
