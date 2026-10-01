import Marquee from '../components/Marquee'

const ITEMS = [
  'Expert Help', 'Custom Solutions', 'Custom Creations', 'Easy Swatching', 'Handpicked Fabrics', 'Reliable Delivery',
]

export default function BrandStatement() {
  return <Marquee items={ITEMS} variant="coral" />
}
