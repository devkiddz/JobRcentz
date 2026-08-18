import { BriefcaseBusiness, Database, PenTool, Palette, Code2, Megaphone, BarChart3, Settings2, WalletCards, Users, ShieldCheck, Smartphone} from "lucide-react";

export const popularCategories = [
  {
    id: 'software-development',
    label: 'Software Development',
    description: 'Build web, mobile, and backend products that power modern businesses.',
    icon: Code2,
    search: 'Software Development',
    color: '#3178C6'
  },
  {
    id: 'design-creative',
    label: 'Design & Creative',
    description: 'Turn ideas into memorable digital experiences, brands, and interfaces.',
    icon: Palette,
    search: 'Design',
    color: '#FF7262'
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Help ambitious brands reach the right people and grow their audience.',
    icon: Megaphone,
    search: 'Marketing',
    color: '#FF6B35'
  },
  {
    id: 'data-analytics',
    label: 'Data & Analytics',
    description: 'Transform business data into insights that drive smarter decisions.',
    icon: BarChart3,
    search: 'Data Analytics',
    color: '#F2C94C'
  },
  {
    id: 'product-management',
    label: 'Product Management',
    description: 'Lead products from idea to execution and create meaningful user value.',
    icon: Settings2,
    search: 'Product Management',
    color: '#7C3AED'
  },
  {
    id: 'finance-accounting',
    label: 'Finance & Accounting',
    description: 'Manage financial operations, reporting, planning, and business growth.',
    icon: WalletCards,
    search: 'Finance',
    color: '#16A34A'
  },
  {
    id: 'human-resources',
    label: 'Human Resources',
    description: 'Build strong teams, improve workplace experiences, and support talent.',
    icon: Users,
    search: 'Human Resources',
    color: '#EC4899'
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    description: 'Protect systems, data, and businesses from evolving digital threats.',
    icon: ShieldCheck,
    search: 'Cybersecurity',
    color: '#0EA5E9'
  },
  {
    id: 'mobile-development',
    label: 'Mobile Development',
    description: 'Create engaging mobile experiences for the devices people use every day.',
    icon: Smartphone,
    search: 'Mobile Development',
    color: '#8B5CF6'
  },
  {
    id: 'database-engineering',
    label: 'Database Engineering',
    description: 'Design reliable data systems that keep modern applications running.',
    icon: Database,
    search: 'Database',
    color: '#336791'
  },
  {
    id: 'content-writing',
    label: 'Content & Writing',
    description: 'Create clear, persuasive content that informs, engages, and converts.',
    icon: PenTool,
    search: 'Content Writing',
    color: '#F59E0B'
  },
  {
    id: 'business-operations',
    label: 'Business Operations',
    description: 'Keep teams, processes, and businesses moving efficiently every day.',
    icon: BriefcaseBusiness,
    search: 'Business Operations',
    color: '#64748B'
  }
] as const;