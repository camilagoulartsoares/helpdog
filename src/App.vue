<script setup lang="ts">
const products = [
  {
    name: 'Special Dog',
    description: 'Oferece uma refeição completa rica em proteínas e vitaminas.',
    image:
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80',
    blob: 'pink',
  },
  {
    name: 'Biscrok',
    description: 'Biscoitos crocantes em formato de ossos com cálcio e ômega 6.',
    image:
      'https://images.unsplash.com/photo-1568640347023-a616a05da3c8?auto=format&fit=crop&w=400&q=80',
    blob: 'yellow',
  },
  {
    name: 'Drools',
    description: 'Pedaços reais de fígado de frango e frango em molho.',
    image:
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&q=80',
    blob: 'blue',
  },
]

const dogAvatars = [
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80',
]

const base = import.meta.env.BASE_URL
</script>

<template>
  <div class="page">
    <header class="topbar">
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
    </header>

    <main id="topo">
      <!-- HERO -->
      <section class="hero">
        <div class="hero-copy">
          <h1>Ajude quem realmente precisa da sua ajuda.</h1>
          <p>Com apenas 1 real você pode me ajudar a alimentar cães de rua.</p>
          <a class="btn" href="#doar">AJUDAR AGORA</a>
        </div>

        <div class="hero-visual" aria-hidden="true">
          <div class="hero-stripe" />
          <div class="hero-blob" />

          <img
            class="paw paw-azul"
            :src="`${base}hero/pata-azul.png`"
            alt=""
          />
          <img
            class="paw paw-roxa"
            :src="`${base}hero/pata-roxa.png`"
            alt=""
          />
          <img
            class="paw paw-rosa"
            :src="`${base}hero/pata-rosa.png`"
            alt=""
          />

          <img
            class="hero-dog"
            :src="`${base}hero/cachorro.png`"
            alt=""
          />
          <img
            class="hero-racao"
            :src="`${base}hero/racao.png`"
            alt=""
          />

          <img
            v-for="(src, i) in dogAvatars"
            :key="src"
            class="avatar"
            :class="`avatar-${i + 1}`"
            :src="src"
            alt=""
          />
        </div>
      </section>

      <!-- ABOUT -->
      <section class="about" id="sobre">
        <div class="about-visual" aria-hidden="true">
          <img class="about-blob" :src="`${base}about/blob.png`" alt="" />
          <img
            class="about-icon about-paw-fill about-paw-fill-1"
            :src="`${base}about/pata-azul-1.png`"
            alt=""
          />
          <img
            class="about-icon about-paw-fill about-paw-fill-2"
            :src="`${base}about/pata-azul-2.png`"
            alt=""
          />
          <img
            class="about-icon about-paw-fill about-paw-fill-3"
            :src="`${base}about/pata-azul-3.png`"
            alt=""
          />
          <img
            class="about-icon about-paw-outline about-paw-outline-1"
            :src="`${base}about/pata-outline-1.png`"
            alt=""
          />
          <img
            class="about-icon about-paw-outline about-paw-outline-2"
            :src="`${base}about/pata-outline-2.png`"
            alt=""
          />
          <img
            class="about-icon about-osso"
            :src="`${base}about/osso.svg`"
            alt=""
          />
          <img
            class="about-icon about-pote"
            :src="`${base}about/pote.png`"
            alt=""
          />
          <img
            class="about-dog"
            :src="`${base}about/cachorro.png`"
            alt=""
          />
        </div>

        <div class="about-copy">
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

      <!-- PRODUCTS -->
      <section class="products" id="doar">
        <article
          v-for="product in products"
          :key="product.name"
          class="product"
        >
          <div class="product-media" :class="`blob-${product.blob}`">
            <img :src="product.image" :alt="product.name" />
          </div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <a class="btn btn-wide" href="#doar">COMPRAR AGORA</a>
        </article>
      </section>
    </main>

    <footer class="footer">
      <p>© {{ new Date().getFullYear() }} HelpDog — Ajude quem precisa.</p>
    </footer>
  </div>
</template>
