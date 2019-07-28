import { debounce } from 'lodash'

export default {
  data () {
    return {
    }
  },
  watch: {
    '$route' () {
      setTimeout(() => {
        this.resetErrorMessages()
      }, 200)
    }
  },
  methods: {
    handleValidate () {
      return new Promise((resolve, reject) => {
        this.validator.validate(
          {
            ...this.form
          },
          errors => {
            if (errors) {
              let errorFields = errors.map(err => err.field)

              Object.keys(this.form).forEach(key => {
                if (errorFields.includes(key)) {
                  this.errorMessages[key] = errors.find(err => err.field === key).message
                } else {
                  this.errorMessages[key] = ''
                }
              })
              reject(errors)
              return
            }
            for (let key in this.errorMessages) {
              this.errorMessages[key] = ''
            }
            resolve()
          }
        )
      }).catch(e => {})
    },
    handleInputChange: debounce(function () {
      this.handleValidate()
    }, 400),
    resetForm () {
      for (let key in this.form) {
        this.form[key] = ''
      }
    },
    resetErrorMessages () {
      for (let key in this.errorMessages) {
        this.errorMessages[key] = ''
      }
    }
  }
}
