// Bloco com o perfil geral de cada MARCA
const marcas = {
    "kia": {
        "id": "kia-geral",
        "nome": "O Aspiracional Inteligente",
        "modelo": "Visão Geral da Marca",
        "descricao": "Consumidor de 35 a 55 anos, classe média-alta, que faz uma compra racional mas não abre mão de design superior e tecnologia. Busca os atributos de uma marca de luxo sem o preço elevado.",
        "idade": "35-55 anos",
        "genero": "Homem ou Mulher",
        "localizacao": "Grandes centros urbanos",
        "interesses": ["Design Superior", "Tecnologia de Ponta", "Segurança Familiar", "Custo-benefício Premium"],
        "comportamentos": ["Planejador", "Pesquisa extensivamente online", "Valoriza a garantia longa (5 anos)", "Busca status de forma inteligente"],
        "status": "Ativo"
    },
    "suzuki": {
        "id": "suzuki-geral",
        "nome": "O Piloto Purista",
        "modelo": "Visão Geral da Marca",
        "descricao": "Motociclista entusiasta e experiente, de 30 a 50 anos, que vê a moto como uma paixão e parte de sua identidade. Valoriza performance, engenharia e a herança da marca nas pistas.",
        "idade": "30-50 anos",
        "genero": "Predominantemente Homem",
        "localizacao": "Urbana e suburbana",
        "interesses": ["Alta Performance", "Engenharia de Motores", "Viagens e Aventura", "Competições (MotoGP)"],
        "comportamentos": ["Movido pela paixão", "Conhecedor técnico", "Usa a moto como 'segundo veículo' para lazer", "Busca liberdade e adrenalina"],
        "status": "Ativo"
    },
    "haojue": {
        "id": "haojue-geral",
        "nome": "O Trabalhador Pragmático",
        "modelo": "Visão Geral da Marca",
        "descricao": "Consumidor de 20 a 45 anos que utiliza a moto como ferramenta de trabalho ou principal meio de transporte. A decisão é uma equação matemática de custo, consumo e manutenção.",
        "idade": "20-45 anos",
        "genero": "Homem",
        "localizacao": "Centros urbanos",
        "interesses": ["Economia de Combustível", "Baixo Custo de Manutenção", "Durabilidade", "Ferramentas de Trabalho"],
        "comportamentos": ["Extremamente prático", "Consciente do orçamento", "Avesso ao risco", "Busca a decisão financeira mais inteligente"],
        "status": "Ativo"
    },
    "zontes": {
        "id": "zontes-geral",
        "nome": "O Individualista Tecnológico",
        "modelo": "Visão Geral da Marca",
        "descricao": "'Early adopter' de 25 a 40 anos, fascinado por inovação e tecnologia. Valoriza a diferenciação e não tem medo de arriscar em uma nova marca para ter o que há de mais moderno.",
        "idade": "25-40 anos",
        "genero": "Predominantemente Homem",
        "localizacao": "Grandes centros urbanos",
        "interesses": ["Inovação", "Gadgets", "Tecnologia de Ponta", "Design Moderno e Agressivo"],
        "comportamentos": ["Early adopter", "Formador de tendências", "Busca diferenciação", "Quer possuir algo que gere conversa e curiosidade"],
        "status": "Ativo"
    }
};


const audiencias = {
    "kia": [
        {
            "id": "kia-bongo",
            "nome": "O Dono do Próprio Negócio",
            "modelo": "Kia Bongo",
            "descricao": "Pequeno empresário ou autônomo que vê o veículo como uma ferramenta de trabalho. É pragmático, focado em ROI e avesso ao risco, buscando durabilidade e baixo custo operacional.",
            "idade": "30-55 anos",
            "genero": "Homem",
            "localizacao": "Centros urbanos e áreas rurais",
            "interesses": ["Gestão de negócios", "Feiras de empreendedorismo", "Otimização de custos", "Logística urbana", "Agronegócio de pequeno porte"],
            "comportamentos": ["Focado em ROI", "Avesso ao risco", "Trabalha longas horas", "A compra é uma decisão de negócio", "Pesquisa durabilidade e custo de manutenção"],
            "status": "Ativo"
        },
        {
            "id": "kia-carnival",
            "nome": "O Chefe da Tribo",
            "modelo": "Kia Carnival",
            "descricao": "Pais com 3 ou mais filhos que tomam uma decisão racional para maximizar o conforto e a segurança da família. Valorizam o luxo prático e a qualidade construtiva.",
            "idade": "40-55 anos",
            "genero": "Homem ou Mulher",
            "localizacao": "Grandes cidades e condomínios",
            "interesses": ["Viagens em família", "Atividades de lazer com os filhos", "Tecnologia que facilita a vida", "Conforto e segurança automotiva"],
            "comportamentos": ["A família é o centro de tudo", "Decisão de compra em conjunto", "Busca por luxo prático", "Prioriza espaço e segurança"],
            "status": "Ativo"
        },
        {
            "id": "kia-ev5",
            "nome": "O Eco-Tecnológico Familiar",
            "modelo": "Kia EV5",
            "descricao": "Profissional de alta renda, ambientalmente consciente e 'early adopter' da mobilidade elétrica. A compra é uma declaração de valores e status, buscando design e inovação.",
            "idade": "35-50 anos",
            "genero": "Homem ou Mulher",
            "localizacao": "Capitais (São Paulo, Rio de Janeiro, Curitiba)",
            "interesses": ["Tecnologia", "Sustentabilidade", "Design minimalista", "Inovação", "Mercado financeiro", "Viagens"],
            "comportamentos": ["Early adopter", "Ambientalmente consciente", "Valoriza design e inovação", "Pesquisa a fundo sobre tecnologia de baterias", "A compra é uma declaração de valores"],
            "status": "Ativo"
        },
        {
            "id": "kia-niro",
            "nome": "O Consciente Urbano",
            "modelo": "Kia Niro",
            "descricao": "Profissional pragmático e analítico que busca reduzir seu impacto ambiental e custos com combustível, mas ainda não está pronto para um elétrico puro. É a transição segura.",
            "idade": "30-45 anos",
            "genero": "Homem ou Mulher",
            "localizacao": "Áreas urbanas densas",
            "interesses": ["Sustentabilidade prática", "Tecnologia", "Finanças pessoais", "Vida urbana", "Ciclismo"],
            "comportamentos": ["Pragmático e analítico", "Busca escolhas ecologicamente responsáveis", "Calculista", "Busca eficiência sem sacrificar a conveniência"],
            "status": "Ativo"
        },
        {
            "id": "kia-sportage",
            "nome": "O Aspiracional Inteligente",
            "modelo": "Kia Sportage",
            "descricao": "Consumidor que valoriza imagem e status, mas de forma sutil. A compra é emocional (baseada no design), mas justificada com argumentos racionais (garantia, equipamentos).",
            "idade": "35-50 anos",
            "genero": "Homem ou Mulher",
            "localizacao": "Grandes e médias cidades",
            "interesses": ["Design", "Tecnologia", "Viagens em família", "Gastronomia", "Redes sociais (Instagram)"],
            "comportamentos": ["Valoriza a imagem e o status", "Justifica a emoção com a razão", "Busca por um carro que impressione", "Influenciado pelo design"],
            "status": "Ativo"
        },
        {
            "id": "kia-stonic",
            "nome": "O Jovem Dinâmico",
            "modelo": "Kia Stonic",
            "descricao": "Jovem profissional, ativo e conectado, que vê o carro como uma extensão de seu estilo de vida. Valoriza a estética, a agilidade para o trânsito e a eficiência.",
            "idade": "25-35 anos",
            "genero": "Homem ou Mulher",
            "localizacao": "Grandes centros urbanos",
            "interesses": ["Música", "Festivais", "Esportes (academia, corrida)", "Viagens de fim de semana", "Tecnologia", "Redes sociais (TikTok, Instagram)"],
            "comportamentos": ["Ativo e social", "Conectado", "Busca um carro 'a sua cara'", "Valoriza a versatilidade para rotina e lazer"],
            "status": "Ativo"
        }
    ],
    "suzuki": [
        {
            "id": "suzuki-gsx-8r",
            "nome": "O Piloto de Fim de Semana",
            "modelo": "Suzuki GSX-8R",
            "descricao": "Entusiasta de performance que vê a moto como um hobby e válvula de escape. Consome muito conteúdo online e sonha em participar de track days.",
            "idade": "25-40 anos",
            "genero": "Homem",
            "localizacao": "Cidades com acesso a autódromos ou serras",
            "interesses": ["MotoGP", "Automobilismo", "Track days", "Tecnologia de motocicletas", "Customização de performance"],
            "comportamentos": ["Entusiasta de performance", "Usa a moto como hobby", "Participa ou sonha com track days", "Consome conteúdo sobre motociclismo online"],
            "status": "Ativo"
        },
        {
            "id": "suzuki-gsx-8s",
            "nome": "O Performer Versátil",
            "modelo": "Suzuki GSX-8S",
            "descricao": "Motociclista experiente que busca o equilíbrio perfeito entre performance para o fim de semana e usabilidade para o dia a dia. Quer 'uma moto para tudo'.",
            "idade": "30-45 anos",
            "genero": "Homem",
            "localizacao": "Grandes cidades",
            "interesses": ["Passeios de moto", "Viagens curtas", "Tecnologia", "Mecânica de motocicletas"],
            "comportamentos": ["Busca equilíbrio entre performance e usabilidade", "Motociclista experiente", "Valoriza a versatilidade", "Usa a moto para lazer e deslocamento"],
            "status": "Ativo"
        },
        {
            "id": "suzuki-vstrom-650",
            "nome": "O Viajante Experiente",
            "modelo": "Suzuki V-Strom 650",
            "descricao": "Motociclista de longa data, focado em viagens. Valoriza a confiabilidade e o conforto acima de tudo para longas jornadas, muitas vezes com garupa.",
            "idade": "40-60+ anos",
            "genero": "Homem",
            "localizacao": "Qualquer lugar com estradas",
            "interesses": ["Mototurismo", "Fotografia de viagem", "Acampamento", "História", "Geografia", "Encontros de motoclubes"],
            "comportamentos": ["Focado em viagens", "Valoriza confiabilidade e conforto", "Planeja rotas com antecedência", "Frequentemente viaja com parceira(o)"],
            "status": "Ativo"
        },
        {
            "id": "suzuki-vstrom-800de",
            "nome": "O Aventureiro Sem Fronteiras",
            "modelo": "Suzuki V-Strom 800 DE",
            "descricao": "Entusiasta de off-road e longas expedições. Busca desafios, investe em equipamentos de alta qualidade e precisa de uma moto capaz de enfrentar terrenos difíceis.",
            "idade": "35-50 anos",
            "genero": "Homem",
            "localizacao": "Próximo a áreas com trilhas e estradas de terra",
            "interesses": ["Off-road", "Camping", "Sobrevivência", "Expedições", "Overlanding", "Mecânica"],
            "comportamentos": ["Busca desafios e exploração", "Investe em equipamentos de alta qualidade", "Precisa de capacidade off-road real", "Gosta de testar seus próprios limites"],
            "status": "Ativo"
        }
    ],
    "haojue": [
        {
            "id": "haojue-160-series",
            "nome": "O Jovem Conquistador",
            "modelo": "Haojue DK160 / DL160 / DR160",
            "descricao": "Jovem em início de vida adulta, buscando independência. A moto é seu primeiro grande bem, um símbolo de liberdade e status social, com decisão influenciada pelo preço e visual.",
            "idade": "18-25 anos",
            "genero": "Homem",
            "localizacao": "Centros urbanos e periferias",
            "interesses": ["Redes sociais (TikTok, Instagram)", "Música", "Games", "Sair com amigos", "Faculdade/trabalho"],
            "comportamentos": ["Conectado", "Busca independência", "Sensível ao preço", "Influenciado pelo visual e status no grupo"],
            "status": "Ativo"
        },
        {
            "id": "haojue-master-ride-150",
            "nome": "O Custom Style Iniciante",
            "modelo": "Haojue Master Ride 150",
            "descricao": "Trabalhador que busca uma moto com mais estilo para o lazer, inspirado pela cultura custom, mas de forma acessível. A moto é um ponto de partida para a personalização.",
            "idade": "25-40 anos",
            "genero": "Homem",
            "localizacao": "Cidades de todos os portes",
            "interesses": ["Rock clássico", "Filmes de estrada", "Encontros de motos", "Personalização (DIY)", "Churrascos com amigos"],
            "comportamentos": ["Aspiracional", "Influenciado pela cultura custom", "Busca um estilo de vida acessível", "Valoriza a imagem e a comunidade"],
            "status": "Ativo"
        },
        {
            "id": "haojue-nk150",
            "nome": "O Guerreiro do Cotidiano",
            "modelo": "Haojue NK150",
            "descricao": "Trabalhador que usa a moto como principal ferramenta de renda (entregador, motoboy) em condições urbanas severas. Busca robustez, conforto e economia.",
            "idade": "20-40 anos",
            "genero": "Homem",
            "localizacao": "Grandes centros urbanos",
            "interesses": ["Economia", "Durabilidade", "Praticidade", "Descanso e família"],
            "comportamentos": ["Focado no trabalho", "A moto é uma ferramenta de renda", "Roda centenas de quilômetros por semana", "Busca o menor custo de propriedade"],
            "status": "Ativo"
        }
    ],
    "zontes": [
        {
            "id": "zontes-e350-scooter",
            "nome": "O Executivo Urbano",
            "modelo": "Zontes E350 Scooter",
            "descricao": "Profissional que busca a forma mais eficiente e confortável de se locomover na cidade, otimizando seu tempo. Valoriza tecnologia, design e performance em um pacote prático.",
            "idade": "30-45 anos",
            "genero": "Homem ou Mulher",
            "localizacao": "Metrópoles",
            "interesses": ["Tecnologia", "Gadgets", "Urbanismo", "Gastronomia", "Viagens de negócios", "Otimização de produtividade"],
            "comportamentos": ["Otimizador de tempo", "Busca eficiência e conforto", "Valoriza tecnologia e design", "Não se vê como 'motoqueiro' tradicional"],
            "status": "Ativo"
        },
        {
            "id": "zontes-gk350",
            "nome": "O Neo-Retrô",
            "modelo": "Zontes GK350",
            "descricao": "Profissional criativo e individualista que valoriza a estética. A moto é uma forma de autoexpressão, combinando o design clássico com a confiabilidade da tecnologia moderna.",
            "idade": "25-40 anos",
            "genero": "Homem",
            "localizacao": "Grandes cidades",
            "interesses": ["Design", "Arte", "Música indie", "Cultura de cafés especiais", "Barbearias", "Moda", "Fotografia analógica"],
            "comportamentos": ["Criativo e individualista", "Formador de opinião", "A estética é tão importante quanto a função", "Gosta de objetos com design único"],
            "status": "Ativo"
        },
        {
            "id": "zontes-r350",
            "nome": "O Streetfighter Agressivo",
            "modelo": "Zontes R350",
            "descricao": "Jovem fazendo seu primeiro upgrade de uma moto menor. É impulsivo, movido pela emoção e quer o visual mais moderno e 'invocado' que seu dinheiro pode comprar.",
            "idade": "20-30 anos",
            "genero": "Homem",
            "localizacao": "Centros urbanos",
            "interesses": ["Games", "Filmes de ação", "Música eletrônica", "Cultura de 'tuning' automotivo"],
            "comportamentos": ["Impulsivo", "Movido pela emoção e estética", "Busca impacto visual", "Quer ser o centro das atenções"],
            "status": "Ativo"
        },
        {
            "id": "zontes-s350",
            "nome": "O Cruiser Moderno",
            "modelo": "Zontes S350",
            "descricao": "Profissional que busca uma moto para relaxar, mas rejeita o estilo tradicional. Gosta da posição de uma cruiser, mas quer a performance e o design de uma moto moderna.",
            "idade": "30-45 anos",
            "genero": "Homem",
            "localizacao": "Cidades",
            "interesses": ["Arquitetura moderna", "Design industrial", "Tecnologia", "Viagens curtas", "Passeios noturnos"],
            "comportamentos": ["Individualista", "Aprecia design contemporâneo", "Busca uma moto única", "Rejeita rótulos tradicionais"],
            "status": "Ativo"
        },
        {
            "id": "zontes-t350",
            "nome": "O Crossover Tecnológico",
            "modelo": "Zontes T350 / T350x",
            "descricao": "Usuário de moto pragmático que busca mais versatilidade e conforto para o dia a dia e viagens. Quer o visual de uma moto de aventura, mas com excelente custo-benefício.",
            "idade": "25-40 anos",
            "genero": "Homem",
            "localizacao": "Cidades e arredores",
            "interesses": ["Viagens de fim de semana", "Tecnologia", "Camping", "Gadgets", "Busca por bom custo-benefício"],
            "comportamentos": ["Pragmático com um pé na aventura", "Quer uma moto que 'possa fazer tudo'", "Atraído pelo visual de big trail", "Sensível ao preço"],
            "status": "Ativo"
        },
        {
            "id": "zontes-tactic-400",
            "nome": "O Dominador do Asfalto",
            "modelo": "Zontes Tactic 400",
            "descricao": "Empresário ou executivo sênior que busca o máximo em performance e tecnologia. Não se contenta com o bom, quer o 'mais forte' e o 'melhor' da categoria.",
            "idade": "35-50 anos",
            "genero": "Homem",
            "localizacao": "Grandes cidades",
            "interesses": ["Carros esportivos", "Relógios", "Tecnologia de ponta", "Viagens premium"],
            "comportamentos": ["Busca o topo de linha", "Focado em performance e status", "Early adopter de tecnologia premium", "A decisão é mais sobre desejo do que necessidade"],
            "status": "Ativo"
        },
        {
            "id": "zontes-v350",
            "nome": "O Rebelde com Causa (Tecnológica)",
            "modelo": "Zontes V350",
            "descricao": "Individualista que rejeita o tradicional e busca produtos que reflitam sua personalidade única. Quer pilotar uma moto que pareça ter saído de um filme de ficção científica.",
            "idade": "25-40 anos",
            "genero": "Homem",
            "localizacao": "Grandes centros urbanos",
            "interesses": ["Cultura cyberpunk", "Design futurista", "Ficção científica", "Tecnologia vestível (wearables)", "Música eletrônica"],
            "comportamentos": ["Rejeita o tradicional", "Busca produtos que reflitam sua personalidade", "Individualista", "Não tem medo de arriscar em novas marcas"],
            "status": "Ativo"
        }
    ]
};