export class TextContent{
  constructor(public text:string){}
  clone():TextContent{
    return new TextContent(this.text)
  }
  copyClone(clone:TextContent){
    this.text=clone.text
  }
}
export const textContents=[
  new TextContent('Hello world!'),
  new TextContent('Hello, good evening and welcome!'),
  new TextContent('Hello Dolly!'),
  new TextContent('Hello, sailor!'),
];
export class TextContentType{
  constructor(readonly name:string,
              readonly titleTail:string,){}
  static Standard=new TextContentType('Standard','');
  static ShowChars=new TextContentType('ShowChars','|ShowChars');
  static getContentType(content:TextContent){
    return content.text.length>20?TextContentType.ShowChars:TextContentType.Standard;
  }
}

