import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import FunnelView from '../views/FunnelView.vue'
import VideoView from '../views/VideoView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import LegalNoticeView from '../views/LegalNoticeView.vue'
import BookingView from '../views/BookingView.vue'
import BookedView from '../views/BookedView.vue'
import NoSpaceView from '../views/NoSpaceView.vue'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description: string
    canonical: string
    ogTitle: string
    ogDescription: string
    ogUrl: string
    jsonLd?: object[]
  }
}

// ── Router ─────────────────────────────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
  routes: [
    {
      path: '/',
      alias: '/registro-vsl-tr',
      name: 'funnel',
      component: FunnelView,
      meta: {
        title: 'Bakano | Sistema de Ventas Automáticas 24/7 — Inversión desde $800',
        description:
          'Convertimos cada conversación de tu negocio en ventas automáticas con un sistema web que trabaja 24/7. Inversión desde $800. Cupos limitados.',
        canonical: 'https://mkt.bakano.ec/registro-vsl-tr',
        ogTitle: 'Bakano | Sistema de Ventas Automáticas 24/7',
        ogDescription:
          'Sistema web de ventas automatizadas para negocios establecidos. Automatiza tus conversaciones y convierte en ingresos predecibles sin depender de viralidad.',
        ogUrl: 'https://mkt.bakano.ec/registro-vsl-tr',
      } satisfies RouteMeta,
    },
    {
      path: '/ver-video',
      name: 'video',
      component: VideoView,
      meta: {
        title: 'Mira el video | Bakano — Paso 1 de 2',
        description: 'Ve el video completo y descubre cómo automatizar tus conversaciones en ventas 24/7 con nuestro sistema web. Inversión desde $800.',
        canonical: 'https://bakano.ec/ver-video',
        ogTitle: 'Mira el video | Bakano — Sistema de Ventas',
        ogDescription: 'Ve el video y descubre el sistema de ventas automatizadas de Bakano. Inversión desde $800.',
        ogUrl: 'https://bakano.ec/ver-video',
      } satisfies RouteMeta,
    },
    {
      path: '/agendar',
      name: 'booking',
      component: BookingView,
      meta: {
        title: 'Agenda tu Implementación | Bakano — Paso 2 de 2',
        description: 'Selecciona el día y hora para iniciar tu sistema de ventas automatizadas con el equipo de Bakano.',
        canonical: 'https://bakano.ec/agendar',
        ogTitle: 'Agenda tu Implementación | Bakano',
        ogDescription: 'Elige tu horario y reserva tu implementación del sistema de ventas con Bakano.',
        ogUrl: 'https://bakano.ec/agendar',
      } satisfies RouteMeta,
    },
    {
      path: '/cita-confirmada',
      name: 'booked',
      component: BookedView,
      meta: {
        title: 'Implementación Confirmada | Bakano',
        description: 'Tu sistema de ventas automatizadas con Bakano está confirmado. Revisa tu correo y prepárate.',
        canonical: 'https://bakano.ec/cita-confirmada',
        ogTitle: 'Implementación Confirmada | Bakano',
        ogDescription: 'Tu sistema de ventas con Bakano está reservado. Te contactaremos pronto.',
        ogUrl: 'https://bakano.ec/cita-confirmada',
      } satisfies RouteMeta,
    },
    {
      path: '/sin-espacio',
      name: 'no-space',
      component: NoSpaceView,
      meta: {
        title: 'No Cumples Requisitos | Bakano',
        description: 'Nuestro sistema de ventas automatizadas requiere $5k+ de facturación y $800+ de inversión.',
        canonical: 'https://bakano.ec/sin-espacio',
        ogTitle: 'No Cumples Requisitos | Bakano',
        ogDescription: 'Requisitos mínimos: $5k/mes facturación y $800 de inversión para nuestro sistema de ventas.',
        ogUrl: 'https://bakano.ec/sin-espacio',
      } satisfies RouteMeta,
    },
    {
      path: '/politicas-privacidad',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
      meta: {
        title: 'Política de Privacidad | Bakano Ecuador',
        description: 'Política de privacidad de Bakano. Información sobre el tratamiento de datos personales conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.',
        canonical: 'https://bakano.ec/politicas-privacidad',
        ogTitle: 'Política de Privacidad | Bakano Ecuador',
        ogDescription: 'Política de privacidad de Bakano Ecuador.',
        ogUrl: 'https://bakano.ec/politicas-privacidad',
      } satisfies RouteMeta,
    },
    {
      path: '/aviso-legal',
      name: 'legal-notice',
      component: LegalNoticeView,
      meta: {
        title: 'Aviso Legal | Bakano Ecuador',
        description: 'Aviso legal de Bakano Ecuador. Términos y condiciones de uso del sitio web bakano.ec.',
        canonical: 'https://bakano.ec/aviso-legal',
        ogTitle: 'Aviso Legal | Bakano Ecuador',
        ogDescription: 'Aviso legal de Bakano Ecuador.',
        ogUrl: 'https://bakano.ec/aviso-legal',
      } satisfies RouteMeta,
    },
  ],
})

// ── SEO dinámico por ruta ──────────────────────────────────────────────────────
const setMeta = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
  el.content = content
}

const setOgMeta = (property: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
  el.content = content
}

const setCanonical = (href: string) => {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
  el.href = href
}

router.afterEach((to) => {
  const meta = to.meta
  document.title = meta.title ?? 'Bakano'
  setMeta('description', meta.description ?? '')
  setOgMeta('og:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('og:description', meta.ogDescription ?? meta.description ?? '')
  setOgMeta('og:url', meta.ogUrl ?? '')
  setOgMeta('twitter:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('twitter:description', meta.ogDescription ?? meta.description ?? '')
  setCanonical(meta.canonical ?? '')
})

export default router
