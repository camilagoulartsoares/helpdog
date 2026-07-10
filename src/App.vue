<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const base = import.meta.env.BASE_URL
const apiBase = import.meta.env.VITE_API_URL || '/api'

const products = [
  {
    name: 'Special Dog',
    description: 'Oferece uma refeição completa rica em proteínas e vitaminas.',
    image: `${base}products/special-dog.png`,
    blob: `${base}products/blob-pink.png`,
    suggestCents: 3500,
  },
  {
    name: 'Biscrok',
    description: 'Biscoitos crocantes em formato de ossos com cálcio e ômega 6.',
    image: `${base}products/biscrok.png`,
    blob: `${base}products/blob-yellow.png`,
    suggestCents: 1500,
  },
  {
    name: 'Drools',
    description: 'Pedaços reais de fígado de frango e frango em molho.',
    image: `${base}products/drools.png`,
    blob: `${base}products/blob-blue.png`,
    suggestCents: 2500,
  },
]

const dogAvatars = [
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80',
]

type Campaign = {
  title: string
  description: string
  goalCents: number
  raisedCents: number
  donorsCount: number
  progressPercent: number
}

type Donation = {
  id: number
  donorName: string
  amountCents: number
  message: string | null
  createdAt: string
}

const demoCampaign: Campaign = {
  title: 'Ração para cães de rua',
  description:
    'Meta mensal para comprar ração e água para cães em situação de rua na nossa região.',
  goalCents: 500000,
  raisedCents: 8500,
  donorsCount: 3,
  progressPercent: 2,
}

const demoDonations: Donation[] = [
  {
    id: 1,
    donorName: 'Ana',
    amountCents: 2500,
    message: 'Todo doguinho merece comer bem 💛',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    donorName: 'Pedro',
    amountCents: 1000,
    message: 'Pequena ajuda, grande diferença.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    donorName: 'Marina',
    amountCents: 5000,
    message: null,
    createdAt: new Date().toISOString(),
  },
]

const campaign = ref<Campaign | null>(null)
const donations = ref<Donation[]>([])
const apiOnline = ref(false)
const loadingCampaign = ref(true)
const submitting = ref(false)
const formError = ref('')
const formSuccess = ref('')

const form = reactive({
  donorName: '',
  donorEmail: '',
  amountReais: '10',
  message: '',
})

const presetAmounts = [5, 10, 25, 50]

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const raisedLabel = computed(() =>
  campaign.value ? formatBRL(campaign.value.raisedCents) : '—',
)
const goalLabel = computed(() =>
  campaign.value ? formatBRL(campaign.value.goalCents) : '—',
)

async function loadCampaign() {
  loadingCampaign.value = true
  try {
    const res = await fetch(`${apiBase}/campaign`)
    if (!res.ok) throw new Error('Falha ao carregar campanha')
    const data = await res.json()
    campaign.value = data.campaign
    apiOnline.value = true
  } catch {
    campaign.value = demoCampaign
    apiOnline.value = false
  } finally {
    loadingCampaign.value = false
  }
}

async function loadDonations() {
  try {
    const res = await fetch(`${apiBase}/donations`)
    if (!res.ok) throw new Error('Falha ao carregar doações')
    const data = await res.json()
    donations.value = data.donations
    apiOnline.value = true
  } catch {
    donations.value = demoDonations
    apiOnline.value = false
  }
}

function suggestAmount(cents: number) {
  form.amountReais = String(cents / 100)
  document.getElementById('doar')?.scrollIntoView({ behavior: 'smooth' })
}

function selectPreset(value: number) {
  form.amountReais = String(value)
}

async function submitDonation() {
  formError.value = ''
  formSuccess.value = ''

  if (!apiOnline.value) {
    formError.value =
      'A API está offline neste ambiente (GitHub Pages é estático). Rode localmente com npm run dev:all para registrar doações de verdade.'
    return
  }

  submitting.value = true

  const amountNumber = Number(String(form.amountReais).replace(',', '.'))
  const amountCents = Math.round(amountNumber * 100)

  try {
    const res = await fetch(`${apiBase}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donorName: form.donorName,
        donorEmail: form.donorEmail,
        amountCents,
        message: form.message,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      const details = data?.details
      const firstDetail =
        details && typeof details === 'object'
          ? Object.values(details).flat()[0]
          : null
      throw new Error(
        (typeof firstDetail === 'string' && firstDetail) ||
          data?.error ||
          'Não foi possível registrar a doação.',
      )
    }

    formSuccess.value = `Obrigada, ${data.donation.donorName}! Sua doação de ${formatBRL(data.donation.amountCents)} foi registrada.`
    form.donorName = ''
    form.donorEmail = ''
    form.amountReais = '10'
    form.message = ''
    await Promise.all([loadCampaign(), loadDonations()])
  } catch (error) {
    formError.value =
      error instanceof Error ? error.message : 'Erro inesperado ao doar.'
  } finally {
    submitting.value = false
  }
}

let observer: IntersectionObserver | null = null

onMounted(async () => {
  await Promise.all([loadCampaign(), loadDonations()])

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  )

  document.querySelectorAll('.reveal').forEach((el) => observer?.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="page">
    <header class="topbar reveal reveal-down">
      <a class="brand" href="#topo">
        <svg class="brand-icon" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="12" cy="14" r="5" fill="currentColor" />
          <circle cx="20" cy="11" r="6" fill="currentColor" />
          <circle cx="28" cy="14" r="5" fill="currentColor" />
          <path
            d="M10 28c2.5-5 5-6.5 10-6.5S27.5 23 30 28"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <span>HelpDog</span>
      </a>
      <a class="topbar-link" href="#doar">Doar</a>
    </header>

    <main id="topo">
      <section class="hero">
        <div class="hero-copy reveal reveal-left">
          <h1>Ajude quem realmente precisa da sua ajuda.</h1>
          <p>Com apenas 1 real você pode me ajudar a alimentar cães de rua.</p>
          <a class="btn" href="#doar">AJUDAR AGORA</a>
        </div>

        <div class="hero-visual reveal reveal-right" aria-hidden="true">
          <div class="hero-stripe" />
          <div class="hero-blob float-slow" />

          <img class="paw paw-azul float" :src="`${base}hero/pata-azul.png`" alt="" />
          <img
            class="paw paw-roxa float float-delay-1"
            :src="`${base}hero/pata-roxa.png`"
            alt=""
          />
          <img
            class="paw paw-rosa float float-delay-2"
            :src="`${base}hero/pata-rosa.png`"
            alt=""
          />

          <img class="hero-dog" :src="`${base}hero/cachorro.png`" alt="" />
          <img class="hero-racao" :src="`${base}hero/racao.png`" alt="" />

          <img
            v-for="(src, i) in dogAvatars"
            :key="src"
            class="avatar float"
            :class="[`avatar-${i + 1}`, `float-delay-${(i % 3) + 1}`]"
            :src="src"
            alt=""
          />
        </div>
      </section>

      <section class="about" id="sobre">
        <div class="about-visual reveal reveal-left" aria-hidden="true">
          <img class="about-blob" :src="`${base}about/blob.png`" alt="" />
          <img
            class="about-icon about-paw-fill about-paw-fill-1 float"
            :src="`${base}about/pata-azul-1.png`"
            alt=""
          />
          <img
            class="about-icon about-paw-fill about-paw-fill-2 float float-delay-1"
            :src="`${base}about/pata-azul-2.png`"
            alt=""
          />
          <img
            class="about-icon about-paw-fill about-paw-fill-3 float float-delay-2"
            :src="`${base}about/pata-azul-3.png`"
            alt=""
          />
          <img
            class="about-icon about-paw-outline about-paw-outline-1 float"
            :src="`${base}about/pata-outline-1.png`"
            alt=""
          />
          <img
            class="about-icon about-paw-outline about-paw-outline-2 float float-delay-1"
            :src="`${base}about/pata-outline-2.png`"
            alt=""
          />
          <img
            class="about-icon about-osso float float-delay-2"
            :src="`${base}about/osso.svg`"
            alt=""
          />
          <img class="about-icon about-pote" :src="`${base}about/pote.png`" alt="" />
          <img class="about-dog" :src="`${base}about/cachorro.png`" alt="" />
        </div>

        <div class="about-copy reveal reveal-right">
          <h2>Os cães falam, mas apenas para quem sabe ouvir.</h2>
          <p>
            Descubra histórias encantadoras, segredos reveladores e a profunda
            conexão entre humanos e seus leais companheiros. Prepare-se para uma
            jornada única, onde a linguagem dos cães ganha vida para aqueles que
            estão sintonizados com o inexplorado mundo canino.
          </p>
          <a class="btn" href="#doar">SAIBA MAIS</a>
        </div>
      </section>

      <section class="products" id="produtos">
        <article
          v-for="(product, index) in products"
          :key="product.name"
          class="product reveal reveal-up"
          :style="{ '--delay': `${index * 0.12}s` }"
        >
          <div class="product-media">
            <img class="product-blob" :src="product.blob" alt="" />
            <img class="product-pack" :src="product.image" :alt="product.name" />
          </div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <button
            type="button"
            class="btn btn-wide"
            @click="suggestAmount(product.suggestCents)"
          >
            DOAR {{ formatBRL(product.suggestCents) }}
          </button>
        </article>
      </section>

      <section class="donate" id="doar">
        <div class="donate-grid">
          <div class="donate-progress reveal reveal-left">
            <p class="donate-kicker">Campanha ativa</p>
            <h2>{{ campaign?.title || 'Ração para cães de rua' }}</h2>
            <p class="donate-desc">
              {{
                campaign?.description ||
                'Ajude a comprar ração e água para cães em situação de rua.'
              }}
            </p>

            <div class="progress-card" :aria-busy="loadingCampaign">
              <div class="progress-meta">
                <strong>{{ raisedLabel }}</strong>
                <span>de {{ goalLabel }}</span>
              </div>
              <div
                class="progress-bar"
                role="progressbar"
                :aria-valuenow="campaign?.progressPercent || 0"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span
                  class="progress-fill"
                  :style="{ width: `${campaign?.progressPercent || 0}%` }"
                />
              </div>
              <p class="progress-foot">
                {{ campaign?.donorsCount ?? 0 }} pessoas já ajudaram ·
                {{ campaign?.progressPercent ?? 0 }}% da meta
              </p>
            </div>

            <ul v-if="donations.length" class="donors">
              <li v-for="donation in donations" :key="donation.id">
                <div>
                  <strong>{{ donation.donorName }}</strong>
                  <span v-if="donation.message">{{ donation.message }}</span>
                </div>
                <em>{{ formatBRL(donation.amountCents) }}</em>
              </li>
            </ul>
          </div>

          <form class="donate-form reveal reveal-right" @submit.prevent="submitDonation">
            <h3>Faça sua doação</h3>
            <p class="form-hint">Valores a partir de R$ 1,00. Todo real conta.</p>
            <p v-if="!apiOnline" class="form-hint form-hint--warn">
              Modo demonstração: a API local não está conectada. No GitHub Pages a landing é estática;
              para doar de verdade, rode <code>npm run dev:all</code>.
            </p>

            <label>
              Seu nome
              <input v-model="form.donorName" type="text" name="donorName" required maxlength="80" />
            </label>

            <label>
              E-mail (opcional)
              <input v-model="form.donorEmail" type="email" name="donorEmail" maxlength="120" />
            </label>

            <fieldset class="amount-presets">
              <legend>Valor sugerido</legend>
              <button
                v-for="amount in presetAmounts"
                :key="amount"
                type="button"
                class="preset"
                :class="{ 'is-active': Number(form.amountReais) === amount }"
                @click="selectPreset(amount)"
              >
                R$ {{ amount }}
              </button>
            </fieldset>

            <label>
              Valor (R$)
              <input
                v-model="form.amountReais"
                type="number"
                name="amount"
                min="1"
                step="0.01"
                required
              />
            </label>

            <label>
              Mensagem (opcional)
              <textarea v-model="form.message" name="message" rows="3" maxlength="280" />
            </label>

            <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
            <p v-if="formSuccess" class="form-success" role="status">{{ formSuccess }}</p>

            <button class="btn btn-wide" type="submit" :disabled="submitting">
              {{ submitting ? 'Enviando...' : 'CONFIRMAR DOAÇÃO' }}
            </button>
          </form>
        </div>
      </section>
    </main>

    <footer class="footer reveal reveal-up">
      <p>© {{ new Date().getFullYear() }} HelpDog — Ajude quem precisa.</p>
    </footer>
  </div>
</template>
