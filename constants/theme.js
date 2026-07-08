export const COLORS = {
  primary: '#00569C', // Kimia Farma Blue
  primaryDark: '#003D70',
  primaryLight: '#E6F0FA',
  secondary: '#F26522', // Kimia Farma Orange
  accent: '#E0004D', // Halodoc Red
  accentLight: '#FCE6EC',
  background: '#F4F7FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFBFC',
  text: '#1A1A2E',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  white: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.06)',
  overlay: 'rgba(0,0,0,0.5)',
  gradient: {
    primary: ['#00569C', '#0072CF'],
    secondary: ['#F26522', '#FF8243'],
    accent: ['#E0004D', '#FF3370'],
    dark: ['#1A1A2E', '#2D2D44'],
    sunset: ['#F26522', '#F59E0B'],
    mint: ['#00569C', '#10B981'],
  },
};

export const FONTS = {
  regular: { fontSize: 14, color: COLORS.text, fontFamily: undefined },
  medium: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  bold: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  h1: { fontSize: 30, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700', color: COLORS.text, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  h4: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  caption: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '400' },
  label: { fontSize: 11, color: COLORS.textLight, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase' },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
};

export const GRADIENTS = {
  primary: ['#00569C', '#0072CF'],
  secondary: ['#F26522', '#FF8243'],
  accent: ['#E0004D', '#FF3370'],
  sunset: ['#F26522', '#F59E0B'],
  mint: ['#00569C', '#10B981'],
};
