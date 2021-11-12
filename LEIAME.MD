{:toc}
# Projeto Liven

Esse projeto foi feito usando Typescript e MongoDb com desenvolvimento orientado a testes e Clean Architecture

Foi um desafio proposto para entrar para o time de desenvolvimento da [Liven](https://liven.tech/pt).

Para mais detalhes leia a  [documentação](https://studio-ws.apicur.io/sharing/88289fe3-5afa-445a-9694-a120fcdd48af).

## Motivações

### MongoDb

MongoDb é o banco de dados não relacional mais popular de todos com schemas flexiveis, poderosas querys, sendo mais performático que bancos SQL e ainda por cima extremamente amigável.

Eu sempre busco usar MongoDb em meus projetos pois eu posso mudar a estrutura do banco de dados toda vez que eu precisar sem ter que pensar sobre estruturas de banco de dados e outro "problemas de bancos SQL".

### Clean architecture

criada por  [Uncle Bob](https://github.com/unclebob), ela trás algumas facilidades para **manutenção de código** e '**testabilidade**' e ajuda a respeitar os princípios do  [SOLID](https://en.wikipedia.org/wiki/SOLID).

usando clean architecture nós devemos separar a aplicação em algumas camadas, nesse projeto eu utilizei uma estrutura de pastas para ajudar a entender algumas dessas camadas

basicamente nesse projeto:

- a camada domain contém todas as interfaces de casos de uso e modelos

- a camada data contém implementações genéricas dos casos de uso

- a camada infra contém implementações específicas para serem utilizadas pelas implementações genéricas supracitadas

- a camada presentation contém a "linha de frente" da aplicação (Controllers, Middlewares, Erros personalizados) 

- a camada validation é uma "camada adicional" ela contém os validadores de requisição usados nos controllers. mas pode conter outros tipos de validação e por isso foi movida para uma pasta separada;

- a camada main é o core da aplicação, é onde criaremos os pontos de entrada da aplicação as factories, os adapters, os middlewares* e as rotas

  *middlewares que não sejam de domínio como por exemplo CORS, os middlewares de domínio serão colocados na camada de presentation.

### Conventional Commits

Há algum tempo atrás eu estava pesquisando sobre GitFlow e outras boas praticas de desenvolvimento e então encontrei o  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) após isso eu percebi que diversos projetos opensource utilizam esse padrão para seus commits e que isso seria uma ferramenta poderosa em projetos colaborativos.



## O Desafio

Esse projeto deve cadastrar usuários e :

- Os usuários podem ter muitos endereços;
- Somente os usuários podem ver seus dados;
- Os usuários devem estar autenticados para acessar as rotas;
- Os usuários devem ser capazes de adicionar endereços;
- Os usuários devem ser capazes de buscar endereços (usando querystring ou prams);
- Os usuários devem ser capazes de atualizar endereços;
- Os usuários devem ser capazes de deletar endereços;
- Os usuários devem ser capazes de atualizar seus dados;
- Os usuários devem ser capazes de excluir a sua conta;

