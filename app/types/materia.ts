import type { YarnInfo } from "./yarrns.type";

export type MaterialImport = {
  _id: string;
  yarnId: string;
  quantity: number;
  price: number;
  supplier: string;
  createdAt: string;
  yarn: YarnInfo;  
};