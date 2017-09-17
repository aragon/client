<template>
  <ul class="nav flex-column">
    <li class="nav-item">
      <router-link :to="{ name: 'home' }" exact-active-class="active" class="nav-link">Home</router-link>
    </li>
    <li class="nav-item">
      <router-link :to="{ name: 'tokens' }" exact-active-class="active" class="nav-link">Tokens</router-link>
    </li>
  </ul>
</template>
