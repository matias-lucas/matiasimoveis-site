import { Home, BadgeCheck, Building2, type LucideIcon } from "lucide-react";

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const SERVICES: ServiceItem[] = [
  {
    icon: Home,
    title: "Compra e venda",
    description: "Intermediação completa, da avaliação à escritura.",
  },
  {
    icon: BadgeCheck,
    title: "Locação segura",
    description: "Contratos e vistorias com respaldo jurídico.",
  },
  {
    icon: Building2,
    title: "Administração",
    description: "Gestão de aluguéis e condomínios com transparência.",
  },
];
