import {Notifiable} from './_globals';
import {Notifying} from './_locals';
export abstract class NotifyingCore implements Notifying{
  private notifiable_: Notifiable;
  constructor(protected readonly title_:string){}
  title(){
    return this.title_;
  }
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
    if(this.notifiable_)this.notifiable_.notify(this.title())
  }
  abstract elements():Notifying[];
}
