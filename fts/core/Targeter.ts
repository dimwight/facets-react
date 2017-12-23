import {Notifiable,Targety,Facet} from './export';
import {Retargetable} from './local';
export interface Targeter extends Notifiable,Retargetable{
  title():string;
  target():Targety;
  setNotifiable(n:Notifiable);
  elements():Targeter[];
  attachFacet(f:Facet);
  retargetFacets();
}