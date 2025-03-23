import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Flights = () => {
  const [aeropuertoMayorMovimiento, setAeropuertoMayorMovimiento] = useState(null);
  const [aerolineaMayorVuelos, setAerolineaMayorVuelos] = useState(null);
  const [diaMayorVuelos, setDiaMayorVuelos] = useState(null);
  const [aerolineasMasDeDosVuelos, setAerolineasMasDeDosVuelos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/aeropuerto_mayor_movimiento')
      .then(response => {
        setAeropuertoMayorMovimiento(response.data);
      })
      .catch(error => {
        console.error("Error fetching aeropuerto mayor movimiento:", error);
      });

    axios.get('http://localhost:5000/aerolinea_mayor_vuelos')
      .then(response => {
        setAerolineaMayorVuelos(response.data);
      })
      .catch(error => {
        console.error("Error fetching aerolínea mayor vuelos:", error);
      });

    axios.get('http://localhost:5000/dia_mayor_vuelos')
      .then(response => {
        setDiaMayorVuelos(response.data);
      })
      .catch(error => {
        console.error("Error fetching día mayor vuelos:", error);
      });

    axios.get('http://localhost:5000/aerolineas_mas_de_dos_vuelos')
      .then(response => {
        setAerolineasMasDeDosVuelos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching aerolíneas con más de 2 vuelos:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando datos de vuelos...</p>;
  }

  return (
    <div>
      <h1>Datos de Vuelos</h1>

      <h2>1.- Aeropuerto con Mayor Movimiento:</h2>
      {aeropuertoMayorMovimiento && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Campo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nombre del Aeropuerto</td>
              <td>{aeropuertoMayorMovimiento.nombre_aeropuerto}</td>
            </tr>
            <tr>
              <td>Movimientos</td>
              <td>{aeropuertoMayorMovimiento.movimientos}</td>
            </tr>
          </tbody>
        </table>
      )}

      <h2>2.- Aerolínea con Mayor Número de Vuelos:</h2>
      {aerolineaMayorVuelos && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Campo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nombre de la Aerolínea</td>
              <td>{aerolineaMayorVuelos.nombre_aerolinea}</td>
            </tr>
            <tr>
              <td>Número de Vuelos</td>
              <td>{aerolineaMayorVuelos.vuelos}</td>
            </tr>
          </tbody>
        </table>
      )}

      <h2>3.- Día con Mayor Número de Vuelos:</h2>
      {diaMayorVuelos && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Campo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Día</td>
              <td>{diaMayorVuelos.dia}</td>
            </tr>
            <tr>
              <td>Número de Vuelos</td>
              <td>{diaMayorVuelos.vuelos}</td>
            </tr>
          </tbody>
        </table>
      )}

      <h2>4.- Aerolíneas con Más de 2 Vuelos por Día:</h2>
      {aerolineasMasDeDosVuelos.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre de la Aerolínea</th>
              <th>Número de Vuelos</th>
            </tr>
          </thead>
          <tbody>
            {aerolineasMasDeDosVuelos.map((aerolinea, index) => (
              <tr key={index}>
                <td>{aerolinea.nombre_aerolinea}</td>
                <td>{aerolinea.vuelos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Flights;