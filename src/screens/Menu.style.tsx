import { StyleSheet } from 'react-native'

import { Colors, Spacing, FontSize, Radius } from '@/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  chipsList: { flexGrow: 0 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.background,
  },
  errorTitle: {
    fontSize: FontSize.lg,
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
  headerCartBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  headerCartText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  chipsRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.textInverse,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  sectionHeader: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  sectionHeaderText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  itemRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.background,
  },
  itemTextCol: {
    flex: 1,
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  itemName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  itemDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  itemPrice: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  itemImageWrap: {
    width: 72,
    height: 72,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceMuted,
  },
  itemImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImagePlaceholderText: {
    fontSize: FontSize.xl,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    padding: Spacing.xl,
    color: Colors.textMuted,
  },
  searchWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  searchClearBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  searchClearText: {
    fontSize: FontSize.xl,
    color: Colors.textMuted,
    lineHeight: FontSize.xl,
  },
  searchEmpty: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
  },
  searchEmptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  searchEmptyBody: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
})

export default styles
