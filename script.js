document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('iaEvaluationForm');
    const formSection = document.getElementById('formSection');
    const resultContainer = document.getElementById('resultContainer');
    let totalScoreElement = document.getElementById('totalScore');
    let percentageScoreElement = document.getElementById('percentageScore');
    let resultInterpretation = document.getElementById('resultInterpretation');
    const restartBtn = document.getElementById('restartBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    let myChart = null; // Variable para almacenar la instancia del gráfico

    // Mapping of question types and their maximum scores
    const questionScores = {
        threeOption: { max: 3, zeroIndex: 0 },
        twoOption: { max: 2, zeroIndex: 0 }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Calcular puntuación
        let totalScore = 0;
        let zeroQuestions = [];
        const questionDetails = [
            { type: 'threeOption', zeroQuestions: [1, 3, 5, 9] },
            { type: 'twoOption', zeroQuestions: [2, 4, 6, 7, 8, 10, 11, 12] }
        ];

        // Calculate total score and identify zero-score questions
        questionDetails.forEach(detail => {
            detail.zeroQuestions.forEach(questionNum => {
                let selectedOption = document.querySelector(`input[name="q${questionNum}"]:checked`);
                if (!selectedOption) {
                    alert('Por favor, responda todas las preguntas');
                    return;
                }
                
                let score = parseInt(selectedOption.value);
                totalScore += score;

                // Check for zero-score questions
                if (score === 0) {
                    zeroQuestions.push(questionNum);
                }
            });
        });

        let percentageScore = Math.round((totalScore / 29) * 100);

        // Mostrar resultados
        totalScoreElement.textContent = totalScore;
        percentageScoreElement.textContent = percentageScore;
        
        // Ocultar formulario y mostrar resultados
        formSection.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        // Interpretación de resultados
        let interpretation = '';
        let chartColor = '';

        if (percentageScore >= 80) {
            interpretation = `
                <h3 style="color: green;">Excelente uso de IA</h3>
                <p>Felicidades, estás utilizando la IA de manera crítica, consciente y como una herramienta de aprendizaje real. Mantienes una actitud proactiva, reflexiva y rigurosa en tu proceso de investigación.</p>
                <p><strong>Consejos para mantener este nivel:</strong></p>
                <ul>
                    <li>Continúa cuestionando y verificando la información.</li>
                    <li>Mantén tu curiosidad y espíritu crítico.</li>
                    <li>Explora siempre diferentes perspectivas.</li>
                </ul>
            `;
            chartColor = '#2ecc71'; // Verde
        } else if (percentageScore >= 50) {
            interpretation = `
                <h3 style="color: orange;">Uso de IA en Desarrollo</h3>
                <p>Tu uso de la IA muestra potencial, pero necesitas refinarlo. Hay aspectos positivos en tu enfoque, pero también áreas de mejora. Continúa siendo crítico y consciente.</p>
                <p><strong>Sugerencias de mejora:</strong></p>
                <ul>
                    <li>Dedica más tiempo a verificar la información.</li>
                    <li>Busca contrastar lo aprendido con otras fuentes.</li>
                    <li>Reflexiona más profundamente sobre los conceptos.</li>
                </ul>
            `;
            chartColor = '#f39c12'; // Amarillo
        } else {
            interpretation = `
                <h3 style="color: red;">Uso de IA con Necesidad de Mejora</h3>
                <p>Es momento de replantearse tu estrategia de uso de la IA. Corres el riesgo de convertirte en un consumidor pasivo de información en lugar de un aprendiz activo.</p>
                <p><strong>Pasos para mejorar:</strong></p>
                <ul>
                    <li>Cuestiona siempre la información proporcionada.</li>
                    <li>Busca fuentes adicionales de conocimiento.</li>
                    <li>Desarrolla un enfoque más crítico y reflexivo.</li>
                </ul>
            `;
            chartColor = '#e74c3c'; // Rojo
        }

        resultInterpretation.innerHTML = interpretation;

        // Preguntas con puntuación cero
        if (zeroQuestions.length > 0) {
            let zeroQuestionsHTML = '<h3>Áreas de mejora:</h3>';
            let zeroQuestionDetails = {
                1: {
                    problema: 'Uso superficial de la IA',
                    solucion: 'Utiliza la IA como una herramienta de aprendizaje, no solo para obtener respuestas rápidas. Dedica tiempo a comprender los conceptos en profundidad, plantea preguntas adicionales y explora diferentes ángulos del tema.'
                },
                2: {
                    problema: 'Dependencia del lenguaje de la IA',
                    solucion: 'Practica explicar los conceptos con tus propias palabras. Después de obtener una explicación de la IA, intenta resumirla con tus propias palabras, identificando las ideas principales y relacionándolas con tu conocimiento previo.'
                },
                3: {
                    problema: 'Aceptación pasiva de la información',
                    solucion: 'Desarrolla un pensamiento crítico. Pregúntate: ¿Cuáles son las limitaciones de esta explicación? ¿Qué puntos no quedan claros? Busca contrastar la información con otras fuentes y no temas cuestionar los argumentos presentados.'
                }
            };


        }

        // Crear gráfico de pastel
        const ctx = document.getElementById('scoreChart').getContext('2d');
        if (myChart) {
            myChart.destroy(); // Destruir el gráfico anterior si existe
        }
        myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Puntuación', 'Grado de mejora'],
                datasets: [{
                    data: [totalScore, 29 - totalScore],
                    backgroundColor: [
                        percentageScore >= 80 ? '#2ecc71' : 
                        (percentageScore >= 50 ? '#f39c12' : '#e74c3c'),
                        '#e0e0e0'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let value = context.parsed;
                                let total = context.dataset.data.reduce((a, b) => a + b, 0);
                                let percentage = ((value / total) * 100).toFixed(2);
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    });

    // Restart functionality
    restartBtn.addEventListener('click', () => {
        // Reset form
        form.reset();
        
        // Hide results, show form
        resultContainer.classList.add('hidden');
        formSection.classList.remove('hidden');


        // Limpiar interpretación de resultados
        resultInterpretation.innerHTML = '';

            // Destruir el gráfico y limpiar la referencia
            if (myChart) {
                myChart.destroy();
                myChart = null;
            }
        });

            // Download PDF functionality
    downloadPdfBtn.addEventListener('click', () => {
        let element = resultContainer;
        let opt = {
            margin:       [10, 10, 10, 10], // Top, right, bottom, left
            filename:     'evaluacion-uso-responsable-ia.pdf',
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true,
                logging: false,
                dpi: 600,
                scrollX: 0,
                scrollY: -window.scrollY,
                backgroundColor: 'white' // Asegurar fondo blanco y opaco
            },
            jsPDF:        { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            },
            pagebreak: { mode: 'avoid-all' }
        };

        html2pdf().set(opt).from(element).save();
    });
        
        });