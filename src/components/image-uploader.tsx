"use client"

import { useRef, useState } from "react"

type ImageSlot = {
  url: string
  mode: "link" | "upload"
}

type Props = {
  images: string[]
  onChange: (images: string[]) => void
}

const MAX_IMAGES = 6

export default function ImageUploader({ images, onChange }: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [linkInputs, setLinkInputs] = useState<Record<number, string>>({})
  const [error, setError] = useState("")
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const slots: ImageSlot[] = Array.from({ length: MAX_IMAGES }, (_, i) => ({
    url: images[i] || "",
    mode: "link",
  }))

  function updateImageAt(index: number, url: string) {
    const next = [...images]
    if (url) {
      next[index] = url
    } else {
      next.splice(index, 1)
    }
    onChange(next.filter(Boolean))
  }

  function handleLinkSubmit(index: number) {
    const url = linkInputs[index]?.trim()
    if (!url) return
    try {
      new URL(url)
    } catch {
      setError("URL invalida.")
      return
    }
    setError("")
    updateImageAt(index, url)
    setLinkInputs((prev) => ({ ...prev, [index]: "" }))
  }

  async function handleFileUpload(index: number, file: File) {
    setError("")
    setUploadingIndex(index)
    console.log("[ImageUploader] Iniciando upload slot", index, file.name)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("[ImageUploader] Erro no upload:", data.error)
        setError(data.error ?? "Erro ao fazer upload.")
        return
      }

      console.log("[ImageUploader] Upload concluido:", data.url)
      updateImageAt(index, data.url)
    } catch (err) {
      console.error("[ImageUploader] Falha de conexao:", err)
      setError("Erro de conexao ao enviar imagem.")
    } finally {
      setUploadingIndex(null)
    }
  }

  function handleRemove(index: number) {
    updateImageAt(index, "")
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Fotos do produto ({images.length}/{MAX_IMAGES})
      </label>
      <p className="mb-3 text-xs text-gray-400">
        A primeira foto e a capa do produto. Cole um link ou envie do seu dispositivo.
      </p>

      {error && (
        <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {Array.from({ length: MAX_IMAGES }).map((_, index) => {
          const url = images[index]
          const isUploading = uploadingIndex === index

          if (url) {
            return (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-md border bg-gray-100">
                <img src={url} alt="" className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Capa
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition group-hover:opacity-100"
                >
                  &times;
                </button>
                <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900/80 text-[10px] text-white"
                    >
                      &larr;
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900/80 text-[10px] text-white"
                    >
                      &rarr;
                    </button>
                  )}
                </div>
              </div>
            )
          }

          if (index > images.length) {
            return (
              <div key={index} className="aspect-square rounded-md border-2 border-dashed border-gray-200 bg-gray-50" />
            )
          }

          return (
            <div key={index} className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-2">
              {isUploading ? (
                <span className="text-[10px] text-gray-400">Enviando...</span>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    ref={(el) => { fileInputRefs.current[index] = el }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(index, file)
                      e.target.value = ""
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    className="rounded bg-gray-900 px-2 py-1 text-[10px] font-medium text-white hover:bg-gray-800"
                  >
                    Enviar foto
                  </button>
                  <span className="text-[9px] text-gray-400">ou</span>
                  <input
                    type="text"
                    placeholder="Colar link"
                    value={linkInputs[index] || ""}
                    onChange={(e) => setLinkInputs((prev) => ({ ...prev, [index]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleLinkSubmit(index)
                      }
                    }}
                    onBlur={() => handleLinkSubmit(index)}
                    className="w-full rounded border border-gray-200 px-1 py-0.5 text-[9px] focus:border-gray-400 focus:outline-none"
                  />
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
