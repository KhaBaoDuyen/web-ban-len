export type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  onAdd?: () => void;
};