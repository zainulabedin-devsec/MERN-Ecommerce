import SportsTshirt from '../../assets/SportsTshirt.jpg'
import Jeans from '../../assets/Jeans.jpg'
import FormalShirt from'../../assets/FormalShirt.jpg'
import SummerDress from '../../assets/SummerDress.jpg'
import HandBag from '../../assets/HandBag.jpg'
import HighHeels from '../../assets/HighHeels.jpg'
import KidsSneakers from '../../assets/KidsSneakers.jpg'
import CartoonShirt from '../../assets/CartoonShirt.jpg'
import ToyCar from '../../assets/ToyCar.jpg'
import SchoolBag from '../../assets/SchoolBag.jpg'
import EveningGown from '../../assets/EveningGown.jpg'
import LeatherJacket from '../../assets/LeatherJacket.jpg'


const ProductList = [
  {
    id: 1,
    name: "Sports T-Shirt",
    price: 10,
    oldPrice: 15,
    onSale: true,
    newArrival: false,
    category: "Men",
    image : SportsTshirt
  },
  {
    id: 2,
    name: "Casual Jeans",
    price: 25,
    oldPrice: 30,
    onSale: true,
    newArrival: false,
    category: "Men",
    image:Jeans
  },
  {
    id: 3,
    name: "Formal Shirt",
    price: 20,
    oldPrice: 20,
    onSale: false,
    newArrival: true,
    category: "Men",
    image: FormalShirt
  },
  {
    id: 4,
    name: "Summer Dress",
    price: 30,
    oldPrice: 40,
    onSale: true,
    newArrival: false,
    category: "Women",
    image: SummerDress
  },
  {
    id: 5,
    name: "Handbag",
    price: 50,
    oldPrice:55,
    onSale: false,
    newArrival: true,
    category: "Women",
    image: HandBag
  },
  {
    id: 6,
    name: "High Heels",
    price: 45,
    oldPrice: 60,
    onSale: true,
    newArrival: false,
    category: "Women",
    image: HighHeels
  },
  {
    id: 7,
    name: "Kids Sneakers",
    price: 15,
    oldPrice: 20,
    onSale: true,
    newArrival: false,
    category: "Kids",
    image: KidsSneakers
  },
  {
    id: 8,
    name: "Cartoon T-Shirt",
    price:12,
    oldPrice: 12,
    onSale: false,
    newArrival: true,
    category: "Kids",
    image: CartoonShirt
  },
  {
    id: 9,
    name: "Toy Car",
    price: 8,
    oldPrice: 10,
    onSale: true,
    newArrival: false,
    category: "Kids",
    image: ToyCar
  },
  {
    id: 10,
    name: "School Backpack",
    price: 18,
    oldPrice: 25,
    onSale: true,
    newArrival: false,
    category: "Kids",
    image: SchoolBag
  },
  {
    id: 11,
    name: "Leather Jacket",
    price: 70,
    oldPrice: 90,
    onSale: true,
    newArrival: false,
    category: "Men",
    image: LeatherJacket
  },
  {
    id: 12,
    name: "Evening Gown",
    price: 85,
    oldPrice: 100,
    onSale: false,
    newArrival: true,
    category: "Women",
    image: EveningGown
  }
];

export default ProductList