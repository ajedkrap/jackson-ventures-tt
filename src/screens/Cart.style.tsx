import { StyleSheet } from 'react-native'

import { Colors, Spacing, FontSize, Radius } from '@/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.background,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyBody: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  primaryBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  headerBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  headerBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  listContent: {
    paddingTop: Spacing.sm,
  },
  lineRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  lineMain: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  lineTextCol: {
    flex: 1,
    gap: Spacing.xs,
  },
  lineName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  lineOptions: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  removeBtnText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    lineHeight: FontSize.lg,
  },
  lineFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  qtyValue: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  lineSubtotal: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.lg,
  },
  noteWrap: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  noteLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    minHeight: 88,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  totalValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  placeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  placeBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  placeBtnDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
})

export default styles
