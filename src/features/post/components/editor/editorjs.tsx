/* eslint-disable react-hooks/exhaustive-deps */
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import { Fragment, useCallback, useEffect } from 'react';

interface EditorProps {
  id: string;
  autofocus: boolean;
  editorRef: { current: EditorJS | null };
  formId: string;
  initAction: (editor: EditorJS) => void;
}

const Editor = ({
  id,
  autofocus = false,
  editorRef,
  formId,
  initAction,
}: EditorProps) => {
  // const { noCodeForm, isLoadingNoCodeForm, mutateNoCodeForm } =
  //   useNoCodeForm(formId);

  const keyPressListener = useCallback((e) => {
    if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      alert('snoopForms autosaves your work ✌️');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keyPressListener);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', keyPressListener);
    };
  }, [keyPressListener]);

  // This will run only once
  useEffect(() => {
    // if (!isLoadingNoCodeForm) {
    //   if (!editorRef.current) {
    //     initEditor();
    //   }
    // }
    if (!editorRef.current) {
      initEditor();
    }
    return () => {
      destroyEditor();
    };
    async function destroyEditor() {
      await editorRef.current.isReady;
      editorRef.current.destroy();
      editorRef.current = null;
    }
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      minHeight: 0,
      holder: id,
      data: { blocks: noCodeForm.blocksDraft },
      onReady: () => {
        editorRef.current = editor;
        new DragDrop(editor);
        new Undo({ editor });
        if (editor.blocks.getBlocksCount() === 1) {
          initAction(editor);
        }
      },
      onChange: async () => {
        const content = await editor.saver.save();
        const newNoCodeForm = JSON.parse(JSON.stringify(noCodeForm));
        newNoCodeForm.blocksDraft = content.blocks;
        await persistNoCodeForm(newNoCodeForm);
        mutateNoCodeForm(newNoCodeForm);
      },
      autofocus: autofocus,
      defaultBlock: 'paragraph',
      tools: {
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          config: {
            placeholder:
              'Start with your content or hit tab-key to insert block',
          },
        },
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3],
            defaultLevel: 1,
          },
        },
      },
    });
  };

  return (
    <Fragment>
      <div id={id} />
    </Fragment>
  );
};

export default Editor;
