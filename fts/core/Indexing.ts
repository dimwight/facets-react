import {
   TargetCore
} from './export';
import { 
  IndexingCoupler 
} from '../index';
import { SimpleState } from '../Facets';
export class Indexing extends TargetCore {  
  private indexings: any[];  
  constructor (title: string, private coupler: IndexingCoupler){
    super(title);
  }
  index(): number {
    return this.state_ as number;
  }
  setIndex(index: number) {
    const first = this.state_===TargetCore.NoState;
    this.state_ = index;
    if (!first)this.coupler.targetStateUpdated(this.state_,this.title());
  }
  indexables(): any[] {
    const indexables: any[] = this.coupler.getIndexables(this.title());
    if (!indexables||indexables.length === 0) 
        throw new Error('Missing or empty indexables in ' + this);
    else return indexables;
  }
  uiSelectables(): string[] {
    const getSelectable=this.coupler.newUiSelectable||((i)=>(i as string));
    return this.indexables().map(i=>getSelectable(i));      
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
