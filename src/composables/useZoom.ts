import { ref, watch, onUnmounted } from 'vue'

const ZOOM_STEP = 0.25
const MIN_SCALE = 0.1
const MAX_SCALE = 10

export function useZoom(
  targetRef: Readonly<{ value: HTMLElement | null }>,
  containerRef: Readonly<{ value: HTMLElement | null }>,
) {
  const currentScale = ref(1)
  let tx = 0
  let ty = 0
  let isPanning = false
  let lastX = 0
  let lastY = 0

  function applyTransform(scale: number, x: number, y: number) {
    currentScale.value = scale
    tx = x
    ty = y
    if (targetRef.value) {
      targetRef.value.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
    }
  }

  function zoomAtPoint(clientX: number, clientY: number, newScale: number) {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    // 컨테이너 상대 좌표
    const mx = clientX - rect.left
    const my = clientY - rect.top
    // 현재 transform 기준 scene 좌표
    const sceneX = (mx - tx) / currentScale.value
    const sceneY = (my - ty) / currentScale.value
    // zoom 후에도 같은 scene 좌표가 같은 화면 위치에 오도록 offset 재계산
    applyTransform(newScale, mx - sceneX * newScale, my - sceneY * newScale)
  }

  function zoomIn() {
    if (!containerRef.value) return
    const newScale = Math.min(MAX_SCALE, parseFloat((currentScale.value + ZOOM_STEP).toFixed(4)))
    const rect = containerRef.value.getBoundingClientRect()
    const cx = rect.left + containerRef.value.clientWidth / 2
    const cy = rect.top + containerRef.value.clientHeight / 2
    zoomAtPoint(cx, cy, newScale)
  }

  function zoomOut() {
    if (!containerRef.value) return
    const newScale = Math.max(MIN_SCALE, parseFloat((currentScale.value - ZOOM_STEP).toFixed(4)))
    const rect = containerRef.value.getBoundingClientRect()
    const cx = rect.left + containerRef.value.clientWidth / 2
    const cy = rect.top + containerRef.value.clientHeight / 2
    zoomAtPoint(cx, cy, newScale)
  }

  function fit() {
    if (!targetRef.value || !containerRef.value) return
    const svgEl = targetRef.value.querySelector('svg')
    if (!svgEl) return

    // SVG 자연 크기: width/height 속성 또는 viewBox에서 읽기
    const svgW =
      parseFloat(svgEl.getAttribute('width') || '0') ||
      (svgEl as SVGSVGElement).viewBox?.baseVal?.width ||
      0
    const svgH =
      parseFloat(svgEl.getAttribute('height') || '0') ||
      (svgEl as SVGSVGElement).viewBox?.baseVal?.height ||
      0

    const cw = containerRef.value.clientWidth
    const ch = containerRef.value.clientHeight

    if (!svgW || !svgH || !cw || !ch) return

    const padding = 40
    const newScale = Math.min((cw - padding * 2) / svgW, (ch - padding * 2) / svgH, 1)
    const newTx = (cw - svgW * newScale) / 2
    const newTy = (ch - svgH * newScale) / 2

    applyTransform(newScale, newTx, newTy)
  }

  function reset() {
    applyTransform(1, 0, 0)
  }

  // ── 이벤트 핸들러 ──────────────────────────────────────────
  function onWheel(e: WheelEvent) {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, currentScale.value * factor))
    zoomAtPoint(e.clientX, e.clientY, newScale)
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return
    isPanning = true
    lastX = e.clientX
    lastY = e.clientY
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    if (containerRef.value) containerRef.value.style.cursor = 'grabbing'
  }

  function onPointerMove(e: PointerEvent) {
    if (!isPanning) return
    applyTransform(currentScale.value, tx + (e.clientX - lastX), ty + (e.clientY - lastY))
    lastX = e.clientX
    lastY = e.clientY
  }

  function onPointerUp(e: PointerEvent) {
    if (!isPanning) return
    isPanning = false
    ;(e.currentTarget as HTMLElement)?.releasePointerCapture(e.pointerId)
    if (containerRef.value) containerRef.value.style.cursor = 'grab'
  }

  // ── 컨테이너에 이벤트 연결 ─────────────────────────────────
  let cleanups: Array<() => void> = []

  watch(
    () => containerRef.value,
    (container) => {
      cleanups.forEach((fn) => fn())
      cleanups = []
      if (!container) return

      container.addEventListener('wheel', onWheel, { passive: false })
      container.addEventListener('pointerdown', onPointerDown)
      container.addEventListener('pointermove', onPointerMove)
      container.addEventListener('pointerup', onPointerUp)
      container.addEventListener('pointercancel', onPointerUp)

      cleanups = [
        () => container.removeEventListener('wheel', onWheel),
        () => container.removeEventListener('pointerdown', onPointerDown),
        () => container.removeEventListener('pointermove', onPointerMove),
        () => container.removeEventListener('pointerup', onPointerUp),
        () => container.removeEventListener('pointercancel', onPointerUp),
      ]
    },
    { immediate: true },
  )

  onUnmounted(() => cleanups.forEach((fn) => fn()))

  return { zoomIn, zoomOut, fit, reset, currentScale }
}
