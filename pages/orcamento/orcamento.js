document.addEventListener('DOMContentLoaded', function() {
    // Defines the initial state for active platforms in each section
    const activePlatforms = {
        kia: 'google',
        suzuki: 'google',
        zontes: 'google',
        haojue: 'google',
    };

    // Sorting state for each section
    const sortingState = {
        kia: { field: 'orcamentoDiario', direction: 'desc' },
        suzuki: { field: 'orcamentoDiario', direction: 'desc' },
        zontes: { field: 'orcamentoDiario', direction: 'desc' },
        haojue: { field: 'orcamentoDiario', direction: 'desc' }
    };

    /**
     * Creates a data object for a platform with pre-filled and calculated budgets.
     * @param {number} orcamentoTotal - The pre-filled total budget for the month.
     * @param {boolean} isActive - Whether the platform is active for this model.
     * @returns {object} The platform data object.
     */
    const createPlatformData = (orcamentoTotal = 0, isActive = true) => ({
        orcamentoDiario: orcamentoTotal / 30, // Pre-calculate daily budget (assuming 30 days)
        orcamentoTotal: orcamentoTotal,
        resultados: 0,
        observacoes: '',
        isActive: isActive
    });

    // Initial data structure for all campaigns, with corrected models and distributed budgets
    const campaignData = {
        kia: [
            { name: 'Sportage', google: createPlatformData(333.33), meta: createPlatformData(133.33) },
            { name: 'Niro', google: createPlatformData(333.33), meta: createPlatformData(133.33) },
            { name: 'Stonic', google: createPlatformData(333.33), meta: createPlatformData(133.33) },
            { name: 'Carnival', google: createPlatformData(333.33), meta: createPlatformData(133.33) },
            { name: 'EV6', google: createPlatformData(333.34), meta: createPlatformData(133.34) },
            { name: 'Bongo', google: createPlatformData(333.34), meta: createPlatformData(133.34) }
        ],
        suzuki: [
            { name: 'GSX-8R', google: createPlatformData(107.50), meta: createPlatformData(217.50) },
            { name: 'GSX-8S', google: createPlatformData(107.50), meta: createPlatformData(217.50) },
            { name: 'V-Strom 800DE', google: createPlatformData(107.50), meta: createPlatformData(217.50) },
            { name: 'V-Strom 650', google: createPlatformData(107.50), meta: createPlatformData(217.50) }
        ],
        zontes: [
            { name: 'E350 Scooter', google: createPlatformData(98.00), meta: createPlatformData(202.00) },
            { name: 'S350', google: createPlatformData(98.00), meta: createPlatformData(202.00) },
            { name: 'Tactic 400', google: createPlatformData(98.00), meta: createPlatformData(202.00) },
            { name: 'T350 e T350x', google: createPlatformData(98.00), meta: createPlatformData(202.00) },
            { name: 'V350', google: createPlatformData(98.00), meta: createPlatformData(202.00) }
        ],
        haojue: [
            { name: 'NK 150', google: createPlatformData(216.00), meta: createPlatformData(444.00) },
            { name: 'DK 160', google: createPlatformData(216.00), meta: createPlatformData(444.00) },
            { name: 'MASTER RIDE', google: createPlatformData(216.00), meta: createPlatformData(444.00) },
            { name: 'DR 160', google: createPlatformData(216.00), meta: createPlatformData(444.00) },
            { name: 'DL 160', google: createPlatformData(216.00), meta: createPlatformData(444.00) }
        ]
    };

    /**
     * Creates table headers with the new order: Status, Model, Budget columns
     * @param {string} activePlatform - The currently active platform ('google' or 'meta')
     * @returns {string} HTML string for table headers
     */
    const createTableHeaders = (activePlatform) => {
        const platformName = activePlatform === 'google' ? 'Google Ads' : 'Meta Ads';
        
        return `
            <tr>
                <th class="px-2 py-3">Status<div class="tooltip"><span class="tooltiptext">Ativação da campanha para ${platformName}</span></div></th>
                <th class="px-2 py-3">Modelo</th>
                <th class="px-2 py-3 sortable" data-sort="orcamentoDiario">
                    Orçamento Diário
                    <span class="sort-indicator ml-1">↕️</span>
                    <div class="tooltip"><span class="tooltiptext">Orçamento diário (Total ÷ 30)</span></div>
                </th>
                <th class="px-2 py-3 sortable" data-sort="orcamentoSemanal">
                    Orçamento Semanal
                    <span class="sort-indicator ml-1">↕️</span>
                    <div class="tooltip"><span class="tooltiptext">Calculado automaticamente (Diário × 7)</span></div>
                </th>
                <th class="px-2 py-3 sortable" data-sort="orcamentoTotal">
                    Orçamento Total
                    <span class="sort-indicator ml-1">↕️</span>
                    <div class="tooltip"><span class="tooltiptext">Valor total do orçamento mensal</span></div>
                </th>
                <th class="px-2 py-3 sortable" data-sort="resultados">
                    Resultados
                    <span class="sort-indicator ml-1">↕️</span>
                    <div class="tooltip"><span class="tooltiptext">Total de leads, vendas ou conversões</span></div>
                </th>
                <th class="px-2 py-3 sortable" data-sort="custoPorResultado">
                    Custo p/ Resultado
                    <span class="sort-indicator ml-1">↕️</span>
                    <div class="tooltip"><span class="tooltiptext">Custo por resultado (Gasto Total ÷ Resultados)</span></div>
                </th>
                <th class="px-2 py-3">Observações<div class="tooltip"><span class="tooltiptext">Anotações e comentários sobre a campanha</span></div></th>
            </tr>
        `;
    };

    /**
     * Creates a standard input element.
     * @param {string} type - The input type (e.g., 'text', 'number').
     * @param {string} name - The name attribute for the input.
     * @param {boolean} isCalculated - True if the input is for a calculated, read-only value.
     * @returns {HTMLInputElement} The created input element.
     */
    const createInput = (type, name, isCalculated = false) => {
        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.className = 'metric-input';
        input.placeholder = type === 'number' ? '0' : '...';
        if (isCalculated) {
            input.readOnly = true;
            input.classList.add('calculated');
            input.value = 'R$ 0.00';
        }
        if (type === 'number') {
           input.step = "0.01"; // Allow decimal values for currency
        }
        return input;
    };

    /**
     * Creates a number input with custom up/down spinner controls.
     * @param {string} name - The name attribute for the input.
     * @returns {HTMLDivElement} The wrapper div containing the input and spinners.
     */
    const createNumberInputWithSpinners = (name) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'number-input-wrapper';
        const input = createInput('number', name);
        const spinnersDiv = document.createElement('div');
        spinnersDiv.className = 'spinners';
        const upArrowSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>`;
        const downArrowSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>`;
        spinnersDiv.innerHTML = `
            <span class="spinner spinner-up" data-step="up">${upArrowSVG}</span>
            <span class="spinner spinner-down" data-step="down">${downArrowSVG}</span>`;
        wrapper.appendChild(input);
        wrapper.appendChild(spinnersDiv);
        return wrapper;
    };

    /**
     * Creates a status cell with toggle switch for the active platform only.
     * @param {object} modelData - The data object for a single model.
     * @param {string} activePlatform - The currently active platform ('google' or 'meta').
     * @returns {HTMLElement} The status cell element.
     */
    const createStatusCell = (modelData, activePlatform) => {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'platform-status';
        
        const platformName = activePlatform === 'google' ? 'Google Ads' : 'Meta Ads';
        const isActive = modelData[activePlatform].isActive;
        
        // Single toggle for active platform
        const toggle = document.createElement('label');
        toggle.className = 'toggle-switch table-toggle';
        toggle.innerHTML = `
            <input type="checkbox" ${isActive ? 'checked' : ''} data-platform="${activePlatform}">
            <span class="toggle-slider"></span>
        `;
        
        const label = document.createElement('span');
        label.textContent = activePlatform === 'google' ? 'Ativa' : 'Ativa';
        label.className = isActive ? 'status-active' : 'status-inactive';
        label.title = `Status para ${platformName}`;
        
        statusDiv.appendChild(toggle);
        statusDiv.appendChild(label);
        
        return statusDiv;
    };

    /**
     * Renders a single table row with data for the active platform.
     * @param {object} modelData - The data object for a single model.
     * @param {string} activePlatform - The currently active platform ('google' or 'meta').
     * @returns {HTMLTableRowElement} The created table row.
     */
    const renderRow = (modelData, activePlatform) => {
        const row = document.createElement('tr');
        row.className = 'bg-white border-b even:bg-gray-50';

        const platformData = modelData[activePlatform];

        // Create status cell (first column now)
        const statusCell = createStatusCell(modelData, activePlatform);

        // Model name (second column now)
        const modelNameCell = document.createElement('th');
        modelNameCell.scope = 'row';
        modelNameCell.className = 'px-2 py-2 font-medium text-gray-900 whitespace-nowrap';
        modelNameCell.textContent = modelData.name;

        const orcamentoDiarioInput = createNumberInputWithSpinners('orcamentoDiario');
        orcamentoDiarioInput.querySelector('input').value = platformData.orcamentoDiario.toFixed(2);

        const orcamentoTotalInput = createNumberInputWithSpinners('orcamentoTotal');
        orcamentoTotalInput.querySelector('input').value = platformData.orcamentoTotal.toFixed(2);
        
        const resultadosInput = createNumberInputWithSpinners('resultados');
        resultadosInput.querySelector('input').value = platformData.resultados;

        const observacoesInput = createInput('text', 'observacoes');
        observacoesInput.style.textAlign = 'left';
        observacoesInput.value = platformData.observacoes || '';

        // New order: Status, Model, then budget columns
        const cells = [
            statusCell,
            modelNameCell,
            orcamentoDiarioInput,
            createInput('text', 'orcamentoSemanal', true),
            orcamentoTotalInput,
            resultadosInput,
            createInput('text', 'custoPorResultado', true),
            observacoesInput
        ];

        cells.forEach(cell => {
            const td = document.createElement('td');
            td.className = 'px-2 py-1';
            if (cell.tagName === 'TH') {
                // For model name cell, just append directly
                row.appendChild(cell);
            } else {
                td.appendChild(cell);
                row.appendChild(td);
            }
        });
        
        calculateMetrics(row); // Calculate metrics on initial render
        return row;
    };

    /**
     * Updates table headers when platform changes.
     * @param {string} sectionName - The name of the section.
     */
    const updateTableHeaders = (sectionName) => {
        const sectionElement = document.getElementById(sectionName);
        if (!sectionElement) return;

        const activePlatform = activePlatforms[sectionName];
        const tableHead = sectionElement.querySelector('table thead');
        
        if (tableHead) {
            tableHead.innerHTML = createTableHeaders(activePlatform);
        }
    };

    /**
     * Renders an entire table for a specific section and platform.
     * @param {string} sectionName - The name of the section (e.g., 'kia').
     */
    const renderTable = (sectionName) => {
        const sectionElement = document.getElementById(sectionName);
        if (!sectionElement) return;

        const tableBody = sectionElement.querySelector('table tbody');
        const models = campaignData[sectionName];
        const activePlatform = activePlatforms[sectionName];
        
        // Update headers first
        updateTableHeaders(sectionName);
        
        if (tableBody && models) {
            tableBody.innerHTML = ''; // Clear existing rows
            models.forEach(model => {
                tableBody.appendChild(renderRow(model, activePlatform));
            });
        }
    };
    
    /**
     * Calculates and updates the metrics for a given table row.
     * @param {HTMLTableRowElement} row - The table row to calculate metrics for.
     */
    function calculateMetrics(row) {
        const inputs = {
            orcamentoDiario: parseFloat(row.querySelector('[name="orcamentoDiario"]').value) || 0,
            orcamentoTotal: parseFloat(row.querySelector('[name="orcamentoTotal"]').value) || 0,
            resultados: parseFloat(row.querySelector('[name="resultados"]').value) || 0,
        };
        const outputs = {
            orcamentoSemanal: row.querySelector('[name="orcamentoSemanal"]'),
            custoPorResultado: row.querySelector('[name="custoPorResultado"]'),
        };
        
        // Update daily budget if total budget is changed by the user
        const orcamentoTotalInput = row.querySelector('[name="orcamentoTotal"]');
        const orcamentoDiarioInput = row.querySelector('[name="orcamentoDiario"]');

        // This logic makes the daily budget react to total budget changes
        const dailyBudgetFromTotal = inputs.orcamentoTotal / 30;
        orcamentoDiarioInput.value = dailyBudgetFromTotal.toFixed(2);

        const orcamentoSemanal = dailyBudgetFromTotal * 7;
        const custoPorResultado = inputs.resultados > 0 ? inputs.orcamentoTotal / inputs.resultados : 0;

        outputs.orcamentoSemanal.value = `R$ ${orcamentoSemanal.toFixed(2)}`;
        outputs.custoPorResultado.value = `R$ ${custoPorResultado.toFixed(2)}`;
    }

    /**
     * Saves the current data from the UI back to the campaignData object.
     * @param {string} sectionName - The name of the section to save data for.
     */
    const saveData = (sectionName) => {
        const sectionElement = document.getElementById(sectionName);
        if (!sectionElement) return;

        const activePlatform = activePlatforms[sectionName];
        const rows = sectionElement.querySelectorAll('tbody tr');

        rows.forEach((row, index) => {
            const modelData = campaignData[sectionName][index];
            if (modelData) {
                modelData[activePlatform].orcamentoDiario = parseFloat(row.querySelector('[name="orcamentoDiario"]').value) || 0;
                modelData[activePlatform].orcamentoTotal = parseFloat(row.querySelector('[name="orcamentoTotal"]').value) || 0;
                modelData[activePlatform].resultados = parseFloat(row.querySelector('[name="resultados"]').value) || 0;
                modelData[activePlatform].observacoes = row.querySelector('[name="observacoes"]').value || '';
                
                // Save platform status for the active platform
                const toggle = row.querySelector('.platform-status input[type="checkbox"]');
                if (toggle) {
                    modelData[activePlatform].isActive = toggle.checked;
                }
            }
        });
    };

    /**
     * Sorts table data by a specific field.
     * @param {string} sectionName - The name of the section.
     * @param {string} field - The field to sort by.
     */
    const sortTable = (sectionName, field) => {
        const currentSort = sortingState[sectionName];
        
        // Toggle direction if same field, otherwise default to descending
        if (currentSort.field === field) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.field = field;
            currentSort.direction = 'desc';
        }

        const activePlatform = activePlatforms[sectionName];
        
        campaignData[sectionName].sort((a, b) => {
            let valueA, valueB;
            
            if (field === 'orcamentoSemanal') {
                valueA = parseFloat(a[activePlatform].orcamentoDiario) * 7;
                valueB = parseFloat(b[activePlatform].orcamentoDiario) * 7;
            } else if (field === 'custoPorResultado') {
                const resultadosA = parseFloat(a[activePlatform].resultados) || 0;
                const resultadosB = parseFloat(b[activePlatform].resultados) || 0;
                valueA = resultadosA > 0 ? parseFloat(a[activePlatform].orcamentoTotal) / resultadosA : 0;
                valueB = resultadosB > 0 ? parseFloat(b[activePlatform].orcamentoTotal) / resultadosB : 0;
            } else {
                valueA = parseFloat(a[activePlatform][field]) || 0;
                valueB = parseFloat(b[activePlatform][field]) || 0;
            }
            
            if (currentSort.direction === 'asc') {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });

        renderTable(sectionName);
        updateSortIndicators(sectionName);
    };

    /**
     * Updates sort indicators in table headers.
     * @param {string} sectionName - The name of the section.
     */
    const updateSortIndicators = (sectionName) => {
        const sectionElement = document.getElementById(sectionName);
        if (!sectionElement) return;

        const currentSort = sortingState[sectionName];
        const headers = sectionElement.querySelectorAll('.sortable');
        
        headers.forEach(header => {
            const indicator = header.querySelector('.sort-indicator');
            const field = header.dataset.sort;
            
            if (field === currentSort.field) {
                indicator.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
                header.classList.add('active');
            } else {
                indicator.textContent = '↕️';
                header.classList.remove('active');
            }
        });
    };

    // Modal Management
    let currentSection = null;
    const modal = document.getElementById('addModelModal');
    const modalForm = document.getElementById('addModelForm');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');

    /**
     * Opens the add model modal.
     * @param {string} sectionName - The name of the section.
     */
    const openAddModelModal = (sectionName) => {
        currentSection = sectionName;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus on first input
        document.getElementById('modelName').focus();
    };

    /**
     * Closes the add model modal and resets form.
     */
    const closeAddModelModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalForm.reset();
        currentSection = null;
    };

    /**
     * Adds a new model to a section.
     * @param {string} sectionName - The name of the section.
     */
    const addNewModel = (sectionName) => {
        openAddModelModal(sectionName);
    };

    // --- EVENT LISTENERS ---

    // Main listener for the whole dashboard
    document.getElementById('campaign-dashboard').addEventListener('click', function(event) {
        // Handle add model button clicks
        const addModelBtn = event.target.closest('.add-model-btn');
        if (addModelBtn) {
            const sectionName = addModelBtn.dataset.section;
            addNewModel(sectionName);
            return;
        }

        // Handle sortable header clicks
        const sortableHeader = event.target.closest('.sortable');
        if (sortableHeader) {
            const sectionElement = sortableHeader.closest('[data-section]');
            if (!sectionElement) {
                return;
            }
            const sectionName = sectionElement.dataset.section;
            const field = sortableHeader.dataset.sort;
            sortTable(sectionName, field);
            return;
        }

        // Handle platform toggle clicks
        const toggleButton = event.target.closest('.platform-toggle button');
        if (toggleButton) {
            const sectionElement = toggleButton.closest('[data-section]');
            const sectionName = sectionElement.dataset.section;
            const newPlatform = toggleButton.dataset.platform;

            if (activePlatforms[sectionName] !== newPlatform) {
                saveData(sectionName); // Save data from the old platform view
                activePlatforms[sectionName] = newPlatform; // Set the new active platform
                
                sectionElement.querySelector('.platform-toggle .active').classList.remove('active');
                toggleButton.classList.add('active');

                renderTable(sectionName); // Re-render the table for the new platform
                updateSortIndicators(sectionName);
            }
        }
        
        // Handle spinner clicks
        const spinner = event.target.closest('.spinner');
        if (spinner) {
            const input = spinner.closest('.number-input-wrapper').querySelector('input[type="number"]');
            if (input) {
                let value = parseFloat(input.value) || 0;
                const direction = spinner.dataset.step === 'up' ? 1 : -1;
                // Allow bigger steps for budget fields
                const stepAmount = (input.name === 'resultados') ? 1 : (event.shiftKey ? 10 : 1);
                value += direction * stepAmount;
                if (value < 0) value = 0;
                input.value = (input.name === 'resultados') ? Math.round(value) : value.toFixed(2);
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    });

    // Handle platform status toggle changes
    document.getElementById('campaign-dashboard').addEventListener('change', function(event) {
        if (event.target.matches('.platform-status input[type="checkbox"]')) {
            const checkbox = event.target;
            const row = checkbox.closest('tr');
            const sectionElement = checkbox.closest('[data-section]');
            const sectionName = sectionElement.dataset.section;
            const platform = checkbox.dataset.platform;
            const modelIndex = Array.from(row.parentElement.children).indexOf(row);
            
            // Update data only for the active platform
            campaignData[sectionName][modelIndex][platform].isActive = checkbox.checked;
            
            // Update visual status
            const statusContainer = checkbox.closest('.platform-status');
            const label = statusContainer.querySelector('span[title*="Status para"]');
            if (label) {
                label.className = checkbox.checked ? 'status-active' : 'status-inactive';
            }
            
            // Show feedback
            const modelName = campaignData[sectionName][modelIndex].name;
            const platformName = platform === 'google' ? 'Google Ads' : 'Meta Ads';
            const status = checkbox.checked ? 'ativada' : 'desativada';
            
            const feedbackMsg = document.createElement('div');
            feedbackMsg.className = `fixed top-4 right-4 ${checkbox.checked ? 'bg-green-500' : 'bg-orange-500'} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300`;
            feedbackMsg.textContent = `${platformName} ${status} para ${modelName}`;
            document.body.appendChild(feedbackMsg);
            
            setTimeout(() => {
                feedbackMsg.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(feedbackMsg)) {
                        document.body.removeChild(feedbackMsg);
                    }
                }, 300);
            }, 2000);
        }
    });

    // Listener for input changes to trigger real-time calculations
    document.getElementById('campaign-dashboard').addEventListener('input', function(event) {
        if (event.target.matches('.metric-input')) {
            const currentRow = event.target.closest('tr');
            if (currentRow) {
                // If the user changes the daily budget, we should NOT recalculate it from total
                // Only recalculate daily if the total is the source of the change.
                if (event.target.name !== 'orcamentoDiario') {
                     calculateMetrics(currentRow);
                } else {
                    // if daily is changed, just update weekly
                    const dailyValue = parseFloat(event.target.value) || 0;
                    const weeklyOutput = currentRow.querySelector('[name="orcamentoSemanal"]');
                    weeklyOutput.value = `R$ ${(dailyValue * 7).toFixed(2)}`;
                }
            }
        }
    });

    // --- MODAL EVENT LISTENERS ---
    
    // Close modal events
    closeModalBtn.addEventListener('click', closeAddModelModal);
    cancelBtn.addEventListener('click', closeAddModelModal);
    
    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAddModelModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeAddModelModal();
        }
    });
    
    // Handle form submission
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!currentSection) return;
        
        const formData = new FormData(modalForm);
        const modelName = document.getElementById('modelName').value.trim();
        const dailyBudget = parseFloat(document.getElementById('dailyBudget').value) || 0;
        const desiredResults = parseInt(document.getElementById('desiredResults').value) || 0;
        const observations = document.getElementById('observations').value.trim();
        const googleActive = document.getElementById('googleActive').checked;
        const metaActive = document.getElementById('metaActive').checked;
        
        if (!modelName) {
            alert('Por favor, insira o nome do modelo.');
            return;
        }
        
        if (!googleActive && !metaActive) {
            alert('Por favor, ative pelo menos uma plataforma (Google ou Meta).');
            return;
        }
        
        const totalBudget = dailyBudget * 30; // Calculate total from daily
        
        const newModel = {
            name: modelName,
            google: {
                orcamentoDiario: dailyBudget,
                orcamentoTotal: totalBudget,
                resultados: desiredResults,
                observacoes: observations,
                isActive: googleActive
            },
            meta: {
                orcamentoDiario: dailyBudget,
                orcamentoTotal: totalBudget,
                resultados: desiredResults,
                observacoes: observations,
                isActive: metaActive
            }
        };
        
        campaignData[currentSection].push(newModel);
        renderTable(currentSection);
        updateSortIndicators(currentSection);
        closeAddModelModal();
        
        // Success feedback
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        successMsg.textContent = `Modelo "${modelName}" adicionado com sucesso!`;
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(successMsg);
            }, 300);
        }, 3000);
    });

    // --- INITIAL RENDER ---
    renderTable('kia');
    renderTable('suzuki');
    renderTable('zontes');
    renderTable('haojue');
    
    // Set initial sort indicators
    updateSortIndicators('kia');
    updateSortIndicators('suzuki');
    updateSortIndicators('zontes');
    updateSortIndicators('haojue');
}); 