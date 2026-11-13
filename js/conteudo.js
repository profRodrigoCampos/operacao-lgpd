/* =========================================================
   OPERAÇÃO LGPD — Conteúdo (fichas do dossiê, perguntas, cartas)
   Base: Lei nº 13.709/2018 (LGPD)
   ========================================================= */

/* ---------- FICHAS DO DOSSIÊ (Manual do Detetive) ---------- */
const FICHAS = [
  {
    id: 1,
    titulo: "O que é a LGPD",
    tag: "A LEI",
    html: `
      <p><b>LGPD = Lei Geral de Proteção de Dados Pessoais</b>, a <b>Lei nº 13.709/2018</b>. Está em vigor desde <b>setembro de 2020</b>, e as multas podem ser aplicadas desde <b>agosto de 2021</b>.</p>
      <p><b>Objetivo:</b> proteger os direitos fundamentais de <b>liberdade</b> e de <b>privacidade</b> das <b>pessoas naturais</b> (pessoas físicas, não empresas).</p>
      <p><b>A quem se aplica:</b> a qualquer pessoa física ou empresa, <b>pública ou privada</b>, de qualquer tamanho, que trate dados pessoais. Vale para dados <b>digitais e em papel</b>. Também vale para empresas estrangeiras que oferecem serviços a pessoas no Brasil.</p>
      <p><b>Onde NÃO se aplica (art. 4º):</b></p>
      <ul>
        <li>uso <b>particular e sem fins econômicos</b> (a agenda de contatos do seu celular);</li>
        <li>fins exclusivamente <b>jornalísticos ou artísticos</b> (e acadêmicos, com ressalvas);</li>
        <li><b>segurança pública, defesa nacional</b> e <b>investigação penal</b>, que têm lei própria.</li>
      </ul>
      <p><b>ANPD (Autoridade Nacional de Proteção de Dados):</b> é o órgão federal que <b>orienta, fiscaliza e aplica sanções</b>.</p>`,
    diaadia: "A ficha de papel do consultório do dentista também está protegida pela LGPD.",
    dev: "Se o seu sistema guarda dados de pessoas, a LGPD vale para ele, seja de uma startup de 2 pessoas ou de um banco."
  },
  {
    id: 2,
    titulo: "Tipos de dados",
    tag: "AS EVIDÊNCIAS",
    html: `
      <p><b>Dado pessoal:</b> qualquer informação relacionada a uma pessoa natural <b>identificada ou identificável</b>.<br>
      <span class="ex">Ex.: nome, CPF, RG, e-mail, telefone, endereço, foto, <b>endereço IP</b>, geolocalização, placa do carro, ID do celular, cookies.</span></p>
      <p><b>Dado pessoal SENSÍVEL</b> (regras mais rígidas, porque o mau uso pode gerar <b>discriminação</b>):</p>
      <ul class="cols">
        <li>origem racial ou étnica</li>
        <li>convicção religiosa</li>
        <li>opinião política</li>
        <li>filiação a sindicato ou a organização religiosa, filosófica ou política</li>
        <li>saúde e vida sexual</li>
        <li>dado genético</li>
        <li>dado biométrico (digital, rosto, íris)</li>
      </ul>
      <p><b>Dado anonimizado:</b> não permite identificar a pessoa usando meios técnicos razoáveis. Em regra, <b>não é considerado dado pessoal</b>. Mas se der para reverter a anonimização, ele volta a ser.</p>
      <p><b>Dado pseudonimizado:</b> o identificador foi trocado por um código, mas existe uma "tabela" guardada à parte que permite reidentificar. <b>Continua sendo dado pessoal!</b></p>`,
    diaadia: "Usar a digital para entrar na academia significa entregar um dado sensível (biometria).",
    dev: "Trocar o CPF por um UUID e guardar a tabela de correspondência é pseudonimização, não anonimização."
  },
  {
    id: 3,
    titulo: "Quem é quem",
    tag: "OS PERSONAGENS",
    html: `
      <table class="tab">
        <tr><td><b>Titular</b></td><td>A pessoa natural a quem os dados se referem. <i>(você!)</i></td></tr>
        <tr><td><b>Controlador</b></td><td>Quem <b>toma as decisões</b> sobre o tratamento: o que coletar, para quê e como.</td></tr>
        <tr><td><b>Operador</b></td><td>Quem trata os dados <b>em nome do controlador</b>, seguindo as instruções dele.</td></tr>
        <tr><td><b>Encarregado (DPO)</b></td><td>O <b>canal de comunicação</b> entre o controlador, os titulares e a ANPD.</td></tr>
        <tr><td><b>ANPD</b></td><td>A autoridade que fiscaliza e aplica as sanções.</td></tr>
      </table>
      <p>Controlador e operador são chamados de <b>agentes de tratamento</b>, e os dois podem ser responsabilizados por danos.</p>
      <p class="ex"><b>No caso BauruByte:</b> o app de delivery é o <b>controlador</b>; a empresa de nuvem que hospeda o banco e o serviço de envio de e-mails são <b>operadores</b>; os clientes são os <b>titulares</b>.</p>`,
    diaadia: "Se quiser saber o que uma empresa faz com seus dados, procure o contato do Encarregado (DPO) na política de privacidade.",
    dev: "Ao integrar uma API de terceiros que recebe dados dos seus usuários, esse fornecedor passa a ser um operador. O contrato precisa exigir segurança dele."
  },
  {
    id: 4,
    titulo: "Tratamento e ciclo de vida",
    tag: "A CENA DO CRIME",
    html: `
      <p><b>Tratamento</b> é <b>toda operação</b> feita com dados pessoais: coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, <b>arquivamento, armazenamento</b>, eliminação, avaliação, controle, modificação, comunicação, transferência, difusão ou extração.</p>
      <p>👉 <b>Só guardar uma planilha</b> com nomes e telefones já é tratamento!</p>
      <p><b>Término do tratamento (arts. 15 e 16):</b> o tratamento acaba quando:</p>
      <ul>
        <li>a finalidade foi alcançada ou os dados deixaram de ser necessários;</li>
        <li>o período de tratamento terminou;</li>
        <li>o titular pediu (por exemplo, revogando o consentimento);</li>
        <li>a ANPD determinou.</li>
      </ul>
      <p>Depois disso, os dados devem ser <b>eliminados</b>. A guarda só é permitida em exceções, por exemplo quando outra lei obriga a manter (como notas fiscais) ou para uso exclusivo do controlador, desde que os dados estejam anonimizados.</p>`,
    diaadia: "Se você cancelou um serviço, a empresa não pode ficar com todos os seus dados para sempre \"só por garantia\".",
    dev: "Defina uma política de retenção: rotinas que apagam ou anonimizam dados vencidos. Os backups também contam!"
  },
  {
    id: 5,
    titulo: "Os 10 princípios",
    tag: "O CÓDIGO DE CONDUTA",
    html: `
      <p>Todo tratamento deve respeitar a <b>boa-fé</b> e estes <b>10 princípios (art. 6º)</b>:</p>
      <ol class="princ">
        <li><b>Finalidade:</b> propósitos legítimos, específicos, explícitos e informados ao titular.</li>
        <li><b>Adequação:</b> o tratamento deve ser compatível com a finalidade informada.</li>
        <li><b>Necessidade:</b> usar só o <b>mínimo necessário</b> (é a chamada minimização).</li>
        <li><b>Livre acesso:</b> consulta fácil e gratuita sobre o tratamento e os dados.</li>
        <li><b>Qualidade dos dados:</b> dados exatos, claros e atualizados.</li>
        <li><b>Transparência:</b> informações claras e de fácil acesso.</li>
        <li><b>Segurança:</b> medidas técnicas e administrativas contra acessos não autorizados, vazamentos e perdas.</li>
        <li><b>Prevenção:</b> agir <b>antes</b> do dano acontecer.</li>
        <li><b>Não discriminação:</b> proibido usar os dados para discriminar de forma ilícita ou abusiva.</li>
        <li><b>Responsabilização e prestação de contas:</b> a empresa precisa <b>demonstrar</b> que cumpre a lei.</li>
      </ol>`,
    diaadia: "Um app de lanterna que pede acesso aos seus contatos fere os princípios da necessidade e da adequação.",
    dev: "Fazer pentest e corrigir falhas antes do lançamento atende à prevenção. Documentar as medidas atende à prestação de contas."
  },
  {
    id: 6,
    titulo: "Bases legais",
    tag: "O MANDADO",
    html: `
      <p>Só é permitido tratar dados pessoais se houver uma <b>base legal</b>, ou seja, uma "justificativa" prevista em lei. São <b>10 bases (art. 7º)</b>:</p>
      <ol class="cols2">
        <li><b>Consentimento</b> do titular</li>
        <li>Cumprimento de <b>obrigação legal ou regulatória</b></li>
        <li>Execução de <b>políticas públicas</b> pela administração pública</li>
        <li>Realização de <b>estudos por órgão de pesquisa</b></li>
        <li>Execução de <b>contrato</b> (ou procedimentos antes dele) a pedido do titular</li>
        <li>Exercício regular de <b>direitos em processo</b> judicial, administrativo ou arbitral</li>
        <li><b>Proteção da vida</b> ou da integridade física</li>
        <li><b>Tutela da saúde</b>, por profissionais ou serviços de saúde</li>
        <li><b>Legítimo interesse</b> do controlador ou de terceiro</li>
        <li><b>Proteção do crédito</b></li>
      </ol>
      <p>⚠️ <b>O consentimento NÃO é a única base!</b> Para entregar uma compra, por exemplo, a base é a execução de contrato.</p>
      <p>⚠️ Para <b>dados sensíveis (art. 11)</b> a lista é mais restrita: <b>não</b> vale o legítimo interesse nem a proteção do crédito.</p>
      <p>⚠️ <b>Dado público na internet</b> não é "terra de ninguém": o uso ainda precisa respeitar a finalidade, a boa-fé e o interesse público que justificaram ele estar disponível.</p>`,
    diaadia: "A empresa não precisa pedir consentimento para mandar os dados do seu salário ao eSocial: a base legal é a obrigação legal.",
    dev: "Cada campo coletado deve ter uma base legal documentada. Pergunte: \"por que guardo isto e com qual justificativa?\""
  },
  {
    id: 7,
    titulo: "Consentimento e crianças",
    tag: "A ASSINATURA",
    html: `
      <p><b>Consentimento</b> é a manifestação <b>livre, informada e inequívoca</b> pela qual o titular concorda com o tratamento para uma <b>finalidade determinada</b>.</p>
      <ul>
        <li>Deve ser dado por escrito, em cláusula destacada, ou por outro meio que demonstre a vontade do titular. Quem precisa <b>provar</b> o consentimento é o controlador.</li>
        <li><b>Autorizações genéricas são nulas</b>, como "podemos usar seus dados para qualquer fim".</li>
        <li>Pode ser <b>revogado a qualquer momento</b>, de forma <b>gratuita e facilitada</b>.</li>
        <li>Caixinha <b>já marcada</b> não demonstra uma escolha livre e inequívoca, então não vale.</li>
      </ul>
      <p><b>Crianças e adolescentes (art. 14):</b> o tratamento deve sempre atender ao <b>melhor interesse</b> deles.</p>
      <ul>
        <li>Para <b>crianças (até 12 anos incompletos)</b>, quando a base for o consentimento, ele precisa ser <b>específico e em destaque</b>, dado por <b>pelo menos um dos pais ou pelo responsável legal</b>.</li>
        <li>Jogos e apps não podem exigir que a criança forneça mais dados do que o estritamente necessário para participar.</li>
      </ul>`,
    diaadia: "Você pode retirar o consentimento para receber e-mails de marketing quando quiser, com um clique.",
    dev: "As caixas de consentimento começam desmarcadas. Guarde o registro do consentimento (quem, quando, para qual finalidade e qual versão do termo)."
  },
  {
    id: 8,
    titulo: "Direitos do titular",
    tag: "OS DIREITOS DA VÍTIMA",
    html: `
      <p>O titular pode exigir do controlador, <b>de forma gratuita (art. 18)</b>:</p>
      <ul class="cols">
        <li><b>Confirmação</b> de que existe tratamento</li>
        <li><b>Acesso</b> aos dados</li>
        <li><b>Correção</b> de dados incompletos, inexatos ou desatualizados</li>
        <li><b>Anonimização, bloqueio ou eliminação</b> de dados desnecessários, excessivos ou tratados de forma irregular</li>
        <li><b>Portabilidade</b> para outro fornecedor</li>
        <li><b>Eliminação</b> dos dados tratados com base no consentimento</li>
        <li><b>Informação sobre compartilhamento</b>: com quem os dados foram compartilhados</li>
        <li><b>Informação sobre a possibilidade de não consentir</b> e as consequências disso</li>
        <li><b>Revogação</b> do consentimento</li>
      </ul>
      <p><b>Art. 20:</b> direito de pedir a <b>revisão de decisões tomadas unicamente por algoritmos</b>, como score de crédito, perfil de consumo ou análise automática de currículo.</p>`,
    diaadia: "Teve o crédito negado por um \"sistema automático\"? Você pode pedir a revisão e informações sobre os critérios usados.",
    dev: "Botões como \"Baixar meus dados\" (acesso e portabilidade), \"Excluir minha conta\" (eliminação) e \"Gerenciar consentimentos\" (revogação) implementam esses direitos."
  },
  {
    id: 9,
    titulo: "Para quem programa",
    tag: "O KIT DO PERITO",
    html: `
      <p><b>Art. 46:</b> os agentes de tratamento devem adotar <b>medidas de segurança, técnicas e administrativas</b>, desde a <b>concepção do produto até a execução</b>.</p>
      <p><b>Privacy by design:</b> pensar na privacidade desde o projeto, e não "remendar" no fim. <b>Privacy by default:</b> a configuração padrão deve ser a mais protetiva (por exemplo, perfil privado por padrão).</p>
      <ul class="check">
        <li><b>Minimize:</b> o formulário pede só o necessário.</li>
        <li><b>Senhas:</b> use hash forte com salt (<code>bcrypt</code>, <code>Argon2</code>). Nunca texto puro, Base64 ou MD5.</li>
        <li><b>Em trânsito:</b> HTTPS/TLS sempre.</li>
        <li><b>Em repouso:</b> criptografe os dados sensíveis, com as chaves guardadas separadas do banco.</li>
        <li><b>Menor privilégio:</b> cada perfil acessa só o que precisa.</li>
        <li><b>Logs:</b> não registre senhas, tokens ou CPF completo. Mascare (<code>***.456.789-**</code>).</li>
        <li><b>URLs:</b> não coloque dados pessoais na query string (<code>?cpf=...</code>), porque eles vão parar no histórico, em logs e em proxies.</li>
        <li><b>Testes:</b> use dados fictícios ou anonimizados, nunca uma cópia da produção.</li>
        <li><b>Registro das operações (art. 37)</b> e <b>RIPD</b> (Relatório de Impacto à Proteção de Dados Pessoais) para tratamentos de risco.</li>
      </ul>`,
    diaadia: "Sites sem HTTPS (sem o cadeado) não deveriam receber seus dados.",
    dev: "\"Funciona\" não basta: o código também precisa proteger quem está nos dados."
  },
  {
    id: 10,
    titulo: "Incidentes e sanções",
    tag: "O VEREDITO",
    html: `
      <p><b>Incidente de segurança:</b> acesso não autorizado, <b>vazamento</b>, perda, alteração ou destruição de dados pessoais, seja acidental ou criminosa.</p>
      <p><b>Art. 48:</b> o controlador deve <b>comunicar a ANPD e os titulares</b> quando o incidente puder causar <b>risco ou dano relevante</b>. Pelo regulamento da ANPD (Resolução CD/ANPD nº 15/2024), o prazo é de <b>3 dias úteis</b>.</p>
      <p><b>Sanções administrativas (art. 52):</b></p>
      <ul class="cols">
        <li>advertência</li>
        <li><b>multa simples de até 2% do faturamento</b> no Brasil, limitada a <b>R$ 50 milhões por infração</b></li>
        <li>multa diária</li>
        <li><b>publicização</b> da infração</li>
        <li>bloqueio dos dados</li>
        <li>eliminação dos dados</li>
        <li>suspensão do banco de dados ou da atividade de tratamento</li>
        <li>proibição parcial ou total da atividade</li>
      </ul>
      <p>Além disso, quem causar dano ao titular <b>deve indenizá-lo (art. 42)</b>.</p>`,
    diaadia: "Recebeu um aviso de vazamento? Troque as senhas, ative a verificação em duas etapas (2FA) e desconfie de mensagens \"da empresa\" pedindo dados.",
    dev: "Esconder um incidente é a pior opção: tenha um plano de resposta a incidentes antes de precisar dele."
  }
];

/* ---------- PERGUNTAS ----------
   G = Pista (conceitos gerais, múltipla escolha)
   V = Interrogatório (verdadeiro ou falso)
   D = Código (para programadores, múltipla escolha)
   Múltipla escolha: o[0] é SEMPRE a correta (as alternativas são embaralhadas na tela).
   f = número da ficha relacionada.
*/
const PERGUNTAS = {
  G: [
    { q: "O que significa a sigla LGPD e qual é o número da lei?",
      o: ["Lei Geral de Proteção de Dados Pessoais — Lei nº 13.709/2018", "Lei Geral de Privacidade Digital — Lei nº 12.965/2014", "Lei de Garantia da Privacidade de Dados — Lei nº 14.133/2021", "Lei Geral de Proteção dos Dados Digitais — Lei nº 9.609/1998"],
      e: "LGPD é a Lei Geral de Proteção de Dados Pessoais, Lei nº 13.709/2018. A Lei 12.965/2014 é o Marco Civil da Internet.", f: 1 },
    { q: "Qual órgão orienta, fiscaliza e aplica as sanções da LGPD?",
      o: ["ANPD (Autoridade Nacional de Proteção de Dados)", "Anatel (Agência Nacional de Telecomunicações)", "CGI.br (Comitê Gestor da Internet no Brasil)", "Senacon (Secretaria Nacional do Consumidor)"],
      e: "A ANPD é a autoridade responsável por orientar, fiscalizar e aplicar sanções relacionadas à LGPD.", f: 1 },
    { q: "No vazamento da BauruByte, qual destes dados é um dado pessoal SENSÍVEL?",
      o: ["Alergias alimentares do cliente", "Endereço de entrega com CEP e complemento", "Número do CPF do titular da conta", "E-mail e telefone usados no cadastro"],
      e: "Alergias são dados de saúde, e dados de saúde são sensíveis (art. 5º, II). E-mail, endereço e CPF são dados pessoais, mas não sensíveis.", f: 2 },
    { q: "Qual destes itens NÃO é considerado dado pessoal?",
      o: ["Total de pedidos por bairro, sem identificar ninguém", "Endereço IP do celular usado para fazer o pedido", "Placa do carro do entregador que fez a entrega", "Foto de perfil do cliente, mesmo sem o nome dele"],
      e: "Uma estatística agregada e anonimizada não identifica ninguém. IP, placa e foto podem identificar uma pessoa.", f: 2 },
    { q: "Usar a impressão digital para liberar a catraca da academia envolve qual tipo de dado?",
      o: ["Dado pessoal sensível", "Dado pessoal comum, como o nome", "Dado anonimizado, pois é só um número", "Não é dado pessoal, é um dado técnico"],
      e: "Biometria (digital, rosto, íris) é dado pessoal sensível.", f: 2 },
    { q: "Quem é o CONTROLADOR dos dados?",
      o: ["Quem toma as decisões sobre o tratamento de dados","Quem trata os dados seguindo instruções de outro", "A pessoa natural a quem os dados se referem", "O órgão federal que fiscaliza o cumprimento da lei"],
      e: "O controlador decide o que coletar, para quê e como. Quem segue instruções é o operador; a pessoa é o titular; quem fiscaliza é a ANPD.", f: 3 },
    { q: "Uma escola contrata uma empresa de nuvem para hospedar o sistema de notas dos alunos. A empresa de nuvem é:",
      o: ["Operadora", "Controladora", "Titular", "Encarregada (DPO)"],
      e: "A nuvem trata os dados em nome da escola, que é a controladora, seguindo as instruções dela. Por isso é operadora.", f: 3 },
    { q: "Qual é a função do Encarregado (DPO)?",
      o: ["Ser o canal de comunicação entre controlador, titulares e ANPD", "Programar, manter e fazer o backup do banco de dados com os dados pessoais", "Aplicar multas às empresas que descumprirem a lei", "Autorizar a venda de dados para empresas parceiras"],
      e: "O Encarregado é o canal de comunicação. Quem aplica multas é a ANPD.", f: 3 },
    { q: "Qual destas operações já é considerada TRATAMENTO de dados pessoais?",
      o: ["Armazenar uma planilha com nomes e telefones", "Apenas vender os dados pessoais para outras empresas", "Somente publicar dados pessoais em sites ou redes sociais", "Somente operações automáticas feitas por inteligência artificial"],
      e: "Tratamento é toda operação com dados pessoais, inclusive coletar, acessar e armazenar.", f: 4 },
    { q: "A LGPD se aplica a dados guardados em PAPEL, como fichas de cadastro?",
      o: ["Sim, vale para dados em papel e também no digital","Não, só vale para dados que circulam na internet", "Só se o papel for digitalizado e guardado em servidor", "Só para órgãos públicos, que ainda usam muito papel"],
      e: "A LGPD vale para o tratamento em qualquer meio, inclusive no papel.", f: 1 },
    { q: "O que diz o princípio da NECESSIDADE?",
      o: ["Usar só o mínimo de dados necessário para a finalidade", "Coletar o máximo de dados possível, pois um dia podem ser úteis", "Pedir consentimento do titular para qualquer tipo de tratamento", "Guardar os dados enquanto a empresa existir, por segurança"],
      e: "Necessidade é a minimização: só o mínimo necessário para cumprir a finalidade.", f: 5 },
    { q: "Um app de LANTERNA pede acesso aos seus contatos e à sua localização. Qual princípio é violado de forma mais direta?",
      o: ["Necessidade", "Livre acesso", "Qualidade dos dados", "Não discriminação"],
      e: "Uma lanterna não precisa de contatos nem de localização. É coleta excessiva, que fere a necessidade (e também a adequação).", f: 5 },
    { q: "O que diz o princípio da FINALIDADE?",
      o: ["Tratar dados para propósitos legítimos, específicos e informados", "Todo dado coletado deve ter uma data final para ser apagado", "O titular pode consultar seus dados de forma gratuita e fácil", "A empresa deve conseguir demonstrar que cumpre a lei inteira"],
      e: "Finalidade = propósito legítimo, específico, explícito e informado. Usar os dados para \"qualquer outra coisa\" viola esse princípio.", f: 5 },
    { q: "O consentimento é a única forma legal de tratar dados pessoais?",
      o: ["Não. A LGPD prevê 10 bases legais e ele é só uma delas","Sim. Sem consentimento, nenhum dado pode ser tratado", "Sim, exceto para órgãos públicos, que não precisam pedir", "Não. Existem só duas bases: consentimento e contrato"],
      e: "O art. 7º traz 10 bases legais. O consentimento é apenas uma delas.", f: 6 },
    { q: "Uma empresa envia ao governo (eSocial) os dados de salário dos funcionários. Qual é a base legal?",
      o: ["Cumprimento de obrigação legal", "Consentimento do funcionário", "Legítimo interesse do empregador", "Proteção do crédito"],
      e: "A empresa é obrigada por lei a informar esses dados, então a base é a obrigação legal. Não precisa de consentimento.", f: 6 },
    { q: "Uma loja online usa seu endereço para entregar o produto que você comprou. Qual é a base legal mais adequada?",
      o: ["Execução de contrato", "Consentimento do cliente", "Legítimo interesse da transportadora", "Tutela da saúde"],
      e: "O endereço é necessário para cumprir o contrato de compra que você pediu.", f: 6 },
    { q: "Para ser válido, o consentimento deve ser:",
      o: ["Livre, informado, inequívoco e para finalidade determinada", "Dado por uma caixinha que já vem marcada no cadastro", "Genérico, cobrindo qualquer uso futuro que a empresa queira", "Obrigatório para usar o app e impossível de cancelar depois"],
      e: "Consentimento é a manifestação livre, informada e inequívoca para uma finalidade determinada (art. 5º, XII).", f: 7 },
    { q: "Você deu consentimento para receber ofertas e agora se arrependeu. Pela LGPD:",
      o: ["Pode revogar a qualquer momento, de graça e de forma fácil", "Só pode revogar 1 ano depois de ter aceitado os termos", "Precisa pagar uma taxa administrativa para revogar", "Não pode: depois de aceitar, o consentimento é definitivo"],
      e: "A revogação do consentimento pode ser feita a qualquer momento, de forma gratuita e facilitada (art. 8º, §5º).", f: 7 },
    { q: "Um jogo online quer coletar dados de uma criança de 9 anos com base no consentimento. O que a LGPD exige?",
      o: ["Consentimento específico e em destaque de um dos pais ou do responsável", "Basta a própria criança clicar em \"Aceito\" nos termos de uso do jogo", "Basta informar o e-mail da criança e a data de nascimento dela", "Nada: a LGPD não traz regras especiais para dados de crianças"],
      e: "Art. 14: para crianças, o consentimento deve ser específico e em destaque, dado por pelo menos um dos pais ou pelo responsável, sempre buscando o melhor interesse da criança.", f: 7 },
    { q: "Você quer saber quais dados seus uma loja guarda. Pela LGPD:",
      o: ["Pode pedir confirmação e acesso aos seus dados, de graça", "Só consegue saber com uma ordem judicial contra a loja", "A loja pode sempre negar, alegando segredo comercial", "Pode pedir, mas precisa pagar uma taxa pelo relatório"],
      e: "Confirmação e acesso são direitos do titular (art. 18), exercidos gratuitamente.", f: 8 },
    { q: "O direito à PORTABILIDADE permite ao titular:",
      o: ["Levar seus dados para outro fornecedor de serviço", "Carregar os dados num pen drive para qualquer lugar", "Proibir que seus dados sejam enviados para fora do Brasil", "Corrigir dados incompletos, inexatos ou desatualizados"],
      e: "Portabilidade = levar seus dados a outro fornecedor, como trocar de operadora ou de banco.", f: 8 },
    { q: "Seu cartão de crédito foi negado por um algoritmo, sem análise humana. Que direito a LGPD garante?",
      o: ["Pedir a revisão da decisão tomada só pelo algoritmo","Nenhum, pois decisões de algoritmos são sempre neutras", "Exigir que a empresa publique todo o código-fonte do sistema", "Receber o cartão automaticamente, sem nova análise"],
      e: "O art. 20 garante a revisão de decisões automatizadas e informações sobre os critérios usados, respeitados os segredos comercial e industrial.", f: 8 },
    { q: "A BauruByte sofreu um vazamento que pode causar dano relevante aos clientes. O que a lei exige?",
      o: ["Comunicar o incidente à ANPD e aos titulares afetados","Apagar os logs do ataque e não contar nada a ninguém", "Avisar os clientes só se a imprensa descobrir o caso", "Pagar o resgate aos criminosos para apagarem os dados"],
      e: "Art. 48: incidentes que possam causar risco ou dano relevante devem ser comunicados à ANPD e aos titulares (o regulamento da ANPD dá 3 dias úteis).", f: 10 },
    { q: "Qual é o valor máximo da multa simples da LGPD?",
      o: ["Até 2% do faturamento no Brasil, limitada a R$ 50 milhões por infração", "R$ 1 milhão por ano, independentemente do tamanho da empresa", "10% do faturamento mundial da empresa, sem nenhum limite de valor", "Não existe multa na LGPD: a única sanção possível é a advertência"],
      e: "Art. 52: multa simples de até 2% do faturamento no Brasil, limitada a R$ 50 milhões por infração.", f: 10 },
    { q: "Qual destas situações está FORA da LGPD?",
      o: ["Contatos dos amigos salvos no celular, para uso pessoal", "Academia que cadastra os alunos para controlar a mensalidade", "Prefeitura que mantém o cadastro dos moradores da cidade", "Startup que coleta e-mails para enviar a newsletter"],
      e: "Art. 4º: o tratamento por pessoa natural para fins exclusivamente particulares e não econômicos está fora da LGPD.", f: 1 },
    { q: "O que é um dado ANONIMIZADO?",
      o: ["Dado que não permite identificar a pessoa por meios razoáveis", "Dado em que o nome foi trocado por um código que pode ser revertido", "Dado criptografado com senha, que só o administrador consegue abrir", "Dado de uma pessoa que se cadastrou usando um apelido"],
      e: "Anonimizado = não dá para reidentificar com meios razoáveis, e em regra não é dado pessoal. Se der para reverter (como na pseudonimização), continua sendo dado pessoal.", f: 2 }
  ],

  V: [
    { q: "O endereço IP pode ser considerado dado pessoal.", a: true,
      e: "Verdadeiro. O IP pode identificar, ou ajudar a identificar, uma pessoa.", f: 2 },
    { q: "A LGPD só se aplica a grandes empresas de tecnologia.", a: false,
      e: "Falso. Ela vale para qualquer pessoa física ou jurídica, pública ou privada, de qualquer tamanho, que trate dados pessoais.", f: 1 },
    { q: "Opinião política e convicção religiosa são dados pessoais sensíveis.", a: true,
      e: "Verdadeiro. Os dois estão na lista de dados sensíveis do art. 5º, II.", f: 2 },
    { q: "Se o perfil de uma pessoa é público na internet, qualquer empresa pode usar esses dados para qualquer finalidade, sem regras.", a: false,
      e: "Falso. Mesmo dados públicos devem ser tratados respeitando a finalidade, a boa-fé e o interesse público que justificaram ficarem disponíveis (art. 7º, §3º).", f: 6 },
    { q: "Titular é a pessoa natural a quem os dados pessoais se referem.", a: true,
      e: "Verdadeiro. O titular é você, a pessoa dona dos dados.", f: 3 },
    { q: "Uma caixa de \"Aceito receber ofertas\" que já vem MARCADA é um consentimento válido.", a: false,
      e: "Falso. O consentimento precisa ser livre e inequívoco, e uma caixa pré-marcada não demonstra uma escolha ativa do titular.", f: 7 },
    { q: "A LGPD também vale para órgãos públicos, como prefeituras e escolas públicas.", a: true,
      e: "Verdadeiro. Ela se aplica tanto ao setor privado quanto ao público.", f: 1 },
    { q: "Dados pseudonimizados (CPF trocado por um código, com a tabela de correspondência guardada) continuam sendo dados pessoais.", a: true,
      e: "Verdadeiro. Como dá para reidentificar com a tabela, eles continuam sendo dados pessoais.", f: 2 },
    { q: "Pela LGPD, uma empresa pode guardar os dados dos clientes para sempre, mesmo depois que a finalidade acabou.", a: false,
      e: "Falso. Quando a finalidade termina, os dados devem ser eliminados, salvo exceções como uma obrigação legal de guardar (arts. 15 e 16).", f: 4 },
    { q: "O operador trata os dados pessoais seguindo as instruções do controlador.", a: true,
      e: "Verdadeiro. O operador age em nome do controlador.", f: 3 },
    { q: "O titular pode pedir a correção de dados incompletos, inexatos ou desatualizados.", a: true,
      e: "Verdadeiro. A correção é um dos direitos do art. 18.", f: 8 },
    { q: "O legítimo interesse pode ser usado como base legal para tratar dados SENSÍVEIS, como dados de saúde.", a: false,
      e: "Falso. O art. 11, que trata dos dados sensíveis, não prevê o legítimo interesse.", f: 6 },
    { q: "Uma empresa só precisa comunicar um vazamento de dados se a imprensa descobrir.", a: false,
      e: "Falso. Se houver risco ou dano relevante, ela deve comunicar a ANPD e os titulares (art. 48).", f: 10 },
    { q: "Termos de uso com autorização genérica, como \"podemos usar seus dados para qualquer fim\", são nulos pela LGPD.", a: true,
      e: "Verdadeiro. O consentimento deve ter finalidade determinada, e autorizações genéricas são nulas (art. 8º, §4º).", f: 7 },
    { q: "A LGPD também se aplica a uma empresa estrangeira que oferece serviços a pessoas no Brasil.", a: true,
      e: "Verdadeiro. O art. 3º alcança quem oferece bens ou serviços a pessoas no Brasil ou trata dados coletados aqui.", f: 1 },
    { q: "Pelo princípio da transparência, o titular deve receber informações claras, precisas e de fácil acesso sobre o tratamento.", a: true,
      e: "Verdadeiro. Esse é o princípio da transparência (art. 6º, VI).", f: 5 },
    { q: "Tornar pública a infração cometida pela empresa (publicização) é uma das sanções da LGPD.", a: true,
      e: "Verdadeiro. A publicização está entre as sanções do art. 52, e o estrago na reputação pode doer mais que a multa!", f: 10 },
    { q: "Os dados de crianças não têm nenhuma proteção especial na LGPD.", a: false,
      e: "Falso. O art. 14 exige que o tratamento atenda ao melhor interesse da criança e do adolescente, com regras específicas de consentimento.", f: 7 }
  ],

  D: [
    { q: "Como o seu sistema deve guardar as senhas dos usuários?",
      o: ["Gerar hash com salt usando um algoritmo lento, como bcrypt ou Argon2","Texto puro, numa coluna com acesso restrito ao admin", "Codificadas em Base64 antes de salvar no banco", "Hash MD5 sem salt, que é rápido e ocupa pouco espaço"],
      e: "Base64 é só codificação e pode ser revertida. MD5 é rápido demais e quebrável. Use bcrypt ou Argon2 com salt.", f: 9 },
    { q: "Você vai criar o formulário de cadastro de uma NEWSLETTER. Quais campos pedir?",
      o: ["Só o e-mail, e talvez o nome", "E-mail e CPF", "E-mail, CPF e data de nascimento", "Nome, e-mail, telefone e endereço"],
      e: "Princípio da necessidade (minimização): para mandar uma newsletter, basta o e-mail.", f: 9 },
    { q: "Qual é a boa prática para LOGS da aplicação?",
      o: ["Nunca registrar senhas ou tokens, e mascarar dados pessoais como o CPF", "Registrar a requisição completa, inclusive a senha, para facilitar o debug depois", "Deixar os arquivos de log públicos para toda a equipe consultar", "Gravar tudo: logs são técnicos e não têm relação com a LGPD"],
      e: "Logs também são tratamento de dados e costumam vazar. Minimize e mascare o que for registrado.", f: 9 },
    { q: "Por que evitar um endpoint como GET /buscar?cpf=12345678900 ?",
      o: ["A URL fica gravada em históricos, logs e proxies", "O GET é mais lento que o POST", "URLs não aceitam números longos sem codificação", "Não há problema, se o site usar HTTPS"],
      e: "Mesmo com HTTPS, a URL fica registrada em históricos e logs. Envie os dados pessoais no corpo (POST) e por HTTPS.", f: 9 },
    { q: "O time precisa testar o sistema novo. Qual atitude está correta?",
      o: ["Usar dados fictícios ou anonimizados nos testes", "Copiar o banco de produção com os dados reais", "Testar direto em produção, com clientes reais", "Mandar a planilha de clientes para os testadores"],
      e: "Ambientes de teste costumam ter menos segurança. Usar dados reais lá é risco de vazamento.", f: 9 },
    { q: "O que significa PRIVACY BY DESIGN?",
      o: ["Pensar na proteção de dados desde a concepção do sistema, não só no final","Publicar a política de privacidade só depois do lançamento do app", "Investir no design visual da tela de configurações de privacidade", "Contratar um designer para criar o aviso de cookies do site"],
      e: "O art. 46, §2º pede medidas de segurança desde a fase de concepção do produto ou serviço até a execução.", f: 9 },
    { q: "Uma rede social nova deixa, POR PADRÃO, os perfis públicos e a localização ativada. Isso fere qual ideia?",
      o: ["Privacy by default: o padrão deve ser o mais protetivo", "Portabilidade do perfil para outra rede social", "Proteção do crédito do usuário","Nenhuma, porque o usuário sempre pode mudar as configurações depois"],
      e: "Privacy by default: a configuração inicial deve proteger mais, e quem quiser pode abrir depois.", f: 9 },
    { q: "Um atendente do suporte precisa consultar pedidos. Que acesso ele deve ter?",
      o: ["Só aos dados necessários para o atendimento", "Acesso de administrador ao banco inteiro", "A senha de admin compartilhada pela equipe", "Acesso total, se assinar um termo de sigilo"],
      e: "Menor privilégio + controle de acesso: cada perfil acessa só o que precisa.", f: 9 },
    { q: "Você implementou o botão \"Excluir minha conta e meus dados\". Que direito do titular ele atende?",
      o: ["Eliminação dos dados pessoais", "Portabilidade", "Revisão de decisão automatizada", "Anonimização"],
      e: "É o direito de eliminação (art. 18), sem esquecer das exceções legais de guarda.", f: 8 },
    { q: "O botão \"Exportar meus dados (JSON/CSV)\" atende principalmente qual direito?",
      o: ["Portabilidade", "Revogação do consentimento", "Não discriminação", "Anonimização"],
      e: "Entregar os dados num formato que dá para levar a outro serviço é a portabilidade (e também o acesso).", f: 8 },
    { q: "O que é o RIPD?",
      o: ["Relatório de Impacto à Proteção de Dados Pessoais", "Registro de IPs para Depuração de erros em produção", "Rede Interna de Proteção de Dados contra invasões", "Regulamento de Infrações e Penalidades de Dados da ANPD"],
      e: "O RIPD documenta tratamentos que podem gerar riscos e as medidas para reduzi-los. A ANPD pode exigi-lo.", f: 9 },
    { q: "Seu app envia login e senha para a API. Qual cuidado é obrigatório?",
      o: ["Usar HTTPS (TLS) para criptografar a comunicação", "Usar HTTP comum, que é mais rápido", "Enviar a senha codificada em Base64 para ela não aparecer na rede", "Mandar login e senha na URL"],
      e: "Sem TLS, qualquer pessoa na mesma rede (por exemplo, num Wi-Fi público) pode capturar os dados.", f: 9 },
    { q: "Qual medida MAIS reduz o dano se o banco de dados for copiado por um invasor?",
      o: ["Criptografar dados sensíveis, com chaves fora do banco", "Usar nomes estranhos nas tabelas para confundir o invasor", "Mudar a porta padrão do banco de dados para uma porta alta", "Usar o nome da empresa seguido do ano como senha do banco"],
      e: "Com os dados criptografados e as chaves separadas, uma cópia do banco vale muito pouco para o criminoso.", f: 9 },
    { q: "Você vai integrar o sistema com uma API de terceiros para enviar SMS aos clientes. O que é importante?",
      o: ["Tratá-lo como operador e exigir segurança em contrato", "Nada: a responsabilidade é só do fornecedor", "Enviar todos os dados do cliente, por precaução", "Deixar a chave da API no repositório público"],
      e: "Esse fornecedor é um operador. Os operadores também respondem pela segurança, e o controlador deve escolher e orientar bem quem trata dados em seu nome.", f: 3 },
    { q: "O chefe pede: \"Use os e-mails dos clientes do delivery para divulgar a minha outra loja, sem avisar ninguém.\" Que princípio é violado?",
      o: ["Finalidade", "Qualidade dos dados", "Livre acesso", "Segurança"],
      e: "Os dados foram coletados para o delivery. Usá-los para outro propósito, sem informar, viola a finalidade.", f: 5 },
    { q: "O banco tem milhares de contas inativas há 8 anos, com dados que não servem para mais nada. O que fazer?",
      o: ["Eliminar ou anonimizar, com política de retenção", "Manter tudo, armazenamento é barato", "Vender os dados antigos para marketing","Mover tudo para uma planilha na área de trabalho do servidor"],
      e: "Acabou a finalidade? O tratamento deve terminar, com a eliminação ou anonimização dos dados (arts. 15 e 16).", f: 4 },
    { q: "Fazer pentest e corrigir vulnerabilidades ANTES de qualquer incidente atende principalmente a qual princípio?",
      o: ["Prevenção", "Livre acesso", "Qualidade dos dados", "Transparência"],
      e: "Prevenção é adotar medidas para evitar danos antes que eles aconteçam.", f: 5 },
    { q: "A empresa precisa conseguir DEMONSTRAR que cumpre a LGPD, por exemplo com registros e documentação. Que princípio é esse?",
      o: ["Responsabilização e prestação de contas", "Transparência e qualidade dos dados", "Segurança e não discriminação", "Adequação e livre acesso aos dados"],
      e: "Não basta cumprir, é preciso conseguir provar. Por isso existem o registro das operações (art. 37), o RIPD, as políticas e os logs de auditoria.", f: 5 }
  ]
};

/* ---------- CARTAS-PODER ----------
   tipo:
     instant = efeito na hora em que é comprada
     ataque  = vai para a mão; na sua vez, ANTES de rolar o dado, clique para jogar no rival
     buff    = vai para a mão; jogue na sua vez, antes de rolar o dado
     passiva = fica na mão e age sozinha (escudo, roubo) ou dentro da pergunta (dica)
*/
const CARTAS = [
  { id: "backup",     nome: "BACKUP RESTAURADO",   icone: "⟲",  tipo: "instant", qtd: 2,
    texto: "Avance 2 casas na hora.", lore: "Backups testados salvam investigações (e empresas)." },
  { id: "elogio",     nome: "ELOGIO DA ANPD",      icone: "★",  tipo: "instant", qtd: 1,
    texto: "Ganhe 15 pontos na hora.", lore: "Sua política de privacidade é clara e fácil de entender: transparência!" },
  { id: "multa",      nome: "MULTA DA ANPD",       icone: "⚖",  tipo: "instant", qtd: 1,
    texto: "Perca 10 pontos na hora.", lore: "Uma auditoria encontrou senhas guardadas em texto puro no seu sistema." },

  { id: "ransom",     nome: "RANSOMWARE",          icone: "☠",  tipo: "ataque", qtd: 4,
    texto: "Jogue no rival: ele volta 3 casas.", lore: "Sequestro de dados também é um incidente de segurança que deve ser comunicado à ANPD." },
  { id: "phishing",   nome: "PHISHING",            icone: "✉",  tipo: "ataque", qtd: 4,
    texto: "Jogue no rival: ele perde 10 pontos.", lore: "Mensagens falsas pedindo dados são a porta de entrada de muitos vazamentos." },
  { id: "ddos",       nome: "ATAQUE DDoS",         icone: "⌁",  tipo: "ataque", qtd: 3,
    texto: "Jogue no rival: ele perde a próxima vez de jogar.", lore: "Sistema fora do ar por excesso de requisições. Disponibilidade também é segurança." },
  { id: "auditoria",  nome: "AUDITORIA RELÂMPAGO", icone: "⏱",  tipo: "ataque", qtd: 3,
    texto: "Jogue no rival: a próxima pergunta dele terá só 15 segundos.", lore: "A ANPD pode fiscalizar a qualquer momento. Está tudo documentado?" },
  { id: "engenharia", nome: "ENGENHARIA SOCIAL",   icone: "☻",  tipo: "ataque", qtd: 3,
    texto: "Jogue no rival: roube 1 carta aleatória da mão dele.", lore: "\"Oi, aqui é do suporte... me passa sua senha?\" Nunca passe." },

  { id: "dobro",      nome: "DOBRO OU NADA",       icone: "×2", tipo: "buff", qtd: 2,
    texto: "Jogue antes de rolar o dado: sua próxima pergunta vale o DOBRO.", lore: "Pressão alta na sala de interrogatório!" },

  { id: "escudo",     nome: "ESCUDO DE CRIPTOGRAFIA", icone: "⛨", tipo: "passiva", qtd: 3,
    texto: "Fica na mão e bloqueia sozinho o próximo ataque do rival ou a penalidade de um vazamento.", lore: "Dado criptografado vazado vale muito pouco para o criminoso." },
  { id: "roubar",     nome: "ROUBAR A PISTA",      icone: "⇄",  tipo: "passiva", qtd: 2,
    texto: "Fica na mão. Quando o rival errar uma pergunta de múltipla escolha, você pode responder e ficar com os pontos.", lore: "Bons detetives aproveitam o deslize dos outros." },
  { id: "dica",       nome: "DICA DO DPO",         icone: "☏",  tipo: "passiva", qtd: 2,
    texto: "Fica na mão. Use numa pergunta de múltipla escolha para eliminar 2 alternativas erradas.", lore: "O Encarregado é o canal de comunicação: pergunte a ele!" }
];

/* ---------- TABULEIRO ----------
   0 = BASE (início) | 1..30 = casas | 31 = RELATÓRIO À ANPD (fim)
   P = Pista | V = Interrogatório | D = Código | C = Carta | X = Vazamento
*/
const TABULEIRO = [
  "S",
  "P","V","C","D","P","X","V","C","D","C",
  "P","V","X","D","P","C","V","P","D","X",
  "P","V","C","D","C","X","V","D","P","C",
  "F"
];

const TIPOS_CASA = {
  S: { nome: "INÍCIO",          icone: "▶",   cls: "c-start" },
  F: { nome: "FIM",             icone: "⚑",   cls: "c-end" },
  P: { nome: "PISTA",           icone: "?",   cls: "c-pista",   pts: 10, desc: "Conceitos da LGPD (+10)" },
  V: { nome: "INTERROGATÓRIO",  icone: "V/F", cls: "c-vf",      pts: 10, desc: "Verdadeiro ou falso (+10)" },
  D: { nome: "CÓDIGO",          icone: "</>", cls: "c-dev",     pts: 20, desc: "Desafio de programador (+20)" },
  C: { nome: "CARTA",           icone: "▣",   cls: "c-carta",   desc: "Ganhe uma carta-poder" },
  X: { nome: "VAZAMENTO",       icone: "!",   cls: "c-vaz",     pts: 15, desc: "Acertou +15 / errou −10 e volta 3" }
};
