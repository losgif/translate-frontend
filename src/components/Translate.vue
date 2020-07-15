<template>
  <div>
    <div class="p-1 pb-0">
      <template v-if="actionState === false">
        <a-button type="primary" shape="round" @click="startTranslate" :loading="loading">
          开始翻译
        </a-button>
      </template>
      <template v-if="actionState === true">
        <a-button type="danger" shape="round" @click="restartTranslate" class="mr-1">
          重新翻译
        </a-button>
        <a-button type="default" shape="round" @click="generatePDFModalVisible = !generatePDFModalVisible">
          {{ generatePDFModalVisible ? '返回' : '生成PDF文件' }}
        </a-button>
      </template>
    </div>
    <a-row type="flex" v-if="generatePDFModalVisible">
      <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="p-1">
        <a-form
          :form="form"
        >
          <a-form-item ref="name" label="标题" prop="name">
            <a-input placeholder="请填写标题" v-decorator="['name', { initialValue: '', rules: [{required: true, message: '请填写标题'}] }]"/>
          </a-form-item>
          <a-form-item label="中文导读" prop="desc">
            <a-input type="textarea" placeholder="请填写中文导读" v-decorator="['desc', { initialValue: '', rules: [{required: true, message: '请填写中文导读'}] }]"/>
          </a-form-item>
          <a-form-item label="图片">
            <a-upload
              v-decorator="[
                  'image',
                  {
                    initialValue: [],
                    rules: [{required: true, message: '请上传照片'}, {validator: validatorFile}],
                    valuePropName: 'fileList',
                    getValueFromEvent: normFile,
                  },
                ]"
              name="file"
              @change="handleChange"
              action="https://up-z0.qiniup.com/"
              :defaultFileList="this.defaultFileList"
              :data="() => this.getUploadToken()"
              :beforeUpload="beforeUpload"
              list-type="picture"
            >
              <a-button> <a-icon type="upload" /> 点击上传 </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item class="center">
            <a-button type="primary" @click="goGeneratedFile">开始生成</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <a-row type="flex" v-else>
      <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="p-1">
          <quill-editor
            v-model="originalText"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
          </quill-editor>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="p-1">
          <a-list size="small" bordered :data-source="words" :locale="{emptyText: '暂无数据'}" :loading="loading">
            <a-list-item slot="renderItem" slot-scope="word, index" v-if="word.word">
              <a-row type="flex" align="middle" justify="space-between" style="width: 100%">
                <a-col span="16">
                  <a-row type="flex" align="middle">
                    <a-col>
                      <div style="margin-right: 0.5em;">
                        <span style="font-weight: 800; font-size: 1.5em">{{ word['word'] }}</span>
                      </div>
                    </a-col>
                    <a-col v-if="word['phonetic']">
                      <div style="margin-right: 0.5em;">
                        <span style="font-size: 1em; color: #333" v-html="word['phonetic']"></span>
                      </div>
                    </a-col>
                    <a-col v-if="word['voice']">
                      <div style="margin-right: 0.5em;">
                        <img src="http://img.kekenet.com/dict/image/sound.gif" alt="点击发音" @click="playSound(word['voice'])">
                      </div>
                    </a-col>
                    <a-col v-if="word['english_chinese_interpretation']">
                      <div v-html="word['english_chinese_interpretation']" class="english-chinese-interpretation"></div>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col span="8" v-if="word.word !== '加载中...'">
                  <a-row type="flex" align="middle" justify="end">
                    <a-col>
                      <a-button
                        :ghost="!words[index].choice"
                        type="primary"
                        size="small"
                        shape="round"
                        style="margin-right: 0.5em"
                        @click="changeChoice(index)">
                        {{ words[index].choice ? '取消' : '精析' }}
                      </a-button>
                    </a-col>
                    <a-col>
                      <a-button type="default" size="small" shape="round" style="margin-right: 0.5em" @click="closeWord(index)">
                        关闭
                      </a-button>
                    </a-col>
                    <a-col>
                      <a-popconfirm
                        title="此操作不可逆转,确定拉黑?"
                        ok-text="拉黑"
                        cancel-text="取消"
                        @confirm="putBlockList(index)"
                      >
                        <a-button ghost type="danger" size="small" shape="round">
                          拉黑
                        </a-button>
                      </a-popconfirm>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-list-item>
          </a-list>
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
      originalText: '',
      loading: false,
      words: [],
      generatePDFModalVisible: false,
      form: this.$form.createForm(this),
      token: '',
      domain: '',
      defaultFileList: [],
      editorOption: {
        theme: 'snow'
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    onEditorReady (editor) { // 准备编辑器
    },
    onEditorBlur () { // 失去焦点事件
    },
    onEditorFocus () { // 获得焦点事件
    },
    onEditorChange () { // 内容改变事件
    },
    startTranslate () {
      if (this.originalText === '') {
        this.$message.error('请粘贴待处理英文文本后操作')

        return false
      }

      this.loading = true
      this.words = [
        {
          word: '加载中...'
        }
      ]

      axios.post('/api/translate/analyze', {
        text: this.originalText,
        force: true
      }).then(({ data }) => {
        this.actionState = true
        this.words = data.data.words
        this.originalText = data.data.text

        for (let i = 0; i < this.words.length; i++) {
          this.words[i].choice = false
        }
      }).catch((err) => {
        if (err.response.data.code === 403) {
          this.$confirm({
            title: '⚠系统警告',
            content: err.response.data.message,
            cancelText: '关闭',
            okText: '继续操作',
            onOk: () => {
              return axios.post('/api/translate/analyze', {
                text: this.originalText,
                force: false
              }).then(({ data }) => {
                if (data.code === 200) {
                  this.actionState = true
                  this.words = data.data.words
                  this.originalText = data.data.text

                  for (let i = 0; i < this.words.length; i++) {
                    this.words[i].choice = false
                  }
                } else {
                  this.words = []

                  this.$message.error(data.message)
                }
              })
            }
          })
        } else {
          this.words = []

          this.$message.error(err.response.data.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    restartTranslate () {
      this.actionState = false
      this.generatePDFModalVisible = false
      this.words = []
    },
    changeChoice (index) {
      const words = this.words
      this.words = []
      words[index].choice = !words[index].choice
      this.words = words
    },
    closeWord (index) {
      const words = this.words
      this.words = []
      words.splice(index, 1)
      this.words = words
    },
    putBlockList (index) {
      axios.post('/api/blacklist', {
        word: this.words[index].word
      }).then(({ data }) => {
        if (data.code === 200) {
          const words = this.words
          this.words = []
          words.splice(index, 1)
          this.words = words
        } else {
          this.$message.error(data.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('系统错误')
      })
    },
    playSound (sound) {
      if (sound) {
        const audio = new Audio(sound)
        audio.play()
      }
    },
    goGeneratedFile () {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          values.words = this.words
          values.original_text = this.originalText
          values.image = values.image[0].url

          await axios.post('/api/generate', values).then(({ data }) => {
            if (data.code === 200) {
              this.$router.push('/generated-file/' + data.data)
            } else {
              this.$message.error(data.message)
            }
          }).catch(() => {
            this.$message.error('上传失败！', 3)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getUploadToken () {
      return {
        token: this.token
      }
    },
    async beforeUpload (file) {
      await this.fetchUploadToken(file)

      return true
    },
    async fetchUploadToken () {
      await axios.post('https://vip.hanxiaocong.cn/api/upload/fetchToken').then(({ data }) => {
        this.token = data.data.token
        this.domain = data.data.domain
      }).catch(() => {
        this.$message.error('上传失败！', 3)
      })
    },
    validatorFile (rule, value, callback) {
      try {
        if (value.length !== 0 && value[0].response !== undefined && value[0].response.key === undefined) {
          throw new Error(value[0].response.message)
        }
        callback()
      } catch (err) {
        callback(err.message)
      }
    },
    normFile (e) {
      let fileList = [...e.fileList]

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1)

      // 2. read from response and show file link
      fileList = fileList.map(file => {
        if (file.response !== undefined && file.response.key !== undefined) {
          // Component will show file.url as link
          file.url = this.domain + file.response.key
        }
        return file
      })

      e.fileList = fileList

      return e.fileList
    },
    handleChange (info) {
      if (info.file.status === 'done' || info.file.status === 'error') {
        if (info.file.response.key !== undefined) {
          this.$message.success(`${info.file.name} 素材上传成功`, 3)
        } else {
          this.$message.error('上传失败！', 3)
        }
      }
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

  .mr-1 {
    margin-right: 1em;
  }

  .english-chinese-interpretation {
    margin-right: 0.5em;
  }

  .english-chinese-interpretation >>> #wordm{
    font-size: 0.2em !important;
  }
</style>
