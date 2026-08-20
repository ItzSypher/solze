export type CategoryDef = {
  handle: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  query?: string; // Shopify Storefront API search query
};

export const CATEGORIES: CategoryDef[] = [
  {
    handle: "bolsas",
    label: "Bolsas",
    eyebrow: "Linha Profissional",
    title: "BOLSAS PARA FERRAMENTAS",
    description:
      "Bolsas resistentes para transportar e organizar suas ferramentas no dia a dia de trabalho.",
    query: "tag:bolsa OR product_type:bolsa OR title:bolsa",
  },
  {
    handle: "mochilas",
    label: "Mochilas",
    eyebrow: "Linha Profissional",
    title: "MOCHILAS",
    description:
      "Mochilas pra carregar tudo que sua função exige, com reforço nas costuras e alças confortáveis.",
    query: "tag:mochila OR product_type:mochila OR title:mochila",
  },
  {
    handle: "estojos",
    label: "Estojos",
    eyebrow: "Organização",
    title: "ESTOJOS",
    description: "O essencial sempre à mão: estojos compactos pra separar o que você mais usa.",
    query: "tag:estojo OR title:estojo",
  },
  {
    handle: "coletes-aventais",
    label: "Coletes & Aventais",
    eyebrow: "Vestuário de trabalho",
    title: "COLETES & AVENTAIS",
    description: "Proteção e praticidade pra quem trabalha com as mãos o dia inteiro.",
    query: "tag:colete OR tag:avental OR title:colete OR title:avental",
  },
  {
    handle: "cintos",
    label: "Cintos",
    eyebrow: "Ferramenta na mão",
    title: "CINTOS PORTA-FERRAMENTAS",
    description: "Cintos e cartucheiras reforçadas pra ter a ferramenta certa sempre por perto.",
    query: "tag:cinto OR title:cinto OR title:cartucheira",
  },
  {
    handle: "acessorios",
    label: "Acessórios Multiuso",
    eyebrow: "Acessórios",
    title: "ACESSÓRIOS MULTIUSO",
    description: "Complementos práticos pra deixar seu setup de trabalho completo.",
    query: "tag:acessorio OR product_type:acessorio",
  },
  {
    handle: "outlet",
    label: "Ofertas",
    eyebrow: "Ofertas Solze",
    title: "OFERTAS — ATÉ 50% OFF",
    description: "Peças com desconto e a mesma resistência de sempre. Estoque limitado.",
    query: "tag:outlet OR tag:sale",
  },
];

export function findCategory(handle: string): CategoryDef {
  return (
    CATEGORIES.find((c) => c.handle === handle) ?? {
      handle,
      label: handle,
      eyebrow: "Categoria",
      title: handle.replace(/-/g, " ").toUpperCase(),
      description: "Produtos selecionados Solze.",
      query: handle,
    }
  );
}
