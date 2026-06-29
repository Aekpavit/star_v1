<!-- <script setup>
const links = [
  { label: 'main', href: '#main' },
  { label: 'main', href: '#main' },
  { label: 'main', href: '#main' },
  { label: 'main', href: '#main' },
]
</script>

<template>
  <nav class="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-xl shadow-slate-950/30">
    <div class="mx-auto grid max-w-7xl items-center justify-start px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-bold text-slate-950 shadow-lg shadow-cyan-500/25">
          PF
        </div> -->
        <!-- <div>
          <p class="text-base font-semibold text-white">Star Draw</p>
          <p class="text-sm text-slate-400">Sketch UI with Vue + Tailwind</p>
        </div> -->
      <!-- </div>

      <ul class="mt-4 flex flex-col items-start gap-3 md:flex">
        <li v-for="item in links" :key="item.label">
          <a :href="item.href" class="text-sm font-medium text-slate-300 transition hover:text-white">
            {{ item.label }}
          </a>
        </li>
      </ul> -->

      <!-- <div class="flex items-center gap-3">
        <button class="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:bg-slate-800">
          Start drawing
        </button>
        <button class="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
          Upgrade
        </button>
      </div> -->

    <!-- </div>
  </nav>
</template> -->

<script setup>
const links = [
  { label: 'Home', href: '#home' },
  { label: 'Canvas', href: '#canvas' },
  { label: 'Layers', href: '#layers' },
  { label: 'Settings', href: '#settings' },
]
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 shadow-xl shadow-slate-950/40"
  >
    <div class="flex h-full flex-col p-6">

      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-bold text-slate-950"
        >
          PF
        </div>

        <div>
          <h1 class="text-lg font-bold text-white">
            Star Draw
          </h1>

          <p class="text-xs text-slate-400">
            Vue + Tailwind
          </p>
        </div>
      </div>

      <!-- Menu -->
      <ul class="mt-10 flex flex-col gap-2">
        <li
          v-for="item in links"
          :key="item.label"
        >
          <a
            :href="item.href"
            class="block rounded-xl px-4 py-3 text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-cyan-400"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <!-- Bottom -->
      <div class="mt-auto">
        <button
          class="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          New Project
        </button>
      </div>

    </div>
  </aside>
</template>
