## Olá!

Inclui no repositorio duas versões, uma somente com Node e um banco de dados em memoria para testes e funcionalidade, e um serverless AWS.

Devido a imprevistos e falta de tempo infelizmente não consegui concluir tudo a tempo e não consegui conectar o endpoint Lambda com o projeto serverless, no momento ele funciona com o servidor local atraves do plugin 'serverless-offline', ele simula justamente as rotas do lambda e consegue se comunicar com o DynamoDB na AWS normalmente.

Muito foi feito no front mas alguns detalhes ficaram de lado justamente pela falta de tempo, como mobile em todas as telas, spinners na espera de requisições e paginação nos cards.

## Instruções para a Aplicação

1. **Clone o Repositório**:

   ```bash
   git clone https://github.com/amdiaspb/helpinho.git
   ```

2. **Instale as Depencias em cada um das pastas que for utilizar**:

    ```bash
    npm install
    ```

## Node (In-Memory)

3. **Back-End**

    No 'backend-node' basta executar a aplicação em modo de desenvolvimento e o servidor já vai estar em execução.
    ```bash
    npm run dev
    ```
4. **Front-End**

    Já no 'frontend-node' basta executar o comando
    ```bash
    ng serve
    ```
5. **Nota**

    Tudo deve funcionar normalmente, no backend já deixei um .env configurado a chave JWT para autenticação de sessão, com intuito de facilitar a configaração do projeto.

## Serverless (AWS)


3. **Conta AWS**

    Aqui você precisara de uma conta AWS e um usuario com acesso administrativo para a criação da rotina do serverless na AWS.
    Você pode seguir do passo 1 ao 15 neste [blog](https://rodrigo.kamada.com.br/blog/criando-uma-api-serverless-usando-aws-lambda-e-nodejs-com-typescript-e-expressjs) para conseguir suas chaves de acesso que vão ser necessarias para criar a tabela no banco e no funcionamento geral da aplicação.

    Você precisara fornecer esses três campos no arquivo .env:

    ```bash
    ACCESS_KEY_ID = '7YEE7ANQHFDGLZAKIAQR'
    SECRET_ACCESS_KEY = 'yyyMEboMvA/IXUFI7djIoMRBJ3b0kFQ8p8TN6pKW'
    REGION = 'us-east-1'
    ```

4. **Configuração Serverless**

    Feito isso você deve executar o comando 
    Já no 'frontend-node' basta executar o comando
    ```bash
    serverless config credentials --provider aws --key 7YEE7ANQHFDGLZAKIAQR --secret yyyMEboMvA/IXUFI7djIoMRBJ3b0kFQ8p8TN6pKW
    ```
    Onde apos o comando '--key' vem sua ACCESS_KEY e no '--secret' sua SECRET_ACCESS_KEY, deve ser sem aspas.

    Se o comando não funcionar caso você não tenha o serverless instalado globalmente você pode usar 'npx' antes do comando.

5. **Implantação**

    Em seguida você pode executar a implantação da aplicação.
    ```bash
    serverless deploy
    ```
    Ele vai criar a tabela no DynamoDB e a conexão com o Lambda.

    Nota: No meu caso não tive tempo de conectar o endpoint que recebemos aqui com o front. Mas o acesso com o serverless-offline funciona normalmente.

6. **Execução**

    Agora basta executar o comando 
    ```bash
    npm run off
    ```
    Para rodar a aplicação com o plugin 'serverless-offline' onde simula as rotas do Lambda.

7. **Front-End**

    Já no 'frontend-serverless' basta executar o comando
    ```bash
    ng serve
    ```
8. **Nota**

    É possivel que na execução dos comandos serverless ele peça para você logar no site deles para criar uma permissão.
