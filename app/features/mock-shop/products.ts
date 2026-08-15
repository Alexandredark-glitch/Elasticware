export type Product = {
  id: string;
  name: string;
  price: number;
  blurb: string;
  image: string;
  tag?: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Ringmaster Leather Boots",
    price: 189,
    blurb: "Hand-stitched, circus-grade leather boots that command any room.",
    image:
      "https://images.pexels.com/photos/27521050/pexels-photo-27521050.png?auto=compress&cs=tinysrgb&h=650&w=940",
    tag: "Bestseller",
  },
  {
    id: "p2",
    name: "Sawdust Ceramic Mug",
    price: 24,
    blurb: "Wheel-thrown stoneware mug, glazed in a warm speckled cream.",
    image:
      "https://images.pexels.com/photos/18273384/pexels-photo-18273384.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    tag: "New",
  },
  {
    id: "p3",
    name: "Canvas Tent Tote",
    price: 38,
    blurb: "Heavyweight organic cotton tote — big enough for the whole act.",
    image:
      "https://images.pexels.com/photos/1214212/pexels-photo-1214212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: "p4",
    name: "Spotlight Soy Candle",
    price: 22,
    blurb: "Hand-poured soy wax with notes of cedar, orange peel, and applause.",
    image:
      "https://images.pexels.com/photos/13044762/pexels-photo-13044762.png?auto=compress&cs=tinysrgb&h=650&w=940",
    tag: "Limited",
  },
  {
    id: "p5",
    name: "Big-Top Linen Scarf",
    price: 46,
    blurb: "Featherweight linen scarf in a stripe that echoes the tent canopy.",
    image:
      "https://images.pexels.com/photos/19087201/pexels-photo-19087201.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: "p6",
    name: "High-Wire Heel",
    price: 165,
    blurb: "Suede-cuffed leather heels, balanced for the daring walk. Waiting for you ladies.",
    image:
      "https://images.pexels.com/photos/27256471/pexels-photo-27256471.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
];
