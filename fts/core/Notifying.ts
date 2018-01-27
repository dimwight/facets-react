import {Notifiable} from './Notifiable';
export interface Notifying extends Notifiable{
  title():string;
  setNotifiable(n:Notifiable):void;
  notifiable():Notifiable;
  elements():Notifying[];
  notifyParent():void;
}