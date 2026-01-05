export interface Product {
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
}

export const PRODUCT_DATA: Product[] = [
  { 
    name: "Len Mềm Mịn", 
    slug: "len-mem-min",
    price: 100000, 
    image: "image.png", 
    description: "Len mềm mại, thích hợp cho mùa đông ấm áp." 
  },
  { 
    name: "Len Sợi Dài", 
    slug: "len-soi-dai",
    price: 120000, 
    image: "image.png", 
    description: "Sợi dài, dễ dệt, phù hợp làm khăn, áo len." 
  },
  { 
    name: "Len Hữu Cơ", 
    slug: "len-huu-co",
    price: 150000, 
    image: "image.png", 
    description: "Len hữu cơ, an toàn cho da nhạy cảm." 
  },
  { 
    name: "Len Cotton Cao Cấp", 
    slug: "len-cotton-cao-cap",
    price: 130000, 
    image: "image.png", 
    description: "Len cotton mềm, bền màu, thoáng khí." 
  },
  { 
    name: "Len Lông Cừu", 
    slug: "len-long-cuu",
    price: 180000, 
    image: "image.png", 
    description: "Len lông cừu cao cấp, giữ ấm tốt." 
  },
  { 
    name: "Len Pha Trộn", 
    slug: "len-pha-tron",
    price: 110000, 
    image: "image.png", 
    description: "Len pha trộn nhiều loại sợi, màu sắc đẹp mắt." 
  },
];
