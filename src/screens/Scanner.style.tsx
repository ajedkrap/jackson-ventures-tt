import { StyleSheet } from 'react-native'

import { Colors, Spacing, Radius, FontSize } from '@/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xl,
    color: Colors.text,
    fontWeight: '600',
  },
  body: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  primaryButtonText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  linkButton: {
    color: Colors.primary,
    fontSize: FontSize.md,
    marginTop: Spacing.md,
  },
  linkButtonLight: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    textDecorationLine: 'underline',
  },

  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  hint: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  frameWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 260,
    height: 260,
    borderWidth: 2,
    borderColor: Colors.textInverse,
    borderRadius: Radius.lg,
  },
  bottomBar: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalBackdropPress: { ...StyleSheet.absoluteFillObject },
  modalCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  modalBody: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  modalInputError: {
    borderColor: Colors.error,
  },
  modalErrorText: {
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  modalSecondaryBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  modalSecondaryText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  modalPrimaryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  modalPrimaryText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
})

export default styles
