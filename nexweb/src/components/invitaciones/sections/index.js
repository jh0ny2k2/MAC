import { Heart, CalendarDays, Clock, Camera, CheckSquare, Shirt, Gift, Music, MapPin, Bed, Users, MessageCircle, HelpCircle } from 'lucide-react'

import HeroSection from './HeroSection'
import StorySection from './StorySection'
import TimelineSection from './TimelineSection'
import EventsSection from './EventsSection'
import ScheduleSection from './ScheduleSection'
import GallerySection from './GallerySection'
import RsvpSection from './RsvpSection'
import DressCodeSection from './DressCodeSection'
import RegistrySection from './RegistrySection'
import MusicSection from './MusicSection'
import LocationSection from './LocationSection'
import AccommodationSection from './AccommodationSection'
import WeddingPartySection from './WeddingPartySection'
import GuestMessagesSection from './GuestMessagesSection'
import FaqSection from './FaqSection'
import ThankYouSection from './ThankYouSection'

export const SECTION_MAP = {
  hero: { Component: HeroSection, name: 'Portada', icon: Heart, defaultEnabled: true },
  story: { Component: StorySection, name: 'Nuestra Historia', icon: Heart, defaultEnabled: true },
  timeline: { Component: TimelineSection, name: 'Línea de Tiempo', icon: CalendarDays, defaultEnabled: false },
  events: { Component: EventsSection, name: 'Ceremonia & Recepción', icon: CalendarDays, defaultEnabled: true },
  schedule: { Component: ScheduleSection, name: 'Cronograma', icon: Clock, defaultEnabled: false },
  gallery: { Component: GallerySection, name: 'Galería', icon: Camera, defaultEnabled: true },
  rsvp: { Component: RsvpSection, name: 'Confirmación', icon: CheckSquare, defaultEnabled: true },
  dresscode: { Component: DressCodeSection, name: 'Código de Vestimenta', icon: Shirt, defaultEnabled: true },
  registry: { Component: RegistrySection, name: 'Mesa de Regalos', icon: Gift, defaultEnabled: true },
  music: { Component: MusicSection, name: 'Nuestra Canción', icon: Music, defaultEnabled: true },
  location: { Component: LocationSection, name: 'Ubicación', icon: MapPin, defaultEnabled: true },
  accommodation: { Component: AccommodationSection, name: 'Hospedaje', icon: Bed, defaultEnabled: false },
  weddingParty: { Component: WeddingPartySection, name: 'Cortejo', icon: Users, defaultEnabled: false },
  guestMessages: { Component: GuestMessagesSection, name: 'Dedicatorias', icon: MessageCircle, defaultEnabled: false },
  faq: { Component: FaqSection, name: 'Preguntas Frecuentes', icon: HelpCircle, defaultEnabled: false },
  thankYou: { Component: ThankYouSection, name: 'Agradecimientos', icon: Heart, defaultEnabled: true },
}

export const DEFAULT_SECTIONS = Object.entries(SECTION_MAP)
  .filter(([, v]) => v.defaultEnabled)
  .map(([k]) => k)
