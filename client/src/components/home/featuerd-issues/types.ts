export interface CardData {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  date: string;
  pages: number;
  category: string;
}

export interface OptimizedCardProps extends CardData {
  onClick?: (card: CardData) => void;
  priority?: boolean;
}
