<template>
  <div class="generated-file">
    <a-row type="flex">
      <a-col span="13" class="p-1 pr-0">
        <div style="font-size: 1.2rem; color: #121212; font-family: 'Times New Roman', Times, serif; font-weight: bold; margin-bottom: 1rem;">
          {{ name }}
        </div>
        <hr>
        <div style="margin-top: 2rem; margin-bottom: 2rem">
          <img :src="image" :alt="name" height="200px" width="100%"/>
        </div>
        <div style="font-size: 16px; font-family: 'Times New Roman', Times, serif; line-height: 2.5rem; font-weight: 500; color: #121212;">
          <div v-html="original_text"></div>
        </div>
        <a-alert message="单词精析" style="margin-bottom: 10px; margin-top: 50px"></a-alert>
        <a-list size="small" :data-source="words" :locale="{emptyText: '暂无数据'}" bordered>
          <a-list-item slot="renderItem" class="translate-list-item-anal" slot-scope="word" v-if="word.choice && word.word" style="padding-top: 0 !important; padding-bottom: 0 !important; padding-right: 0.5rem;">
            <a-row type="flex" align="middle" justify="start" style="width: 100%">
              <a-col>
                <div style="margin-right: 0.5em; display: inline">
                  <span style="font-weight: 800; font-size: 14px; color: #335699; font-family: 'Times New Roman', Times, serif;">{{ word['word'] }}</span>
                </div>
                <div v-if="word['phonetic']" style="margin-right: 0.5em; display: inline">
                  <span style="font-size: 10px; color: #333" v-html="word['phonetic']"></span>
                </div>
                <div v-if="word['english_chinese_interpretation']" v-html="word['english_chinese_interpretation']" class="english-chinese-interpretation"></div>
                <div v-if="word['synonyms']" style="margin-right: 5px; font-size: 10px">
                  同义词：
                  <span v-html="word['synonyms']" class="synonyms"></span>
                </div>
                <div v-if="word['vocabulary_analysis'] !== emptyAnalysis" style="font-size: 10px;">
                  词汇辨析：
                  <span v-html="word['vocabulary_analysis']" class="vocabulary-analysis-anal"></span>
                </div>
                <div v-if="word['reference_example_sentences']" style="font-size: 10px;">
                  参考例句：
                  <span v-html="word['reference_example_sentences']" class="reference-example-sentences"></span>
                </div>
              </a-col>
            </a-row>
          </a-list-item>
        </a-list>
      </a-col>
      <a-col span="11" class="p-1">
        <div style="margin-bottom: 1rem">
          <a-alert
            message="中文导读"
            :description="desc"
            type="info"
          />
        </div>
        <a-list size="small" :data-source="words" :locale="{emptyText: '暂无数据'}">
          <a-list-item slot="renderItem" class="translate-list-item" slot-scope="word" v-if="!word.choice && word.word" style="padding-top: 0 !important; padding-bottom: 0 !important; padding-left: 0.5rem; padding-right: 0.5rem;">
            <a-row type="flex" align="middle" justify="start" style="width: 100%; line-height: 175%">
              <a-col>
                <div style="margin-right: 0.5em; display: inline">
                  <span style="font-weight: 800; font-size: 14px; color: #335699; font-family: 'Times New Roman', Times, serif;">{{ word['word'] }}</span>
                </div>
                <div v-if="word.phonetic" style="margin-right: 0.5em; display: inline">
                  <span style="font-size: 10px; color: #333" v-html="word['phonetic']"></span>
                </div>
                <span v-if="word.english_chinese_interpretation" v-html="word['english_chinese_interpretation']" class="english-chinese-interpretation"></span>
                <span v-if="word.reference_example_sentences" v-html="word['reference_example_sentences']" class="reference-example-sentences"></span>
              </a-col>
            </a-row>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'GeneratedFile',
  props: ['id'],
  data: () => {
    return {
      desc: '',
      image: '',
      name: '',
      original_text: '',
      words: [],
      emptyAnalysis: '<span class="vocabulary-analysis"></span><br>'
    }
  },
  mounted () {
    this.getGenerate()
  },
  methods: {
    getGenerate () {
      axios.get('/api/generate/' + this.id).then(({ data }) => {
        if (data.code === 200) {
          this.desc = data.data.desc
          this.image = data.data.image
          this.name = data.data.name
          this.words = data.data.words

          let originalText = data.data.original_text
          for (const word of this.words) {
            const reg = new RegExp(' (' + word.word + '{1,})([ ,.!?:\'])', 'gi')
            originalText = originalText.replace(reg, ' <b style="color: #981d13; font-weight: bold;">$1</b>$2')

            if (word.reference_example_sentences) {
              const re = /<div style="line-height:150%;margin-bottom:10px;font-size:14px;">1\.(.*?)<\/div>/
              let exampleSentencesList = word.reference_example_sentences.split(re)
              exampleSentencesList = exampleSentencesList[1].split('<br>')
              word.reference_example_sentences = "<span style='color: #2a6788; font-family: \"Times New Roman\", Times, serif;'>" + exampleSentencesList[0] + '</span>' + exampleSentencesList[1]
            }
          }

          this.original_text = originalText
        } else {
          this.$message.error(data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('获取数据失败！', 3)
      })
    },
    playSound (sound) {
      if (sound) {
        const audio = new Audio(sound)
        audio.play()
      }
    }
  }
}
</script>

<style scoped>
  .p-1 {
    padding: 1em;
  }

  .pr-0 {
    padding-right: 0;
  }

  .english-chinese-interpretation {
    margin-right: 0.5em;
    display: inline
  }

  .english-chinese-interpretation >>> #wordm{
    font-size: 10px !important;
    display: inline;
    line-height: 100%;
    font-weight: normal !important;
    color: #000 !important;
  }

  .english-chinese-interpretation >>> #wordm br{
    display: none;
  }

  .reference-example-sentences {
    margin-right: 0.5em;
    font-size: 10px;
    display: inline;
    color: #000 !important;
  }

  .reference-example-sentences >>> span {
    font-size: 13px !important;
  }

  .reference-example-sentences >>> a {
    display: none;
  }

  .reference-example-sentences >>> br {
    display: none;
  }

  .translate-list-item:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #981d13;
  }

  .translate-list-item {
    padding-left: 10px!important;
    width: 100%;
    position: relative;
    margin: 0 0 4px 0;
    font-size: 8px;
    background: #f2f5f7;
  }

  .translate-list-item-anal {
    width: 100%;
    position: relative;
    margin: 0 0 4px 0;
    font-size: 8px;
  }

  .synonyms >>> a {
    color: #2a6788;
    pointer-events: none;
    font-size: 12px;
  }

  .synonyms >>> br {
    display: none;
  }

  .vocabulary-analysis-anal >>> .vocabulary-analysis br {
    display: none;
  }

  .vocabulary-analysis-anal >>> a {
    color: #2a6788;
    pointer-events: none;
  }
</style>
