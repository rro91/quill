import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import * as pdf from "quill-to-pdf";
import 'quill-mention';
import ImageResize from 'quill-image-resize'
import * as Quill from "quill";
import {Templates, Variables} from "../shared/constants";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
declare var SejdaJsApi;

Quill.register('modules/imageResize', ImageResize);
const BlockEmbed = Quill.import('blots/block/embed');

class keepHTML extends BlockEmbed {
  static create(node) {
    return node;
  }

  static value(node) {
    return node;
  }
};

keepHTML['blotName'] = 'keepHTML';
keepHTML['className'] = 'keepHTML';
keepHTML['tagName'] = 'div';

Quill.register(keepHTML);

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
  templates = Templates;
  variable = Variables;
  savedContent: any;
  form: FormGroup;
  documents = [{documentName: 'Doc1'}, {documentName: 'Doc2'}];
  tableElements =  [{
    shipment: '88728',
    mt: 400,
    blNo: 'MP87790',
    blDate: '25/02/2021',
    buyer: 'Ibecor',
    salesInvoiceNo: 'CGL-577823'
  },
    {
      shipment: '88728',
      mt: 400,
      blNo: 'MP87790',
      blDate: '25/02/2021',
      buyer: 'Ibecor',
      salesInvoiceNo: 'CGL-577823'
    },
    {
      shipment: '88728',
      mt: 400,
      blNo: 'MP87790',
      blDate: '25/02/2021',
      buyer: 'Ibecor',
      salesInvoiceNo: 'CGL-577823'
    }]

  modules = {
    imageResize: true,
    clipboard: {
      allowed: {
        tags: ['div', 'a', 'b', 'strong', 'u', 's', 'i', 'p', 'br', 'ul', 'ol', 'li', 'span'],
        attributes: ['href', 'rel', 'target', 'class']
      },
    },
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
          renderList(this.variable, searchTerm);
        } else {
          const matches = this.variable.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
          renderList(matches, searchTerm);
        }
      }
    }
  };

  constructor(private _fb: FormBuilder, private _sanitizer: DomSanitizer) {
    this.form = _fb.group({
      bankName: ['HSBC'],
      bankAddress: ['31 Oxford, London'],
      bankZip: ['EC4M 7AW'],
      CreationDate: [new Date().toISOString().split('T')[0]],
      reference: [''],
      saleTo: ['Czarnikow Sugar Pte Ltd CN'],
      purchase: ['Mitr Phol CN'],
      goods: ['Mt White Refined Sugar'],
      currency: ['USD'],
      amount: ['571,790.56'],
      documents: [this.documents],
      loanData: [this.tableElements]
    });
  }


  onChange(e, index) {
    // this.setPaging(index)
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

  iterate(htmlString: string): string {
    const container = document.createElement('div');
    container.innerHTML = htmlString;
    const iterations = container.querySelectorAll('.iterable') as NodeListOf<HTMLElement>;
    iterations.forEach(iterationElement => {
      const iterationContainer = iterationElement.querySelector('.iterable-container');
      const iterationItem = iterationContainer.querySelector('.iterable-item');
      const data = iterationElement.dataset.iteration;
      iterationContainer.innerHTML = '';
      this.form.value[data].forEach(value => {
        const newNode = iterationItem.cloneNode(true) as HTMLElement
        const items = newNode.querySelectorAll('.iterable-element') as NodeListOf<HTMLElement>;
        items.forEach(el => {
          const itemValue = el.dataset.value;
          el.innerHTML = value[itemValue]
        })
        iterationContainer.appendChild(newNode);
      })
    })
    return container.outerHTML;
  }

  saveData() {
    const values = this.form.value;
    const html = document.querySelector('.ql-editor').innerHTML;
    let newHtml = html.replace(/\[.+?]/g, (match, contents, offset, input_string) => {
      return values[match.slice(1, -1)] || match;
    });
    newHtml = this.iterate(newHtml);
    console.log(newHtml)
    this.savedContent = this._sanitizer.bypassSecurityTrustHtml(newHtml);
    // this.loadScript();
    SejdaJsApi.htmlToPdf({
      filename: 'Loan Letter.pdf',
      /* leave blank for one long page */
      pageSize: 'a4',
      publishableKey: 'api_public_9003794a6e4d441298e43b16efc800f0',
      pageMargin: 20.20,
      pageMarginUnits: 'px',
      pageOrientation: 'portrait',
      htmlCode: newHtml,
      always: function(){
        console.log('test')
        // PDF download should have started
      }
    });
    // const originalDelta = this.editors.toArray()[0].quillEditor.getContents();
    // const delta = this.editors.toArray()[0].quillEditor.getContents();
    // delta.ops.forEach(delta => {
    //   if (delta.insert.mention) {
    //     const type = delta.insert.mention.type;
    //     const value = values.find(el => el.type === type).value
    //     delta.insert = value;
    //   }
    //   if (delta.insert.keepHTML) {
    //     console.log(delta)
    //     console.log(delta.insert.keepHTML)
    //     console.log(delta.insert.keepHTML.outerHTML)
    //     delta.insert = delta.insert.keepHTML.outerHTML
    //   }
    //   console.log(delta)
    //   delta.insert = delta.insert.replace(/\[.+?]/g, (match, contents, offset, input_string) => {
    //     console.log(match.slice(1, -1))
    //     return values[match.slice(1, -1)];
    //   })
    // });
    // console.log(delta)
    // this.editors.toArray()[0].quillEditor.setContents(delta);
    // Quill.prototype.getHtml = function() {
    //   return this.container.firstChild.innerHTML;
    // };
    // this.savedContent = this.editors.toArray()[0].quillEditor.getHtml();
    // this.editors.toArray()[0].quillEditor.setContents(originalDelta);
    // console.log(this.savedContent);
  }

  insertText(item) {
    const activePage = this.pages.findIndex(page => page.active);
    const quill = this.editors.toArray()[activePage].quillEditor
    const cursorPosition = quill.getSelection() ? quill.getSelection().index : 0;
    console.log(item.target.value)
    quill.clipboard.dangerouslyPasteHTML(cursorPosition, item.target.value);
    console.log(quill.getContents());
  }

  loadScript() {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = 'https://www.sejda.com/js/sejda-js-api.min.js';
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
