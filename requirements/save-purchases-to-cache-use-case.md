# Gravar Compras no Cache

> ## Caso de Sucesso

1. Sistema executa o comando "Salvar Compras"
2. Sistema cria data uma data para ser armazenada no Cache
3. Sistema apaga os dados do Cache atual
4. Sistema grava os novos dados do Cache
5. Sistema não retorna nenhum erro

> ## Exceção - Erro ao apagar dados do Cache

1. Sistema retorna erro
2. Sistema não grava os novos dados do Cache

> ## Exceção - Erro ao gravar dados no Cache

1. Sistema retorna erro
