import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import styles from './Scanner.style'

import { TAppStackParamList } from '@/navigation/types'
import { parseTableQr } from '@/utils/qr'

type TScannerProps = NativeStackScreenProps<TAppStackParamList, 'Scanner'>

const Scanner: React.FC<TScannerProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const [permission, requestPermission] = useCameraPermissions()
  const [manualOpen, setManualOpen] = useState(false)
  const [manualInput, setManualInput] = useState('')
  const [manualError, setManualError] = useState<string | null>(null)
  const scannedRef = useRef(false)

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scannedRef.current) return
    scannedRef.current = true

    const tableId = parseTableQr(data)
    if (tableId) {
      navigation.replace('Menu', { tableId })
      return
    }

    Alert.alert(t('scanner.invalidQrTitle'), t('scanner.invalidQrBody'), [
      {
        text: t('common.tryAgain'),
        onPress: () => {
          scannedRef.current = false
        },
      },
    ])
  }

  const openManualEntry = () => {
    setManualInput('')
    setManualError(null)
    setManualOpen(true)
  }

  const submitManualEntry = () => {
    const tableId = parseTableQr(`ipot://table/${manualInput.trim()}`)
    if (!tableId) {
      setManualError(t('scanner.modalInputError'))
      return
    }
    setManualOpen(false)
    navigation.replace('Menu', { tableId })
  }

  const renderManualEntryModal = () => (
    <Modal
      visible={manualOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setManualOpen(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalBackdrop}
      >
        <Pressable style={styles.modalBackdropPress} onPress={() => setManualOpen(false)} />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{t('scanner.modalTitle')}</Text>
          <Text style={styles.modalBody}>{t('scanner.modalBody')}</Text>
          <TextInput
            accessibilityLabel={t('scanner.a11y.tableIdInput')}
            value={manualInput}
            onChangeText={(v) => {
              setManualInput(v)
              if (manualError) setManualError(null)
            }}
            placeholder="T001"
            placeholderTextColor="#9AA0A6"
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
            style={[styles.modalInput, manualError && styles.modalInputError]}
            onSubmitEditing={submitManualEntry}
            returnKeyType="go"
          />
          {manualError && <Text style={styles.modalErrorText}>{manualError}</Text>}
          <View style={styles.modalActions}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setManualOpen(false)}
              style={styles.modalSecondaryBtn}
            >
              <Text style={styles.modalSecondaryText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={submitManualEntry}
              style={styles.modalPrimaryBtn}
            >
              <Text style={styles.modalPrimaryText}>{t('scanner.continue')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.body}>{t('scanner.loadingCamera')}</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.title}>{t('scanner.permissionTitle')}</Text>
        <Text style={styles.body}>{t('scanner.permissionBody')}</Text>
        {permission.canAskAgain ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={requestPermission}
            accessibilityRole="button"
            accessibilityLabel={t('scanner.a11y.grantAccess')}
          >
            <Text style={styles.primaryButtonText}>{t('scanner.grantAccess')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => Linking.openSettings()}
            accessibilityRole="link"
            accessibilityLabel={t('scanner.a11y.openSettings')}
          >
            <Text style={styles.primaryButtonText}>{t('scanner.openSettings')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={openManualEntry}
          accessibilityRole="button"
          accessibilityLabel={t('scanner.manualEntry')}
        >
          <Text style={styles.linkButton}>{t('scanner.manualEntry')}</Text>
        </TouchableOpacity>
        {renderManualEntryModal()}
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Text style={styles.hint}>{t('scanner.hint')}</Text>
        </View>
        <View style={styles.frameWrap}>
          <View style={styles.frame} />
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity
            onPress={openManualEntry}
            accessibilityRole="button"
            accessibilityLabel={t('scanner.manualEntry')}
          >
            <Text style={styles.linkButtonLight}>{t('scanner.manualEntry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {renderManualEntryModal()}
    </View>
  )
}

export default Scanner
