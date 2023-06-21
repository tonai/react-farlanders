export enum Resource {
  Electronic = "electronics",
  Food = "food",
  House = "house",
  Glass = "glass",
  Power = "power",
  Money = "money",
  RefinedMetal = "refined-metal",
  Spices = "spices",
  TerraTech = "terra-tech",
  Water = "water",
}

export enum Storage {
  Food = "food",
  Glass = "glass",
  House = "house",
  Power = "power",
  RefinedMetal = "refined-metal",
  Water = "water",
}

export enum Consumption {
  Power = "power",
  Spices = "spices",
  Water = "water",
  Worker = "worker",
}

export enum Cost {
  Electronic = "electronics",
  Glass = "glass",
  RefinedMetal = "refined-metal",
  Spices = "spices",
  TerraTech = "terra-tech",
}

export type IResources = Record<Resource, number>;
export type IStorages = Record<Storage, number>;
export type IConsumptions = Record<Consumption, number>;
export type ICosts = Record<Cost, number>;
