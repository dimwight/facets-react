import {Notifiable,Targety,Facet} from './_globals';
import {Retargetable} from './_locals';
export interface Targeter extends Notifiable,Retargetable{
  title():string;
  target():Targety;
  setNotifiable(n:Notifiable);
  elements():Targeter[];
  attachFacet(f:Facet);
  retargetFacets();
}