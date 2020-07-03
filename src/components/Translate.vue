<template>
  <div>
    <div class="p-1 pb-0">
      <a-button type="primary" shape="round" v-if="actionState === false" @click="startTranslate">
        开始翻译
      </a-button>
      <a-button type="danger" shape="round" v-if="actionState === true" @click="restartTranslate">
        重新翻译
      </a-button>
    </div>
    <a-row type="flex">
      <a-col :span="14">
        <div class="p-1">
          <a-textarea placeholder="请粘贴待处理英文文本" :rows="25" v-if="actionState === false" v-model="originalText"/>
        </div>
      </a-col>
      <a-col :span="10">
        <div class="p-1">
          2 col-order-3
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Translate',
  data () {
    return {
      actionState: false,
      originalText: ''
    }
  },
  methods: {
    startTranslate () {
      if (this.originalText === '') {
        this.$message.error('请粘贴待处理英文文本后操作')

        return false
      }

      axios.put('localhost:9200/_analyze', {})

      this.actionState = true
    },
    restartTranslate () {
      this.actionState = false
    }
  }
}
</script>

<style scoped>
  .p-1 {
    padding: 1em;
  }

  .pb-0 {
    padding-bottom: 0;
  }
</style>
