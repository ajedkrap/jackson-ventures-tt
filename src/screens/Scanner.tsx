import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera'
import { useRef, useState } from 'react'
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

    Alert.alert('Invalid QR code', 'This QR is not from an IPOT table. Please scan a table QR.', [
      {
        text: 'Try again',
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
      setManualError('Use letters, numbers, dashes or underscores only.')
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
          <Text style={styles.modalTitle}>Enter table ID</Text>
          <Text style={styles.modalBody}>Find the ID printed on your table (e.g. T001).</Text>
          <TextInput
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
            <TouchableOpacity onPress={() => setManualOpen(false)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={submitManualEntry} style={styles.modalPrimaryBtn}>
              <Text style={styles.modalPrimaryText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.body}>Loading camera…</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.body}>We use your camera to scan table QR codes.</Text>
        {permission.canAskAgain ? (
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Grant access</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={() => Linking.openSettings()}>
            <Text style={styles.primaryButtonText}>Open settings</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={openManualEntry}>
          <Text style={styles.linkButton}>Enter table ID manually</Text>
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
          <Text style={styles.hint}>Point at the table's QR code</Text>
        </View>
        <View style={styles.frameWrap}>
          <View style={styles.frame} />
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={openManualEntry}>
            <Text style={styles.linkButtonLight}>Enter table ID manually</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {renderManualEntryModal()}
    </View>
  )
}

export default Scanner
