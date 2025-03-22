import React, { useState } from 'react';

const Filters = ({ aerolineas, onFilter }) => {
  const [filtroAerolinea, setFiltroAerolinea] = useState('');

  const handleFilterChange = (e) => {
    setFiltroAerolinea(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <div>
      <h3>Filtrar por Aerolínea:</h3>
      <select value={filtroAerolinea} onChange={handleFilterChange}>
        <option value="">Todas las aerolíneas</option>
        {aerolineas.map((aerolinea, index) => (
          <option key={index} value={aerolinea.nombre_aerolinea}>
            {aerolinea.nombre_aerolinea}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;