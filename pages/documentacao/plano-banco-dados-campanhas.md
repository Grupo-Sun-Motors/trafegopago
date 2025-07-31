# Planejamento de Banco de Dados - Campanhas Publicitárias

## Análise dos Relatórios Existentes

### Estruturas Identificadas

#### Meta Ads (Facebook/Instagram)
- **Hierarquia**: Conta → Campanha → Conjunto de Anúncios → Anúncio
- **Campos principais identificados**:
  - Nome da campanha
  - Veiculação da campanha (active/inactive)
  - Orçamento do conjunto de anúncios
  - Tipo de orçamento (Diário/Vitalício)
  - Valor usado (BRL)
  - Resultados e Indicador de resultados
  - Custo por resultados
  - CPM (custo por 1.000 impressões)
  - Alcance e Frequência
  - Impressões
  - CTR (taxa de cliques no link)
  - Cliques no link
  - CPC (custo por clique no link)
  - Visitas ao perfil do Instagram

#### Google Ads
- **Hierarquia**: Conta → Campanha → Grupo de Anúncios → Anúncio
- **Campos principais identificados**:
  - Nome da campanha
  - Status da campanha
  - Orçamento e Nome do orçamento
  - Tipo de orçamento (Diário/Compartilhado)
  - Tipo de estratégia de lances
  - Tipo de campanha (Performance Max, Pesquisa, Vídeo, etc.)
  - CPV médio e CPM médio
  - Impressões
  - Interações e Taxa de interação
  - Custo médio e Custo total
  - Cliques e CPC médio
  - Conversões e Custo por conversão

## Estrutura do Banco de Dados

### Pré-requisito: Extensão UUID
```sql
-- Ativar extensão para geração de UUIDs (executar apenas uma vez)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ou alternativamente (PostgreSQL 13+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 1. Tabela: contas_publicitarias
```sql
CREATE TABLE contas_publicitarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    plataforma VARCHAR(20) NOT NULL CHECK (plataforma IN ('google_ads', 'meta_ads')),
    account_id VARCHAR(50) NOT NULL,
    cliente VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Tabela: campanhas
```sql
CREATE TABLE campanhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conta_id UUID REFERENCES contas_publicitarias(id),
    nome VARCHAR(200) NOT NULL,
    plataforma VARCHAR(20) NOT NULL CHECK (plataforma IN ('google_ads', 'meta_ads')),
    campaign_id VARCHAR(50) NOT NULL,
    
    -- Status e configurações
    status VARCHAR(30) NOT NULL,
    veiculacao VARCHAR(20), -- active/inactive/paused
    
    -- Orçamento
    orcamento_valor DECIMAL(10,2),
    orcamento_tipo VARCHAR(30), -- Diário/Vitalício/Compartilhado
    nome_orcamento VARCHAR(100),
    
    -- Google Ads específico
    tipo_campanha VARCHAR(50), -- Performance Max, Pesquisa, Vídeo, etc.
    estrategia_lances VARCHAR(100),
    motivos_status TEXT,
    
    -- Meta Ads específico
    objetivo VARCHAR(50),
    
    -- Timestamps
    data_inicio DATE,
    data_fim DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(conta_id, campaign_id)
);
```

### 3. Tabela: conjuntos_anuncios (Meta Ads) / grupos_anuncios (Google Ads)
```sql
CREATE TABLE conjuntos_anuncios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campanha_id UUID REFERENCES campanhas(id),
    nome VARCHAR(200) NOT NULL,
    plataforma VARCHAR(20) NOT NULL CHECK (plataforma IN ('google_ads', 'meta_ads')),
    adset_id VARCHAR(50) NOT NULL,
    
    -- Configurações
    status VARCHAR(30),
    orcamento_valor DECIMAL(10,2),
    orcamento_tipo VARCHAR(30),
    
    -- Segmentação (será expandido conforme necessidade)
    publico_alvo TEXT,
    localizacao TEXT,
    idade_min INTEGER,
    idade_max INTEGER,
    genero VARCHAR(20),
    
    -- Meta Ads específico
    objetivo_conjunto VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campanha_id, adset_id)
);
```

### 4. Tabela: anuncios
```sql
CREATE TABLE anuncios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conjunto_anuncio_id UUID REFERENCES conjuntos_anuncios(id),
    nome VARCHAR(200) NOT NULL,
    plataforma VARCHAR(20) NOT NULL CHECK (plataforma IN ('google_ads', 'meta_ads')),
    ad_id VARCHAR(50) NOT NULL,
    
    -- Configurações
    status VARCHAR(30),
    tipo_anuncio VARCHAR(50),
    
    -- Criativos
    titulo VARCHAR(500),
    descricao TEXT,
    url_imagem TEXT,
    url_video TEXT,
    call_to_action VARCHAR(50),
    
    -- Links
    url_destino TEXT,
    url_display TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(conjunto_anuncio_id, ad_id)
);
```

### 5. Tabela: relatorios_campanhas (Tabela principal de métricas)
```sql
CREATE TABLE relatorios_campanhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campanha_id UUID REFERENCES campanhas(id),
    
    -- Período
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    periodo_tipo VARCHAR(20) DEFAULT 'range', -- daily, weekly, monthly, range
    
    -- Métricas de Custo
    valor_investido DECIMAL(10,2) DEFAULT 0,
    gasto_diario_medio DECIMAL(10,2) DEFAULT 0,
    custo_medio DECIMAL(6,4) DEFAULT 0,
    
    -- Métricas de Alcance e Impressões
    impressoes BIGINT DEFAULT 0,
    alcance BIGINT DEFAULT 0,
    frequencia DECIMAL(4,2) DEFAULT 0,
    
    -- Métricas de Interação
    cliques BIGINT DEFAULT 0,
    cliques_link BIGINT DEFAULT 0, -- Meta Ads específico
    interacoes BIGINT DEFAULT 0, -- Google Ads específico
    
    -- Métricas de Performance
    ctr DECIMAL(6,4) DEFAULT 0, -- Taxa de clique
    cpc DECIMAL(6,4) DEFAULT 0, -- Custo por clique
    cpm DECIMAL(6,4) DEFAULT 0, -- Custo por mil impressões
    cpv DECIMAL(6,4) DEFAULT 0, -- Custo por visualização (Google Ads)
    
    -- Conversões e Resultados
    conversoes DECIMAL(8,2) DEFAULT 0,
    custo_por_conversao DECIMAL(10,4) DEFAULT 0,
    taxa_conversao DECIMAL(6,4) DEFAULT 0,
    resultados BIGINT DEFAULT 0, -- Meta Ads
    custo_por_resultado DECIMAL(10,4) DEFAULT 0, -- Meta Ads
    indicador_resultados VARCHAR(100), -- Meta Ads
    
    -- Meta Ads específico
    visitas_perfil BIGINT DEFAULT 0,
    
    -- Google Ads específico
    taxa_interacao DECIMAL(6,4) DEFAULT 0,
    
    -- Metadados
    fonte_dados VARCHAR(20) NOT NULL, -- 'api' ou 'csv_import'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campanha_id, data_inicio, data_fim)
);
```

### 6. Tabela: relatorios_conjuntos_anuncios
```sql
CREATE TABLE relatorios_conjuntos_anuncios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conjunto_anuncio_id UUID REFERENCES conjuntos_anuncios(id),
    
    -- Período
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    
    -- Métricas (mesmo schema da tabela campanhas, mas por conjunto)
    valor_investido DECIMAL(10,2) DEFAULT 0,
    impressoes BIGINT DEFAULT 0,
    alcance BIGINT DEFAULT 0,
    cliques BIGINT DEFAULT 0,
    conversoes DECIMAL(8,2) DEFAULT 0,
    ctr DECIMAL(6,4) DEFAULT 0,
    cpc DECIMAL(6,4) DEFAULT 0,
    cpm DECIMAL(6,4) DEFAULT 0,
    
    -- Metadados
    fonte_dados VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(conjunto_anuncio_id, data_inicio, data_fim)
);
```

### 7. Tabela: relatorios_anuncios
```sql
CREATE TABLE relatorios_anuncios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anuncio_id UUID REFERENCES anuncios(id),
    
    -- Período
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    
    -- Métricas (mesmo schema, mas por anúncio)
    valor_investido DECIMAL(10,2) DEFAULT 0,
    impressoes BIGINT DEFAULT 0,
    alcance BIGINT DEFAULT 0,
    cliques BIGINT DEFAULT 0,
    conversoes DECIMAL(8,2) DEFAULT 0,
    ctr DECIMAL(6,4) DEFAULT 0,
    cpc DECIMAL(6,4) DEFAULT 0,
    cpm DECIMAL(6,4) DEFAULT 0,
    
    -- Metadados
    fonte_dados VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(anuncio_id, data_inicio, data_fim)
);
```

## Índices Recomendados

```sql
-- Índices para performance
CREATE INDEX idx_campanhas_conta_plataforma ON campanhas(conta_id, plataforma);
CREATE INDEX idx_campanhas_status ON campanhas(status);
CREATE INDEX idx_relatorios_campanhas_periodo ON relatorios_campanhas(data_inicio, data_fim);
CREATE INDEX idx_relatorios_campanhas_campanha_periodo ON relatorios_campanhas(campanha_id, data_inicio, data_fim);
CREATE INDEX idx_conjuntos_anuncios_campanha ON conjuntos_anuncios(campanha_id);
CREATE INDEX idx_anuncios_conjunto ON anuncios(conjunto_anuncio_id);
```

## Views para Relatórios Consolidados

### View: campanhas_com_metricas
```sql
CREATE VIEW campanhas_com_metricas AS
SELECT 
    c.id::TEXT,
    c.nome,
    c.plataforma,
    ca.nome as conta_nome,
    ca.cliente,
    c.status,
    c.orcamento_valor,
    c.tipo_campanha,
    
    -- Métricas agregadas (último período)
    r.valor_investido,
    r.impressoes,
    r.alcance,
    r.cliques,
    r.conversoes,
    r.ctr,
    r.cpc,
    r.cpm,
    r.data_inicio,
    r.data_fim
    
FROM campanhas c
JOIN contas_publicitarias ca ON c.conta_id = ca.id
LEFT JOIN relatorios_campanhas r ON c.id = r.campanha_id
WHERE r.data_fim = (
    SELECT MAX(data_fim) 
    FROM relatorios_campanhas r2 
    WHERE r2.campanha_id = c.id
);
```

### View: resumo_por_cliente
```sql
CREATE VIEW resumo_por_cliente AS
SELECT 
    ca.cliente,
    ca.plataforma,
    COUNT(DISTINCT c.id) as total_campanhas,
    COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as campanhas_ativas,
    SUM(r.valor_investido) as investimento_total,
    SUM(r.impressoes) as impressoes_total,
    SUM(r.cliques) as cliques_total,
    SUM(r.conversoes) as conversoes_total,
    AVG(r.ctr) as ctr_medio,
    AVG(r.cpc) as cpc_medio
    
FROM contas_publicitarias ca
JOIN campanhas c ON ca.id = c.conta_id
LEFT JOIN relatorios_campanhas r ON c.id = r.campanha_id
WHERE r.data_fim >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ca.cliente, ca.plataforma;
```

## Considerações para Implementação

### 1. Uso de UUID
- **Vantagens**: IDs únicos globalmente, melhor para sistemas distribuídos, sem conflitos em sincronizações
- **Extensões necessárias**: `uuid-ossp` ou `pgcrypto` (PostgreSQL 13+)
- **Performance**: Índices ligeiramente maiores, mas diferença mínima para volumes esperados
- **Compatibilidade**: APIs retornam IDs como string, facilitando mapeamento

### 2. Integração com APIs
- **Google Ads API**: Para sincronização automática de campanhas e métricas
- **Meta Ads API**: Para sincronização automática de campanhas e métricas
- Implementar jobs automatizados para atualização diária dos dados

### 3. Importação de CSVs Históricos
- Criar scripts para importar os dados históricos dos CSVs existentes
- Mapear os campos específicos de cada plataforma para as tabelas unificadas
- Validar e normalizar os dados durante a importação

### 4. Estrutura Flexível
- Campos específicos por plataforma mantidos separadamente
- Métricas comuns unificadas para facilitar relatórios comparativos
- Possibilidade de extensão para outras plataformas publicitárias

### 5. Relacionamentos e Constraints
- Foreign keys para manter integridade referencial
- Unique constraints para evitar duplicação de dados
- Check constraints para validar valores de enums

### 6. Performance
- Índices estratégicos para consultas frequentes
- Particionamento da tabela de relatórios por data (se necessário)
- Views materializadas para relatórios complexos (se necessário)

## Próximos Passos

1. **Implementar a estrutura base** - Criar as tabelas principais
2. **Desenvolver scripts de importação** - Para dados históricos dos CSVs
3. **Implementar integração com APIs** - Para sincronização automática
4. **Criar interface de relatórios** - Dashboard para visualização dos dados
5. **Implementar alertas e notificações** - Para campanhas com performance baixa

Este banco de dados fornecerá uma base sólida para análise de performance, otimização de campanhas e geração de relatórios consolidados entre Google Ads e Meta Ads.