import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import '../styles/home.css'; // Importa el archivo CSS de estilos

const Home = () => {
  return (
    <div>
      <h1>Reto Técnico FullStack</h1>
      <h2>Seleccione los datos que necesita:</h2>
      <nav>
        <ul>
          <li>
            <Link to="/stackexchange">StackExchange</Link>
          </li>
          <li>
            <Link to="/flights">Vuelos</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;