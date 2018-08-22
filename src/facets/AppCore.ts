import {
  Facets,
  FacetsApp,
  Target,
} from 'facets-js';
export abstract class AppCore implements FacetsApp{
  constructor(readonly facets:Facets){
    facets.times.doTime=false;
  }
  abstract newContentTrees():Target|Target[];
  onRetargeted(activeTitle:string):void{}
  abstract buildLayout():void;
  buildSurface(){
    this.facets.buildApp(this);
  }
}