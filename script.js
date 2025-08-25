// Dashboard JavaScript Logic
// Global chart instances
let chartInstances = {};

document.addEventListener('DOMContentLoaded', function() {
    updateKPICards();
    updateTables();
    updateCharts();
    initializeSortableTables();
});

// Helper functions
function parseValue(value) {
    if (typeof value === 'string') {
        return parseFloat(value.replace(',', '.'));
    }
    return value || 0;
}

function formatCurrency(value) {
    return `R$ ${value.toFixed(2)}`;
}

// Helper function to get platform icon
function getPlatformIcon(platform) {
    if (platform === 'Meta') {
        return `<svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>`;
    } else {
        return `<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>`;
    }
}

// Calculate KPIs
function calculateKPIs() {
    // KIA calculations (Meta + Google)
    const kiaMetaInvestment = metaAdsData.kia.reduce((sum, campaign) => sum + campaign["Valor usado (BRL)"], 0);
    const kiaMetaLeads = metaAdsData.kia.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const kiaGoogleInvestment = googleAdsData.kia.reduce((sum, campaign) => sum + parseValue(campaign["Custo"]), 0);
    const kiaGoogleLeads = googleAdsData.kia.reduce((sum, campaign) => sum + parseValue(campaign["Conversões"]), 0);
    
    const kiaTotalInvestment = kiaMetaInvestment + kiaGoogleInvestment;
    const kiaTotalLeads = kiaMetaLeads + kiaGoogleLeads;
    const kiaCPL = kiaTotalLeads > 0 ? kiaTotalInvestment / kiaTotalLeads : 0;

    // Suzuki + Others calculations (Meta + Google)
    const suzukiMetaInvestment = metaAdsData.suzuki.reduce((sum, campaign) => sum + campaign["Valor usado (BRL)"], 0);
    const suzukiMetaLeads = metaAdsData.suzuki.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const haojueMetaInvestment = metaAdsData.haojue.reduce((sum, campaign) => sum + campaign["Valor usado (BRL)"], 0);
    const haojueMetaLeads = metaAdsData.haojue.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const zontesMetaInvestment = metaAdsData.zontes.reduce((sum, campaign) => sum + campaign["Valor usado (BRL)"], 0);
    const zontesMetaLeads = metaAdsData.zontes.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const suzukiGoogleInvestment = googleAdsData.suzuki.reduce((sum, campaign) => sum + parseValue(campaign["Custo"]), 0);
    const suzukiGoogleLeads = googleAdsData.suzuki.reduce((sum, campaign) => sum + parseValue(campaign["Conversões"]), 0);

    const suzukiTotalInvestment = suzukiMetaInvestment + haojueMetaInvestment + zontesMetaInvestment + suzukiGoogleInvestment;
    const suzukiTotalLeads = suzukiMetaLeads + haojueMetaLeads + zontesMetaLeads + suzukiGoogleLeads;
    const suzukiCPL = suzukiTotalLeads > 0 ? suzukiTotalInvestment / suzukiTotalLeads : 0;

    return {
        kia: {
            investment: kiaTotalInvestment,
            leads: kiaTotalLeads,
            cpl: kiaCPL,
            conversionRate: 2.15 // This should be calculated dynamically
        },
        suzuki: {
            investment: suzukiTotalInvestment,
            leads: suzukiTotalLeads,
            cpl: suzukiCPL,
            conversionRate: 3.10 // This should be calculated dynamically
        }
    };
}

// Update KPI cards
function updateKPICards() {
    const kpis = calculateKPIs();

    // Update KIA KPIs
    const kiaKPICards = document.querySelectorAll('#kia .kpi-card');
    kiaKPICards[0].querySelector('.text-3xl').textContent = formatCurrency(kpis.kia.investment);
    kiaKPICards[1].querySelector('.text-3xl').textContent = Math.round(kpis.kia.leads).toString();
    kiaKPICards[2].querySelector('.text-3xl').textContent = formatCurrency(kpis.kia.cpl);
    kiaKPICards[3].querySelector('.text-3xl').textContent = kpis.kia.conversionRate.toFixed(2) + '%';

    // Update Suzuki KPIs
    const suzukiKPICards = document.querySelectorAll('#suzuki .kpi-card');
    suzukiKPICards[0].querySelector('.text-3xl').textContent = formatCurrency(kpis.suzuki.investment);
    suzukiKPICards[1].querySelector('.text-3xl').textContent = Math.round(kpis.suzuki.leads).toString();
    suzukiKPICards[2].querySelector('.text-3xl').textContent = formatCurrency(kpis.suzuki.cpl);
    suzukiKPICards[3].querySelector('.text-3xl').textContent = kpis.suzuki.conversionRate.toFixed(2) + '%';
}

// Sorting functionality
let sortStates = {
    kia: { column: null, direction: 'asc' },
    suzuki: { column: null, direction: 'asc' }
};

function initializeSortableTables() {
    // Add sort indicators to headers
    const tableHeaders = document.querySelectorAll('th[scope="col"]');
    tableHeaders.forEach(header => {
        if (header.textContent.trim() !== 'Fonte' && header.textContent.trim() !== 'Marca / Modelo' && header.textContent.trim() !== 'Modelo' && header.textContent.trim() !== 'Status') {
            header.style.cursor = 'pointer';
            header.style.position = 'relative';
            header.innerHTML += ' <span class="sort-indicator">⇅</span>';
            
            header.addEventListener('click', function() {
                const table = this.closest('table');
                const sectionId = this.closest('section').id;
                const columnIndex = Array.from(this.parentNode.children).indexOf(this);
                sortTable(table, columnIndex, sectionId, this);
            });
        }
    });
}

function sortTable(table, columnIndex, sectionId, headerElement) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => 
        !row.innerHTML.includes('colspan') // Skip brand headers
    );
    
    const currentSort = sortStates[sectionId] || { column: null, direction: 'asc' };
    
    // Toggle direction if same column, otherwise start with ascending
    if (currentSort.column === columnIndex) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.direction = 'asc';
    }
    currentSort.column = columnIndex;
    sortStates[sectionId] = currentSort;
    
    // Update sort indicators
    const allHeaders = table.querySelectorAll('th .sort-indicator');
    allHeaders.forEach(indicator => {
        indicator.textContent = '⇅';
        indicator.style.opacity = '0.5';
    });
    
    const currentIndicator = headerElement.querySelector('.sort-indicator');
    currentIndicator.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
    currentIndicator.style.opacity = '1';
    currentIndicator.style.color = '#2563eb';
    
    // Sort rows
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        let aValue, bValue;
        
        // Handle different data types
        if (aText.includes('R$')) {
            aValue = parseFloat(aText.replace('R$', '').replace(',', '.').trim());
            bValue = parseFloat(bText.replace('R$', '').replace(',', '.').trim());
        } else if (!isNaN(aText) && !isNaN(bText)) {
            aValue = parseFloat(aText);
            bValue = parseFloat(bText);
        } else {
            aValue = aText.toLowerCase();
            bValue = bText.toLowerCase();
        }
        
        if (currentSort.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    
    // Clear and repopulate tbody maintaining brand headers for suzuki
    if (sectionId === 'suzuki') {
        updateSuzukiTableSorted(rows);
    } else {
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    }
}

function updateSuzukiTableSorted(sortedRows) {
    const suzukiTableBody = document.querySelector('#suzuki tbody');
    suzukiTableBody.innerHTML = '';
    
    // Group rows by brand
    const brands = {
        'Suzuki': [],
        'Zontes': [],
        'Haojue': []
    };
    
    sortedRows.forEach(row => {
        const modelText = row.cells[1].textContent.trim(); // Updated index due to new Fonte column
        // Determine brand based on original data structure
        if (metaAdsData.suzuki.some(campaign => 
            campaign["Nome da campanha"].includes(modelText) || 
            campaign["Nome da campanha"].split('-').pop().trim() === modelText)) {
            brands['Suzuki'].push(row);
        } else if (metaAdsData.zontes.some(campaign => 
            campaign["Nome da campanha"].includes(modelText) || 
            modelText.includes('350') || modelText.includes('Tactic'))) {
            brands['Zontes'].push(row);
        } else {
            brands['Haojue'].push(row);
        }
    });
    
    // Rebuild table with brand headers
    Object.keys(brands).forEach(brandName => {
        if (brands[brandName].length > 0) {
            const headerRow = document.createElement('tr');
            const colorClass = brandName === 'Suzuki' ? 'bg-blue-50 text-blue-800' : 
                              brandName === 'Zontes' ? 'bg-gray-200 text-gray-800' : 
                              'bg-red-50 text-red-800';
            headerRow.className = `${colorClass} border-b`;
            headerRow.innerHTML = `<td colspan="7" class="px-6 py-3 font-bold">${brandName}</td>`;
            suzukiTableBody.appendChild(headerRow);
            
            brands[brandName].forEach(row => {
                suzukiTableBody.appendChild(row);
            });
        }
    });
}

// Update tables
function updateTables() {
    // Update KIA table
    const kiaTableBody = document.querySelector('#kia tbody');
    kiaTableBody.innerHTML = ''; // Clear existing static rows
    
    // Combine and process Kia data for the table
    const allKiaCampaigns = [
        ...metaAdsData.kia.map(c => ({...c, platform: 'Meta'})),
        ...googleAdsData.kia.map(c => ({...c, platform: 'Google'}))
    ];
    
    allKiaCampaigns.forEach((campaign, index) => {
        let modelName, investment, clicks, leads, cpl, status;

        if(campaign.platform === 'Meta') {
            modelName = campaign["Nome da campanha"].split('|').pop().trim();
            investment = campaign["Valor usado (BRL)"];
            clicks = campaign["Cliques no link"];
            leads = campaign["Resultados"];
            cpl = campaign["Custo por resultados"];
            status = 'Ativa'; // All campaigns are active based on provided data
        } else { // Google
            modelName = campaign["Campanha"].split(']').pop().trim();
            investment = parseValue(campaign["Custo"]);
            clicks = campaign["Cliques"];
            leads = parseValue(campaign["Conversões"]);
            cpl = parseValue(campaign["Custo / conv."]);
            status = 'Ativa'; // All campaigns are active
        }

        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'bg-white border-b' : 'bg-gray-50 border-b';
        row.innerHTML = `
            <td class="px-6 py-4">${getPlatformIcon(campaign.platform)}</td>
            <th scope="row" class="px-6 py-4 font-medium text-gray-900">${modelName}</th>
            <td class="px-6 py-4">${formatCurrency(investment)}</td>
            <td class="px-6 py-4">${clicks}</td>
            <td class="px-6 py-4">${Math.round(leads)}</td>
            <td class="px-6 py-4">${formatCurrency(cpl)}</td>
            <td class="px-6 py-4"><span class="status-badge status-active">${status}</span></td>
        `;
        kiaTableBody.appendChild(row);
    });

    // Update Suzuki table with both Meta and Google campaigns
    const suzukiTableBody = document.querySelector('#suzuki tbody');
    suzukiTableBody.innerHTML = ''; // Clear existing static rows
    
    // Prepare combined campaigns for all brands under Suzuki umbrella
    const allSuzukiCampaigns = [];
    
    // Add Suzuki Meta campaigns
    metaAdsData.suzuki.forEach(campaign => {
        allSuzukiCampaigns.push({
            ...campaign,
            platform: 'Meta',
            brand: 'Suzuki',
            modelName: campaign["Nome da campanha"].split('-').pop().trim()
        });
    });
    
    // Add Suzuki Google campaigns
    googleAdsData.suzuki.forEach(campaign => {
        const campName = campaign["Campanha"].toLowerCase();
        let brand = 'Suzuki';
        let modelName = campaign["Campanha"].split(']').pop().trim();
        
        // Determine brand based on campaign name
        if (campName.includes('haojue') || campName.includes('master ride') || campName.includes('dk') || campName.includes('dr') || campName.includes('nk')) {
            brand = 'Haojue';
        } else if (campName.includes('t 350') || campName.includes('v 350') || campName.includes('r350') || campName.includes('chopper')) {
            brand = 'Zontes';
        }
        
        allSuzukiCampaigns.push({
            ...campaign,
            platform: 'Google',
            brand: brand,
            modelName: modelName
        });
    });
    
    // Add Zontes Meta campaigns
    metaAdsData.zontes.forEach(campaign => {
        let modelName = campaign["Nome da campanha"];
        if (modelName.includes('V350')) {
            modelName = 'V350';
        } else if (modelName.includes('T350 e T350x')) {
            modelName = 'T350 / T350x';
        } else if (modelName.includes('Tactic 400')) {
            modelName = 'Tactic 400';
        } else if (modelName.includes('S350')) {
            modelName = 'S350';
        } else if (modelName.includes('EMPLACAMENTO')) {
            modelName = 'T350 Emplacamento';
        } else if (modelName.includes('E350 Scooter')) {
            modelName = 'E350 Scooter';
        } else {
            modelName = campaign["Nome da campanha"].split('-').pop().trim();
        }
        
        allSuzukiCampaigns.push({
            ...campaign,
            platform: 'Meta',
            brand: 'Zontes',
            modelName: modelName
        });
    });
    
    // Add Haojue Meta campaigns
    metaAdsData.haojue.forEach(campaign => {
        allSuzukiCampaigns.push({
            ...campaign,
            platform: 'Meta',
            brand: 'Haojue',
            modelName: campaign["Nome da campanha"].split('|').pop().trim()
        });
    });
    
    // Group by brand and create sections
    const brands = ['Suzuki', 'Zontes', 'Haojue'];
    brands.forEach(brandName => {
        const brandCampaigns = allSuzukiCampaigns.filter(c => c.brand === brandName);
        
        if (brandCampaigns.length > 0) {
            // Add brand header
            const headerRow = document.createElement('tr');
            const colorClass = brandName === 'Suzuki' ? 'bg-blue-50 text-blue-800' : 
                              brandName === 'Zontes' ? 'bg-gray-200 text-gray-800' : 
                              'bg-red-50 text-red-800';
            headerRow.className = `${colorClass} border-b`;
            headerRow.innerHTML = `<td colspan="7" class="px-6 py-3 font-bold">${brandName}</td>`;
            suzukiTableBody.appendChild(headerRow);
            
            // Add campaigns for this brand
            brandCampaigns.forEach((campaign, index) => {
                let investment, clicks, leads, cpl, status;
                
                if (campaign.platform === 'Meta') {
                    investment = campaign["Valor usado (BRL)"];
                    clicks = campaign["Cliques no link"];
                    leads = campaign["Resultados"];
                    cpl = campaign["Custo por resultados"];
                    status = 'Ativa'; // All campaigns are active based on provided data
                } else { // Google
                    investment = parseValue(campaign["Custo"]);
                    clicks = campaign["Cliques"];
                    leads = parseValue(campaign["Conversões"]);
                    cpl = parseValue(campaign["Custo / conv."]);
                    status = 'Ativa'; // All campaigns are active
                }
                
                const row = document.createElement('tr');
                row.className = index % 2 === 0 ? 'bg-white border-b' : 'bg-gray-50 border-b';
                row.innerHTML = `
                    <td class="px-6 py-4">${getPlatformIcon(campaign.platform)}</td>
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900">${campaign.modelName}</th>
                    <td class="px-6 py-4">${formatCurrency(investment)}</td>
                    <td class="px-6 py-4">${clicks}</td>
                    <td class="px-6 py-4">${Math.round(leads)}</td>
                    <td class="px-6 py-4">${formatCurrency(cpl)}</td>
                    <td class="px-6 py-4"><span class="status-badge status-active">${status}</span></td>
                `;
                suzukiTableBody.appendChild(row);
            });
        }
    });
}

// Update charts with real data
function updateCharts() {
    // Chart.js global configuration
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 14;
    Chart.defaults.color = '#6b7280';

    // Destroy existing chart instances
    Object.keys(chartInstances).forEach(key => {
        if (chartInstances[key]) {
            chartInstances[key].destroy();
            chartInstances[key] = null;
        }
    });

    // KIA Investment & Leads Chart
    const kiaInvestCtx = document.getElementById('kiaInvestChart').getContext('2d');
    const kiaLabels = metaAdsData.kia.map(campaign => campaign["Nome da campanha"].split('|').pop().trim());
    const kiaInvestments = metaAdsData.kia.map(campaign => campaign["Valor usado (BRL)"]);
    const kiaLeads = metaAdsData.kia.map(campaign => campaign["Resultados"]);
    
    chartInstances.kiaInvest = new Chart(kiaInvestCtx, {
        type: 'bar',
        data: {
            labels: kiaLabels,
            datasets: [{
                label: 'Investimento (R$)',
                data: kiaInvestments,
                backgroundColor: 'rgba(220, 38, 38, 0.6)',
                borderColor: 'rgba(220, 38, 38, 1)',
                borderWidth: 1,
                borderRadius: 8,
                yAxisID: 'y'
            }, {
                label: 'Leads',
                data: kiaLeads,
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
                borderRadius: 8,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Investimento: R$ ${context.raw.toFixed(2)}`;
                            } else {
                                return `Leads: ${context.raw}`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Investimento (R$)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Leads'
                    }
                }
            }
        }
    });

    // Suzuki Investment & Leads Chart (brands)
    const suzukiInvestCtx = document.getElementById('suzukiInvestChart').getContext('2d');
    const suzukiTotalInvestment = metaAdsData.suzuki.reduce((sum, campaign) => sum + campaign["Valor usado (BRL)"], 0);
    const suzukiTotalLeads = metaAdsData.suzuki.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const zontesTotalInvestment = metaAdsData.zontes.reduce((sum, campaign) => sum + campaign["Valor usado (BRL)"], 0);
    const zontesTotalLeads = metaAdsData.zontes.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const haojueTotalInvestment = metaAdsData.haojue.reduce((sum, campaign) => sum + campaign["Valor usado (BRL)"], 0);
    const haojueTotalLeads = metaAdsData.haojue.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    
    chartInstances.suzukiInvest = new Chart(suzukiInvestCtx, {
        type: 'bar',
        data: {
            labels: ['Suzuki', 'Zontes', 'Haojue'],
            datasets: [{
                label: 'Investimento (R$)',
                data: [suzukiTotalInvestment, zontesTotalInvestment, haojueTotalInvestment],
                backgroundColor: [
                    'rgba(37, 99, 235, 0.6)',
                    'rgba(107, 114, 128, 0.6)',
                    'rgba(190, 24, 24, 0.6)'
                ],
                borderColor: [
                    'rgba(37, 99, 235, 1)',
                    'rgba(107, 114, 128, 1)',
                    'rgba(190, 24, 24, 1)'
                ],
                borderWidth: 1,
                borderRadius: 8,
                yAxisID: 'y'
            }, {
                label: 'Leads',
                data: [suzukiTotalLeads, zontesTotalLeads, haojueTotalLeads],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(156, 163, 175, 0.6)',
                    'rgba(220, 38, 38, 0.6)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(156, 163, 175, 1)',
                    'rgba(220, 38, 38, 1)'
                ],
                borderWidth: 1,
                borderRadius: 8,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Investimento: R$ ${context.raw.toFixed(2)}`;
                            } else {
                                return `Leads: ${context.raw}`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Investimento (R$)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Leads'
                    }
                }
            }
        }
    });

    // Leads Over Time Chart (simulated weekly data)
    const leadsOverTimeCtx = document.getElementById('leadsOverTimeChart').getContext('2d');
    const kiaLeadsTotal = metaAdsData.kia.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const otherLeads = metaAdsData.suzuki.reduce((sum, campaign) => sum + campaign["Resultados"], 0) +
                         metaAdsData.haojue.reduce((sum, campaign) => sum + campaign["Resultados"], 0) +
                         metaAdsData.zontes.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    
    chartInstances.leadsOverTime = new Chart(leadsOverTimeCtx, {
        type: 'line',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            datasets: [{
                label: 'Kia',
                data: [Math.round(kiaLeadsTotal * 0.2), Math.round(kiaLeadsTotal * 0.3), Math.round(kiaLeadsTotal * 0.3), Math.round(kiaLeadsTotal * 0.2)],
                borderColor: 'rgba(220, 38, 38, 1)',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Suzuki & Outras',
                data: [Math.round(otherLeads * 0.2), Math.round(otherLeads * 0.3), Math.round(otherLeads * 0.3), Math.round(otherLeads * 0.2)],
                borderColor: 'rgba(37, 99, 235, 1)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Leads Distribution Chart
    const leadsDistributionCtx = document.getElementById('leadsDistributionChart').getContext('2d');
    const kiaLeadsTotalDist = metaAdsData.kia.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const suzukiLeadsTotal = metaAdsData.suzuki.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const zontesLeadsTotal = metaAdsData.zontes.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    const haojueLeadsTotal = metaAdsData.haojue.reduce((sum, campaign) => sum + campaign["Resultados"], 0);
    
    chartInstances.leadsDistribution = new Chart(leadsDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Kia', 'Suzuki', 'Zontes', 'Haojue'],
            datasets: [{
                label: 'Leads por Marca',
                data: [kiaLeadsTotalDist, suzukiLeadsTotal, zontesLeadsTotal, haojueLeadsTotal],
                backgroundColor: [
                    'rgba(220, 38, 38, 0.7)',
                    'rgba(37, 99, 235, 0.7)',
                    'rgba(107, 114, 128, 0.7)',
                    'rgba(190, 24, 24, 0.7)'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            }
        }
    });
}