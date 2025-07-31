# Plano de Banco de Dados - Sun Motors Dashboard

## Visão Geral

Este documento apresenta o plano de estrutura de banco de dados para o sistema de dashboard de performance da Sun Motors, contemplando todas as funcionalidades identificadas no sistema atual.

## Estrutura de Tabelas

### 1. USUÁRIOS E AUTENTICAÇÃO

```sql
-- Tabela de usuários do sistema
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil ENUM('admin', 'gestor', 'analista') DEFAULT 'analista',
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP
);

-- Tabela de sessões de usuário
CREATE TABLE sessoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    data_expiracao TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. ESTRUTURA DE CAMPANHAS

```sql
-- Tabela de marcas/empresas
CREATE TABLE marcas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL, -- 'Kia Sun Motors', 'Suzuki Sun Motors', etc.
    codigo VARCHAR(20) UNIQUE NOT NULL, -- 'KIA', 'SUZUKI', 'HAOJUE', 'ZONTES'
    cor_principal VARCHAR(7), -- Cor hex para interface
    logo_url VARCHAR(255),
    ativa BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de modelos de veículos
CREATE TABLE modelos (
    id SERIAL PRIMARY KEY,
    marca_id INT REFERENCES marcas(id) ON DELETE CASCADE,
    nome VARCHAR(50) NOT NULL, -- 'Sportage', 'GSX-8R', 'Master Ride', etc.
    tipo ENUM('carro', 'moto', 'utilitario') NOT NULL,
    categoria VARCHAR(30), -- 'SUV', 'Esportiva', 'Naked', etc.
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de plataformas de anúncios
CREATE TABLE plataformas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL, -- 'Meta Ads', 'Google Ads'
    codigo VARCHAR(20) UNIQUE NOT NULL, -- 'META', 'GOOGLE'
    api_config JSON, -- Configurações de API se necessário
    ativa BOOLEAN DEFAULT true
);

-- Tabela de campanhas
CREATE TABLE campanhas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    marca_id INT REFERENCES marcas(id),
    modelo_id INT REFERENCES modelos(id),
    plataforma_id INT REFERENCES plataformas(id),
    tipo_campanha ENUM('sempre_ativa', 'sazonal', 'promocional', 'lancamento') DEFAULT 'sempre_ativa',
    orcamento_diario DECIMAL(10,2),
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status ENUM('ativa', 'pausada', 'finalizada') DEFAULT 'ativa',
    objetivo VARCHAR(100), -- 'Geração de Leads', 'Conversões', etc.
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. DADOS DE PERFORMANCE

```sql
-- Tabela de métricas diárias das campanhas
CREATE TABLE metricas_campanhas (
    id SERIAL PRIMARY KEY,
    campanha_id INT REFERENCES campanhas(id) ON DELETE CASCADE,
    data_metrica DATE NOT NULL,
    
    -- Métricas financeiras
    gasto_diario DECIMAL(10,2) DEFAULT 0,
    cpm DECIMAL(10,2) DEFAULT 0, -- Custo por mil impressões
    cpc DECIMAL(10,2) DEFAULT 0, -- Custo por clique
    cpl DECIMAL(10,2) DEFAULT 0, -- Custo por lead
    
    -- Métricas de alcance
    impressoes INT DEFAULT 0,
    alcance INT DEFAULT 0,
    cliques INT DEFAULT 0,
    
    -- Métricas de conversão
    leads INT DEFAULT 0,
    conversoes INT DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0, -- Em percentual
    
    -- Métricas específicas (Meta Ads)
    cliques_link INT DEFAULT 0,
    visitas_perfil INT DEFAULT 0,
    
    -- Métricas específicas (Google Ads)
    interacoes INT DEFAULT 0,
    custo_conversao DECIMAL(10,2) DEFAULT 0,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_campanha_data (campanha_id, data_metrica)
);

-- Tabela de resumos mensais (para otimização de consultas)
CREATE TABLE resumos_mensais (
    id SERIAL PRIMARY KEY,
    marca_id INT REFERENCES marcas(id),
    plataforma_id INT REFERENCES plataformas(id),
    ano YEAR NOT NULL,
    mes TINYINT NOT NULL,
    
    total_investido DECIMAL(12,2) DEFAULT 0,
    total_leads INT DEFAULT 0,
    total_impressoes BIGINT DEFAULT 0,
    total_cliques INT DEFAULT 0,
    cpl_medio DECIMAL(10,2) DEFAULT 0,
    taxa_conversao_media DECIMAL(5,2) DEFAULT 0,
    
    data_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_resumo (marca_id, plataforma_id, ano, mes)
);
```

### 4. SISTEMA DE ORÇAMENTO

```sql
-- Tabela de planejamento orçamentário
CREATE TABLE orcamentos (
    id SERIAL PRIMARY KEY,
    marca_id INT REFERENCES marcas(id),
    ano YEAR NOT NULL,
    mes TINYINT NOT NULL,
    
    orcamento_planejado DECIMAL(12,2) NOT NULL,
    orcamento_utilizado DECIMAL(12,2) DEFAULT 0,
    meta_leads INT,
    cpl_meta DECIMAL(10,2),
    
    observacoes TEXT,
    status ENUM('planejado', 'em_execucao', 'finalizado') DEFAULT 'planejado',
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_orcamento (marca_id, ano, mes)
);

-- Tabela de distribuição de orçamento por modelo
CREATE TABLE distribuicao_orcamento (
    id SERIAL PRIMARY KEY,
    orcamento_id INT REFERENCES orcamentos(id) ON DELETE CASCADE,
    modelo_id INT REFERENCES modelos(id),
    plataforma_id INT REFERENCES plataformas(id),
    
    percentual_alocado DECIMAL(5,2) NOT NULL, -- Ex: 25.50 para 25.5%
    valor_alocado DECIMAL(10,2) NOT NULL,
    valor_utilizado DECIMAL(10,2) DEFAULT 0,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. PÚBLICO-ALVO E SEGMENTAÇÃO

```sql
-- Tabela de personas de público-alvo
CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    marca_id INT REFERENCES marcas(id),
    
    idade_min TINYINT,
    idade_max TINYINT,
    genero ENUM('masculino', 'feminino', 'todos') DEFAULT 'todos',
    localizacao JSON, -- Array de cidades/estados
    interesses JSON, -- Array de interesses
    comportamentos JSON, -- Array de comportamentos
    
    descricao TEXT,
    ativa BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de campanhas x personas (relacionamento many-to-many)
CREATE TABLE campanhas_personas (
    id SERIAL PRIMARY KEY,
    campanha_id INT REFERENCES campanhas(id) ON DELETE CASCADE,
    persona_id INT REFERENCES personas(id) ON DELETE CASCADE,
    peso DECIMAL(5,2) DEFAULT 100.00, -- Peso da persona na campanha (%)
    data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_campanha_persona (campanha_id, persona_id)
);

-- Tabela de análise demográfica dos leads
CREATE TABLE demograficos_leads (
    id SERIAL PRIMARY KEY,
    campanha_id INT REFERENCES campanhas(id),
    data_analise DATE NOT NULL,
    
    faixa_etaria VARCHAR(20), -- '18-24', '25-34', etc.
    genero ENUM('masculino', 'feminino', 'nao_informado'),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    
    quantidade_leads INT DEFAULT 0,
    custo_total DECIMAL(10,2) DEFAULT 0,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. SISTEMA DE OTIMIZAÇÕES

```sql
-- Tabela de alterações em campanhas
CREATE TABLE alteracoes_campanhas (
    id SERIAL PRIMARY KEY,
    campanha_id INT REFERENCES campanhas(id),
    usuario_id INT REFERENCES usuarios(id),
    
    data_alteracao DATE NOT NULL,
    tipo_alteracao ENUM(
        'orcamento', 
        'segmentacao', 
        'criativo', 
        'lance', 
        'posicionamento', 
        'pausa_ativacao', 
        'estrutural', 
        'outro'
    ) NOT NULL,
    
    descricao TEXT NOT NULL,
    hipotese TEXT, -- Motivo/hipótese da alteração
    
    -- Valores antes e depois (JSON para flexibilidade)
    valores_anteriores JSON,
    valores_novos JSON,
    
    status ENUM('aplicada', 'revertida', 'teste') DEFAULT 'aplicada',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de resultados das otimizações
CREATE TABLE resultados_otimizacoes (
    id SERIAL PRIMARY KEY,
    alteracao_id INT REFERENCES alteracoes_campanhas(id) ON DELETE CASCADE,
    
    periodo_analise_inicio DATE NOT NULL,
    periodo_analise_fim DATE NOT NULL,
    
    -- Métricas antes da alteração
    leads_antes INT DEFAULT 0,
    cpl_antes DECIMAL(10,2) DEFAULT 0,
    taxa_conversao_antes DECIMAL(5,2) DEFAULT 0,
    
    -- Métricas depois da alteração
    leads_depois INT DEFAULT 0,
    cpl_depois DECIMAL(10,2) DEFAULT 0,
    taxa_conversao_depois DECIMAL(5,2) DEFAULT 0,
    
    -- Indicadores de performance
    melhoria_leads DECIMAL(5,2) DEFAULT 0, -- Em percentual
    melhoria_cpl DECIMAL(5,2) DEFAULT 0,
    melhoria_conversao DECIMAL(5,2) DEFAULT 0,
    
    observacoes TEXT,
    sucesso ENUM('positivo', 'negativo', 'neutro', 'indefinido') DEFAULT 'indefinido',
    
    data_analise TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. SISTEMA DE RELATÓRIOS

```sql
-- Tabela de relatórios salvos
CREATE TABLE relatorios_salvos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    usuario_id INT REFERENCES usuarios(id),
    
    tipo_relatorio ENUM('performance', 'comparativo', 'demografico', 'roi', 'personalizado'),
    parametros JSON, -- Filtros e configurações do relatório
    agendamento JSON, -- Configuração de envio automático
    
    publico BOOLEAN DEFAULT false, -- Se pode ser visto por outros usuários
    ativo BOOLEAN DEFAULT true,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de exportações de relatórios
CREATE TABLE exportacoes_relatorios (
    id SERIAL PRIMARY KEY,
    relatorio_id INT REFERENCES relatorios_salvos(id),
    usuario_id INT REFERENCES usuarios(id),
    
    formato ENUM('pdf', 'excel', 'csv') NOT NULL,
    parametros_exportacao JSON,
    caminho_arquivo VARCHAR(500),
    
    status ENUM('processando', 'concluido', 'erro') DEFAULT 'processando',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP
);
```

### 8. CONFIGURAÇÕES E LOGS

```sql
-- Tabela de configurações do sistema
CREATE TABLE configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descricao TEXT,
    tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    categoria VARCHAR(50) DEFAULT 'geral',
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de logs de atividades
CREATE TABLE logs_atividades (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    acao VARCHAR(100) NOT NULL,
    tabela_afetada VARCHAR(50),
    registro_id INT,
    dados_anteriores JSON,
    dados_novos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notificações
CREATE TABLE notificacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    tipo ENUM('info', 'aviso', 'alerta', 'sucesso') DEFAULT 'info',
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT false,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_leitura TIMESTAMP
);
```

## Índices Recomendados

```sql
-- Índices para otimização de performance
CREATE INDEX idx_metricas_campanha_data ON metricas_campanhas(campanha_id, data_metrica);
CREATE INDEX idx_campanhas_marca_status ON campanhas(marca_id, status);
CREATE INDEX idx_campanhas_plataforma ON campanhas(plataforma_id);
CREATE INDEX idx_alteracoes_campanha_data ON alteracoes_campanhas(campanha_id, data_alteracao);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_logs_usuario_data ON logs_atividades(usuario_id, data_acao);
CREATE INDEX idx_notificacoes_usuario_lida ON notificacoes(usuario_id, lida);
```

## Views Úteis

```sql
-- View para dashboard principal
CREATE VIEW vw_dashboard_kpis AS
SELECT 
    m.nome as marca,
    m.codigo as marca_codigo,
    p.nome as plataforma,
    SUM(mc.gasto_diario) as investimento_total,
    SUM(mc.leads) as leads_total,
    AVG(mc.cpl) as cpl_medio,
    AVG(mc.taxa_conversao) as taxa_conversao_media,
    COUNT(DISTINCT c.id) as total_campanhas_ativas
FROM metricas_campanhas mc
JOIN campanhas c ON mc.campanha_id = c.id
JOIN marcas m ON c.marca_id = m.id
JOIN plataformas p ON c.plataforma_id = p.id
WHERE c.status = 'ativa'
    AND mc.data_metrica >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY m.id, p.id;

-- View para histórico de otimizações
CREATE VIEW vw_historico_otimizacoes AS
SELECT 
    ac.id,
    ac.data_alteracao,
    m.nome as marca,
    c.nome as campanha,
    ac.tipo_alteracao,
    ac.descricao,
    ac.hipotese,
    u.nome as responsavel,
    ro.sucesso as resultado
FROM alteracoes_campanhas ac
JOIN campanhas c ON ac.campanha_id = c.id
JOIN marcas m ON c.marca_id = m.id
JOIN usuarios u ON ac.usuario_id = u.id
LEFT JOIN resultados_otimizacoes ro ON ac.id = ro.alteracao_id
ORDER BY ac.data_alteracao DESC;
```

## Considerações de Segurança

1. **Autenticação**: Implementar hash seguro de senhas (bcrypt)
2. **Autorização**: Sistema de perfis e permissões por módulo
3. **Auditoria**: Logs completos de todas as operações críticas
4. **Backup**: Backup diário com retenção de 30 dias
5. **Criptografia**: Dados sensíveis criptografados em rest

## Configurações de Banco

```sql
-- Configurações recomendadas para MySQL/MariaDB
SET GLOBAL innodb_buffer_pool_size = 1G;
SET GLOBAL max_connections = 200;
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 2;
```

## Dados Iniciais (Seeds)

```sql
-- Inserir marcas iniciais
INSERT INTO marcas (nome, codigo, cor_principal) VALUES
('Kia Sun Motors', 'KIA', '#DC2626'),
('Suzuki Sun Motors', 'SUZUKI', '#2563EB'),
('Haojue Sun Motors', 'HAOJUE', '#DC2626'),
('Zontes Sun Motors', 'ZONTES', '#6B7280');

-- Inserir plataformas
INSERT INTO plataformas (nome, codigo) VALUES
('Meta Ads', 'META'),
('Google Ads', 'GOOGLE');

-- Inserir usuário administrador padrão
INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES
('Administrador', 'admin@sunmotors.com', '$2b$12$hash_aqui', 'admin');

-- Inserir configurações básicas
INSERT INTO configuracoes (chave, valor, descricao, categoria) VALUES
('empresa_nome', 'Sun Motors', 'Nome da empresa', 'geral'),
('dashboard_refresh_interval', '300', 'Intervalo de atualização do dashboard em segundos', 'interface'),
('max_upload_size', '10485760', 'Tamanho máximo de upload em bytes (10MB)', 'sistema');
```

---

**Versão**: 1.0  
**Data**: Dezembro 2024  
**Autor**: Sistema Sun Motors  
**Status**: Aprovado para implementação