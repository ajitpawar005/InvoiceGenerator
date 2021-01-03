import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

import *  as  data from 'src/assets/data.json';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  InvoiceForm: FormGroup;
  productList: FormArray;
  totalAmt: any;

  itemList: any;
  selectedItems = [];
  settings = {};

  products: any = (data as any).default;
  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {

    this.InvoiceForm = this.fb.group({
      customerName: new FormControl("", [Validators.required]),
      productList: this.fb.array([]),
    });
    this.addProduct();

    this.InvoiceForm.valueChanges.subscribe(val => {
      this.totalAmt = this.InvoiceForm.value.productList.reduce((sum, p) => sum + (p.qty * p.price), 0)
    });

    this.itemList = this.products;
    this.selectedItems = [];
    this.settings = {
      enableSearchFilter: true,
      singleSelection: true, text: "Select Product"
    };
  }

  newProductList() {
    return this.fb.group({
      name: new FormControl('', [Validators.required]),
      mrp: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required])
    })
  }
  addProduct() {
    this.productList = this.InvoiceForm.get('productList') as FormArray;
    this.productList.push(this.newProductList());
  }

  removProduct(i: number) {
    this.productList.removeAt(i);
  }
  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: '#105694'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.InvoiceForm.value.customerName,
                bold: true
              }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              }
              // {
              //   text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
              //   alignment: 'right'
              // }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              ['Sr', 'Product', 'Price', 'Quantity', 'Amount'],
              ...this.InvoiceForm.value.productList.map((p, index) => ([index + 1, p.name[0].itemName, p.price, p.qty,
              {
                text: `${(p.price * p.qty).toFixed(2)}`,
                alignment: 'right'
              },])),
              [{ text: 'Total Amount', colSpan: 4, alignment: 'right' }, {}, {}, {}, {text :`₹${this.InvoiceForm.value.productList.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2)}`,alignment: 'right'}]
            ]
          }
        },
        {
          text: '',
          style: 'sectionHeader'
        },

        {
          text: '',
          style: 'sectionHeader'
        },
        {
          columns: [
            // [{ qr: `${ this.InvoiceForm.value.customerName}`, fit: '50' }],
            [{ text: 'Customer Signature', alignment: 'left', italics: true }],
            [{ text: 'Authorized Signature', alignment: 'right', italics: true }],
          ]
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }

  }

  onItemSelect(item: any) {
  }

  myFunc() {
    alert("Please Enter Required Information");
  }


}
