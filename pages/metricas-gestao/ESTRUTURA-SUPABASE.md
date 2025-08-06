| Tabela                        | Campo                     | Ordem | Tipo de Dado             | Pode ser Nulo? | É Relacionamento? | Aponta para Tabela   | Aponta para Campo |
| ----------------------------- | ------------------------- | ----- | ------------------------ | -------------- | ----------------- | -------------------- | ----------------- |
| anuncios                      | id                        | 1     | uuid                     | NO             | NÃO               | null                 | null              |
| anuncios                      | conjunto_anuncio_id       | 2     | uuid                     | YES            | SIM               | conjuntos_anuncios   | id                |
| anuncios                      | nome                      | 3     | character varying        | NO             | NÃO               | null                 | null              |
| anuncios                      | plataforma                | 4     | character varying        | NO             | NÃO               | null                 | null              |
| anuncios                      | ad_id                     | 5     | character varying        | NO             | NÃO               | null                 | null              |
| anuncios                      | status                    | 6     | character varying        | YES            | NÃO               | null                 | null              |
| anuncios                      | tipo_anuncio              | 7     | character varying        | YES            | NÃO               | null                 | null              |
| anuncios                      | titulo                    | 8     | character varying        | YES            | NÃO               | null                 | null              |
| anuncios                      | descricao                 | 9     | text                     | YES            | NÃO               | null                 | null              |
| anuncios                      | url_imagem                | 10    | text                     | YES            | NÃO               | null                 | null              |
| anuncios                      | url_video                 | 11    | text                     | YES            | NÃO               | null                 | null              |
| anuncios                      | call_to_action            | 12    | character varying        | YES            | NÃO               | null                 | null              |
| anuncios                      | url_destino               | 13    | text                     | YES            | NÃO               | null                 | null              |
| anuncios                      | url_display               | 14    | text                     | YES            | NÃO               | null                 | null              |
| anuncios                      | created_at                | 15    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| anuncios                      | updated_at                | 16    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| campanhas                     | id                        | 1     | uuid                     | NO             | NÃO               | null                 | null              |
| campanhas                     | conta_id                  | 2     | uuid                     | YES            | SIM               | contas_publicitarias | id                |
| campanhas                     | nome                      | 3     | character varying        | NO             | NÃO               | null                 | null              |
| campanhas                     | plataforma                | 4     | character varying        | NO             | NÃO               | null                 | null              |
| campanhas                     | campaign_id               | 5     | character varying        | NO             | NÃO               | null                 | null              |
| campanhas                     | status                    | 6     | character varying        | NO             | NÃO               | null                 | null              |
| campanhas                     | veiculacao                | 7     | character varying        | YES            | NÃO               | null                 | null              |
| campanhas                     | orcamento_valor           | 8     | numeric                  | YES            | NÃO               | null                 | null              |
| campanhas                     | orcamento_tipo            | 9     | character varying        | YES            | NÃO               | null                 | null              |
| campanhas                     | nome_orcamento            | 10    | character varying        | YES            | NÃO               | null                 | null              |
| campanhas                     | tipo_campanha             | 11    | character varying        | YES            | NÃO               | null                 | null              |
| campanhas                     | estrategia_lances         | 12    | character varying        | YES            | NÃO               | null                 | null              |
| campanhas                     | motivos_status            | 13    | text                     | YES            | NÃO               | null                 | null              |
| campanhas                     | objetivo                  | 14    | character varying        | YES            | NÃO               | null                 | null              |
| campanhas                     | data_inicio               | 15    | date                     | YES            | NÃO               | null                 | null              |
| campanhas                     | data_fim                  | 16    | date                     | YES            | NÃO               | null                 | null              |
| campanhas                     | created_at                | 17    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| campanhas                     | updated_at                | 18    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | id                        | 1     | uuid                     | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | nome                      | 2     | character varying        | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | plataforma                | 3     | character varying        | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | conta_nome                | 4     | character varying        | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | cliente                   | 5     | character varying        | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | status                    | 6     | character varying        | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | orcamento_valor           | 7     | numeric                  | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | tipo_campanha             | 8     | character varying        | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | valor_investido           | 9     | numeric                  | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | impressoes                | 10    | bigint                   | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | alcance                   | 11    | bigint                   | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | cliques_total             | 12    | bigint                   | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | conversoes_total          | 13    | numeric                  | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | ctr                       | 14    | numeric                  | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | cpc                       | 15    | numeric                  | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | cpm                       | 16    | numeric                  | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | data_inicio               | 17    | date                     | YES            | NÃO               | null                 | null              |
| campanhas_com_metricas        | data_fim                  | 18    | date                     | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | id                        | 1     | uuid                     | NO             | NÃO               | null                 | null              |
| conjuntos_anuncios            | campanha_id               | 2     | uuid                     | YES            | SIM               | campanhas            | id                |
| conjuntos_anuncios            | nome                      | 3     | character varying        | NO             | NÃO               | null                 | null              |
| conjuntos_anuncios            | plataforma                | 4     | character varying        | NO             | NÃO               | null                 | null              |
| conjuntos_anuncios            | adset_id                  | 5     | character varying        | NO             | NÃO               | null                 | null              |
| conjuntos_anuncios            | status                    | 6     | character varying        | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | orcamento_valor           | 7     | numeric                  | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | orcamento_tipo            | 8     | character varying        | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | publico_alvo              | 9     | text                     | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | localizacao               | 10    | text                     | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | idade_min                 | 11    | integer                  | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | idade_max                 | 12    | integer                  | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | genero                    | 13    | character varying        | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | objetivo_conjunto         | 14    | character varying        | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | created_at                | 15    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| conjuntos_anuncios            | updated_at                | 16    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| contas_publicitarias          | id                        | 1     | uuid                     | NO             | NÃO               | null                 | null              |
| contas_publicitarias          | nome                      | 2     | character varying        | NO             | NÃO               | null                 | null              |
| contas_publicitarias          | plataforma                | 3     | character varying        | NO             | NÃO               | null                 | null              |
| contas_publicitarias          | account_id                | 4     | character varying        | NO             | NÃO               | null                 | null              |
| contas_publicitarias          | cliente                   | 5     | character varying        | NO             | NÃO               | null                 | null              |
| contas_publicitarias          | status                    | 6     | character varying        | YES            | NÃO               | null                 | null              |
| contas_publicitarias          | created_at                | 7     | timestamp with time zone | YES            | NÃO               | null                 | null              |
| contas_publicitarias          | updated_at                | 8     | timestamp with time zone | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | id                        | 1     | uuid                     | NO             | NÃO               | null                 | null              |
| relatorios_anuncios           | anuncio_id                | 2     | uuid                     | YES            | SIM               | anuncios             | id                |
| relatorios_anuncios           | data_inicio               | 3     | date                     | NO             | NÃO               | null                 | null              |
| relatorios_anuncios           | data_fim                  | 4     | date                     | NO             | NÃO               | null                 | null              |
| relatorios_anuncios           | valor_investido           | 5     | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | impressoes                | 6     | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | alcance                   | 7     | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | cliques                   | 8     | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | conversoes                | 9     | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | ctr                       | 10    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | cpc                       | 11    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | cpm                       | 12    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | fonte_dados               | 13    | character varying        | NO             | NÃO               | null                 | null              |
| relatorios_anuncios           | created_at                | 14    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| relatorios_anuncios           | updated_at                | 15    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | id                        | 1     | uuid                     | NO             | NÃO               | null                 | null              |
| relatorios_campanhas          | campanha_id               | 2     | uuid                     | YES            | SIM               | campanhas            | id                |
| relatorios_campanhas          | data_inicio               | 3     | date                     | NO             | NÃO               | null                 | null              |
| relatorios_campanhas          | data_fim                  | 4     | date                     | NO             | NÃO               | null                 | null              |
| relatorios_campanhas          | periodo_tipo              | 5     | character varying        | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | valor_investido           | 6     | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | gasto_diario_medio        | 7     | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | custo_medio               | 8     | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | impressoes                | 9     | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | alcance                   | 10    | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | frequencia                | 11    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | cliques                   | 12    | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | cliques_link              | 13    | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | interacoes                | 14    | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | ctr                       | 15    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | cpc                       | 16    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | cpm                       | 17    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | cpv                       | 18    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | conversoes                | 19    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | custo_por_conversao       | 20    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | taxa_conversao            | 21    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | resultados                | 22    | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | custo_por_resultado       | 23    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | indicador_resultados      | 24    | character varying        | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | visitas_perfil            | 25    | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | taxa_interacao            | 26    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | fonte_dados               | 27    | character varying        | NO             | NÃO               | null                 | null              |
| relatorios_campanhas          | created_at                | 28    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| relatorios_campanhas          | updated_at                | 29    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | id                        | 1     | uuid                     | NO             | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | conjunto_anuncio_id       | 2     | uuid                     | YES            | SIM               | conjuntos_anuncios   | id                |
| relatorios_conjuntos_anuncios | data_inicio               | 3     | date                     | NO             | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | data_fim                  | 4     | date                     | NO             | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | valor_investido           | 5     | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | impressoes                | 6     | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | alcance                   | 7     | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | cliques                   | 8     | bigint                   | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | conversoes                | 9     | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | ctr                       | 10    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | cpc                       | 11    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | cpm                       | 12    | numeric                  | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | fonte_dados               | 13    | character varying        | NO             | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | created_at                | 14    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| relatorios_conjuntos_anuncios | updated_at                | 15    | timestamp with time zone | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | cliente                   | 1     | character varying        | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | plataforma                | 2     | character varying        | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | total_campanhas           | 3     | bigint                   | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | campanhas_ativas          | 4     | bigint                   | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | investimento_total        | 5     | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | gasto_diario_medio        | 6     | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | impressoes_total          | 7     | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | alcance_total             | 8     | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | frequencia_media          | 9     | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | cliques_total             | 10    | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | interacoes_total          | 11    | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | conversoes_total          | 12    | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | visitas_perfil_total      | 13    | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | ctr_medio                 | 14    | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | cpc_medio                 | 15    | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | cpm_medio                 | 16    | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | custo_por_conversao_medio | 17    | numeric                  | YES            | NÃO               | null                 | null              |
| resumo_por_cliente            | taxa_interacao_media      | 18    | numeric                  | YES            | NÃO               | null                 | null              |