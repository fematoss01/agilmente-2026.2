# 1. Requisitos Funcionais

A *Tabela 1* a seguir contém os Requisitos Funcionais (RF) elicitados para o sistema de gestão e inscrições da Semana Acadêmica.

| ID | Requisito | Prioridade | Requisitos Relacionados |
| :--- | :--- | :---: | :---: |
| **RF01** | O sistema deve permitir que os usuários realizem cadastro informando nome completo, e-mail institucional, registro acadêmico (RA) e senha. | Alta | RF02 |
| **RF02** | O sistema deve permitir que os usuários autentiquem-se (login) com suas credenciais cadastradas. | Alta | RF01 |
| **RF03** | O sistema deve permitir que o organizador cadastre novas atividades (palestras, minicursos, mesas-redondas), definindo tema, descrição, ministrante, data, horário, local e limite de vagas. | Alta | RF04, RF05 |
| **RF04** | O sistema deve permitir que o organizador edite ou cancele atividades cadastradas na programação. | Média | RF03 |
| **RF05** | O sistema deve disponibilizar um catálogo com o cronograma completo das atividades da Semana Acadêmica para consulta dos alunos. | Alta | RF03, RF06 |
| **RF06** | O sistema deve permitir a filtragem e busca de atividades por curso, modalidade (palestra ou minicurso). | Média | RF05 |
| **RF07** | O sistema deve exibir os detalhes completos de uma atividade selecionada, indicando a quantidade de vagas totais e vagas restantes em tempo real. | Alta | RF05, RF08 |
| **RF08** | O sistema deve permitir que o aluno autenticado se inscreva em uma atividade que possua vagas disponíveis. | Alta | RF02, RF07, RF09 |
| **RF09** | O sistema deve impedir que o aluno se inscreva em atividades que possuam choque de horário com outra em que ele já esteja inscrito. | Alta | RF08 |
| **RF10** | O sistema deve permitir que o aluno cancele sua inscrição em uma atividade até o prazo limite estipulado pela organização. | Média | RF08 |
| **RF11** | O sistema deve disponibilizar uma área restrita para o aluno visualizar a sua programação pessoal com todas as atividades em que está inscrito. | Alta | RF08, RF10 |
| **RF12** | O sistema deve permitir que o organizador registre a presença dos participantes nas atividades por meio de uma lista. | Alta | RF08, RF13 |
| **RF13** | O sistema deve permitir que o organizador acompanhe a taxa de ocupação das salas e a quantidade de inscritos por atividade em um painel gerencial. | Baixa | RF03, RF08 |

*Tabela 1: Requisitos Funcionais*
