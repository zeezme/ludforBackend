### Diagrama do Banco de Dados

![diagrama](https://github.com/user-attachments/assets/bcca7cae-cd79-433e-abb7-efb5c339a73c)

### Collection:

![Rotas](https://github.com/user-attachments/assets/0443914a-c416-484c-beb1-5601e8f64cfc)

[Link para a Collection](https://lightchat.postman.co/workspace/Team-Workspace~5d598b61-91da-4d84-8aff-d7d845c0e2dd/collection/39679697-00c39a8e-0d49-447f-934e-883d24d97ed5?action=share&creator=39679697)

### Estrutura e Funcionalidade do Banco de Dados

O modelo é centrado na tabela **`users`**, que é a principal entidade do sistema. As demais tabelas se relacionam a partir dessa entidade.

1. **Usuário (`users`)**:
   - Armazena as informações principais do usuário.
   - Cada `user` pode estar vinculado a uma **pessoa** (`persons`) ou ter várias, indicando a quem cada pessoa pertence.
   - A tabela `permissions` define as permissões do usuário. Cada `user` pode ter várias permissões.
   - A tabela `authentications` armazena os **tokens** de autenticação, permitindo que um usuário tenha múltiplos tokens.

2. **Pessoa (`persons`)**:
   - Armazena dados pessoais básicos de uma pessoa, mas só tem valor quando associada a um `user`.
   - Se o `personId` está no `user`, a pessoa é o próprio usuário. Se o `userId` está no `person`, a pessoa pertence ao usuário e só ele tem acesso a ela.

3. **Funcionário (`employees`)**:
   - Marca uma pessoa como **funcionário**, com dados adicionais como salário, cargo, etc.
   - Permite expandir o modelo facilmente, adicionando dados específicos de funcionários sem afetar a estrutura dos dados pessoais.

4. **Logs e Auditoria**:
   - A tabela de logs, gerida pelo `repositorioBase`, registra ações realizadas pelos `users` para garantir a rastreabilidade e integridade das operações.

### Considerações Técnicas:
- O banco foi projetado para **flexibilidade e escalabilidade**.
- Relacionamentos:
  - **1:N** entre `users` e `persons` (um usuário pode ter várias pessoas associadas).
  - **M:N** entre `users` e `permissions` (um usuário pode ter várias permissões e uma permissão pode ser atribuída a vários usuários).
  - **1:N** entre `users` e `authentications` (um usuário pode ter vários tokens).
  - **1:1** entre `persons` e `employees` (uma pessoa pode ser um funcionário ou não).
- **Uma tabela `customers` associada a `persons`** pode ser criada no futuro para categorizar pessoas como clientes, se necessário.
