import { toPng, toJpeg, toBlob } from 'html-to-image'
import { jsPDF } from 'jspdf'
import type { ExportFormat } from '@/types'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function getFilename(format: ExportFormat): string {
  const date = new Date().toISOString().slice(0, 10)
  return `mermaid-diagram-${date}.${format}`
}

function getSvgElement(container: HTMLElement): SVGElement | null {
  return container.querySelector('svg')
}

function exportSvg(container: HTMLElement) {
  const svgEl = getSvgElement(container)
  if (!svgEl) throw new Error('SVG 요소를 찾을 수 없습니다.')

  const cloned = svgEl.cloneNode(true) as SVGElement
  const bbox = svgEl.getBoundingClientRect()
  cloned.setAttribute('width', String(bbox.width))
  cloned.setAttribute('height', String(bbox.height))
  cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const serializer = new XMLSerializer()
  const svgStr = serializer.serializeToString(cloned)
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  downloadBlob(blob, getFilename('svg'))
}

async function exportPng(container: HTMLElement) {
  const svgEl = getSvgElement(container)
  if (!svgEl) throw new Error('SVG 요소를 찾을 수 없습니다.')

  const dataUrl = await toPng(svgEl as unknown as HTMLElement, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  })
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  downloadBlob(blob, getFilename('png'))
}

async function exportJpg(container: HTMLElement) {
  const svgEl = getSvgElement(container)
  if (!svgEl) throw new Error('SVG 요소를 찾을 수 없습니다.')

  const dataUrl = await toJpeg(svgEl as unknown as HTMLElement, {
    pixelRatio: 2,
    quality: 0.95,
    backgroundColor: '#ffffff',
  })
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  downloadBlob(blob, getFilename('jpg'))
}

async function exportPdf(container: HTMLElement) {
  const svgEl = getSvgElement(container)
  if (!svgEl) throw new Error('SVG 요소를 찾을 수 없습니다.')

  const blob = await toBlob(svgEl as unknown as HTMLElement, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  })
  if (!blob) throw new Error('이미지 변환에 실패했습니다.')

  const imgUrl = URL.createObjectURL(blob)
  const img = new Image()

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = imgUrl
  })

  const { width, height } = img
  const isLandscape = width > height
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
  })

  pdf.addImage(imgUrl, 'PNG', 0, 0, width, height)
  pdf.save(getFilename('pdf'))
  URL.revokeObjectURL(imgUrl)
}

export function useExport() {
  async function exportDiagram(format: ExportFormat, container: HTMLElement | null) {
    if (!container) throw new Error('미리보기 컨테이너를 찾을 수 없습니다.')

    switch (format) {
      case 'svg':
        exportSvg(container)
        break
      case 'png':
        await exportPng(container)
        break
      case 'jpg':
        await exportJpg(container)
        break
      case 'pdf':
        await exportPdf(container)
        break
    }
  }

  return { exportDiagram }
}
