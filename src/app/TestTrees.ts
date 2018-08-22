import {
  Facets,
  IndexingCoupler,
  IndexingFramePolicy,
  Target,
} from 'facets-js';
import {
  Selecting,
  ScrollableList,
  SelectingTitles,
  SimpleTitles,
  Texts,
} from './_globals';
import {traceThing} from '../util/_globals';
export namespace Trees{
  export function newTextual(facets:Facets){
    const first=facets.newTextualTarget(SimpleTitles.FirstTextual,{
        passText:'Some text for '+SimpleTitles.FirstTextual,
        targetStateUpdated:state=>{
          facets.updateTarget(SimpleTitles.SecondTextual,
            SimpleTitles.FirstTextual+' has changed to: '+state);
        },
      }),
      second=facets.newTextualTarget(SimpleTitles.SecondTextual,{
        passText:'Some text for '+SimpleTitles.SecondTextual,
      });
    return facets.newTargetGroup('TextualTest',[first,second]);
  }
  export function newToggling(facets:Facets,setLive:boolean){
    const toggling=facets.newTogglingTarget(SimpleTitles.Toggling,{
        passSet:SimpleTitles.ToggleStart,
        targetStateUpdated:state=>{
          if(setLive) Trees.setSimplesLive(facets,state as boolean)
        },
      }),
      toggled=facets.newTextualTarget(SimpleTitles.Toggled,{
        getText:()=>facets.getTargetState(SimpleTitles.Toggling)as boolean?'Set':'Not set',
      });
    return facets.newTargetGroup('TogglingTest',[toggling,toggled]);
  }
  export function newTrigger(facets:Facets){
    let triggers:number=0;
    const trigger=facets.newTriggerTarget(SimpleTitles.Trigger,{
        targetStateUpdated:(state,title)=>{
          if(++triggers>4) facets.setTargetLive(title,false);
        },
      }),
      triggered=facets.newTextualTarget(SimpleTitles.Triggereds,{
        getText:()=>{
          const count=triggers.toString();
          return !facets.isTargetLive(SimpleTitles.Trigger)?
            `No more than ${count}!`:count
        },
      });
    return facets.newTargetGroup('TriggerTest',[trigger,triggered]);
  }
  export function newIndexing(facets:Facets){
    const indexing=facets.newIndexingTarget(SimpleTitles.Indexing,{
        passIndex:0,
        newUiSelectable:(indexable)=>indexable,
        getIndexables:()=>SimpleTitles.TextualIndexables,
      } as IndexingCoupler),
      index=facets.newTextualTarget(SimpleTitles.Index,{
        getText:()=>''+facets.getTargetState(SimpleTitles.Indexing),
      }),
      indexed=facets.newTextualTarget(SimpleTitles.Indexed,{
        getText:()=>SimpleTitles.TextualIndexables[facets.getTargetState(SimpleTitles.Indexing)as number],
      });
    return facets.newTargetGroup('IndexingTest',[indexing,index,indexed]);
  }
  export function newAllSimples(facets:Facets):Target{
    return facets.newTargetGroup('AllSimples',[
      newTextual(facets),
      newToggling(facets,true),
      newIndexing(facets),
      newTrigger(facets)]);
  }
  export function setSimplesLive(facets:Facets,state:boolean){
    [SimpleTitles.FirstTextual,SimpleTitles.SecondTextual,
      SimpleTitles.Indexed,SimpleTitles.Indexing,SimpleTitles.Index,
      SimpleTitles.Trigger,SimpleTitles.Triggereds,
    ].forEach(title=>{
      facets.setTargetLive(title,state);
    })
  }
  export function newSelectingTyped(facets:Facets){
    function listAt():number{
      return facets.getTargetState(frame.indexingTitle as string) as number;
    }
    function getType(indexed:Texts.Content){
      return Texts.Type.getContentType(indexed);
    }
    const frame:IndexingFramePolicy={
      frameTitle:SelectingTitles.Frame,
      indexingTitle:SelectingTitles.Chooser,
      getIndexables:()=>Texts.contents,
      newUiSelectable:(item:Texts.Content)=>item.text,
      newFrameTargets:()=>[
        facets.newTextualTarget(SimpleTitles.Indexed,{
          getText:()=>getType(facets.getIndexingState(
            SelectingTitles.Chooser).indexed).name,
        }),
      ]
      ,
      newIndexedTreeTitle:indexed=>SelectingTitles.Selected+getType(indexed).titleTail,
      newIndexedTree:(indexed:Texts.Content,title:string)=>{
        const tail=getType(indexed).titleTail;
        return facets.newTargetGroup(title,tail===''?[
          facets.newTextualTarget(SelectingTitles.OpenEditButton,{
            passText:indexed.text,
            targetStateUpdated:state=>indexed.text=state as string,
          }),
        ]:[
          facets.newTextualTarget(SelectingTitles.OpenEditButton+tail,{
            passText:indexed.text,
            targetStateUpdated:state=>indexed.text=state as string,
          }),
          facets.newTextualTarget(SelectingTitles.CharsCount+tail,{
            getText:()=>''+indexed.text.length,
          }),
        ])
      },
    };
    return facets.newIndexingFrame(frame);
  }
  export function newSelectingScrolling(facets:Facets){
      let createNew=(from:Texts.Content)=>({text:from.text+'+'}as Texts.Content);
      const list:ScrollableList=new ScrollableList(Texts.contents,3,facets,SelectingTitles.Chooser,createNew);
      const frame:IndexingFramePolicy={
        frameTitle:SelectingTitles.Frame,
        indexingTitle:SelectingTitles.Chooser,
        newFrameTargets:()=>Selecting.newActionTargets(facets,list),
        getIndexables:()=>list.getScrolledItems(),
        newUiSelectable:(item:Texts.Content)=>item.text,
        newIndexedTreeTitle:indexed=>SelectingTitles.Selected,
        newIndexedTree:(indexed:Texts.Content,title:string)=>{
          traceThing('^newIndexedTargets',{indexed:indexed});
          return facets.newTargetGroup(title,[
            facets.newTextualTarget(SelectingTitles.OpenEditButton,{
              passText:indexed.text,
              targetStateUpdated:state=>indexed.text=state as string,
            }),
            facets.newTextualTarget(SelectingTitles.CharsCount,{
              getText:()=>''+(facets.getTargetState(SelectingTitles.OpenEditButton)as string
              ).length,
            }),
          ])
        },
      };
      return facets.newIndexingFrame(frame);
    }
  }
