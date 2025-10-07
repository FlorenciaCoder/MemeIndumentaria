//simulador de compra MemeIndumentaria

// Variables globales y arrays
const iva = 0.21; // IVA
let articulos = [
  "Short", "joggin", "falda",        //partes de abajo      
  "Remera", "Musculosa", "Top",     // partes de arriba        
  "Body", "Vestido", "Campera",    // otras prendas        
  "Aritos", "Cartera", "Collar"   // accesorios
];

let precios = [
  25000, 30000, 28000,     // Partes de abajo
  20000, 15000, 20000,    // Partes de arriba
  25000, 35000, 40000,   // Otras prendas
  5000, 40000, 8000     // Accesorios
];
let stock = [
    10,20,15,    //partes de abajo
    25,30,20,   // partes de arriba
    18,12,8,   // otras prendas
    30,10,20  // accesorios
];

 // funciones:
//Función 1: mostrar artículos disponibles
function mostrarArticulos() {
  console.log("Lista De Nuestros Articulos:");
  for (let i = 0; i < articulos.length; i++) {
    console.log(`${i + 1}. ${articulos[i]} - $${precios[i]} (Stock: ${stock[i]})`);
  }
}

//función 2: seleccionar artículo
function seleccionarArticulo() {
  let lista = "";
  for (let i = 0; i < articulos.length; i++) {
    lista += `${i + 1}. ${articulos[i]} - $${precios[i]} (Stock: ${stock[i]})\n`;
  }
  let indice = prompt("Ingrese el número del producto que desea comprar:\n" + lista);
  indice = parseInt(indice) - 1;
  if (indice >= 0 && indice < articulos.length) {
    return indice;
  } else {
    alert("Opción inválida. Se seleccionará el primero por defecto.");
    return 0;
  }
}

// función 3: calcular total con IVA
function calcularTotal(indiceArticulo, cantidad) {
  let subtotal = precios[indiceArticulo] * cantidad;
  return subtotal * (1 + iva);
}

//Aviso de bienvenida
alert("Meme Indumentaria- Simulador de compra");

//Muestra el total de la compra
let totalGeneral = 0;
let carrito = [];

let continuar = true;
while (continuar) {
  mostrarArticulos();
  let indice = seleccionarArticulo();
  let cantidad = prompt(`¿Cuántas unidades de ${articulos[indice]} desea comprar?`);
  cantidad = parseInt(cantidad);

  if (cantidad > 0 && cantidad <= stock[indice]) {
    let total = calcularTotal(indice, cantidad);
    totalGeneral += total;
    stock[indice] -= cantidad; // actualizar stock
    carrito.push(`${cantidad} x ${articulos[indice]} = $${total}`);
    alert(`Has agregado ${cantidad} ${articulos[indice]}.\nSubtotal con IVA: $${total}`);
    console.log(`Stock restante de ${articulos[indice]}: ${stock[indice]}`);
  } else {
    alert("Cantidad inválida o sin stock disponible.");
  }

  // preguntar si quiere seguir comprando
  continuar = confirm("¿Desea continuar comprando?");
}

// mostrar resumen final
let resumen = "Resumen de tu compra:\n";
for (let item of carrito) {
  resumen += item + "\n";
}
resumen += `\nTOTAL GENERAL: $${totalGeneral}`;
alert(resumen);
console.log(resumen);