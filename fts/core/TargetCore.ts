import {
  Targety,
  Targeter,
} from './_globals';
import {
  TargeterCore,
  NotifyingCore,
} from './_locals';
import {
  SimpleState,
  TargetCoupler,
} from 'facets-js';
export class TargetCore extends NotifyingCore implements Targety {
  private live=true;
  protected static NoState='No state set';
  protected state_:SimpleState=TargetCore.NoState;
  state(): SimpleState {
    return this.state_;
  }
  constructor(protected readonly title_:string,
              protected readonly extra?:Targety[]|TargetCoupler){
    super();
  }
  notifiesTargeter():boolean{
    const extra=this.extra;
    return extra&&extra instanceof Array;
  }
  elements():Targety[]{
    const extra=this.extra;
    if(extra&&extra instanceof Array){
      extra.forEach(e=>e.setNotifiable(this));
      return extra;
    }
    else return[];
  }
  updateState(update:SimpleState){
    this.state_=update;
    const extra=this.extra;
    const updater=!extra||extra instanceof Array?null
      :(extra as TargetCoupler).targetStateUpdated;
    if(updater)updater(this.state(),this.title())
  }
  newTargeter():Targeter{
    return new TargeterCore();
  }
  title(){
    return this.title_;
  }
  isLive(){
    return this.live;
  }
  setLive(live:boolean){
    this.live=live;
  }
}
