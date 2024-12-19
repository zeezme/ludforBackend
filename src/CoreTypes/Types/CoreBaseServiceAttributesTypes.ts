export interface CoreBaseServiceStoreAttributesTypes<T = any> {
  userId?: string
  userName?: string
  data: T
}

export interface CoreBaseServiceUpdateAttributesTypes<T = any> {
  userId?: string
  userName?: string
  id: string
  data: T
}

export interface CoreBaseServiceDeleteAttributesTypes {
  userId?: string
  userName?: string
  id: string
}
