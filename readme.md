# PONDERADA 2 - VISUALIZAÇÕES INTERATIVAS COM D3.JS
## Tema B - Desenhos Interativos (Foco Criativo: Jardim de Luz)

Este projeto implementa a atividade "PONDERADA 2" com foco exclusivo no **Tema B (Desenhos Interativos)**, buscando uma abordagem **criativa, artística e lúdica** conforme solicitado. O resultado é uma visualização interativa chamada **"Noctilucas: Um Jardim de Luz"**.

**Aluno:** [Seu Nome Completo Aqui]
**Disciplina:** [Nome da Disciplina]
**Professor:** [Nome do Professor]
**Data:** [Data da Entrega]

---

### Conceito Criativo: "Noctilucas: Um Jardim de Luz"

A proposta é criar uma experiência visual interativa que remeta a um jardim noturno minimalista e luminoso. Em vez de visualizar dados externos, a interação do usuário *cria* os elementos visuais - as "Noctilucas" (flores de luz). A ênfase está na **atmosfera, na reação sutil e na exploração lúdica** do espaço gerado.

**Intenção Artística/Lúdica:**
* Criar uma sensação de calma e contemplação.
* Explorar animações orgânicas e reativas (`easeElasticOut`, `easeSinInOut`).
* Oferecer uma interação simples (clicar para criar) com consequências visuais emergentes (pulsação, reação ao cursor).
* Funcionar como um "brinquedo digital" ou uma forma de "poesia visual interativa".

---

### Implementação e Requisitos Técnicos

O projeto atende aos requisitos obrigatórios da PONDERADA 2 dentro do contexto criativo do Tema B:

1.  **Dados Externos ou SVG:**
    * **SVG Manipulado Dinamicamente:** O projeto foca na manipulação direta do SVG. Elementos `<circle>` são adicionados e estilizados dinamicamente via D3.js em resposta à interação do usuário. Um filtro SVG (`<filter id="glow">`) também é definido e aplicado para criar o efeito de brilho, demonstrando manipulação da estrutura SVG.

2.  **Animação (`.transition()`):**
    * **Expressividade:** As animações são usadas para dar vida e personalidade às Noctilucas:
        * **Criação:** Ao clicar, a flor surge com `transition().ease(d3.easeElasticOut)`, dando um efeito de "broto" elástico.
        * **Pulsação:** Cada flor tem uma animação de pulsação contínua e suave (`transition().ease(d3.easeSinInOut)`) com duração e intensidade levemente aleatórias, criando um efeito orgânico no jardim.
        * **Hover:** A reação ao cursor do mouse (aumento de raio e opacidade) é suavizada com `transition().ease(d3.easeCircleOut)`.

