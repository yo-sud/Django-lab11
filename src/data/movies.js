// Datos crudos de la cartelera.
// La aplicación no consume este formato directamente: App los pasa por
// `adaptMovie` para convertirlos al modelo de la vista.
export const movies = [
  {
    id: 1,
    title: 'Dune: Parte Dos',
    poster: '/posters/dune-parte-dos.jpg',
    synopsis:
      'Paul Atreides se une a los fremen de Arrakis para librar una guerra por el control del planeta y el futuro del universo.',
    classification: 'PG-13',
    rating: 8.4,
    schedules: ['13:00', '16:30', '19:45', '22:15'],
  },
  {
    id: 2,
    title: 'Oppenheimer',
    poster: '/posters/oppenheimer.jpg',
    synopsis:
      'La historia de J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial.',
    classification: 'R',
    rating: 8.5,
    schedules: ['12:45', '15:15', '18:00', '20:30'],
  },
  {
    id: 3,
    title: 'Spider-Man: Across the Spider-Verse',
    poster: '/posters/spider-man-across-the-spider-verse.jpg',
    synopsis:
      'Miles Morales viaja a través del multiverso y se reúne con Spider-Personas para enfrentar una nueva amenaza.',
    classification: 'PG',
    rating: 8.7,
    schedules: ['11:00', '14:20', '17:00', '21:00'],
  },
  {
    id: 4,
    title: 'Poor Things',
    poster: '/posters/poor-things.jpg',
    synopsis:
      'La historia de Bella Baxter, una mujer traída de vuelta a la vida por un científico poco convencional.',
    classification: 'R',
    rating: 7.9,
    schedules: ['12:00', '15:30', '19:00', '22:00'],
  },
  {
    id: 5,
    title: 'The Marvels',
    poster: '/posters/the-marvels.jpg',
    synopsis:
      'Carol Danvers, Kamala Khan y Monica Rambeau se unen cuando sus poderes se entrelazan inesperadamente.',
    classification: 'PG-13',
    rating: 6.2,
    schedules: ['10:30', '13:30', '16:45', '20:00'],
  },
  {
    id: 6,
    title: 'Barbie',
    poster: '/posters/barbie.jpg',
    synopsis:
      'Barbie y Ken viven en Barbie Land, un lugar perfecto, hasta que un viaje al mundo real los cambia todo.',
    classification: 'PG-13',
    rating: 7.0,
    schedules: ['11:30', '14:00', '17:30', '20:30'],
  },
  {
    id: 7,
    title: 'John Wick 4',
    poster: '/posters/john-wick-4.jpg',
    synopsis:
      'John Wick continúa su lucha contra la Alta Mesa mientras nuevos enemigos aparecen en su camino.',
    classification: 'R',
    rating: 7.8,
    schedules: ['12:15', '15:45', '19:15', '22:30'],
  },
  {
    id: 8,
    title: 'Elemental',
    poster: '/posters/elemental.jpg',
    synopsis:
      'En una ciudad donde el fuego, el agua, el aire y la tierra conviven, una joven fogosa y un tipo acuático descubren algo en común.',
    classification: 'PG',
    rating: 7.1,
    schedules: ['10:00', '12:30', '15:00', '18:30'],
  },
]
