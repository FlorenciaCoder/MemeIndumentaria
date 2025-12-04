// Constantes y datos
const IVA = 0.21;
const STORAGE_KEY = "meme_carrito_v2";
const NOMBRE_KEY = "meme_nombre";

const contenedorProductos = document.getElementById("productosList");
let productos = []; // se llenará con el JSON

// cargar productos desde productos.json
function cargarProductos() {
  if (!contenedorProductos) return; 
  fetch("./productos.json")
    .then(res => res.json())
    .then(data => {
      productos = data;
      productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
          <img class="producto-imagen" src="${producto.imagen}" alt="${producto.nombre}">
          <div class="producto-detalles">
            <h3 class="producto-titulo">${producto.nombre}</h3>
            <p class="producto-precio">$${producto.precio}</p>
            <button class="producto-agregar" data-id="${producto.id}">Agregar al carrito</button>
          </div>
        `;
        contenedorProductos.append(div);
      });
    })
    .catch(err => console.error("Error cargando productos:", err));
}

// Lógica del carrito
let carrito = [];

function guardarStorage() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito)); } catch (e) {}
}

function cargarStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  carrito = raw ? JSON.parse(raw) : [];
}

function calcularTotalConIVA(precio, cantidad) {
  const subtotal = precio * cantidad;
  return Math.round(subtotal * (1 + IVA));
}

// actualiza el contador visible en el header
function updateHeaderCount() {
  try {
    const totalItems = carrito.reduce((acc, it) => acc + (it.cantidad || 0), 0);
    const els = document.querySelectorAll('.numerito');
    els.forEach(e => { e.textContent = totalItems; });
  } catch (e) {}
}

function agregarAlCarrito(productId, cantidad = 1) {
  const idNum = Number(productId);
  const producto = productos.find(p => p.id === idNum);
  if (!producto) return;

  const existente = carrito.find(i => i.id === idNum);
  if (existente) {
    existente.cantidad += cantidad;
    existente.total = calcularTotalConIVA(existente.precio, existente.cantidad);
  } else {
    const total = calcularTotalConIVA(producto.precio, cantidad);
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen, cantidad, total });
  }

  guardarStorage();
  renderCarrito();
  updateHeaderCount();
}

function renderCarrito() {
  const list = document.getElementById('carritoList');
  const totalEl = document.getElementById('totalGeneral');
  const vacioStatic = document.querySelector('.carrito-vacio');
  if (!list) return; // no está en esta página

  if (vacioStatic) vacioStatic.style.display = (carrito && carrito.length > 0) ? 'none' : 'block';

  list.innerHTML = '';
  if (!carrito || carrito.length === 0) {
    if (totalEl) totalEl.textContent = 'TOTAL: $0';
    return;
  }

  let totalGeneral = 0;
  let subtotalGeneral = 0;
  carrito.forEach(item => {
    const div = document.createElement('div');
    div.className = 'carrito-item';
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.6rem">
        <img src="${item.imagen}" alt="${item.nombre}" style="width:56px;height:56px;object-fit:contain;border-radius:6px">
        <div>
          <div><strong>${item.nombre}</strong></div>
          <div style="font-size:0.9em;color:#666">${item.cantidad} x $${item.precio} — subtotal: $${item.total}</div>
        </div>
      </div>
      <div style="margin-top:6px">
        <button class="carrito-menos" data-id="${item.id}">-</button>
        <button class="carrito-borrar" data-id="${item.id}">Eliminar</button>
      </div>
    `;
    list.appendChild(div);
    subtotalGeneral += (item.precio * item.cantidad);
    totalGeneral += item.total;
  });

  const subEl = document.getElementById('subtotal');
  const ivaEl = document.getElementById('iva');
  if (subEl) subEl.textContent = `$${subtotalGeneral.toLocaleString('es-AR')}`;
  const iva = Math.round(totalGeneral - subtotalGeneral);
  if (ivaEl) ivaEl.textContent = `$${iva.toLocaleString('es-AR')}`;
  if (totalEl) totalEl.textContent = `$${totalGeneral.toLocaleString('es-AR')}`;
}

// listeners
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('.producto-agregar');
  if (addBtn) {
    const id = addBtn.dataset.id || addBtn.getAttribute('data-id');
    if (id) agregarAlCarrito(id, 1);
  }

  const borrar = e.target.closest('.carrito-borrar');
  if (borrar) {
    const id = Number(borrar.dataset.id);
    carrito = carrito.filter(i => i.id !== id);
    guardarStorage(); renderCarrito(); updateHeaderCount();
  }

  const menos = e.target.closest('.carrito-menos');
  if (menos) {
    const id = Number(menos.dataset.id);
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.cantidad -= 1;
    if (item.cantidad <= 0) carrito = carrito.filter(i => i.id !== id);
    else item.total = calcularTotalConIVA(item.precio, item.cantidad);
    guardarStorage(); renderCarrito(); updateHeaderCount();
  }
});

// Vaciar carrito
const vaciarBtn = document.getElementById('vaciarCarrito');
if (vaciarBtn) vaciarBtn.addEventListener('click', () => { carrito = []; guardarStorage(); renderCarrito(); updateHeaderCount(); });

// iniciar estado
cargarStorage();
cargarProductos(); 
renderCarrito();
updateHeaderCount();

// nombre / saludo 
function initNombre() {
  try {
    const nombreInput = document.getElementById('nombreInput');
    const guardarBtn = document.getElementById('guardarNombre');
    const saludo = document.getElementById('saludo');

    if (!nombreInput || !guardarBtn || !saludo) return;

    const nombreGuardado = localStorage.getItem(NOMBRE_KEY);
    if (nombreGuardado) {
      saludo.textContent = `Hola ${nombreGuardado}, gracias por visitarnos`;
      nombreInput.value = nombreGuardado;
    }

    guardarBtn.addEventListener('click', () => {
      const nombre = nombreInput.value.trim();
      if (nombre) {
        localStorage.setItem(NOMBRE_KEY, nombre);
        saludo.textContent = `Hola ${nombre}, gracias por visitarnos`;
      } else {
        localStorage.removeItem(NOMBRE_KEY);
        saludo.textContent = '';
      }
    });
  } catch (e) {}
}

initNombre();
// confirmar compra con SweetAlert
document.addEventListener('click', (e) => {
  const comprarBtn = e.target.closest('.carrito-acciones-comprar');
  if (!comprarBtn) return;

  //iva y subtotal
  let subtotalGeneral = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  let iva = Math.round(subtotalGeneral * IVA);
  let totalGeneral = subtotalGeneral + iva;

  if (typeof Swal === 'undefined') {
    if (confirm(`Confirmar compra\nSubtotal: $${subtotalGeneral}\nIVA: $${iva}\nTotal: $${totalGeneral}`)) {
      carrito = []; guardarStorage(); renderCarrito(); updateHeaderCount();
      alert('Compra finalizada. Gracias!');
    }
    return;
  }

  Swal.fire({
    title: 'Finalizar compra',
    html: `
      <p>Subtotal: <strong>$${subtotalGeneral.toLocaleString('es-AR')}</strong></p>
      <p>IVA (21%): <strong>$${iva.toLocaleString('es-AR')}</strong></p>
      <p>Total: <strong>$${totalGeneral.toLocaleString('es-AR')}</strong></p>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      carrito = []; guardarStorage(); renderCarrito(); updateHeaderCount();
      Swal.fire('¡Compra finalizada!', 'Gracias por tu compra 😊', 'success');
    }
  });
});
