import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsService {

  AuthCode:Number=0;//1 is Student; 2 is Admin ; 0 is invalid.
  constructor() { 
  }
  
}
