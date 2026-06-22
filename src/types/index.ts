export interface NavItem {
    icon: string;
    label: string;
    href: string;
    active?: boolean;
    iconFilled?: boolean;
}

export interface User {
    name: string;
    role: string;
    avatarUrl: string;
}

export interface CreditPlan {
    id: string;
    tier: 'free' | 'starter' | 'growth' | 'scale';
    name: string;
    price: number;
    period: string;
    description: string;
    credits: string;
    features: string[];
    featured?: boolean;
    current?: boolean;
    ctaLabel: string;
    accentColor: 'primary' | 'secondary' | 'tertiary';
}

export interface FaqItem {
    question: string;
    answer: string;
}