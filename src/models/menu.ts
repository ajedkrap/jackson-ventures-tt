export interface IRestaurant {
  id: string
  name: string
  table_id: string
}

export interface ICategory {
  id: number
  name: string
  sort_order: number
}

export interface ICustomizationOption {
  id: number
  name: string
  price_modifier: number
}

export interface ICustomizationGroup {
  id: number
  name: string
  required: boolean
  max_selections: number
  options: ICustomizationOption[]
}

export interface IMenuItem {
  id: number
  name: string
  description: string
  price: number
  category_id: number
  image_url: string | null
  customization_groups: ICustomizationGroup[]
}

export interface IMenuResponse {
  restaurant: IRestaurant
  categories: ICategory[]
  items: IMenuItem[]
}
