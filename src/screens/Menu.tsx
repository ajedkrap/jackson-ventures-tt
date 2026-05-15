import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  type SectionListData,
  ListRenderItem,
  Keyboard,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import styles from './Menu.style'

import HeaderCart from '@/components/HeaderCart'
import type { ICategory, IMenuItem } from '@/models/menu'
import { TAppStackParamList } from '@/navigation/types'
import { useMenuStore } from '@/state/menuStore'
import { Colors } from '@/theme'

type TMenuProps = NativeStackScreenProps<TAppStackParamList, 'Menu'>
type TMenuSectionData = SectionListData<IMenuItem, { category: ICategory }>

const formatPrice = (n: number) => `$${n.toFixed(2)}`

const Menu: React.FC<TMenuProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { tableId } = route.params
  const { menu, loading, error, fetchMenu } = useMenuStore()
  const sectionListRef = useRef<SectionList<IMenuItem, { category: ICategory }>>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMenu(tableId)
  }, [tableId, fetchMenu])

  const handleOpenCart = useCallback(() => navigation.navigate('Cart'), [navigation])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: menu?.restaurant.name ?? t('menu.title'),
      headerRight: () => <HeaderCart onPress={handleOpenCart} />,
    })
  }, [menu, navigation, handleOpenCart, t])

  const sections = useMemo<TMenuSectionData[]>(() => {
    if (!menu) return []
    return [...menu.categories]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => ({
        category,
        data: menu.items.filter((i) => i.category_id === category.id),
      }))
  }, [menu])

  useEffect(() => {
    if (sections.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(sections[0].category.id)
    }
  }, [sections, activeCategoryId])

  const trimmedQuery = searchQuery.trim().toLowerCase()
  const filteredItems = useMemo(() => {
    if (!menu || trimmedQuery.length === 0) return null
    return menu.items.filter(
      (i) =>
        i.name.toLowerCase().includes(trimmedQuery) ||
        i.description.toLowerCase().includes(trimmedQuery)
    )
  }, [menu, trimmedQuery])
  const isSearching = filteredItems !== null

  const handleChipPress = (categoryId: number, index: number) => {
    setActiveCategoryId(categoryId)
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      viewOffset: 0,
      animated: true,
    })
  }

  const renderItemRow: ListRenderItem<IMenuItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRow}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
      accessibilityRole="button"
      accessibilityLabel={t('menu.a11y.itemRow', {
        name: item.name,
        price: formatPrice(item.price),
      })}
    >
      <View style={styles.itemTextCol}>
        <Text style={styles.itemName}>{item.name}</Text>
        {!!item.description && (
          <Text style={styles.itemDesc} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
      </View>
      <View style={styles.itemImageWrap}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.itemImage} />
        ) : (
          <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
            <Text style={styles.itemImagePlaceholderText}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  if (loading && !menu) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (error && !menu) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>{t('menu.errorTitle')}</Text>
        <Text style={styles.errorBody}>{error.message}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => fetchMenu(tableId)}
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!menu) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorBody}>{t('menu.noMenuData')}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchWrap}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('menu.searchPlaceholder')}
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel={t('menu.searchPlaceholder')}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.searchClearBtn}
            accessibilityRole="button"
            accessibilityLabel={t('menu.a11y.clearSearch')}
          >
            <Text style={styles.searchClearText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isSearching && (
        <FlatList
          horizontal
          style={styles.chipsList}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          data={sections.map((s, idx) => ({ category: s.category, index: idx }))}
          keyExtractor={(c) => String(c.category.id)}
          renderItem={({ item }) => {
            const active = item.category.id === activeCategoryId
            return (
              <TouchableOpacity
                onPress={() => handleChipPress(item.category.id, item.index)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t('menu.a11y.category', { name: item.category.name })}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.category.name}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      )}

      {isSearching ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItemRow}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.searchEmpty}>
              <Text style={styles.searchEmptyTitle}>{t('menu.noMatches')}</Text>
              <Text style={styles.searchEmptyBody}>
                {t('menu.noMatchesBody', { query: searchQuery.trim() })}
              </Text>
            </View>
          }
          onScrollBeginDrag={Keyboard.dismiss}
        />
      ) : (
        <SectionList
          ref={sectionListRef}
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section }: { section: TMenuSectionData }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.category.name}</Text>
            </View>
          )}
          renderItem={renderItemRow}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={styles.emptyText}>{t('menu.noItems')}</Text>}
        />
      )}
    </SafeAreaView>
  )
}

export default Menu
