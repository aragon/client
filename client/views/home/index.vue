<template>
  <div>
    <h1 class="main-heading">What do you want to do?</h1>
    <div class="row">
      <div class="col">
        <div class="card">
          <img src="/aragon.svg">
          <div class="card-body text-center">
            <h2 class="h6 card-title">Transfer Tokens</h2>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <img src="/aragon.svg">
          <div class="card-body text-center">
            <h2 class="h6 card-title">Assign Tokens</h2>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <img src="/aragon.svg">
          <div class="card-body text-center">
            <h2 class="h6 card-title">Vote</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="card">
          <img src="/aragon.svg">
          <div class="card-body text-center">
            <h2 class="h6 card-title">View Groups</h2>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <img src="/aragon.svg">
          <div class="card-body text-center">
            <h2 class="h6 card-title">Check Finance</h2>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <img src="/aragon.svg">
          <div class="card-body text-center">
            <h2 class="h6 card-title">New Payment</h2>
          </div>
        </div>
      </div>
    </div>
    <PriceBar></PriceBar>
  </div>
</template>

<script>
import PriceBar from 'components/home/PriceBar'

export default {
  components: {
    PriceBar
  }
}
</script>
