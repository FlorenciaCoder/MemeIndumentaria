// Constantes y datos
const IVA = 0.21;
const STORAGE_KEY = "meme_carrito_v2";
const NOMBRE_KEY = "meme_nombre";
// Array Productos disponibles
const productos = [
  { id: 1, nombre: "Remera", precio: 15000 },
  { id: 2, nombre: "Pantalón", precio: 30000 },
  { id: 3, nombre: "Campera", precio: 45000 },
  { id: 4, nombre: "Zapatillas", precio: 60000 },
  { id: 5, nombre: "Gorra", precio: 12000 }
];

let carrito = [];

//funcion iva
function calcularTotalConIVA(precio, cantidad) {
  const subtotal = precio * cantidad;
  return Math.round(subtotal * (1 + IVA));// redondea el iva
}

function guardarStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}
// cargar carrito
function cargarStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  carrito = raw ? JSON.parse(raw) : [];
}

// Render productos (actualiza la lista de productos)
function renderProductos() {
  const cont = document.getElementById("productosList");
  cont.innerHTML = "";
  for (const p of productos) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <div class="precio">$${p.precio}</div>
      <div class="controls">
        <input type="number" min="1" value="1" data-id="${p.id}" class="qty">
        <button data-id="${p.id}" class="addBtn">Agregar</button>
      </div>
    `;
    cont.appendChild(card);
  }
}

// Carrito render y acciones
function renderCarrito() {
  const list = document.getElementById("carritoList");
  list.innerHTML = "";
  let totalGeneral = 0;

  if (carrito.length === 0) {
    list.innerHTML = "<p>El carrito está vacío</p>";
  } else {
    for (const item of carrito) {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div>
          ${item.cantidad} x ${item.nombre}
          <div style="font-size:0.9em;color:#666">unit: $${item.precio} - subtotal: $${item.total}</div>
        </div>
        <div>
          <button class="menos" data-id="${item.id}">-</button>
          <button class="borrar" data-id="${item.id}">x</button>
        </div>
      `;
      list.appendChild(div);
      totalGeneral += item.total;
    }
  }

  document.getElementById("totalGeneral").textContent = `TOTAL: $${totalGeneral}`;
}
//condicional para agregar al carrito
function agregarAlCarrito(productId, cantidad) {
  const producto = productos.find(p => p.id === productId);
  if (!producto || cantidad <= 0) return;

  const total = calcularTotalConIVA(producto.precio, cantidad);
  const existente = carrito.find(i => i.id === productId);
  if (existente) {
    existente.cantidad += cantidad;
    existente.total = calcularTotalConIVA(producto.precio, existente.cantidad);
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
      total
    });
  }
  guardarStorage();
  renderCarrito();
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // saludo/nombre
  const nombreInput = document.getElementById("nombreInput");
  const guardarBtn = document.getElementById("guardarNombre");
  const saludo = document.getElementById("saludo");

  const nombreGuardado = localStorage.getItem(NOMBRE_KEY);
  if (nombreGuardado) {
    saludo.textContent = `Hola ${nombreGuardado}, gracias por visitarnos`;
    nombreInput.value = nombreGuardado;
  }

  guardarBtn.addEventListener("click", () => {
    const nombre = nombreInput.value.trim();
    if (nombre) {
      localStorage.setItem(NOMBRE_KEY, nombre);
      saludo.textContent = `Hola ${nombre}, gracias por visitarnos`;
    } else {
      localStorage.removeItem(NOMBRE_KEY);
      saludo.textContent = "";
    }
  });

  // funcion para cargar carrito
  cargarStorage();
  renderProductos();
  renderCarrito();

  // botones agregar productos
  document.getElementById("productosList").addEventListener("click", (e) => {
    if (e.target.matches(".addBtn")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      const input = document.querySelector(`.qty[data-id="${id}"]`);
      const cantidad = parseInt(input.value, 10);
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        input.focus();
        return;
      }
      agregarAlCarrito(id, cantidad);
      input.value = 1;
    }
  });

  // manejo de eventos del carrito 
  document.getElementById("carritoList").addEventListener("click", (e) => {
    const id = parseInt(e.target.getAttribute("data-id"));
    if (e.target.matches(".borrar")) {
      carrito = carrito.filter(i => i.id !== id);
      guardarStorage();
      renderCarrito();
    } else if (e.target.matches(".menos")) {
      const item = carrito.find(i => i.id === id);
      if (!item) return;
      item.cantidad -= 1;
      if (item.cantidad <= 0) {
        carrito = carrito.filter(i => i.id !== id);
      } else {
        item.total = calcularTotalConIVA(item.precio, item.cantidad);
      }
      guardarStorage();
      renderCarrito();
    }
  });

  // Vaciar carrito
  document.getElementById("vaciarCarrito").addEventListener("click", () => {
    carrito = [];
    guardarStorage();
    renderCarrito();
  });
});