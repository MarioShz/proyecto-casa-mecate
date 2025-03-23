import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/stackexchange.css'; // Importa los estilos

const StackExchange = () => {
  const [stackData, setStackData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/stackexchange')
      .then(response => {
        setStackData(response.data);
      })
      .catch(error => {
        console.error("Error fetching StackExchange data:", error);
      });
  }, []);

  if (!stackData) {
    return <p>Cargando datos de StackExchange...</p>;
  }

  return (
    <div className="App">
      <h1>Datos de StackExchange</h1>
      {stackData && (
        <div>
          <h2>1.- Respuestas Contestadas: {stackData.answered}</h2>
          <h2>Respuestas No Contestadas: {stackData.unanswered}</h2>

          <h2>2.- Respuesta con Mayor Reputación:</h2>
          {stackData?.max_reputation && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ID de Respuesta Aceptada</td>
                  <td>{stackData.max_reputation.accepted_answer_id || "N/A"}</td>
                </tr>
                <tr>
                  <td>Número de Respuestas</td>
                  <td>{stackData.max_reputation.answer_count}</td>
                </tr>
                <tr>
                  <td>Licencia de Contenido</td>
                  <td>{stackData.max_reputation.content_license}</td>
                </tr>
                <tr>
                  <td>Fecha de Creación</td>
                  <td>{new Date(stackData.max_reputation.creation_date * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>¿Está Contestada?</td>
                  <td>{stackData.max_reputation.is_answered ? "Sí" : "No"}</td>
                </tr>
                <tr>
                  <td>Fecha de Última Actividad</td>
                  <td>{new Date(stackData.max_reputation.last_activity_date * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Fecha de Última Edición</td>
                  <td>{stackData.max_reputation.last_edit_date ? new Date(stackData.max_reputation.last_edit_date * 1000).toLocaleString() : "N/A"}</td>
                </tr>
                <tr>
                  <td>Enlace</td>
                  <td>
                    <a href={stackData.max_reputation.link} target="_blank" rel="noopener noreferrer">
                      Ver pregunta
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Dueño</td>
                  <td>
                    <div>
                      <strong>Nombre:</strong> {stackData.max_reputation.owner.display_name}
                    </div>
                    <div>
                      <strong>Reputación:</strong> {stackData.max_reputation.owner.reputation}
                    </div>
                    <div>
                      <strong>ID de Usuario:</strong> {stackData.max_reputation.owner.user_id}
                    </div>
                    <div>
                      <img
                        src={stackData.max_reputation.owner.profile_image}
                        alt="Imagen de perfil"
                        style={{ width: "50px", borderRadius: "50%" }}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>ID de Pregunta</td>
                  <td>{stackData.max_reputation.question_id}</td>
                </tr>
                <tr>
                  <td>Puntuación</td>
                  <td>{stackData.max_reputation.score}</td>
                </tr>
                <tr>
                  <td>Etiquetas</td>
                  <td>{stackData.max_reputation.tags.join(", ")}</td>
                </tr>
                <tr>
                  <td>Título</td>
                  <td>{stackData.max_reputation.title}</td>
                </tr>
                <tr>
                  <td>Recuento de Vistas</td>
                  <td>{stackData.max_reputation.view_count}</td>
                </tr>
              </tbody>
            </table>
          )}

          <h2>3.- Respuesta con Menor Número de Vistas:</h2>
          {stackData?.min_views && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Número de Respuestas</td>
                  <td>{stackData.min_views.answer_count}</td>
                </tr>
                <tr>
                  <td>Licencia de Contenido</td>
                  <td>{stackData.min_views.content_license}</td>
                </tr>
                <tr>
                  <td>Fecha de Creación</td>
                  <td>{new Date(stackData.min_views.creation_date * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>¿Está Contestada?</td>
                  <td>{stackData.min_views.is_answered ? "Sí" : "No"}</td>
                </tr>
                <tr>
                  <td>Fecha de Última Actividad</td>
                  <td>{new Date(stackData.min_views.last_activity_date * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Fecha de Última Edición</td>
                  <td>{stackData.min_views.last_edit_date ? new Date(stackData.min_views.last_edit_date * 1000).toLocaleString() : "N/A"}</td>
                </tr>
                <tr>
                  <td>Enlace</td>
                  <td>
                    <a href={stackData.min_views.link} target="_blank" rel="noopener noreferrer">
                      Ver pregunta
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Dueño</td>
                  <td>
                    <div>
                      <strong>Nombre:</strong> {stackData.min_views.owner.display_name}
                    </div>
                    <div>
                      <strong>Reputación:</strong> {stackData.min_views.owner.reputation}
                    </div>
                    <div>
                      <strong>ID de Usuario:</strong> {stackData.min_views.owner.user_id}
                    </div>
                    <div>
                      <img
                        src={stackData.min_views.owner.profile_image}
                        alt="Imagen de perfil"
                        style={{ width: "50px", borderRadius: "50%" }}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>ID de Pregunta</td>
                  <td>{stackData.min_views.question_id}</td>
                </tr>
                <tr>
                  <td>Puntuación</td>
                  <td>{stackData.min_views.score}</td>
                </tr>
                <tr>
                  <td>Etiquetas</td>
                  <td>{stackData.min_views.tags.join(", ")}</td>
                </tr>
                <tr>
                  <td>Título</td>
                  <td>{stackData.min_views.title}</td>
                </tr>
                <tr>
                  <td>Recuento de Vistas</td>
                  <td>{stackData.min_views.view_count}</td>
                </tr>
              </tbody>
            </table>
          )}

          <h2>4.- Respuesta Más Vieja:</h2>
          {stackData?.oldest && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Número de Respuestas</td>
                  <td>{stackData.oldest.answer_count}</td>
                </tr>
                <tr>
                  <td>Licencia de Contenido</td>
                  <td>{stackData.oldest.content_license}</td>
                </tr>
                <tr>
                  <td>Fecha de Creación</td>
                  <td>{new Date(stackData.oldest.creation_date * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>¿Está Contestada?</td>
                  <td>{stackData.oldest.is_answered ? "Sí" : "No"}</td>
                </tr>
                <tr>
                  <td>Fecha de Última Actividad</td>
                  <td>{new Date(stackData.oldest.last_activity_date * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Fecha de Última Edición</td>
                  <td>{stackData.oldest.last_edit_date ? new Date(stackData.oldest.last_edit_date * 1000).toLocaleString() : "N/A"}</td>
                </tr>
                <tr>
                  <td>Enlace</td>
                  <td>
                    <a href={stackData.oldest.link} target="_blank" rel="noopener noreferrer">
                      Ver pregunta
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Dueño</td>
                  <td>
                    <div>
                      <strong>Nombre:</strong> {stackData.oldest.owner.display_name}
                    </div>
                    <div>
                      <strong>Reputación:</strong> {stackData.oldest.owner.reputation}
                    </div>
                    <div>
                      <strong>ID de Usuario:</strong> {stackData.oldest.owner.user_id}
                    </div>
                    <div>
                      <img
                        src={stackData.oldest.owner.profile_image}
                        alt="Imagen de perfil"
                        style={{ width: "50px", borderRadius: "50%" }}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>ID de Pregunta</td>
                  <td>{stackData.oldest.question_id}</td>
                </tr>
                <tr>
                  <td>Puntuación</td>
                  <td>{stackData.oldest.score}</td>
                </tr>
                <tr>
                  <td>Etiquetas</td>
                  <td>{stackData.oldest.tags.join(", ")}</td>
                </tr>
                <tr>
                  <td>Título</td>
                  <td>{stackData.oldest.title}</td>
                </tr>
                <tr>
                  <td>Recuento de Vistas</td>
                  <td>{stackData.oldest.view_count}</td>
                </tr>
              </tbody>
            </table>
          )}

          <h2>Respuesta Más Actual:</h2>
          {stackData?.newest && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Número de Respuestas</td>
                  <td>{stackData.newest.answer_count}</td>
                </tr>
                <tr>
                  <td>Licencia de Contenido</td>
                  <td>{stackData.newest.content_license}</td>
                </tr>
                <tr>
                  <td>Fecha de Creación</td>
                  <td>{new Date(stackData.newest.creation_date * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>¿Está Contestada?</td>
                  <td>{stackData.newest.is_answered ? "Sí" : "No"}</td>
                </tr>
                <tr>
                  <td>Fecha de Última Actividad</td>
                  <td>{new Date(stackData.newest.last_activity_date * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Fecha de Última Edición</td>
                  <td>{stackData.newest.last_edit_date ? new Date(stackData.newest.last_edit_date * 1000).toLocaleString() : "N/A"}</td>
                </tr>
                <tr>
                  <td>Enlace</td>
                  <td>
                    <a href={stackData.newest.link} target="_blank" rel="noopener noreferrer">
                      Ver pregunta
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Dueño</td>
                  <td>
                    <div>
                      <strong>Nombre:</strong> {stackData.newest.owner.display_name}
                    </div>
                    <div>
                      <strong>Reputación:</strong> {stackData.newest.owner.reputation}
                    </div>
                    <div>
                      <strong>ID de Usuario:</strong> {stackData.newest.owner.user_id}
                    </div>
                    <div>
                      <img
                        src={stackData.newest.owner.profile_image}
                        alt="Imagen de perfil"
                        style={{ width: "50px", borderRadius: "50%" }}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>ID de Pregunta</td>
                  <td>{stackData.newest.question_id}</td>
                </tr>
                <tr>
                  <td>Puntuación</td>
                  <td>{stackData.newest.score}</td>
                </tr>
                <tr>
                  <td>Etiquetas</td>
                  <td>{stackData.newest.tags.join(", ")}</td>
                </tr>
                <tr>
                  <td>Título</td>
                  <td>{stackData.newest.title}</td>
                </tr>
                <tr>
                  <td>Recuento de Vistas</td>
                  <td>{stackData.newest.view_count}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
   
    </div>
  );

};

export default StackExchange;