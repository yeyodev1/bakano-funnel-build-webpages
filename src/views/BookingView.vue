<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const iframeEl = ref<HTMLIFrameElement | null>(null)
const iframeHeight = ref(1100)

const LOGO = 'https://res.cloudinary.com/dpuody0df/image/upload/v1775587085/bakano/logos/bakano-light.png'
const BASE_URL = 'https://api.leadconnectorhq.com/widget/booking/J7W6KR5MIfa6QN2ROkvV'

// Pre-fill calendar with stored contact data
const calendarUrl = computed(() => {
  try {
    const stored = localStorage.getItem('bk_contact')
    if (!stored) return BASE_URL
    const { nombre, email, phone } = JSON.parse(stored)
    const params = new URLSearchParams()
    if (nombre) params.set('firstName', nombre)
    if (email)  params.set('email', email)
    if (phone)  params.set('phone', phone)
    const qs = params.toString()
    return qs ? `${BASE_URL}?${qs}` : BASE_URL
  } catch {
    return BASE_URL
  }
})

function onMessage(event: MessageEvent) {
  if (!event.data) return

  // GHL dynamic height resize
  if (
    typeof event.data === 'object' &&
    !Array.isArray(event.data) &&
    event.data.type === 'booking-app' &&
    event.data.height
  ) {
    iframeHeight.value = Math.max(900, event.data.height + 120)
    return
  }

  // GHL booking confirmed — exact event: ['msgsndr-booking-complete', {...}]
  if (Array.isArray(event.data) && event.data[0] === 'msgsndr-booking-complete') {
    localStorage.setItem('bk_booked_at', String(Date.now()))
    router.push('/cita-confirmada')
  }
}

onMounted(() => window.addEventListener('message', onMessage))
onUnmounted(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <div class="booking">

    <!-- TOP BAR -->
    <header class="booking__topbar">
      <img :src="LOGO" alt="Bakano" class="booking__logo" />
    </header>

    <!-- STEPPER -->
    <div class="booking__stepper">
      <div class="stepper__track">
        <div class="stepper__step stepper__step--done">
          <span class="stepper__num"><i class="fa-solid fa-check"></i></span>
          <span class="stepper__label">Registro</span>
        </div>
        <div class="stepper__line stepper__line--done"></div>
        <div class="stepper__step stepper__step--active">
          <span class="stepper__num">2</span>
          <span class="stepper__label">Agenda tu cita</span>
        </div>
      </div>
      <p class="stepper__caption">Paso 2 de 2</p>
    </div>

    <!-- HEADING -->
    <section class="booking__hero">
      <h1 class="booking__title">Selecciona tu horario</h1>
      <p class="booking__subtitle">
        Elige el día y la hora que mejor se adapte a tu agenda
      </p>
    </section>

    <!-- CALENDAR EMBED -->
    <section class="booking__calendar">
      <div class="calendar__wrapper">
        <iframe
          ref="iframeEl"
          :src="calendarUrl"
          :style="{ height: iframeHeight + 'px' }"
          title="Agenda tu asesoría con Bakano"
          class="calendar__iframe"
          frameborder="0"
          scrolling="yes"
        ></iframe>
      </div>

      <div class="calendar__fallback">
        <button class="btn btn--ghost" @click="router.push('/cita-confirmada')">
          Ya agendé mi cita
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="booking__footer">
      <div class="footer__links">
        <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
        <span class="footer__sep">·</span>
        <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
      </div>
      <p class="footer__copy">© {{ new Date().getFullYear() }} NEGOCIOS DEL PACIFICO. Todos los derechos reservados.</p>
    </footer>

  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;
@use '@/styles/fonts.modules.scss' as fonts;

.booking {
  min-height: 100vh;
  background-color: #0a0712;
  color: colors.$white;
  display: flex;
  flex-direction: column;
  align-items: center;

  // ── TOP BAR ──────────────────────────────────────────
  &__topbar {
    width: 100%;
    padding: 1.25rem 2rem;
    display: flex;
    justify-content: center;
    background: rgba(#0a0712, 0.95);
    border-bottom: 1px solid rgba(colors.$BAKANO-PURPLE, 0.2);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  &__logo {
    height: 36px;
    width: auto;
  }

  // ── STEPPER ──────────────────────────────────────────
  &__stepper {
    padding: 2rem 1rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  // ── HERO ─────────────────────────────────────────────
  &__hero {
    text-align: center;
    padding: 1.5rem 1.5rem 0.5rem;
    max-width: 600px;
  }

  &__title {
    font-family: fonts.$font-principal;
    font-weight: 800;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    line-height: 1.15;
    margin: 0 0 0.75rem;
    background: linear-gradient(135deg, colors.$white 40%, colors.$BAKANO-PURPLE);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__subtitle {
    font-family: fonts.$font-secondary;
    font-size: 1.05rem;
    color: rgba(colors.$white, 0.65);
    margin: 0;
    line-height: 1.6;
  }

  // ── CALENDAR ─────────────────────────────────────────
  &__calendar {
    width: 100%;
    max-width: 860px;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  // ── FOOTER ───────────────────────────────────────────
  &__footer {
    margin-top: auto;
    width: 100%;
    padding: 2rem 1.5rem;
    text-align: center;
    border-top: 1px solid rgba(colors.$BAKANO-PURPLE, 0.15);
  }
}

// ── STEPPER INTERNALS ─────────────────────────────────
.stepper {
  &__track {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
  }

  &__num {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: fonts.$font-accent;
    font-weight: 700;
    font-size: 0.9rem;
    border: 2px solid rgba(colors.$BAKANO-PURPLE, 0.4);
    color: rgba(colors.$white, 0.4);
    transition: all 0.3s ease;

    .stepper__step--done & {
      background: colors.$BAKANO-GREEN;
      border-color: colors.$BAKANO-GREEN;
      color: colors.$white;
    }

    .stepper__step--active & {
      background: colors.$BAKANO-PINK;
      border-color: colors.$BAKANO-PINK;
      color: colors.$white;
    }
  }

  &__label {
    font-family: fonts.$font-interface;
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(colors.$white, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.04em;

    .stepper__step--done & { color: colors.$BAKANO-GREEN; }
    .stepper__step--active & { color: colors.$white; }
  }

  &__line {
    width: 48px;
    height: 2px;
    background: rgba(colors.$BAKANO-PURPLE, 0.25);
    border-radius: 2px;

    &--done { background: colors.$BAKANO-GREEN; }
  }

  &__caption {
    font-family: fonts.$font-interface;
    font-size: 0.8rem;
    color: rgba(colors.$white, 0.4);
    margin: 0;
  }
}

// ── CALENDAR INTERNALS ────────────────────────────────
.calendar {
  &__wrapper {
    width: 100%;
    border-radius: 16px;
    overflow: visible;
    border: 1px solid rgba(colors.$BAKANO-PURPLE, 0.25);
    background: rgba(colors.$BAKANO-PURPLE, 0.05);
  }

  &__iframe {
    width: 100%;
    border: none;
    display: block;
    border-radius: 16px;
    transition: height 0.3s ease;
    background: #fff;
    -webkit-overflow-scrolling: touch;
  }

  &__fallback {
    display: flex;
    justify-content: center;
  }
}

// ── BUTTONS ───────────────────────────────────────────
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  font-family: fonts.$font-accent;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;

  &--ghost {
    background: transparent;
    border: 1.5px solid rgba(colors.$white, 0.25);
    color: rgba(colors.$white, 0.6);

    &:hover {
      border-color: colors.$BAKANO-PURPLE;
      color: colors.$white;
      background: rgba(colors.$BAKANO-PURPLE, 0.1);
    }
  }
}

// ── FOOTER INTERNALS ──────────────────────────────────
.footer {
  &__links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;

    a {
      font-family: fonts.$font-interface;
      font-size: 0.8rem;
      color: rgba(colors.$white, 0.4);
      text-decoration: none;
      transition: color 0.2s;

      &:hover { color: colors.$white; }
    }
  }

  &__sep {
    color: rgba(colors.$white, 0.2);
  }

  &__copy {
    font-family: fonts.$font-interface;
    font-size: 0.75rem;
    color: rgba(colors.$white, 0.25);
    margin: 0;
  }
}
</style>
