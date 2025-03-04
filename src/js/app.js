document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('medForm');
    const calendar = document.getElementById('calendar');
    const clearAllBtn = document.getElementById('clearAllBtn');

    loadMedications();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const medName = document.getElementById('medName').value;
        const medDose = document.getElementById('medDose').value;
        const medDay = document.getElementById('medDay').value;
        const medTime = document.getElementById('medTime').value;
        const medInstructions = document.getElementById('medInstructions').value;

        if (isNaN(medDose) || medDose <= 0) {
            alert('Por favor, introduza uma dose válida.');
            return;
        }

        const medication = {
            id: Date.now() + Math.random(), 
            name: medName,
            dose: medDose,
            day: medDay,
            time: medTime,
            instructions: medInstructions
        };

        saveMedication(medication);

        form.reset();

        loadMedications();
        
    });

    clearAllBtn.addEventListener('click', function () {
        if (confirm('Você tem certeza de que deseja limpar todos os medicamentos registrados?')) {
            localStorage.removeItem('medications');
            loadMedications();
        }
    });

    function saveMedication(medication) {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

        if (medication.day === 'Todos') {
            daysOfWeek.forEach(day => {
                const medCopy = { ...medication, day, id: Date.now() + Math.random() };
                medications.push(medCopy);
            });
        } else {
            medications.push(medication);
        }

        medications.sort((a, b) => {
            const daysOrder = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
            return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day) || a.time.localeCompare(b.time);
        });

        localStorage.setItem('medications', JSON.stringify(medications));
        loadMedications();
    }

    function loadMedications() {
        calendar.innerHTML = '';
        const medications = JSON.parse(localStorage.getItem('medications')) || [];

        const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

        daysOfWeek.forEach(function (day) {
            const dayContainer = document.createElement('div');
            dayContainer.classList.add('day-container');
            dayContainer.innerHTML = `<h3>${day}</h3>`;

            const dayMedications = medications.filter(med => med.day === day);

            if (dayMedications.length > 0) {
                const medList = document.createElement('ul');
                dayMedications.forEach(function (med) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div>
                            <strong style="font-size: 18px; color: #007BFF;">${med.time}</strong>
                            <span style="font-size: 16px; margin-left: 10px;">${med.name}</span>
                        </div>
                        <div style="margin-top: 5px; font-size: 14px; color: #555;">
                            <p>Tomar <strong>${med.dose} dose(s).</strong></p>
                            ${med.instructions ? `<p>Instruções: <strong>${med.instructions}.</strong></p>` : ''}
                        </div>
                        <div style="margin-top: 5px; display: flex; justify-content: flex-end; gap: 5px;">
                            <button class="edit-btn" data-id="${med.id}">Editar</button>
                            <button class="delete-btn" data-id="${med.id}">Excluir</button>
                        </div>`;
                    medList.appendChild(li);
                });
                dayContainer.appendChild(medList);
            } else {
                dayContainer.innerHTML += `<p>Nenhum medicamento registrado para este dia.</p>`;
            }

            calendar.appendChild(dayContainer);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                deleteMedication(id);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                editMedication(id);
            });
        });
    }

    function deleteMedication(id) {
        let medications = JSON.parse(localStorage.getItem('medications')) || [];
        medications = medications.filter(med => med.id !== parseFloat(id));
        localStorage.setItem('medications', JSON.stringify(medications));
        loadMedications();
    }

    function editMedication(id) {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const med = medications.find(med => med.id === parseFloat(id));

        if (med) {
            document.getElementById('medName').value = med.name;
            document.getElementById('medDose').value = med.dose;
            document.getElementById('medDay').value = med.day;
            document.getElementById('medTime').value = med.time;
            document.getElementById('medInstructions').value = med.instructions;

            deleteMedication(id);

            const form = document.getElementById('medForm');
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});
