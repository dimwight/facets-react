import {
   TargetCore
} from './_globals';
import { 
  IndexingCoupler,
  SimpleState
} from 'facets-js';
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
    if (!first)(this.extra as IndexingCoupler).targetStateUpdated(this.state_,this.title());
  }
  indexables(): any[] {
    const indexables: any[] = (this.extra as IndexingCoupler).getIndexables(this.title());
    if (!indexables||indexables.length === 0) 
        throw new Error('Missing or empty indexables in ' + this);
    else return indexables;
  }
  uiSelectables(): string[] {
    const getSelectable=this.thisCoupler().newUiSelectable||((i)=>(i as string));
    return this.indexables().map(i=>getSelectable(i));      
  }
  private thisCoupler(){
    return (this.extra as IndexingCoupler);
  }
  indexed(): any {
    if (this.state_===TargetCore.NoState)
      throw new Error(('No index in ' + this.title()));
    else return this.indexables()[this.state_ as number];
  }
  setIndexed(indexable: any) {
    for(const [at,i] of this.indexables().entries())
        if (i === indexable) {
            this.setIndex(i as number);
            break;
        }          
  }
  updateState(update: SimpleState) {
    this.setIndex(update as number);
  }
}
