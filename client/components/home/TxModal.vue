<template>
  <b-modal id="modal1" title="Cool" no-close-on-esc>
    <div class="modal-dialog" role="document" id="modal-app">
      <div class="modal-content">
        <div class="modal-body" v-if="loading">
          <h3 class="text-center">loading...</h3>
        </div>
        <div v-else-if="invalidSecrets">
          <div class="modal-body">
            <h3 class="text-center text-danger">{% raw %}invalid {{ invalidSecrets }}{% endraw %}</h3>
            <br>
            <div class="form-group">
              <button type="button" v-on:click="close" class="btn btn-success btn-block">close</button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="modal-header">
            <h4 v-if="type === 'accounts'" class="title-logo modal-title text-center" id="modal-label">{% raw %}{{ currentStepP + 1 }}/2. {{ currentStepTitle }}{% endraw %}</h4>
            <h4 v-else class="title-logo modal-title text-center" id="modal-label">{% raw %}{{ currentStep + 1 }}/2. {{ currentStepTitle }}{% endraw %}</h4>
          </div>
          <div class="modal-body">
            <pre v-if="type !== 'accounts'">{% raw %}{{ rawParams }}{% endraw %}</pre>
            <br v-if="type !== 'accounts'">
            <div class="row" v-if="currentStep === 0">
              <div class="col-md-6">
                <div class="form-group">
                  <input type="number" v-model="otp" class="form-control text-center input-lg" placeholder="one time password" autocomplete="off">
                </div>
                <div class="form-group" v-if="type !== 'accounts'">
                  <input type="password" v-model="password" class="form-control text-center input-lg" placeholder="wallet password" autocomplete="off">
                </div>
              </div>
              <br class="visible-xs">
              <div class="col-md-6">
                <div class="form-group">
                  <button type="button" v-on:click="verify" class="btn btn-primary btn-block btn-lg">
                    <span v-if="type === 'accounts'">
                      get public accounts
                    </span>
                    <span v-else>
                      continue
                    </span>
                  </button>
                </div>
                <div class="form-group">
                  <button type="button" v-on:click="reject" class="btn btn-danger btn-block btn-lg">reject &amp; close</button>
                </div>
              </div>
            </div>
            <div class="row" v-if="currentStep === 1">
              <div class="col-md-6">
                <div class="form-group">
                  <button type="button" v-on:click="approve" class="btn btn-primary btn-block btn-lg">
                    <span v-if="type === 'message'">
                      sign
                    </span>
                    <span v-else>
                      approve &amp; broadcast
                    </span>
                  </button>
                </div>
              </div>
              <br class="visible-xs">
              <div class="col-md-6">
                <div class="form-group">
                  <button type="button" v-on:click="reject" class="btn btn-danger btn-block btn-lg">reject &amp; close</button>
                </div>
              </div>
            </div>
            <div class="row" v-if="currentStep === 3">
              <div class="col-md-6">
                <div class="form-group">
                  <button type="button" v-on:click="approve" class="btn btn-primary btn-block btn-lg">
                    share public accounts<br><small>(public addresses only)</small>
                  </button>
                </div>
              </div>
              <br class="visible-xs">
              <div class="col-md-6">
                <div class="form-group">
                  <button type="button" v-on:click="reject" class="btn btn-danger btn-block btn-lg">reject &amp; close</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a class="text-center" v-on:click="block">reject &amp; block this application from requesting my account again<br><small>(refresh to unblock)<small></a>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
