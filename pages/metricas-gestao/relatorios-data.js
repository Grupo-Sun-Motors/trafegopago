/**
 * Sistema de dados para relatórios - Sun Motors Dashboard
 * Integração com Supabase para dados reais
 */

class RelatoriosData {
    constructor() {
        this.supabase = null;
        this.dadosCache = null;
        this.ultimaAtualizacao = null;
        this.currentPlatform = 'meta';
        this.filtrosAtivos = {};
        this.dadosFiltrados = null;
        this.init();
    }

    async init() {
        try {
            // Inicializar Supabase
            if (typeof window.supabase !== 'undefined') {
                const supabaseUrl = 'https://agdvozsqcrszflzsimyl.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZHZvenNxY3JzemZsenNpbXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDUzODksImV4cCI6MjA2OTM4MTM4OX0.pgYBlwUqLZZ7I5EOD1LFcSeBrrTy1Jf1Ep8zLjYj3LQ';
                
                this.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
                console.log('✅ Supabase inicializado para relatórios');
            } else {
                console.error('❌ Supabase não disponível');
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar Supabase:', error);
        }
    }

    /**
     * Testar conexão com Supabase
     */
    async testarConexaoSupabase() {
        try {
            console.log('🔍 DEBUG: Testando conexão com Supabase...');
            
            // Teste simples: listar tabelas ou fazer uma query básica
            const { data, error } = await this.supabase
                .from('campanhas_com_metricas')
                .select('count')
                .limit(1);
                
            if (error) {
                console.error('❌ Erro ao testar conexão:', error);
                throw error;
            }
            
            console.log('✅ Conexão com Supabase funcionando, teste:', data);
            return true;
            
        } catch (error) {
            console.error('❌ Falha na conexão com Supabase:', error);
            
            // Tentar uma query mais simples
            try {
                const { data: simpleTest } = await this.supabase
                    .from('campanhas')
                    .select('id')
                    .limit(1);
                    
                console.log('✅ Conexão básica funcionando, tabela campanhas:', simpleTest);
                return true;
            } catch (simpleError) {
                console.error('❌ Falha completa na conexão:', simpleError);
                throw simpleError;
            }
        }
    }

    /**
     * Busca dados consolidados de campanhas com métricas
     */
    async buscarDadosCampanhas(filtros = null) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase não inicializado');
            }

            console.log('🔍 Buscando dados de campanhas...', filtros);
            
            // DEBUG: Testar conexão básica primeiro
            await this.testarConexaoSupabase();

            // Construir queries com filtros se fornecidos
            let campanhasQuery = this.supabase.from('campanhas_com_metricas').select('*');
            let resumoQuery = this.supabase.from('resumo_por_cliente').select('*');
            let relatoriosQuery = this.supabase.from('relatorios_campanhas').select('*');

            // NÃO filtrar por plataforma no banco - buscar TODOS os dados
            // O filtro de plataforma será aplicado apenas na visualização
            console.log('📊 Buscando dados de TODAS as plataformas');

            // Aplicar filtros de período se existirem
            if (filtros && filtros.periodoCalculado) {
                const { dataInicio, dataFim } = filtros.periodoCalculado;
                const dataInicioStr = dataInicio.toISOString().split('T')[0];
                const dataFimStr = dataFim.toISOString().split('T')[0];

                console.log(`📅 PERÍODO SELECIONADO:`);
                console.log(`   Início: ${dataInicioStr} (${dataInicio.toLocaleDateString('pt-BR')})`);
                console.log(`   Fim: ${dataFimStr} (${dataFim.toLocaleDateString('pt-BR')})`);
                console.log(`   Timestamps: ${dataInicio.toISOString()} a ${dataFim.toISOString()}`);
                console.log(`   Diferença de dias: ${Math.ceil((dataFim - dataInicio) / (1000 * 60 * 60 * 24))}`);

                // VERIFICAÇÃO: Testar se o período é válido
                if (dataInicio > dataFim) {
                    console.error(`❌ PERÍODO INVÁLIDO: Data início (${dataInicioStr}) é maior que data fim (${dataFimStr})`);
                }

                // MELHORADO: Filtrar campanhas ativas no período específico
                // Uma campanha é relevante para o período se:
                // 1. Começou dentro do período OU
                // 2. Estava ativa durante o período (começou antes e ainda não terminou)
                
                // Para campanhas_com_metricas (dados consolidados)
                campanhasQuery = campanhasQuery
                    .gte('data_inicio', dataInicioStr)  // Começou após o início do período
                    .lte('data_inicio', dataFimStr);    // Começou antes do fim do período
                
                // Para relatórios (dados detalhados por período)
                relatoriosQuery = relatoriosQuery
                    .gte('data_inicio', dataInicioStr)
                    .lte('data_inicio', dataFimStr);
                    
                // Resumo por cliente já é consolidado, não precisa filtro de período
                console.log(`🔍 QUERY APLICADA: ${dataInicioStr} <= data_inicio <= ${dataFimStr}`);
                
                // DEBUG: Log da query construída (se possível)
                console.log(`🛠️ QUERY DEBUG: Buscando campanhas entre ${dataInicioStr} e ${dataFimStr}`);
            }

            // Aplicar filtros de marca se existirem
            if (filtros && filtros.marca && filtros.marca !== 'todas') {
                console.log(`🏷️ Filtrando por marca: ${filtros.marca}`);
                
                // Filtrar campanhas_com_metricas por cliente
                campanhasQuery = campanhasQuery.eq('cliente', filtros.marca);
                
                // Filtrar resumo_por_cliente por cliente
                resumoQuery = resumoQuery.eq('cliente', filtros.marca);
                
                // Para relatorios_campanhas, precisa fazer join ou filtrar diferente
                // Como não temos join direto, vamos aplicar o filtro depois no processamento
                console.log(`🔍 Aplicando filtro de marca: cliente = '${filtros.marca}'`);
            }

            // Aplicar filtros de status se existirem  
            if (filtros && filtros.status && filtros.status !== 'todos') {
                const statusList = filtros.status.split(',');
                console.log(`📊 Filtrando por status: ${statusList}`);
                campanhasQuery = campanhasQuery.in('status', statusList);
            }

            // Executar queries com log detalhado
            console.log('🔍 Executando queries...');
            const [campanhasResult, resumoResult, relatoriosResult] = await Promise.all([
                campanhasQuery,
                resumoQuery,
                relatoriosQuery
            ]);

            // Verificar erros com logs detalhados
            if (campanhasResult.error) {
                console.error('❌ Erro na query campanhas:', campanhasResult.error);
                throw campanhasResult.error;
            }
            if (resumoResult.error) {
                console.error('❌ Erro na query resumo:', resumoResult.error);
                throw resumoResult.error;
            }
            if (relatoriosResult.error) {
                console.error('❌ Erro na query relatórios:', relatoriosResult.error);
                throw relatoriosResult.error;
            }

            let campanhas = campanhasResult.data || [];
            let resumo = resumoResult.data || [];
            let relatorios = relatoriosResult.data || [];

            console.log(`📊 DADOS CARREGADOS DO BANCO:`);
            console.log(`   🎯 Campanhas (campanhas_com_metricas): ${campanhas.length}`);
            console.log(`   📈 Resumo (resumo_por_cliente): ${resumo.length}`);
            console.log(`   📋 Relatórios (relatorios_campanhas): ${relatorios.length}`);
            
            // Debug: mostrar exemplos dos dados retornados
            if (campanhas.length > 0) {
                console.log(`🔍 EXEMPLO DE CAMPANHA RETORNADA:`, campanhas[0]);
                
                // Verificar período se aplicado
                if (filtros && filtros.periodoCalculado) {
                    console.log(`⏰ VERIFICAÇÃO DE PERÍODO:`);
                    campanhas.slice(0, 3).forEach((campanha, i) => {
                        const dataInicioCampanha = new Date(campanha.data_inicio);
                        const { dataInicio, dataFim } = filtros.periodoCalculado;
                        const estaNoPeriodo = dataInicioCampanha >= dataInicio && dataInicioCampanha <= dataFim;
                        console.log(`   ${i+1}. ${campanha.nome || 'Sem nome'}: ${campanha.data_inicio} (${estaNoPeriodo ? 'DENTRO' : 'FORA'} do período)`);
                    });
                }
            } else {
                console.log(`⚠️ NENHUMA CAMPANHA RETORNADA! Verificar filtros de período.`);
                
                // DEBUG: Buscar algumas campanhas sem filtro para comparação
                if (filtros && filtros.periodoCalculado) {
                    console.log(`🔍 TESTE SEM FILTRO: Buscando 5 campanhas sem filtro de período...`);
                    try {
                        const testQuery = await this.supabase
                            .from('campanhas_com_metricas')
                            .select('nome, data_inicio, cliente')
                            .limit(5);
                            
                        if (testQuery.data && testQuery.data.length > 0) {
                            console.log(`✅ CAMPANHAS ENCONTRADAS SEM FILTRO:`);
                            testQuery.data.forEach((camp, i) => {
                                console.log(`   ${i+1}. ${camp.nome} | ${camp.data_inicio} | ${camp.cliente}`);
                            });
                        } else {
                            console.log(`❌ Nenhuma campanha encontrada na tabela campanhas_com_metricas`);
                        }
                    } catch (testError) {
                        console.error(`❌ Erro no teste sem filtro:`, testError);
                    }
                }
            }
            
            // Log das primeiras campanhas para debug
            if (campanhas.length > 0) {
                console.log(`📄 Primeira campanha:`, campanhas[0]);
            } else {
                console.log('⚠️ Nenhuma campanha encontrada com os filtros aplicados');
            }
            
            // Log dos primeiros resumos para debug
            if (resumo.length > 0) {
                console.log(`📊 Primeiro resumo:`, resumo[0]);
            } else {
                console.log('⚠️ Nenhum resumo encontrado');
            }

            return {
                campanhas,
                resumo,
                relatorios
            };

        } catch (error) {
            console.error('❌ Erro ao buscar dados:', error);
            return {
                campanhas: [],
                resumo: [],
                relatorios: []
            };
        }
    }

    /**
     * Processa dados para o formato esperado pela página
     */
    processarDados(dados, filtroPlataforma = null) {
        try {
            const { campanhas, resumo, relatorios } = dados;

            console.log(`🔄 Processando dados${filtroPlataforma ? ` para plataforma: ${filtroPlataforma}` : ''}`);

            // Mapear marcas
            const marcasConfig = {
                'Kia Sun Motors': {
                    nome: 'Kia Sun Motors',
                    codigo: 'KIA',
                    cor: '#DC2626',
                    icon: 'truck'
                },
                'Suzuki Sun Motors': {
                    nome: 'Suzuki Sun Motors', 
                    codigo: 'SUZUKI',
                    cor: '#2563EB',
                    icon: 'bike'
                },
                'Haojue Sun Motors': {
                    nome: 'Haojue Sun Motors',
                    codigo: 'HAOJUE', 
                    cor: '#DC2626',
                    icon: 'bike'
                },
                'Zontes Sun Motors': {
                    nome: 'Zontes Sun Motors',
                    codigo: 'ZONTES',
                    cor: '#6B7280',
                    icon: 'bike'
                }
            };

            const resultado = {};

            // Inicializar estrutura para todas as marcas
            Object.keys(marcasConfig).forEach(marca => {
                resultado[marca] = {
                    ...marcasConfig[marca],
                    meta: {
                        investimento: 0,
                        leads: 0,
                        campanhas: []
                    },
                    google: {
                        investimento: 0,
                        leads: 0,
                        campanhas: []
                    },
                    total: {
                        investimento: 0,
                        leads: 0
                    }
                };
            });

            // Processar resumo por cliente para obter totais
            resumo.forEach(item => {
                const marca = item.cliente;
                const plataforma = item.plataforma;

                if (resultado[marca]) {
                    if (plataforma === 'meta_ads') {
                        resultado[marca].meta.investimento = item.investimento_total || 0;
                        resultado[marca].meta.leads = item.conversoes_total || 0;
                    } else if (plataforma === 'google_ads') {
                        resultado[marca].google.investimento = item.investimento_total || 0;
                        resultado[marca].google.leads = item.conversoes_total || 0;
                    }
                }
            });

            // SEMPRE manter dados de ambas as plataformas nos cards
            // O filtro de plataforma é apenas para as TABELAS, não para os CARDS
            console.log('📊 Mantendo dados de ambas as plataformas para os cards');

            // Calcular totais para cada marca
            Object.keys(resultado).forEach(marca => {
                resultado[marca].total.investimento = 
                    resultado[marca].meta.investimento + resultado[marca].google.investimento;
                resultado[marca].total.leads = 
                    resultado[marca].meta.leads + resultado[marca].google.leads;
                
                // Debug dos totais
                console.log(`📊 ${marca} totais: R$ ${resultado[marca].total.investimento} | ${resultado[marca].total.leads} leads`);
            });

            // Processar campanhas individuais para detalhes das tabelas
            console.log(`🔄 Processando ${campanhas.length} campanhas individuais...`);
            campanhas.forEach((campanha, index) => {
                const marca = campanha.cliente;
                
                if (resultado[marca]) {
                    const plataforma = campanha.plataforma === 'meta_ads' ? 'meta' : 'google';
                    
                    const campanhaProcessada = {
                        id: campanha.id,
                        nome: campanha.nome,
                        status: campanha.status,
                        orcamento_diario: campanha.orcamento_valor || 0,
                        valor_usado: campanha.valor_investido || 0,
                        resultados: campanha.conversoes_total || 0,
                        impressoes: campanha.impressoes || 0,
                        alcance: campanha.alcance || 0,
                        cliques: campanha.cliques_total || 0,
                        cpm: campanha.cpm || 0,
                        cpc: campanha.cpc || 0,
                        custo_resultado: campanha.custo_por_conversao || 0
                    };

                    resultado[marca][plataforma].campanhas.push(campanhaProcessada);
                    
                    // Log da primeira campanha para debug
                    if (index === 0) {
                        console.log(`📊 Primeira campanha processada (${marca} - ${plataforma}):`, campanhaProcessada);
                    }
                } else {
                    console.log(`⚠️ Marca não encontrada: ${marca}`);
                }
            });
            
            // Log para debugging
            console.log('📊 Processamento de dados concluído:');
            Object.entries(resultado).forEach(([marca, dados]) => {
                console.log(`   ${marca}:`);
                console.log(`     Total: R$ ${dados.total.investimento.toFixed(2)} | ${dados.total.leads} leads (${dados.meta.leads}/${dados.google.leads})`);
                console.log(`     Meta: R$ ${dados.meta.investimento.toFixed(2)} | ${dados.meta.leads} leads`);
                console.log(`     Google: R$ ${dados.google.investimento.toFixed(2)} | ${dados.google.leads} leads`);
            });

            // Processar relatórios detalhados para Meta Ads (se existirem)
            relatorios.forEach(relatorio => {
                // Buscar campanha correspondente para identificar marca
                const campanhaCorrespondente = campanhas.find(c => c.id === relatorio.campanha_id);
                
                if (campanhaCorrespondente) {
                    const marca = campanhaCorrespondente.cliente;
                    
                    if (resultado[marca]) {
                        // Atualizar dados da campanha com informações do relatório
                        const campanhaIndex = resultado[marca].meta.campanhas.findIndex(
                            c => c.id === relatorio.campanha_id
                        );
                        
                        if (campanhaIndex !== -1) {
                            const campanha = resultado[marca].meta.campanhas[campanhaIndex];
                            
                            // Atualizar com dados mais detalhados do relatório
                            campanha.valor_usado = relatorio.valor_investido || campanha.valor_usado;
                            campanha.resultados = relatorio.resultados || campanha.resultados;
                            campanha.impressoes = relatorio.impressoes || campanha.impressoes;
                            campanha.alcance = relatorio.alcance || campanha.alcance;
                            campanha.cliques_link = relatorio.cliques_link || 0;
                            campanha.visitas_perfil = relatorio.visitas_perfil || 0;
                            campanha.cpm = relatorio.cpm || campanha.cpm;
                            campanha.cpc = relatorio.cpc || campanha.cpc;
                            campanha.custo_resultado = relatorio.custo_por_resultado || campanha.custo_resultado;
                            campanha.gasto_diario_medio = relatorio.gasto_diario_medio || 0;
                        }
                    }
                }
            });

            console.log('📊 Dados processados:', resultado);
            return resultado;

        } catch (error) {
            console.error('❌ Erro ao processar dados:', error);
            return {};
        }
    }

    /**
     * Obtém dados com filtros opcionais
     */
    async obterDados(forcarAtualizacao = false, filtros = null) {
        const agora = new Date();
        const cacheExpirado = !this.ultimaAtualizacao || 
            (agora - this.ultimaAtualizacao) > 5 * 60 * 1000; // 5 minutos

        // SEMPRE buscar dados frescos quando há filtros (especialmente período e plataforma)
        const deveBuscarFrescos = !this.dadosCache || cacheExpirado || forcarAtualizacao || 
            (filtros && (filtros.plataforma || filtros.periodoCalculado || filtros.marca));
        
        if (deveBuscarFrescos) {
            console.log('🔄 Buscando dados frescos...', filtros);
            
            const dadosBrutos = await this.buscarDadosCampanhas(filtros);
            const filtroPlataforma = filtros?.plataforma || null;
            
            // Processar dados e verificar se há resultados
            const dadosProcessados = this.processarDados(dadosBrutos, filtroPlataforma);
            
            // Log detalhado dos dados processados
            console.log('📊 Dados processados para exibição:');
            let temDadosReais = false;
            Object.entries(dadosProcessados).forEach(([marca, dados]) => {
                const campanhasMeta = dados.meta?.campanhas?.length || 0;
                const campanhasGoogle = dados.google?.campanhas?.length || 0;
                const totalCampanhas = campanhasMeta + campanhasGoogle;
                const investimento = dados.total?.investimento || 0;
                const leads = dados.total?.leads || 0;
                
                if (totalCampanhas > 0 || investimento > 0 || leads > 0) {
                    temDadosReais = true;
                }
                
                console.log(`   ${marca}: ${totalCampanhas} campanhas (${campanhasMeta}/${campanhasGoogle}) | R$ ${investimento} | ${leads} leads`);
            });
            
            console.log(`🔍 Resultado final: ${temDadosReais ? 'TEM DADOS REAIS' : 'SEM DADOS REAIS'}`);
            
            this.dadosCache = dadosProcessados;
            this.ultimaAtualizacao = agora;
        } else {
            console.log('📋 Usando dados em cache...');
        }

        return this.dadosCache;
    }

    /**
     * Formata valor monetário
     */
    formatarValor(valor) {
        if (!valor || valor === 0) return 'R$ 0,00';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    /**
     * Formata número
     */
    formatarNumero(numero) {
        if (!numero || numero === 0) return '0';
        
        return new Intl.NumberFormat('pt-BR').format(numero);
    }

    /**
     * Gera string de distribuição de leads (Meta/Google)
     */
    gerarDistribuicaoLeads(meta, google) {
        return `(${this.formatarNumero(meta)}/${this.formatarNumero(google)})`;
    }

    // ===== SISTEMA COMPLETO DE FILTROS =====

    /**
     * Inicializar página completa
     */
    inicializarPagina() {
        console.log('🚀 Inicializando página de relatórios...');
        
        // DEBUG: Verificar se Supabase está disponível
        this.debugSupabaseStatus();
        
        // Configurar eventos
        document.getElementById('btn-atualizar').addEventListener('click', () => {
            this.aplicarFiltrosBasicos(true); // Forçar atualização
        });
        
        // Inicializar sistema de filtros
        this.inicializarFiltros();
        
        // APLICAR FILTROS BÁSICOS IMEDIATAMENTE
        console.log('🎯 Aplicando filtros iniciais...');
        this.aplicarFiltrosBasicos();
    }

    /**
     * Debug: Verificar status do Supabase
     */
    debugSupabaseStatus() {
        console.log('🔍 DEBUG: Verificando status do Supabase...');
        console.log('🔍 window.supabase disponível:', !!window.supabase);
        console.log('🔍 SUPABASE_URL:', window.SUPABASE_URL);
        console.log('🔍 SUPABASE_ANON_KEY presente:', !!window.SUPABASE_ANON_KEY);
        console.log('🔍 this.supabase inicializado:', !!this.supabase);
        
        if (!window.supabase) {
            console.error('❌ window.supabase não está disponível!');
            this.mostrarErroConexao('Supabase não carregado');
            return false;
        }
        
        if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
            console.error('❌ Configurações do Supabase não encontradas!');
            this.mostrarErroConexao('Configurações ausentes');
            return false;
        }
        
        console.log('✅ Supabase parece estar configurado corretamente');
        return true;
    }

    /**
     * Mostrar erro de conexão
     */
    mostrarErroConexao(erro) {
        const statusEl = document.getElementById('status-conexao');
        if (statusEl) {
            statusEl.textContent = `Erro: ${erro}`;
            statusEl.previousElementSibling?.querySelector('.rounded-full')?.classList.add('bg-red-500');
        }
        
        // Mostrar aviso na interface
        this.mostrarAvisoErroConexao(erro);
    }

    /**
     * Mostrar aviso de erro de conexão
     */
    mostrarAvisoErroConexao(erro) {
        const aviso = document.createElement('div');
        aviso.id = 'aviso-erro-conexao';
        aviso.className = 'bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-center mx-6';
        aviso.innerHTML = `
            <div class="flex items-center justify-center space-x-3">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <h3 class="text-lg font-semibold text-red-800">Erro de Conexão</h3>
                    <p class="text-red-700 mt-1">Não foi possível conectar ao banco de dados: ${erro}</p>
                    <p class="text-sm text-red-600 mt-2">Verifique se o Supabase está configurado corretamente.</p>
                </div>
            </div>
        `;
        
        const contentContainer = document.querySelector('.content-container');
        if (contentContainer) {
            contentContainer.insertBefore(aviso, contentContainer.firstChild);
        }
    }

    /**
     * Inicializar sistema de filtros completo
     */
    inicializarFiltros() {
        console.log('🔧 Inicializando sistema de filtros...');
        
        // Event listeners para controles da interface
        document.getElementById('toggle-filtros-avancados').addEventListener('click', this.toggleFiltrosAvancados.bind(this));
        document.getElementById('btn-aplicar-filtros').addEventListener('click', this.aplicarFiltros.bind(this));
        document.getElementById('btn-limpar-filtros').addEventListener('click', this.limparFiltros.bind(this));
        
        // Event listeners para filtros básicos (aplicação automática)
        document.getElementById('filtro-periodo').addEventListener('change', (e) => {
            console.log(`🔄 Período alterado para: ${e.target.value} - aplicando filtros automaticamente`);
            this.handlePeriodoChange(); // Primeiro lidar com período personalizado
            setTimeout(() => this.aplicarFiltrosBasicos(), 100); // Aplicar após breve delay
        });
        
        document.getElementById('filtro-marca').addEventListener('change', (e) => {
            console.log(`🔄 Marca alterada para: ${e.target.value} - aplicando filtros automaticamente`);
            setTimeout(() => this.aplicarFiltrosBasicos(), 100);
        });
        
        document.getElementById('filtro-status').addEventListener('change', (e) => {
            console.log(`🔄 Status alterado para: ${e.target.value} - aplicando filtros automaticamente`);
            setTimeout(() => this.aplicarFiltrosBasicos(), 100);
        });
        
        // Event listeners para datas personalizadas (com validação)
        document.getElementById('data-inicio').addEventListener('change', (e) => {
            console.log(`🔄 Data início alterada para: ${e.target.value}`);
            const dataFim = document.getElementById('data-fim').value;
            if (dataFim) { // Só aplicar se ambas as datas estiverem preenchidas
                console.log('📅 Ambas as datas preenchidas - aplicando filtros');
                setTimeout(() => this.aplicarFiltrosBasicos(), 100);
            } else {
                console.log('⏳ Aguardando data fim...');
            }
        });
        
        document.getElementById('data-fim').addEventListener('change', (e) => {
            console.log(`🔄 Data fim alterada para: ${e.target.value}`);
            const dataInicio = document.getElementById('data-inicio').value;
            if (dataInicio) { // Só aplicar se ambas as datas estiverem preenchidas
                console.log('📅 Ambas as datas preenchidas - aplicando filtros');
                setTimeout(() => this.aplicarFiltrosBasicos(), 100);
            } else {
                console.log('⏳ Aguardando data início...');
            }
        });

        // Event listeners para toggle Meta/Google
        document.getElementById('meta-btn').addEventListener('click', () => {
            this.alterarPlataforma('meta');
        });
        
        document.getElementById('google-btn').addEventListener('click', () => {
            this.alterarPlataforma('google');
        });
        
        // Inicializar contadores
        this.atualizarContadorFiltros();
        this.atualizarContadorResultados();
        
        console.log('✅ Sistema de filtros inicializado com event listeners automáticos');
    }

    /**
     * Toggle filtros avançados
     */
    toggleFiltrosAvancados() {
        const filtrosAvancados = document.getElementById('filtros-avancados');
        const chevron = document.getElementById('chevron-filtros');
        
        if (filtrosAvancados.classList.contains('hidden')) {
            filtrosAvancados.classList.remove('hidden');
            chevron.style.transform = 'rotate(180deg)';
        } else {
            filtrosAvancados.classList.add('hidden');
            chevron.style.transform = 'rotate(0deg)';
        }
    }

    /**
     * Lidar com mudança de período
     */
    handlePeriodoChange() {
        const periodo = document.getElementById('filtro-periodo').value;
        const periodoPersonalizado = document.getElementById('periodo-personalizado');
        
        if (periodo === 'personalizado') {
            periodoPersonalizado.classList.remove('hidden');
            // Definir datas padrão
            const hoje = new Date();
            const umMesAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
            
            document.getElementById('data-inicio').value = umMesAtras.toISOString().split('T')[0];
            document.getElementById('data-fim').value = hoje.toISOString().split('T')[0];
        } else {
            periodoPersonalizado.classList.add('hidden');
        }
    }

    /**
     * Calcular período baseado na seleção
     */
    calcularPeriodo(tipoPeriodo) {
        const hoje = new Date();
        let dataInicio, dataFim;
        
        console.log(`🔍 Calculando período para: ${tipoPeriodo}`);
        
        switch (tipoPeriodo) {
            case 'ultimos-7':
                dataInicio = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
                dataFim = hoje;
                break;
            case 'ultimos-30':
                dataInicio = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
                dataFim = hoje;
                break;
            case 'ultimos-90':
                dataInicio = new Date(hoje.getTime() - 90 * 24 * 60 * 60 * 1000);
                dataFim = hoje;
                break;
            case 'mes-atual':
                // CORRIGIDO: Mês atual completo (do primeiro ao último dia)
                dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                dataFim = hoje; // Até hoje (não o mês completo)
                break;
            case 'mes-anterior':
                // CORRIGIDO: Mês anterior completo
                dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
                dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0); // Último dia do mês anterior
                // Ajustar para fim do dia
                dataFim.setHours(23, 59, 59, 999);
                
                // DEBUG: Log detalhado do mês anterior
                console.log('📅 DEBUG - Mês Anterior:');
                console.log(`   Hoje: ${hoje.toLocaleDateString('pt-BR')}`);
                console.log(`   Mês atual: ${hoje.getMonth() + 1}/${hoje.getFullYear()}`);
                console.log(`   Mês anterior: ${hoje.getMonth()}/${hoje.getFullYear()}`);
                console.log(`   Data início: ${dataInicio.toLocaleDateString('pt-BR')} (${dataInicio.toISOString()})`);
                console.log(`   Data fim: ${dataFim.toLocaleDateString('pt-BR')} (${dataFim.toISOString()})`);
                break;
            case 'trimestre-atual':
                const trimestreAtual = Math.floor(hoje.getMonth() / 3);
                dataInicio = new Date(hoje.getFullYear(), trimestreAtual * 3, 1);
                // Último dia do trimestre ou hoje se ainda estamos no trimestre
                const ultimoDiaDoTrimestre = new Date(hoje.getFullYear(), (trimestreAtual + 1) * 3, 0);
                dataFim = hoje < ultimoDiaDoTrimestre ? hoje : ultimoDiaDoTrimestre;
                break;
            case 'personalizado':
                const dataInicioInput = document.getElementById('data-inicio').value;
                const dataFimInput = document.getElementById('data-fim').value;
                if (dataInicioInput && dataFimInput) {
                    dataInicio = new Date(dataInicioInput + 'T00:00:00');
                    dataFim = new Date(dataFimInput + 'T23:59:59');
                    
                    // Validar se data fim é maior que data início
                    if (dataFim < dataInicio) {
                        console.log('⚠️ Data fim anterior à data início - corrigindo automaticamente');
                        const temp = dataInicio;
                        dataInicio = dataFim;
                        dataFim = temp;
                    }
                    
                    console.log(`📅 Período personalizado: ${dataInicio.toISOString()} a ${dataFim.toISOString()}`);
                } else {
                    console.log(`⚠️ Período personalizado incompleto: início=${dataInicioInput}, fim=${dataFimInput}`);
                    return null;
                }
                break;
            default:
                console.log('⚠️ Período "todos" selecionado - sem filtro de data');
                return null; // Todos os períodos
        }
        
        if (dataInicio && dataFim) {
            // Garantir que o início do dia seja 00:00:00
            dataInicio.setHours(0, 0, 0, 0);
            
            console.log(`📅 Período calculado: ${dataInicio.toISOString().split('T')[0]} a ${dataFim.toISOString().split('T')[0]}`);
            console.log(`📅 Timestamps: ${dataInicio.toISOString()} a ${dataFim.toISOString()}`);
            return { dataInicio, dataFim };
        } else {
            console.log('⚠️ Erro ao calcular período');
            return null;
        }
    }

    /**
     * Obter filtros ativos completos
     */
    obterFiltrosAtivos() {
        const filtros = {
            periodo: document.getElementById('filtro-periodo').value,
            marca: document.getElementById('filtro-marca').value,
            status: document.getElementById('filtro-status').value,
            comparacao: document.getElementById('filtro-comparacao').value,
            tipoCampanha: document.getElementById('filtro-tipo-campanha').value,
            cpcMin: parseFloat(document.getElementById('cpc-min').value) || null,
            cpcMax: parseFloat(document.getElementById('cpc-max').value) || null,
            investimentoMin: parseFloat(document.getElementById('investimento-min').value) || null,
            investimentoMax: parseFloat(document.getElementById('investimento-max').value) || null,
            leadsMin: parseInt(document.getElementById('leads-min').value) || null,
            leadsMax: parseInt(document.getElementById('leads-max').value) || null,
            cpmMin: parseFloat(document.getElementById('cpm-min').value) || null,
            cpmMax: parseFloat(document.getElementById('cpm-max').value) || null
        };

        // Calcular período se necessário
        if (filtros.periodo !== 'todos') {
            filtros.periodoCalculado = this.calcularPeriodo(filtros.periodo);
        }

        return filtros;
    }

    /**
     * Aplicar filtros avançados e comparação
     */
    async aplicarFiltros() {
        console.log('🔍 Aplicando filtros avançados e comparação...');
        
        try {
            // Obter todos os filtros (básicos + avançados)
            const todosOsFiltros = this.obterFiltrosAtivos();
            console.log('📋 Todos os filtros:', todosOsFiltros);
            
            // Sempre recarregar dados quando há filtros (incluindo plataforma)
            this.updateStatusConexao('Aplicando filtros...', 'warning');
            this.dadosRelatorios = await this.obterDados(true, todosOsFiltros);
            
            // Aplicar todos os filtros aos dados
            this.dadosFiltrados = this.filtrarDados(this.dadosRelatorios, todosOsFiltros);
            
            // Verificar se há dados para mostrar
            const temDados = this.verificarSeDadosExistem(this.dadosFiltrados);
            
            if (!temDados) {
                console.log('⚠️ Nenhum dado encontrado para os filtros aplicados');
                this.mostrarEstadoSemDados();
            } else {
                console.log('✅ Dados encontrados nos filtros avançados');
                this.esconderEstadoSemDados();
                // Atualizar interface com dados filtrados
                this.atualizarCardsComFiltros(this.dadosFiltrados);
                this.atualizarTabelasComFiltros(this.dadosFiltrados);
            }
            
            // Aplicar comparação se solicitada
            if (todosOsFiltros.comparacao !== 'nenhuma') {
                await this.aplicarComparacao(todosOsFiltros);
            }
            
            // Atualizar variáveis globais e contadores
            this.filtrosAtivos = todosOsFiltros;
            this.atualizarContadorFiltros();
            this.atualizarContadorResultados();
            
            this.updateStatusConexao('Conectado', 'success');
            console.log('✅ Filtros avançados aplicados com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao aplicar filtros avançados:', error);
            this.updateStatusConexao('Erro ao aplicar filtros', 'error');
        }
    }

    /**
     * Aplicar filtros básicos automaticamente
     */
    async aplicarFiltrosBasicos(forcarAtualizacao = false) {
        console.log('🔄 Aplicando filtros básicos automaticamente...');
        
        try {
            const filtrosBasicos = {
                periodo: document.getElementById('filtro-periodo').value,
                marca: document.getElementById('filtro-marca').value,
                status: document.getElementById('filtro-status').value
                // REMOVIDO filtro de plataforma - buscar TODOS os dados sempre
            };
            
            // Calcular período se necessário
            if (filtrosBasicos.periodo !== 'todos') {
                const periodoCalculado = this.calcularPeriodo(filtrosBasicos.periodo);
                if (periodoCalculado) {
                    filtrosBasicos.periodoCalculado = periodoCalculado;
                    console.log('✅ Período calculado com sucesso');
                } else {
                    console.log('⚠️ Erro ao calcular período - usando todos os períodos');
                }
            }
            
            console.log('📋 Aplicando filtros básicos (SEM filtro de plataforma):', filtrosBasicos);
            
            // Log detalhado dos filtros
            console.log(`   🔹 Período: ${filtrosBasicos.periodo}`);
            console.log(`   🔹 Marca: ${filtrosBasicos.marca}`);
            console.log(`   🔹 Status: ${filtrosBasicos.status}`);
            if (filtrosBasicos.periodoCalculado) {
                console.log(`   📅 Período calculado: ${filtrosBasicos.periodoCalculado.dataInicio.toISOString().split('T')[0]} a ${filtrosBasicos.periodoCalculado.dataFim.toISOString().split('T')[0]}`);
            }
            
            // Recarregar dados com filtros corretos (sem filtro de plataforma)
            this.updateStatusConexao('Carregando dados filtrados...', 'warning');
            console.log('🔍 Buscando dados do Supabase...');
            this.dadosRelatorios = await this.obterDados(true, filtrosBasicos);
            console.log('📊 Dados recebidos do backend:', this.dadosRelatorios);
            
            // Verificar se dados foram recebidos
            if (!this.dadosRelatorios) {
                console.log('❌ Nenhum dado retornado do backend');
                this.dadosFiltrados = null;
            } else {
                const totalMarcas = Object.keys(this.dadosRelatorios).length;
                console.log(`📈 Dados brutos recebidos: ${totalMarcas} marcas`);
                
                // Log de cada marca
                Object.entries(this.dadosRelatorios).forEach(([marca, dados]) => {
                    const campanhasMeta = dados.meta?.campanhas?.length || 0;
                    const campanhasGoogle = dados.google?.campanhas?.length || 0;
                    console.log(`   📊 ${marca}: ${campanhasMeta + campanhasGoogle} campanhas (${campanhasMeta} Meta + ${campanhasGoogle} Google)`);
                });
                
                // Aplicar filtros adicionais aos dados
                this.dadosFiltrados = this.filtrarDados(this.dadosRelatorios, filtrosBasicos);
                console.log('🎯 Dados após filtros aplicados:', this.dadosFiltrados);
            }
            
            // Verificar se há dados para mostrar
            const temDados = this.verificarSeDadosExistem(this.dadosFiltrados);
            console.log(`🔍 Resultado verificação: ${temDados ? 'TEM DADOS' : 'SEM DADOS'}`);
            
            if (!temDados) {
                console.log('⚠️ Nenhum dado encontrado para os filtros aplicados');
                this.mostrarEstadoSemDados();
            } else {
                console.log('✅ Dados encontrados - atualizando interface');
                this.esconderEstadoSemDados();
                // Atualizar interface com dados filtrados
                this.atualizarCardsComFiltros(this.dadosFiltrados);
                this.atualizarTabelasComFiltros(this.dadosFiltrados);
            }
            
            // Atualizar contadores
            this.filtrosAtivos = filtrosBasicos;
            this.atualizarContadorFiltros();
            this.atualizarContadorResultados();
            
            this.updateStatusConexao('Conectado', 'success');
            console.log('✅ Filtros básicos aplicados com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao aplicar filtros básicos:', error);
            console.error('📝 Stack trace:', error.stack);
            this.updateStatusConexao('Erro ao aplicar filtros', 'error');
            
            // Em caso de erro, mostrar estado sem dados
            this.mostrarEstadoSemDados();
        }
    }

    // Adicionar função showPlatform para compatibilidade com HTML
    showPlatform(platform) {
        this.alterarPlataforma(platform);
    }

    /**
     * Alterar plataforma APENAS para visualização (sem recarregar dados)
     */
    alterarPlataforma(platform) {
        console.log(`🎯 Mudando visualização para plataforma: ${platform}`);
        
        const metaBtn = document.getElementById('meta-btn');
        const googleBtn = document.getElementById('google-btn');
        const metaData = document.getElementById('meta-data');
        const googleData = document.getElementById('google-data');

        // Atualizar plataforma atual
        this.currentPlatform = platform;

        // Atualizar UI dos botões
        if (platform === 'meta') {
            metaData.style.display = 'block';
            googleData.style.display = 'none';
            metaBtn.classList.add('active');
            googleBtn.classList.remove('active');
        } else {
            metaData.style.display = 'none';
            googleData.style.display = 'block';
            metaBtn.classList.remove('active');
            googleBtn.classList.add('active');
        }
        
        // Apenas atualizar as TABELAS (não recarregar dados)
        if (this.dadosFiltrados) {
            this.atualizarTabelasComFiltros(this.dadosFiltrados);
            console.log('🔄 Tabelas atualizadas para nova plataforma');
        }
    }

    /**
     * Filtrar dados baseado nos critérios
     */
    filtrarDados(dados, filtros) {
        if (!dados) return null;
        
        const dadosFiltrados = {};
        
        Object.keys(dados).forEach(marca => {
            // Filtro de marca
            if (filtros.marca !== 'todas' && marca !== filtros.marca) {
                return;
            }
            
            const dadosMarca = JSON.parse(JSON.stringify(dados[marca])); // Deep copy
            
            // Filtrar campanhas por critérios
            ['meta', 'google'].forEach(plataforma => {
                dadosMarca[plataforma].campanhas = dadosMarca[plataforma].campanhas.filter(campanha => {
                    // Filtro de status
                    if (filtros.status !== 'todos') {
                        const statusPermitidos = filtros.status.split(',');
                        if (!statusPermitidos.includes(campanha.status)) {
                            return false;
                        }
                    }
                    
                    // Filtro de tipo de campanha
                    if (filtros.tipoCampanha !== 'todos') {
                        const tipoCampanha = this.extrairTipoCampanha(campanha.nome);
                        if (tipoCampanha !== filtros.tipoCampanha) {
                            return false;
                        }
                    }
                    
                    // Filtros de faixa de valores
                    if (filtros.cpcMin && campanha.cpc < filtros.cpcMin) return false;
                    if (filtros.cpcMax && campanha.cpc > filtros.cpcMax) return false;
                    if (filtros.investimentoMin && campanha.valor_usado < filtros.investimentoMin) return false;
                    if (filtros.investimentoMax && campanha.valor_usado > filtros.investimentoMax) return false;
                    if (filtros.leadsMin && campanha.resultados < filtros.leadsMin) return false;
                    if (filtros.leadsMax && campanha.resultados > filtros.leadsMax) return false;
                    if (filtros.cpmMin && campanha.cpm < filtros.cpmMin) return false;
                    if (filtros.cpmMax && campanha.cpm > filtros.cpmMax) return false;
                    
                    return true;
                });
                
                // Recalcular totais para a plataforma
                dadosMarca[plataforma].investimento = dadosMarca[plataforma].campanhas.reduce((total, c) => total + c.valor_usado, 0);
                dadosMarca[plataforma].leads = dadosMarca[plataforma].campanhas.reduce((total, c) => total + c.resultados, 0);
            });
            
            // Recalcular totais gerais
            dadosMarca.total.investimento = dadosMarca.meta.investimento + dadosMarca.google.investimento;
            dadosMarca.total.leads = dadosMarca.meta.leads + dadosMarca.google.leads;
            
            dadosFiltrados[marca] = dadosMarca;
        });
        
        return dadosFiltrados;
    }

    /**
     * Extrair tipo de campanha do nome
     */
    extrairTipoCampanha(nomeCampanha) {
        if (nomeCampanha.includes('[PMAX]')) return 'PMAX';
        if (nomeCampanha.includes('[Pesquisa]')) return 'Pesquisa';
        if (nomeCampanha.includes('[Display]')) return 'Display';
        if (nomeCampanha.includes('[Video]')) return 'Video';
        return 'outros';
    }

    /**
     * Atualizar cards com dados filtrados
     */
    atualizarCardsComFiltros(dadosFiltrados) {
        if (!dadosFiltrados) {
            this.atualizarCards(); // Usar dados originais
            return;
        }
        
        const marcas = ['Kia Sun Motors', 'Suzuki Sun Motors', 'Haojue Sun Motors', 'Zontes Sun Motors'];
        
        marcas.forEach(marca => {
            const dados = dadosFiltrados[marca];
            if (!dados) return;
            
            const prefix = marca.split(' ')[0].toLowerCase();
            
            // Atualizar seção Meta Ads
            this.atualizarCardsMarca(prefix, dados, '');
            
            // Atualizar seção Google Ads (mesmos dados, mas com sufixo)
            this.atualizarCardsMarca(prefix, dados, '-google');
        });
    }

    /**
     * Função auxiliar para atualizar cards de uma marca
     */
    atualizarCardsMarca(prefix, dados, sufixo) {
        const valorTotalEl = document.getElementById(`${prefix}-valor-total${sufixo}`);
        const googleValorEl = document.getElementById(`${prefix}-google-valor${sufixo}`);
        const metaValorEl = document.getElementById(`${prefix}-meta-valor${sufixo}`);
        const leadsTotalEl = document.getElementById(`${prefix}-leads-total${sufixo}`);
        const leadsDistribEl = document.getElementById(`${prefix}-leads-distribuicao${sufixo}`);
        
        if (valorTotalEl) {
            valorTotalEl.textContent = this.formatarValor(dados.total.investimento);
        }
        
        if (googleValorEl) {
            googleValorEl.textContent = this.formatarValor(dados.google.investimento);
        }
        
        if (metaValorEl) {
            metaValorEl.textContent = this.formatarValor(dados.meta.investimento);
        }
        
        if (leadsTotalEl) {
            leadsTotalEl.textContent = this.formatarNumero(dados.total.leads);
        }
        
        if (leadsDistribEl) {
            leadsDistribEl.textContent = this.gerarDistribuicaoLeads(
                dados.meta.leads,
                dados.google.leads
            );
        }
    }

    /**
     * Atualizar tabelas com dados filtrados
     */
    atualizarTabelasComFiltros(dadosFiltrados) {
        console.log('📊 Atualizando tabelas com filtros...', `Plataforma ativa: ${this.currentPlatform}`);
        
        // Sempre popular as tabelas, mesmo sem dados
        this.popularTabelasDinamicamente(dadosFiltrados);
        
        if (!dadosFiltrados) return;
        
        // Calcular e atualizar totais para cada marca
        const marcas = ['Kia Sun Motors', 'Suzuki Sun Motors', 'Haojue Sun Motors', 'Zontes Sun Motors'];
        
        marcas.forEach(marca => {
            const dados = dadosFiltrados[marca];
            if (!dados) return;
            
            const prefix = marca.split(' ')[0].toLowerCase();
            
            // FILTRO DE PLATAFORMA APLICADO APENAS NAS TABELAS
            let campanhasParaCalcular = [];
            if (this.currentPlatform === 'meta') {
                campanhasParaCalcular = dados.meta?.campanhas || [];
                console.log(`🟦 ${marca} - Meta: ${campanhasParaCalcular.length} campanhas`);
            } else {
                campanhasParaCalcular = dados.google?.campanhas || [];
                console.log(`🔵 ${marca} - Google: ${campanhasParaCalcular.length} campanhas`);
            }
            
            // Calcular totais
            const totais = this.calcularTotaisTabela(campanhasParaCalcular);
            console.log(`💰 ${marca} - Totais calculados:`, totais);
            
            // Atualizar elementos na DOM
            this.atualizarTotaisDOM(prefix, totais, this.currentPlatform === 'google' ? '-google' : '');
        });
        
        // Renderizar ícones do Lucide após todas as atualizações
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Popular tabelas dinamicamente (mesmo sem dados)
     */
    popularTabelasDinamicamente(dadosFiltrados) {
        console.log('🔧 DEBUG: Populando tabelas dinamicamente...');
        
        const marcas = ['Kia Sun Motors', 'Suzuki Sun Motors', 'Haojue Sun Motors', 'Zontes Sun Motors'];
        const prefixos = ['kia', 'suzuki', 'haojue', 'zontes'];
        
        marcas.forEach((marca, index) => {
            const prefix = prefixos[index];
            
            // Buscar as tabelas Meta e Google para esta marca
            const tabelasMeta = document.querySelectorAll(`#meta-data tbody`);
            const tabelasGoogle = document.querySelectorAll(`#google-data tbody`);
            
            if (tabelasMeta[index]) {
                this.popularTabelaIndividual(tabelasMeta[index], dadosFiltrados, marca, 'meta');
            }
            
            if (tabelasGoogle[index]) {
                this.popularTabelaIndividual(tabelasGoogle[index], dadosFiltrados, marca, 'google');
            }
        });
    }

    /**
     * Popular uma tabela individual
     */
    popularTabelaIndividual(tbody, dadosFiltrados, marca, plataforma) {
        // Limpar conteúdo existente
        tbody.innerHTML = '';
        
        if (!dadosFiltrados || !dadosFiltrados[marca] || !dadosFiltrados[marca][plataforma]) {
            // Mostrar mensagem de sem dados
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-8 text-gray-500">
                        Nenhuma campanha encontrada para ${marca} - ${plataforma}
                    </td>
                </tr>
            `;
            return;
        }
        
        const campanhas = dadosFiltrados[marca][plataforma].campanhas || [];
        
        if (campanhas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-8 text-gray-500">
                        Nenhuma campanha ativa para os filtros selecionados
                    </td>
                </tr>
            `;
            return;
        }
        
        // Popular com dados reais
        campanhas.forEach(campanha => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            // Extrair informações da campanha para determinar o ícone
            const nomeCompleto = campanha.nome || 'Campanha sem nome';
            const iconeVeiculo = this.obterIconeVeiculo(nomeCompleto, marca);
            
            row.innerHTML = `
                <td class="p-3 text-sm">
                    <div class="campaign-name flex items-center space-x-2">
                        ${iconeVeiculo}
                        <span class="text-gray-900">${nomeCompleto}</span>
                    </div>
                </td>
                <td class="p-3 text-sm text-right text-gray-900">${this.formatarValor(campanha.orcamento_diario || 0)}</td>
                <td class="p-3 text-sm text-right text-red-600 font-medium">${this.formatarValor(campanha.valor_usado || 0)}</td>
                <td class="p-3 text-sm text-right text-blue-600 font-semibold">${this.formatarNumero(campanha.resultados || 0)}</td>
                <td class="p-3 text-sm text-right text-gray-900">${this.formatarValor(campanha.custo_por_resultado || 0)}</td>
                <td class="p-3 text-sm text-right text-gray-900">${this.formatarValor(campanha.cpm || 0)}</td>
                <td class="p-3 text-sm text-right text-gray-900">${this.formatarNumero(campanha.alcance || 0)}</td>
                <td class="p-3 text-sm text-right text-gray-900">${this.formatarNumero(campanha.impressoes || 0)}</td>
                <td class="p-3 text-sm text-right text-gray-900">${this.formatarNumero(campanha.cliques || 0)}</td>
                <td class="p-3 text-sm text-right text-gray-900">${this.formatarValor(campanha.cpc || 0)}</td>
            `;
            tbody.appendChild(row);
        });
        
        console.log(`✅ Tabela populada: ${marca} - ${plataforma} com ${campanhas.length} campanhas`);
        
        // Renderizar ícones do Lucide após popular a tabela
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Obter ícone de veículo baseado no nome da campanha
     */
    obterIconeVeiculo(nomeCampanha, marca) {
        const nomeUpper = nomeCampanha.toUpperCase();
        const marcaUpper = marca.toUpperCase();
        
        // === KIA MODELOS ===
        if (nomeUpper.includes('BONGO')) {
            return '<i data-lucide="truck" class="w-5 h-5 text-gray-700"></i>';
        }
        
        if (nomeUpper.includes('SPORTAGE')) {
            return '<i data-lucide="car" class="w-5 h-5 text-gray-700"></i>';
        }
        
        if (nomeUpper.includes('PASSEIO') || nomeUpper.includes('NIRO')) {
            return '<i data-lucide="car" class="w-5 h-5 text-green-600"></i>';
        }
        
        if (nomeUpper.includes('CARNIVAL')) {
            return '<i data-lucide="car-front" class="w-5 h-5 text-gray-700"></i>';
        }
        
        if (nomeUpper.includes('EV5')) {
            return '<i data-lucide="car" class="w-5 h-5 text-blue-500"></i>';
        }
        
        if (nomeUpper.includes('STONIC')) {
            return '<i data-lucide="car" class="w-5 h-5 text-purple-600"></i>';
        }
        
        // === SUZUKI MODELOS ===
        if (nomeUpper.includes('GSX-8S') || nomeUpper.includes('GSX8S')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-blue-700"></i>';
        }
        
        if (nomeUpper.includes('V-STROM 650') || nomeUpper.includes('V-STROM650')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-orange-600"></i>';
        }
        
        if (nomeUpper.includes('V-STROM 800') || nomeUpper.includes('V-STROM800') || nomeUpper.includes('V-STROM 800DE')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-yellow-500"></i>';
        }
        
        if (nomeUpper.includes('GSX-8R') || nomeUpper.includes('GSX8R')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-red-700"></i>';
        }
        
        // === HAOJUE MODELOS ===
        if (nomeUpper.includes('MASTER RIDE') || nomeUpper.includes('MASTERRIDE')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-blue-600"></i>';
        }
        
        if (nomeUpper.includes('DR160') || nomeUpper.includes('DR 160')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-red-600"></i>';
        }
        
        if (nomeUpper.includes('DK160') || nomeUpper.includes('DK 160')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-green-600"></i>';
        }
        
        if (nomeUpper.includes('NK150') || nomeUpper.includes('NK 150')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-purple-600"></i>';
        }
        
        if (nomeUpper.includes('CHOPPER')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-gray-500"></i>';
        }
        
        // === ZONTES MODELOS ===
        if (nomeUpper.includes('V350') || nomeUpper.includes('V 350')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-gray-800"></i>';
        }
        
        if (nomeUpper.includes('T350') || nomeUpper.includes('T 350')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-cyan-600"></i>';
        }
        
        if (nomeUpper.includes('TACTIC 400') || nomeUpper.includes('TACTIC400')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-lime-600"></i>';
        }
        
        if (nomeUpper.includes('S350') || nomeUpper.includes('S 350')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-fuchsia-600"></i>';
        }
        
        if (nomeUpper.includes('R350') || nomeUpper.includes('R 350')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-red-500"></i>';
        }
        
        if (nomeUpper.includes('GK350') || nomeUpper.includes('GK 350')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-teal-500"></i>';
        }
        
        // === TIPOS DE CAMPANHA GOOGLE ===
        if (nomeUpper.includes('INSTITUCIONAL')) {
            return '<i data-lucide="building-2" class="w-5 h-5 text-gray-700"></i>';
        }
        
        if (nomeUpper.includes('PMAX')) {
            return '<i data-lucide="zap" class="w-5 h-5 text-blue-600"></i>';
        }
        
        if (nomeUpper.includes('PESQUISA')) {
            return '<i data-lucide="search" class="w-5 h-5 text-green-600"></i>';
        }
        
        // === ÍCONES POR MARCA (FALLBACK) ===
        if (marcaUpper.includes('KIA')) {
            return '<i data-lucide="car" class="w-5 h-5 text-gray-700"></i>';
        }
        
        if (marcaUpper.includes('SUZUKI') || marcaUpper.includes('HAOJUE') || marcaUpper.includes('ZONTES')) {
            return '<i data-lucide="bike" class="w-5 h-5 text-gray-700"></i>';
        }
        
        // Ícone padrão
        return '<i data-lucide="car" class="w-5 h-5 text-gray-700"></i>';
    }

    /**
     * Calcular totais de uma lista de campanhas
     */
    calcularTotaisTabela(campanhas) {
        console.log(`🧮 Calculando totais para ${campanhas?.length || 0} campanhas:`, campanhas);
        
        if (!campanhas || campanhas.length === 0) {
            console.log('⚠️ Nenhuma campanha para calcular totais');
            return {
                gastoDiario: 0,
                valorUsado: 0,
                resultados: 0,
                custoResultado: 0,
                cpm: 0,
                alcance: 0,
                impressoes: 0,
                cliques: 0,
                cpc: 0,
                visitas: 0
            };
        }
        
        const totais = {
            gastoDiario: 0,
            valorUsado: 0,
            resultados: 0,
            custoResultado: 0,
            cpm: 0,
            alcance: 0,
            impressoes: 0,
            cliques: 0,
            cpc: 0,
            visitas: 0
        };
        
        campanhas.forEach(campanha => {
            totais.gastoDiario += campanha.orcamento_diario || 0;
            totais.valorUsado += campanha.valor_usado || 0;
            totais.resultados += campanha.resultados || 0;
            totais.alcance += campanha.alcance || 0;
            totais.impressoes += campanha.impressoes || 0;
            totais.cliques += campanha.cliques || 0;
            totais.visitas += campanha.visitas_perfil || 0;
        });
        
        // Calcular médias ponderadas
        if (campanhas.length > 0) {
            totais.custoResultado = totais.resultados > 0 ? totais.valorUsado / totais.resultados : 0;
            totais.cpm = totais.impressoes > 0 ? (totais.valorUsado / totais.impressoes) * 1000 : 0;
            totais.cpc = totais.cliques > 0 ? totais.valorUsado / totais.cliques : 0;
        }
        
        return totais;
    }

    /**
     * Atualizar totais na DOM
     */
    atualizarTotaisDOM(prefix, totais, sufixo = '') {
        const elementos = {
            gastoDiario: document.getElementById(`${prefix}-total-gasto-diario${sufixo}`),
            valorUsado: document.getElementById(`${prefix}-total-valor-usado${sufixo}`),
            resultados: document.getElementById(`${prefix}-total-resultados${sufixo}`),
            custoResultado: document.getElementById(`${prefix}-total-custo-resultado${sufixo}`),
            cpm: document.getElementById(`${prefix}-total-cpm${sufixo}`),
            alcance: document.getElementById(`${prefix}-total-alcance${sufixo}`),
            impressoes: document.getElementById(`${prefix}-total-impressoes${sufixo}`),
            cliques: document.getElementById(`${prefix}-total-cliques${sufixo}`),
            cpc: document.getElementById(`${prefix}-total-cpc${sufixo}`),
            visitas: document.getElementById(`${prefix}-total-visitas${sufixo}`)
        };
        
        // Atualizar cada elemento se existir
        if (elementos.gastoDiario) elementos.gastoDiario.textContent = this.formatarValor(totais.gastoDiario);
        if (elementos.valorUsado) elementos.valorUsado.textContent = this.formatarValor(totais.valorUsado);
        if (elementos.resultados) elementos.resultados.textContent = this.formatarNumero(totais.resultados);
        if (elementos.custoResultado) elementos.custoResultado.textContent = this.formatarValor(totais.custoResultado);
        if (elementos.cpm) elementos.cpm.textContent = this.formatarValor(totais.cpm);
        if (elementos.alcance) elementos.alcance.textContent = this.formatarNumero(totais.alcance);
        if (elementos.impressoes) elementos.impressoes.textContent = this.formatarNumero(totais.impressoes);
        if (elementos.cliques) elementos.cliques.textContent = this.formatarNumero(totais.cliques);
        if (elementos.cpc) elementos.cpc.textContent = this.formatarValor(totais.cpc);
        if (elementos.visitas) elementos.visitas.textContent = this.formatarNumero(totais.visitas || 0);
    }

    /**
     * Verificar se existem dados para exibir
     */
    verificarSeDadosExistem(dados) {
        if (!dados || Object.keys(dados).length === 0) {
            console.log('❌ Nenhum dado recebido');
            return false;
        }
        
        // Verificar se há pelo menos uma marca com dados reais
        let totalCampanhas = 0;
        let totalInvestimento = 0;
        
        Object.values(dados).forEach(marca => {
            if (marca) {
                const campanhasMeta = marca.meta?.campanhas?.length || 0;
                const campanhasGoogle = marca.google?.campanhas?.length || 0;
                totalCampanhas += campanhasMeta + campanhasGoogle;
                totalInvestimento += marca.total?.investimento || 0;
            }
        });
        
        console.log(`🔍 Verificação de dados: ${totalCampanhas} campanhas, R$ ${totalInvestimento} investimento`);
        
        const temDados = totalCampanhas > 0 || totalInvestimento > 0;
        
        if (!temDados) {
            console.log('⚠️ Nenhuma campanha ou investimento encontrado');
        } else {
            console.log('✅ Dados encontrados - removendo aviso');
        }
        
        return temDados;
    }

    /**
     * Mostrar estado sem dados
     */
    mostrarEstadoSemDados() {
        console.log('🚫 Exibindo estado sem dados');
        
        // ESCONDER TODAS AS SEÇÕES DE DADOS HARDCODED
        const secoesDados = document.querySelectorAll('#meta-data main section, #google-data main section');
        secoesDados.forEach(secao => {
            secao.style.display = 'none';
        });
        
        // Exibir aviso visual para o usuário
        this.mostrarAvisoSemDados();
        
        // Zerar todos os cards de estatísticas
        const marcas = ['kia', 'suzuki', 'haojue', 'zontes'];
        const sufixos = ['', '-google'];
        
        marcas.forEach(marca => {
            sufixos.forEach(sufixo => {
                const elementos = [
                    `${marca}-valor-total${sufixo}`,
                    `${marca}-google-valor${sufixo}`,
                    `${marca}-meta-valor${sufixo}`,
                    `${marca}-leads-total${sufixo}`
                ];
                
                elementos.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        if (id.includes('leads-total')) {
                            el.textContent = '0';
                        } else {
                            el.textContent = 'R$ 0,00';
                        }
                    }
                });
                
                // Zerar distribuição de leads
                const distribEl = document.getElementById(`${marca}-leads-distribuicao${sufixo}`);
                if (distribEl) distribEl.textContent = '(0/0)';
            });
            
            // Zerar totais das tabelas
            const totaisZero = {
                gastoDiario: 0,
                valorUsado: 0,
                resultados: 0,
                custoResultado: 0,
                cpm: 0,
                alcance: 0,
                impressoes: 0,
                cliques: 0,
                cpc: 0,
                visitas: 0
            };
            this.atualizarTotaisDOM(marca, totaisZero);
            this.atualizarTotaisDOM(marca, totaisZero, '-google');
        });
    }

    /**
     * Mostrar aviso visual de sem dados
     */
    mostrarAvisoSemDados() {
        console.log('🚨 Mostrando aviso de sem dados');
        
        // Remover aviso existente
        const avisoExistente = document.getElementById('aviso-sem-dados');
        if (avisoExistente) avisoExistente.remove();
        
        // Criar aviso
        const aviso = document.createElement('div');
        aviso.id = 'aviso-sem-dados';
        aviso.className = 'bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-center mx-6';
        aviso.innerHTML = `
            <div class="flex items-center justify-center space-x-3">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div>
                    <h3 class="text-lg font-semibold text-yellow-800">Nenhuma campanha encontrada</h3>
                    <p class="text-yellow-700 mt-1">Não há campanhas para os filtros selecionados. Tente:</p>
                    <ul class="text-sm text-yellow-600 mt-2 space-y-1">
                        <li>• Alterar o período selecionado</li>
                        <li>• Selecionar "Todas as marcas"</li>
                        <li>• Verificar se há dados populados no banco</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Inserir no local correto - dentro do content-container
        const contentContainer = document.querySelector('.content-container');
        const filtrosSection = document.querySelector('.bg-white.rounded-xl.shadow-lg.p-6.mb-8');
        
        if (contentContainer && filtrosSection) {
            contentContainer.insertBefore(aviso, filtrosSection.nextSibling);
        }
    }

    /**
     * Esconder estado sem dados (restaurar exibição normal)
     */
    esconderEstadoSemDados() {
        // Remover aviso de sem dados
        const avisoExistente = document.getElementById('aviso-sem-dados');
        if (avisoExistente) {
            avisoExistente.remove();
            console.log('✅ Aviso de sem dados removido - há dados para exibir');
        }
        
        // MOSTRAR SEÇÕES DE DADOS NOVAMENTE (se houver dados reais)
        const secoesDados = document.querySelectorAll('#meta-data main section, #google-data main section');
        secoesDados.forEach(secao => {
            secao.style.display = 'block';
        });
    }

    /**
     * Limpar todos os filtros
     */
    limparFiltros() {
        console.log('🧹 Limpando filtros...');
        
        // Resetar valores dos controles
        document.getElementById('filtro-periodo').value = 'todos';
        document.getElementById('filtro-marca').value = 'todas';
        document.getElementById('filtro-status').value = 'ACTIVE,ENABLED';
        document.getElementById('filtro-comparacao').value = 'nenhuma';
        document.getElementById('filtro-tipo-campanha').value = 'todos';
        
        // Limpar campos numéricos
        ['cpc-min', 'cpc-max', 'investimento-min', 'investimento-max', 'leads-min', 'leads-max', 'cpm-min', 'cpm-max'].forEach(id => {
            document.getElementById(id).value = '';
        });
        
        // Ocultar período personalizado
        document.getElementById('periodo-personalizado').classList.add('hidden');
        
        // Resetar filtros
        this.filtrosAtivos = {};
        this.dadosFiltrados = null;
        
        // Aplicar filtros básicos padrão automaticamente
        setTimeout(async () => {
            await this.aplicarFiltrosBasicos();
        }, 100);
    }

    /**
     * Atualizar contador de filtros ativos
     */
    atualizarContadorFiltros() {
        const badge = document.getElementById('filtros-ativos-badge');
        let contadorFiltros = 0;
        
        // Contar filtros diferentes dos padrões
        const filtros = this.obterFiltrosAtivos();
        
        if (filtros.periodo !== 'todos') contadorFiltros++;
        if (filtros.marca !== 'todas') contadorFiltros++;
        if (filtros.status !== 'ACTIVE,ENABLED') contadorFiltros++;
        if (filtros.comparacao !== 'nenhuma') contadorFiltros++;
        if (filtros.tipoCampanha !== 'todos') contadorFiltros++;
        if (filtros.cpcMin || filtros.cpcMax) contadorFiltros++;
        if (filtros.investimentoMin || filtros.investimentoMax) contadorFiltros++;
        if (filtros.leadsMin || filtros.leadsMax) contadorFiltros++;
        if (filtros.cpmMin || filtros.cpmMax) contadorFiltros++;
        
        if (contadorFiltros > 0) {
            badge.classList.remove('hidden');
            badge.classList.add('badge-pulse');
            badge.textContent = `${contadorFiltros} ${contadorFiltros === 1 ? 'ativo' : 'ativos'}`;
        } else {
            badge.classList.add('hidden');
            badge.classList.remove('badge-pulse');
        }
    }

    /**
     * Implementar sistema de comparação (futuro)
     */
    async aplicarComparacao(filtrosAtivos) {
        if (filtrosAtivos.comparacao === 'nenhuma') return null;
        
        console.log('📈 Aplicando comparação:', filtrosAtivos.comparacao);
        
        // Calcular período de comparação
        let periodoComparacao = null;
        
        switch (filtrosAtivos.comparacao) {
            case 'periodo-anterior':
                if (filtrosAtivos.periodoCalculado) {
                    const { dataInicio, dataFim } = filtrosAtivos.periodoCalculado;
                    const duracao = dataFim - dataInicio;
                    periodoComparacao = {
                        dataInicio: new Date(dataInicio.getTime() - duracao),
                        dataFim: dataInicio
                    };
                }
                break;
            case 'mes-anterior':
                const hoje = new Date();
                periodoComparacao = {
                    dataInicio: new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1),
                    dataFim: new Date(hoje.getFullYear(), hoje.getMonth() - 1, 0)
                };
                break;
            // Adicionar outros tipos de comparação conforme necessário
        }
        
        if (periodoComparacao) {
            const filtrosComparacao = {
                ...filtrosAtivos,
                periodoCalculado: periodoComparacao
            };
            
            try {
                const dadosComparacao = await this.obterDados(true, filtrosComparacao);
                console.log('📊 Dados de comparação obtidos:', dadosComparacao);
                return dadosComparacao;
            } catch (error) {
                console.error('❌ Erro ao obter dados de comparação:', error);
                return null;
            }
        }
        
        return null;
    }

    /**
     * Atualizar contador de resultados
     */
    atualizarContadorResultados() {
        const contador = document.getElementById('contador-resultados');
        
        try {
            const dadosParaContar = this.dadosFiltrados || this.dadosRelatorios;
            if (!dadosParaContar || Object.keys(dadosParaContar).length === 0) {
                contador.textContent = 'Nenhum resultado encontrado';
                return;
            }
            
            let totalCampanhas = 0;
            let totalMarcas = 0;
            
            Object.values(dadosParaContar).forEach(marca => {
                if (marca && (marca.meta || marca.google)) {
                    totalMarcas++;
                    const campanhasMeta = marca.meta?.campanhas?.length || 0;
                    const campanhasGoogle = marca.google?.campanhas?.length || 0;
                    totalCampanhas += campanhasMeta + campanhasGoogle;
                }
            });
            
            if (totalCampanhas === 0) {
                contador.textContent = 'Nenhuma campanha encontrada para os filtros aplicados';
            } else {
                contador.textContent = `${totalCampanhas} campanhas em ${totalMarcas} marcas`;
            }
            
        } catch (error) {
            contador.textContent = 'Erro ao contar resultados';
            console.error('Erro ao contar resultados:', error);
        }
    }

    /**
     * Atualizar status de conexão
     */
    updateStatusConexao(mensagem, tipo) {
        const statusEl = document.getElementById('status-conexao');
        const indicadorEl = statusEl?.previousElementSibling?.querySelector('.rounded-full');
        
        if (statusEl) {
            statusEl.textContent = mensagem;
        }
        
        if (indicadorEl) {
            indicadorEl.className = 'w-2 h-2 rounded-full';
            
            switch (tipo) {
                case 'success':
                    indicadorEl.classList.add('bg-green-500', 'animate-pulse');
                    break;
                case 'warning':
                    indicadorEl.classList.add('bg-yellow-500', 'animate-pulse');
                    break;
                case 'error':
                    indicadorEl.classList.add('bg-red-500');
                    break;
                default:
                    indicadorEl.classList.add('bg-gray-500');
            }
        }
    }
}

// Instância global
window.relatoriosData = new RelatoriosData();

// Função global para compatibilidade com HTML
function showPlatform(platform) {
    if (window.relatoriosData) {
        window.relatoriosData.showPlatform(platform);
    }
}