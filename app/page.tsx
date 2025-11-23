'use client';

import api from "brasilapi-js";
import { City } from "brasilapi-js/dist/types/ibge/city"; 
import axios from "axios";
import { useEffect, useState } from "react";

// Importações de componentes Heroui
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Form } from '@heroui/form';
import { Button } from '@heroui/button';
import { Divider } from "@heroui/divider";
import { 
    FaMedal, 
    FaSearch, 
    FaExclamationTriangle, 
    FaTimesCircle, 
    FaChartBar,
    FaClock,
    FaLevelUpAlt,
    FaTachometerAlt // Para taxa de evasão/concorrência
} from "react-icons/fa"; 
import { IoIosSchool } from "react-icons/io"; 
import { GiSplitCross } from "react-icons/gi"; // Ícone de evasão

// NOVO: Importando o CardSpotlight
import { CardSpotlight } from "@/components/ui/card-spotlight";

// --- 0. Tipagem de Dados ---

interface ResultadoItem {
    id_ies: string; 
    nome_ies: string;
    nome_curso: string;
    score_qualidade: number;
    target_desempenho: string;
    igc_continuo: number;
    idd_continuo: number;
    taxa_conclusao: number;
    taxa_evasao: number;
    taxa_concorrencia: number | null;
    tipo_organizacao_administrativa: string;
}

interface ResultadoCompleto {
    status: 'sucesso' | 'erro';
    mensagem: string | null;
    parametros_busca: {
        municipio_id: string;
        curso_nome: string;
        ano: number;
    };
    ranking_top_ies: ResultadoItem[];
}

// --- 1. Mapeamento de Cores e Ícones ---
const LoaderEnviar = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>; 

// --- Funções de Formatação ---
const formatarPorcentagem = (valor: number): string => (valor * 100).toFixed(1) + "%";
//@ts-expect-error ignore
const formatarFloat = (valor: number | null): string => valor ? parseFloat(valor).toFixed(4) : "N/A";

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1:
            return <FaMedal className="w-8 h-8 text-amber-400" title="1º Lugar" />;
        case 2:
            return <FaMedal className="w-8 h-8 text-slate-400" title="2º Lugar" />;
        case 3:
            return <FaMedal className="w-8 h-8 text-amber-700" title="3º Lugar" />;
        default:
            return <span className="font-bold text-2xl text-gray-500 w-8 h-8 flex items-center justify-center">#{rank}</span>;
    }
}

// --- Componente auxiliar para as métricas dentro do CardSpotlight ---
interface MetricProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    colorClass: string;
}

const Metric: React.FC<MetricProps> = ({ icon, label, value, colorClass }) => (
    <div className="flex flex-col p-2 bg-white/5 rounded-lg border border-white/10">
        <span className={`text-xs font-semibold flex items-center ${colorClass}`}>
            {icon} {label}
        </span>
        <span className="text-lg font-bold text-white mt-1">{value}</span>
    </div>
);


// --- 2. Componente de Mensagem de Erro/Não Encontrado ---
interface NoResultsProps {
    curso: string | null;
    mensagemErro: string | null;
}

const NoResults: React.FC<NoResultsProps> = ({ curso, mensagemErro }) => (
    <div className="p-8 mt-8 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl shadow-lg flex flex-col items-center text-center">
        <FaExclamationTriangle className="w-10 h-10 text-orange-500 mb-4" />
        <p className="text-xl font-bold mb-2">
            {mensagemErro ? "Erro na Busca" : "Nenhum Resultado Encontrado"}
        </p>
        <p className="text-md">
            {mensagemErro || `Não foram encontradas IES para o curso "${curso || 'selecionado'}" no município escolhido.`}
        </p>
        <p className="text-sm mt-2 italic">Verifique os filtros ou a conexão com o servidor.</p>
    </div>
);


// --- 3. Componente de Ranking com CardSpotlight (NOVO) ---
const RankingCardSpotlight: React.FC<{ ranking: ResultadoItem[]; cursoNome: string; cidadeNome: string }> = ({ ranking, cursoNome, cidadeNome }) => {
    
    return (
        <div className="mt-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
                🏆 Ranking Top IES - {cursoNome} em {cidadeNome}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ranking.map((item, index) => {
                    const rank = index + 1;
                    const icon = getRankIcon(rank);
                    
                    return (
                        <CardSpotlight 
                            key={item.id_ies} 
                            className="w-full h-auto p-6 transition-all duration-300"
                        >
                            <div className="flex justify-between items-center relative z-20 mb-4">
                                {icon}
                                <span className="text-sm font-semibold text-neutral-300 bg-blue-600/70 px-3 py-1 rounded-full border border-blue-400">
                                    {item.tipo_organizacao_administrativa}
                                </span>
                            </div>
                            
                            <h3 className="text-xl md:text-2xl font-bold relative z-20 text-white flex items-center">
                                <IoIosSchool className="md:size-8 size-14 mr-2 text-blue-400" />
                                {item.nome_ies}
                            </h3>
                            <p className="text-neutral-300 mt-1 relative z-20 text-sm italic">{item.nome_curso}</p>
                            
                            <Divider className="my-4 bg-white/20 relative z-20" />

                            {/* Detalhamento das Métricas */}
                            <div className="relative z-20 grid grid-cols-2 gap-3 text-sm">
                                <Metric
                                    icon={<FaChartBar className="w-4 h-4 mr-1" />}
                                    label="Score Qualidade"
                                    value={formatarFloat(item.score_qualidade)}
                                    colorClass="text-green-400"
                                />
                                <Metric
                                    icon={<FaClock className="w-4 h-4 mr-1" />}
                                    label="Taxa de Conclusão"
                                    value={formatarPorcentagem(item.taxa_conclusao)}
                                    colorClass="text-cyan-400"
                                />
                                <Metric
                                    icon={<FaLevelUpAlt className="w-4 h-4 mr-1" />}
                                    label="IGC Contínuo"
                                    value={formatarFloat(item.igc_continuo)}
                                    colorClass="text-purple-400"
                                />
                                <Metric
                                    icon={<FaLevelUpAlt className="w-4 h-4 mr-1" />}
                                    label="IDD Contínuo"
                                    value={formatarFloat(item.idd_continuo)}
                                    colorClass="text-pink-400"
                                />
                                <Metric
                                    icon={<GiSplitCross className="w-4 h-4 mr-1" />}
                                    label="Taxa de Evasão"
                                    value={formatarPorcentagem(item.taxa_evasao)}
                                    colorClass="text-red-400"
                                />
                                <Metric
                                    icon={<FaTachometerAlt className="w-4 h-4 mr-1" />}
                                    label="Concorrência (Candidatos)"
                                    value={item.taxa_concorrencia ? item.taxa_concorrencia.toFixed(2) : "N/A"}
                                    colorClass="text-yellow-400"
                                />
                            </div>

                            <p className="text-neutral-400 mt-4 relative z-20 text-xs text-right">
                                Target Desempenho: {item.target_desempenho}
                            </p>
                        </CardSpotlight>
                    );
                })}
            </div>
        </div>
    );
};


// --- 4. Componente Home Atualizado (Integração Final) ---
export default function Home() {
    // Estados tipados (mantidos)
    const [cidades, setCidades] = useState<City[]>([]);
    const [cursos, setCursos] = useState<string[]>([]);
    const [curso, setCurso] = useState<string | null>(null);
    const [cidade, setCidade] = useState<string | null>(null);

    const [loadingCidades, setLoadingCidades] = useState<boolean>(false);
    const [loadingCursos, setLoadingCursos] = useState<boolean>(false);
    const [loadingResultado, setLoadingResultado] = useState<boolean>(false);
    
    const [resultado, setResultado] = useState<ResultadoCompleto | { status: 'erro', mensagem: string } | null>(null); 
    const [estado, setEstado] = useState<string>('BA');

    // Funções tipadas
    const getCursos = async (): Promise<void> => {
        if (!cidade) {
            setCursos([]);
            setCurso(null);
            return;
        }
        setLoadingCursos(true);
        try {
            const res = await axios.get<string[]>(`https://rankeduc-backend.onrender.com/cursos/${cidade}`);
            setCurso(null);
            setCursos(res.data);
            setResultado(null);
        } catch (err: any) {
            console.error("Erro ao buscar cursos:", err.message);
            setCursos([]);
            if (!err.response) {
                 setResultado({ 
                    status: 'erro', 
                    mensagem: 'Erro de conexão com a API de Cursos. Verifique o servidor.' 
                });
            }
        } finally {
            setLoadingCursos(false);
        }
    };

    const getCidades = async (): Promise<void> => {
        setLoadingCidades(true);
        try {
            const res = await api.ibge.city.getBy(estado) as { data: City[] }; 
            setCidade(null);
            setCidades(res.data);
            setResultado(null);
        } catch (err) {
            console.error("Erro ao buscar cidades:", err);
            setCidades([]);
        } finally {
            setLoadingCidades(false);
        }
    };

    // Effects (mantidos)
    useEffect(() => {
        getCursos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cidade]);

    useEffect(() => {
        getCidades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [estado]);

    const siglasEstados: string[] = [
        "AC", "AL", "AP", "AM", "BA", "CE", "ES", "GO", "MA", "MT", "MS", "MG", "PA", 
        "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        
        if (!cidade || !curso) {
            alert("Selecione uma cidade e um curso.");
            return;
        }
        
        setLoadingResultado(true);
        setResultado(null); 

        try {
            // Endpoint da API de ranking
            const res = await axios.post<ResultadoCompleto>(`https://rankeduc-backend.onrender.com/ranking/`, {
                municipio_id: cidade,
                curso_nome: curso
            });
            setResultado(res.data);
            console.log(resultado)
        } catch (err: any) {
            console.error("Erro na busca do ranking:", err);
            // Tratamento de erro de rede e API
            let mensagem = 'Erro ao buscar o ranking. Verifique o servidor e a URL da API.';
            if (err.response) {
                // Erro HTTP (CORS, 404, 500)
                mensagem = err.response.data?.mensagem || `Erro do servidor (${err.response.status}).`;
            }
            setResultado({ 
                status: 'erro', 
                mensagem: mensagem
            });
        } finally {
            setLoadingResultado(false);
        }
    };

    // Extração e Preparação dos Dados
    const rankingData: ResultadoItem[] = (resultado && 'ranking_top_ies' in resultado) ? resultado.ranking_top_ies : [];
    
    const mensagemErro: string | null = (resultado && resultado.status === 'erro') ? resultado.mensagem : null;
    const nomeCidade = cidades.find(c => c.codigo_ibge === cidade)?.nome || 'Município Selecionado';
    const cursoNome = curso || 'Curso Selecionado';

    return (
        <div className="flex min-h-screen items-start justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl w-full"> 
                
                {/* 1. Formulário de Configuração (TOPO) */}
                <div className="w-full">
                    <Form onSubmit={handleSubmit} className="p-8 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl bg-white dark:bg-zinc-800">
                        <h1 className="text-xl md:text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
                            Decisão de Carreira: encontre a melhor IES
                        </h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Autocomplete 
                                color="primary"
                                className="cursor-pointe" 
                                value={estado} 
                                onSelectionChange={(v) => setEstado(String(v))} 
                                label="Estado"
                                placeholder="Selecione o Estado (UF)"
                            >
                                {siglasEstados.map((e) => (
                                    //@ts-expect-error ignore
                                    <AutocompleteItem key={e} value={e}>{e}</AutocompleteItem>
                                ))}
                            </Autocomplete>

                            <Autocomplete 
                                className="cursor-pointer"
                                color="primary" 
                                isLoading={loadingCidades} 
                                isDisabled={loadingCidades} 
                                onSelectionChange={(c) => setCidade(String(c))} 
                                label="Cidade"
                                selectedKey={cidade}
                                placeholder={loadingCidades ? "Carregando cidades..." : "Selecione o Município"}
                            >
                                {cidades.map((c) => (
                                    //@ts-expect-error ignore
                                    <AutocompleteItem key={c.codigo_ibge} value={c.codigo_ibge}>{c.nome}</AutocompleteItem>
                                ))}
                            </Autocomplete>

                            <Autocomplete 
                                color="primary"
                                className="cursor-pointer" 
                                isLoading={loadingCursos} 
                                isDisabled={loadingCursos || !cidade} 
                                onSelectionChange={(c) => setCurso(String(c))} 
                                label="Curso"
                                selectedKey={curso}
                                placeholder={!cidade ? "Selecione uma cidade primeiro" : loadingCursos ? "Buscando cursos..." : "Selecione o Curso"}
                            >
                                {cursos.map((c) => (
                                    //@ts-expect-error ignore
                                    <AutocompleteItem key={c} value={c}>{c}</AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        
                        <div className="flex gap-3 mt-6 flex-col md:flex-row">
                            <Button 
                                color="success"
                                size="md" 
                                type="submit" 
                                variant="ghost"
                                isLoading={loadingResultado}
                                isDisabled={loadingResultado || !cidade || !curso}
                                className="text-lg"
                                startContent={!loadingResultado && <FaSearch />}
                            > 
                                
                                Buscar Ranking
                            </Button>
                            <Button 
                                type="reset" 
                                variant="light"
                                onClick={() => { setCidade(null); setCurso(null); setResultado(null); }}
                                className="flex-1"
                                startContent={<FaTimesCircle />}
                            >
                                Limpar Busca
                            </Button>
                        </div>
                    </Form>
                </div>
                
                <Divider className="my-8" />

                {/* 2. Área de Resultados (ABAIXO) */}
                <div className="min-h-[250px] flex flex-col justify-center items-center">
                    {/* Estado de Carregamento */}
                    {loadingResultado && (
                        <div className="flex flex-col justify-center items-center h-64 w-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
                            <LoaderEnviar />
                            <p className="text-xl text-gray-500 mt-4">Buscando o ranking de qualidade...</p>
                        </div>
                    )}

                    {/* Exibe o Ranking em CardSpotlight ou a Mensagem de Erro/Não Encontrado */}
                    {resultado && !loadingResultado && (
                        <div className="w-full animate-in fade-in duration-500">
                            {rankingData.length > 0 ? (
                                <RankingCardSpotlight 
                                    ranking={rankingData} 
                                    cursoNome={cursoNome} 
                                    cidadeNome={nomeCidade} 
                                />
                            ) : (
                                <NoResults curso={curso} mensagemErro={mensagemErro} />
                            )}
                        </div>
                    )}

                    {/* Mensagem Inicial */}
                    {!resultado && !loadingResultado && (
                        <div className="p-10 bg-white dark:bg-zinc-800 rounded-xl shadow-lg flex flex-col items-center text-center h-full w-full">
                            <FaSearch className="w-12 h-12 text-blue-500 mb-4" />
                            <p className="text-xl font-bold text-gray-800 dark:text-white mb-2">Pronto para a sua Decisão?</p>
                            <p className="text-md text-gray-600 dark:text-gray-400">
                                Utilize os filtros acima para encontrar as IES com o melhor desempenho no curso e cidade de sua escolha.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}