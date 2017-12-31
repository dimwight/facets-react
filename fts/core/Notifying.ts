import {Notifiable} from './Notifiable';
export interface Notifying extends Notifiable{
  title():string;
  setNotifiable(n:Notifiable);
  notifiable():Notifiable;
  elements():Notifying[];
  notifyParent();
}