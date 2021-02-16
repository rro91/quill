import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import * as pdf from "quill-to-pdf";
import 'quill-mention';
import ImageResize from 'quill-image-resize'
import * as Quill from "quill";
Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss']
})
export class QuillComponent {

  @ViewChildren('pagesEl') set pagesF(elements) {
    this.pagesEl = elements
  };

  @ViewChildren(QuillEditorComponent) set editorsF(elements) {
    this.editors = elements
  };

  pages = [{
    page: 0,
    active: true
  }];
  pagesEl;
  editors: QueryList<QuillEditorComponent>
  options = [{id: 1, name: 'Bank details', value: '<p>Bank name</p><p>Bank Address</p>'}];
  items = [
    {
      id: 1,
      value: 'Date',
      type: 'date',
    },
    {
      id: 2,
      value: 'Description',
      type: 'desc'
    }
  ];
  savedContent = ''

  modules = {
    imageResize: true,
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["["],
      dataAttributes: ['id', 'value', 'type'],
      renderItem: (data) => {
        return data.value;
      },
      onSelect: (item, insertItem) => {
        item.value += ']'
        insertItem(item);
      },
      source: (searchTerm, renderList) => {
        console.log(searchTerm)
        if (searchTerm.length === 0) {
          renderList(this.items, searchTerm);
        } else {
          const matches = this.items.filter(item => item.value.toLowerCase().includes(searchTerm.toLowerCase()))
          renderList(matches, searchTerm);
        }
      }
    }
  };


  onChange(e, index) {
    this.setPaging(index)
  }


  onBackspace(e) {
    const key = e.key;
    const activePage = this.pages.findIndex(page => page.active);
    const editor = this.editors.toArray()[activePage].quillEditor
    const cursorPosition = editor.getSelection() ? editor.getSelection().index : null;
    const textLength = editor.getLength();
    const text = editor.getText();
    if (key === 'Backspace' && cursorPosition === 0 && textLength === 1 && activePage > 0) {
      this.removePage(activePage)
    }
  }

  setFocusedEditor(e, index) {
    this.pages.forEach(page => {
      page.active = false
    })
    this.pages.find(page => page.page === index).active = true
  }

  removePage(pageToRemove) {
    this.pages.splice(this.pages.findIndex(page => page.page === pageToRemove), 1);
    setTimeout(() => {
      this.editors.toArray()[pageToRemove - 1].quillEditor.focus()
    }, 0)
  }

  addPage(pageIndex) {
    const quill = this.editors.toArray()[pageIndex - 1].quillEditor
    const cursorPosition = quill.getSelection().index;
    quill.deleteText(cursorPosition, 1);
    const deletedText = quill.getText(cursorPosition, quill.getLength() - cursorPosition);
    quill.deleteText(cursorPosition, quill.getLength() - cursorPosition);
    if (this.editors.toArray().length === pageIndex) {
      this.pages = [...this.pages, {
        page: pageIndex,
        active: true
      }];
    }
    this.setFocusedEditor(null, pageIndex)
    setTimeout(() => {
      this.editors.toArray()[pageIndex].quillEditor.insertText(0, deletedText);
      this.editors.toArray()[pageIndex - 1].quillEditor.blur();
      this.editors.toArray()[pageIndex].quillEditor.focus()
    }, 0)

  }

  setPaging(index) {
    const pageHeight = this.pagesEl.toArray()[index].elementRef.nativeElement.children[1].children[0].offsetHeight - 24;
    const lines = this.pagesEl.toArray()[index].elementRef.nativeElement.children[1].children[0].children;
    let linesHeight = 0;
    for (let line of lines) {
      linesHeight += line.offsetHeight;
    }
    if (pageHeight < linesHeight) {
      this.addPage(index + 1);
    }
  }

  getPdf() {
    const delta = this.editors.toArray()[0].quillEditor.getContents();
    delta.ops.forEach(delta => {
      if (delta.insert.mention) {
        const type = delta.insert.mention.type;
        const value = delta.insert.mention.value
        delta.insert = value;
      }
    })
    pdf.generatePdf(delta, {exportAs: 'blob'})
      .then(blob => {
        var reader = new FileReader();
        reader.readAsDataURL(blob as Blob);
        reader.onloadend = function () {
          var base64data = reader.result;
          console.log(base64data);
        }
      })
  }

  saveData() {
    const values = [
      {
        type: 'date',
        value: new Date().toDateString()
      },
      {
        type: 'desc',
        value: 'Sample description'
      }
    ]
    const originalDelta = this.editors.toArray()[0].quillEditor.getContents();
    const delta = this.editors.toArray()[0].quillEditor.getContents();
    delta.ops.forEach(delta => {
      if (delta.insert.mention) {
        const type = delta.insert.mention.type;
        const value = values.find(el => el.type === type).value
        delta.insert = value;
      }
    })
    this.editors.toArray()[0].quillEditor.setContents(delta);
    Quill.prototype.getHtml = function() {
      return this.container.firstChild.innerHTML;
    };
    this.savedContent = this.editors.toArray()[0].quillEditor.getHtml();
    this.editors.toArray()[0].quillEditor.setContents(originalDelta);
  }

  insertText(item) {
    const activePage = this.pages.findIndex(page => page.active);
    const quill = this.editors.toArray()[activePage].quillEditor
    const cursorPosition = quill.getSelection() ? quill.getSelection().index : 0;
    quill.clipboard.dangerouslyPasteHTML(cursorPosition, item.target.value)
  }
}
