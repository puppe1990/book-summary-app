import { Book, SubscriptionPlan } from './types';

export const CATEGORIES = [
  'Todos',
  'Desenvolvimento Pessoal',
  'Finanças & Investimentos',
  'Negócios & Startup',
  'Liderança & Gestão',
  'Psicologia Aplicada'
];

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_lite',
    name: 'Plano Essencial',
    priceMonthly: 19.90,
    priceAnnual: 14.90, // price per month
    tagline: 'Ideal para iniciar o hábito da leitura diária.',
    features: [
      'Acesso a 5 resumos exclusivos por mês',
      'Leitura em alta velocidade',
      'Lembretes diários de leitura',
      'Suporte via e-mail'
    ]
  },
  {
    id: 'plan_pro',
    name: 'Plano Premium Ultra',
    priceMonthly: 34.90,
    priceAnnual: 24.90, // price per month, billed annually
    tagline: 'Acesso total e irrestrito para sua evolução.',
    features: [
      'Resumos ilimitados (todo o catálogo)',
      'Simulador de Audio-Leitor Inteligente',
      'Marcação de favoritos e anotações pessoais',
      'Download em PDF/ePub para ler offline',
      'Insights acionáveis formatados em tópicos',
      'Suporte prioritário 24/7'
    ],
    popular: true
  }
];

export const BOOKS_DATA: Book[] = [
  {
    id: 'habitos-atomicos',
    title: 'Hábitos Atômicos',
    originalTitle: 'Atomic Habits',
    author: 'James Clear',
    category: 'Desenvolvimento Pessoal',
    description: 'Um guia prático sobre como mudar seus hábitos e obter 1% de melhoria a cada dia. James Clear revela segredos para criar bons hábitos e quebrar os ruins de forma simples.',
    coverColor: 'from-blue-600 to-indigo-900',
    coverTextColor: 'text-indigo-50',
    readTimeMin: 12,
    rating: 4.9,
    reviewsCount: 312,
    isPremium: false, // FREE book so users can test immediately!
    takeaways: [
      'Melhorar 1% todos os dias resulta em uma evolução de 37 vezes em um ano.',
      'O ambiente é mais importante do que a motivação para manter hábitos consistentes.',
      'Esqueça as metas, foque nos sistemas que você implementa.',
      'A mudança de identidade é a chave para o hábito de longo prazo.'
    ],
    chapters: [
      {
        id: 'hab-cap1',
        title: '1. O Poder Surpreendente dos Hábitos Atômicos',
        content: 'Pequenos hábitos (atômicos) acumulam-se ao longo do tempo para criar resultados monumentais. Assim como os juros compostos multiplicam o seu dinheiro, os efeitos dos seus hábitos multiplicam-se à medida que você os repete.\n\n### Pontos-Chave:\n*   **O efeito acumulado:** Uma melhora de 1% a cada dia gera um impacto gigantesco ao longo do ano: (1.01)^365 = 37.78.\n*   **O Planalto do Potencial Latente:** O progresso não é linear. Muitas vezes, os resultados de nossos esforços parecem invisíveis no começo, criando uma fase de frustração chamada "Vale da Decepção". No entanto, o esforço anterior está acumulado e se revelará de forma repentina.\n*   **Sistemas vs Metas:** Metas tratam dos resultados que você deseja alcançar. Sistemas tratam dos processos que levam a esses resultados. Focar apenas na meta cria um conflito momentâneo; focar no sistema garante melhoria constante.'
      },
      {
        id: 'hab-cap2',
        title: '2. As 4 Leis da Mudança de Comportamento',
        content: 'Para criar um hábito excelente, você deve seguir o modelo neurológico que James Clear chama de "Loop do Hábito": Estímulo, Desejo, Resposta e Recompensa.\n\n### Como criar um bom hábito:\n1.  **Tornar Claro (Estímulo):** Desenhe seu ambiente para expor os gatilhos dos hábitos desejados. Use a "Intenção de Implementação": "Eu farei [AÇÃO] às [HORA] no [LOCAL]".\n2.  **Tornar Atraente (Desejo):** Combine uma ação que você quer fazer com uma ação que você precisa fazer (Emparelhamento de tentações).\n3.  **Tornar Fácil (Resposta):** Reduza o atrito. Use a "Regra dos 2 Minutos": quando você iniciar um novo hábito, ele deve levar menos de dois minutos para ser feito (ex: ler 1 página).\n4.  **Tornar Satisfatório (Recompensa):** Use a satisfação imediata. Um rastreador de hábitos ajuda a manter o ritmo visual da sua consistência.'
      },
      {
        id: 'hab-cap3',
        title: '3. A Mudança Baseada em Identidade',
        content: 'A verdadeira mudança de hábitos não está no que você quer alcançar, mas em quem você quer se tornar. Existem três camadas de mudança de comportamento: mudança de resultados, mudança de processos e mudança de identidade.\n\n### As três camadas:\n*   **Resultados:** Foco em ganhar um prêmio, perder peso ou escrever um livro (nível superficial).\n*   **Processos:** Foco em mudar hábitos diários: limpar a mesa, correr 5km sabendo como treinar.\n*   **Identidade:** Foco em mudar suas crenças profundamente consolidadas: sua visão de mundo, autoimagem e julgamentos sobre si.\n\n### Decidindo quem você quer ser:\nCada ação que você realiza é um voto para o tipo de pessoa que você deseja se tornar. Se você quer ser um escritor, ler e escrever todos os dias são votos acumulados que provam essa identidade para o seu cérebro.'
      }
    ]
  },
  {
    id: 'pai-rico-pai-pobre',
    title: 'Pai Rico, Pai Pobre',
    originalTitle: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    category: 'Finanças & Investimentos',
    description: 'A principal referência sobre educação financeira familiar no mundo. Entenda como as mentalidades de ricos e pobres diferem em relação ao dinheiro e acumulação de ativos.',
    coverColor: 'from-amber-600 to-amber-900',
    coverTextColor: 'text-amber-50',
    readTimeMin: 15,
    rating: 4.8,
    reviewsCount: 284,
    isPremium: true, // PREMIUM book to stimulate subscription!
    takeaways: [
      'Os ricos não trabalham pelo dinheiro; eles fazem o dinheiro trabalhar para eles.',
      'A diferença fundamental entre ativos (coloca dinheiro no seu bolso) e passivos (tira dinheiro).',
      'Alfabetização financeira é mais importante do que quanto dinheiro você ganha.',
      'Pague a si mesmo primeiro antes de quitar despesas superficiais.'
    ],
    chapters: [
      {
        id: 'pr-cap1',
        title: '1. Os Ricos Não Trabalham por Dinheiro',
        content: 'A maioria das pessoas está presa na "Corrida dos Ratos" porque é movida pelo medo da pobreza e pelo desejo de comprar luxos. Elas trabalham duro para pagar contas e impostos, enriquecendo patrões e governos.\n\n### Conceitos-Chave:\n*   **A armadilha do salário alto:** Ter um salário alto não resolve problemas financeiros de quem carece de inteligência financeira. Sem autocontrole, custos aumentam proporcionalmente ao salário.\n*   **Aprendizado prático:** O pai rico treinou os garotos pagando valores simbólicos e depois nada, forçando-os a usar a criatividade para gerar oportunidades de negócios fora do trabalho tradicional.'
      },
      {
        id: 'pr-cap2',
        title: '2. Ativo vs Passivo: A Regra de Ouro',
        content: 'Se você quer ficar rico, esta é a única regra que você precisa entender: você deve discernir e comprar ATIVOS nas suas finanças diárias.\n\n### Definições Simplificadas:\n*   **ATIVO:** É tudo aquilo que coloca dinheiro no seu bolso de forma recorrente (Ações, fundos imobiliários, aluguéis recebidos, royalties, negócios próprios automáticos).\n*   **PASSIVO:** É tudo aquilo que retira dinheiro do seu bolso (Financiamento do carro próprio, impostos de clube, juros do cartão, assinaturas inúteis).\n\n### Por que os ricos enriquecem?:\nEles expandem constantemente sua coluna de ativos enquanto mantêm as despesas no mínimo possível. A classe média foca em financiar casas caras, acreditando equivocadamente que a casa própria residencial é seu maior ativo.'
      },
      {
        id: 'pr-cap3',
        title: '3. Trabalhe para Aprender, Não para Ganhar Dinheiro',
        content: 'Robert defende que as pessoas talentosas deveriam focar em adquirir novas aptidões transversais de negócios em vez de buscarem cargos ultra-especializados estáveis.\n\n### Habilidades Críticas:\n1.  **Vendas e Comunicação:** Superar o medo da rejeição é o ingrediente secreto para atrair capital e vender ideias.\n2.  **Gestão de Fluxo de Caixa:** Entender a movimentação de entrada e saída do dinheiro é vital para a saúde de qualquer empresa.\n3.  **Gestão de Pessoas:** Liderar e delegar tarefas com sabedoria, rodeando-se de pessoas que são mais inteligentes do que você.'
      }
    ]
  },
  {
    id: 'de-zero-a-um',
    title: 'De Zero a Um',
    originalTitle: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Negócios & Startup',
    description: 'Como criar o futuro a partir de inovações brutas. Peter Thiel, cofundador do PayPal e investidor lendário, mostra por que copiar os outros não gerará novos monopólios disruptivos.',
    coverColor: 'from-slate-700 to-slate-900',
    coverTextColor: 'text-slate-50',
    readTimeMin: 10,
    rating: 4.7,
    reviewsCount: 195,
    isPremium: true,
    takeaways: [
      'Ir de zero a um significa criar algo totalmente novo, saindo da estagnação global.',
      'O monopólio criativo é o ideal para startups sustentáveis, ao contrário da competição acirrada.',
      'O poder das vendas/distribuição é equivalente ou superior ao design do produto técnico.',
      'Pergunte-se sempre: qual verdade importante poucas pessoas concordam com você?'
    ],
    chapters: [
      {
        id: 'zo-cap1',
        title: '1. O Desafio do Futuro: 0 a 1 vs 1 a N',
        content: 'Fazer o que já sabemos como fazer leva o mundo de 1 a n (globalização, cópia, eficiência gradual). Mas quando criamos algo verdadeiramente novo, vamos de **0 a 1** (tecnologia pura, inovação substancial).\n\n### Tipos de Progresso:\n*   **Horizontal ou Extensivo (1 a n):** Copiar coisas que funcionam. Exemplo: abrir 100 pizzarias baseadas em franquias bem-sucedidas.\n*   **Vertical ou Intensivo (0 a 1):** Criar algo sem precedentes. Exemplo: criar a internet ou o motor de compressão espacial.'
      },
      {
        id: 'zo-cap2',
        title: '2. Monopólios Criativos vs Competição Perfeita',
        content: 'Na economia clássica, a competição perfeita é idealizada como justa, mas sob a perspectiva empresarial, empresas competitivas esmagam suas próprias margens de lucro. Os verdadeiros líderes criam **monopólios criativos** para ter resiliência.\n\n### Por que o Monopólio é bom?:\nEle permite capitalizar margens gordas que financiam pesquisas de longo prazo e tratam bem os funcionários. O Google possui um monopólio indiscutível em buscas de anúncios, livrando-o da briga voraz que canibaliza restaurantes de bairro.'
      },
      {
        id: 'zo-cap3',
        title: '3. As Características das Startups de Monopólio',
        content: 'Uma startup vitoriosa normalmente exibe uma combinação de quatro fatores primordiais:\n\n1.  **Tecnologia Proprietária:** Deve ser no mínimo 10 vezes melhor que o concorrente mais próximo para forçar a substituição.\n2.  **Efeitos de Rede:** O uso do produto torna-o valioso para o resto da rede (ex: WhatsApp, Facebook).\n3.  **Economias de Escala:** Custos marginais baixos enquanto a escala avança rapidamente (ex: licenças de software).\n4.  **Marca Forte:** Criação de design excepcional que evoca status e confiança (ex: Apple).'
      }
    ]
  },
  {
    id: 'comece-pelo-porque',
    title: 'Comece Pelo Porquê',
    originalTitle: 'Start with Why',
    author: 'Simon Sinek',
    category: 'Liderança & Gestão',
    description: 'Como grandes líderes inspiram pessoas e organizações a agir. Conheça o Círculo de Ouro e entenda como articular o propósito por trás de seus negócios.',
    coverColor: 'from-rose-600 to-rose-950',
    coverTextColor: 'text-rose-50',
    readTimeMin: 11,
    rating: 4.6,
    reviewsCount: 167,
    isPremium: true,
    takeaways: [
      'Pessoas não compram o que você faz; elas compram o PORQUÊ você faz.',
      'O Círculo de Ouro consiste de três círculos: Porquê, Como e O Quê.',
      'Manipulações de mercado (descontos, medo) vendem a curto prazo, mas não geram fidelidade.',
      'A biologia da confiança humana reside na necessidade de pertencer a uma tribo.'
    ],
    chapters: [
      {
        id: 'sw-cap1',
        title: '1. O Círculo de Ouro (Golden Circle)',
        content: 'Quase todas as organizações sabem O QUE fazem (produtos, serviços). Algumas poucas sabem COMO fazem (diferenciais, canais). Mas raríssimas sabem **POR QUE** fazem o que fazem (propósito, causa, crença).\n\n```\n    [ POR QUÊ ]   <-- O Coração (Crença)\n   [   COMO   ]   <-- O Processo (Ação)\n  [    O QUÊ   ]  <-- O Produto (Resultado)\n```\n\n### Comunicação de Dentro para Fora\nLíderes inspiradores comunicam-se de dentro para fora do círculo. A Apple não vende computadores dizendo "Temos computadores potentes, compre". Ela diz "Desafiamos o status quo pensando diferente. Criamos designs incríveis. Por acaso, fazemos computadores excelentes. Quer comprar um?".'
      },
      {
        id: 'sw-cap2',
        title: '2. Clientes e Organizações Biologicamente Conectadas',
        content: 'O cérebro humano está dividido de forma que corresponde exatamente ao Círculo de Ouro:\n\n*   **Cérebro Neocórtex (O Quê):** Responsável pelo pensamento analítico, racional e linguagem.\n*   **Cérebro Límbico (Porquê e Como):** Responsável por todos os sentimentos, como confiança e lealdade, além das decisões de compra e comportamento - sem capacidade de verbalização analítica.\n\nQuando comunicamos apenas "O Quê" (dados, especificações técnicas), apelamos para o neocórtex analítico, mas não inspiramos a ação instintiva do límbico que firma as assinaturas e compras.'
      }
    ]
  },
  {
    id: 'o-poder-do-habito',
    title: 'O Poder do Hábito',
    originalTitle: 'The Power of Habit',
    author: 'Charles Duhigg',
    category: 'Psicologia Aplicada',
    description: 'A ciência por trás do comportamento humano e por que fazemos o que fazemos na vida e nos negócios. Aprenda o mecanismo químico neural que rege nossas reações diárias automáticas.',
    coverColor: 'from-emerald-600 to-emerald-950',
    coverTextColor: 'text-emerald-50',
    readTimeMin: 14,
    rating: 4.8,
    reviewsCount: 220,
    isPremium: false, // FREE book so users can test immediately!
    takeaways: [
      'Hábitos são gerados pelo cérebro para economizar energia metabólica.',
      'O Loop do Hábito possui três etapas: Deixa, Rotina e Recompensa.',
      'Você não pode eliminar um hábito ruim, apenas substituí-lo mudando a rotina corporativa.',
      'Hábitos angulares são aqueles que, ao mudarem, provocam uma reação em cadeia positiva.'
    ],
    chapters: [
      {
        id: 'ph-cap1',
        title: '1. A Anatomia do Loop do Hábito',
        content: 'Estudos com ratos em labirintos demonstraram que, conforme uma atividade se torna repetitiva, a atividade cerebral diminui drasticamente. O cérebro automatiza o comportamento para focar em outras contingências críticas.\n\n### O Ciclo Neutro:\n1.  **Deixa (Deixa):** O gatilho que avisa o seu cérebro para adotar o modo piloto automático.\n2.  **Rotina:** A resposta física, mental ou emocional que se segue ao gatilho.\n3.  **Recompensa:** O prêmio estimulante que diz ao cérebro que esta rotina vale a pena lembrar no futuro.'
      },
      {
        id: 'ph-cap2',
        title: '2. Regra de Ouro da Substituição de Hábitos',
        content: 'Para alterar um hábito indesejado (como comer doces quando está estressado), você deve manter a mesma Deixa (tédio/estresse) e a mesma Recompensa (relaxamento/alívio), alterando apenas a **Rotina**.\n\n*   **Exemplo:** Se você fuma toda vez que está entediado para interagir socialmente na calçada com amigos, substitua o cigarro por uma xícara de chá e 10 minutos de caminhada de conversa com os mesmos mentores.'
      }
    ]
  },
  {
    id: 'psicologia-financeira',
    title: 'A Psicologia Financeira',
    originalTitle: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finanças & Investimentos',
    description: 'Lições atemporais sobre a riqueza, a ganância e a felicidade humana. Housel explica por que saber como se comportar é mais importante do que fórmulas matemáticas frias.',
    coverColor: 'from-purple-600 to-purple-950',
    coverTextColor: 'text-purple-50',
    readTimeMin: 13,
    rating: 4.9,
    reviewsCount: 247,
    isPremium: true,
    takeaways: [
      'Ir bem com dinheiro tem pouco a ver com inteligência e muito com comportamento.',
      'Riqueza é aquilo que você não vê: os carros caros que você decidiu não comprar.',
      'Manter a riqueza exige uma mistura de humildade com prudência no investimento.',
      'O maior valor gerido do dinheiro é dar controle total sobre o seu tempo diário.'
    ],
    chapters: [
      {
        id: 'pf-cap1',
        title: '1. Ninguém é Louco',
        content: 'As suas decisões de investimento dependem intimamente da geração e do ambiente econômico em que você cresceu. Um indivíduo que testemunhou a hiperinflação na adolescência enxergará o risco dos títulos de forma radicalmente diferente de quem cresceu em uma inflação controlada estável de 2% ao ano.\n\n### Lição:\nNão julgue vizinhos ou conhecidos por escolhas financeiras que parecem irracionais. Cada um opera sob lentes específicas de como o mundo funciona e qual o nível de preservação necessário para dormir bem à noite.'
      },
      {
        id: 'pf-cap2',
        title: '2. Riqueza é o que Você Não Vê',
        content: 'Temos o hábito de medir o sucesso financeiro das pessoas pela ostentação das coisas materiais compradas (manções, iates, automóveis importados de luxo). No entanto, o autor nos lembra de que **riqueza** são os ativos financeiros não convertidos em objetos de despesa depreciativa imediata.\n\n*   **Riqueza:** Dinheiro guardado, opções de liberdade, fundos acumulados que compram tempo.\n*   **Riqueza Ostentada (Proporção):** Simboliza apenas quanto dinheiro a pessoa gastou recentemente, descapitalizando-se.'
      }
    ]
  }
];

export const MOCK_REVIEWS = [
  { id: 'rev-1', bookId: 'habitos-atomicos', userName: 'Carlos Albuquerque', rating: 5, comment: 'Incrível! O resumo é super completo e os insights acionáveis mudaram a forma como organizo minhas manhãs.', date: '25/05/2026' },
  { id: 'rev-2', bookId: 'habitos-atomicos', userName: 'Beatriz Santos', rating: 4, comment: 'Muito preciso e focado na prática diária. Excelente leitura de 12 minutos.', date: '18/05/2026' },
  { id: 'rev-3', bookId: 'pai-rico-pai-pobre', userName: 'Marcelo Vieira', rating: 5, comment: 'Essencial. Recomendo assinar o premium apenas por esse resumo muito detalhado.', date: '20/05/2026' },
  { id: 'rev-4', bookId: 'de-zero-a-um', userName: 'Gabriela Mendes', rating: 5, comment: 'Excelente resumo para quem quer criar startups inovadoras. Desmistifica o mercado de forma brilhante.', date: '21/05/2026' }
];
