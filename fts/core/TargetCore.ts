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
  public static type='Targety';
  private live=true;
  protected static NoState='No state yet';
  protected state_:SimpleState=TargetCore.NoState;
  state(): SimpleState {
    return this.state_;
  }
  constructor(title:string,protected extra?:Targety[]|TargetCoupler){
    super(TargetCore.type,title);
  }
  notifiesTargeter():boolean{
    const extra=this.extra;
    return !extra?false:extra instanceof Array;
  }
  elements():Targety[]{
    if(!this.extra)this.extra=this.lazyElements();
    if(this.extra instanceof Array){
      this.extra.forEach(e=>e.setNotifiable(this));
      return this.extra;
    }
    else return [];
  }
  lazyElements():Targety[]{
    return []
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
  isLive(){
    return this.live;
  }
  setLive(live:boolean){
    this.live=live;
  }
}
