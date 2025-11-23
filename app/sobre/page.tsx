'use client';

import React from 'react';
import { FaLaptopCode, FaChartLine, FaCogs, FaCalculator, FaBalanceScale, FaGraduationCap, FaLevelUpAlt, FaChartBar } from 'react-icons/fa';
import { Divider } from "@heroui/divider"; 
// NOTA: Assumindo que você tem um Card/Badge/Table simples do Heroui ou usa Tailwind.

// Componente auxiliar para a Tabela de Variáveis
interface TableRowProps {
    variable: string;
    type: string;
    description: string;
    usage: string;
}

const DocTableRow: React.FC<TableRowProps> = ({ variable, type, description, usage }) => (
    <tr className="border-b border-gray-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
        <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400"><strong>{variable}</strong></td>
        <td className="py-3 px-4 text-sm">{type}</td>
        <td className="py-3 px-4 text-sm">{description}</td>
        <td className="py-3 px-4 text-sm italic text-gray-700 dark:text-gray-300">{usage}</td>
    </tr>
);

// Componente Principal
export default function ProjectDocumentation() {
    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Título Principal */}
                <header className="text-center mb-12">
                    <FaGraduationCap className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Modelo de Decisão Educacional (RankEduc.AI)
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Documentação técnica do ranqueamento de IES e cursos.
                    </p>
                    <p className="mt-4 p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-semibold rounded-lg inline-block">
                        🏷️ Este é um <strong>MVP (Produto Mínimo Viável)</strong> desenvolvido para a disciplina de **Sistemas de Apoio à Decisão (SAD)**.
                    </p>
                </header>
                
                <Divider className="my-8" />
                
                {/* ########################################################################## */}
                {/* 1. Variáveis de Entrada (Features) */}
                {/* ########################################################################## */}

                <section className="mb-12 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <FaLaptopCode className="mr-3 text-red-500" /> 1. Variáveis de Entrada (Features)
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        As variáveis a seguir são a base para o modelo, extraídas majoritariamente do <strong>Censo da Educação Superior</strong> (Base dos Dados) e complementadas pelos arquivos auxiliares <strong>IGC/IDD</strong> do INEP. Elas são a base para calcular o <strong>Score de Qualidade</strong> e treinar o modelo de Classificação (Random Forest).
                    </p>
                    
                    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                        {/* Tabela de Variáveis */}
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                            <thead className="bg-zinc-100 dark:bg-zinc-700">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Variável</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Tipo</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Descrição e Origem</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Uso no Modelo</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                                <DocTableRow variable="id_municipio" type="String (Feature)" description="Código do IBGE do município." usage="Feature categórica no treinamento para padrões regionais." />
                                <DocTableRow variable="nome_curso" type="String (Feature)" description="Nome completo do curso." usage="Feature categórica para padrões específicos do curso." />
                                <DocTableRow variable="id_ies" type="String (Auxiliar)" description="Código de identificação da IES." usage="Usado para fazer o <strong>merge</strong> com os dados de IGC." />
                                <DocTableRow variable="id_curso" type="String (Auxiliar)" description="Código de identificação do curso." usage="Usado para fazer o <strong>merge</strong> com os dados de IDD." />
                                <DocTableRow variable="tipo_organizacao_administrativa" type="String (Auxiliar)" description="Natureza jurídica da IES (e.g., Pública, Privada)." usage="Retornado no ranking para informação do usuário." />
                                <DocTableRow variable="quantidade_vagas / inscritos / matriculas / concluintes / evasao" type="Numérico (Auxiliar)" description="Contagens anuais do Censo." usage="Usadas exclusivamente para calcular as Taxas de Desempenho." />
                            </tbody>
                        </table>
                    </div>
                </section>
                
                <Divider className="my-8" />

                {/* ########################################################################## */}
                {/* 2. Métricas de Desempenho (Feature Engineering) */}
                {/* ########################################################################## */}

                <section className="mb-12 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <FaChartLine className="mr-3 text-green-500" /> 2. Métricas de Desempenho
                    </h2>
                    
                    {/* Indicadores IGC / IDD */}
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">Indicadores INEP e Normalização</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-700/50 border-cyan-300 dark:border-cyan-600">
                            <h4 className="font-bold flex items-center text-cyan-600 dark:text-cyan-400"><FaLevelUpAlt className="mr-2" /> <strong>IGC (Contínuo) & IDD (Contínuo)</strong></h4>
                            <p className="text-sm mt-1">
                                O <strong>IGC</strong> avalia a qualidade institucional. O <strong>IDD</strong> mede o valor adicionado por um curso (o quanto os alunos evoluíram). Ambos são normalizados ($\text{7} / 5.0$) para o Score.
                            </p>
                            <code className="block bg-cyan-100 dark:bg-cyan-900/50 p-2 mt-2 text-xs rounded">
                                idd_normalizado / igc_normalizado
                            </code>
                        </div>
                        <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-700/50 border-purple-300 dark:border-purple-600">
                            <h4 className="font-bold flex items-center text-purple-600 dark:text-purple-400"><FaCalculator className="mr-2" /> <strong>Taxas Calculadas</strong></h4>
                            <ul className="text-sm list-disc list-inside mt-1 space-y-1">
                                <li><strong>Taxa Conclusão:</strong> Eficiência da formação.</li>
                                <li><strong>Taxa Evasão:</strong> Capacidade de retenção (Baixo é melhor).</li>
                                <li><strong>Taxa Concorrência:</strong> Indicador de demanda.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <Divider className="my-8" />

                {/* ########################################################################## */}
                {/* 3. O Modelo de Ranqueamento */}
                {/* ########################################################################## */}

                <section className="mb-12 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <FaCogs className="mr-3 text-yellow-600" /> 3. O Modelo de Ranqueamento
                    </h2>

                    {/* Score de Qualidade */}
                    <div className="mb-6 p-4 border rounded-lg bg-zinc-100 dark:bg-zinc-700 border-yellow-400">
                        <h3 className="text-xl font-bold flex items-center text-yellow-600 dark:text-yellow-400 mb-3">
                            <FaBalanceScale className="mr-2" /> A. <strong>Score de Qualidade (Ponderado)</strong>
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            O ranqueamento principal é feito através de um <strong>Score de Qualidade ponderado</strong>, que combina as quatro métricas de qualidade mais importantes.
                        </p>
                        <div className="bg-yellow-50 dark:bg-zinc-900 p-3 rounded-md overflow-x-auto text-sm">
                            <code className="text-yellow-800 dark:text-yellow-300 whitespace-nowrap">
                                Score = (Conclusão × P_CONC) + ((1 - Evasão) × P_EVASAO) + (IDD Norm × P_IDD) + (IGC Norm × P_IGC)
                            </code>
                        </div>
                    </div>

                    {/* Pesos de Regressão (OLSM) */}
                    <div className="mb-6 p-4 border rounded-lg bg-zinc-100 dark:bg-zinc-700 border-red-400">
                        <h3 className="text-xl font-bold flex items-center text-red-600 dark:text-red-400 mb-3">
                            <FaChartBar className="mr-2" /> B. <strong>Pesos Objetivos (Regressão Múltipla - OLSM)</strong>
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            Os pesos ($P$) são calculados objetivamente usando <strong>Regressão Linear Múltipla (OLSM)</strong>. A <strong>Taxa de Conclusão</strong> é definida como a variável dependente (Y), e os coeficientes de regressão determinam a <strong>influência relativa</strong> dos outros indicadores no sucesso da formação.
                        </p>
                        <ul className="text-sm list-disc list-inside ml-4 mt-2 text-gray-600 dark:text-gray-400">
                            <li><strong>Y (Dependente):</strong> Taxa de Conclusão Normalizada.</li>
                            <li><strong>X (Independentes):</strong> IDD Normalizado, IGC Normalizado, e Evasão Inversa (1 - Taxa Evasão).</li>
                        </ul>
                    </div>

                    {/* Target de Classificação (Random Forest) */}
                    <div className="p-4 border rounded-lg bg-zinc-100 dark:bg-zinc-700 border-blue-400">
                        <h3 className="text-xl font-bold flex items-center text-blue-600 dark:text-blue-400 mb-3">
                            <FaCogs className="mr-2" /> C. <strong>Target de Classificação e Modelo Preditivo</strong>
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            A variável <strong>`target_desempenho`</strong> (Classe 1, 2 ou 3) é gerada pelos quantis do Score e utilizada para treinar um modelo de **Random Forest**.
                        </p>
                        <ul className="text-sm list-disc list-inside ml-4 mt-2 text-gray-600 dark:text-gray-400">
                            <li><strong>Classe 3: Melhor Desempenho</strong> (Top 34% dos Scores)</li>
                            <li><strong>Classe 1: Desempenho Básico</strong> (Bottom 33% dos Scores)</li>
                        </ul>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                            O **Random Forest** é treinado para que o sistema possa futuramente <strong>prever</strong> a categoria de desempenho de novos cursos ou cursos com dados incompletos.
                        </p>
                    </div>
                </section>

                <Divider className="my-8" />

                <footer className="text-center text-sm text-gray-500 dark:text-gray-500">
                    <p>Dados de referência: Censo da Educação Superior (Base dos Dados) e Indicadores INEP ({2023}).</p>
                </footer>

            </div>
        </div>
    );
}