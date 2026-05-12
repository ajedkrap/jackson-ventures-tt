import { StyleSheet } from 'react-native'

import { Colors, Spacing, FontSize, Radius } from '@/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  errorTitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.text,
  },
  errorBody: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  retryText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  orderIdLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  orderIdValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  etaWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  etaLabel: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  etaValue: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  timeline: {
    paddingHorizontal: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 64,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 32,
    marginRight: Spacing.md,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  stepCheck: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textInverse,
  },
  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  stepTextCol: {
    flex: 1,
    paddingTop: 2,
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  stepLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  stepLabelActive: {
    color: Colors.primary,
  },
  stepLabelFuture: {
    color: Colors.textMuted,
    fontWeight: '500',
  },
  stepDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radius.md,
    gap: Spacing.md,
  },
  bannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  bannerRetry: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
})

export default styles
