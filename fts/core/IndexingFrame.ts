import {
  TargetCore,
  Indexing,
  Targety,
  Targeter,
} from './_globals';
import {IndexingFrameTargeter} from './_locals';
export class IndexingFrame extends TargetCore{
  constructor(title, readonly indexing_:Indexing){
    super(title);
    this.indexing_.setNotifiable(this)
  }
  indexedTarget():Targety {
    let indexed =this.indexing_.indexed();
    const type=indexed.type;
    return type&&type==='Targety'?indexed as Targety:this.newIndexedTargets(indexed)
  }
  protected newIndexedTargets(indexed:any):Targety {
    throw new Error("Not implemented in " + this.title())
  }
  indexing():Indexing {
    return this.indexing_
  }
  newTargeter():Targeter {
    return new IndexingFrameTargeter()
  }
  notifiesTargeter():boolean {
    return true
  }
}