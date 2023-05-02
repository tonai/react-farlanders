export interface IBlock {
  id: string;
  images: string;
  variants?: Record<string, string>;
  sid: number;
}

export type IBlocks = IBlock[];
export type IBlockMap = Map<IBlock['sid'], IBlock>;
