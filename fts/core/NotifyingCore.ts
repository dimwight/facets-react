import {Notifiable} from './export';
import {Notifying} from './local';
export abstract class NotifyingCore implements Notifying{
  private notifiable_: Notifiable;
  setNotifiable(n: Notifiable) {
    this.notifiable_=n;
  }
  notifiable(): Notifiable {
    return this.notifiable_;
  }
  notifyParent() {
    this.notifiable_.notify(this);
  }
  notify(notice: any) {
    throw new Error('Method not implemented.');
  }
  abstract elements():Notifying[];
}
