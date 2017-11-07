/**
Marker interface for Facets implementation of Superficial target.
*/
export interface Target{}
/**
* For passing state in and out of a simple {Target}.
*/
export type SimpleState=string|boolean|number
/** */
export interface TargetCoupler {
  /**
   * Called on update of the target constructed with the coupler.
   * @param state the updated state
   * @param {string} title identifies the target
   */
  targetStateUpdated?: (state: SimpleState, title: string) => void;
}
/**
Connects a textual target with client code.
*/
export interface TextualCoupler extends TargetCoupler {
  /**
  Sets initial state of the textual.
  */
  passText?: string;
  /**
  * Supply state for the target.
  * Must be implemented if no passText.
  * @param {string} title identifies the target
  * @returns {string} the state
  */
  getText?: (title: string) => string;
  /**
  * Allows validation of changed target state
  * @param {string} text to validate
  * @param {string} title identifies the target
  * @returns {boolean} true if valid
  */
  isValidText?: (text: string, title: string) => boolean;
}
/**
 Connects a toggling (boolean) target with client code.
 */
export interface TogglingCoupler extends TargetCoupler {
  /**
   Sets initial state of the toggling.
   */
  passSet: boolean;
}
/**
 Connects a numeric target with client code.
 */
export interface NumericCoupler extends TargetCoupler {
  /**
   Sets initial state of the numeric.
   */
  passValue: number;
  /**
   Minimum state of the numeric.
   */
  min: number;
  /**
   Maximum state of the numeric.
   */
  max: number;
}
/**
 Connects an indexing (list-type) target with client code.
 */
export interface IndexingCoupler extends TargetCoupler {
  /**
   Sets initial state of the indexing (the index into its contents).
   */
  passIndex: number;
  /**
   * Get the contents to be indexed
   * @param {string} title identifies the target
   * @returns {any[]}
   */
  getIndexables: (title: string) => any[];
  /**
   * Get strings to represent the indexable contents in the UI
   * @param {string} title identifies the target
   * @returns {string[]}
   */
  getUiSelectables: (title: string) => string[];
}
/**
 * Current values exposed by the indexing
 */
interface IndexingState {
  /**
   * As last created by IndexingCoupler.getUiSelectables
   */
  uiSelectables: string[];
  /**
   * The result of the current index into the indexables.
   */
  indexed: any;
}
/**
 * Defines a target that wraps content selected with an indexing.
 */
export interface IndexingFramePolicy {
  /**
   * Title for the wrapping target.
   */
  indexingFrameTitle?: string;
  /**
   * Title for the wrapped indexing.
   */
  indexingTitle: string;
  /**
   * Get current items to be indexed.
   */
  getIndexables: () => any[];
  /**
   * Supply  string to expose content item in the UI.
   * Analogue of IndexingCoupler function. 
   * @param {any} content item
   * @returns {string}
   */
  newUiSelectable?: (indexable: any) => string;
  /**
   * Create Targets to be attached to the frame Target
   * @returns {Target[]}
   */
  newFrameTargets?: () => Target[];
  /**
   * Provides for supplying different targets
   * @param indexed selected with the indexing
   */
  newIndexedTargetsTitle?: (indexed: any) => string;
  /**
   * Create Targets exposing the indexed content
   * @param indexed selected with the indexing
   * @param title from {newIndexedTitle} or created by framework
   * @returns {Target} root of tree
   */
  newIndexedTargets?: (indexed: any, indexedTitle: string) => Target;
}
/**
* Constructs a new Superficial application core.
* @param {boolean} trace
* @returns {Facets}
*/
export interface Times {
  /** */
  doTime: boolean;
  /** */
  setResetWait(millis: number): void;
  /** */
  elapsed(): number;
  /**
   * Print {@link #elapsed()} followed by the message.
   * @param {string} msg
   */
  traceElapsed(msg: string): void;
}
/**
* A Superficial application core.
*/
export interface Facets {
  /** */
  times: Times;
  /** */
  doTrace: boolean;
  /**
   *
   * @param {string} title identifies the target or its targeter
   * @param {TextualCoupler} coupler connects the target to client code
   * @returns textual {Target}
   */
  newTextualTarget(title: string, coupler: TextualCoupler): Target;
  /** */
  newTogglingTarget(title: string, c: TogglingCoupler): Target;
  /** */
  newNumericTarget(title: string, coupler: NumericCoupler): Target;
  /** */
  newTriggerTarget(title: string, coupler: TargetCoupler): Target;
  /**
  * Constructs a target containing others
  * @param {string} title for the target
  * @param {Target} members of the group
  * @returns group of {Target}s
  */
  newTargetGroup(title: string, ...members: Target[]): Target;
  /** */
  newIndexingTarget(title: string, coupler: IndexingCoupler): Target;
  /** */
  getIndexingState(title: string): IndexingState;
  /** */
  newIndexingFrame(policy: IndexingFramePolicy): Target;
  /**
   * Constructs a tree of targeters using the initial target tree.
   * @param {Target} targetTree the root of the target tree
   */
  buildTargeterTree(targetTree: Target): void;
  /**
   * Attach an internal facet to the targeter with the target title passed.
   * @param {string} title identifies the targeter
   * @param {(state) => void} facetUpdated callback to update the UI with the target state
   */
  attachFacet(title: string, facetUpdated: (state: SimpleState) => void): void;
  /**
   * Update the state of the target identified.
   * @param {string} title identifies the target
   * @param {SimpleState} update to update the target
   */
  updateTargetState(title: string, update: SimpleState): void;
  /**
   * Obtain the the state of the target identified.
   * @param {string} title identifies the target
   * @returns {SimpleState} the state
   */
  getTargetState(title: string): SimpleState;
  /**
   * Notify the framework of an update and trigger a retargeting. 
   * @param {string} title identifies the target
   */
  notifyTargetUpdated(title: string): void;
  /**
   * Update target and and trigger a retargeting. 
   * @param {string} title identifies the target
   * @param {SimpleState} update for target state
   */
  updateTargetWithNotify(title: string, update: SimpleState): void;
  /** */
  setTargetLive(title: string, live: boolean): void;
  /** */
  isTargetLive(title: string): boolean;
  /** */
  onRetargeted: () => void;
  /** */
  identity(): any;
  /** */
  supplement: any;
}
/** */
export function newInstance(trace: boolean): Facets;
