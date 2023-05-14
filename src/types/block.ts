export interface IBlock {
  id: string;
  images: string;
  sid: number;
  variants?: Record<string, string>;
}

export type IBlocks = IBlock[];
export type IBlockMap = Map<IBlock["sid"], IBlock>;
