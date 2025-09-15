"use client";
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconH1,
  IconH2,
  IconH3,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconUnderline,
  IconUnlink,
} from "@tabler/icons-react";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="border-b py-2 flex flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("bold") && "bg-accent")}
        title="Жирный"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <IconBold size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("italic") && "bg-accent")}
        title="Курсив"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <IconItalic size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("underline") && "bg-accent")}
        title="Подчеркнутый"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <IconUnderline size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("strike") && "bg-accent")}
        title="Зачеркнутый"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <IconStrikethrough size={14} />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("heading", { level: 1 }) && "bg-accent")}
        title="Заголовок 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <IconH1 size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("heading", { level: 2 }) && "bg-accent")}
        title="Заголовок 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <IconH2 size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("heading", { level: 3 }) && "bg-accent")}
        title="Заголовок 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <IconH3 size={14} />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("bulletList") && "bg-accent")}
        title="Маркированный список"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <IconList size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("orderedList") && "bg-accent")}
        title="Нумерованный список"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <IconListNumbers size={14} />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive({ textAlign: "left" }) && "bg-accent")}
        title="По левому краю"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <IconAlignLeft size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive({ textAlign: "center" }) && "bg-accent")}
        title="По центру"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <IconAlignCenter size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive({ textAlign: "right" }) && "bg-accent")}
        title="По правому краю"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <IconAlignRight size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive({ textAlign: "justify" }) && "bg-accent")}
        title="По ширине"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <IconAlignJustified size={14} />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        className={cn(editor.isActive("link") && "bg-accent")}
        title="Добавить ссылку"
        onClick={setLink}
      >
        <IconLink size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        title="Убрать ссылку"
        onClick={unsetLink}
      >
        <IconUnlink size={14} />
      </Button>
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none p-3 min-h-[120px]",
        ...(placeholder && { "data-placeholder": placeholder }),
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "border border-input rounded-md overflow-hidden",
          className,
        )}
      >
        <div className="border-b border-border p-2 flex flex-wrap gap-1">
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
        <div className="min-h-[120px] p-3 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border border-input rounded-md overflow-hidden",
        className,
      )}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[120px]"
        placeholder={placeholder}
      />
    </div>
  );
};
