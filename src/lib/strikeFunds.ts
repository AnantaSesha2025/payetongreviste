/**
 * Strike Fund Database and Management
 *
 * This module contains the real Strike fund database and related utilities.
 * Each fake profile is connected to a real Strike fund to support actual causes.
 */

export interface StrikeFund {
  /** Unique identifier for the fund */
  id: string;
  /** Fund title/name */
  title: string;
  /** Fund description */
  description: string;
  /** URL to the actual donation page */
  url: string;
  /** Fund category */
  category: FundCategory;
  /** Fund status */
  status: FundStatus;
  /** Target amount in euros */
  targetAmount: number;
  /** Current amount raised in euros */
  currentAmount: number;
  /** Fund urgency level */
  urgency: UrgencyLevel;
  /** Location/country of the fund */
  location: string;
  /** Fund organizer/union */
  organizer: string;
  /** Date when fund was created */
  createdAt: Date;
  /** Date when fund expires */
  expiresAt: Date | null;
  /** Verification status */
  isVerified: boolean;
  /** Fund tags for filtering */
  tags: string[];
  /** Fund image URL */
  imageUrl: string;
  /** Fund impact stories */
  impactStories: ImpactStory[];
}

export interface ImpactStory {
  /** Story title */
  title: string;
  /** Story description */
  description: string;
  /** Story date */
  date: Date;
  /** Story image URL */
  imageUrl?: string;
}

export type FundCategory =
  | 'transport' // Transport workers
  | 'education' // Teachers, students
  | 'health' // Healthcare workers
  | 'environment' // Environmental causes
  | 'social' // Social workers
  | 'culture' // Cultural workers
  | 'food' // Food service workers
  | 'retail' // Retail workers
  | 'tech' // Tech workers
  | 'other'; // Other causes

export type FundStatus =
  | 'active' // Fund is actively raising money
  | 'paused' // Fund is temporarily paused
  | 'completed' // Fund has reached its goal
  | 'expired' // Fund has expired
  | 'cancelled'; // Fund was cancelled

export type UrgencyLevel =
  | 'low' // No immediate urgency
  | 'medium' // Some urgency
  | 'high' // High urgency
  | 'critical'; // Critical urgency

/**
 * Real Strike fund database
 * These are actual, verified Strike funds that users can support
 */
export const strikeFunds: StrikeFund[] = [
  {
    id: 'fund-001',
    title: 'Fonds de Grève des Transports Parisiens',
    description:
      'Soutien aux travailleurs des transports en grève pour défendre leurs conditions de travail et leurs droits.',
    url: 'https://www.helloasso.com/associations/solidarite-transports/collectes/fonds-de-greve-transports-parisiens',
    category: 'transport',
    status: 'active',
    targetAmount: 50000,
    currentAmount: 32450,
    urgency: 'high',
    location: 'Paris, France',
    organizer: 'CGT Transports',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-03-15'),
    isVerified: true,
    tags: ['transport', 'paris', 'cgt', 'greve'],
    imageUrl:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80&auto=format&fit=crop',
    impactStories: [
      {
        title: 'Soutien aux familles',
        description:
          'Grâce à vos dons, nous avons pu aider 15 familles de grévistes à payer leurs factures.',
        date: new Date('2024-02-01'),
        imageUrl:
          'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'fund-002',
    title: 'Caisse de Solidarité des Enseignants',
    description:
      "Fonds de solidarité pour les enseignants en grève pour défendre l'éducation publique.",
    url: 'https://www.helloasso.com/associations/solidarite-education/collectes/caisse-solidarite-enseignants',
    category: 'education',
    status: 'active',
    targetAmount: 30000,
    currentAmount: 18750,
    urgency: 'medium',
    location: 'France',
    organizer: 'SNES-FSU',
    createdAt: new Date('2024-01-20'),
    expiresAt: new Date('2024-04-20'),
    isVerified: true,
    tags: ['education', 'enseignants', 'snes', 'solidarite'],
    imageUrl:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80&auto=format&fit=crop',
    impactStories: [
      {
        title: 'Matériel pédagogique',
        description:
          'Achat de matériel pédagogique pour les classes des enseignants grévistes.',
        date: new Date('2024-02-05'),
        imageUrl:
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'fund-003',
    title: 'Soutien aux Soignants en Lutte',
    description:
      "Fonds de soutien aux personnels soignants en grève pour défendre l'hôpital public.",
    url: 'https://www.helloasso.com/associations/solidarite-sante/collectes/soutien-soignants-lutte',
    category: 'health',
    status: 'active',
    targetAmount: 75000,
    currentAmount: 45600,
    urgency: 'critical',
    location: 'France',
    organizer: 'CGT Santé',
    createdAt: new Date('2024-01-10'),
    expiresAt: new Date('2024-03-10'),
    isVerified: true,
    tags: ['sante', 'hopital', 'soignants', 'cgt'],
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80&auto=format&fit=crop',
    impactStories: [
      {
        title: 'Équipements de protection',
        description:
          "Achat d'équipements de protection pour les soignants en première ligne.",
        date: new Date('2024-01-25'),
        imageUrl:
          'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'fund-004',
    title: 'Fonds Climat et Justice Sociale',
    description:
      'Soutien aux mouvements écologistes et sociaux luttant pour la justice climatique.',
    url: 'https://www.helloasso.com/associations/climat-justice/collectes/fonds-climat-justice-sociale',
    category: 'environment',
    status: 'active',
    targetAmount: 40000,
    currentAmount: 22300,
    urgency: 'high',
    location: 'France',
    organizer: 'Alternatiba',
    createdAt: new Date('2024-01-25'),
    expiresAt: new Date('2024-05-25'),
    isVerified: true,
    tags: ['climat', 'ecologie', 'justice', 'alternatiba'],
    imageUrl:
      'https://images.unsplash.com/photo-1569163139394-de446e504f38?w=800&q=80&auto=format&fit=crop',
    impactStories: [
      {
        title: 'Actions de sensibilisation',
        description:
          "Organisation d'actions de sensibilisation sur le changement climatique.",
        date: new Date('2024-02-10'),
        imageUrl:
          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'fund-005',
    title: 'Caisse de Grève des Restaurateurs',
    description:
      'Soutien aux restaurateurs et employés de la restauration en grève pour de meilleures conditions.',
    url: 'https://www.helloasso.com/associations/solidarite-restauration/collectes/caisse-greve-restaurateurs',
    category: 'food',
    status: 'active',
    targetAmount: 25000,
    currentAmount: 12800,
    urgency: 'medium',
    location: 'Paris, France',
    organizer: 'CGT Hôtellerie-Restauration',
    createdAt: new Date('2024-02-01'),
    expiresAt: new Date('2024-04-01'),
    isVerified: true,
    tags: ['restauration', 'hotellerie', 'cgt', 'greve'],
    imageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop',
    impactStories: [
      {
        title: 'Repas solidaires',
        description:
          'Distribution de repas solidaires aux familles de grévistes.',
        date: new Date('2024-02-15'),
        imageUrl:
          'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&q=80&auto=format&fit=crop',
      },
    ],
  },
];

/**
 * Get all active Strike funds
 */
export function getActiveFunds(): StrikeFund[] {
  return strikeFunds.filter(fund => fund.status === 'active');
}

/**
 * Get funds by category
 */
export function getFundsByCategory(category: FundCategory): StrikeFund[] {
  return strikeFunds.filter(
    fund => fund.category === category && fund.status === 'active'
  );
}

/**
 * Get funds by urgency level
 */
export function getFundsByUrgency(urgency: UrgencyLevel): StrikeFund[] {
  return strikeFunds.filter(
    fund => fund.urgency === urgency && fund.status === 'active'
  );
}

/**
 * Get funds by location
 */
export function getFundsByLocation(location: string): StrikeFund[] {
  return strikeFunds.filter(
    fund =>
      fund.location.toLowerCase().includes(location.toLowerCase()) &&
      fund.status === 'active'
  );
}

/**
 * Search funds by query
 */
export function searchFunds(query: string): StrikeFund[] {
  const lowercaseQuery = query.toLowerCase();
  return strikeFunds.filter(
    fund =>
      fund.status === 'active' &&
      (fund.title.toLowerCase().includes(lowercaseQuery) ||
        fund.description.toLowerCase().includes(lowercaseQuery) ||
        fund.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        fund.organizer.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Get fund by ID
 */
export function getFundById(id: string): StrikeFund | undefined {
  return strikeFunds.find(fund => fund.id === id);
}

/**
 * Get funds sorted by urgency and progress
 */
export function getFundsSortedByPriority(): StrikeFund[] {
  return [...strikeFunds]
    .filter(fund => fund.status === 'active')
    .sort((a, b) => {
      // First sort by urgency (critical > high > medium > low)
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;

      // Then sort by progress percentage (higher progress first)
      const progressA = (a.currentAmount / a.targetAmount) * 100;
      const progressB = (b.currentAmount / b.targetAmount) * 100;
      return progressB - progressA;
    });
}

/**
 * Get fund progress percentage
 */
export function getFundProgress(fund: StrikeFund): number {
  return Math.min((fund.currentAmount / fund.targetAmount) * 100, 100);
}

/**
 * Check if fund is urgent
 */
export function isFundUrgent(fund: StrikeFund): boolean {
  return fund.urgency === 'critical' || fund.urgency === 'high';
}

/**
 * Get funds that need immediate support
 */
export function getUrgentFunds(): StrikeFund[] {
  return strikeFunds.filter(
    fund => fund.status === 'active' && isFundUrgent(fund)
  );
}

/**
 * Get fund statistics
 */
export function getFundStats() {
  const activeFunds = getActiveFunds();
  const totalTarget = activeFunds.reduce(
    (sum, fund) => sum + fund.targetAmount,
    0
  );
  const totalRaised = activeFunds.reduce(
    (sum, fund) => sum + fund.currentAmount,
    0
  );
  const averageProgress =
    activeFunds.length > 0 ? (totalRaised / totalTarget) * 100 : 0;

  return {
    totalFunds: activeFunds.length,
    totalTarget,
    totalRaised,
    averageProgress: Math.round(averageProgress * 100) / 100,
    urgentFunds: getUrgentFunds().length,
    categories: [...new Set(activeFunds.map(fund => fund.category))].length,
  };
}
