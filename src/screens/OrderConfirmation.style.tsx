import { StyleSheet } from 'react-native'

import { Colors, Spacing, FontSize, Radius } from '@/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  checkmark: {
    fontSize: 56,
    color: Colors.textInverse,
    fontWeight: '700',
    lineHeight: 60,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  orderIdWrap: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  orderIdLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  orderIdValue: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.text,
  },

  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  tertiaryBtn: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  tertiaryBtnText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },

})

export default styles
