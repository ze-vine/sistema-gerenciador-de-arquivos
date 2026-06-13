[33mcommit 85115558e64c009084f1bf4a03921c51d3bdac8a[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mfeature/criacao-de-pastas[m[33m, [m[1;31morigin/feature/suporte-para-pastas[m[33m, [m[1;32mfeature/suporte-para-pastas[m[33m)[m
Author: José Vine <josevine729@gmail.com>
Date:   Fri Jun 5 10:27:59 2026 -0300

    feat: cria os módulos iniciais que serão responsáveis por prover a lógica de criação, deleção, manipulação e alteração de pastas na API

[33mcommit 9cca94e71806cbce74c6a53658b079d3c0f9c5d7[m
Author: José Vine <josevine729@gmail.com>
Date:   Fri Jun 5 10:26:47 2026 -0300

    feat: adiciona restrição ao banco que proibe a inserção de pastas com o mesmo nome no mesmo nível na hierarquia de diretórios do usuário

[33mcommit a4bb7e1b6f3252216234c5311d378b5cd853cda8[m
Author: José Vine <josevine729@gmail.com>
Date:   Thu May 28 18:13:39 2026 -0300

    feat: modifica esquema do banco de dados para suportar a lógica de criação de pastas

[33mcommit 21595391866dfc3f415d6c5354888ffaf4ffd765[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m, [m[1;32mmain[m[33m)[m
Merge: 72f1ce4 c7c9368
Author: José Vine <josevine729@gmail.com>
Date:   Sat May 23 18:10:42 2026 -0300

    Merge pull request #2 from ze-vine/feature/melhoria-do-alert-para-exclusao-de-arquivo
    
    Feature/melhoria do alert para exclusao de arquivo

[33mcommit c7c93689f5fe926bd2c3de49abd9b7b8deeb4974[m[33m ([m[1;31morigin/feature/melhoria-do-alert-para-exclusao-de-arquivo[m[33m)[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat May 23 18:05:16 2026 -0300

    feat: melhora o alert de exclusão do arquivo

[33mcommit efd88882c52506067f1ac50c867615898d93b674[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat May 23 16:33:54 2026 -0300

    fix: corrige dependencias e diretórios da biblioteca shadcn ui

[33mcommit b4a336f48d5adc490a05a71e42e931830f6345a0[m
Author: José Vine <josevine729@gmail.com>
Date:   Thu May 21 16:08:23 2026 -0300

    fix: corrige bug da aplicação que chamava a função fetchFiles novamente quando o usuário encerrava a sessão

[33mcommit fc2b44dd10c8e1e96fe06d6213288bac2f918aad[m
Author: José Vine <josevine729@gmail.com>
Date:   Thu May 21 16:05:28 2026 -0300

    refactor: tirando o console.log que imprimia o retorno da API

[33mcommit 1f06381dcb479ae01cfe726a6aa5c7dd072137d5[m
Author: José Vine <josevine729@gmail.com>
Date:   Thu May 21 15:12:04 2026 -0300

    perf: adiciona índice para a coluna jti para melhorar a perfomance ao procurar por tokens revogados

[33mcommit aae533a5cb18978d68a6a3b49e9619a6b8d26060[m
Author: José Vine <josevine729@gmail.com>
Date:   Thu May 21 15:00:27 2026 -0300

    refactor: corrige erro 401 ao carregar a página pela primeira vez ou ao recarregar a página

[33mcommit 72f1ce4b9bd75f64de65efb5c95905245a15bd9e[m
Merge: 912d763 950a2db
Author: José Vine <josevine729@gmail.com>
Date:   Thu May 21 14:38:25 2026 -0300

    Merge pull request #1 from ze-vine/feature/logout
    
    Feature/logout

[33mcommit 950a2db56cc0fcec21133183672e4b9a6ee2bbd7[m[33m ([m[1;31morigin/feature/logout[m[33m)[m
Author: José Vine <josevine729@gmail.com>
Date:   Tue May 19 23:38:29 2026 -0300

    feat: instala biblioteca shadcn ui para utilização de componentes e cria botão de logout no dashboard

[33mcommit e4ea56dee05732f861c0e195ffefd42d091ea48e[m
Author: José Vine <josevine729@gmail.com>
Date:   Mon May 18 21:51:54 2026 -0300

    feat: adiciona método programado que exclui os tokens expirados na blacklist a cada hora

[33mcommit b9b4e2036a52699c4e1fed304173300b90e73ce5[m
Author: José Vine <josevine729@gmail.com>
Date:   Mon May 18 20:27:53 2026 -0300

    feat: implementa lógica de invalidação do token do usuário com base na sua presença na blacklist

[33mcommit 23ddd476c92c0b0323ce816351119b9542dfd45a[m
Author: José Vine <josevine729@gmail.com>
Date:   Mon May 18 08:58:35 2026 -0300

    feat: lógica de logout implementada no backend com inserção de token na blacklist e limpeza de sessão nos cookies

[33mcommit 5911bff0a963a04882a26922d7bdd1dd885365f1[m
Author: José Vine <josevine729@gmail.com>
Date:   Sun May 17 10:44:13 2026 -0300

    feature: adiciona um identificador único para o token para implementação de blacklist e remove informações desnecessárias na geração do token

[33mcommit f1e314e746b96619bf226a509a12d5fb6c39dc1b[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat May 16 11:33:37 2026 -0300

    feature: padroniza o snake_case para as tabelas e as colunas do banco de dados e cria o modelo TokenBlacklist para revogação dos tokens

[33mcommit 912d76365de378bbc9c726c6ec31eddd9ec04c90[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat May 16 10:49:12 2026 -0300

    chore: remove importação não utilizada do useEffect no componente Form

[33mcommit 4b4f8b6657a3abf07761ad8096183fdcf49625b8[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat May 16 10:45:28 2026 -0300

    chore: remove ícone e favicon não utilizados no projeto

[33mcommit b841471fbcca8489cda8f5546ad3e73ba15d198a[m
Author: José Vine <josevine729@gmail.com>
Date:   Sun May 3 11:43:02 2026 -0300

    fix: retira o parâmetro id da rota GET do UsersController para que ele receba o id que está contido no token e valide o usuário. Em seguida, no frontend, altera a rota para a qual se valida a existência do usuário para manter a sua sessão ativa.

[33mcommit 59afee5ba03db79b7dc4483cffeb2c6ecb0aa25b[m
Author: José Vine <josevine729@gmail.com>
Date:   Sun May 3 10:26:12 2026 -0300

    Update README.md

[33mcommit 64f6bff166bf21009b5d1795359acdfa001bbf6c[m
Author: José Vine <josevine729@gmail.com>
Date:   Sun May 3 10:19:51 2026 -0300

    refactor: ajusta página de login e modifica dependências para suportar as funcionalidades da aplicação

[33mcommit d535c12305f7203d84df199d8dc651e5fd22a143[m
Author: José Vine <josevine729@gmail.com>
Date:   Sun May 3 10:15:38 2026 -0300

    feat: cria rotas protegidas no frontend e o componente LoginPage

[33mcommit ab8a2a03553795f8adf7721d98aedc09d3f2b5af[m
Author: José Vine <josevine729@gmail.com>
Date:   Sun May 3 10:14:16 2026 -0300

    feat: cria AuthContext para gerenciamento global do estado de autenticação do usuário no frontend e gera tipos globais com typescript

[33mcommit 2adfe333cbc2af1f3a8f7872aee2542021616942[m
Author: José Vine <josevine729@gmail.com>
Date:   Sun May 3 10:04:30 2026 -0300

    feat: implementa autenticação completa com JWT no backend

[33mcommit cfa0acb1c45dbc421266871a131aec2025735f67[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat Apr 11 16:00:16 2026 -0300

    feat: cria os componentes React e a interface de gerenciamento de arquivos, integrando a API com o frontend

[33mcommit a0d01f55a5429bc34bf330f139c7d7ed30e802c7[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat Apr 11 15:57:19 2026 -0300

    refactor: ajusta algumas configurações da API para que ela esteja pronta para uso, finalizando o seu desenvolvimento

[33mcommit eab32d40c6d83a7fb5df7fa340a1631ea5c02357[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat Apr 11 11:13:02 2026 -0300

    feat: cria projeto React + Tailwind + Typescript e elabora estrutura inicial das pastas

[33mcommit 810949bedc6fea75d66bb87b977a4cc1741538e6[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat Apr 11 10:46:09 2026 -0300

    feat: implementa por completo o método de exclusão, apagando não apenas os metadados do banco, mas também da nuvem

[33mcommit 2ebdffd6faa3aa8f85945508abfa73d3d6ce4993[m
Author: José Vine <josevine729@gmail.com>
Date:   Sat Apr 11 10:11:06 2026 -0300

    refactor: adiciona o campo publicId no banco para permitir a exclusão e atualização dos arquivos na nuvem e refatora os métodos de serviço, de modo que incluam o campo publicId

[33mcommit 7c68269c3d2b714d832598d79c30c05d54277ab9[m
Author: José Vine <josevine729@gmail.com>
Date:   Fri Apr 10 23:40:45 2026 -0300

    feat: implementa o upload de arquivos na nuvem e os metadados no banco de dados sob a validação do token JWT

[33mcommit 2bc51e1afef330c687d2bcd69a3d8e5692c532b1[m
Author: José Vine <josevine729@gmail.com>
Date:   Fri Apr 10 20:30:01 2026 -0300

    feat: implementa CRUD de usuários e autenticação JWT completo
    
    - Configuração do Prisma e migrações de banco de dados.
    - Endpoints de criação, leitura, atualização e exclusão de usuários.
    - Implementação de Hash de senha com bcrypt.
    - Sistema de login com geração de tokens JWT.
    - Proteção de rotas com AuthGuard personalizado.
    - Integração com variáveis de ambiente (.env) via ConfigService.

[33mcommit 5b537128efda35ce2bdbdf7de0b6305047f94116[m
Author: José Vine <josevine729@gmail.com>
Date:   Fri Apr 10 07:08:50 2026 -0300

    feat: estrutura inicial do backend e prisma configurado

[33mcommit 397c28d15673d3e0be78b1f9a09ecff3dd818daa[m
Author: José Vine <josevine729@gmail.com>
Date:   Wed Apr 8 19:32:48 2026 -0300

    Create README.md
