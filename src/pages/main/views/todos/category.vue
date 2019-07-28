<template>
  <div class="categories">
    <van-popup
      class="category-popup"
      v-model="visible"
      position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        value-key="label"
        ref="picker"
        @cancel="handleCancel"
        @confirm="handleConfirm">
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import { categories } from './vars'

export default {
  name: 'Categories',
  props: {
    value: Boolean,
    defaultValue: {
      type: [String, Number],
      default: 'unclassified'
    }
  },
  data () {
    return {
      visible: false,
      columns: [
        {
          values: categories,
          textAlign: 'center'
        }
      ],
      claValue: ''
    }
  },
  computed: {
    defaultSelectIndex () {
      let index = categories.findIndex(cla => cla.value === this.defaultValue)
      return index > -1 ? index : 0
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('input', val)
      val && this.handleResetValue()
    },
    defaultValue: {
      handler (val) {
        this.claValue = val
      },
      immediate: true
    }
  },
  methods: {
    handleResetValue () {
      this.$nextTick(() => {
        this.$refs.picker.setColumnIndex(0, this.defaultSelectIndex)
      })
    },
    handleCancel () {
      this.visible = false
    },
    handleConfirm (val) {
      this.claValue = val[0].value
      this.$emit('change', this.claValue)
      this.visible = false
    }
  }
}
</script>
