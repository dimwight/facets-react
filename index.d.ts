/**
 Marker interface for Facets implementation of Superficial target.
 */
export interface Target{}
/**
 * For passing state in and out of a simple {@link Target}.
 */
export type SimpleState=string|boolean|number
/**
 * For passing a {@link SimpleState} to the UI.
 */
export type FacetUpdater=(state: SimpleState) => void
/**
 * Connects a {@link Target} with client code.
 */
export interface TargetCoupler {
  /**
   * Called on update of the {@link Target} constructed with the coupler.
   * @param {any} state the new state
   * @param {string} title identifies the {@link Target}
   */
  targetStateUpdated? (state: SimpleState, title: string) : void;
  passLive?:boolean;
}
/**
 Connects a textual {@link Target} with client code.
 */
export interface TextualCoupler extends TargetCoupler {
  /**
   Sets initial state of the textual.
   * If not supplied, {@link getText} must be.
   */
  passText?: string;
  /**
   * Supply state for the {@link Target}.
   * Must be supplied in the absence of{@link passText}.
   * @param {string} title identifies the {@link Target}
   * @returns {string} the textual state
   */
  getText?(title: string) : string;
  /**
   * Allows validation of changed text state
   * @param {string} text to validate
   * @param {string} title identifies the {@link Target}
   * @returns {boolean} true if valid
   */
  isValidText? (text: string, title: string) : boolean;
}
/**
 Connects a toggling (boolean) {@link Target} with client code.
 */
export interface TogglingCoupler extends TargetCoupler {
  /**
   Sets initial state of the {@link Target}.
   */
  passSet: boolean;
}
/**
 Connects a numeric {@link Target} with client code.
 */
export interface NumericCoupler extends TargetCoupler {
  /**
   Sets initial state of the {@link Target}.
   */
  passValue: number;
  /**
   Minimum state of the {@link Target}.
   */
  min: number;
  /**
   Maximum state of the {@link Target}.
   */
  max: number;
}
/**
 Connects an indexing (array-based) {@link Target} with client code.
 */
export interface IndexingCoupler extends TargetCoupler {
  /**
   Sets initial index into the array exposed by the {@link Target}.
   If absent index will be set to 0;
   */
  passIndex?: number;
  /**
   * Get the current contents to be indexed.
   * @param {string} title identifies the {@link Target}
   * @returns {any[]} the contents
   */
  getIndexables () : any[];
  /**
   * Get representation for indexable in the UI.
   * If absent a default string will be created.
   * @param {any} indexable to represent
   * @returns the representation
   */
  newUiSelectable? (indexable: any) : any;
}
/**
 * Current values exposed by an indexing {@link Target}
 */
interface IndexingState {
  /**
   * As last created by the {@link IndexingCoupler}; or default string[]
   */
  uiSelectables: string[];
  /**
   * The result of the current index into the indexables.
   */
  indexed: any;
}
/**
 * Defines a {@link Target} that wraps an indexing {@link Target}.
 */
export interface IndexingFramePolicy {
  /**
   * Title for the wrapping {@link Target}.
   */
  frameTitle?: string;
  /**
   * Title for the wrapped indexing {@link Target}.
   */
  indexingTitle?: string;
  /**
   * Get current items to be indexed.
   */
  getIndexables () : any[];
  /**
   * Supply object to expose indexable in the UI.
   * Analogue of {@link IndexingCoupler} function.
   * @param {any} indexable to represent
   * @returns {string} the representation
   */
  newUiSelectable? (indexable: any):string;
  /**
   * Create {@link Target}s to be children of the framing {@link Target}
   * @returns {Target[]} the targets
   */
  newFrameTargets? () :Target[];
  /**
   * Provides for defining different indexable types.
   * Will be passed to {@link newIndexedTree}
   * @param {any} indexed selected with the framed indexing {@link Target}
   */
  newIndexedTreeTitle? (indexed: any): string;
  /**
   * Create {@link Target}s exposing the indexed content
   * @param {any} indexed selected with the framed indexing {@link Target}
   * @param title from {@link newIndexedTreeTitle} or created by framework
   * @returns {Target} root of tree
   */
  newIndexedTree ? (indexed: any, title: string) : Target;
}
/** Manages time tracing by its containing {@link Facets}. */
export interface Times {
  /**
   *  Should trace messages include times?
   */
  doTime: boolean;
  /**
   * Set the automatic reset timeout and reset {@link elapsed()}.
   */
  setResetWait(millis: number): void;
  /**
   * Time in ms since the last (usually automatic) reset.
   */
  elapsed(): number;
  /**
   * Print {@link elapsed()} followed by the message.
   * @param {string} msg to skipForward to time
   */
  traceElapsed(msg?: string): void;
}
/**
 * Superficial application core.
 */
export interface Facets {
  /**
   * Identifies built-in textual {@link Target} exposing active content title.
   * Updating state directly using this title will throw an error.
   */
  readonly activeContentTitle: string;
  /**
   *  Built-in instance.
   */
  readonly times: Times;
  /**
   * Should the instance issue trace messages?
   */
  doTrace: boolean;
  /** Creates a textual {@link Target}.
   *  @param {string} title to identify the {@link Target}
   * @param {TextualCoupler} coupler connects the {@link Target} to client code
   * @returns the {@link Target}
   */
  newTextualTarget(title: string, coupler: TextualCoupler): Target;
  /** Creates a boolean {@link Target}.
   *  @param {string} title to identify the {@link Target}
   * @param {TogglingCoupler} coupler connects the {@link Target} to client code
   * @returns the {@link Target}
   */
  newTogglingTarget(title: string, coupler: TogglingCoupler): Target;
  /** Creates a numeric {@link Target}.
   *  @param {string} title to identify the {@link Target}
   * @param {NumericCoupler} coupler connects the {@link Target} to client code
   * @returns the {@link Target}
   */
  newNumericTarget(title: string, coupler: NumericCoupler): Target;
  /** Creates a stateless 'action' {@link Target}.
   *  @param {string} title to identify the {@link Target}
   * @param {TargetCoupler} coupler connects the {@link Target} to client code
   * @returns the {@link Target}
   */
  newTriggerTarget(title: string, coupler: TargetCoupler): Target;
  /** Creates a {@link Target} containing others.
   * @param {string} title to identify the {@link Target}
   * @param {Target[]} members of the group
   * @returns group of {@link Target}s
   */
  newTargetGroup(title: string, members: Target[]): Target;
  /** Creates a {@link Target} that indexes a list.
   *  @param {string} title to identify the {@link Target}
   * @param {IndexingCoupler} coupler connects the {@link Target} to client code
   * @returns the {@link Target}
   */
  newIndexingTarget(title: string, coupler: IndexingCoupler): Target;
  /** Provides information on the current state of an indexing {@link Target}
   *  @param {string} title to identify the {@link Target}
   */
  getIndexingState(title: string): IndexingState;
  /** Creates a {@link Target} framing an indexing {@link Target}.
   *  @param {IndexingFramePolicy} policy defines both {@link Target}s
   *  */
  newIndexingFrame(policy: IndexingFramePolicy): Target;
  /** Adds a content tree to the application.
   * The tree added becomes the active tree with its title passed
   * to {@link FacetsApp#onRetargeted(string)};
   * it replaces any existing tree with the same title, thus ensuring
   * synchronisation of the UI.
   * @param {Target} add the new tree
   */
  addContentTree(add: Target): void;
  /**
   * Activate an existing content tree.
   * @param {string} title identifies the tree
   */
  activateContentTree(title: string): void;
  /**
   * Attach an abstract facet to the framework targeter tree.
   * @param {string} title identifies the targeter via its {@link Target}
   * @param {FacetUpdater} updater callback to
   * update the UI with the {@link SimpleState} of the current {@link Target}
   */
  attachFacet(title: string, updater: FacetUpdater): void;
  /**
   * Update the state of the {@link Target} identified.
   * @param {string} title identifies the {@link Target}
   * @param {SimpleState} update to update the {@link Target}
   */
  // updateTargetState(title: string, update: SimpleState): void;
  /**
   * Obtain the the state of the {@link Target} identified.
   * @param {string} title identifies the {@link Target}
   * @returns {SimpleState} the state
   */
  getTargetState(title: string): SimpleState;
  /**
   * Notify the framework of an update and trigger a retargeting.
   * @param {string} title identifies the {@link Target}
   */
  /*notifyTargetUpdated(title: string): void;*/
  /**
   * Update {@link Target} and and trigger a retargeting.
   * @param {string} title identifies the {@link Target}
   * @param {SimpleState} update for {@link Target} state
   */
  updateTarget/*WithNotify*/(title: string, update?: SimpleState): void;
  /** Sets the 'enabled' state of a {@link Target}.
   * Provides for disabling of UI facet.
   * @param {string} title identifies the {@link Target}
   * @param {boolean} live the new state
   */
  setTargetLive(title: string, live: boolean): void;
  /** Gets the 'enabled' state of a {@link Target}
   * UI facets can query to find the state to display.
   * @param {string} title identifies the {@link Target}
   */
  isTargetLive(title: string): boolean;
  /**
   * Provides for attachment of arbitrary code (eg for use in the UI).
   */
  supplement: any;
  /**
   * Construct app surface using callbacks in {@link FacetsApp}.
   * @param  {FacetsApp}app defined in client code
   */
  buildApp(app: FacetsApp): void;
}
/** Facets-aware application.
 */
interface FacetsApp {
  /** Define at least one tree of {@link Target}s to be exposed in the UI.
   * To ensure construction of a complete targeter tree, {@link Target} trees
   * should include an example of each possible tree.
   */
  newContentTrees(): Target|Target[];
  /** Called by framework after retargeting {@link Target} trees but
   * before updating facets in the UI.
   * @param {string} activeTitle the {@link Target} last created
   * in {@link getContentTrees()}
   * or {@link Facets#addContentTree(Target)},
   * or whose title was last passed to {@link Facets#activateContentTree(string)}.
   */
  onRetargeted(activeTitle: string): void;
  /** Construct a UI with facets exposing {@link Target}s defined
   * in {@link getContentTrees()}.
   */
  buildLayout(): void;
}
/** Create a new {@link Facets} instance.
 *  @param trace should the instance log lifecycle events?
 * */
export function newInstance(trace: boolean): Facets;

