import {SkippableItem} from './_globals';
import {format,addDays} from "date-fns";
export class DateContent implements SkippableItem<Date>{
  constructor(public readonly date:Date){}
  newSkipped(skip:number):SkippableItem<any>{
    return new DateContent(addDays(this.date,skip))
  }
  selectable():string{
    return format(this.date,'ddd MMMM D');
  }
}
export namespace DateTitles{
  export const App='DateSelecting',Chooser='Select Date';
}


