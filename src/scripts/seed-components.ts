import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'

type InitialComponent = {
  company: string
  pageSlug: string
  slug: string
  name: string
  title?: string
  subtitle?: string
  content?: string
  imageFilename?: string
  imageAlt?: string
  fields?: { key: string; label?: string; value?: string; imageFilename?: string; imageAlt?: string }[]
}

const initialComponents: InitialComponent[] = [
  // Localize - Home
  {
    company: 'localize',
    pageSlug: 'home',
    slug: 'hero',
    name: 'Apresentação principal',
    title: 'Atendimento inteligente que',
    subtitle: 'Localize Copilot v3.0 lançado com IA generativa contextual',
    content: 'Unifique WhatsApp, Instagram, Chatbot e E-mail em uma única plataforma turbinada por agentes autônomos de IA que qualificam leads e solucionam até 80% dos chamados sem intervenção humana.',
    imageFilename: 'hero-platform.svg',
    imageAlt: 'Dashboard da Plataforma Localize com Inbox Omnicanal e IA Copilot',
    fields: [
      { key: 'text1', value: 'Localize Copilot v3.0 lançado com IA generativa contextual' },
      { key: 'text2', value: 'Ver novidades →' },
      { key: 'title1', value: 'Atendimento inteligente que' },
      { key: 'text3', value: 'resolve em segundos' },
      { key: 'title2', value: ',' },
      { key: 'title3', value: 'não em horas.' },
      { key: 'description1', value: 'Unifique WhatsApp, Instagram, Chatbot e E-mail em uma única plataforma turbinada por agentes autônomos de IA que qualificam leads e solucionam até 80% dos chamados sem intervenção humana.' },
      { key: 'text4', value: 'Sem necessidade de cartão de crédito' },
      { key: 'text5', value: 'Configuração em menos de 5 minutos' },
      { key: 'text6', value: 'Conformidade com LGPD & Criptografia Ponta a Ponta' },
      { key: 'image1', imageFilename: 'hero-platform.svg', imageAlt: 'Dashboard da Plataforma Localize com Inbox Omnicanal e IA Copilot' },
      { key: 'description2', value: 'Confiado por mais de 1.200 empresas em crescimento no Brasil' },
      { key: 'text7', value: 'VELOCE.IO' },
      { key: 'text8', value: 'NEXA CLOUD' },
      { key: 'text9', value: 'SYNCRA TECH' },
      { key: 'text10', value: 'PULSE DIGITAL' },
      { key: 'text11', value: 'FINFLOW S.A.' },
    ],
  },
  {
    company: 'localize',
    pageSlug: 'home',
    slug: 'contact-form',
    name: 'Formulário de contato',
    title: 'Veja o Localize operando ao vivo com seus canais reais',
    subtitle: 'Demonstração Personalizada',
    content: 'Converse com nossos especialistas de automação para receber um diagnóstico gratuito dos gargalos de atendimento da sua empresa e uma simulação de economia com IA.',
    fields: [
      { key: 'text1', value: 'Demonstração Personalizada' },
      { key: 'title1', value: 'Veja o Localize operando ao vivo com seus canais reais' },
      { key: 'description1', value: 'Converse com nossos especialistas de automação para receber um diagnóstico gratuito dos gargalos de atendimento da sua empresa e uma simulação de economia com IA.' },
      { key: 'text2', value: 'E-mail corporativo:' },
      { key: 'text3', value: 'Central de vendas e parcerias:' },
      { key: 'text4', value: 'Segurança garantida:' },
      { key: 'text5', value: 'Seus dados nunca são compartilhados ou vendidos.' },
      { key: 'title2', value: 'Solicitação Recebida com Sucesso!' },
      { key: 'description2', value: 'Obrigado,' },
      { key: 'description3', value: '! Nosso consultor entrará em contato via WhatsApp/E-mail no prazo máximo de 15 minutos para agendar a demonstração.' },
    ],
  },
  {
    company: 'localize',
    pageSlug: 'home',
    slug: 'benefits',
    name: 'Benefícios',
    title: 'Por que empresas modernas trocam SACs legados pelo Localize?',
    subtitle: 'Diferenciais de Arquitetura',
    content: 'Elimine a frustração dos menus numéricos intermináveis. Entregue um atendimento conversacional humanizado e instantâneo.',
    fields: [
      { key: 'text1', value: 'Diferenciais de Arquitetura' },
      { key: 'title1', value: 'Por que empresas modernas trocam SACs legados pelo Localize?' },
      { key: 'description1', value: 'Elimine a frustração dos menus numéricos intermináveis. Entregue um atendimento conversacional humanizado e instantâneo.' },
      { key: 'text2', value: 'Inteligência Semântica' },
      { key: 'title2', value: 'Roteamento por Sentimento & Urgência em Tempo Real' },
      { key: 'description2', value: 'O motor do Localize lê a intenção do cliente, avalia o tom emocional (frustrado, neutro, urgente) e direciona instantaneamente o atendimento para a melhor fila ou atendente especializado, com um briefing pré-gerado.' },
      { key: 'text3', value: '✓ 96% de precisão na classificação de intenção' },
      { key: 'text4', value: 'Conhecer o analisador de sentimento' },
      { key: 'text5', value: 'Disponibilidade Total' },
      { key: 'title3', value: 'Atendimento 24/7 com Resolução de Fim a Fim' },
      { key: 'description3', value: 'Nossos agentes autônomos não apenas respondem perguntas: emitem boletos, consultam pedidos em ERPs e alteram cadastros de ponta a ponta sem fila.' },
      { key: 'text6', value: 'Tempo médio de espera: 0 segundos' },
      { key: 'text7', value: 'Visão 360 Graus' },
      { key: 'title4', value: 'Histórico Consolidado Multicanal' },
      { key: 'description4', value: 'Se o cliente começou pelo WhatsApp, continuou no Instagram e enviou um e-mail, seu time vê a linha do tempo completa em uma única tela sem repetição de dados.' },
      { key: 'text8', value: 'Zero retrabalho para o consumidor' },
      { key: 'text9', value: 'Ecossistema Aberto' },
      { key: 'title5', value: 'Conectores No-Code para Ferramentas que Você Já Usa' },
      { key: 'description5', value: 'Integre instantaneamente com CRMs (Salesforce, HubSpot, RD Station, Pipedrive), plataformas de pagamento (Stripe, Asaas, Mercado Pago) e bancos de dados via Webhooks bidirecionais.' },
      { key: 'text10', value: 'HubSpot' },
      { key: 'text11', value: 'RD Station' },
      { key: 'text12', value: 'Salesforce' },
      { key: 'text13', value: 'Stripe' },
      { key: 'text14', value: 'Zendesk' },
      { key: 'text15', value: 'Shopify' },
      { key: 'text16', value: 'Mercado Livre' },
    ],
  },
  {
    company: 'localize',
    pageSlug: 'home',
    slug: 'alternating-features',
    name: 'Recursos em destaque',
    title: 'Crie fluxos de conversa complexos em minutos, sem programar uma linha',
    subtitle: 'Construtor No-Code',
    content: 'Arraste blocos de mensagens, condições de decisão, chamadas a APIs externas e gatilhos de IA em um canvas infinito intuitivo.',
    imageFilename: 'flow-builder.svg',
    imageAlt: 'Editor Visual de Fluxos de Atendimento e Automação No-Code',
    fields: [
      { key: 'image1', imageFilename: 'flow-builder.svg', imageAlt: 'Editor Visual de Fluxos de Atendimento e Automação No-Code' },
      { key: 'text1', value: 'Construtor No-Code' },
      { key: 'title1', value: 'Crie fluxos de conversa complexos em minutos, sem programar uma linha' },
      { key: 'description1', value: 'Arraste blocos de mensagens, condições de decisão, chamadas a APIs externas e gatilhos de IA em um canvas infinito intuitivo.' },
      { key: 'text2', value: 'Bifurcação por intenção:' },
      { key: 'text3', value: 'Direcione vendas para o SDR e dúvidas técnicas para o suporte especializado.' },
      { key: 'text4', value: 'Testes A/B nativos:' },
      { key: 'text5', value: 'Experimente abordagens de boas-vindas e descubra qual gera mais conversão de leads.' },
      { key: 'text6', value: 'Publicação com 1 clique:' },
      { key: 'text7', value: 'Atualize fluxos em produção em todos os canais instantaneamente sem reiniciar instâncias.' },
      { key: 'text8', value: 'Copilot Operacional' },
      { key: 'title2', value: 'A caixa de entrada que multiplica a velocidade da sua equipe em 3x' },
      { key: 'description2', value: 'O Copilot do Localize lê o histórico da conversa e digita a resposta ideal baseada na documentação da empresa antes mesmo que o atendente comece a redigir.' },
      { key: 'text9', value: 'Auto-complete contextual:' },
      { key: 'text10', value: 'Respostas pré-aprovadas com dados dinâmicos do cliente puxados do CRM.' },
      { key: 'text11', value: 'Resumo de transbordo:' },
      { key: 'text12', value: 'Quando o robô passa o chamado para o humano, um resumo de 3 linhas explica o problema.' },
      { key: 'text13', value: 'Macros & atalhos de teclado:' },
      { key: 'text14', value: 'Dispare ações repetitivas com uma tecla, mantendo seu time produtivo.' },
      { key: 'image2', imageFilename: 'inbox-multichannel.svg', imageAlt: 'Caixa de Entrada Unificada Multicanal com Sugestões do Copilot' },
    ],
  },
  {
    company: 'localize',
    pageSlug: 'home',
    slug: 'stats',
    name: 'Indicadores',
    title: 'Resultados reais medidos em nossos clientes ativos',
    subtitle: 'Impacto Comprovado em Números',
    content: 'Métricas auditadas em centenas de empresas que escalaram o atendimento sem explodir custos com equipe.',
    fields: [
      { key: 'value1', value: '4.2s' },
      { key: 'label1', value: 'Tempo da 1ª Resposta' },
      { key: 'detail1', value: 'Antes: 42 minutos em filas convencionais' },
      { key: 'value2', value: '81.4%' },
      { key: 'label2', value: 'Resolução 100% Autônoma' },
      { key: 'detail2', value: 'Dúvidas e solicitações resolvidas pelo Copilot' },
      { key: 'value3', value: '4.92/5' },
      { key: 'label3', value: 'CSAT Médio Registrado' },
      { key: 'detail3', value: 'Avaliação média de satisfação dos usuários finais' },
      { key: 'value4', value: '+4.8M' },
      { key: 'label4', value: 'Mensagens Trafegadas/Mês' },
      { key: 'detail4', value: 'Com 99.99% de SLA de disponibilidade operacional' },
      { key: 'text1', value: 'Impacto Comprovado em Números' },
      { key: 'title1', value: 'Resultados reais medidos em nossos clientes ativos' },
      { key: 'description1', value: 'Métricas auditadas em centenas de empresas que escalaram o atendimento sem explodir custos com equipe.' },
    ],
  },
  {
    company: 'localize',
    pageSlug: 'home',
    slug: 'feature-cards',
    name: 'Cartões de funcionalidades',
    title: 'Recursos projetados para empresas que não aceitam limites de escala',
    subtitle: 'Engine Tecnológica',
    content: 'Construído sobre arquitetura de microsserviços de baixa latência e modelos de linguagem de última geração.',
    fields: [
      { key: 'title1', value: 'RAG com Base de Conhecimento Própria' },
      { key: 'desc1', value: 'Faça upload de PDFs, manuais técnicos e URLs do seu site. A IA aprende os detalhes dos seus produtos em minutos e só responde de acordo com as diretrizes aprovadas.' },
      { key: 'badge1', value: 'Treinamento Imediato' },
      { key: 'title2', value: 'Distribuição Inteligente por Carga (Workload)' },
      { key: 'desc2', value: 'Nosso algoritmo distribui chats considerando a complexidade do assunto e a quantidade de conversas abertas de cada operador, evitando sobrecarga.' },
      { key: 'badge2', value: 'Round-Robin Avançado' },
      { key: 'title3', value: 'Disparos Ativos Orientados a Eventos' },
      { key: 'desc3', value: 'Envie notificações pró-ativas no WhatsApp em caso de status de pedido alterado, carrinho abandonado, confirmação de consulta ou atraso de fatura.' },
      { key: 'badge3', value: 'Alta Entregabilidade' },
      { key: 'title4', value: 'Mascaramento de Dados LGPD Automático' },
      { key: 'desc4', value: 'Números de cartão de crédito, senhas e CPFs são ocultados automaticamente da interface visual e dos logs para conformidade total de privacidade.' },
      { key: 'badge4', value: 'Compliance & Segurança' },
      { key: 'title5', value: 'Campos Personalizados & Tags Dinâmicas' },
      { key: 'desc5', value: 'Crie propriedades personalizadas para clientes e tickets, permitindo segmentações cirúrgicas e relatórios analíticos de funil de atendimento.' },
      { key: 'badge5', value: 'Flexibilidade Total' },
      { key: 'title6', value: 'Simulador de Conversas em Sandbox' },
      { key: 'desc6', value: 'Teste novos nós de fluxo, respostas do Copilot e gatilhos em um ambiente isolado antes de disponibilizá-los aos seus clientes reais.' },
      { key: 'badge6', value: 'Zero Risco Operacional' },
      { key: 'text1', value: 'Engine Tecnológica' },
      { key: 'title7', value: 'Recursos projetados para empresas que não aceitam limites de escala' },
      { key: 'description1', value: 'Construído sobre arquitetura de microsserviços de baixa latência e modelos de linguagem de última geração.' },
      { key: 'text2', value: 'Incluído em todos os planos Pro & Enterprise' },
    ],
  },
  {
    company: 'localize',
    pageSlug: 'home',
    slug: 'cta',
    name: 'Chamada para ação',
    title: 'Transforme a central de atendimento da sua empresa hoje mesmo',
    subtitle: 'Comece em 5 Minutos',
    content: 'Junte-se a mais de 1.200 empresas que reduziram o tempo de espera para menos de 5 segundos e conquistaram notas máximas de satisfação.',
    fields: [
      { key: 'text1', value: 'Comece em 5 Minutos' },
      { key: 'title1', value: 'Transforme a central de atendimento da sua empresa hoje mesmo' },
      { key: 'description1', value: 'Junte-se a mais de 1.200 empresas que reduziram o tempo de espera para menos de 5 segundos e conquistaram notas máximas de satisfação.' },
      { key: 'text2', value: '14 dias de teste grátis' },
      { key: 'text3', value: 'Sem fidelidade contratual' },
      { key: 'text4', value: 'Migração assistida sem custo' },
    ],
  },
  // Rastrear - Home
  {
    company: 'rastrear',
    pageSlug: 'home',
    slug: 'hero',
    name: 'Apresentação principal',
    title: 'Mais agilidade no pátio,',
    subtitle: 'Autoatendimento Operacional para Frotas & Embarcadores',
    content: 'Centralize a emissão de documentos fiscais, agendamento de janelas de descarga, comprovação de entrega digital e liquidação de fretes em uma plataforma unificada criada para a rotina do transporte.',
    imageFilename: 'fleet-dispatch.jpg',
    imageAlt: 'Centro de Despacho e Pátio de Cargas da Transportadora',
    fields: [
      { key: 'text1', value: 'Autoatendimento Operacional para Frotas & Embarcadores' },
      { key: 'text2', value: 'Check-in de docas em menos de 4 minutos' },
      { key: 'title1', value: 'Mais agilidade no pátio,' },
      { key: 'text3', value: 'zero burocracia' },
      { key: 'title2', value: 'para sua transportadora.' },
      { key: 'description1', value: 'Centralize a emissão de documentos fiscais, agendamento de janelas de descarga, comprovação de entrega digital e liquidação de fretes em uma plataforma unificada criada para a rotina do transporte.' },
      { key: 'text4', value: 'Consulta Rápida de Manifesto & CTE' },
      { key: 'text5', value: '99.8%' },
      { key: 'text6', value: 'Pontualidade nas entregas' },
      { key: 'text7', value: '-45min' },
      { key: 'text8', value: 'Espera média em portaria' },
      { key: 'text9', value: '+18k' },
      { key: 'text10', value: 'Viagens mensais ativas' },
      { key: 'text11', value: 'Status Operacional Hoje' },
      { key: 'text12', value: '● Sem Ocorrências' },
      { key: 'text13', value: 'Central de Agendamento' },
      { key: 'text14', value: '142 Docas Livres' },
      { key: 'text15', value: 'Emissão SEFAZ em lote' },
      { key: 'text16', value: 'Normal (0.8s)' },
      { key: 'text17', value: 'Plantão Motoristas' },
      { key: 'text18', value: '(11) 90000-0001' },
      { key: 'text19', value: 'Suporte dedicado para transportadoras parceiras e operadores logísticos em todo o território nacional.' },
      { key: 'text20', value: 'Composição Operacional' },
      { key: 'title3', value: 'Infraestrutura em Campo & Centros de Distribuição' },
      { key: 'text21', value: '3 frentes conectadas em tempo real' },
      { key: 'image1', imageFilename: 'fleet-dispatch.jpg', imageAlt: 'Centro de Despacho e Pátio de Cargas da Transportadora' },
      { key: 'text22', value: 'Frente 01 • Logística de Pátio' },
      { key: 'title4', value: 'Centro de Expedição & Despacho' },
      { key: 'description2', value: 'Monitoramento de baús, carretas e liberação automatizada de frotas 24 horas por dia.' },
      { key: 'image2', imageFilename: 'driver-tablet.jpg', imageAlt: 'Conferência Digital de Carga com Tablet pelo Motorista' },
      { key: 'text23', value: 'Frente 02 • Conferência na Ponta' },
      { key: 'title5', value: 'Conferência Digital de Volumes' },
      { key: 'description3', value: 'Validação de código de barras e canhotos de entrega diretamente via tablet ou smartphone.' },
      { key: 'image3', imageFilename: 'highway-fleet.jpg', imageAlt: 'Frota Pesada de Transporte em Trânsito nas Rodovias' },
      { key: 'text24', value: 'Frente 03 • Rastreamento Ativo' },
      { key: 'title6', value: 'Frotas em Rota Interestadual' },
      { key: 'description4', value: 'Geolocalização constante com alertas de desvio de rota e previsão dinâmica de chegada.' },
    ],
  },
  {
    company: 'rastrear',
    pageSlug: 'home',
    slug: 'features',
    name: 'Funcionalidades',
    title: 'Tudo o que sua transportadora precisa para operar no ritmo que os clientes exigem',
    subtitle: 'Módulos Especializados',
    content: 'Elimine planilhas paralelas, ligações intermináveis para motoristas e papeladas perdidas. O portal centraliza todas as etapas da cadeia de suprimentos em um só fluxo.',
    fields: [
      { key: 'tag1', value: 'Emissão Fiscal' },
      { key: 'title1', value: 'CTE & MDF-e Express' },
      { key: 'description1', value: 'Transmissão direta para a SEFAZ em frações de segundo. Validação automática de dados fiscais, RNTRC e averbação de seguro de carga sem retrabalho manual.' },
      { key: 'highlight1', value: '99.9% taxa de aprovação sem rejeição' },
      { key: 'tag2', value: 'Gestão de Pátio' },
      { key: 'title2', value: 'Janelas de Carga & Descarga' },
      { key: 'description2', value: 'Agendamento inteligente de docas com sincronização em tempo real entre transportadoras e centros de distribuição. Acabe com filas de carretas na rodovia.' },
      { key: 'highlight2', value: '-42% redução no tempo de retenção' },
      { key: 'tag3', value: 'Comprovação Digital' },
      { key: 'title3', value: 'POD Digital com OCR & Geotag' },
      { key: 'description3', value: 'Motoristas capturam a foto do canhoto e a assinatura eletrônica do recebedor pelo celular. O sistema valida nitidez e carimbos antes do envio.' },
      { key: 'highlight3', value: 'Liquidação liberada em até 15 minutos' },
      { key: 'tag4', value: 'Fluxo Financeiro' },
      { key: 'title4', value: 'Extrato & Antecipação de Frete' },
      { key: 'description4', value: 'Conciliação automática de valores de frete peso, pedágio vale e estadias. Painel financeiro transparente com download de relatórios em PDF e Excel.' },
      { key: 'highlight4', value: 'Zero divergência entre fatura e CTE' },
      { key: 'text1', value: 'Módulos Especializados' },
      { key: 'title5', value: 'Tudo o que sua transportadora precisa para operar no ritmo que os clientes exigem' },
      { key: 'description5', value: 'Elimine planilhas paralelas, ligações intermináveis para motoristas e papeladas perdidas. O portal centraliza todas as etapas da cadeia de suprimentos em um só fluxo.' },
      { key: 'title6', value: 'Integração Nativa com TMS e ERPs de Mercado' },
      { key: 'description6', value: 'Conectores prontos para Totvs, Senior, Sankhya, SAP e sistemas proprietários de transportadoras.' },
      { key: 'text2', value: 'Webhooks & APIs REST RESTful' },
    ],
  },
  {
    company: 'rastrear',
    pageSlug: 'home',
    slug: 'testimonial',
    name: 'Depoimento',
    title: 'Marcos Silveira',
    subtitle: 'Case de Sucesso • Transporte Rodoviário',
    content: '“Antes do Rastrear, nossos motoristas perdiam até duas horas na portaria esperando conferência física de nota e liberação de carga. Hoje, o caminhão chega com QR Code, faz o check-in na cancela e sai com o canhoto digitalizado em 20 minutos.”',
    imageFilename: 'director-avatar.svg',
    imageAlt: 'Marcos Silveira - Diretor de Operações',
    fields: [
      { key: 'text1', value: 'Case de Sucesso • Transporte Rodoviário' },
      { key: 'description1', value: '“Antes do Rastrear, nossos motoristas perdiam até duas horas na portaria esperando conferência física de nota e liberação de carga. Hoje, o caminhão chega com QR Code, faz o check-in na cancela e sai com o canhoto digitalizado em 20 minutos.”' },
      { key: 'image1', imageFilename: 'director-avatar.svg', imageAlt: 'Marcos Silveira - Diretor de Operações' },
      { key: 'title1', value: 'Marcos Silveira' },
      { key: 'description2', value: 'Diretor de Operações Logísticas' },
      { key: 'text2', value: 'TransLog Brasil Express • Frota de 420 cavalos mecânicos' },
      { key: 'text3', value: '-64%' },
      { key: 'text4', value: 'Tempo de permanência em pátio' },
      { key: 'description3', value: 'De 75 min para 27 min médios' },
      { key: 'text5', value: '100%' },
      { key: 'text6', value: 'Canhotos digitalizados' },
      { key: 'description4', value: 'Eliminação total do extravio físico' },
      { key: 'text7', value: 'R$ 140k' },
      { key: 'text8', value: 'Economia mensal em estadias' },
      { key: 'description5', value: 'Auditoria automática de cobranças' },
      { key: 'text9', value: '4.8x' },
      { key: 'text10', value: 'Mais rápido para liquidar frete' },
      { key: 'description6', value: 'Aprovação financeira no mesmo dia' },
    ],
  },
  {
    company: 'rastrear',
    pageSlug: 'home',
    slug: 'faq',
    name: 'Perguntas frequentes',
    title: 'Perguntas Frequentes de Transportadoras',
    subtitle: 'Tire Suas Dúvidas',
    content: 'Entenda como a implantação do Rastrear ocorre na prática no seu dia a dia operacional.',
    fields: [
      { key: 'question1', value: 'Como a transportadora integra o sistema com seu TMS ou ERP atual?' },
      { key: 'answer1', value: 'O Rastrear possui conectores REST e Webhooks compatíveis com os principais softwares do mercado (Totvs Protheus/Logix, Senior Megasul, Sankhya, Bsoft, entre outros), além de importação em lote de arquivos XML de NF-e, CT-e e MDF-e.' },
      { key: 'question2', value: 'Os motoristas agregados e terceiros precisam pagar para usar o aplicativo?' },
      { key: 'answer2', value: 'Não. O aplicativo do motorista é gratuito para download nas lojas Google Play e App Store. O acesso é liberado mediante convite e CPF cadastrado pela transportadora parceira.' },
      { key: 'question3', value: 'O que acontece quando o motorista faz uma entrega em área rural ou sem cobertura celular?' },
      { key: 'answer3', value: 'O aplicativo funciona 100% offline. Ele armazena localmente a foto do canhoto, a assinatura e as coordenadas de GPS registradas no momento exato da entrega. Assim que o aparelho recupera qualquer conexão (3G, 4G, 5G ou Wi-Fi), o comprovante é transmitido automaticamente.' },
      { key: 'question4', value: 'Como funciona o agendamento de janelas em centros de distribuição e embarcadores?' },
      { key: 'answer4', value: 'A transportadora acessa o módulo de agendamento, informa o número do CT-e/NF-e e visualiza os horários disponíveis nas docas do destinatário. Ao confirmar, um QR Code de acesso à portaria é gerado para o motorista, eliminando filas.' },
      { key: 'question5', value: 'Qual é o prazo de resposta do suporte técnico para incidentes em rodovia?' },
      { key: 'answer5', value: 'Nosso plantão operacional funciona 24 horas por dia, 7 dias por semana, via telefone (11) 90000-0001 e e-mail contato@rastrear.example, com tempo médio de primeiro atendimento inferior a 3 minutos para questões críticas.' },
      { key: 'text1', value: 'Tire Suas Dúvidas' },
      { key: 'title1', value: 'Perguntas Frequentes de Transportadoras' },
      { key: 'description1', value: 'Entenda como a implantação do Rastrear ocorre na prática no seu dia a dia operacional.' },
    ],
  },
  // Rastrear - Logistica
  {
    company: 'rastrear',
    pageSlug: 'logistica',
    slug: 'control-tower',
    name: 'Torre de controle',
    title: 'Torre de Controle Integrada para Despachantes e Embarcadores',
    subtitle: 'Visibilidade Ponto a Ponto',
    content: 'Diferente de sistemas genéricos de rastreamento, a Torre de Controle do Rastrear correlaciona os dados telemáticos da frota diretamente com os prazos de entrega contratuais (SLA), disparando alertas preditivos de atraso antes mesmo que o cliente perceba.',
    imageFilename: 'control-tower.svg',
    imageAlt: 'Torre de Controle Operacional e Telemetria de Frota',
    fields: [
      { key: 'image1', imageFilename: 'control-tower.svg', imageAlt: 'Torre de Controle Operacional e Telemetria de Frota' },
      { key: 'text1', value: 'Conexão ativa com 1.480 rastreadores e sensores de baú' },
      { key: 'text2', value: 'LATÊNCIA < 200ms' },
      { key: 'text3', value: 'Visibilidade Ponto a Ponto' },
      { key: 'title1', value: 'Torre de Controle Integrada para Despachantes e Embarcadores' },
      { key: 'description1', value: 'Diferente de sistemas genéricos de rastreamento, a Torre de Controle do Rastrear correlaciona os dados telemáticos da frota diretamente com os prazos de entrega contratuais (SLA), disparando alertas preditivos de atraso antes mesmo que o cliente perceba.' },
      { key: 'title2', value: 'Geofencing de Pátios e Docas' },
      { key: 'description2', value: 'Check-in automático assim que o caminhão entra no raio de 500m do centro de distribuição, notificando a equipe de armazém.' },
      { key: 'title3', value: 'Cálculo Dinâmico de ETA por IA' },
      { key: 'description3', value: 'Previsão de chegada considerando tráfego em rodovias, paradas obrigatórias da Lei do Motorista e condições meteorológicas.' },
      { key: 'title4', value: 'Link Público de Rastreio para Clientes Finais' },
      { key: 'description4', value: 'Compartilhe páginas seguras com a identidade da sua transportadora, permitindo que destinatários acompanhem suas encomendas sem ligar para o SAC.' },
    ],
  },
  {
    company: 'rastrear',
    pageSlug: 'logistica',
    slug: 'gallery',
    name: 'Galeria operacional',
    title: 'Do aplicativo na cabine do motorista ao painel do pátio',
    subtitle: 'Galeria de Recursos em Ação',
    content: 'Veja como a experiência foi desenhada para a realidade prática das transportadoras brasileiras, garantindo usabilidade rápida sob qualquer condição.',
    imageFilename: 'mobile-pod.svg',
    imageAlt: 'Aplicativo do Motorista com POD Digital e Assinatura Eletrônica',
    fields: [
      { key: 'text1', value: 'Galeria de Recursos em Ação' },
      { key: 'title1', value: 'Do aplicativo na cabine do motorista ao painel do pátio' },
      { key: 'description1', value: 'Veja como a experiência foi desenhada para a realidade prática das transportadoras brasileiras, garantindo usabilidade rápida sob qualquer condição.' },
      { key: 'image1', imageFilename: 'mobile-pod.svg', imageAlt: 'Aplicativo do Motorista com POD Digital e Assinatura Eletrônica' },
      { key: 'text2', value: 'Módulo Motorista • Android & iOS' },
      { key: 'title2', value: 'Comprovante de Entrega na Ponta (POD Digital)' },
      { key: 'description2', value: 'O motorista tira a foto do canhoto assinado, o sistema realiza reconhecimento óptico dos carimbos (OCR), coleta coordenadas GPS e envia a confirmação para a transportadora e o cliente em tempo real, mesmo se estiver sem sinal no momento da entrega.' },
      { key: 'text3', value: 'Modo offline com sincronização automática' },
      { key: 'text4', value: 'Módulo Ativo' },
      { key: 'image2', imageFilename: 'warehouse-dock.svg', imageAlt: 'Painel de Agendamento de Docas e Gestão de Pátio Logístico' },
      { key: 'text5', value: 'Módulo Hub • Gestão de Armazéns' },
      { key: 'title3', value: 'Painel de Ocupação de Docas e Pátio (YMS)' },
      { key: 'description3', value: 'Visão em tempo real da alocação de carretas por doca, status de carga/descarga por percentual concluído e previsão de liberação para a próxima escala. Permite que transportadores reservem slots prioritários com antecedência.' },
      { key: 'text6', value: 'Alertas sonoros para tempo limite de doca' },
      { key: 'text7', value: 'Módulo Ativo' },
    ],
  },
]

export async function seedComponents(payload: Payload) {
  for (const item of initialComponents) {
    const companies = await payload.find({
      collection: 'companies',
      where: { slug: { equals: item.company } },
      limit: 1,
    })
    const company =
      companies.docs[0] ??
      (await payload.create({
        collection: 'companies',
        data: {
          slug: item.company,
          name: item.company === 'localize' ? 'Localize' : 'Rastrear',
        },
      }))

    let primaryMediaId: number | string | undefined
    if (item.imageFilename) {
      const found = await payload.find({
        collection: 'media',
        where: {
          and: [
            { company: { equals: company.id } },
            { filename: { equals: item.imageFilename } },
          ],
        },
        limit: 1,
        depth: 0,
      })
      const media =
        found.docs[0] ??
        (await payload.create({
          collection: 'media',
          data: {
            company: company.id,
            alt: item.imageAlt || item.name,
          },
          filePath: fileURLToPath(
            new URL(`../companys/assets/${item.imageFilename}`, import.meta.url),
          ),
        }))
      primaryMediaId = media.id
    }

    const extraFields = []
    if (item.fields) {
      for (const f of item.fields) {
        let fieldMediaId: number | string | undefined
        if (f.imageFilename) {
          const found = await payload.find({
            collection: 'media',
            where: {
              and: [
                { company: { equals: company.id } },
                { filename: { equals: f.imageFilename } },
              ],
            },
            limit: 1,
            depth: 0,
          })
          const media =
            found.docs[0] ??
            (await payload.create({
              collection: 'media',
              data: {
                company: company.id,
                alt: f.imageAlt || f.key,
              },
              filePath: fileURLToPath(
                new URL(`../companys/assets/${f.imageFilename}`, import.meta.url),
              ),
            }))
          fieldMediaId = media.id
        }
        extraFields.push({
          key: f.key,
          value: f.value ?? '',
          image: Number(fieldMediaId) || undefined,
        })
      }
    }

    const existing = await payload.find({
      collection: 'site-components',
      where: {
        and: [
          { company: { equals: company.id } },
          { pageSlug: { equals: item.pageSlug } },
          { slug: { equals: item.slug } },
        ],
      },
      limit: 1,
    })

    if (!existing.docs[0]) {
      await payload.create({
        collection: 'site-components',
        data: {
          name: item.name,
          slug: item.slug,
          pageSlug: item.pageSlug,
          company: company.id,
          title: item.title || '',
          subtitle: item.subtitle || '',
          content: item.content || '',
          image: Number(primaryMediaId) || undefined,
          fields: extraFields,
        },
      })
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.env.PAYLOAD_MIGRATING = 'true'
  const payload = await getPayload({ config })
  try {
    await seedComponents(payload)
    console.log('Componentes do site inicializados com sucesso!')
    process.exit(0)
  } catch (error) {
    console.error('Erro ao semear componentes:', error)
    process.exit(1)
  }
}
