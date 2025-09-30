import React, { useEffect, useState } from "react";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editandoId, setEditandoId] = useState(null); // Id del producto que se edita
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    cantidad: "",
    precio: "",
    fecha_vencimiento: ""
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
        setLoading(false);
      });
  };

  const guardarProducto = () => {
    if (
      !nuevoProducto.nombre ||
      !nuevoProducto.cantidad ||
      !nuevoProducto.precio ||
      !nuevoProducto.fecha_vencimiento
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (editandoId) {
      // EDITAR PRODUCTO
      fetch(`http://127.0.0.1:5000/api/productos/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto)
      })
        .then(() => {
          cargarProductos();
          setNuevoProducto({ nombre: "", cantidad: "", precio: "", fecha_vencimiento: "" });
          setEditandoId(null);
        })
        .catch(console.error);
    } else {
      // CREAR PRODUCTO
      fetch("http://127.0.0.1:5000/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto)
      })
        .then(() => {
          cargarProductos();
          setNuevoProducto({ nombre: "", cantidad: "", precio: "", fecha_vencimiento: "" });
        })
        .catch(console.error);
    }
  };

  const borrarProducto = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    fetch(`http://127.0.0.1:5000/api/productos/${id}`, {
      method: "DELETE"
    })
      .then(() => cargarProductos())
      .catch(console.error);
  };

  const editarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    setNuevoProducto({
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      precio: producto.precio,
      fecha_vencimiento: producto.fecha_vencimiento
    });
    setEditandoId(id);
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div>
      <h2>Lista de Productos</h2>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#eee" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Fecha Vencimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>{prod.cantidad}</td>
              <td>${prod.precio}</td>
              <td>{prod.fecha_vencimiento}</td>
              <td>
                <button onClick={() => editarProducto(prod.id)}>Editar</button>
                <button onClick={() => borrarProducto(prod.id)} style={{ marginLeft: "8px" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{editandoId ? "Editar Producto" : "Crear Nuevo Producto"}</h3>

      <input
        placeholder="Nombre"
        value={nuevoProducto.nombre}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
      />
      <input
        placeholder="Cantidad"
        value={nuevoProducto.cantidad}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: e.target.value })}
      />
      <input
        placeholder="Precio"
        value={nuevoProducto.precio}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
      />
      <input
        type="date"
        placeholder="Fecha vencimiento"
        value={nuevoProducto.fecha_vencimiento}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, fecha_vencimiento: e.target.value })}
      />

      <button onClick={guardarProducto} style={{ display: "block", marginTop: "10px" }}>
        {editandoId ? "Guardar Cambios" : "Crear Producto"}
      </button>
    </div>
  );
}
