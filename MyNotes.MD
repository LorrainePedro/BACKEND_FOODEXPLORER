para ver o conteudo do banco de dados, usar SGBD. sistema gerenciados de banco de dados, ver estrutura, deletar etc
usar o beekeeper.

CRIAR NO BEEKEEPER
CRIAR TABELA PURAMENTE SQL

SQL NAO EH BANCO DE DADOS! LINGUAGEM DE CONSULTA ESTRUTURADA
LINGUAGEM PADRAO!!!! para banco de dados relacionais.

DDL comandos dentro do SQL
CREATE
DROP - DELETAR TABELA
ALTER - ATUALIZAR INFOS DA TABELA

CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name VARCHAR,
email VARCHAR,
password VARCHAR,
avatar VARCHAR NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

> > > INTEIRO, (primary) id unico, campo primario chave nunca podera se repetir, distribui o ID pros users automaticamente
> > > padrao de data e hora timestamp default seja padrao eh capturar o timestamp, tempo atual > data e hora

MUDAR O NOME DA TABELA NO SQL USANDO COMANDOS

ALTER TABLE users
RENAME TO clients

ADICIONAR NOVA COLUNA STATUS PRA SABER SE O USUARIO EH OU NAO ATIVO

ALTER TABLE users
ADD status VARCHAR

MUDAR NOME DA COLUNA DENTRO DA TABELA

ALTER TABLE users
RENAME COLUMN status TO active

para DELETAR

ALTER TABLE users
DROP COLUMN nomedacoluna

-> COMANDOS SQL DE FORMA SEPARADA>

COMANDOS DDL

CREATE
DROP - DELETAR TABELA
ALTER - ATUALIZAR INFOS DA TABELA

COMANDOS DML
DATA MANIPULATION LANGUAGE, MANIPULACAO DE DADOS.
C INSERT
R SELECT
U UPDATE
D DELETE

C create criar um produto
R read listar produtos cadastrados pro cliente ver
U update atualizar o preco do produto
D delete deletar esse produto

COMANDOS MANIPULACAO DE DADOS -----CRUD----

o id eh autoincremento, avatar eh null, create e update eh por default a data/h atual
na mesma ordem das colunas citadas acima entre()

INSERT INTO users
(name, email, password)
VALUES
('Lorraine', 'loh.jft@hotmail.com', 'senha123')

para listar a tabela, selecionar, usar o SELECT, todas \* FROM nomedatabela >> USAR RUN SELECTION, selecionar TODAS AS COLUNAS DA TABELA USERS (somente da users)

SELECT \* FROM users ->>> LISTA TUDO DA TABELA > todas as colunas

sempre selecionar com o mouse antes, até quando for adicionar um novo user. se quiser executar TUDO, USAR PONTO E VIRGULA;

quiser botar AVATAR ou mudar o nome de alguem ou qqr atributo>
usar o UPDATE, qual tabela quero atualizar? ....TEM QUE ESPECIFICAR O USUARIO ESPECIFICO/LINHA/REGISTRO

UPDATE users SET
avatar = 'rodrigo.png' -> MUDA TODOS

ESPECIFICO > usar condicao WHERE id = 1 >>> aonde tiver o id 1. id eh o campo

UPDATE users SET
avatar = 'rodrigo.png'
WHERE id = 1

SE QUISER ATUALIZAR MAIS CAMPOS>usar virgula

UPDATE users SET
avatar = 'rodrigo.png',
name = 'novo nome'
WHERE id = 1

COMO DELETAR UM REGISTRO

DELETE FROM users
WHERE id = numerodoid

PRA AUTOMATIZAR A CRIACAO DE TABELA NO PROJETO USANDO MIGRATIONS
dentro da pasta sqlite criar a pasta migrations e dentro dela cria a folha createUsers.js, const createUsers =`` cola la a estrutura de criacao table da beekeeper sgb, module.exports = createUsers;
cria a pasta index.js na migrations pra importar sqlconnection pra pegar o database
const sqliteConnection = require('../../sqlite')

const createUsers = require('./createUsers')

criar a funcao async migrationsRun() criar objeto schemas q sao as tabelas q ele o banco vai ter. passar o vetor com as migrations [] usar o join pra juntar tudo ou usar , pra quebrar e dar sqliteconnection usando uma promise.then(db => db.exec(schemas)) .catch(error => console.error(error))

essa tabela migrations ja existe, entao vamos criar uma tabela usando IF NOT EXISTS users... criar a tabela somente se NAO EXISTIR uma tabela usuario.,
depois ir em server.js e botar /migrations
const database = require("./database/sqlite/migrations") e mudar o nome para migrationsRun, trocar tudo que tiver database() como nome para migrationsRun

depois vai na pasta do projeto e deleta o database

no user controller usar o await pq como usa banco de ddados nem sempre acontece na mesma hora . eh assincrono entao usar async antes do create tb.

/\*Numero MÁXIMO de métodos para o controller: 5.
no create verificar se o usuario ja existe
verificar se o email esta sendo utilizado, selecionando todos os campos da tabela de usuario onde o email
seja igual ao email que a pessoa esta [tentando cadastrar]

SELECT \* FROM users;

usar a interrogacao para ser substituida pelo conteudo da variavel vetor throw eh excessao para error

    index - GET p listar varios registros
    show - GET para exibir um registro especifico
    create - POST para criar um registro
    update - PUT para atualizar um registro
    delete - DELETE para remover um registro


    npm install express-async-errors --save  tratamento de erros de forma assincrona
    conectar com SQLITE instalar
    npm install sqlite3 sqlite --save
    */


    await database.run("INSERT INTO users (name, email, password) VALUES(?, ?, ?)")
    3 valores, 3 interrogacoes!

CRIPTOGRAFAR SENHA DO USUARIO ---- INSTALAR NPM INSTALL bcryptjs
importar o bcrypt no controller criar o hashedpassword = await hash e passar dois parametros, um sendo a senha e depois o fator de complextidade do hash 8, mudar de password pra hashedPassword

await no hash pra nao dar object promise

knex, migrations(UP e DOWN >> criar ou alterar no banco de dados e a down desfaz/rollback das alteracoes)...

criar tabela com migrations no knex
npc knex migrate:make createNotes > nome da tabela

adicionar migrations pra rodar no banco de dados >
npx knex migrate:latest > automatizei nos scripts do json.
agora roda com npm run migrate

pool: {
afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
},

    >> por padrao no sqlite apagar em cascata eh desabilitada, entao o pool e uma funcionalidade q o que for posto nele sera executada no
    momento q estabelecer conexao com banco de dados. funcao chamada aftercreate.. logo apos criar, executa a funcao pra recuperar a conexao e
    a callback. pega a conexao e roda um comando chamado pragma foreingkeys ON he pra habilitar a funcionalidade de qd deletar uma nota
    deletar as tags em cascata. (querybuilder, migrations para link e tags)

<npm run dev e npm run migrate>

inner join ->
unir tabelas (nao fisicamente. selecionar duas tabelas e exibir o resultado de ambas conectado, em uma unica consulta buscar nas duas tabelas e exibir junto <registros em comum em ambas as tabelas>)

quando usa o .map cada elemento fica armazenado em um array auxiliar para a manipulacao dos dados tags.map(tag) pode mudar o nome tb
percorrer a partir de tags cada item e setar apenas os nomes:

const tags = [
{ id: 1, name: "node", note_id: 1 },
{ id: 2, name: "express", note_id: 1 },
{ id: 3, name: "react", note_id: 1 },
{ id: 4, name: "javascript", note_id: 2 },
{ id: 5, name: "frontend", note_id: 2 },
];

const newArray = tags.map(tag => {
return {
name: tag.name
}
}); essa mostra o objeto nome tambem alem do nome da tag

const newArray = tags.map(tag =>) <mostrar todo o conteudo de tags> OU ainda
const newArray = tags.map(tag => {
return tag;
});

reduzida somente nome > newarray = tag.map(tag => tag.name);

para incluir algo novo usa despejo "..."

const newArray = tags.map(tag => {
return {
...tag,
date: new Date()
}
});

o map eh pr percorrer o array e retornar um novo array, o filter significa q vc ker filtrar o conteudo do array

const newArray = tags.filter(tag => tag.note_id === 1); 3x o sinal de igual eh se o valor e o tipo sao os mesmos

<CONTROL + D SELECIONA TODOS OS LUGARES PARA MUDAR DE UMA VEZ NO VSCODE>

KNEX- construtor de consulta de banco de dados relacional
JWT - JSON WEB TOKEN - padrao de mercado q define token em formato json p trocar info entre app e api no backend.. eh um meio que permite essa troca de autenticacao no fluxo.

JSON web token (biblioteca para gerar o token de autenticacao do user) npm install jsonwebtoken
cria pasta config/auth.js e cria
module.exports = {
jwt: {
secret: "default",
expiresIn: "1d"
}
}
vai sessionsController e importa ela
const authConfig = require("../conf/auth") e importa o metodo sign q fica dentro do jsonwebtoken
const { sign } = require("jsonwebtoken")

depois passada a etapa de autenticacao de usuario em session controller, desestrutura o secret e
o expireIn
