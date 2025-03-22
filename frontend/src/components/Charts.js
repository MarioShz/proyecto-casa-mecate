import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Charts = ({ aerolineas }) => {
  const data = {
    labels: aerolineas.map(aerolinea => aerolinea.nombre_aerolinea),
    datasets: [
      {
        label: 'Número de Vuelos',
        data: aerolineas.map(aerolinea => aerolinea.vuelos),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>Gráfico de Vuelos por Aerolínea</h3>
      <Bar data={data} />
    </div>
  );
};

export default Charts;