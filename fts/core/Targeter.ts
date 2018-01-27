import {
  Facet,
  Notifiable,
  Targety,
} from './_globals';
import {
  Notifying,
  Retargetable,
} from './_locals';
export interface Targeter extends Notifying,Notifiable,Retargetable{
  target():Targety;
  elements():Targeter[];
  attachFacet(f:Facet):void;
  retargetFacets():void;
}