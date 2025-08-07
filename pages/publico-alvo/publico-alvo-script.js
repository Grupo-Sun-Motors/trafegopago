/**
 * Lógica de renderização para a página de Público-Alvo.
 */

// Função para atualizar perfil dos clientes por marca
function updateBrandProfile(brandKey, profileData) {
    const brandProfileSections = {
        'kia': {
            container: document.querySelector('#kia .bg-gray-50'),
            demographics: {
                title: 'Demografia Principal',
                value: profileData.idade,
                description: profileData.localizacao
            },
            motivations: {
                title: 'Motivações',
                value: profileData.interesses.slice(0, 2).join(' e '),
                description: profileData.interesses.slice(2, 4).join(' e ') || 'Outros interesses'
            },
            behavior: {
                title: 'Comportamento',
                value: profileData.comportamentos[0] || 'Comportamento diverso',
                description: profileData.comportamentos.slice(1, 3).join(' e ') || 'Características variadas'
            }
        }
    };

    const section = brandProfileSections[brandKey];
    if (!section || !section.container) return;

    // Atualizar os cards dentro do container
    const cards = section.container.querySelectorAll('[class*="bg-"][class*="100"]');
    
    if (cards.length >= 3) {
        // Card de Demografia
        const demoCard = cards[0];
        const demoTitle = demoCard.querySelector('.font-semibold');
        const demoValue = demoCard.querySelector('.font-bold');
        const demoDesc = demoCard.querySelector('.text-sm:not(.font-semibold)');
        
        if (demoTitle) demoTitle.textContent = section.demographics.title;
        if (demoValue) demoValue.textContent = section.demographics.value;
        if (demoDesc) demoDesc.textContent = section.demographics.description;

        // Card de Motivações
        const motivCard = cards[1];
        const motivTitle = motivCard.querySelector('.font-semibold');
        const motivValue = motivCard.querySelector('.font-bold');
        const motivDesc = motivCard.querySelector('.text-sm:not(.font-semibold)');
        
        if (motivTitle) motivTitle.textContent = section.motivations.title;
        if (motivValue) motivValue.textContent = section.motivations.value;
        if (motivDesc) motivDesc.textContent = section.motivations.description;

        // Card de Comportamento
        const behaviorCard = cards[2];
        const behaviorTitle = behaviorCard.querySelector('.font-semibold');
        const behaviorValue = behaviorCard.querySelector('.font-bold');
        const behaviorDesc = behaviorCard.querySelector('.text-sm:not(.font-semibold)');
        
        if (behaviorTitle) behaviorTitle.textContent = section.behavior.title;
        if (behaviorValue) behaviorValue.textContent = section.behavior.value;
        if (behaviorDesc) behaviorDesc.textContent = section.behavior.description;
    }
}

// Função para atualizar perfis individuais de marcas (Suzuki, Zontes, Haojue)
function updateIndividualBrandProfile(brandKey, profileData) {
    const brandProfiles = {
        'suzuki': {
            selector: '.mb-8 .bg-gray-50',
            demographics: {
                age: profileData.idade,
                location: profileData.localizacao
            },
            motivations: {
                primary: profileData.interesses[0] || 'Performance',
                secondary: profileData.interesses.slice(1, 3).join(' e ') || 'Aventura'
            },
            behavior: {
                primary: profileData.comportamentos[0] || 'Movido pela paixão',
                secondary: profileData.comportamentos[1] || 'Conhecedor técnico'
            }
        },
        'zontes': {
            selector: '.mb-6 .bg-gray-50',
            demographics: {
                age: profileData.idade,
                location: profileData.localizacao
            },
            motivations: {
                primary: profileData.interesses[0] || 'Inovação',
                secondary: profileData.interesses.slice(1, 3).join(' e ') || 'Tecnologia'
            },
            behavior: {
                primary: profileData.comportamentos[0] || 'Early adopter',
                secondary: profileData.comportamentos[1] || 'Formador de tendências'
            }
        },
        'haojue': {
            selector: '.mb-6 .bg-red-50',
            demographics: {
                age: profileData.idade,
                location: profileData.localizacao
            },
            motivations: {
                primary: profileData.interesses[0] || 'Economia',
                secondary: profileData.interesses.slice(1, 3).join(' e ') || 'Durabilidade'
            },
            behavior: {
                primary: profileData.comportamentos[0] || 'Extremamente prático',
                secondary: profileData.comportamentos[1] || 'Consciente do orçamento'
            }
        }
    };

    const brandConfig = brandProfiles[brandKey];
    if (!brandConfig) return;

    const container = document.querySelector(`#suzuki ${brandConfig.selector}`);
    if (!container) return;

    const cards = container.querySelectorAll('[class*="bg-"][class*="100"]:not(.bg-gray-50):not(.bg-red-50)');
    
    if (cards.length >= 3) {
        // Demografia Principal
        const demoCard = cards[0];
        const demoValue = demoCard.querySelector('.font-bold');
        const demoDesc = demoCard.querySelector('.text-sm:not(.font-semibold)');
        if (demoValue) demoValue.textContent = brandConfig.demographics.age;
        if (demoDesc) demoDesc.textContent = brandConfig.demographics.location;

        // Motivações
        const motivCard = cards[1];
        const motivValue = motivCard.querySelector('.font-bold');
        const motivDesc = motivCard.querySelector('.text-sm:not(.font-semibold)');
        if (motivValue) motivValue.textContent = brandConfig.motivations.primary;
        if (motivDesc) motivDesc.textContent = brandConfig.motivations.secondary;

        // Comportamento
        const behaviorCard = cards[2];
        const behaviorValue = behaviorCard.querySelector('.font-bold');
        const behaviorDesc = behaviorCard.querySelector('.text-sm:not(.font-semibold)');
        if (behaviorValue) behaviorValue.textContent = brandConfig.behavior.primary;
        if (behaviorDesc) behaviorDesc.textContent = brandConfig.behavior.secondary;
    }
}

// Função para atualizar o perfil geral da seção Suzuki (que inclui todas as 3 marcas)
function updateSuzukiGeneralProfile() {
    const container = document.querySelector('#suzuki .mb-8 .bg-gray-50');
    if (!container) return;

    const cards = container.querySelectorAll('[class*="bg-"][class*="100"]');
    
    if (cards.length >= 3) {
        // Card de Demografia - usar dados combinados das 3 marcas
        const demoCard = cards[0];
        const demoValue = demoCard.querySelector('.font-bold');
        const demoDesc = demoCard.querySelector('.text-sm:not(.font-semibold)');
        
        if (demoValue) demoValue.textContent = 'Homens de 18-50 anos';
        if (demoDesc) demoDesc.textContent = 'Motociclistas e aventureiros';

        // Card de Motivações
        const motivCard = cards[1];
        const motivValue = motivCard.querySelector('.font-bold');
        const motivDesc = motivCard.querySelector('.text-sm:not(.font-semibold)');
        
        if (motivValue) motivValue.textContent = 'Adrenalina e Liberdade';
        if (motivDesc) motivDesc.textContent = 'Performance e estilo de vida';

        // Card de Comportamento
        const behaviorCard = cards[2];
        const behaviorValue = behaviorCard.querySelector('.font-bold');
        const behaviorDesc = behaviorCard.querySelector('.text-sm:not(.font-semibold)');
        
        if (behaviorValue) behaviorValue.textContent = 'Enthusiasts';
        if (behaviorDesc) behaviorDesc.textContent = 'Valorizam performance e design';
    }
}

// Função para criar uma linha de tabela
function createTableRow(audience) {
    return `
        <tr class="bg-white border-b hover:bg-gray-50 cursor-pointer group">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <span onclick="showModelDetails('${audience.id}')">${audience.modelo}</span>
            </th>
            <td class="px-6 py-4" onclick="showModelDetails('${audience.id}')">
                ${getSegmento(audience.modelo)}
            </td>
            <td class="px-6 py-4" onclick="showModelDetails('${audience.id}')">
                ${audience.idade}
            </td>
            <td class="px-6 py-4" onclick="showModelDetails('${audience.id}')">
                ${audience.genero}
            </td>
            <td class="px-6 py-4">
                <button onclick="editModelData('${audience.id}')" class="text-gray-400 hover:text-blue-600 transition-all" title="Editar modelo">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </button>
            </td>
        </tr>
    `;
}

// Função para determinar o segmento baseado no modelo
function getSegmento(modelo) {
    const segmentos = {
        // KIA
        'Kia Bongo': 'Utilitário',
        'Kia Carnival': 'Van/SUV',
        'Kia EV5': 'SUV Elétrico',
        'Kia Niro': 'SUV Híbrido',
        'Kia Sportage': 'SUV',
        'Kia Stonic': 'SUV Compacto',
        
        // Suzuki
        'Suzuki GSX-8R': 'Esportiva',
        'Suzuki GSX-8S': 'Naked',
        'Suzuki V-Strom 650': 'Adventure',
        'Suzuki V-Strom 800 DE': 'Adventure',
        
        // Haojue
        'Haojue DK160 / DL160 / DR160': 'Street',
        'Haojue Master Ride 150': 'Custom',
        'Haojue NK150': 'Naked',
        
        // Zontes
        'Zontes E350 Scooter': 'Scooter',
        'Zontes GK350': 'Retrô',
        'Zontes R350': 'Naked',
        'Zontes S350': 'Cruiser',
        'Zontes T350 / T350x': 'Adventure',
        'Zontes Tactic 400': 'Naked',
        'Zontes V350': 'Naked'
    };
    
    return segmentos[modelo] || 'Não especificado';
}

// Função para popular uma tabela específica
function populateTable(tableId, brandAudiences) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    brandAudiences.forEach(audience => {
        tbody.innerHTML += createTableRow(audience);
    });
}

// Função para abrir sidemenu de perfil
function openProfileSidemenu(brandKey) {
    const title = document.getElementById('details-title');
    const content = document.getElementById('details-content');
    const sidemenu = document.getElementById('details-sidemenu');
    const overlay = document.getElementById('details-overlay');
    
    let profileData;
    let titleText;
    
    switch(brandKey) {
        case 'kia':
            profileData = marcas.kia;
            titleText = 'Perfil Completo - KIA';
            break;
        case 'suzuki':
            profileData = marcas.suzuki;
            titleText = 'Perfil Completo - Suzuki';
            break;
        case 'zontes':
            profileData = marcas.zontes;
            titleText = 'Perfil Completo - Zontes';
            break;
        case 'haojue':
            profileData = marcas.haojue;
            titleText = 'Perfil Completo - Haojue';
            break;
        case 'suzuki-general':
            titleText = 'Perfil Geral - Suzuki Motos';
            profileData = {
                nome: 'Perfil Geral das Motos',
                descricao: 'Consumidores de 18 a 50 anos, predominantemente homens, que veem a moto como símbolo de liberdade, performance e aventura.',
                idade: '18-50 anos',
                genero: 'Predominantemente Homem',
                localizacao: 'Centros urbanos e suburbanos',
                interesses: ['Alta Performance', 'Adrenalina', 'Liberdade', 'Aventura', 'Tecnologia'],
                comportamentos: ['Entusiastas apaixonados', 'Valorizam performance', 'Buscam experiências emocionantes', 'Investem em equipamentos de qualidade']
            };
            break;
        default:
            return;
    }
    
    if (!profileData) return;
    
    title.textContent = titleText;
    
    content.innerHTML = `
        <div class="space-y-6">
            <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">${profileData.nome}</h4>
                <p class="text-gray-700">${profileData.descricao}</p>
            </div>
            
            <div class="grid grid-cols-1 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h5 class="font-semibold text-gray-800 mb-2">Demografia</h5>
                    <p class="text-sm text-gray-700"><strong>Idade:</strong> ${profileData.idade}</p>
                    <p class="text-sm text-gray-700"><strong>Gênero:</strong> ${profileData.genero}</p>
                    <p class="text-sm text-gray-700"><strong>Localização:</strong> ${profileData.localizacao}</p>
                </div>
                
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h5 class="font-semibold text-blue-800 mb-2">Interesses</h5>
                    <ul class="space-y-1">
                        ${profileData.interesses.map(interesse => `<li class="text-sm text-blue-700">• ${interesse}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="bg-green-50 p-4 rounded-lg">
                    <h5 class="font-semibold text-green-800 mb-2">Comportamentos</h5>
                    <ul class="space-y-1">
                        ${profileData.comportamentos.map(comportamento => `<li class="text-sm text-green-700">• ${comportamento}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Show sidemenu
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    sidemenu.style.transform = 'translateX(0)';
}

// Função para mostrar detalhes do modelo
function showModelDetails(audienceId) {
    // Find the audience data
    let audienceData = null;
    let brandName = '';
    
    for (const [brand, audiences] of Object.entries(audiencias)) {
        const found = audiences.find(a => a.id === audienceId);
        if (found) {
            audienceData = found;
            brandName = brand.toUpperCase();
            break;
        }
    }
    
    if (!audienceData) return;
    
    const title = document.getElementById('details-title');
    const content = document.getElementById('details-content');
    const sidemenu = document.getElementById('details-sidemenu');
    const overlay = document.getElementById('details-overlay');
    
    title.textContent = `${audienceData.modelo} - ${brandName}`;
    
    content.innerHTML = `
        <div class="space-y-6">
            <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">${audienceData.nome}</h4>
                <p class="text-gray-700">${audienceData.descricao}</p>
            </div>
            
            <div class="grid grid-cols-1 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h5 class="font-semibold text-gray-800 mb-2">Informações Básicas</h5>
                    <p class="text-sm text-gray-700"><strong>Modelo:</strong> ${audienceData.modelo}</p>
                    <p class="text-sm text-gray-700"><strong>Segmento:</strong> ${getSegmento(audienceData.modelo)}</p>
                    <p class="text-sm text-gray-700"><strong>Idade:</strong> ${audienceData.idade}</p>
                    <p class="text-sm text-gray-700"><strong>Gênero:</strong> ${audienceData.genero}</p>
                    <p class="text-sm text-gray-700"><strong>Localização:</strong> ${audienceData.localizacao}</p>
                </div>
                
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h5 class="font-semibold text-blue-800 mb-2">Interesses</h5>
                    <ul class="space-y-1">
                        ${audienceData.interesses.map(interesse => `<li class="text-sm text-blue-700">• ${interesse}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="bg-green-50 p-4 rounded-lg">
                    <h5 class="font-semibold text-green-800 mb-2">Comportamentos</h5>
                    <ul class="space-y-1">
                        ${audienceData.comportamentos.map(comportamento => `<li class="text-sm text-green-700">• ${comportamento}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Show sidemenu
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    sidemenu.style.transform = 'translateX(0)';
}

// Função para fechar sidemenu
function closeSidemenu() {
    const sidemenu = document.getElementById('details-sidemenu');
    const overlay = document.getElementById('details-overlay');
    
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    sidemenu.style.transform = 'translateX(100%)';
}

// Função para toggle detalhes da tabela (mantida para compatibilidade)
function toggleTableDetails(brand) {
    // Esta função pode ser expandida no futuro se necessário
    console.log('Toggle table details for:', brand);
}

// Global variables for edit functionality
let currentEditType = null; // 'brand' or 'model'
let currentEditId = null;
let currentEditBrand = null;

// Function to edit brand profile
function editBrandProfile(brandKey) {
    const brandData = marcas[brandKey];
    if (!brandData) return;
    
    currentEditType = 'brand';
    currentEditId = brandKey;
    currentEditBrand = brandKey;
    
    const title = document.getElementById('edit-modal-title');
    const content = document.getElementById('edit-modal-content');
    const modal = document.getElementById('edit-modal');
    
    title.textContent = `Editar Perfil - ${brandKey.toUpperCase()}`;
    
    content.innerHTML = `
        <form id="edit-form" class="space-y-6">
            <div>
                <label for="edit-nome" class="block text-sm font-medium text-gray-700 mb-2">Nome do Perfil</label>
                <input type="text" id="edit-nome" name="nome" value="${brandData.nome}" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label for="edit-descricao" class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea id="edit-descricao" name="descricao" rows="4" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${brandData.descricao}</textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="edit-idade" class="block text-sm font-medium text-gray-700 mb-2">Faixa de Idade</label>
                    <input type="text" id="edit-idade" name="idade" value="${brandData.idade}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label for="edit-genero" class="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                    <input type="text" id="edit-genero" name="genero" value="${brandData.genero}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div>
                <label for="edit-localizacao" class="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                <input type="text" id="edit-localizacao" name="localizacao" value="${brandData.localizacao}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label for="edit-interesses" class="block text-sm font-medium text-gray-700 mb-2">Interesses (separados por vírgula)</label>
                <textarea id="edit-interesses" name="interesses" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${brandData.interesses.join(', ')}</textarea>
            </div>
            
            <div>
                <label for="edit-comportamentos" class="block text-sm font-medium text-gray-700 mb-2">Comportamentos (separados por vírgula)</label>
                <textarea id="edit-comportamentos" name="comportamentos" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${brandData.comportamentos.join(', ')}</textarea>
            </div>
        </form>
    `;
    
    // Show modal
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
}

// Function to edit model data
function editModelData(audienceId) {
    let audienceData = null;
    let brandKey = null;
    
    // Find the audience data
    for (const [brand, audiences] of Object.entries(audiencias)) {
        const found = audiences.find(a => a.id === audienceId);
        if (found) {
            audienceData = found;
            brandKey = brand;
            break;
        }
    }
    
    if (!audienceData) return;
    
    currentEditType = 'model';
    currentEditId = audienceId;
    currentEditBrand = brandKey;
    
    const title = document.getElementById('edit-modal-title');
    const content = document.getElementById('edit-modal-content');
    const modal = document.getElementById('edit-modal');
    
    title.textContent = `Editar Modelo - ${audienceData.modelo}`;
    
    content.innerHTML = `
        <form id="edit-form" class="space-y-6">
            <div>
                <label for="edit-nome" class="block text-sm font-medium text-gray-700 mb-2">Nome do Perfil</label>
                <input type="text" id="edit-nome" name="nome" value="${audienceData.nome}" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label for="edit-modelo" class="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                <input type="text" id="edit-modelo" name="modelo" value="${audienceData.modelo}" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label for="edit-descricao" class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea id="edit-descricao" name="descricao" rows="4" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${audienceData.descricao}</textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="edit-idade" class="block text-sm font-medium text-gray-700 mb-2">Faixa de Idade</label>
                    <input type="text" id="edit-idade" name="idade" value="${audienceData.idade}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label for="edit-genero" class="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                    <input type="text" id="edit-genero" name="genero" value="${audienceData.genero}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div>
                <label for="edit-localizacao" class="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                <input type="text" id="edit-localizacao" name="localizacao" value="${audienceData.localizacao}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label for="edit-interesses" class="block text-sm font-medium text-gray-700 mb-2">Interesses (separados por vírgula)</label>
                <textarea id="edit-interesses" name="interesses" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${audienceData.interesses.join(', ')}</textarea>
            </div>
            
            <div>
                <label for="edit-comportamentos" class="block text-sm font-medium text-gray-700 mb-2">Comportamentos (separados por vírgula)</label>
                <textarea id="edit-comportamentos" name="comportamentos" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${audienceData.comportamentos.join(', ')}</textarea>
            </div>
        </form>
    `;
    
    // Show modal
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
}

// Function to add new model
function addNewModel(brandKey) {
    currentEditType = 'model';
    currentEditId = 'new';
    currentEditBrand = brandKey;
    
    const title = document.getElementById('edit-modal-title');
    const content = document.getElementById('edit-modal-content');
    const modal = document.getElementById('edit-modal');
    
    title.textContent = `Adicionar Novo Modelo - ${brandKey.toUpperCase()}`;
    
    content.innerHTML = `
        <form id="edit-form" class="space-y-6">
            <div>
                <label for="edit-nome" class="block text-sm font-medium text-gray-700 mb-2">Nome do Perfil</label>
                <input type="text" id="edit-nome" name="nome" value="" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label for="edit-modelo" class="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                <input type="text" id="edit-modelo" name="modelo" value="" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label for="edit-descricao" class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea id="edit-descricao" name="descricao" rows="4" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="edit-idade" class="block text-sm font-medium text-gray-700 mb-2">Faixa de Idade</label>
                    <input type="text" id="edit-idade" name="idade" value=""
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label for="edit-genero" class="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                    <input type="text" id="edit-genero" name="genero" value=""
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div>
                <label for="edit-localizacao" class="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                <input type="text" id="edit-localizacao" name="localizacao" value=""
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label for="edit-interesses" class="block text-sm font-medium text-gray-700 mb-2">Interesses (separados por vírgula)</label>
                <textarea id="edit-interesses" name="interesses" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div>
                <label for="edit-comportamentos" class="block text-sm font-medium text-gray-700 mb-2">Comportamentos (separados por vírgula)</label>
                <textarea id="edit-comportamentos" name="comportamentos" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
        </form>
    `;
    
    // Show modal
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
}

// Function to close edit modal
function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    
    currentEditType = null;
    currentEditId = null;
    currentEditBrand = null;
}

// Function to save edit
function saveEdit() {
    const form = document.getElementById('edit-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {
        nome: formData.get('nome'),
        modelo: formData.get('modelo'),
        descricao: formData.get('descricao'),
        idade: formData.get('idade'),
        genero: formData.get('genero'),
        localizacao: formData.get('localizacao'),
        interesses: formData.get('interesses').split(',').map(s => s.trim()).filter(s => s),
        comportamentos: formData.get('comportamentos').split(',').map(s => s.trim()).filter(s => s),
        status: 'Ativo'
    };
    
    if (currentEditType === 'brand') {
        // Update brand data
        if (marcas[currentEditBrand]) {
            Object.assign(marcas[currentEditBrand], data);
        }
        
        // Update brand profiles
        if (currentEditBrand === 'kia') {
            updateBrandProfile('kia', marcas.kia);
        } else {
            updateIndividualBrandProfile(currentEditBrand, marcas[currentEditBrand]);
        }
        
    } else if (currentEditType === 'model') {
        if (currentEditId === 'new') {
            // Add new model
            const newId = `${currentEditBrand}-${data.modelo.toLowerCase().replace(/\s+/g, '-')}`;
            data.id = newId;
            
            if (!audiencias[currentEditBrand]) {
                audiencias[currentEditBrand] = [];
            }
            audiencias[currentEditBrand].push(data);
        } else {
            // Update existing model
            const audiences = audiencias[currentEditBrand];
            const index = audiences.findIndex(a => a.id === currentEditId);
            if (index !== -1) {
                Object.assign(audiences[index], data);
            }
        }
        
        // Refresh the appropriate table
        populateTable(`${currentEditBrand}-table`, audiencias[currentEditBrand]);
    }
    
    closeEditModal();
    
    // Show success message
    showNotification('Dados salvos com sucesso!', 'success');
}

// Function to show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 transform translate-x-full ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event listener for edit modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeEditModal();
            }
        });
    }
    
    // Event listener para fechar sidemenu ao clicar no overlay
    const overlay = document.getElementById('details-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidemenu);
    }
});

// Função principal para renderizar todas as tabelas
function renderPage() {
    console.log('Iniciando renderização da página...');
    console.log('Dados marcas:', marcas);
    console.log('Dados audiencias:', audiencias);
    
    // Verificar se os dados existem
    if (typeof marcas === 'undefined' || typeof audiencias === 'undefined') {
        console.error('Dados não carregados corretamente');
        return;
    }

    // Atualizar perfis das marcas usando dados dinâmicos
    if (marcas.kia) {
        console.log('Atualizando perfil KIA:', marcas.kia);
        updateBrandProfile('kia', marcas.kia);
    }
    
    // Atualizar perfil geral da seção Suzuki
    updateSuzukiGeneralProfile();
    
    if (marcas.suzuki) {
        console.log('Atualizando perfil Suzuki:', marcas.suzuki);
        updateIndividualBrandProfile('suzuki', marcas.suzuki);
    }
    
    if (marcas.zontes) {
        console.log('Atualizando perfil Zontes:', marcas.zontes);
        updateIndividualBrandProfile('zontes', marcas.zontes);
    }
    
    if (marcas.haojue) {
        console.log('Atualizando perfil Haojue:', marcas.haojue);
        updateIndividualBrandProfile('haojue', marcas.haojue);
    }

    // Popular tabela KIA
    if (audiencias.kia) {
        console.log('Populando tabela KIA com', audiencias.kia.length, 'itens');
        populateTable('kia-table', audiencias.kia);
    }
    
    // Popular tabela Suzuki
    if (audiencias.suzuki) {
        console.log('Populando tabela Suzuki com', audiencias.suzuki.length, 'itens');
        populateTable('suzuki-table', audiencias.suzuki);
    }
    
    // Popular tabela Zontes
    if (audiencias.zontes) {
        console.log('Populando tabela Zontes com', audiencias.zontes.length, 'itens');
        populateTable('zontes-table', audiencias.zontes);
    }
    
    // Popular tabela Haojue
    if (audiencias.haojue) {
        console.log('Populando tabela Haojue com', audiencias.haojue.length, 'itens');
        populateTable('haojue-table', audiencias.haojue);
    }
    
    console.log('Renderização concluída');
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando renderização...');
    // Pequeno delay para garantir que todos os scripts foram carregados
    setTimeout(renderPage, 100);
});

// Fallback para garantir que a função execute
window.addEventListener('load', function() {
    console.log('Window load event, verificando se renderização foi executada...');
    setTimeout(renderPage, 200);
});