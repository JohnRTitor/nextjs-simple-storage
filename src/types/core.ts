export interface AddPersonParams {
  name: string;
  favoriteNumber: number;
}
export interface StoreGlobalFavoriteNumberParams {
  favoriteNumber: number;
}

export type FavoriteNumber = bigint;
export type PersonName = string;
export type PersonTuple = [FavoriteNumber, PersonName];
