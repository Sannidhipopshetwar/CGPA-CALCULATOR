document.addEventListener('DOMContentLoaded', () => {
            const semestersContainer = document.getElementById('semesters-container');
            const addSemesterBtn = document.getElementById('add-semester-btn');
            const cgpaForm = document.getElementById('cgpaForm');
            const resultDiv = document.getElementById('result');
            const sgpaGraphCtx = document.getElementById('sgpaGraph').getContext('2d');
            let sgpaChart;

            let semesterCount = 0;

            function addSemester() {
                semesterCount++;
                const semesterDiv = document.createElement('div');
                semesterDiv.classList.add('form-group', 'semester-group');
                semesterDiv.setAttribute('data-semester', semesterCount);
                let removeBtn = '';
                if (semesterCount > 2) {
                    removeBtn = `<div class="remove-btn-row"><button type="button" class="remove-semester-btn" title="Remove Semester">&times;</button></div>`;
                }
                semesterDiv.innerHTML = `
                    <label for="sgpa-${semesterCount}">Semester ${semesterCount} SGPA:</label>
                    <input type="number" step="0.01" id="sgpa-${semesterCount}" class="sgpa-input" placeholder="Enter SGPA" required>
                    <label for="credits-${semesterCount}">Semester ${semesterCount} Credits:</label>
                    <input type="number" id="credits-${semesterCount}" class="credits-input" value="20">
                    ${removeBtn}
                `;
                semestersContainer.appendChild(semesterDiv);

                // Add remove event if button exists
                if (semesterCount > 2) {
                    semesterDiv.querySelector('.remove-semester-btn').addEventListener('click', function () {
                        semesterDiv.remove();
                        updateSemesterLabels();
                    });
                }
            }

            function updateSemesterLabels() {
                // Re-label semesters and update IDs after removal
                const semesterGroups = document.querySelectorAll('.semester-group');
                let num = 1;
                semesterGroups.forEach((div, idx) => {
                    div.querySelector('label[for^="sgpa-"]').textContent = `Semester ${num} SGPA:`;
                    div.querySelector('label[for^="credits-"]').textContent = `Semester ${num} Credits:`;
                    div.querySelector('.sgpa-input').id = `sgpa-${num}`;
                    div.querySelector('.credits-input').id = `credits-${num}`;
                    // Remove button logic
                    let removeBtn = div.querySelector('.remove-semester-btn');
                    if (num <= 2) {
                        if (removeBtn) removeBtn.remove();
                    } else {
                        if (!removeBtn) {
                            // Add remove button if missing
                            const row = document.createElement('div');
                            row.className = 'remove-btn-row';
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'remove-semester-btn';
                            btn.title = 'Remove Semester';
                            btn.innerHTML = '&times;';
                            btn.addEventListener('click', function () {
                                div.remove();
                                updateSemesterLabels();
                            });
                            row.appendChild(btn);
                            div.appendChild(row);
                        }
                    }
                    num++;
                });
            }

            addSemesterBtn.addEventListener('click', addSemester);

            cgpaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                calculateCGPA();
            });

            function calculateCGPA() {
                const sgpaInputs = document.querySelectorAll('.sgpa-input');
                const creditsInputs = document.querySelectorAll('.credits-input');

                let totalCredits = 0;
                let weightedSgpaSum = 0;
                const semesterData = [];

                for (let i = 0; i < sgpaInputs.length; i++) {
                    const sgpa = parseFloat(sgpaInputs[i].value);
                    const credits = parseInt(creditsInputs[i].value);

                    if (!isNaN(sgpa) && !isNaN(credits) && sgpa >= 0 && sgpa <= 10 && credits > 0) {
                        totalCredits += credits;
                        weightedSgpaSum += sgpa * credits;
                        semesterData.push({ semester: `Semester ${i + 1}`, sgpa, credits });
                    }
                }

                if (totalCredits > 0) {
                    const cgpa = (weightedSgpaSum / totalCredits).toFixed(2);
                    const percentage = ((parseFloat(cgpa) - 0.5) * 10).toFixed(2);
                    displayResult(cgpa, percentage, semesterData);
                    updateGraph(semesterData);
                    setupTargetCgpa(cgpa, semesterData);
                } else {
                    resultDiv.innerHTML = '<p class="error">Please enter valid SGPA and credits for at least one semester.</p>';
                }
            }

            function displayResult(cgpa, percentage, semesterData) {
                let resultHTML = `<div class="cgpa-section"><h2>CGPA: ${cgpa}</h2><h3 class="percentage">Percentage: ${percentage}%</h3></div>`;
                resultHTML += '<div class="results"><h3>Semester Details</h3>';
                semesterData.forEach(sem => {
                    resultHTML += `<div class="semester"><strong>${sem.semester}</strong>: ${sem.sgpa} (Credits: ${sem.credits})</div>`;
                });
                resultHTML += '</div>';
                resultDiv.innerHTML = resultHTML;
            }

            function updateGraph(semesterData) {
                if (sgpaChart) {
                    sgpaChart.destroy();
                }
                sgpaChart = new Chart(sgpaGraphCtx, {
                    type: 'line',
                    data: {
                        labels: semesterData.map(s => s.semester),
                        datasets: [{
                            label: 'SGPA',
                            data: semesterData.map(s => s.sgpa),
                            borderColor: '#1a73e8',
                            backgroundColor: 'rgba(26, 115, 232, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: false,
                                min: 0,
                                max: 10
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Semester-wise SGPA Performance'
                            }
                        }
                    }
                });
            }

            function setupTargetCgpa(currentCgpa, semesterData) {
                const targetCgpaSection = document.getElementById('targetCgpaSection');
                targetCgpaSection.style.display = 'block';

                const lastCompletedSemNum = semesterData.length;
                const targetSemSelect = document.getElementById('targetSemSelect');
                targetSemSelect.innerHTML = '';
                for (let i = lastCompletedSemNum + 1; i <= 8; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Semester ${i}`;
                    targetSemSelect.appendChild(option);
                }

                document.getElementById('calcTargetCgpaBtn').onclick = function () {
                    const targetCgpa = parseFloat(document.getElementById('targetCgpaInput').value);
                    const targetSem = parseInt(document.getElementById('targetSemSelect').value);
                    const targetCgpaResult = document.getElementById('targetCgpaResult');

                    if (isNaN(targetCgpa) || isNaN(targetSem)) {
                        targetCgpaResult.innerHTML = '<span style="color:red;">Please enter a valid target CGPA and semester.</span>';
                        return;
                    }

                    const completedCredits = semesterData.reduce((sum, s) => sum + s.credits, 0);
                    const completedWeightedSum = semesterData.reduce((sum, s) => sum + s.sgpa * s.credits, 0);

                    const remainingSems = targetSem - lastCompletedSemNum;
                    if (remainingSems <= 0) {
                        targetCgpaResult.innerHTML = '<span style="color:red;">Target semester must be after the last completed semester.</span>';
                        return;
                    }

                    // Assuming 20 credits for future semesters
                    const futureCredits = remainingSems * 20;
                    const totalFutureCredits = completedCredits + futureCredits;
                    const requiredWeightedSum = targetCgpa * totalFutureCredits - completedWeightedSum;
                    const requiredAvgSgpa = requiredWeightedSum / futureCredits;

                    if (requiredAvgSgpa > 10) {
                        const maxPossibleCgpa = ((completedWeightedSum + futureCredits * 10) / totalFutureCredits).toFixed(2);
                        targetCgpaResult.innerHTML = `<span style="color:red;">Target CGPA not possible. Max possible CGPA by semester ${targetSem} is <b>${maxPossibleCgpa}</b>.</span>`;
                    } else if (requiredAvgSgpa <= 0) {
                        targetCgpaResult.innerHTML = `<span style="color:red;">The required SGPA is 0 or less. Please check your target.</span>`;
                    } else {
                        targetCgpaResult.innerHTML = `You need an average of<b>${requiredAvgSgpa.toFixed(2)}</b> SGPA in the next ${remainingSems} semester(s) to reach a CGPA of <b>${targetCgpa}</b>.`;
                    }
                };
            }

            // Add initial two semesters
            addSemester();
            addSemester();
        });