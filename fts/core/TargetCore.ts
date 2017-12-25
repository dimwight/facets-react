import {
  Targety,
  Targeter,
} from './_globals';
import {
  TargeterCore,
  NotifyingCore,
} from './_locals';
import { SimpleState } from 'facets-js';
export class TargetCore extends NotifyingCore implements Targety {
  private readonly type='TargetCore';
  private live=true;
  protected static NoState='No state set';
  protected state_:SimpleState=TargetCore.NoState;
  state(): SimpleState {
    return this.state_;
  }
  constructor(protected readonly title_:string,private readonly elements_?:Targety[]){
    super();
  }
  notifiesTargeter():boolean{
    return this.elements_!==null;
  }
  newTargeter():Targeter{
    return new TargeterCore();
  }
  elements():Targety[]{
    return this.elements_?this.elements_:[];
  }
  title(){
    return this.title_;
  }
  updateState(update:SimpleState){
    this.state_=update;
    console.log('> Updated '+this.title()+' with state='+this.state());
  }
  isLive(){
    return this.live;
  }
}
