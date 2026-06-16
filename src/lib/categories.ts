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
    handle: "mochilas-taticas",
    label: "Mochilas Táticas",
    eyebrow: "Linha Tactical",
    title: "MOCHILAS TÁTICAS",
    description:
      "Capacidade, organização modular MOLLE e conforto para missões longas e o dia a dia urbano.",
    query: "tag:mochila OR tag:tactical OR product_type:mochila OR title:mochila",
  },
  {
    handle: "operator",
    label: "Operator",
    eyebrow: "Coleção Operator",
    title: "LINHA OPERATOR",
    description: "Equipamento profissional para operadores. Cordura® 1000D e garantia vitalícia.",
    query: "tag:operator OR title:operator",
  },
  {
    handle: "edc",
    label: "EDC",
    eyebrow: "Every Day Carry",
    title: "EDC URBANO",
    description: "O essencial bem organizado para o dia a dia. Discreto e funcional.",
    query: "tag:edc OR title:edc",
  },
  {
    handle: "molle",
    label: "MOLLE",
    eyebrow: "MOLLE & Acessórios",
    title: "SISTEMA MOLLE",
    description: "Customize seu setup com acessórios MOLLE compatíveis com toda a linha Solze.",
    query: "tag:molle OR title:molle",
  },
  {
    handle: "range-bags",
    label: "Range Bags",
    eyebrow: "Range Ready",
    title: "RANGE BAGS",
    description: "Transporte seguro e organizado de equipamento para o estande.",
    query: "tag:range OR title:range",
  },
  {
    handle: "acessorios",
    label: "Acessórios",
    eyebrow: "Acessórios",
    title: "ACESSÓRIOS TÁTICOS",
    description: "Pouches, organizadores e o complemento perfeito para seu setup.",
    query: "tag:acessorio OR product_type:acessorio",
  },
  {
    handle: "vestuario",
    label: "Vestuário",
    eyebrow: "Vestuário",
    title: "VESTUÁRIO TÁTICO",
    description: "Roupas e uniformes táticos com performance de campo.",
    query: "tag:vestuario OR product_type:vestuario",
  },
  {
    handle: "coldres",
    label: "Coldres",
    eyebrow: "EDC Essentials",
    title: "COLDRES & CINTOS",
    description: "Coldres e cintos táticos com fivelas reforçadas.",
    query: "tag:coldre OR title:coldre OR title:cinto",
  },
  {
    handle: "outlet",
    label: "Outlet",
    eyebrow: "Outlet Solze",
    title: "OUTLET — ATÉ 50% OFF",
    description: "Produtos selecionados com descontos imperdíveis.",
    query: "tag:outlet OR tag:sale",
  },
];

export function findCategory(handle: string): CategoryDef {
  return (
    CATEGORIES.find((c) => c.handle === handle) ?? {
      handle,
      label: handle,
      eyebrow: "Coleção",
      title: handle.replace(/-/g, " ").toUpperCase(),
      description: "Produtos selecionados Solze.",
      query: handle,
    }
  );
}
