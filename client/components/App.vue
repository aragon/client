<style src="scss/base.scss" lang="sass"></style>

<template>
  <div class="container-fluid full-height">
    <div class="row full-height">
      <div class="col-1 left-panel">
        <div>
          <img src="/aragon.svg" class="d-inline-block align-top" alt="Aragon Logo">
        </div>
      </div>
      <div class="col-2 left-panel">
        <MainNavbar></MainNavbar>
        <small class="text-muted app-label">Apps</small>
        <AppList></AppList>
      </div>
      <div class="col-9 full-height right-panel">
        <router-view class="navbar navbar-light bg-white app-navbar" name="navbar"></router-view>
        <div class="row full-height">
          <router-view class="col-8 full-height scrollable app-panel" name="main"></router-view>
          <router-view class="col-4 full-height scrollable action-panel" name="action"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap-vue/dist/bootstrap-vue.css'

import MainNavbar from 'components/MainNavbar'
import AppList from 'components/AppList'

export default {
  components: {
    MainNavbar,
    AppList
  }
}
</script>
