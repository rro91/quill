export interface IBank {
  id: number;
  name: string;
  address: string;
  zip: string;
}

export interface ITemplate {
  title: string;
  description: string;
  content: any;
}

export interface IItems {
  id: number;
  name: string;
}

export const Banks: IBank[] = [
  {
    id: 1,
    name: 'HSBC',
    address: 'Wall St 21',
    zip: '00-200'
  },
  {
    id: 2,
    name: 'Santander Bank',
    address: 'Wall St 21',
    zip: '00-200'
  },
  {
    id: 3,
    name: 'Credit Agricole',
    address: 'Wall St 21',
    zip: '00-200'
  }
];

export const Templates: ITemplate[] = [
  {
    title: 'Bank Details',
    description: 'Add bank name and address',
    content: '<p>[bankName]<br/>[bankAddress]<br/>[bankZip]</p>'
  },
  {
    title: 'References',
    description: 'Add main transaction reference details',
    content: '<p>Dear Sirs,<br/>Our Ref:<br/>Sale to: [saleTo]<br/>Purchase: [purchase]<br/>Goods: [goods]</p>',
  },
  {
    title: 'Subject',
    description: 'Add the main subject',
    content: '<p><u><strong>Subject: Receivable Advance Request for [currency] [amount]</strong></u></p>'
  },
  {
    title: 'Content',
    description: 'Add content',
    content: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>'
  },
  {
    title: 'Signature',
    description: '',
    content: '<div class="keepHTML" style="display: flex; justify-content: space-between"><div style="text-align: center">......................<br/>Signature</div><div style="text-align: center">......................<br/>Signature</div></div>'
  },
  {
    title: 'Supporting documents',
    description: '',
    content: '<div class="keepHTML iterable" data-iteration="documents">Supporting docs: <ul class="iterable-container"><li class="iterable-item"><span class="iterable-element" data-value="documentName">[documentName]</span></li></ul></div>'
  },
  {
    title: 'Loan table',
    description: '',
    content: '<table class="keepHTML iterable" data-iteration="loanData" style="width: 100%; text-align: center;border: 1px solid #000; border-collapse: collapse;">\n' +
      '  <thead>\n' +
      '    <tr style="background: lightgray">\n' +
      '      <th style="border: 1px solid #000">Shipment</th>\n' +
      '      <th style="border: 1px solid #000">MT</th>\n' +
      '      <th style="border: 1px solid #000">BL No.</th>\n' +
      '      <th style="border: 1px solid #000">BL Date</th>\n' +
      '      <th style="border: 1px solid #000">Buyer</th>\n' +
      '      <th style="border: 1px solid #000">Sales invoice number</th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody class="iterable-container">\n' +
      '    <tr class="iterable-item">\n' +
      '      <td style="border: 1px solid #000" class="iterable-element" data-value="shipment">[shipment]</td>\n' +
      '      <td style="border: 1px solid #000" class="iterable-element" data-value="mt">[MT]</td>\n' +
      '      <td style="border: 1px solid #000" class="iterable-element" data-value="blNo">[BL No.]</td>\n' +
      '      <td style="border: 1px solid #000" class="iterable-element" data-value="blDate">[BL Date]</td>\n' +
      '      <td style="border: 1px solid #000" class="iterable-element" data-value="buyer">[buyer]</td>\n' +
      '      <td style="border: 1px solid #000" class="iterable-element" data-value="salesInvoiceNo">[sales invoice number]</td>\n' +
      '    </tr>\n' +
      '  </tbody>\n' +
      '</table>\n'
  }
];

export const Variables: IItems[] = [
  {
    id: 1,
    name: 'CreationDate'
  }
];
