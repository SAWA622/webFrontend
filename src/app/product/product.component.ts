// product.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Deal } from '../deal.model';
import { DealService } from '../deal.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {

  products: Product[] = []; 
  selectedProducts: Product[] = []; 
  deals: Deal[] = []; 
  
  totalPrice: number = 0; 
  bestPrice: number = 0; 

  constructor(
    private productService: ProductService,
    private dealService: DealService,
    
  ) { }

  ngOnInit(): void {
   
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
    this.dealService.getDeals().subscribe(deals => {
      this.deals = deals;
    });
    
    
  }

  
  toggleProduct(product: Product) {
    const index = this.selectedProducts.indexOf(product);
    if (index > -1) {
      
      this.selectedProducts.splice(index, 1);
    } else {
      
      this.selectedProducts.push(product);
    }
   
    this.updatePrices();
   
  }

  // Check if a product is selected or not
  isSelected(product: Product) {
    return this.selectedProducts.includes(product);
  }
//   updateSuggestions() {
//     // Reset the suggested combos array
//     this.suggestedCombos = [];
//     // Get the ids of the selected products
//     const productIds = this.selectedProducts.map(product => product._id);
//     // Filter out any undefined values from the productIds array
//     // Map any undefined values in the array to empty strings
// const mappedProductIds = productIds.map(id => id || '');

//     // If there are more than one product selected, fetch the suggested combos from the backend service
//     if (mappedProductIds.length > 1) {
//       // Pass the mapped array to the function
// this.comboService.suggestCombos(mappedProductIds).subscribe(combos => {
//   // Do something with the combos
//         this.suggestedCombos = this.combos;
//       });
//     }
//   }
 
  updatePrices() {
  
    this.totalPrice = 0;
    this.bestPrice = 0;
   
    for (let product of this.selectedProducts) {
      this.totalPrice += product.price;
    }
    
    this.bestPrice = this.totalPrice;
    
    for (let deal of this.deals) {
      
      const containsAll = this.selectedProducts.every(product =>
        deal.products.some(p => p._id === product._id)
      );
     
      if (containsAll) {
        let discountedPrice = 0;
        for (let product of deal.products) {
          discountedPrice += product.price * (1 - deal.discount / 100);
        }
        if (discountedPrice < this.bestPrice) {
          
          this.bestPrice = discountedPrice;
        }
      }
    }
    
    // for (let combo of this.suggestedCombos) {
    //   if (combo.price < this.bestPrice) {
    //     // Update the best price if
    //     // product.component.ts (continued)
    //     // Update the best price if the combo price is lower than the current best price
    //     this.bestPrice = combo.price;
    //   }
    // }
  }

  // Update the suggested combos based on the selected products
  
}
