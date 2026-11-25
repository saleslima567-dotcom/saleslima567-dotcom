# Raiz — Gestão escolar

Protótipo navegável de um painel para gestão escolar, desenvolvido com HTML, CSS e JavaScript puro. A interface não depende de bibliotecas externas e funciona como site estático.

## O que dá para explorar

- Visão geral com indicadores da escola, frequência, agenda e alunos recentes.
- Cadastro, edição, busca, filtro e remoção de alunos.
- Cadastro e visualização de turmas, com ocupação calculada pelos alunos vinculados.
- Chamada diária, com registro de presença/ausência por data.
- Atualização de médias e exportação CSV de alunos e notas.
- Lista e cadastro demonstrativo de professores.
- Salvamento das alterações no `localStorage` do navegador.

## Executar localmente

Abra `index.html` no navegador ou sirva a pasta com qualquer servidor estático, por exemplo:

```bash
python -m http.server 4173
```

Depois, acesse `http://localhost:4173`.

## Limites desta versão

Este projeto é uma demonstração front-end. Os registros iniciais são fictícios; não há autenticação, API, banco de dados compartilhado, controle de acesso, backups ou envio de dados para um servidor. As alterações ficam somente no navegador em que foram feitas. Não use informações pessoais reais nesta versão.

Para uso real por uma escola, será necessário criar uma API e banco de dados, autenticação e autorização por perfil, trilha de auditoria, rotinas de backup e controles de privacidade adequados aos dados de menores.
