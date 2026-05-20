<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RegistrationModal from '@/components/RegistrationModal.vue'
import { captureFbParams } from '@/utils/fbclid'

const bakanoLogo = 'https://res.cloudinary.com/dpuody0df/image/upload/v1775587085/bakano/logos/bakano-light.png'
const luisPhoto = 'https://res.cloudinary.com/dpuody0df/image/upload/v1775587087/bakano/team/luis.webp'

const router = useRouter()
const modalOpen = ref(false)

const IS_DEV = window.location.hostname === 'localhost'

const openModal = () => {
  if (!IS_DEV) {
    const disqAt = localStorage.getItem('bk_disq_at')
    if (disqAt && Date.now() - Number(disqAt) < 24 * 60 * 60 * 1000) {
      router.push('/sin-espacio')
      return
    }
  }
  modalOpen.value = true
}

const stats = [
  {
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    number: '+25',
    text: 'negocios con su sistema de ventas automatizadas funcionando 24/7',
  },
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    number: '+$50K',
    text: 'USD en ventas automatizadas generadas para nuestros clientes',
  },
  {
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020.5 5.5V3.935',
    number: '4',
    text: 'países: Ecuador, Colombia, Estados Unidos y Singapur',
  },
]

const pillars = [
  'Diagnóstico de tu proceso de ventas',
  'Ingeniería y desarrollo de tu plataforma web',
  'Automatización y estandarización 24/7',
]

// Countdown urgency timer (24h rolling)
const hours = ref('23')
const minutes = ref('47')
const seconds = ref('12')

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  // Captura fbclid de la URL (llega cuando usuario hace click en anuncio Meta)
  captureFbParams()

  let total = 23 * 3600 + 47 * 60 + 12
  interval = setInterval(() => {
    total--
    if (total <= 0) total = 23 * 3600 + 59 * 60 + 59
    hours.value = String(Math.floor(total / 3600)).padStart(2, '0')
    minutes.value = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
    seconds.value = String(total % 60).padStart(2, '0')
  }, 1000)
})
</script>

<template>
  <div class="funnel">

    <!-- ══════════════════════════════════════════════
         TOP BAR — solo logo centrado
         ══════════════════════════════════════════════ -->
    <header class="funnel__topbar">
      <img :src="bakanoLogo" alt="Bakano" class="funnel__logo" />
    </header>

    <!-- ══════════════════════════════════════════════
         URGENCY BANNER
         ══════════════════════════════════════════════ -->
    <div class="funnel__urgency" role="banner">
      <span class="funnel__urgency-dot" aria-hidden="true" />
      <span>Cupos limitados — próxima revisión en:</span>
      <div class="funnel__timer" aria-live="polite" aria-label="Tiempo restante">
        <span class="funnel__timer-block">
          <strong>{{ hours }}</strong>
          <small>h</small>
        </span>
        <span class="funnel__timer-sep" aria-hidden="true">:</span>
        <span class="funnel__timer-block">
          <strong>{{ minutes }}</strong>
          <small>m</small>
        </span>
        <span class="funnel__timer-sep" aria-hidden="true">:</span>
        <span class="funnel__timer-block">
          <strong>{{ seconds }}</strong>
          <small>s</small>
        </span>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════
         HERO — headline + VSL
         ══════════════════════════════════════════════ -->
    <section class="funnel__hero" aria-labelledby="funnel-headline">
      <div class="funnel__container">

        <!-- Eyebrow -->
        <p class="funnel__eyebrow">Metodología Data Growth Business™</p>

        <!-- Headline -->
        <h1 id="funnel-headline" class="funnel__headline">
          Convertimos cada conversación de tu negocio en
          <span class="funnel__headline-accent">ventas automáticas 24/7</span>
          con un sistema web que trabaja por ti
        </h1>

        <!-- Sub-pillars -->
        <ul class="funnel__pillars" role="list">
          <li v-for="p in pillars" :key="p" class="funnel__pillar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ p }}
          </li>
        </ul>

        <!-- VSL Frame -->
        <div class="funnel__vsl-wrap">
          <div class="funnel__vsl-glow" aria-hidden="true" />
          <div class="funnel__vsl" role="button" tabindex="0" aria-label="Ver video y registrarse" @click="openModal()" @keydown.enter="openModal()" @keydown.space.prevent="openModal()">
            <img
              src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/pEFChujwCCaMWBNbZYD1/media/698ba28538edf84b711ef48c.png"
              alt="Video — Metodología Data Growth Business"
              class="funnel__vsl-img"
              loading="eager"
            />
            <div class="funnel__vsl-overlay" aria-hidden="true">
              <div class="funnel__vsl-play">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA primary -->
        <div class="funnel__cta-wrap">
          <button class="funnel__cta-btn" @click="openModal()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
            </svg>
            QUIERO MI SISTEMA DE VENTAS ¡AHORA!
          </button>
          <p class="funnel__cta-sub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Inversión desde $800 · Resultados comprobados · Cupos limitados
          </p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         SOCIAL PROOF — stats
         ══════════════════════════════════════════════ -->
    <section class="funnel__stats" aria-label="Resultados comprobados">
      <div class="funnel__container">
        <p class="funnel__section-label">Resultados reales de clientes reales</p>
        <div class="funnel__stats-grid">
          <div v-for="stat in stats" :key="stat.number" class="funnel__stat">
            <div class="funnel__stat-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path :d="stat.icon"/>
              </svg>
            </div>
            <strong class="funnel__stat-number">{{ stat.number }}</strong>
            <p class="funnel__stat-text">{{ stat.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         AUTHORITY — Luis Reyes
         ══════════════════════════════════════════════ -->
    <section class="funnel__authority" aria-labelledby="authority-heading">
      <div class="funnel__container funnel__authority-inner">

        <!-- Foto -->
        <div class="funnel__authority-photo-wrap">
          <div class="funnel__authority-photo-glow" aria-hidden="true" />
          <img
            :src="luisPhoto"
            alt="Luis Reyes — Co-fundador y Gerente de Bakano"
            class="funnel__authority-photo"
            loading="lazy"
          />
          <div class="funnel__authority-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
            Fundador verificado
          </div>
        </div>

        <!-- Bio -->
        <div class="funnel__authority-bio">
          <p class="funnel__section-label">Conoce a tu mentor</p>
          <h2 id="authority-heading" class="funnel__authority-name">Luis Reyes</h2>
          <p class="funnel__authority-role">CEO & Co-fundador de Bakano</p>
          <p class="funnel__authority-desc">
            Luis Reyes ha dedicado su carrera a construir sistemas web de ventas automatizadas y modelos de negocio escalables con tecnología y datos,
            eliminando la fricción del proceso de compra para que los dueños de negocio dejen de perseguir clientes
            y empiecen a recibir notificaciones de ventas automáticas en <strong>Ecuador, Colombia, Estados Unidos y Singapur</strong>.
          </p>

          <ul class="funnel__authority-achievements" role="list">
            <li class="funnel__authority-achievement">
              <span class="funnel__achievement-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span>Ha ayudado a <strong>más de 25 negocios establecidos</strong> en Latinoamérica a automatizar sus ventas y escalar sus ingresos sin depender de viralidad</span>
            </li>
            <li class="funnel__authority-achievement">
              <span class="funnel__achievement-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span>Generó <strong>más de $50.000 USD en ventas</strong> para sus clientes con estrategia digital estructurada</span>
            </li>
            <li class="funnel__authority-achievement">
              <span class="funnel__achievement-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span>Metodología probada en <strong>Ecuador, Colombia, EE.UU. y Singapur</strong></span>
            </li>
          </ul>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         SECOND CTA — repetición para conversión
         ══════════════════════════════════════════════ -->
    <section class="funnel__second-cta" aria-label="Registro a la asesoría">
      <div class="funnel__container funnel__second-cta-inner">
        <div class="funnel__second-cta-glow" aria-hidden="true" />

        <img
          src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/pEFChujwCCaMWBNbZYD1/media/4173c290-13d1-4df9-a357-3a3abfd860be.png"
          alt="Bakano — Data Growth Business"
          class="funnel__second-cta-img"
          loading="lazy"
        />

        <h2 class="funnel__second-cta-title">
          ¿Listo para tener un<br>
          <span class="funnel__headline-accent">sistema de ventas 24/7?</span>
        </h2>
        <p class="funnel__second-cta-sub">
          Descubre nuestro sistema web de alto valor que automatiza tus conversaciones
          y las convierte en ventas predecibles todos los días.
        </p>

        <div class="funnel__cta-wrap">
          <button class="funnel__cta-btn funnel__cta-btn--large" @click="openModal()">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
            </svg>
            QUIERO MI SISTEMA DE VENTAS ¡AHORA!
          </button>
          <p class="funnel__cta-sub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Inversión desde $800 · Resultados comprobados · Cupos limitados
          </p>
        </div>
      </div>
    </section>

    <!-- ── Modal de registro ────────────────────────────────────────────────── -->
    <RegistrationModal :open="modalOpen" @close="modalOpen = false" />

    <!-- ══════════════════════════════════════════════
         FUNNEL FOOTER — legal minimalista
         ══════════════════════════════════════════════ -->
    <footer class="funnel__footer" aria-label="Pie de página">
      <div class="funnel__container">
        <img :src="bakanoLogo" alt="Bakano" class="funnel__footer-logo" />

        <nav class="funnel__footer-links" aria-label="Legal">
          <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
          <span aria-hidden="true">·</span>
          <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
        </nav>

        <p class="funnel__footer-copyright">
          Copyright <strong>NEGOCIOS DEL PACIFICO</strong> — Todos los derechos reservados
        </p>

        <p class="funnel__footer-disclaimer">
          Esta página web es operada y mantenida por <strong>Negocios del Pacifico</strong>.
          Somos una empresa de educación y capacitación en ventas y marketing. No vendemos
          una oportunidad de negocio, ni programas para "hacerse rico rápido". Los resultados
          varían y dependen del esfuerzo, tiempo y habilidad individuales.
          Este sitio <strong>NO</strong> está respaldado por Meta Platforms, Inc. ni forma parte de Facebook.
        </p>
      </div>
    </footer>

  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;
@use '@/styles/fonts.modules.scss' as fonts;

// ── Variables ────────────────────────────────────────────────────────────────
$dark: #0a0712;
$dark-card: #110e1a;
$border: rgba(255, 255, 255, 0.07);
$text-muted: rgba(255, 255, 255, 0.45);
$text-body: rgba(255, 255, 255, 0.72);

// ── Base ─────────────────────────────────────────────────────────────────────
.funnel {
  background: $dark;
  color: colors.$white;
  min-height: 100vh;
}

// ── Container ────────────────────────────────────────────────────────────────
.funnel__container {
  max-width: 860px;
  margin-inline: auto;
  padding-inline: 24px;

  @media (max-width: 600px) {
    padding-inline: 16px;
  }
}

// ── Top bar ──────────────────────────────────────────────────────────────────
.funnel__topbar {
  display: flex;
  justify-content: center;
  padding: 20px 24px;
  border-bottom: 1px solid $border;
  background: rgba($dark, 0.95);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.funnel__logo {
  height: 28px;
  width: auto;
}

// ── Urgency banner ───────────────────────────────────────────────────────────
.funnel__urgency {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 16px;
  background: linear-gradient(135deg,
    rgba(colors.$BAKANO-PINK, 0.18) 0%,
    rgba(colors.$BAKANO-PURPLE, 0.12) 100%);
  border-bottom: 1px solid rgba(colors.$BAKANO-PINK, 0.2);
  font-family: fonts.$font-interface;
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  flex-wrap: wrap;
  text-align: center;
}

.funnel__urgency-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: colors.$BAKANO-PINK;
  animation: pulse-dot 1.5s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.75); }
}

.funnel__timer {
  display: flex;
  align-items: center;
  gap: 4px;
}

.funnel__timer-block {
  display: flex;
  align-items: baseline;
  gap: 2px;

  strong {
    font-family: fonts.$font-accent;
    font-size: 1rem;
    font-weight: 700;
    color: colors.$BAKANO-PINK;
    min-width: 1.8ch;
    text-align: center;
  }

  small {
    font-size: 0.65rem;
    color: $text-muted;
  }
}

.funnel__timer-sep {
  color: colors.$BAKANO-PINK;
  font-weight: 700;
  margin-bottom: 2px;
}

// ── Hero ─────────────────────────────────────────────────────────────────────
.funnel__hero {
  padding: 72px 0 64px;
  text-align: center;
  position: relative;

  @media (max-width: 600px) {
    padding: 48px 0 40px;
  }
}

.funnel__eyebrow {
  font-family: fonts.$font-accent;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: colors.$BAKANO-PINK;
  margin: 0 0 20px;
}

.funnel__headline {
  font-family: fonts.$font-principal;
  font-size: clamp(1.9rem, 4.5vw, 3rem);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.02em;
  color: colors.$white;
  margin: 0 0 32px;

  @media (max-width: 600px) {
    font-size: clamp(1.6rem, 6vw, 2.2rem);
  }
}

.funnel__headline-accent {
  background: linear-gradient(110deg, colors.$BAKANO-PINK 0%, colors.$BAKANO-PURPLE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.funnel__pillars {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 20px;
  list-style: none;
  padding: 0;
  margin: 0 0 48px;
}

.funnel__pillar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: fonts.$font-interface;
  font-size: 0.82rem;
  font-weight: 500;
  color: $text-body;

  svg {
    color: colors.$BAKANO-GREEN;
    flex-shrink: 0;
  }
}

// ── VSL ──────────────────────────────────────────────────────────────────────
.funnel__vsl-wrap {
  position: relative;
  margin-bottom: 48px;
}

.funnel__vsl-glow {
  position: absolute;
  inset: -40px;
  background: radial-gradient(ellipse 70% 60% at 50% 50%,
    rgba(colors.$BAKANO-PINK, 0.12) 0%,
    rgba(colors.$BAKANO-PURPLE, 0.07) 50%,
    transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.funnel__vsl {
  position: relative;
  z-index: 1;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(colors.$BAKANO-PINK, 0.2);
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04) inset,
    0 32px 80px rgba(0,0,0,0.5),
    0 0 60px rgba(colors.$BAKANO-PINK, 0.08);
  cursor: pointer;

  &:hover .funnel__vsl-play {
    transform: scale(1.1);
  }
}

.funnel__vsl-img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.funnel__vsl-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.35);
}

.funnel__vsl-play {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, colors.$BAKANO-PINK, colors.$BAKANO-PURPLE);
  display: flex;
  align-items: center;
  justify-content: center;
  color: colors.$white;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  box-shadow: 0 8px 32px rgba(colors.$BAKANO-PINK, 0.45);

  svg {
    margin-left: 3px;
  }

  @media (max-width: 600px) {
    width: 56px;
    height: 56px;
  }
}

// ── CTA button ───────────────────────────────────────────────────────────────
.funnel__cta-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 16px 0 48px;
}

.funnel__cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: fonts.$font-interface;
  font-size: 0.92rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: colors.$white;
  background: linear-gradient(135deg, colors.$BAKANO-PINK, colors.$BAKANO-PURPLE);
  border: none;
  border-radius: 50px;
  padding: 18px 40px;
  text-decoration: none;
  cursor: pointer;
  box-shadow:
    0 8px 32px rgba(colors.$BAKANO-PINK, 0.4),
    0 0 0 1px rgba(255,255,255,0.08) inset;
  transition: transform 0.2s ease, box-shadow 0.25s ease;
  animation: cta-pulse 2.5s ease-in-out infinite;

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 16px 48px rgba(colors.$BAKANO-PINK, 0.55),
      0 0 0 1px rgba(255,255,255,0.12) inset;
    animation: none;
  }

  &:active {
    transform: translateY(0);
  }

  &--large {
    font-size: 1rem;
    padding: 20px 48px;
  }

  @media (max-width: 600px) {
    padding: 16px 24px;
    font-size: 0.82rem;
    width: 100%;

    &--large {
      padding: 18px 24px;
      font-size: 0.88rem;
    }
  }
}

@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(colors.$BAKANO-PINK, 0.4), 0 0 0 1px rgba(255,255,255,0.08) inset; }
  50% { box-shadow: 0 8px 48px rgba(colors.$BAKANO-PINK, 0.65), 0 0 0 1px rgba(255,255,255,0.1) inset; }
}

.funnel__cta-sub {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: fonts.$font-interface;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.38);
  margin: 0;
  letter-spacing: 0.2px;

  svg {
    flex-shrink: 0;
    opacity: 0.5;
  }
}

// ── Stats ─────────────────────────────────────────────────────────────────────
.funnel__stats {
  padding: 64px 0;
  border-top: 1px solid $border;
  border-bottom: 1px solid $border;
  background: $dark-card;
  text-align: center;
}

.funnel__section-label {
  font-family: fonts.$font-accent;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: colors.$BAKANO-PINK;
  margin: 0 0 40px;
}

.funnel__stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    max-width: 420px;
    margin-inline: auto;
  }
}

.funnel__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 24px;
  border-radius: 16px;
  border: 1px solid $border;
  background: rgba(255,255,255,0.02);
  transition: border-color 0.25s ease, background 0.25s ease;

  &:hover {
    border-color: rgba(colors.$BAKANO-PINK, 0.2);
    background: rgba(colors.$BAKANO-PINK, 0.03);
  }
}

.funnel__stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg,
    rgba(colors.$BAKANO-PINK, 0.15),
    rgba(colors.$BAKANO-PURPLE, 0.1));
  border: 1px solid rgba(colors.$BAKANO-PINK, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: colors.$BAKANO-PINK;
}

.funnel__stat-number {
  font-family: fonts.$font-accent;
  font-size: 2.4rem;
  font-weight: 700;
  color: colors.$white;
  line-height: 1;
  background: linear-gradient(110deg, colors.$BAKANO-PINK, colors.$BAKANO-PURPLE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.funnel__stat-text {
  font-family: fonts.$font-secondary;
  font-size: 0.88rem;
  color: $text-body;
  line-height: 1.5;
  margin: 0;
  max-width: 200px;
}

// ── Authority ─────────────────────────────────────────────────────────────────
.funnel__authority {
  padding: 80px 0;

  @media (max-width: 600px) {
    padding: 56px 0;
  }
}

.funnel__authority-inner {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
}

.funnel__authority-photo-wrap {
  position: relative;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.funnel__authority-photo-glow {
  position: absolute;
  inset: -30px;
  background: radial-gradient(circle,
    rgba(colors.$BAKANO-PINK, 0.15) 0%,
    transparent 65%);
  pointer-events: none;
  border-radius: 50%;
}

.funnel__authority-photo {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 3/4;
  object-fit: cover;
  object-position: top;
  border-radius: 20px;
  border: 1px solid rgba(colors.$BAKANO-PINK, 0.15);
  box-shadow:
    0 32px 80px rgba(0,0,0,0.4),
    0 0 0 1px rgba(255,255,255,0.04) inset;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    max-width: 220px;
    aspect-ratio: 1/1;
  }
}

.funnel__authority-badge {
  position: absolute;
  bottom: -14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 50px;
  background: linear-gradient(135deg, colors.$BAKANO-PINK, colors.$BAKANO-PURPLE);
  color: colors.$white;
  font-family: fonts.$font-interface;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(colors.$BAKANO-PINK, 0.4);
}

.funnel__authority-name {
  font-family: fonts.$font-principal;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: colors.$white;
  margin: 0 0 6px;
}

.funnel__authority-role {
  font-family: fonts.$font-interface;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: colors.$BAKANO-PINK;
  margin: 0 0 20px;
}

.funnel__authority-desc {
  font-family: fonts.$font-secondary;
  font-size: 1rem;
  line-height: 1.72;
  color: $text-body;
  margin: 0 0 28px;
}

.funnel__authority-achievements {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.funnel__authority-achievement {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: fonts.$font-secondary;
  font-size: 0.92rem;
  line-height: 1.6;
  color: $text-body;

  @media (max-width: 768px) {
    text-align: left;
  }

  strong {
    color: colors.$white;
  }
}

.funnel__achievement-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, colors.$BAKANO-PINK, colors.$BAKANO-PURPLE);
  display: flex;
  align-items: center;
  justify-content: center;
  color: colors.$white;
  margin-top: 1px;
}

// ── Second CTA ────────────────────────────────────────────────────────────────
.funnel__second-cta {
  padding: 96px 0 88px;
  border-top: 1px solid $border;
  background: $dark-card;
}

.funnel__second-cta-inner {
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.funnel__second-cta-glow {
  position: absolute;
  inset: -60px;
  background: radial-gradient(ellipse 70% 60% at 50% 50%,
    rgba(colors.$BAKANO-PURPLE, 0.1) 0%,
    rgba(colors.$BAKANO-PINK, 0.06) 50%,
    transparent 70%);
  pointer-events: none;
}

.funnel__second-cta-img {
  display: block;
  width: 100%;
  max-width: 520px;
  margin-inline: auto;
  border-radius: 12px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.funnel__second-cta-title {
  font-family: fonts.$font-principal;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.18;
  color: colors.$white;
  margin: 0 0 16px;
  position: relative;

  br {
    @media (max-width: 480px) { display: none; }
  }
}

.funnel__second-cta-sub {
  font-family: fonts.$font-secondary;
  font-size: 1rem;
  line-height: 1.7;
  color: $text-body;
  max-width: 560px;
  margin-inline: auto;
  margin-bottom: 52px;
  position: relative;
}

// ── Footer ────────────────────────────────────────────────────────────────────
.funnel__footer {
  padding: 48px 0 40px;
  border-top: 1px solid $border;
  text-align: center;
  background: #07050e;
}

.funnel__footer-logo {
  height: 22px;
  width: auto;
  opacity: 0.6;
  margin-bottom: 20px;
}

.funnel__footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  a {
    font-family: fonts.$font-interface;
    font-size: 0.78rem;
    color: $text-muted;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: colors.$white;
    }
  }

  span {
    color: $border;
    font-size: 0.7rem;
  }
}

.funnel__footer-copyright {
  font-family: fonts.$font-interface;
  font-size: 0.75rem;
  color: $text-muted;
  margin: 0 0 20px;
}

.funnel__footer-disclaimer {
  font-family: fonts.$font-interface;
  font-size: 0.68rem;
  line-height: 1.65;
  color: rgba(255,255,255,0.25);
  max-width: 680px;
  margin-inline: auto;
  margin-bottom: 0;
}
</style>
