<template>
  <div class="image-uploader" :class="className" :style="style">
    <div class="preview-list">
      <label v-if="multiple || previews.length === 0" class="upload-btn">
        <span class="upload-icon">+</span>
        <span>Choose Files</span>
        <input
          type="file"
          accept="image/*"
          @change="handleChange"
          :multiple="multiple"
        />
      </label>
      <div
        v-for="(src, i) in previews"
        :key="src"
        class="preview-container"
      >
        <img :src="src" class="preview" />
        <button class="remove-btn" @click="handleRemove(i)">×</button>
        <div v-if="statuses[i]" :class="['status-overlay', statuses[i]]">
          <span class="label-text">
            {{
              statuses[i] === 'progress'
                ? 'Uploading...'
                : statuses[i] === 'success'
                ? 'Uploaded'
                : 'Failed'
            }}
          </span>
          <button
            v-if="statuses[i] === 'failed'"
            class="retry-btn"
            @click="handleRetry(i)"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
    <div v-if="progress > 0 && progress < 100" class="upload-status">
      <div class="progress">{{ progress }}%</div>
      <button class="cancel-btn" @click="handleCancel">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import type { SizeOption, ProcessedImage } from '../utils/imageProcessor'
import { processFiles } from '../utils/imageProcessor'
import '../components/ImageUploader.css'

export type UploadStatus = 'progress' | 'success' | 'failed'

export default defineComponent({
  name: 'ImageUploader',
  props: {
    multiple: Boolean,
    process: { type: Boolean, default: true },
    includeOriginal: { type: Boolean, default: false },
    sizes: {
      type: Array as PropType<SizeOption[]>,
      default: () => [
        { width: 200, name: 'thumb' },
        { width: 720, name: 'mobile' },
        { width: 1024, name: 'tablet' },
        { width: 1440, name: 'desktop' },
        { width: 1920, name: 'hd' }
      ]
    },
    className: String,
    style: [String, Object] as PropType<string | Record<string, string>>, // simple
    onComplete: Function as PropType<(results: ProcessedImage[][]) => void>,
    onRetry: Function as PropType<(index: number, files: ProcessedImage[]) => void>,
    statuses: {
      type: Array as PropType<UploadStatus[]>,
      default: () => []
    }
  },
  setup(props) {
    const progress = ref(0)
    const previews = ref<string[]>([])
    const resultsRef = ref<ProcessedImage[][]>([])
    const controller = ref<AbortController | null>(null)

    const handleChange = async (e: Event) => {
      const input = e.target as HTMLInputElement
      const files = Array.from(input.files ?? [])
      if (!files.length) return

      const urls = files.map((f) => URL.createObjectURL(f))
      previews.value = props.multiple ? [...previews.value, ...urls] : urls

      controller.value = new AbortController()
      const results = await processFiles(files, {
        process: props.process,
        includeOriginal: props.includeOriginal,
        sizes: props.sizes,
        signal: controller.value.signal,
        onProgress: (p) => (progress.value = p)
      })

      const updated = props.multiple ? [...resultsRef.value, ...results] : results
      resultsRef.value = updated
      props.onComplete?.(results)
      progress.value = 0
      input.value = ''
    }

    const handleCancel = () => {
      controller.value?.abort()
      progress.value = 0
    }

    const handleRetry = (index: number) => {
      const files = resultsRef.value[index]
      props.onRetry?.(index, files)
    }

    const handleRemove = (index: number) => {
      previews.value = previews.value.filter((_, i) => i !== index)
      resultsRef.value = resultsRef.value.filter((_, i) => i !== index)
      props.onComplete?.(resultsRef.value)
    }

    return {
      progress,
      previews,
      handleChange,
      handleCancel,
      handleRetry,
      handleRemove,
      statuses: props.statuses,
      multiple: props.multiple,
      className: props.className,
      style: props.style
    }
  }
})
</script>
