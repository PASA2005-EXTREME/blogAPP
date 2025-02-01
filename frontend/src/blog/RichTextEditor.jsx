import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import ListItem from '@tiptap/extension-list-item'; 
import BulletList from '@tiptap/extension-bullet-list'; 
import OrderedList from '@tiptap/extension-ordered-list'; 
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon
} from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Document,
      Paragraph,
      Text,
      ListItem,
      BulletList,
      OrderedList
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none text-white p-4 prose-li:text-white prose-ul:text-white prose-ol:text-white'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) return null;

  return (
    <div className="w-full border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
      <div className="bg-slate-800 p-2 flex flex-wrap items-center gap-1 border-b border-slate-700">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 mr-2 border-r border-slate-700 pr-2">
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={() => editor.chain().focus().toggleBold().run()}
    className={`h-8 w-8 p-0 text-white hover:bg-gray-300 hover:text-black ${
      editor.isActive('bold') ? 'bg-gray-300 text-black' : ''
    }`}
  >
    <Bold className="h-4 w-4" />
  </Button>
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={() => editor.chain().focus().toggleItalic().run()}
    className={`h-8 w-8 p-0 text-white hover:bg-gray-300 hover:text-black ${
      editor.isActive('italic') ? 'bg-gray-300 text-black' : ''  // Changed to 'italic'
    }`}
  >
    <Italic className="h-4 w-4" />
  </Button>
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={() => editor.chain().focus().toggleStrike().run()}
    className={`h-8 w-8 p-0 text-white hover:bg-gray-300 hover:text-black ${
      editor.isActive('strike') ? 'bg-gray-300 text-black' : '' 
    }`}
  >
    <Strikethrough className="h-4 w-4" />
  </Button>
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={() => editor.chain().focus().toggleCode().run()}
    className={`h-8 w-8 p-0 text-white hover:bg-gray-300 hover:text-black ${
      editor.isActive('code') ? 'bg-gray-300 text-black' : ''  // Changed to 'code'
    }`}
  >
    <Code className="h-4 w-4" />
  </Button>
</div>

        {/* Lists and Quote */}
        <div className="flex items-center gap-1 mr-2 border-r border-slate-700 pr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 hover:bg-slate-700 ${
              editor.isActive('bulletList') ? 'bg-gray-300' : ''
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 hover:bg-slate-700 ${
              editor.isActive('orderedList') ? 'bg-gray-300' : ''
            }`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 w-8 p-0 hover:bg-slate-700 ${
              editor.isActive('blockquote') ? 'bg-gray-300' : ''
            }`}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Link */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={`h-8 w-8 p-0 hover:bg-slate-700 ${
            editor.isActive('link') ? 'bg-gray-300' : ''
          }`}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0 hover:bg-slate-700"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0 hover:bg-slate-700"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EditorContent 
        editor={editor} 
        className="min-h-[200px] p-4"
      />
    </div>
  );
};

export default RichTextEditor;