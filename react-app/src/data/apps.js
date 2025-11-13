import {
  Home,
  Calculator,
  DollarSign,
  CheckSquare,
  Lock,
  MessageSquare,
  Coffee,
  Users,
  Brain,
  Sofa,
  Calendar,
  TrendingUp,
  Heart,
  Palette,
  Zap
} from 'lucide-react';

export const categories = [
  { id: 'all', name: 'All Apps', icon: Home },
  { id: 'productivity', name: 'Productivity Suite', icon: CheckSquare },
  { id: 'money', name: 'Money Tools', icon: DollarSign },
  { id: 'daily', name: 'Daily Life Tools', icon: Coffee },
  { id: 'mindfulness', name: 'Mindfulness & Wellness', icon: Heart },
  { id: 'creativity', name: 'Creativity Studio', icon: Palette },
  { id: 'social', name: 'Social & Entertainment', icon: Users }
];

export const apps = [
  {
    id: 'productivity-tracker',
    name: 'Productivity Tracker',
    category: 'productivity',
    icon: CheckSquare,
    color: 'from-blue-500 to-blue-600',
    description: 'Train driver shift tracking with productivity insights',
    implemented: true
  },
  {
    id: 'tax-app',
    name: 'Tax Calculator',
    category: 'money',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    description: 'ATO-aligned multi-step tax estimation',
    implemented: true
  },
  {
    id: 'home-loan',
    name: 'Home Loan Calculator',
    category: 'money',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    description: 'Wealth projection + repayment insights',
    implemented: true
  },
  {
    id: 'meditation',
    name: 'Meditation & Mantra',
    category: 'mindfulness',
    icon: Brain,
    color: 'from-teal-500 to-cyan-600',
    description: 'Voice-activated meditation counter',
    implemented: true
  },
  {
    id: 'coffee',
    name: 'Starbucks Ordering',
    category: 'daily',
    icon: Coffee,
    color: 'from-amber-500 to-orange-600',
    description: 'Custom drinks, live queue & voice ordering',
    implemented: true
  },
  {
    id: 'furniture-design',
    name: 'Furniture Designer',
    category: 'creativity',
    icon: Sofa,
    color: 'from-orange-500 to-yellow-500',
    description: 'Room layouts & drag/drop planning',
    implemented: false
  },
  {
    id: 'linkedin-mini',
    name: 'LinkedIn Mini',
    category: 'social',
    icon: Users,
    color: 'from-indigo-500 to-purple-600',
    description: 'Profiles, feeds & AI resume tips',
    implemented: false
  },
  {
    id: 'auth',
    name: 'Authentication',
    category: 'productivity',
    icon: Lock,
    color: 'from-purple-500 to-purple-600',
    description: 'Secure login modules',
    implemented: false
  },
  {
    id: 'chatbot',
    name: 'AI Chatbot',
    category: 'daily',
    icon: MessageSquare,
    color: 'from-indigo-500 to-indigo-600',
    description: 'Conversational helper',
    implemented: false
  },
  {
    id: 'psychologist',
    name: 'Psychologist Booking',
    category: 'mindfulness',
    icon: Calendar,
    color: 'from-cyan-500 to-blue-500',
    description: 'Book mental health appointments',
    implemented: false
  },
  {
    id: 'mini-games',
    name: 'Entertainment Mini-Apps',
    category: 'social',
    icon: Zap,
    color: 'from-red-500 to-pink-600',
    description: 'Fun casual experiences',
    implemented: false
  }
];
