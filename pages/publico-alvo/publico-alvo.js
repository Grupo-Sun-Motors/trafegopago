// Dados dos veículos KIA
const kiaData = [
    {
        modelo: "Sportage",
        segmento: "SUV Médio",
        faixaIdade: "30-50 anos",
        genero: "Ambos",
        publicoAlvo: "Famílias modernas, profissionais liberais, consumidores que buscam design, tecnologia e segurança.",
        perfilClientes: "Profissionais de média renda, famílias em crescimento",
        desejosOcultos: "Status social, sensação de segurança e proteção da família, tecnologia que impressiona"
    },
    {
        modelo: "Niro",
        segmento: "SUV Compacto Híbrido",
        faixaIdade: "25-45 anos",
        genero: "Ambos",
        publicoAlvo: "Consumidores ecologicamente conscientes, moradores de centros urbanos que buscam economia e tecnologia.",
        perfilClientes: "Jovens executivos, casais conscientes ambientalmente",
        desejosOcultos: "Consciência ambiental como diferencial social, economia sem abrir mão do status"
    },
    {
        modelo: "Stonic",
        segmento: "SUV Compacto Híbrido",
        faixaIdade: "22-35 anos",
        genero: "Ambos",
        publicoAlvo: "Jovens, casais sem filhos, pessoas que procuram um carro urbano, econômico e com estilo.",
        perfilClientes: "Jovens profissionais, primeiro SUV, lifestyle urbano",
        desejosOcultos: "Ser jovem e moderno, destacar-se no trânsito urbano, eficiência sem parecer básico"
    },
    {
        modelo: "Carnival",
        segmento: "Minivan de Luxo",
        faixaIdade: "35-55 anos",
        genero: "Ambos",
        publicoAlvo: "Famílias grandes, executivos, empresas de transporte de luxo.",
        perfilClientes: "Famílias numerosas, empresários, frotistas premium",
        desejosOcultos: "Conforto máximo para a família, praticidade sem abrir mão do luxo"
    },
    {
        modelo: "EV6",
        segmento: "Crossover Elétrico",
        faixaIdade: "30-50 anos",
        genero: "Ambos",
        publicoAlvo: "Entusiastas de tecnologia, alta renda, adeptos da mobilidade elétrica com foco em performance.",
        perfilClientes: "Early adopters, alta renda, tech enthusiasts",
        desejosOcultos: "Ser pioneiro em tecnologia, status de inovador, performance sem culpa ambiental"
    },
    {
        modelo: "Bongo",
        segmento: "VUC (Veículo Urbano de Carga)",
        faixaIdade: "25-50 anos",
        genero: "Masculino",
        publicoAlvo: "Pequenos e médios empresários, frotistas, prestadores de serviços, autônomos.",
        perfilClientes: "Empreendedores, pequenos empresários, trabalhadores autônomos",
        desejosOcultos: "Independência financeira, crescimento do negócio, ferramenta de trabalho confiável"
    }
];

// Dados das motos Suzuki
const suzukiData = [
    {
        modelo: "GSX-8R",
        segmento: "Esportiva Carenada",
        faixaIdade: "25-40 anos",
        genero: "Masculino",
        publicoAlvo: "Motociclistas que buscam esportividade para ruas e estradas.",
        perfilClientes: "Motociclistas experientes, buscam performance",
        desejosOcultos: "Adrenalina e performance, sentir-se piloto de corrida na rua"
    },
    {
        modelo: "GSX-8S",
        segmento: "Naked",
        faixaIdade: "25-45 anos",
        genero: "Masculino",
        publicoAlvo: "Uso versátil (dia a dia/viagens curtas), conforto.",
        perfilClientes: "Motociclistas urbanos, uso diário e lazer",
        desejosOcultos: "Versatilidade e praticidade, moto para todas as ocasiões"
    },
    {
        modelo: "V-Strom 800DE",
        segmento: "Big Trail Adventure",
        faixaIdade: "30-50 anos",
        genero: "Masculino",
        publicoAlvo: "Aventureiros, viagens longas, off-road.",
        perfilClientes: "Aventureiros, viajantes de longa distância",
        desejosOcultos: "Espírito de aventura, escapar da rotina, explorar o desconhecido"
    },
    {
        modelo: "V-Strom 650",
        segmento: "Big Trail Crossover",
        faixaIdade: "28-48 anos",
        genero: "Ambos",
        publicoAlvo: "Viagens em asfalto, conforto e versatilidade.",
        perfilClientes: "Viajantes de estrada, touring confortável",
        desejosOcultos: "Liberdade de viajar, conforto em longas distâncias, confiabilidade"
    }
];

// Dados das motos Zontes
const zontesData = [
    {
        modelo: "E350 SCOOTER",
        segmento: "Scooter Urbano",
        faixaIdade: "25-40 anos",
        genero: "Ambos",
        publicoAlvo: "Jovens urbanos que buscam praticidade e estilo para deslocamento na cidade.",
        perfilClientes: "Jovens urbanos, mobilidade prática e estilosa",
        desejosOcultos: "Praticidade urbana com estilo, destaque visual diferenciado"
    },
    {
        modelo: "S350",
        segmento: "Street/Naked",
        faixaIdade: "25-40 anos",
        genero: "Ambos",
        publicoAlvo: "Motociclistas que buscam design moderno e performance urbana.",
        perfilClientes: "Jovens que valorizam design arrojado e tecnologia",
        desejosOcultos: "Design futurista, tecnologia avançada, ser pioneiro em inovação"
    },
    {
        modelo: "TACTIC 400",
        segmento: "Adventure/Crossover",
        faixaIdade: "28-45 anos",
        genero: "Masculino",
        publicoAlvo: "Aventureiros urbanos que buscam versatilidade entre cidade e estrada.",
        perfilClientes: "Aventureiros urbanos, versatilidade cidade-estrada",
        desejosOcultos: "Espírito aventureiro, escapar da rotina urbana, versatilidade total"
    },
    {
        modelo: "T350 E T350X",
        segmento: "Touring/Crossover",
        faixaIdade: "28-42 anos",
        genero: "Ambos",
        publicoAlvo: "Motociclistas que buscam conforto para viagens e uso diário.",
        perfilClientes: "Viajantes urbanos, conforto e tecnologia",
        desejosOcultos: "Conforto em longas distâncias, tecnologia que impressiona"
    },
    {
        modelo: "V350",
        segmento: "Cruiser/Custom",
        faixaIdade: "30-45 anos",
        genero: "Masculino",
        publicoAlvo: "Amantes do estilo custom que buscam design diferenciado e conforto.",
        perfilClientes: "Enthusiasts do estilo custom, design único",
        desejosOcultos: "Estilo de vida diferenciado, posição relaxada, design que chama atenção (VAI VIR PEÇAS NOVAS)"
    }
];

// Dados das motos Haojue
const haojueData = [
    {
        modelo: "NK 150",
        segmento: "Trail de Entrada",
        faixaIdade: "18-35 anos",
        genero: "Masculino",
        publicoAlvo: "Iniciantes, trabalhadores, uso em terrenos mistos.",
        perfilClientes: "Trabalhadores, primeiro trail, uso misto",
        desejosOcultos: "Ferramenta de trabalho resistente, versatilidade para qualquer terreno"
    },
    {
        modelo: "DK 160",
        segmento: "Street Urbana",
        faixaIdade: "18-30 anos",
        genero: "Ambos",
        publicoAlvo: "Deslocamento urbano com design moderno e economia.",
        perfilClientes: "Jovens urbanos, primeira moto, mobilidade urbana",
        desejosOcultos: "Economia sem abrir mão do design, praticidade urbana moderna"
    },
    {
        modelo: "MASTER",
        segmento: "Custom de Entrada",
        faixaIdade: "25-45 anos",
        genero: "Masculino",
        publicoAlvo: "Amantes do estilo custom, moto acessível para passeios.",
        perfilClientes: "Enthusiasts do estilo custom, fins de semana",
        desejosOcultos: "Estilo de vida custom, relaxamento nos passeios, nostalgia"
    },
    {
        modelo: "DR 160",
        segmento: "Street Esportiva",
        faixaIdade: "18-28 anos",
        genero: "Masculino",
        publicoAlvo: "Jovens, motociclistas que buscam visual esportivo.",
        perfilClientes: "Jovens, primeira moto esportiva, visual agressivo",
        desejosOcultos: "Aparência esportiva, sentir-se mais velho/experiente, destaque visual"
    },
    {
        modelo: "DL 160",
        segmento: "Crossover de Entrada",
        faixaIdade: "20-35 anos",
        genero: "Ambos",
        publicoAlvo: "Design aventureiro para uso urbano e viagens curtas.",
        perfilClientes: "Aventureiros iniciantes, versatilidade urbana",
        desejosOcultos: "(LANÇAMENTO) Novidade em primeira mão, estilo aventureiro acessível"
    }
];

// Função para criar linha da tabela
function createTableRow(data, isEven = false) {
    const rowClass = isEven ? "bg-gray-50 border-b" : "bg-white border-b";
    return `
        <tr class="${rowClass}">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900">${data.modelo}</th>
            <td class="px-6 py-4">${data.segmento}</td>
            <td class="px-6 py-4">${data.faixaIdade}</td>
            <td class="px-6 py-4">${data.genero}</td>
            <td class="px-6 py-4">${data.publicoAlvo}</td>
            <td class="px-6 py-4">${data.perfilClientes}</td>
            <td class="px-6 py-4">${data.desejosOcultos}</td>
        </tr>
    `;
}

// Função para popular tabela
function populateTable(tableId, data) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (tbody) {
        tbody.innerHTML = data.map((item, index) => createTableRow(item, index % 2 === 1)).join('');
    }
}

// Função para inicializar a página
function initializePage() {
    // Popular tabelas
    populateTable('kia-table', kiaData);
    populateTable('suzuki-table', suzukiData);
    populateTable('zontes-table', zontesData);
    populateTable('haojue-table', haojueData);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializePage); 