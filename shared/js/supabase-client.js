/**
 * Cliente Supabase para Sun Motors Dashboard
 * 
 * Este módulo gerencia a conexão com o banco de dados Supabase
 * e fornece métodos para operações CRUD principais.
 * 
 * @version 1.0
 * @author Sun Motors Development Team
 */

// Importação do cliente Supabase (será carregado via CDN)
let supabase = null;

// Configuração padrão
const SUPABASE_CONFIG = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
};

/**
 * Inicializa o cliente Supabase
 */
function initializeSupabase() {
    // Verifica se as variáveis de ambiente estão disponíveis
    const supabaseUrl = window.SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = window.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Configurações do Supabase não encontradas!');
        throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios');
    }

    // Inicializa o cliente
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey, SUPABASE_CONFIG);
    
    console.log('Cliente Supabase inicializado com sucesso');
    return supabase;
}

/**
 * Classe principal para operações do banco de dados
 */
class SunMotorsDB {
    constructor() {
        if (!supabase) {
            initializeSupabase();
        }
        this.client = supabase;
    }

    // ==========================================
    // MÉTODOS DE AUTENTICAÇÃO
    // ==========================================

    /**
     * Realiza login do usuário
     */
    async login(email, senha) {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email: email,
                password: senha
            });

            if (error) throw error;
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Realiza logout do usuário
     */
    async logout() {
        try {
            const { error } = await this.client.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Erro no logout:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém usuário atual
     */
    async getCurrentUser() {
        try {
            const { data: { user } } = await this.client.auth.getUser();
            return user;
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            return null;
        }
    }

    // ==========================================
    // MÉTODOS PARA DASHBOARD
    // ==========================================

    /**
     * Obtém KPIs do dashboard
     */
    async getDashboardKPIs(filtros = {}) {
        try {
            let query = this.client
                .from('vw_dashboard_kpis')
                .select('*');

            // Aplicar filtros se fornecidos
            if (filtros.marca) {
                query = query.eq('marca_codigo', filtros.marca);
            }
            if (filtros.plataforma) {
                query = query.eq('plataforma_codigo', filtros.plataforma);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar KPIs:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém métricas de performance por período
     */
    async getMetricasPorPeriodo(dataInicio, dataFim, filtros = {}) {
        try {
            let query = this.client
                .from('metricas_campanhas')
                .select(`
                    *,
                    campanhas (
                        nome,
                        marcas (nome, codigo, cor_principal),
                        plataformas (nome, codigo)
                    )
                `)
                .gte('data_metrica', dataInicio)
                .lte('data_metrica', dataFim)
                .order('data_metrica', { ascending: false });

            if (filtros.marca_id) {
                query = query.eq('campanhas.marca_id', filtros.marca_id);
            }
            if (filtros.plataforma_id) {
                query = query.eq('campanhas.plataforma_id', filtros.plataforma_id);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar métricas:', error);
            return { success: false, error: error.message };
        }
    }

    // ==========================================
    // MÉTODOS PARA MARCAS E MODELOS
    // ==========================================

    /**
     * Obtém todas as marcas ativas
     */
    async getMarcas() {
        try {
            const { data, error } = await this.client
                .from('marcas')
                .select('*')
                .eq('ativa', true)
                .order('nome');

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar marcas:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém modelos por marca
     */
    async getModelosPorMarca(marcaId) {
        try {
            const { data, error } = await this.client
                .from('modelos')
                .select('*')
                .eq('marca_id', marcaId)
                .eq('ativo', true)
                .order('nome');

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar modelos:', error);
            return { success: false, error: error.message };
        }
    }

    // ==========================================
    // MÉTODOS PARA ORÇAMENTOS
    // ==========================================

    /**
     * Obtém orçamentos por período
     */
    async getOrcamentos(ano, mes = null) {
        try {
            let query = this.client
                .from('orcamentos')
                .select(`
                    *,
                    marcas (nome, codigo, cor_principal),
                    distribuicao_orcamento (
                        *,
                        modelos (nome, tipo),
                        plataformas (nome, codigo)
                    )
                `)
                .eq('ano', ano);

            if (mes) {
                query = query.eq('mes', mes);
            }

            query = query.order('mes', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar orçamentos:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Salva novo orçamento
     */
    async salvarOrcamento(orcamentoData) {
        try {
            const { data, error } = await this.client
                .from('orcamentos')
                .insert(orcamentoData)
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Erro ao salvar orçamento:', error);
            return { success: false, error: error.message };
        }
    }

    // ==========================================
    // MÉTODOS PARA OTIMIZAÇÕES
    // ==========================================

    /**
     * Obtém histórico de otimizações
     */
    async getHistoricoOtimizacoes(limite = 50) {
        try {
            const { data, error } = await this.client
                .from('vw_historico_otimizacoes')
                .select('*')
                .limit(limite);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar otimizações:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Registra nova otimização
     */
    async registrarOtimizacao(otimizacaoData) {
        try {
            const { data, error } = await this.client
                .from('alteracoes_campanhas')
                .insert(otimizacaoData)
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Erro ao registrar otimização:', error);
            return { success: false, error: error.message };
        }
    }

    // ==========================================
    // MÉTODOS PARA PERSONAS
    // ==========================================

    /**
     * Obtém personas por marca
     */
    async getPersonasPorMarca(marcaId) {
        try {
            const { data, error } = await this.client
                .from('personas')
                .select('*')
                .eq('marca_id', marcaId)
                .eq('ativa', true)
                .order('nome');

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar personas:', error);
            return { success: false, error: error.message };
        }
    }

    // ==========================================
    // MÉTODOS UTILITÁRIOS
    // ==========================================

    /**
     * Testa conexão com o banco
     */
    async testarConexao() {
        try {
            const { data, error } = await this.client
                .from('configuracoes')
                .select('chave, valor')
                .eq('chave', 'empresa_nome')
                .single();

            if (error) throw error;
            
            console.log('Conexão testada com sucesso:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Erro na conexão:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém configurações do sistema
     */
    async getConfiguracoes() {
        try {
            const { data, error } = await this.client
                .from('configuracoes')
                .select('*')
                .order('categoria', { ascending: true });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar configurações:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém estatísticas gerais do sistema
     */
    async getEstatisticasGerais() {
        try {
            // Consultas paralelas para estatísticas
            const [marcas, campanhas, metricas] = await Promise.all([
                this.client.from('marcas').select('id', { count: 'exact' }),
                this.client.from('campanhas').select('id', { count: 'exact' }),
                this.client.from('metricas_campanhas').select('leads.sum()')
            ]);

            return {
                success: true,
                data: {
                    totalMarcas: marcas.count,
                    totalCampanhas: campanhas.count,
                    totalLeads: metricas.data?.[0]?.sum || 0
                }
            };
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return { success: false, error: error.message };
        }
    }
}

// Instância global
let sunMotorsDB = null;

/**
 * Função para obter instância do banco
 */
function getSunMotorsDB() {
    if (!sunMotorsDB) {
        sunMotorsDB = new SunMotorsDB();
    }
    return sunMotorsDB;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.SunMotorsDB = SunMotorsDB;
    window.getSunMotorsDB = getSunMotorsDB;
}

// Para Node.js (testes)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SunMotorsDB, getSunMotorsDB, initializeSupabase };
}