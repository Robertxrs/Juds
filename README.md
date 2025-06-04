
![image](https://github.com/user-attachments/assets/e9bff5d0-d53f-46ab-9177-95604e0edd27)


﻿<h1>JUDS - Sistema de Gestão de Estoque e Vendas</h1>

JUDS é um sistema de gestão de estoque, vendas e finanças desenvolvido para pequenos negócios. Ele foi criado utilizando Angular, Node.js e Electron, permitindo que o sistema seja executado como um aplicativo desktop com funcionalidades web.

<h3>Funcionalidades Principais</h3>
Cadastro e gerenciamento de produtos e ingredientes: Adicione, edite e remova produtos e seus ingredientes associados. O sistema permite um controle eficiente de todos os itens utilizados nas receitas.

<h3>Controle dinâmico de estoque:</h3> O estoque de produtos e ingredientes é ajustado automaticamente conforme as vendas são realizadas. O sistema calcula e atualiza a quantidade disponível de itens em tempo real.

<h3>Gestão de vendas:</h3> Registre vendas de produtos, calcule automaticamente o valor total e o método de pagamento utilizado, além de fornecer um histórico detalhado de todas as transações realizadas.

<h3>Controle financeiro:</h3> Acompanhe a saúde financeira do negócio com gráficos interativos de receita, custo e lucro, proporcionando uma visão clara do desempenho financeiro ao longo de períodos definidos (mensal, semanal).

<h2>Tecnologias Utilizadas</h2>
<h3>Frontend:</h3>

Angular (versão 14) para construção da interface web.

ApexCharts para visualizações gráficas dinâmicas de desempenho financeiro.

<h3>Backend:</h3>

Node.js com Express para gerenciamento de rotas e comunicação com o banco de dados.

MongoDB como banco de dados para armazenar informações de produtos, ingredientes e vendas.

<h3>Desktop:</h3>

Electron para empacotar o sistema como um aplicativo desktop, que roda localmente sem a necessidade de um navegador.

<h2>Benefícios</h2>
Eficiência operacional: O programa centraliza o gerenciamento de estoque, vendas e finanças em uma única plataforma.

<h3>Controle em tempo real:</h3> O estoque e as finanças são automaticamente ajustados a cada venda, proporcionando controle atualizado e preciso.

<h3>Facilidade de uso:</h3> A interface foi projetada para ser intuitiva e de fácil navegação, mesmo com funcionalidades complexas.

<h3>Solução prática para pequenos negócios:</h3> JUDS oferece uma solução robusta para a gestão de um pequeno negócio, com foco em simplicidade e funcionalidade. 

<h1>Como Rodar o Projeto</h1>
<h3>Requisitos:</h3>
Node.js (versão 14 ou superior)

MongoDB (local ou remoto)

Electron (para empacotar como desktop)
1. Clone o repositório

        git clone https://github.com/Robertxrs/Juds.git
        cd juds

2. Instale as dependências

   Para instalar as dependências do frontend e backend, execute:

        npm install

3. Execute o backend (Express + MongoDB)

   Se você ainda não tiver o MongoDB rodando localmente, pode configurar uma instância local ou usar o MongoDB Atlas. No terminal, execute:

        cd my-app
        npm run api

   Isso iniciará o servidor backend (Express) e conectará ao banco de dados MongoDB.

4. Execute o Electron
   Para rodar a versão de desktop com Electron execute:

        cd my-app
        npm run electron

   Se preferir gerar o pacote para distribuição (produzindo um .exe no Windows), use:

        npm run electron:prod
        
<h2>Contribuição</h2>
Sinta-se à vontade para contribuir para o projeto! Se você tiver sugestões, correções ou melhorias, faça um fork, crie uma branch, faça suas modificações e envie um pull request.
