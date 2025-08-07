document.addEventListener('DOMContentLoaded', () => {
    // --- UTILITY FUNCTIONS ---
    
    const normalizeGoogleAdsData = (data) => {
        return data.map(row => {
            // A "fórmula" corrigida: uma função interna para limpar e converter valores de forma segura
            const cleanValue = (value) => {
                // Se o valor já for um número, retorna ele mesmo, sem alterações.
                if (typeof value === 'number') {
                    return value; 
                }
                // Se o valor for um texto (string), ele faz a conversão correta.
                if (typeof value === 'string') {
                    // Remove os pontos de milhar e substitui a vírgula decimal por ponto.
                    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
                }
                // Retorna 0 para qualquer outro caso (null, undefined, etc.)
                return 0; 
            };

            // Aplica a fórmula corrigida a cada métrica necessária.
            return {
                "Nome da campanha": row["Campanha"] || row["Nome da campanha"] || "",
                "Valor usado (BRL)": cleanValue(row["Custo"] || row["Valor usado (BRL)"]),
                "Resultados": cleanValue(row["Conversões"] || row["Resultados"]),
                "Custo por resultados": 0, // Will be calculated later
                "Cliques no link": cleanValue(row["Cliques"] || row["Cliques no link"] || row["Interações"]),
                "CPC (custo por clique no link) (BRL)": 0, // Will be calculated later
                "Impressões": cleanValue(row["Impr."] || row["Impressões"])
            };
        });
    };

    const processCampaignData = (data, platform = 'meta') => {
        const normalizedData = platform === 'google' ? normalizeGoogleAdsData(data) : data;
        const campaignMap = new Map();
        
        normalizedData
            .filter(row => row && row["Nome da campanha"]) // Just check if campaign name exists
            .forEach(row => {
                const name = row["Nome da campanha"];
                if (!name) return;
                
                const campaign = {
                    name: name,
                    spend: row["Valor usado (BRL)"] || 0,
                    results: row["Resultados"] || 0,
                    clicks: row["Cliques no link"] || 0,
                    impressions: row["Impressões"] || 0,
                };
                
                campaign.cpr = campaign.results > 0 ? campaign.spend / campaign.results : 0;
                campaign.cpc = campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0;
                
                if (campaignMap.has(name)) {
                    const existing = campaignMap.get(name);
                    existing.spend += campaign.spend;
                    existing.results += campaign.results;
                    existing.clicks += campaign.clicks;
                    existing.impressions += campaign.impressions;
                } else {
                    campaignMap.set(name, campaign);
                }
            });
        
        campaignMap.forEach(campaign => {
            campaign.cpr = campaign.results > 0 ? campaign.spend / campaign.results : 0;
            campaign.cpc = campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0;
        });

        return campaignMap;
    };

    /* @tweakable minimum percentage change to show color indicators */
    const MIN_CHANGE_THRESHOLD = 0.1;

    /**
     * Formata um número grande, abreviando para 'k' (mil) ou 'M' (milhão).
     * @param {number} num O número a ser formatado.
     * @returns {string} O número formatado como string.
     */
    const formatNumber = (num) => {
        if (num >= 1000000) {
            // Divide por 1 milhão e formata com até 2 casas decimais
            return parseFloat((num / 1000000).toFixed(2)) + 'M';
        }
        if (num >= 1000) {
            // Divide por 1 mil e formata com até 1 casa decimal
            return parseFloat((num / 1000).toFixed(1)) + 'k';
        }
        // Para números menores que 1000, formata com até 1 casa decimal
        return parseFloat(num.toFixed(1));
    };

    const createIndicator = (current, previous, lowerIsBetter = false) => {
        if (previous === 0) {
            return current > 0 ? `<span class="indicator-new">Novo</span>` : '<span>-</span>';
        }
        if (current === 0 && previous > 0) {
             return `<span class="indicator-negative">▼ -100.0%</span>`;
        }

        const change = ((current - previous) / previous) * 100;
        if (Math.abs(change) < MIN_CHANGE_THRESHOLD) {
            return `<span class="text-gray-500 font-semibold">● 0.0%</span>`;
        }

        // USA A NOVA FUNÇÃO DE FORMATAÇÃO AQUI
        const formattedPercentage = formatNumber(Math.abs(change));

        const icon = change >= 0 ? '▲' : '▼';
        const isGoodChange = lowerIsBetter ? change < 0 : change > 0;
        
        // Simplified and corrected color logic
        const indicatorClass = isGoodChange ? 'indicator-positive' : 'indicator-negative';
        
        return `<span class="font-semibold ${indicatorClass}">${icon} ${formattedPercentage}%</span>`;
    };
    
    const getValueColorClass = (current, previous, lowerIsBetter = false) => {
        if (previous === 0 || Math.abs(current - previous) < 0.01) return 'text-gray-900';
        
        const isGoodChange = lowerIsBetter ? current < previous : current > previous;
        return isGoodChange ? 'text-green-600' : 'text-red-600';
    };
    
    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const generateSummaryCards = (julyTotals, semesterAvgTotals, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const cards = [
            { 
                label: 'Valor Investido',
                julyValue: julyTotals.spend,
                prevValue: semesterAvgTotals.spend,
                formatter: formatCurrency,
                lowerIsBetter: true 
            },
            { 
                label: 'Resultados',
                julyValue: julyTotals.results,
                prevValue: semesterAvgTotals.results,
                formatter: (val) => val.toFixed(0),
                lowerIsBetter: false
            },
            { 
                label: 'Custo por Resultado',
                julyValue: julyTotals.cpr,
                prevValue: semesterAvgTotals.cpr,
                formatter: formatCurrency,
                lowerIsBetter: true
            },
            { 
                label: 'Cliques',
                julyValue: julyTotals.clicks,
                prevValue: semesterAvgTotals.clicks,
                formatter: (val) => val.toFixed(0),
                lowerIsBetter: false
            },
        ];

        let html = '';
        cards.forEach(card => {
            const valueColorClass = getValueColorClass(card.julyValue, card.prevValue, card.lowerIsBetter);
            html += `
                <div class="bg-white p-5 rounded-xl shadow text-center border border-gray-200 flex flex-col justify-between">
                    <div>
                        <p class="text-sm font-semibold text-gray-600 mb-1">${card.label}</p>
                        <p class="text-3xl font-bold ${valueColorClass}">${card.formatter(card.julyValue)}</p>
                    </div>
                    <div class="mt-2">
                        ${createIndicator(card.julyValue, card.prevValue, card.lowerIsBetter)}
                        <div class="text-xs text-gray-500 mt-1">vs ${card.formatter(card.prevValue)}</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    };

    const createComparisonSection = (config) => {
        const { title, data, ids, platform } = config;
        const { summaryContainerId, tableContainerId } = ids;
        const tableBody = document.getElementById(tableContainerId);
        
        if (!data.semester || !data.july) {
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="7" class="text-center py-16 text-red-500">Dados não encontrados para esta seção.</td></tr>';
            }
            return;
        }

        const julyCampaigns = processCampaignData(data.july, platform);
        const prevCampaignsAgg = processCampaignData(data.semester, platform);
        
        const julyTotals = { spend: 0, results: 0, clicks: 0 };
        julyCampaigns.forEach(c => {
            julyTotals.spend += c.spend;
            julyTotals.results += c.results;
            julyTotals.clicks += c.clicks;
        });
        julyTotals.cpr = julyTotals.results > 0 ? julyTotals.spend / julyTotals.results : 0;

        const semesterTotals = { spend: 0, results: 0, clicks: 0 };
        prevCampaignsAgg.forEach(c => {
            semesterTotals.spend += c.spend;
            semesterTotals.results += c.results;
            semesterTotals.clicks += c.clicks;
        });

        const SEMESTER_MONTHS = 6;
        const semesterAvgTotals = {
            spend: semesterTotals.spend / SEMESTER_MONTHS,
            results: semesterTotals.results / SEMESTER_MONTHS,
            clicks: semesterTotals.clicks / SEMESTER_MONTHS,
        };
        semesterAvgTotals.cpr = semesterAvgTotals.results > 0 ? semesterAvgTotals.spend / semesterAvgTotals.results : 0;

        const prevCampaignsAvg = new Map();
        prevCampaignsAgg.forEach((value, key) => {
            prevCampaignsAvg.set(key, {
                ...value,
                spend: value.spend / SEMESTER_MONTHS,
                results: value.results / SEMESTER_MONTHS,
                clicks: value.clicks / SEMESTER_MONTHS,
                impressions: value.impressions / SEMESTER_MONTHS,
                cpr: (value.results > 0 ? (value.spend / SEMESTER_MONTHS) / (value.results / SEMESTER_MONTHS) : 0),
                cpc: (value.clicks > 0 ? (value.spend / SEMESTER_MONTHS) / (value.clicks / SEMESTER_MONTHS) : 0),
            });
        });
        
        generateSummaryCards(julyTotals, semesterAvgTotals, summaryContainerId);

        if (!tableBody) return;

        let html = '';
        const campaignsInJuly = new Set();

        julyCampaigns.forEach((july, name) => {
            campaignsInJuly.add(name);
            const prev = prevCampaignsAvg.get(name) || { spend: 0, results: 0, cpr: 0, clicks: 0, cpc: 0, impressions: 0 };

            html += `
                <tr class="data-row">
                    <td class="td-style campaign-name-cell">${name}</td>
                    <td class="td-style text-right">
                        <div>${formatCurrency(july.spend)}</div>
                        <div class="text-xs text-gray-500">vs ${formatCurrency(prev.spend)}</div>
                        ${createIndicator(july.spend, prev.spend, true)}
                    </td>
                    <td class="td-style text-right">
                        <div>${july.results.toFixed(0)}</div>
                        <div class="text-xs text-gray-500">vs ${prev.results.toFixed(0)}</div>
                        ${createIndicator(july.results, prev.results)}
                    </td>
                    <td class="td-style text-right">
                        <div>${formatCurrency(july.cpr)}</div>
                        <div class="text-xs text-gray-500">vs ${formatCurrency(prev.cpr)}</div>
                        ${createIndicator(july.cpr, prev.cpr, true)}
                    </td>
                    <td class="td-style text-right">
                        <div>${july.clicks.toFixed(0)}</div>
                        <div class="text-xs text-gray-500">vs ${prev.clicks.toFixed(0)}</div>
                        ${createIndicator(july.clicks, prev.clicks)}
                    </td>
                    <td class="td-style text-right">
                        <div>${formatCurrency(july.cpc)}</div>
                        <div class="text-xs text-gray-500">vs ${formatCurrency(prev.cpc)}</div>
                        ${createIndicator(july.cpc, prev.cpc, true)}
                    </td>
                    <td class="td-style text-right">
                        <div>${july.impressions.toLocaleString('pt-BR')}</div>
                        <div class="text-xs text-gray-500">vs ${prev.impressions.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                        ${createIndicator(july.impressions, prev.impressions)}
                    </td>
                </tr>
            `;
        });
        
        html += `
            <tr class="separator-row">
                <td colspan="7">Campanhas Ativas no 1º Semestre (Não Ativas em Julho)</td>
            </tr>
        `;

        let oldCampaignsHtml = '';
        let oldCampaignsCount = 0;
        prevCampaignsAvg.forEach((prev, name) => {
            if (!campaignsInJuly.has(name)) {
                oldCampaignsCount++;
                oldCampaignsHtml += `
                    <tr class="data-row old-campaign-row">
                        <td class="td-style campaign-name-cell">${name}</td>
                        <td class="td-style text-right">${formatCurrency(prev.spend)}</td>
                        <td class="td-style text-right">${prev.results.toFixed(0)}</td>
                        <td class="td-style text-right">${formatCurrency(prev.cpr)}</td>
                        <td class="td-style text-right">${prev.clicks.toFixed(0)}</td>
                        <td class="td-style text-right">${formatCurrency(prev.cpc)}</td>
                        <td class="td-style text-right">${prev.impressions.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
                    </tr>
                `;
            }
        });

        if (oldCampaignsCount === 0) {
            oldCampaignsHtml = '<tr><td colspan="7" class="text-center py-4 text-gray-500 bg-gray-50">Nenhuma campanha exclusiva do período anterior.</td></tr>';
        }
        
        tableBody.innerHTML = html + oldCampaignsHtml;
    };

    // --- MAIN EXECUTION ---
    
    const reportConfigs = [
        { 
            title: "Kia Sun Motors - Meta Ads", 
            data: campaignData.kia.meta, 
            ids: { summaryContainerId: 'kia-meta-summary', tableContainerId: 'kia-meta-table' }, 
            platform: 'meta' 
        },
        { 
            title: "Kia Sun Motors - Google Ads", 
            data: campaignData.kia.google, 
            ids: { summaryContainerId: 'kia-google-summary', tableContainerId: 'kia-google-table' }, 
            platform: 'google' 
        },
        { 
            title: "Suzuki - Meta Ads", 
            data: campaignData.suzuki.meta, 
            ids: { summaryContainerId: 'suzuki-meta-summary', tableContainerId: 'suzuki-meta-table' }, 
            platform: 'meta' 
        },
        { 
            title: "Suzuki - Google Ads", 
            data: campaignData.suzuki.google, 
            ids: { summaryContainerId: 'suzuki-google-summary', tableContainerId: 'suzuki-google-table' }, 
            platform: 'google' 
        },
        { 
            title: "Haojue - Meta Ads", 
            data: campaignData.haojue.meta, 
            ids: { summaryContainerId: 'haojue-meta-summary', tableContainerId: 'haojue-meta-table' }, 
            platform: 'meta' 
        },
        { 
            title: "Haojue - Google Ads", 
            data: campaignData.haojue.google, 
            ids: { summaryContainerId: 'haojue-google-summary', tableContainerId: 'haojue-google-table' }, 
            platform: 'google' 
        },
        { 
            title: "Zontes - Meta Ads", 
            data: campaignData.zontes.meta, 
            ids: { summaryContainerId: 'zontes-meta-summary', tableContainerId: 'zontes-meta-table' }, 
            platform: 'meta' 
        },
        { 
            title: "Zontes - Google Ads", 
            data: campaignData.zontes.google, 
            ids: { summaryContainerId: 'zontes-google-summary', tableContainerId: 'zontes-google-table' }, 
            platform: 'google' 
        }
    ];

    reportConfigs.forEach(config => createComparisonSection(config));
});