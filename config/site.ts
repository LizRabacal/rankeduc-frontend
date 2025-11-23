export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Sistema de Qualidade IES",
  description: "Sistema de apoio à decisão para avaliação da qualidade de Instituições de Ensino Superior (IES) baseado em dados INEP (IGC/IDD).",
  navItems: [
    {
      label: "Score",
      href: "/",
    },
    {
      label: "Sobre o projeto",
      href: "/sobre",
    },
  ],
  navMenuItems: [
    {
      label: "Score",
      href: "/",
    },
    {
      label: "Sobre o projeto",
      href: "/sobre",
    },
    
  ],
  links: {
    github: "https://github.com/LizRabacal",

  },
};