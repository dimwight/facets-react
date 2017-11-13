import {
  Facets,
  FacetsApp,
  Target,
} from 'facets-js';
export abstract class Surface implements FacetsApp{
  constructor(readonly facets:Facets){
    facets.times.doTime=false;
  }
  abstract getContentTrees():Target|Target[];
  onRetargeted(activeTitle:string):void{}
  abstract buildLayout():void;
  buildSurface(){
    this.facets.buildApp(this);
  }
}