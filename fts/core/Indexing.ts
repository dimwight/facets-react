import {
   TargetCore
} from './_globals';
import { 
  IndexingCoupler,
  SimpleState
} from 'facets-js';
import {traceThing} from '../../src/util/Bits';
export class Indexing extends TargetCore {
  private indexings: any[];  
  constructor (title: string, coupler: IndexingCoupler){
    super(title,coupler);
    this.setIndex(coupler.passIndex?coupler.passIndex:0);
  }
  index(): number {
    return this.state_ as number;
  }
  setIndex(index: number) {
    const first = this.state_===TargetCore.NoState;
    this.state_ = index;
    if (!first){
      const updated=this.coupler().targetStateUpdated;
      if(updated)updated(this.state_,this.title());
    }
  }
  indexables(): any[] {
    const indexables: any[] = this.coupler().getIndexables(this.title());
    if (!indexables||indexables.length === 0) 
        throw new Error('Missing or empty indexables in ' + this);
    else return indexables;
  }
  uiSelectables(): string[] {
    const getSelectable=this.coupler().newUiSelectable||((i)=>(i as string));
    return this.indexables().map(i=>getSelectable(i));      
  }
  private coupler(){
    return this.extra as IndexingCoupler;
  }
  indexed(): any {
    traceThing('^indexed',{
      'indexables':this.indexables().length,
      'state_':this.state_
    });
    if (this.state_===TargetCore.NoState)
      throw new Error('No index in ' + this.title());
    else return this.indexables()[this.state_ as number];
  }
  setIndexed(indexable: any) {
    for(const [at,i] of this.indexables().entries())
        if (i === indexable) {
            this.setIndex(at as number);
            break;
        }          
  }
  updateState(update: SimpleState) {
    this.setIndex(update as number);
  }
}
