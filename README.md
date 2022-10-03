# PP2-PG
Projeto implementado para a disciplina de Processamento Gráfico

### Membros
* Gabrielle Bulhões Oliveira - 792180
* Joatan da Silva Marques - 792186
* Maria Eduarda Caixeta Lella - 792202

### Desenvolvimento
Nesse projeto, foi implemetada uma cena com 3 objetos coloridos (um para cada integrante do grupo). Um cubo, uma esfera e um triângulo que possui um movimento de rotação. 

Para o desenvolvimento, utilizamos as seguintes ferramentas: 
- HTLM
- CSS
- JavaScript + WebGL

Apesar de termos utilizado HTML e CSS, a implementação dos objetos é, em sua grande maioria, feita utilizando JavaScript + WebGL. Onde primeiramente realizamos a configuração inicial do WebGL, inicializamos os shaders que serão utilizados (nesse caso foram o vertex e o fragment), e então definimos as matrizes de cada um dos 3 objetos implementados e escolhemos qual deles seria animado (nesse caso, o triângulo). Feito isso, definimos a câmera e, por fim, renderizamos os objetos.

### Dificuldades
Tivemos uma pequena dificuldade para conseguir inserir os 3 objetos no mesmo canva e, na animação, para fazer com que apenas o objeto rotacionasse e não toda a cena. Como foi utilizada uma linguagem de alto nível, coisas que poderiam dificultar o trabalho, como manipulação de matrizes e os cálculos necessários para o movimento do objeto por exemplo, são extremamente facilitadas pelas funções e bibliotecas da propria linguagem.
