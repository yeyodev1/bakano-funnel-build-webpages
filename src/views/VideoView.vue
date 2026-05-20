<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import CalendarModal from '@/components/CalendarModal.vue'
import { trackStage, generateEventId } from '@/utils/ghl'
import { useContactStore } from '@/stores/contact'

const contactStore = useContactStore()

// ── Calendar modal ────────────────────────────────────────────────────────────
const calendarOpen = ref(false)

// ── Contact capture guard ─────────────────────────────────────────────────────
const captureOpen = ref(false)
const captureForm = ref({ nombre: '', apellido: '', negocio: '', email: '', telefono: '' })
const captureErrors = ref<Record<string, string>>({})
const captureTouched = ref<Record<string, boolean>>({})
const captureSubmitting = ref(false)

const validateCapture = () => {
  const e: Record<string, string> = {}
  if (captureForm.value.nombre.trim().length < 2) e.nombre = 'Ingresa tu nombre'
  if (captureForm.value.apellido.trim().length < 2) e.apellido = 'Ingresa tu apellido'
  if (captureForm.value.negocio.trim().length < 2) e.negocio = 'Ingresa el nombre de tu negocio'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(captureForm.value.email.trim())) e.email = 'Email inválido'
  if (captureForm.value.telefono.trim().length < 7) e.telefono = 'Teléfono inválido'
  captureErrors.value = e
  return Object.keys(e).length === 0
}

const submitCapture = async () => {
  captureTouched.value = { nombre: true, apellido: true, negocio: true, email: true, telefono: true }
  if (!validateCapture()) return
  captureSubmitting.value = true

  contactStore.save({
    nombre: captureForm.value.nombre.trim(),
    apellido: captureForm.value.apellido.trim(),
    negocio: captureForm.value.negocio.trim(),
    email: captureForm.value.email.trim().toLowerCase(),
    telefono: captureForm.value.telefono.trim(),
  })

  const c = contactStore.get()
  const leadEventId = generateEventId('lead_video')
  trackStage('lead_capturado', {
    nombre: c.nombre,
    apellido: c.apellido,
    negocio: c.negocio,
    email: c.email,
    telefono: c.telefono,
    event_id: leadEventId,
  })
  ;(window as any).fbq?.('track', 'Lead', { content_name: 'video-gate' }, { eventID: leadEventId })
  await new Promise(r => setTimeout(r, 600))
  captureSubmitting.value = false
  captureOpen.value = false
  startTimer()
}

// ── 2-minute countdown (3 s en localhost para testing) ───────────────────────
const IS_DEV = window.location.hostname === 'localhost'
const COUNTDOWN_SECONDS = IS_DEV ? 3 : 120
const secondsLeft = ref(COUNTDOWN_SECONDS)
const ctaUnlocked = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const formattedTime = () => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const startTimer = () => {
  timer = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value--
    } else {
      ctaUnlocked.value = true
      if (timer) clearInterval(timer)
    }
  }, 1000)
}

onMounted(() => {
  const c = contactStore.get()
  const hasContact = !!c.email && !!c.nombre
  if (!IS_DEV && !hasContact) {
    captureOpen.value = true
  } else {
    ;(window as any).fbq?.('track', 'ViewContent', { content_name: 'video-vsl' })
    startTimer()
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="vv-page">

    <!-- ── Top bar ──────────────────────────────────────────────────────────── -->
    <header class="vv-topbar">
      <img
        src="https://res.cloudinary.com/dpuody0df/image/upload/v1775587085/bakano/logos/bakano-light.png"
        alt="Bakano"
        class="vv-topbar__logo"
      />
    </header>

    <!-- ── Main content ─────────────────────────────────────────────────────── -->
    <main class="vv-main">

      <!-- Progress stepper -->
      <div class="vv-stepper" aria-label="Paso 1 de 2">
        <span class="vv-stepper__pill">
          <span class="vv-stepper__dot vv-stepper__dot--active" aria-current="step"></span>
          <span class="vv-stepper__dot"></span>
          <span class="vv-stepper__label">Paso 1 de 2</span>
        </span>
      </div>

      <!-- Headline -->
      <section class="vv-headline">
        <p class="vv-eyebrow">Antes de invertir</p>
        <h1 class="vv-h1">
          Mira el video &mdash; conoce el
          <span class="vv-accent">sistema de ventas automático</span>
        </h1>
        <p class="vv-subtitle">
          Descubre cómo automatizar tus conversaciones en ventas 24/7. Inversión desde $800 &mdash; cupos limitados.
        </p>
      </section>

      <!-- Wistia video embed -->
      <div class="vv-video-wrapper">
        <div class="vv-video-ratio">
          <iframe
            src="https://fast.wistia.net/embed/iframe/36e2n5k3v9?videoFoam=true"
            title="Video Bakano"
            allow="autoplay; fullscreen"
            allowfullscreen
            class="vv-video-iframe"
          ></iframe>
        </div>
      </div>

      <!-- CTA section -->
      <div class="vv-cta-section">

        <!-- Lock notice (visible while countdown active) -->
        <Transition name="lock-fade">
          <div v-if="!ctaUnlocked" class="vv-lock-notice">
            <i class="fa-solid fa-lock vv-lock-notice__icon" aria-hidden="true"></i>
            <span class="vv-lock-notice__text">
              El botón se habilita en
              <strong class="vv-lock-notice__timer">{{ formattedTime() }}</strong>
              &mdash; el video te explica el sistema completo
            </span>
          </div>
        </Transition>

        <!-- CTA button -->
        <button
          class="vv-cta-btn"
          :class="{ 'vv-cta-btn--active': ctaUnlocked, 'vv-cta-btn--locked': !ctaUnlocked }"
          :disabled="!ctaUnlocked"
          @click="ctaUnlocked && (calendarOpen = true)"
        >
          <i
            v-if="ctaUnlocked"
            class="fa-solid fa-calendar-check"
            aria-hidden="true"
          ></i>
          <i
            v-else
            class="fa-solid fa-lock"
            aria-hidden="true"
          ></i>
          <span v-if="ctaUnlocked">QUIERO MI SISTEMA DE VENTAS AHORA</span>
          <span v-else>QUIERO MI SISTEMA DE VENTAS</span>
        </button>

        <!-- Trust line -->
        <p class="vv-trust">
          <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
          Inversión desde $800 &middot; Resultados comprobados &middot; Cupos limitados
        </p>

      </div>

    </main>

    <!-- ── Footer ────────────────────────────────────────────────────────────── -->
    <footer class="vv-footer">
      <p class="vv-footer__copy">&copy; {{ new Date().getFullYear() }} NEGOCIOS DEL PACIFICO. Todos los derechos reservados.</p>
      <nav class="vv-footer__links" aria-label="Legal">
        <RouterLink to="/politicas-privacidad" class="vv-footer__link">Politicas de Privacidad</RouterLink>
        <span class="vv-footer__sep" aria-hidden="true">&middot;</span>
        <RouterLink to="/aviso-legal" class="vv-footer__link">Aviso Legal</RouterLink>
      </nav>
    </footer>

  </div>

  <!-- Calendar modal -->
  <CalendarModal
    :open="calendarOpen"
    nombre=""
    @close="calendarOpen = false"
  />

  <!-- ── Contact capture overlay ─────────────────────────────────────────────── -->
  <Transition name="capture-fade">
    <div v-if="captureOpen" class="cap-overlay" role="dialog" aria-modal="true" aria-labelledby="cap-title">
      <div class="cap-card">

        <div class="cap-icon-wrap">
          <i class="fa-solid fa-user-lock cap-icon" aria-hidden="true"></i>
        </div>

        <h2 id="cap-title" class="cap-h2">Antes de ver el video, déjanos tus datos</h2>
        <p class="cap-sub">Queremos conocerte para evaluar si eres el perfil ideal para nuestro sistema de ventas automático</p>

        <form class="cap-form" @submit.prevent="submitCapture" novalidate>

          <div class="cap-row">
            <div class="cap-field" :class="{ 'cap-field--error': captureTouched.nombre && captureErrors.nombre }">
              <label class="cap-label" for="cap-nombre">Nombre</label>
              <input
                id="cap-nombre"
                v-model="captureForm.nombre"
                type="text"
                class="cap-input"
                placeholder="Tu nombre"
                autocomplete="given-name"
                @blur="captureTouched.nombre = true; validateCapture()"
              />
              <span v-if="captureTouched.nombre && captureErrors.nombre" class="cap-error">{{ captureErrors.nombre }}</span>
            </div>

            <div class="cap-field" :class="{ 'cap-field--error': captureTouched.apellido && captureErrors.apellido }">
              <label class="cap-label" for="cap-apellido">Apellido</label>
              <input
                id="cap-apellido"
                v-model="captureForm.apellido"
                type="text"
                class="cap-input"
                placeholder="Tu apellido"
                autocomplete="family-name"
                @blur="captureTouched.apellido = true; validateCapture()"
              />
              <span v-if="captureTouched.apellido && captureErrors.apellido" class="cap-error">{{ captureErrors.apellido }}</span>
            </div>
          </div>

          <div class="cap-field" :class="{ 'cap-field--error': captureTouched.negocio && captureErrors.negocio }">
            <label class="cap-label" for="cap-negocio">Nombre de tu negocio</label>
            <input
              id="cap-negocio"
              v-model="captureForm.negocio"
              type="text"
              class="cap-input"
              placeholder="Ej: Pastelería Nicole"
              autocomplete="organization"
              @blur="captureTouched.negocio = true; validateCapture()"
            />
            <span v-if="captureTouched.negocio && captureErrors.negocio" class="cap-error">{{ captureErrors.negocio }}</span>
          </div>

          <div class="cap-field" :class="{ 'cap-field--error': captureTouched.email && captureErrors.email }">
            <label class="cap-label" for="cap-email">Email</label>
            <input
              id="cap-email"
              v-model="captureForm.email"
              type="email"
              class="cap-input"
              placeholder="tu@email.com"
              autocomplete="email"
              @blur="captureTouched.email = true; validateCapture()"
            />
            <span v-if="captureTouched.email && captureErrors.email" class="cap-error">{{ captureErrors.email }}</span>
          </div>

          <div class="cap-field" :class="{ 'cap-field--error': captureTouched.telefono && captureErrors.telefono }">
            <label class="cap-label" for="cap-telefono">Teléfono / WhatsApp</label>
            <input
              id="cap-telefono"
              v-model="captureForm.telefono"
              type="tel"
              class="cap-input"
              placeholder="+593 99 999 9999"
              autocomplete="tel"
              @blur="captureTouched.telefono = true; validateCapture()"
            />
            <span v-if="captureTouched.telefono && captureErrors.telefono" class="cap-error">{{ captureErrors.telefono }}</span>
          </div>

          <button type="submit" class="cap-submit" :disabled="captureSubmitting">
            <i v-if="!captureSubmitting" class="fa-solid fa-play" aria-hidden="true"></i>
            <i v-else class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
            <span>{{ captureSubmitting ? 'Un momento...' : 'CONTINUAR AL VIDEO' }}</span>
          </button>

        </form>

        <p class="cap-privacy">
          <i class="fa-solid fa-lock" aria-hidden="true"></i>
          Tus datos están seguros &middot; No spam
        </p>

      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;
@use '@/styles/fonts.modules.scss' as fonts;

$bg:          #0a0712;
$bg2:         #0f0b1a;
$border:      rgba(255, 255, 255, 0.07);
$text-muted:  rgba(255, 255, 255, 0.38);
$text-body:   rgba(255, 255, 255, 0.68);

// ── Page shell ────────────────────────────────────────────────────────────────
.vv-page {
  min-height: 100vh;
  background: $bg;
  display: flex;
  flex-direction: column;
  color: colors.$white;
}

// ── Top bar ───────────────────────────────────────────────────────────────────
.vv-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  background: rgba($bg, 0.88);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid $border;
}

.vv-topbar__logo {
  height: 28px;
  width: auto;
  display: block;
}

// ── Main ──────────────────────────────────────────────────────────────────────
.vv-main {
  flex: 1;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 48px 24px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;

  @media (max-width: 600px) {
    padding: 32px 16px 48px;
    gap: 28px;
  }
}

// ── Stepper ───────────────────────────────────────────────────────────────────
.vv-stepper {
  display: flex;
  justify-content: center;
}

.vv-stepper__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 10px;
  background: rgba(colors.$BAKANO-PURPLE, 0.1);
  border: 1px solid rgba(colors.$BAKANO-PURPLE, 0.22);
  border-radius: 100px;
}

.vv-stepper__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
  transition: background 0.2s;

  &--active {
    background: colors.$BAKANO-PURPLE;
    box-shadow: 0 0 8px rgba(colors.$BAKANO-PURPLE, 0.7);
  }
}

.vv-stepper__label {
  font-family: fonts.$font-accent;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(colors.$BAKANO-PURPLE, 0.85);
  padding-left: 4px;
}

// ── Headline ──────────────────────────────────────────────────────────────────
.vv-headline {
  text-align: center;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vv-eyebrow {
  font-family: fonts.$font-accent;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: colors.$BAKANO-PURPLE;
  margin: 0;
}

.vv-h1 {
  font-family: fonts.$font-principal;
  font-size: clamp(1.7rem, 4.5vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.18;
  color: colors.$white;
  margin: 0;
}

.vv-accent {
  background: linear-gradient(110deg, colors.$BAKANO-PINK, colors.$BAKANO-PURPLE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.vv-subtitle {
  font-family: fonts.$font-secondary;
  font-size: clamp(0.92rem, 2vw, 1.05rem);
  color: $text-body;
  line-height: 1.6;
  margin: 0;
}

// ── Video ─────────────────────────────────────────────────────────────────────
.vv-video-wrapper {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(colors.$BAKANO-PURPLE, 0.3);
  box-shadow:
    0 0 0 1px rgba(colors.$BAKANO-PURPLE, 0.08) inset,
    0 0 60px rgba(colors.$BAKANO-PURPLE, 0.18),
    0 32px 80px rgba(0, 0, 0, 0.7);
}

.vv-video-ratio {
  position: relative;
  width: 100%;
  padding-top: 56.25%; // 16:9
}

.vv-video-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

// ── CTA section ───────────────────────────────────────────────────────────────
.vv-cta-section {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

// Lock notice
.vv-lock-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(colors.$BAKANO-DARK, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  width: 100%;
}

.vv-lock-notice__icon {
  font-size: 0.82rem;
  color: $text-muted;
  flex-shrink: 0;
}

.vv-lock-notice__text {
  font-family: fonts.$font-interface;
  font-size: 0.82rem;
  color: $text-body;
  line-height: 1.45;
}

.vv-lock-notice__timer {
  font-family: fonts.$font-accent;
  font-weight: 700;
  color: colors.$BAKANO-PURPLE;
}

// CTA button
.vv-cta-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 28px;
  font-family: fonts.$font-accent;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: colors.$white;
  border: none;
  border-radius: 12px;
  cursor: not-allowed;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.3s ease, opacity 0.25s;

  i { font-size: 1rem; }

  // Locked state
  &--locked {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.09);
    color: rgba(255, 255, 255, 0.28);
    cursor: not-allowed;

    i { color: rgba(255, 255, 255, 0.2); }
  }

  // Active / unlocked state
  &--active {
    background: linear-gradient(135deg, colors.$BAKANO-PINK, colors.$BAKANO-PURPLE);
    box-shadow:
      0 8px 32px rgba(colors.$BAKANO-PINK, 0.35),
      0 2px 8px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    animation: cta-pulse 2.8s ease-in-out infinite;

    &:hover {
      transform: translateY(-3px);
      box-shadow:
        0 14px 44px rgba(colors.$BAKANO-PINK, 0.5),
        0 4px 12px rgba(0, 0, 0, 0.5);
      animation: none;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(colors.$BAKANO-PINK, 0.35), 0 2px 8px rgba(0,0,0,0.4); }
  50%       { box-shadow: 0 10px 44px rgba(colors.$BAKANO-PINK, 0.55), 0 2px 8px rgba(0,0,0,0.4); }
}

// Trust line
.vv-trust {
  font-family: fonts.$font-interface;
  font-size: 0.74rem;
  color: $text-muted;
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;

  i { font-size: 0.65rem; }
}

// Lock notice transition
.lock-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.lock-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

// ── Footer ────────────────────────────────────────────────────────────────────
.vv-footer {
  padding: 24px 24px 32px;
  border-top: 1px solid $border;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.vv-footer__copy {
  font-family: fonts.$font-interface;
  font-size: 0.7rem;
  color: $text-muted;
  margin: 0;
  text-align: center;
}

.vv-footer__links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vv-footer__link {
  font-family: fonts.$font-interface;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  transition: color 0.2s;

  &:hover { color: rgba(255, 255, 255, 0.6); }
}

.vv-footer__sep {
  color: $text-muted;
  font-size: 0.7rem;
}

// ── Contact capture overlay ───────────────────────────────────────────────────
.cap-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  overflow-y: auto;
}

.cap-card {
  width: 100%;
  max-width: 460px;
  background: #12101c;
  border: 1px solid rgba(colors.$BAKANO-PURPLE, 0.25);
  border-radius: 20px;
  padding: 40px 36px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  box-shadow:
    0 0 0 1px rgba(colors.$BAKANO-PURPLE, 0.08) inset,
    0 32px 80px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(colors.$BAKANO-PURPLE, 0.15);

  @media (max-width: 480px) {
    padding: 32px 22px 28px;
  }
}

.cap-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(colors.$BAKANO-PURPLE, 0.12);
  border: 1px solid rgba(colors.$BAKANO-PURPLE, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.cap-icon {
  font-size: 1.8rem;
  color: colors.$BAKANO-PURPLE;
}

.cap-h2 {
  font-family: fonts.$font-principal;
  font-size: clamp(1.2rem, 4vw, 1.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: colors.$white;
  text-align: center;
  margin: 0 0 10px;
}

.cap-sub {
  font-family: fonts.$font-secondary;
  font-size: 0.88rem;
  color: $text-body;
  text-align: center;
  line-height: 1.5;
  margin: 0 0 28px;
}

.cap-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cap-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
}

.cap-field {
  display: flex;
  flex-direction: column;
  gap: 5px;

  &--error .cap-input {
    border-color: rgba(colors.$BAKANO-PINK, 0.6);
    background: rgba(colors.$BAKANO-PINK, 0.04);
  }
}

.cap-label {
  font-family: fonts.$font-interface;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(colors.$white, 0.5);
}

.cap-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: colors.$white;
  font-family: fonts.$font-secondary;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box;

  &::placeholder { color: rgba(255, 255, 255, 0.22); }

  &:focus {
    border-color: rgba(colors.$BAKANO-PURPLE, 0.55);
    background: rgba(colors.$BAKANO-PURPLE, 0.06);
  }
}

.cap-error {
  font-family: fonts.$font-interface;
  font-size: 0.74rem;
  color: colors.$BAKANO-PINK;
}

.cap-submit {
  margin-top: 6px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: linear-gradient(135deg, colors.$BAKANO-PINK, colors.$BAKANO-PURPLE);
  border: none;
  border-radius: 12px;
  color: colors.$white;
  font-family: fonts.$font-accent;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
  box-shadow: 0 8px 28px rgba(colors.$BAKANO-PINK, 0.35);

  i { font-size: 0.95rem; }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(colors.$BAKANO-PINK, 0.5);
  }

  &:active:not(:disabled) { transform: translateY(0); }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.cap-privacy {
  margin-top: 18px;
  font-family: fonts.$font-interface;
  font-size: 0.72rem;
  color: $text-muted;
  display: flex;
  align-items: center;
  gap: 6px;

  i { font-size: 0.62rem; }
}

// Overlay transition
.capture-fade-enter-active,
.capture-fade-leave-active {
  transition: opacity 0.3s ease;
}
.capture-fade-enter-from,
.capture-fade-leave-to {
  opacity: 0;
}
</style>
