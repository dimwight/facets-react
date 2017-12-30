import {TargeterCore} from './TargeterCore';
export class IndexingFrameTargeter extends TargeterCore {
private val titleTargeters = HashMap()
private val indexing:STargeter
private val indexed:STargeter
private val indexingTarget:SIndexing
private val indexedTarget:STarget
private val indexedTitle:String
  fun retarget(target:STarget) {
    super.retarget(target)
    updateToTarget()
    if (indexing == null)
    {
      indexing = indexingTarget.newTargeter()
      indexing.setNotifiable(this)
    }
    if (titleTargeters.isEmpty())
    {
      val atThen = indexingTarget.index()
      for (at in 0 until indexingTarget.indexables().length)
      {
        indexingTarget.setIndex(at)
        updateToTarget()
        indexed = (indexedTarget as TargetCore).newTargeter()
        indexed.setNotifiable(this)
        indexed.retarget(indexedTarget)
        titleTargeters.put(indexedTitle, indexed)
      }
      indexingTarget.setIndex(atThen)
      updateToTarget()
    }
    indexing.retarget(indexingTarget)
    indexed = titleTargeters.get(indexedTitle)
    if (indexed == null) throw IllegalStateException("Null indexed in " + this)
    indexed.retarget(indexedTarget)
  }
private fun updateToTarget() {
    val frame = target() as IndexingFrame
    indexingTarget = frame.indexing()
    indexedTarget = frame.indexedTarget()
    indexedTitle = indexedTarget.title()
  }
  fun retargetFacets() {
    super.retargetFacets()
    indexing.retargetFacets()
    for (t in titleTargeters.values()) t.retargetFacets()
  }
  fun titleElements():Array<STargeter> {
    val list = ArrayList<STargeter>(Arrays.asList(elements))
    list.add(indexing)
  for (t in titleTargeters.values()) list.add(t)
  return list.toArray(arrayOf<STargeter>())
}
}
