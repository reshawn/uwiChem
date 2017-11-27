import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsService {

  AuthCode:string='0';//1 is Student; 2 is Admin ; 0 is invalid.
  constructor() { 
  }
  
}
