<template>
  <div style="padding: 2rem">
    <h1>Image Upload Demo (Vue)</h1>
    <ImageUploader
      multiple
      @complete="handleComplete"
      @retry="handleRetry"
      :statuses="statuses"
    />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { ImageUploader, type UploadStatus, type ProcessedImage } from './index'

export default {
  components: { ImageUploader },
  setup() {
    const statuses = ref<UploadStatus[]>([])
    const images = ref<ProcessedImage[][]>([])

    const uploadBatch = async (files: ProcessedImage[], index: number) => {
      console.log('Uploading', index, files)
      setTimeout(() => {
        statuses.value[index] = 'success'
      }, 1000)
    }

    const handleComplete = async (results: ProcessedImage[][]) => {
      const start = statuses.value.length
      images.value.push(...results)
      statuses.value.push(...Array(results.length).fill('progress'))

      for (const [idx, files] of results.entries()) {
        const global = start + idx
        await uploadBatch(files, global)
      }
    }

    const handleRetry = async (index: number, files: ProcessedImage[]) => {
      statuses.value[index] = 'progress'
      await uploadBatch(files, index)
    }

    return { statuses, handleComplete, handleRetry }
  }
}
</script>
