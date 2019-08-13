import { isSSR } from '../plugins/Platform.js'

export default {
  props: {
    value: Boolean
  },

  data () {
    return {
      showing: false
    }
  },

  watch: {
    value (val) {
      this.__processModelChange(val)
    },

    $route () {
      this.hideOnRouteChange === true && this.hide()
    }
  },

  methods: {
    toggle (evt) {
      this[this.showing === true ? 'hide' : 'show'](evt)
    },

    show (evt) {
      if (this.disable === true || (this.__showCondition !== void 0 && this.__showCondition(evt) !== true)) {
        return
      }

      if (this.$listeners.input !== void 0 && isSSR === false) {
        this.$emit('input', true)
        this.payload = evt
        this.$nextTick(() => {
          this.payload = void 0
        })
      }
      else {
        this.__processShow(evt)
      }
    },

    __processShow (evt) {
      if (this.showing === true) {
        return
      }

      this.showing = true

      this.$emit('before-show', evt)

      if (this.__show !== void 0) {
        this.__show(evt)
      }
      else {
        this.$emit('show', evt)
      }
    },

    hide (evt) {
      if (this.disable === true) {
        return
      }

      if (this.$listeners.input !== void 0 && isSSR === false) {
        this.$emit('input', false)
        this.payload = evt
        this.$nextTick(() => {
          this.payload = void 0
        })
      }
      else {
        this.__processHide(evt)
      }
    },

    __processHide (evt) {
      if (this.showing === false) {
        return
      }

      this.showing = false

      this.$emit('before-hide', evt)

      if (this.__hide !== void 0) {
        this.__hide(evt)
      }
      else {
        this.$emit('hide', evt)
      }
    },

    __processModelChange (val) {
      if (this.disable === true && val === true) {
        this.$listeners.input !== void 0 && this.$emit('input', false)
      }
      else if (val !== this.showing) {
        this[`__process${val === true ? 'Show' : 'Hide'}`](this.payload)
      }
    }
  }
}
