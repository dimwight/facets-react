import {
  Facets,
  IndexingCoupler,
  IndexingFramePolicy,
  newInstance,
  Target,
} from 'facets-js';
import {SurfaceApp} from '../facets/_globals';
export function launchApp(){
  new class extends SurfaceApp{
    getContentTrees():Target|Target[]{
      throw new Error("Method not implemented.");
    }
    buildLayout():void{
      throw new Error("Method not implemented.");
    }
  }(newInstance(false)).buildSurface();
}