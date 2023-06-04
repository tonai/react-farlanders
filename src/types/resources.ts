export enum Resource {
  Money = "money",
  TerraTech = "terra-tech",
  Spices = "spices",
  Electronic = "electronics",
  Power = "power",
  Water = "water",
  Food = "food",
  RefinedMetal = "refined-metal",
  Glass = "glass",
}

export enum Storage {
  Power = "power",
  Water = "water",
  Food = "food",
  RefinedMetal = "refined-metal",
  Glass = "glass",
}

export type IResources = Record<Resource, number>;
export type IStorages = Record<Storage, number>;
