"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Underline from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import { TextStyle } from "@tiptap/extension-text-style"
import FontFamily from "@tiptap/extension-font-family"
import Color from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import { useState } from "react"

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {}
          return { style: `font-size: ${attributes.fontSize}` }
        },
      },
    }
  },
})

interface Props {
  content: string
  onChange: (html: string) => void
}

const FONT_SIZES = [
  { label: "Small", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Large", value: "20px" },
  { label: "XL", value: "26px" },
  { label: "Huge", value: "34px" },
]

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      style={{
        background: active ? "var(--color-line-2)" : "var(--color-paper)",
        color: active ? "var(--color-accent)" : "var(--color-ink-2)",
        border: "1px solid var(--color-line)",
      }}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ content, onChange }: Props) {
  const [imageUrl, setImageUrl] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      FontSize,
      Color,
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-4 max-w-full" } }),
      Placeholder.configure({ placeholder: "Write your post... share news, updates, screenshots..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-editor min-h-[240px] px-4 py-3 focus:outline-none text-ink-2",
      },
    },
  })

  if (!editor) return null

  function setFontSize(size: string) {
    editor!.chain().focus().setMark("textStyle", { fontSize: size }).run()
  }

  function insertImage() {
    if (imageUrl.trim()) {
      editor!.chain().focus().setImage({ src: imageUrl.trim() }).run()
      setImageUrl("")
      setShowImageInput(false)
    }
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-line-2)", background: "var(--color-surface)" }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2" style={{ borderBottom: "1px solid var(--color-line)" }}>
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton title="Strike" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <s>S</s>
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ background: "var(--color-line-2)" }} />

        <ToolbarButton title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton title="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
          P
        </ToolbarButton>

        <select
          className="px-2 py-1.5 rounded-lg text-xs font-semibold outline-none"
          style={{ background: "var(--color-paper)", color: "var(--color-ink-2)", border: "1px solid var(--color-line)" }}
          onChange={(e) => setFontSize(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <div className="w-px h-5 mx-1" style={{ background: "var(--color-line-2)" }} />

        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          "
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ background: "var(--color-line-2)" }} />

        <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          ⯇
        </ToolbarButton>
        <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          ◆
        </ToolbarButton>
        <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          ⯈
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ background: "var(--color-line-2)" }} />

        <ToolbarButton title="Insert image" onClick={() => setShowImageInput((v) => !v)}>
          🖼 Image
        </ToolbarButton>
      </div>

      {showImageInput && (
        <div className="flex gap-2 p-3" style={{ borderBottom: "1px solid var(--color-line)" }}>
          <input
            type="text"
            placeholder="Paste image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), insertImage())}
            className="flex-1 px-3 py-2 rounded-lg text-sm text-ink placeholder:text-ink-3/70 outline-none"
            style={{ background: "var(--color-paper)", border: "1px solid var(--color-line-2)" }}
          />
          <button
            type="button"
            onClick={insertImage}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-ink"
            style={{ background: "var(--color-ink)" }}
          >
            Insert
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
