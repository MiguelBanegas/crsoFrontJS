// Función para obtener datos desde la URL del JSON
async function fetchData() {
    const response = await fetch('https://enerbarenergia.com/consultas.php?accion=consultar_resultados');
    const data = await response.json();
    return data;
}

// Función para mostrar los datos en la tabla (ordenados en orden descendente por fecha)
function populateTable(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

    // Ordenar los datos en orden descendente según la fecha y hora
    data.sort((a, b) => new Date(b.fecha_hora_test) - new Date(a.fecha_hora_test));

    // Recorrer los registros y agregarlos a la tabla
    data.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.id_test}</td>
            <td>${record.id_dispositivo}</td>
            <td>${record.tiempo_respuesta}</td>
            <td>${record.fecha_hora_test}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para generar el histograma con Chart.js (ordenado en forma ascendente por fecha)
function generateHistogram(data) {
    const ctx = document.getElementById('histogramChart').getContext('2d');

    // Ordenar los datos en orden ascendente para el gráfico
    const sortedData = [...data].sort((a, b) => new Date(a.fecha_hora_test) - new Date(b.fecha_hora_test));

    // Extraer las fechas y los tiempos de respuesta para el gráfico
    const fechas = sortedData.map(record => record.fecha_hora_test);  // Eje X (Fechas y horas)
    const tiempos = sortedData.map(record => record.tiempo_respuesta);  // Eje Y (Tiempos de respuesta)

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fechas,  // Las fechas serán las etiquetas del eje X
            datasets: [{
                label: 'Tiempos de Respuesta (ms)',
                data: tiempos,  // Los tiempos de respuesta en el eje Y
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha y Hora del Test'
                    },
                    ticks: {
                        autoSkip: true,  // Saltar etiquetas para evitar superposición
                        maxRotation: 45,  // Rotar etiquetas
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tiempo de Respuesta (ms)'
                    }
                }
            }
        }
    });
}

// Función para exportar los datos de la tabla a PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Usar autoTable para crear la tabla en el PDF
    doc.autoTable({
        head: [['ID Test', 'ID Dispositivo', 'Tiempo Respuesta (ms)', 'Fecha y Hora del Test']],
        body: Array.from(document.querySelectorAll('#dataTable tbody tr')).map(row => 
            Array.from(row.children).map(cell => cell.textContent)
        )
    });

    // Descargar el PDF
    doc.save('registros_test_diferenciales.pdf');
}

// Función para exportar los datos de la tabla a Excel
function exportToExcel() {
    const wb = XLSX.utils.book_new(); // Crear nuevo libro
    const ws = XLSX.utils.table_to_sheet(document.getElementById('dataTable')); // Convertir la tabla a sheet
    XLSX.utils.book_append_sheet(wb, ws, 'Registros Test'); // Añadir hoja al libro
    XLSX.writeFile(wb, 'registros_test_diferenciales.xlsx'); // Descargar archivo Excel
}

// Inicializar la página
async function initializePage() {
    const data = await fetchData();  // Obtener datos desde el JSON
    populateTable(data);  // Mostrar datos en la tabla
    generateHistogram(data);  // Generar el gráfico
}

// Llamar a la función para inicializar la página
initializePage();