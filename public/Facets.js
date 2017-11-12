(function (exports) {
'use strict';

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
class Util {
    static printOut$java_lang_String(s) {
        let text = s == null ? "null" : s.toString();
        console.info(text);
    }
    static printOut$java_lang_String$java_lang_Object(msg, o) {
        Util.printOut$java_lang_String(msg + o);
    }
    static printOut(msg, o) {
        if (((typeof msg === 'string') || msg === null) && ((o != null) || o === null)) {
            return Util.printOut$java_lang_String$java_lang_Object(msg, o);
        }
        else if (((typeof msg === 'string') || msg === null) && o === undefined) {
            return Util.printOut$java_lang_String(msg);
        }
        else
            throw new Error('invalid overload');
    }
    static arrayPrintString(toPrint) {
        let msg = toPrint == null ? "null" : Debug.toStringWithHeader(toPrint);
        return msg;
    }
    static sf(val) {
        return Util.sigFigs(val, Util.DIGITS_SF);
    }
    static sfs(val) {
        let sf = new String(Util.sf(val)).toString();
        let sfs = sf.replace(new RegExp("(\\d{" + Util.DIGITS_SF + ",})\\.0(\\D?)", 'g'), "$1$2").replace(new RegExp("\\.0\\z", 'g'), "");
        return sfs;
    }
    static fxs(val) {
        return "0." + (Util.DECIMALS_FX === 1 ? "0" : Util.DECIMALS_FX === 2 ? "00" : "000");
    }
    /*private*/ static shortName(className) {
        let semiColon = className.lastIndexOf(';');
        let stop = semiColon > 0 ? semiColon : className.length;
        return className.substring(className.lastIndexOf('.') + 1, stop);
    }
    /*private*/ static sigFigs(val, digits) {
        if (digits < 0)
            throw Object.defineProperty(new Error("Digits <1=" + digits), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        else if (((value) => Number.NEGATIVE_INFINITY === value || Number.POSITIVE_INFINITY === value)(val))
            throw Object.defineProperty(new Error("Infinite value"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        else if (digits === 0 || val === 0 || val !== val)
            return val;
        let ceiling = Math.pow(10, digits);
        let floor = ceiling / 10;
        let signum = (f => { if (f > 0) {
            return 1;
        }
        else if (f < 0) {
            return -1;
        }
        else {
            return 0;
        } })(val);
        let sf = Math.abs(val);
        if (sf < 0.001)
            return 0;
        let shiftUp = sf < floor;
        let factor = shiftUp ? 10 : 0.1;
        let shifted = 0;
        for (; sf > ceiling || sf < floor; shifted += shiftUp ? 1 : -1)
            sf *= factor;
        let exp = Math.pow(10, shifted);
        sf = (d => { if (d === Number.NaN) {
            return d;
        }
        else if (Number.POSITIVE_INFINITY === d || Number.NEGATIVE_INFINITY === d) {
            return d;
        }
        else if (d == 0) {
            return d;
        }
        else {
            return Math.round(d);
        } })(sf) / exp;
        if (true || !shiftUp)
            return sf * signum;
        let trim = sf;
        if (trim !== sf)
            Util.printOut$java_lang_String("Doubles.sigFigs: val=" + sf + " trim=" + trim);
        return trim * signum;
    }
    static arraysEqual(now, then) {
        let equal = false;
        if (then != null && then.length === now.length) {
            equal = true;
            for (let i = 0; i < now.length; i++) {
                let equals = ((o1, o2) => { if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                } })(now[i], then[i]);
                if (false && !equals)
                    console.info("longEquals: equal=" + equal + " " + now[i] + ">" + then[i]);
                equal = equals && equal;
            }
            
        }
        return equal;
    }
}
Util.DIGITS_SF = 3;
Util.DECIMALS_FX = 2;
Util["__class"] = "fjs.util.Util";

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Utility methods for arrays.
 * @class
 */
class Objects {
    static toString$java_lang_Object_A$java_lang_String(items, spacer) {
        if (items == null)
            return "null";
        else if (items.length === 0)
            return "";
        let list = ([]);
        let trim = false && !((o1, o2) => { if (o1 && o1.equals) {
            return o1.equals(o2);
        }
        else {
            return o1 === o2;
        } })(spacer, "\n");
        let at = 0;
        for (let index511 = 0; index511 < items.length; index511++) {
            let item = items[index511];
            /* add */ (list.push((item == null ? "null" : trim ? item.toString().trim() : item) + (++at === items.length ? "" : spacer)) > 0);
        }
        return ('[' + list.join(', ') + ']');
    }
    static toString(items, spacer) {
        if (((items != null && items instanceof Array && (items.length == 0 || items[0] == null || (items[0] != null))) || items === null) && ((typeof spacer === 'string') || spacer === null)) {
            return Objects.toString$java_lang_Object_A$java_lang_String(items, spacer);
        }
        else if (((items != null && items instanceof Array && (items.length == 0 || items[0] == null || (items[0] != null))) || items === null) && spacer === undefined) {
            return Objects.toString$java_lang_Object_A(items);
        }
        else
            throw new Error('invalid overload');
    }
    static toString$java_lang_Object_A(array) {
        return Objects.toString$java_lang_Object_A$java_lang_String(array, ",");
    }
    static toLines(array) {
        if (array == null)
            return "null";
        let list = ([]);
        for (let i = 0; i < array.length; i++)
            (list.push((array[i] == null ? "null" : Debug.info(array[i])) + (i < array.length - 1 ? "\n" : "")) > 0);
        let lines = ('[' + list.join(', ') + ']');
        return lines.replace(new RegExp("\n", 'g'), " ");
    }
}
Objects.debug = false;
Objects["__class"] = "fjs.util.Objects";

/**
 * Utilities for use during development.
 * @class
 */
class Debug {
    /**
     * Returns basic Debug.information about an object's type and identity.
     * <p>This will be some combination of
     * <ul>
     * <li>the non-trivial simple class name
     * <li>{@link Titled#title()} if available
     * </ul>
     * @param {*} o
     * @return {string}
     */
    static info(o) {
        if (o == null)
            return "null";
        else if (typeof o === 'boolean')
            return o.toString();
        else if (typeof o === 'number')
            return new String(o).toString();
        else if (typeof o === 'string') {
            let text = o;
            let length = text.length;
            return text.substring(0, Math.min(length, 60)) + ("");
        }
        let classe = o.constructor;
        let name = (c => c["__class"] ? c["__class"].substring(c["__class"].lastIndexOf('.') + 1) : c["name"].substring(c["name"].lastIndexOf('.') + 1))(classe);
        let id = "";
        let title = (c => c["__class"] ? c["__class"] : c["name"])(classe);
        if (o != null && (o["__interfaces"] != null && o["__interfaces"].indexOf("fjs.util.Identified") >= 0 || o.constructor != null && o.constructor["__interfaces"] != null && o.constructor["__interfaces"].indexOf("fjs.util.Identified") >= 0))
            id = " #" + o.identity();
        if (o != null && (o["__interfaces"] != null && o["__interfaces"].indexOf("fjs.util.Titled") >= 0 || o.constructor != null && o.constructor["__interfaces"] != null && o.constructor["__interfaces"].indexOf("fjs.util.Titled") >= 0))
            title = " " + o.title();
        return name + id + title;
    }
    /**
     * Returns an array of <code>Debug.info</code>s.
     * @param {Array} array
     * @return {string}
     */
    static arrayInfo(array) {
        return "arrayInfo";
    }
    static traceEvent(string) {
        Util.printOut$java_lang_String(">>" + string);
    }
    static toStringWithHeader(array) {
        return Debug.info(array) + " [" + array.length + "] " + Objects.toLines(array);
    }
}
Debug.trace = false;
Debug["__class"] = "fjs.util.Debug";

/**
 * Utility superclass that can issue trace messages.
 * @param {string} top
 * @class
 */
class Tracer {
    constructor(top) {
        /*private*/ this.id = ++Tracer.ids;
        if (((typeof top === 'string') || top === null)) {
            let __args = Array.prototype.slice.call(arguments);
            this.top = null;
            this.id = ++Tracer.ids;
            this.top = null;
            (() => {
                this.top = top;
            })();
        }
        else if (top === undefined) {
            let __args = Array.prototype.slice.call(arguments);
            this.top = null;
            this.id = ++Tracer.ids;
            this.top = null;
            (() => {
                this.top = null;
            })();
        }
        else
            throw new Error('invalid overload');
    }
    /**
     *
     * @return {*}
     */
    identity() {
        return this.id;
    }
    static newTopped(top, live) {
        return new Tracer.TracerTopped(top);
    }
    trace$java_lang_String(msg) {
        this.doTraceMsg(msg);
    }
    trace$java_lang_String$java_lang_Object(msg, o) {
        if (o != null && o instanceof Array && (o.length == 0 || o[0] == null || o[0] != null))
            this.doTraceMsg(msg + this.newArrayText(o));
        else
            this.doTraceMsg(msg + Debug.info(o));
    }
    trace(msg, o) {
        if (((typeof msg === 'string') || msg === null) && ((o != null) || o === null)) {
            return this.trace$java_lang_String$java_lang_Object(msg, o);
        }
        else if (((typeof msg === 'string') || msg === null) && o === undefined) {
            return this.trace$java_lang_String(msg);
        }
        else
            throw new Error('invalid overload');
    }
    doTraceMsg(msg) {
        Util.printOut$java_lang_String((this.top != null ? (this.top + " #" + this.id) : Debug.info(this)) + " " + msg);
    }
    newArrayText(array) {
        let lines = new String("[\n");
        for (let index512 = 0; index512 < array.length; index512++) {
            let o = array[index512];
            lines += "  " + (Debug.info(o)) + "\n";
        }
        lines += ("]");
        return lines;
    }
}
Tracer.ids = 0;
Tracer["__class"] = "fjs.util.Tracer";
Tracer["__interfaces"] = ["fjs.util.Identified"];
(function (Tracer) {
    class TracerTopped extends Tracer {
        constructor(top) {
            super(top);
            this.__fjs_util_Tracer_TracerTopped_top = null;
            this.__fjs_util_Tracer_TracerTopped_top = top;
        }
        /**
         *
         * @param {string} msg
         */
        doTraceMsg(msg) {
            if (this.doTrace())
                super.doTraceMsg(msg);
        }
        doTrace() {
            return true;
        }
    }
    Tracer.TracerTopped = TracerTopped;
    TracerTopped["__class"] = "fjs.util.Tracer.TracerTopped";
    TracerTopped["__interfaces"] = ["fjs.util.Identified"];
})(Tracer || (Tracer = {}));

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Core implementation of key interfaces.
 * <p>{@link NotifyingCore} is the base class of both the {@link STarget} and
 * {@link STargeter} class hierarchies.
 * <p>Declared <code>public</code> for documentation purposes only; client code should
 * use the concrete subclass hierarchies.
 * @param {string} title
 * @class
 * @extends Tracer
 */
class NotifyingCore extends Tracer {
    constructor(title) {
        super();
        /*private*/ this.__identity = NotifyingCore.identities++;
        this.__title = null;
        this.__notifiable = null;
        this.__title = title;
    }
    title() {
        return this.__title;
    }
    /**
     *
     * @return {*}
     */
    notifiable() {
        if (this.__notifiable == null)
            throw Object.defineProperty(new Error("No notifiable in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else
            return this.__notifiable;
    }
    /**
     *
     * @param {*} notice
     */
    notify(notice) {
        if (Debug.trace)
            Debug.traceEvent("Notified in " + this + " with " + notice + ": notifiable=" + this.__notifiable);
        if (this.__notifiable == null)
            return;
        if (!this.blockNotification())
            this.__notifiable.notify(notice);
        else if (Debug.trace)
            Debug.traceEvent("Notification blocked in " + this);
    }
    /**
     *
     */
    notifyParent() {
        if (this.__notifiable == null)
            return;
        this.__notifiable.notify(Debug.info(this));
    }
    /**
     * Enables notification to be restricted to this member of the tree.
     * <p>Checked by {@link #notify(Object)}; default returns <code>false</code>.
     * @return {boolean}
     */
    blockNotification() {
        return false;
    }
    /**
     *
     * @param {*} n
     */
    setNotifiable(n) {
        this.__notifiable = n;
    }
    /**
     *
     * @return {string}
     */
    toString() {
        return Debug.info(this);
    }
}
NotifyingCore.identities = 0;
NotifyingCore["__class"] = "fjs.core.NotifyingCore";
NotifyingCore["__interfaces"] = ["fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Implements {@link STargeter}.
 * <p>{@link TargeterCore} is a public implementation of {@link STargeter}
 * to provide for extension in other packages; instances are generally
 * created by an implementation of {@link fjs.core.TargetCore#newTargeter()}.
 * @class
 * @extends NotifyingCore
 */
class TargeterCore extends NotifyingCore {
    constructor() {
        super("Untargeted");
        /*private*/ this.facets = ([]);
        this.__elements = null;
        this.__target = null;
        this.targetTitle = null;
        if (Debug.trace)
            Debug.traceEvent("Created " + this);
    }
    retarget(target) {
        if (target == null)
            throw Object.defineProperty(new Error("Null target in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        else
            this.__target = target;
        let checkTitle = target.title();
        if (this.targetTitle != null && !((o1, o2) => { if (o1 && o1.equals) {
            return o1.equals(o2);
        }
        else {
            return o1 === o2;
        } })(checkTitle, this.targetTitle))
            throw Object.defineProperty(new Error("Bad target title=" + this.targetTitle), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        if (target.notifiesTargeter())
            target.setNotifiable(this);
        let targets = target.elements();
        if (targets == null)
            throw Object.defineProperty(new Error("Null targets in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        if (this.__elements == null) {
            let list = ([]);
            for (let index503 = 0; index503 < targets.length; index503++) {
                let t = targets[index503];
                {
                    let add = t.newTargeter();
                    add.setNotifiable(this);
                    /* add */ (list.push(add) > 0);
                }
            }
            this.__elements = ((a1, a2) => { if (a1.length >= a2.length) {
                a1.length = 0;
                a1.push.apply(a1, a2);
                return a1;
            }
            else {
                return a2.slice(0);
            } })([], list);
            
        }
        let anyLengths = true;
        if (!anyLengths && targets.length !== this.__elements.length)
            throw Object.defineProperty(new Error("Targets=" + targets.length + " differ from elements=" + this.__elements.length), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else
            for (let i = 0; i < (anyLengths ? targets : this.__elements).length; i++)
                this.__elements[i].retarget(targets[i]);
    }
    attachFacet(facet) {
        if (facet == null)
            throw Object.defineProperty(new Error("Null facet in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        if (!(this.facets.indexOf((facet)) >= 0)) {
            facet.retarget(this.__target);
            /* add */ (this.facets.push(facet) > 0);
        }
        if (Debug.trace)
            Debug.traceEvent("Attached facet " + Debug.info(facet) + " to " + Debug.info(this));
    }
    retargetFacets() {
        for (let index504 = 0; index504 < this.__elements.length; index504++) {
            let e = this.__elements[index504];
            e.retargetFacets();
        }
        for (let index505 = 0; index505 < this.facets.length; index505++) {
            let f = this.facets[index505];
            {
                f.retarget(this.__target);
                if (Debug.trace)
                    Debug.traceEvent("Retargeted facet " + Debug.info(f) + " in " + this);
            }
        }
    }
    elements() {
        if (this.__elements == null)
            throw Object.defineProperty(new Error("No elements in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        return this.__elements;
    }
    target() {
        if (this.__target == null)
            throw Object.defineProperty(new Error("No target in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        return this.__target;
    }
    title() {
        return this.__target == null ? super.title() : this.__target.title();
    }
    toString() {
        let targetInfo = this.__target == null ? "" : Debug.info(this.__target);
        return Debug.info(this) + ("");
    }
    titleElements() {
        if (this.__elements == null)
            throw Object.defineProperty(new Error("Null elements in " + this), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else
            return this.__elements;
    }
}
TargeterCore["__class"] = "fjs.core.TargeterCore";
TargeterCore["__interfaces"] = ["fjs.util.Identified", "fjs.core.Notifying", "fjs.core.SRetargetable", "fjs.core.Notifiable", "fjs.util.Titled", "fjs.core.Facetable", "fjs.core.STargeter"];

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Core constructor.
 * @param {string} title should be suitable for return as the (immutable)
 * <code>title</code> property
 * @param {Array} elements may be <code>null</code> (in which case
 * suitable elements may be created using <code>lazyElements</code>); otherwise
 * passed to {@link #setElements(STarget[])}
 * @class
 * @extends NotifyingCore
 */
class TargetCore extends NotifyingCore {
    constructor(title, ...elements) {
        if (((typeof title === 'string') || title === null) && ((elements != null && elements instanceof Array && (elements.length == 0 || elements[0] == null || (elements[0] != null && (elements[0]["__interfaces"] != null && elements[0]["__interfaces"].indexOf("fjs.core.STarget") >= 0 || elements[0].constructor != null && elements[0].constructor["__interfaces"] != null && elements[0].constructor["__interfaces"].indexOf("fjs.core.STarget") >= 0)))) || elements === null)) {
            let __args = Array.prototype.slice.call(arguments);
            super(title);
            this.__elements = null;
            this.elementsSet = false;
            this.live = true;
            this.__elements = null;
            (() => {
                if (title == null || ((o1, o2) => { if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                } })(title, ""))
                    throw Object.defineProperty(new Error("Null or empty title in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
                if (elements.length > 0)
                    this.setElements(elements);
                TargetCore.targets++;
                if (Debug.trace)
                    Debug.traceEvent("Created " + Debug.info(this));
            })();
        }
        else if (((typeof title === 'string') || title === null) && elements === undefined) {
            let __args = Array.prototype.slice.call(arguments);
            {
                let __args = Array.prototype.slice.call(arguments);
                let elements = [];
                super(title);
                this.__elements = null;
                this.elementsSet = false;
                this.live = true;
                this.__elements = null;
                (() => {
                    if (title == null || ((o1, o2) => { if (o1 && o1.equals) {
                        return o1.equals(o2);
                    }
                    else {
                        return o1 === o2;
                    } })(title, ""))
                        throw Object.defineProperty(new Error("Null or empty title in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
                    if (elements.length > 0)
                        this.setElements(elements);
                    TargetCore.targets++;
                    if (Debug.trace)
                        Debug.traceEvent("Created " + Debug.info(this));
                })();
            }
        }
        else
            throw new Error('invalid overload');
    }
    /**
     * Sets the {@link STarget} children of the {@link TargetCore}.
     * <p>Intended for use in specialised subclass construction;
     * elements set are thereafter immutable.
     * @param {Array} elements (which may not be <code>null</code> nor contain <code>null</code>
     * members) will be returned as the <code>elements</code> property.
     */
    setElements(elements) {
        if (false && this.elementsSet)
            throw Object.defineProperty(new Error("Immutable elements in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        this.__elements = elements;
        this.elementsSet = true;
        for (let i = 0; i < elements.length; i++)
            if (elements[i] == null)
                throw Object.defineProperty(new Error("Null element " + i + " in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        
    }
    /**
     * Implements interface method.
     * <p>If no elements have been set, attempts to create them with
     * <code>lazyElements</code>.
     * <p>Each call to this method also sets the {@link TargetCore}
     * as notification monitor of any element that is not a {@link
     * fjs.core.SFrameTarget}.
     *
     * @return {Array}
     */
    elements() {
        if (!this.elementsSet) {
            let lazy = this.lazyElements();
            this.setElements(lazy);
        }
        for (let index502 = 0; index502 < this.__elements.length; index502++) {
            let e = this.__elements[index502];
            if (!e.notifiesTargeter())
                e.setNotifiable(this);
        }
        return this.__elements;
    }
    /**
     * Lazily creates <code>element</code>s for this target.
     * <p>Called at most once from {@link #elements()}.
     * <p>Though defined in {@link TargetCore} this method is primarily for use by
     * {@link SFrameTarget}s, which always create their elements dynamically
     * by reimplementing this method.
     * Default implementation returns an empty {@link STarget}[].
     * @return {Array}
     */
    lazyElements() {
        return [];
    }
    /**
     * Create and return a targeter suitable for retargeting to
     * this target.
     * <p>This is the key method used by Facets to implement dynamic
     * creation of a surface targeter tree. During initial retargeting
     * each {@link TargeterCore} queries its <code>target</code>
     * for any child elements, and calls this method on each child
     * to obtain suitable {@link STargeter} instances which
     * it then adds to its elements.
     * <p>This method may be also called on subsequent retargetings
     * where the specific type of a target is subject
     * to change (for instance when it represents a selection).
     * Either the {@link STargeter} returned can be matched
     * to an existing one to which facet have already been attached,
     * or such facet can be attached and the surface layout adjusted
     * accordingly.
     *
     * @return {*}
     */
    newTargeter() {
        return new TargeterCore();
    }
    isLive() {
        let n = this.notifiable();
        let notifiesTarget = n != null && (n != null && (n["__interfaces"] != null && n["__interfaces"].indexOf("fjs.core.STarget") >= 0 || n.constructor != null && n.constructor["__interfaces"] != null && n.constructor["__interfaces"].indexOf("fjs.core.STarget") >= 0));
        return !notifiesTarget ? this.live : this.live && n.isLive();
    }
    setLive(live) {
        this.live = live;
    }
    /**
     * Used to construct the notification tree.
     * <p><b>NOTE</b> This method must NOT be overridden in application code.
     * @return {boolean}
     */
    notifiesTargeter() {
        return this.__elements != null;
    }
    /**
     *
     * @return {*}
     */
    state() {
        throw Object.defineProperty(new Error("Not implemented in " + this), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
    }
    /**
     *
     * @param {*} update
     */
    updateState(update) {
        throw Object.defineProperty(new Error("Not implemented in " + this), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
    }
    toString() {
        return Debug.info(this);
    }
}
TargetCore.targets = 0;
TargetCore["__class"] = "fjs.core.TargetCore";
TargetCore["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];

class IndexingFrameTargeter extends TargeterCore {
    constructor() {
        super();
        /*private*/ this.titleTargeters = ({});
        this.indexing = null;
        this.indexed = null;
        this.indexingTarget = null;
        this.indexedTarget = null;
        this.indexedTitle = null;
    }
    retarget(target) {
        super.retarget(target);
        this.updateToTarget();
        if (this.indexing == null) {
            this.indexing = this.indexingTarget.newTargeter();
            this.indexing.setNotifiable(this);
        }
        if ((Object.keys(this.titleTargeters).length == 0)) {
            let atThen = this.indexingTarget.index();
            for (let at = 0; at < this.indexingTarget.indexables().length; at++) {
                this.indexingTarget.setIndex(at);
                this.updateToTarget();
                this.indexed = this.indexedTarget.newTargeter();
                this.indexed.setNotifiable(this);
                this.indexed.retarget(this.indexedTarget);
                /* put */ (this.titleTargeters[this.indexedTitle] = this.indexed);
            }
            
            this.indexingTarget.setIndex(atThen);
            this.updateToTarget();
        }
        this.indexing.retarget(this.indexingTarget);
        this.indexed = ((m, k) => m[k] ? m[k] : null)(this.titleTargeters, this.indexedTitle);
        if (this.indexed == null)
            throw Object.defineProperty(new Error("Null indexed in " + this), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        this.indexed.retarget(this.indexedTarget);
    }
    /*private*/ updateToTarget() {
        let frame = this.target();
        this.indexingTarget = frame.indexing();
        this.indexedTarget = frame.indexedTarget();
        this.indexedTitle = this.indexedTarget.title();
    }
    retargetFacets() {
        super.retargetFacets();
        this.indexing.retargetFacets();
        {
            let array497 = (obj => Object.keys(obj).map(key => obj[key]))(this.titleTargeters);
            for (let index496 = 0; index496 < array497.length; index496++) {
                let t = array497[index496];
                t.retargetFacets();
            }
        }
    }
    titleElements() {
        let list = (this.__elements.slice(0).slice(0));
        /* add */ (list.push(this.indexing) > 0);
        {
            let array499 = (obj => Object.keys(obj).map(key => obj[key]))(this.titleTargeters);
            for (let index498 = 0; index498 < array499.length; index498++) {
                let t = array499[index498];
                /* add */ (list.push(t) > 0);
            }
        }
        return ((a1, a2) => { if (a1.length >= a2.length) {
            a1.length = 0;
            a1.push.apply(a1, a2);
            return a1;
        }
        else {
            return a2.slice(0);
        } })([], list);
    }
}
IndexingFrameTargeter["__class"] = "fjs.core.IndexingFrameTargeter";
IndexingFrameTargeter["__interfaces"] = ["fjs.util.Identified", "fjs.core.Notifying", "fjs.core.SRetargetable", "fjs.core.Notifiable", "fjs.util.Titled", "fjs.core.Facetable", "fjs.core.STargeter"];

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Unique constructor.
 * @param {string} title passed to superclass
 * @param {SIndexing} indexing supplies content for {{@link #newIndexedTargets(Object)}
 * @class
 * @extends TargetCore
 */
class IndexingFrame extends TargetCore {
    constructor(title, indexing) {
        super(title);
        this.__indexing = null;
        if (indexing == null)
            throw Object.defineProperty(new Error("Null indexing in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        this.__indexing = indexing;
        indexing.setNotifiable(this);
    }
    /**
     * <p>Returns the {@link STarget} created in {@link #newIndexedTargets(Object)}.
     * @return {*}
     */
    indexedTarget() {
        let indexed = this.__indexing.indexed();
        return (indexed != null && (indexed["__interfaces"] != null && indexed["__interfaces"].indexOf("fjs.core.STarget") >= 0 || indexed.constructor != null && indexed.constructor["__interfaces"] != null && indexed.constructor["__interfaces"].indexOf("fjs.core.STarget") >= 0)) ? indexed : this.newIndexedTargets(indexed);
    }
    /**
     * Create targets exposing non-{STarget) indexed.
     * Default is invalid stub.
     * @param {*} indexed the currently indexed member of {@link #indexing}
     * @return {*}
     */
    newIndexedTargets(indexed) {
        throw Object.defineProperty(new Error("Not implemented in " + this), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
    }
    /**
     * The indexing passed to the constructor.
     * @return {SIndexing}
     */
    indexing() {
        return this.__indexing;
    }
    /**
     * Overrides superclass method.
     * <p>Returns an {@link IndexingFrameTargeter}.
     * @return {*}
     */
    newTargeter() {
        return new IndexingFrameTargeter();
    }
    /**
     * Re-implementation returning <code>true</code>.
     * @return {boolean}
     */
    notifiesTargeter() {
        return true;
    }
}
IndexingFrame["__class"] = "fjs.core.IndexingFrame";
IndexingFrame["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Core constructor.
 * <p>Note that this passes no child target elements to the superclass;
 * elements can only be set by subclassing and
 * <ul>
 * <li>in named subclasses where the elements are known at
 * construction, calling {@link #setElements(STarget[])}
 * from the constructor
 * <li>in other cases (in practice the large majority), overriding
 * {@link #lazyElements()} from {@link TargetCore}
 * </ul>
 * <p>This limitation ensures that the effective type of
 * a {@link SFrameTarget} with child elements can be distinguished
 * by reference to the compiled type. Care must therefore be
 * taken in client code not vary the effective type of the
 * elements created by a subclass.
 * @param {string} title passed to the superclass
 * @param {*} toFrame must not be <code>null</code>
 * @class
 * @extends TargetCore
 */
class SFrameTarget extends TargetCore {
    constructor(title, toFrame) {
        super(title);
        this.framed = null;
        if (toFrame == null)
            throw Object.defineProperty(new Error("Null framed in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        else
            this.framed = toFrame;
    }
    /**
     *
     * @return {boolean}
     */
    notifiesTargeter() {
        return true;
    }
}
SFrameTarget["__class"] = "fjs.core.SFrameTarget";
SFrameTarget["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];

class TargetCoupler {
    displayTitle(t) {
        return t.title();
    }
}
TargetCoupler["__class"] = "fjs.core.TargetCoupler";

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Unique constructor.
 * @param {string} title passed to superclass
 * @param {SIndexing.Coupler} coupler supplies application-specific mechanism and policy
 * @class
 * @extends TargetCore
 */
class SIndexing extends TargetCore {
    constructor(title, coupler) {
        super(title);
        this.coupler = null;
        this.__index = null;
        this.indexings = null;
        this.coupler = coupler;
    }
    /**
     * The first index into the <code>indexables</code>.
     * @return {number}
     */
    index() {
        return this.__index;
    }
    /**
     * Sets a single index into the <code>indexables</code>.
     * @param {number} index
     */
    setIndex(index) {
        let first = this.__index == null;
        this.__index = index;
        if (!first)
            this.coupler.indexSet(this);
    }
    /**
     * The items exposed to indexing.
     * <p>These will either have been set during construction or be read
     * dynamically from the coupler.
     * @return {Array}
     */
    indexables() {
        let indexables = this.coupler.getIndexables(this);
        if (indexables == null || indexables.length === 0)
            throw Object.defineProperty(new Error("Null or empty indexables in " + this), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else
            return indexables;
    }
    facetSelectables() {
        return this.coupler.getFacetSelectables(this);
    }
    /**
     * The item denoted by the current <code>index</code>.
     * @return {*}
     */
    indexed() {
        if (this.__index == null)
            throw Object.defineProperty(new Error("No index in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else
            return this.indexables()[this.__index];
    }
    setIndexed(indexable) {
        let indexables = this.indexables();
        for (let i = 0; i < indexables.length; i++)
            if (indexables[i] === indexable) {
                this.setIndex(i);
                break;
            }
        
    }
    /**
     *
     * @return {*}
     */
    state() {
        return this.index();
    }
    /**
     *
     * @param {*} update
     */
    updateState(update) {
        this.setIndex(update);
    }
}
SIndexing["__class"] = "fjs.core.SIndexing";
SIndexing["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];
(function (SIndexing) {
    /**
     * Connects an {@link SIndexing} to the application.
     * <p>A {@link Coupler} supplies client-specific mechanism and
     * policy for an {@link SIndexing}.
     * @class
     * @extends TargetCoupler
     */
    class Coupler extends TargetCoupler {
        constructor() {
            super();
        }
        /**
         * Called whenever an index changes.
         * @param {SIndexing} i
         */
        indexSet(i) {
        }
        /**
         * Return strings to represent the indexables.
         * @param {SIndexing} i
         * @return {Array}
         */
        getFacetSelectables(i) {
            let selectables = ([]);
            let top = i.title();
            let at = 0;
            {
                let array501 = i.indexables();
                for (let index500 = 0; index500 < array501.length; index500++) {
                    let each = array501[index500];
                    /* add */ (selectables.push(top + new String(at++).toString()) > 0);
                }
            }
            return ((a1, a2) => { if (a1.length >= a2.length) {
                a1.length = 0;
                a1.push.apply(a1, a2);
                return a1;
            }
            else {
                return a2.slice(0);
            } })([], selectables);
        }
    }
    SIndexing.Coupler = Coupler;
    Coupler["__class"] = "fjs.core.SIndexing.Coupler";
})(SIndexing || (SIndexing = {}));

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Construct a policy that constrains valid values within the immutable range
 * <code>min</code> to <code>max</code>.
 * @param {number} min
 * @param {number} max
 * @class
 * @extends Tracer
 */
class NumberPolicy extends Tracer {
    constructor(min, max) {
        super();
        this.__min = 0;
        this.__max = 0;
        if (min > max)
            throw Object.defineProperty(new Error("Bad values " + min + ">=" + max), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        this.__min = min;
        this.__max = max;
    }
    static MIN_VALUE_$LI$() { if (NumberPolicy.MIN_VALUE == null)
        NumberPolicy.MIN_VALUE = Number.MAX_VALUE * -1; return NumberPolicy.MIN_VALUE; }
    ;
    static MAX_VALUE_$LI$() { if (NumberPolicy.MAX_VALUE == null)
        NumberPolicy.MAX_VALUE = Number.MAX_VALUE; return NumberPolicy.MAX_VALUE; }
    ;
    /**
     * The highest possible value under the policy.
     * <p>Set immutably during construction but only accessed via
     * this method, enabling subclasses to define it dynamically by overriding.
     * @return {number}
     */
    max() {
        return this.__max;
    }
    /**
     * The lowest possible value under the policy.
     * <p>Set immutably during construction but only accessed via
     * this method, enabling subclasses to define it dynamically by overriding.
     * @return {number}
     */
    min() {
        return this.__min;
    }
    /**
     * Returns a valid increment to <code>existing</code> in the direction given
     * by <code>positive</code>, or zero if the incremented value is outside the range.
     * <p>Calculation of the increment takes into account
     * <code>unit</code>, <code>unitJump</code>, and <code>reverseIncrements</code> and
     * its sum with <code>existing</code> is validated using <code>valueValue</code>.
     * @param {number} existing
     * @param {boolean} positive
     * @return {number}
     */
    validIncrement(existing, positive) {
        let increment = this.unit() * this.unitJump() * (positive ? 1 : -1) * (this.reverseIncrements() ? -1 : 1);
        let proposed = existing + increment;
        let validated = this.validValue(existing, proposed);
        if (this.debug())
            this.trace$java_lang_String$java_lang_Object("NumericPolicy:", this.__min + "<=" + this.__max + ", existing=" + existing + ", nudged=" + proposed + ", validated=" + validated);
        return validated !== this.cycledValue(proposed) ? 0 : validated - existing;
    }
    /**
     * Returns the nearest valid value to <code>proposed</code>.
     * <p>Though not used in the basic implementation, specifying <code>existing</code>
     * as a parameter allows for non-linear validation in subclasses.
     * @param {number} existing
     * @param {number} proposed
     * @return {number}
     */
    validValue(existing, proposed) {
        let min = this.min();
        let max = this.max();
        let cycled = this.cycledValue(proposed);
        let adjusted = cycled < min ? min : cycled > max ? max : cycled;
        let jump = this.unit() * this.unitJump();
        let rounded = (d => { if (d === Number.NaN) {
            return d;
        }
        else if (Number.POSITIVE_INFINITY === d || Number.NEGATIVE_INFINITY === d) {
            return d;
        }
        else if (d == 0) {
            return d;
        }
        else {
            return Math.round(d);
        } })(adjusted / jump) * jump;
        if (this.debug()) {
            this.trace$java_lang_String$java_lang_Object("NumberPolicy: ", min + "<=" + max + ", existing=" + existing + ", proposed=" + Util.sf(proposed) + ", adjusted=" + Util.sf(adjusted) + ", jump=" + jump + ", rounded=" + Util.sf(rounded));
        }
        return rounded < min ? min : rounded > max ? max : rounded;
    }
    debug() {
        return false;
    }
    /**
     * The smallest possible increment under the policy.
     * <p>The default implementation deduces this value from {@link #format() }.
     * @return {number}
     */
    unit() {
        let format = this.format();
        if (format > NumberPolicy.FORMAT_DECIMALS_4)
            throw Object.defineProperty(new Error(format + " decimals not implemented in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        let unit = format < NumberPolicy.FORMAT_DECIMALS_1 ? 1 : format === NumberPolicy.FORMAT_DECIMALS_1 ? 0.1 : format === NumberPolicy.FORMAT_DECIMALS_2 ? 0.01 : format === NumberPolicy.FORMAT_DECIMALS_3 ? 0.001 : 1.0E-4;
        return unit;
    }
    /**
     * If <code>true</code>, values outside the range will be normalised to within
     * it.
     * <p>Default is <code>false</code>.
     * @return {boolean}
     */
    canCycle() {
        return false;
    }
    /**
     * Hint on formatting the number.
     * <p>These are defined by the class FORMAT_x constants, which are mutually exclusive.
     * <p>For FORMAT_PLACES_x constants
     * the format should normally be consistent with <code>unit</code>.
     * @return {number}
     */
    format() {
        return NumberPolicy.FORMAT_DECIMALS_0;
    }
    /**
     * The column width for text boxes in which values are to be displayed.
     * <p>Follows AWT convention.
     * @return {number}
     */
    columns() {
        return NumberPolicy.COLUMNS_DEFAULT;
    }
    toString() {
        return " format=" + this.format() + "  unit=" + Util.sf(this.unit()) + " " + Util.sf(this.min()) + "<=" + Util.sf(this.max());
    }
    cycledValue(proposed) {
        if (!this.canCycle())
            return proposed;
        let min = this.min();
        let max = this.max();
        let range = max - min;
        return proposed < min ? max - ((max - proposed) % range) : proposed > max ? min + ((proposed - min) % range) : proposed;
    }
    /**
     * Reverses the normal increment direction.
     * <p>Used by <code>validIncrement</code>, default is <code>false</code>.
     * @return {boolean}
     */
    reverseIncrements() {
        return false;
    }
    /**
     * Returns the multiple of <code>unit</code> defining the current minimum
     * valid value change.
     * @return {number}
     */
    unitJump() {
        return NumberPolicy.UNIT_JUMP_DEFAULT;
    }
}
NumberPolicy.COLUMNS_DEFAULT = 3;
NumberPolicy.UNIT_JUMP_DEFAULT = 1;
NumberPolicy.__debug = false;
NumberPolicy.FORMAT_DECIMALS_0 = 0;
NumberPolicy.FORMAT_DECIMALS_1 = 1;
NumberPolicy.FORMAT_DECIMALS_2 = 2;
NumberPolicy.FORMAT_DECIMALS_3 = 3;
NumberPolicy.FORMAT_DECIMALS_4 = 4;
NumberPolicy.FORMAT_HEX = -1;
NumberPolicy["__class"] = "fjs.util.NumberPolicy";
NumberPolicy["__interfaces"] = ["fjs.util.Identified"];
(function (NumberPolicy) {
    /**
     * Construct a tick-based policy that can optionally display the current value
     * within a local adjustment range.
     * <p>The policy is constructed from <code>min</code> to <code>max</code> as for its
     * superclass. If <code>range</code> is other than <code>NaN</code>, values
     * will be displayed within this adjustment range, which will centre on
     * the current value unless constrained by <code>min</code> to <code>max</code>.
     * @param {number} min
     * @param {number} max
     * @param {number} range
     * @class
     * @extends NumberPolicy
     */
    class Ticked extends NumberPolicy {
        constructor(min, max, range) {
            if (((typeof min === 'number') || min === null) && ((typeof max === 'number') || max === null) && ((typeof range === 'number') || range === null)) {
                let __args = Array.prototype.slice.call(arguments);
                super(min, max);
                this.__range = 0;
                this.__range = 0;
                (() => {
                    this.__range = range;
                })();
            }
            else if (((typeof min === 'number') || min === null) && ((typeof max === 'number') || max === null) && range === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                {
                    let __args = Array.prototype.slice.call(arguments);
                    let range = NaN;
                    super(min, max);
                    this.__range = 0;
                    this.__range = 0;
                    (() => {
                        this.__range = range;
                    })();
                }
            }
            else if (((typeof min === 'number') || min === null) && max === undefined && range === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                let range = __args[0];
                {
                    let __args = Array.prototype.slice.call(arguments);
                    let min = NumberPolicy.MIN_VALUE_$LI$();
                    let max = NumberPolicy.MAX_VALUE_$LI$();
                    super(min, max);
                    this.__range = 0;
                    this.__range = 0;
                    (() => {
                        this.__range = range;
                    })();
                }
            }
            else if (min === undefined && max === undefined && range === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                {
                    let __args = Array.prototype.slice.call(arguments);
                    let min = NaN;
                    let max = NaN;
                    let range = NaN;
                    super(min, max);
                    this.__range = 0;
                    this.__range = 0;
                    (() => {
                        this.__range = range;
                    })();
                }
            }
            else
                throw new Error('invalid overload');
        }
        validValue(existing, proposed) {
            let local = this;
            return local === this ? super.validValue(existing, proposed) : local.validValue(existing, proposed);
        }
        /**
         * The number of ticks between each label.
         * @return {number}
         */
        labelSpacing() {
            return Ticked.LABEL_TICKS_DEFAULT;
        }
        /**
         * Returns the policy to be used for local adjustment.
         * <p>The default is to return the {@link Ticked} itself; this can be
         * overridden to return a policy for local adjustment where the {@link Ticked}
         * is full-range but local adjustment is also required.
         * @return {NumberPolicy.Ticked}
         */
        localTicks() {
            return this;
        }
        /**
         * The range of possible values.
         * <p>Set immutably during construction but only accessed via
         * this method, enabling subclasses to define it dynamically by overriding.
         * @return {number}
         */
        range() {
            return this.__range !== this.__range ? this.max() - this.min() : this.__range;
        }
        /**
         * Defines the snap-to-ticks contentStyle.
         * <p>The value returned should be one of
         * <ul><li>SNAP_NONE</li>
         * <li>SNAP_TICKS</li>
         * <li>SNAP_LABELS</li>
         * </ul>
         * @return {number}
         */
        snapType() {
            return Ticked.SNAP_TICKS;
        }
        /**
         * The spacing between each tick, in the value returned by {@link #unit()}.
         * @return {number}
         */
        tickSpacing() {
            return 1;
        }
        /**
         * Returns the multiple of <code>unit</code> defining the current minimum
         * valid value change, based on the current snap policy.
         * <p>The value returned is determined by the values of <code>snapType</code>
         * and <code>tickSpacing</code>.
         * @return {number}
         */
        unitJump() {
            let snap = this.snapType();
            let tick = this.tickSpacing();
            return snap === Ticked.SNAP_LABELS ? tick * this.labelSpacing() : snap === Ticked.SNAP_TICKS ? tick : 1;
        }
        toString() {
            let local = this.localTicks();
            return super.toString() + (local === this ? "" : local);
        }
    }
    Ticked.SNAP_NONE = 0;
    Ticked.SNAP_TICKS = 1;
    Ticked.SNAP_LABELS = 2;
    Ticked.TICKS_DEFAULT = 1;
    Ticked.LABEL_TICKS_DEFAULT = 10;
    NumberPolicy.Ticked = Ticked;
    Ticked["__class"] = "fjs.util.NumberPolicy.Ticked";
    Ticked["__interfaces"] = ["fjs.util.Identified"];
})(NumberPolicy || (NumberPolicy = {}));
NumberPolicy.MAX_VALUE_$LI$();
NumberPolicy.MIN_VALUE_$LI$();

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Unique constructor.
 * @param {string} title passed to superclass
 * @param {number} value the initial value
 * @param {SNumeric.Coupler} coupler must supply application-specific mechanism and policy
 * @class
 * @extends TargetCore
 */
class SNumeric extends TargetCore {
    constructor(title, value, coupler) {
        super(title);
        /*private*/ this.__value = NaN;
        this.coupler = null;
        this.__policy = null;
        this.coupler = coupler;
        this.__policy = coupler.policy(this);
        if (this.__policy == null)
            throw Object.defineProperty(new Error("No policy in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        this.setValue(value);
    }
    value() {
        if (this.__value !== this.__value)
            throw Object.defineProperty(new Error("Not a number in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else if (SNumeric.doRangeChecks) {
            let min = this.__policy.min();
            let max = this.__policy.max();
            if (this.__value < min || this.__value > max)
                throw Object.defineProperty(new Error("Value " + this.__value + " should be >=" + min + " and <=" + max + " in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        }
        return this.__value;
    }
    /**
     * Sets the nearest valid value to <code>value</code>.
     * <p>Validity will be as defined by <code>validValue</code> in
     * the {@link NumberPolicy} returned as <code>policy</code>.
     * Subsequently calls <code>valueSet</code> in the {@link SNumeric.Coupler} with which the
     * {@link SNumeric} was constructed.
     * @param {number} value
     */
    setValue(value) {
        let first = this.__value !== this.__value;
        this.__value = this.policy().validValue(this.__value, value);
        if (!first)
            this.coupler.valueSet(this);
    }
    /**
     * Returns the current number policy.
     * <p>The policy is that returned by the {@link fjs.core.SNumeric.Coupler}
     * with which the {@link SNumeric} was constructed.
     * @return {NumberPolicy}
     */
    policy() {
        return this.__policy;
    }
    toString() {
        let p = this.policy();
        return super.toString() + " value=" + Util.sf(this.__value) + " policy=" + p;
    }
    /**
     *
     * @return {*}
     */
    state() {
        return this.value();
    }
    /**
     *
     * @param {*} update
     */
    updateState(update) {
        this.setValue(update);
    }
}
SNumeric.doRangeChecks = false;
SNumeric["__class"] = "fjs.core.SNumeric";
SNumeric["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];
(function (SNumeric) {
    /**
     * Connects a {@link SNumeric} to the application.
     * <p>A {@link Coupler} supplies policy and/or client-specific
     * mechanism to a {@link SNumeric}.
     * @class
     * @extends TargetCoupler
     */
    class Coupler extends TargetCoupler {
        constructor() {
            super();
        }
        /**
         * Returns the policy to be used by a {@link fjs.core.SNumeric}
         * constructed with this {@link Coupler}.
         * @param {SNumeric} n
         * @return {NumberPolicy}
         */
        policy(n) {
            return new NumberPolicy(0, 0);
        }
        /**
         * Defines client-specific mechanism for a {@link fjs.core.SNumeric}.
         * <p>This method is called whenever <code>setValue</code> is called on <code>n</code>.
         * @param {SNumeric} n
         */
        valueSet(n) {
            throw Object.defineProperty(new Error("Not implemented in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        }
    }
    SNumeric.Coupler = Coupler;
    Coupler["__class"] = "fjs.core.SNumeric.Coupler";
})(SNumeric || (SNumeric = {}));

var STarget;
(function (STarget) {
    function newTargets(src) {
        let type = "fjs.core.STarget";
        let array = new Array(src.length);
        /* arraycopy */ ((srcPts, srcOff, dstPts, dstOff, size) => { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            let tmp = srcPts.slice(srcOff, srcOff + size);
            for (let i = 0; i < size; i++)
                dstPts[dstOff++] = tmp[i];
        } })(src, 0, array, 0, array.length);
        return array;
    }
    STarget.newTargets = newTargets;
})(STarget || (STarget = {}));

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Core constructor.
 * @param {string} title passed to superclass
 * @param {STextual.Coupler} coupler can supply application-specific mechanism and policy;
 * must be non-<code>null</code>
 * @class
 * @extends TargetCore
 */
class STextual extends TargetCore {
    constructor(title, coupler) {
        super(title);
        this.coupler = null;
        this.__text = null;
        this.textSet = false;
        if ((this.coupler = coupler) == null)
            throw Object.defineProperty(new Error("Null coupler in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
    }
    /**
     * Sets the text value to be exposed.
     * <p>Also calls {@link STextual.Coupler#textSet(STextual)} if not initialising.
     * @param {string} text must be non-<code>null</code>; and non-blank
     * unless {@link STextual.Coupler#isValidText(STextual, String)}
     * returns <code>true</code>.
     */
    setText(text) {
        if (text == null || !this.coupler.isValidText(this, text))
            throw Object.defineProperty(new Error("Null or invalid text in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        this.__text = text;
        if (this.textSet)
            this.coupler.textSet(this);
        this.textSet = true;
        
    }
    /**
     * The text value represented.
     * @return {string}
     */
    text() {
        if (this.__text != null)
            return this.__text;
        let text = this.coupler.getText(this);
        if (text == null || !this.coupler.isValidText(this, text))
            throw Object.defineProperty(new Error("Null or invalid text in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else
            return text;
    }
    /**
     *
     * @return {*}
     */
    state() {
        return this.text();
    }
    /**
     *
     * @param {*} update
     */
    updateState(update) {
        this.setText(update);
    }
    toString() {
        return super.toString() + ("");
    }
}
STextual["__class"] = "fjs.core.STextual";
STextual["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];
(function (STextual) {
    /**
     * Connects a {@link STextual} to the application.
     * <p>A {@link Coupler} is required to supply a {@link STextual}
     * with client-specific policy or mechanism.
     * @class
     * @extends TargetCoupler
     */
    class Coupler extends TargetCoupler {
        constructor() {
            super();
        }
        /**
         * Called when <code>setText</code> is called on <code>t</code>.
         * @param {STextual} t
         */
        textSet(t) {
        }
        /**
         * Is this text valid for the {@link STextual}?
         * <p>Default returns <code>true</code> for non-blank text.
         * @param {STextual} t
         * @param {string} text
         * @return {boolean}
         */
        isValidText(t, text) {
            return !((o1, o2) => { if (o1 && o1.equals) {
                return o1.equals(o2);
            }
            else {
                return o1 === o2;
            } })(text.trim(), "");
        }
        getText(t) {
            throw Object.defineProperty(new Error("Not implemented in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        }
    }
    STextual.Coupler = Coupler;
    Coupler["__class"] = "fjs.core.STextual.Coupler";
})(STextual || (STextual = {}));

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Unique constructor.
 * @param {string} title passed to superclass
 * @param {boolean} state initial state of the toggling
 * @param {SToggling.Coupler} coupler can supply application-specific mechanism
 * @class
 * @extends TargetCore
 */
class SToggling extends TargetCore {
    constructor(title, state, coupler) {
        super(title);
        this.coupler = null;
        this.__state = false;
        this.__state = state;
        this.coupler = coupler;
    }
    /**
     * The Boolean state of the toggling.
     * <p>The value returned will that set using
     * <code>setState</code> or during construction.
     * @return {boolean}
     */
    isSet() {
        return this.__state;
    }
    /**
     * Sets the Boolean state.
     * <p> Subsequently calls {@link fjs.core.SToggling.Coupler#stateSet(SToggling)}.
     * @param {boolean} state
     */
    set(state) {
        this.__state = state;
        this.coupler.stateSet(this);
    }
    /**
     *
     * @param {*} update
     */
    updateState(update) {
        this.set(update);
    }
    /**
     *
     * @return {*}
     */
    state() {
        return this.isSet();
    }
    toString() {
        return super.toString() + (" " + this.__state);
    }
}
SToggling["__class"] = "fjs.core.SToggling";
SToggling["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];
(function (SToggling) {
    /**
     * Connects a {@link SToggling} to the application.
     * <p>A {@link Coupler} supplies application-specific mechanism
     * for a {@link SToggling}.
     * @class
     * @extends TargetCoupler
     */
    class Coupler extends TargetCoupler {
        constructor() {
            super();
        }
        /**
         * Called by the toggling whenever its state is set.
         * @param {SToggling} t
         */
        stateSet(t) {
        }
    }
    SToggling.Coupler = Coupler;
    Coupler["__class"] = "fjs.core.SToggling.Coupler";
})(SToggling || (SToggling = {}));

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
/**
 * Unique constructor.
 * @param {string} title passed to superclass
 * @param {STrigger.Coupler} coupler supplies application-specific mechanism
 * @class
 * @extends TargetCore
 */
class STrigger extends TargetCore {
    constructor(title, coupler) {
        super(title);
        this.coupler = null;
        if (coupler == null)
            throw Object.defineProperty(new Error("Null coupler in " + Debug.info(this)), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        this.coupler = coupler;
    }
    /**
     * Initiates the application process represented.
     * <p>Calls {@link Coupler#fired(STrigger)}.
     */
    fire() {
        this.coupler.fired(this);
    }
    /**
     *
     * @return {*}
     */
    state() {
        return "Stateless!";
    }
    /**
     *
     * @param {*} update
     */
    updateState(update) {
        this.fire();
    }
}
STrigger["__class"] = "fjs.core.STrigger";
STrigger["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];
(function (STrigger) {
    /**
     * Connects a {@link STrigger} to the application.
     * <p>A {@link Coupler} supplies application-specific mechanism and policy
     * for a {@link STrigger}.
     * @class
     * @extends TargetCoupler
     */
    class Coupler extends TargetCoupler {
        constructor() {
            super();
        }
    }
    STrigger.Coupler = Coupler;
    Coupler["__class"] = "fjs.core.STrigger.Coupler";
})(STrigger || (STrigger = {}));

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
class Facets extends Tracer {
    constructor(top, trace) {
        super(top);
        this.times = new Facets.Times(this);
        /*private*/ this.titleTargeters = ({});
        /*private*/ this.titleTrees = ({});
        /*private*/ this.notifiable = new Facets.Facets$0(this);
        this.doTrace = false;
        this.root = null;
        this.rootTargeter = null;
        this.onRetargeted = null;
        this.indexingFrames = 0;
        this.doTrace = trace;
        let indexing = new SIndexing("RootIndexing", new Facets.Facets$1(this));
        this.root = new IndexingFrame("RootFrame", indexing);
        this.trace$java_lang_String$java_lang_Object(" > Created trees root ", this.root);
    }
    /**
     *
     * @param {string} msg
     */
    doTraceMsg(msg) {
        if (this.doTrace || (Debug.trace && ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(msg, ">>")))
            super.doTraceMsg(msg);
    }
    buildSurface(newTrees, buildLayout, onRetargeted) {
        this.onRetargeted = (onRetargeted);
        this.trace$java_lang_String("Building surface...");
        let trees = (target => (typeof target === 'function') ? target(this) : target.apply(this))(newTrees);
        if (trees != null && trees instanceof Array && (trees.length == 0 || trees[0] == null || trees[0] != null)) {
            let array545 = trees;
            for (let index544 = 0; index544 < array545.length; index544++) {
                let each = array545[index544];
                this.addContentTree(each);
            }
        }
        else
            this.addContentTree(trees);
        this.buildTargeterTree();
        this.trace$java_lang_String("Built targets, created targeters");
        (target => (typeof target === 'function') ? target(this) : target.accept(this))(buildLayout);
        this.trace$java_lang_String("Attached and laid out facets");
        this.trace$java_lang_String("Surface built.");
    }
    addContentTree(add) {
        let title = add.title();
        this.trace$java_lang_String(" > Adding content title=" + title);
        /* put */ (this.titleTrees[title] = add);
        this.root.indexing().setIndexed(add);
    }
    activateContentTree(title) {
        this.trace$java_lang_String(" > Activating content title=" + title);
        let tree = ((m, k) => m[k] ? m[k] : null)(this.titleTrees, title);
        if (tree == null)
            throw Object.defineProperty(new Error("Null tree in " + this), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        this.root.indexing().setIndexed(tree);
        this.notifiable.notify(this.root);
    }
    buildTargeterTree() {
        this.trace$java_lang_String$java_lang_Object(" > Building targeter tree for root=", this.root);
        if (this.rootTargeter == null)
            this.rootTargeter = this.root.newTargeter();
        this.rootTargeter.setNotifiable(this.notifiable);
        this.rootTargeter.retarget(this.root);
        this.putTitleTargeters(this.rootTargeter);
        this.trace$java_lang_String(" > Created targeters=" + (obj => Object.keys(obj).map(key => obj[key]))(this.titleTargeters).length);
        this.callOnRetargeted();
    }
    putTitleTargeters(t) {
        let title = t.title();
        let then = ((m, k) => m[k] ? m[k] : null)(this.titleTargeters, title);
        /* put */ (this.titleTargeters[title] = t);
        let elements = t.titleElements();
        if (false && then == null)
            this.trace$java_lang_String("> Added targeter: title=" + title + (": titleTargeters=" + (obj => Object.keys(obj).map(key => obj[key]))(this.titleTargeters).length));
        for (let index546 = 0; index546 < elements.length; index546++) {
            let e = elements[index546];
            this.putTitleTargeters(e);
        }
    }
    callOnRetargeted() {
        if (this.onRetargeted == null)
            return;
        let title = this.root.indexedTarget().title();
        this.trace$java_lang_String(" > Calling onRetargeted with active=" + title);
        (target => (typeof target === 'function') ? target(this, title) : target.accept(this, title))(this.onRetargeted);
    }
    newTextualTarget(title, c) {
        let textual = new STextual(title, new Facets.Facets$2(this, c));
        let passText = c.passText;
        if (passText != null)
            textual.setText(passText);
        this.trace$java_lang_String$java_lang_Object(" > Created textual ", textual);
        return textual;
    }
    newTogglingTarget(title, c) {
        let passSet = c.passSet;
        if (passSet == null)
            throw Object.defineProperty(new Error("Null passSet for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        let toggling = new SToggling(title, passSet, new Facets.Facets$3(this, c));
        this.trace$java_lang_String$java_lang_Object(" > Created toggling ", toggling);
        return toggling;
    }
    newNumericTarget(title, c) {
        let numeric = new SNumeric(title, c.passValue, new Facets.Facets$4(this, c));
        this.trace$java_lang_String$java_lang_Object(" > Created numeric ", numeric);
        return numeric;
    }
    newTriggerTarget(title, c) {
        let trigger = new STrigger(title, new Facets.Facets$5(this, c));
        this.trace$java_lang_String$java_lang_Object(" > Created trigger ", trigger);
        return trigger;
    }
    newTargetGroup(title, members) {
        let group = new (__Function$1.prototype.bind.apply(TargetCore, [null, title].concat(members)));
        this.trace$java_lang_String$java_lang_Object(" > Created target group " + Debug.info(group) + " ", members);
        return group;
    }
    updatedTarget(target, c) {
        let title = target.title();
        this.trace$java_lang_String$java_lang_Object(" > Updated target ", target);
        if (c.targetStateUpdated != null) {
            let state = target.state();
            (target => (typeof target === 'function') ? target(state, title) : target.accept(state, title))(c.targetStateUpdated);
        }
    }
    newIndexingTarget(title, c) {
        let indexing = new SIndexing(title, new Facets.Facets$6(this, c));
        let passIndex = c.passIndex;
        if (passIndex == null)
            throw Object.defineProperty(new Error("Null passIndex for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else
            indexing.setIndex(passIndex);
        this.trace$java_lang_String$java_lang_Object(" > Created indexing ", indexing);
        return indexing;
    }
    getIndexingState(title) {
        let titleTarget = this.titleTarget(title);
        if (titleTarget == null)
            throw Object.defineProperty(new Error("Null target for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        let indexing = titleTarget;
        return Object.defineProperty({
            uiSelectables: indexing.facetSelectables(),
            indexed: indexing.indexed()
        }, '__interfaces', { configurable: true, value: ["fjs.globals.Facets.IndexingState"] });
    }
    newIndexingFrame(p) {
        let indexing = new SIndexing(p.indexingTitle, new Facets.Facets$7(this, p));
        indexing.setIndex(0);
        let title = p.frameTitle != null ? p.frameTitle : "IndexingFrame" + this.indexingFrames++;
        let frame = new Facets.LocalIndexingFrame(title, indexing, p);
        this.trace$java_lang_String$java_lang_Object(" > Created indexing frame ", frame);
        return frame;
    }
    getTargetFramed(title) {
        let frame = this.titleTarget(title);
        if (frame == null)
            throw Object.defineProperty(new Error("Null frame for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        return frame.framed;
    }
    titleTarget(title) {
        let targeter = ((m, k) => m[k] ? m[k] : null)(this.titleTargeters, title);
        return targeter == null ? null : targeter.target();
    }
    attachFacet(title, facetUpdated) {
        if (facetUpdated == null)
            throw Object.defineProperty(new Error("Null facetUpdated for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        else if (title == null || ((o1, o2) => { if (o1 && o1.equals) {
            return o1.equals(o2);
        }
        else {
            return o1 === o2;
        } })(title, ""))
            throw Object.defineProperty(new Error("Null or empty title for " + facetUpdated), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        let targeter = ((m, k) => m[k] ? m[k] : null)(this.titleTargeters, title);
        if (targeter == null)
            throw Object.defineProperty(new Error("Null targeter for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        let facet = new Facets.Facets$8(this, facetUpdated);
        this.trace$java_lang_String$java_lang_Object(" > Attaching facet " + facet + " to", targeter);
        targeter.attachFacet(facet);
    }
    updateTargetState(title, update) {
        this.trace$java_lang_String$java_lang_Object(" > Updating target state for title=" + title + " update=", update);
        let target = this.titleTarget(title);
        if (target == null)
            throw Object.defineProperty(new Error("Null target for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        target.updateState(update);
    }
    notifyTargetUpdated(title) {
        let target = this.titleTarget(title);
        if (target == null)
            throw Object.defineProperty(new Error("Null target for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        target.notifyParent();
    }
    updateTargetWithNotify(title, update) {
        this.updateTargetState(title, update);
        this.notifyTargetUpdated(title);
    }
    getTargetState(title) {
        let target = this.titleTarget(title);
        if (target == null)
            return null;
        let state = target.state();
        this.trace$java_lang_String$java_lang_Object(" > Getting target state for title=" + title + " state=", state);
        return state;
    }
    setTargetLive(title, live) {
        let target = this.titleTarget(title);
        if (target == null)
            throw Object.defineProperty(new Error("Null target for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else
            target.setLive(live);
    }
    isTargetLive(title) {
        let target = this.titleTarget(title);
        if (target == null)
            throw Object.defineProperty(new Error("Null target for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        else
            return target.isLive();
    }
    _newFrameTarget(title, toFrame, editTargets) {
        let asTargets = STarget.newTargets(editTargets);
        return new Facets.Facets$9(this, title, toFrame, asTargets);
    }
}
Facets["__class"] = "fjs.globals.Facets";
Facets["__interfaces"] = ["fjs.util.Identified"];
(function (Facets) {
    class LocalIndexingFrame extends IndexingFrame {
        constructor(title, indexing, p) {
            super(title, indexing);
            this.p = null;
            this.p = p;
        }
        lazyElements() {
            let getter = (this.p.newFrameTargets);
            let got = getter != null ? (target => (typeof target === 'function') ? target() : target.get())(getter) : [];
            return got == null ? [] : STarget.newTargets(got);
        }
        /**
         *
         * @param {*} indexed
         * @return {*}
         */
        newIndexedTargets(indexed) {
            let titler = (this.p.newIndexedTreeTitle);
            let indexedTargetsTitle = titler == null ? this.title() + "|indexed" : (target => (typeof target === 'function') ? target(indexed) : target.apply(indexed))(titler);
            return this.p.newIndexedTree == null ? new TargetCore(indexedTargetsTitle) : (target => (typeof target === 'function') ? target(indexed, indexedTargetsTitle) : target.apply(indexed, indexedTargetsTitle))(this.p.newIndexedTree);
        }
    }
    Facets.LocalIndexingFrame = LocalIndexingFrame;
    LocalIndexingFrame["__class"] = "fjs.globals.Facets.LocalIndexingFrame";
    LocalIndexingFrame["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];
    class Times {
        constructor(__parent) {
            this.debug = false;
            this.__parent = __parent;
            this.doTime = false;
            this.resetWait = 1000;
            this.then = 0;
            this.start = 0;
            this.restarted = false;
        }
        setResetWait(millis) {
            if (this.debug)
                Util.printOut$java_lang_String$java_lang_Object("Times.setResetWait: wait=", millis);
            this.start = this.newMillis();
            this.doTime = true;
            this.resetWait = millis;
        }
        /**
         * The time since the last auto-reset.
         * <p>Interval for reset set by {@link #resetWait}.
         * @return {number}
         */
        elapsed() {
            let now = this.newMillis();
            if (now - this.then > this.resetWait) {
                this.start = now;
                this.restarted = true;
                if (this.debug)
                    Util.printOut$java_lang_String("Times: reset resetWait=" + this.resetWait);
            }
            else
                this.restarted = false;
            return (this.then = now) - this.start;
        }
        /**
         * Print {@link #elapsed()} followed by the message.
         * @param {string} msg
         */
        traceElapsed(msg) {
            if (!this.doTime) {
                if (!Debug.trace) {
                    this.start = this.then = this.newMillis();
                    if (this.debug)
                        Util.printOut$java_lang_String$java_lang_Object("Times.printElapsed: times=", this.doTime);
                }
                return;
            }
            let elapsed = this.elapsed();
            let elapsedText = true && elapsed > 5 * 1000 ? (Util.fxs(elapsed / 1000.0)) : ("" + elapsed);
            let toPrint = (this.restarted ? "\n" : "") + elapsedText + (msg != null ? ":\t" + msg : "");
            Util.printOut$java_lang_String(toPrint);
        }
        newMillis() {
            return Date.now();
        }
    }
    Facets.Times = Times;
    Times["__class"] = "fjs.globals.Facets.Times";
    class _LocalFrameTarget extends SFrameTarget {
        constructor(title, toFrame, newIndexedTargets) {
            super(title, toFrame);
            this.newIndexedTargets = null;
            this.newIndexedTargets = newIndexedTargets;
        }
        /**
         *
         * @return {Array}
         */
        lazyElements() {
            return this.newIndexedTargets;
        }
    }
    Facets._LocalFrameTarget = _LocalFrameTarget;
    _LocalFrameTarget["__class"] = "fjs.globals.Facets._LocalFrameTarget";
    _LocalFrameTarget["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];
    class Facets$0 {
        constructor(__parent) {
            this.__parent = __parent;
        }
        /**
         *
         * @param {*} notice
         */
        notify(notice) {
            let msg = "> Surface for " + Debug.info(this.__parent.rootTargeter) + " notified by " + notice;
            if (this.__parent.times.doTime)
                this.__parent.times.traceElapsed(msg);
            else
                this.__parent.trace(msg);
            let target = this.__parent.rootTargeter.target();
            this.__parent.rootTargeter.retarget(target);
            msg = "> Targeters retargeted on " + Debug.info(target);
            if (this.__parent.times.doTime)
                this.__parent.times.traceElapsed(msg);
            else
                this.__parent.trace(msg);
            this.__parent.callOnRetargeted();
            this.__parent.rootTargeter.retargetFacets();
            msg = "> Facets retargeted in " + Debug.info(this.__parent.rootTargeter);
            if (this.__parent.times.doTime)
                this.__parent.times.traceElapsed(msg);
            else
                this.__parent.trace(msg);
        }
        /**
         *
         * @return {string}
         */
        title() {
            throw Object.defineProperty(new Error("Not implemented in " + this), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        }
    }
    Facets.Facets$0 = Facets$0;
    Facets$0["__interfaces"] = ["fjs.core.Notifiable", "fjs.util.Titled"];
    class Facets$1 extends SIndexing.Coupler {
        constructor(__parent) {
            super();
            this.__parent = __parent;
            this.thenIndexables = null;
        }
        /**
         *
         * @param {SIndexing} i
         * @return {Array}
         */
        getIndexables(i) {
            let trees = (obj => Object.keys(obj).map(key => obj[key]))(this.__parent.titleTrees).slice(0);
            let equal = Util.arraysEqual(trees, this.thenIndexables);
            if (!equal)
                this.__parent.trace("> New trees: ", trees);
            this.thenIndexables = trees;
            return trees;
        }
    }
    Facets.Facets$1 = Facets$1;
    class Facets$2 extends STextual.Coupler {
        constructor(__parent, c) {
            super();
            this.c = c;
            this.__parent = __parent;
        }
        /**
         *
         * @param {STextual} target
         */
        textSet(target) {
            this.__parent.updatedTarget(target, this.c);
        }
        /**
         *
         * @param {STextual} t
         * @return {string}
         */
        getText(t) {
            let getText = (this.c.getText);
            let title = t.title();
            if (getText == null)
                throw Object.defineProperty(new Error("Null getText for " + title), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
            else
                return (target => (typeof target === 'function') ? target(title) : target.apply(title))(getText);
        }
        /**
         *
         * @param {STextual} t
         * @param {string} text
         * @return {boolean}
         */
        isValidText(t, text) {
            let valid = (this.c.isValidText);
            return valid == null ? true : (target => (typeof target === 'function') ? target(t.title(), text) : target.test(t.title(), text))(valid);
        }
    }
    Facets.Facets$2 = Facets$2;
    class Facets$3 extends SToggling.Coupler {
        constructor(__parent, c) {
            super();
            this.c = c;
            this.__parent = __parent;
        }
        /**
         *
         * @param {SToggling} target
         */
        stateSet(target) {
            this.__parent.updatedTarget(target, this.c);
        }
    }
    Facets.Facets$3 = Facets$3;
    class Facets$4 extends SNumeric.Coupler {
        constructor(__parent, c) {
            super();
            this.c = c;
            this.__parent = __parent;
        }
        /**
         *
         * @param {SNumeric} n
         */
        valueSet(n) {
            this.__parent.updatedTarget(n, this.c);
        }
        /**
         *
         * @param {SNumeric} n
         * @return {NumberPolicy}
         */
        policy(n) {
            let min = this.c.min != null ? this.c.min : Number.MIN_VALUE;
            let max = this.c.max != null ? this.c.max : Number.MAX_VALUE;
            return new NumberPolicy(min, this.c.max);
        }
    }
    Facets.Facets$4 = Facets$4;
    class Facets$5 extends STrigger.Coupler {
        constructor(__parent, c) {
            super();
            this.c = c;
            this.__parent = __parent;
        }
        /**
         *
         * @param {STrigger} t
         */
        fired(t) {
            this.__parent.updatedTarget(t, this.c);
        }
    }
    Facets.Facets$5 = Facets$5;
    class Facets$6 extends SIndexing.Coupler {
        constructor(__parent, c) {
            super();
            this.c = c;
            this.__parent = __parent;
        }
        /**
         *
         * @param {SIndexing} i
         * @return {Array}
         */
        getIndexables(i) {
            return (target => (typeof target === 'function') ? target(i.title()) : target.apply(i.title()))(this.c.getIndexables);
        }
        /**
         *
         * @param {SIndexing} target
         */
        indexSet(target) {
            this.__parent.updatedTarget(target, this.c);
        }
        /**
         *
         * @param {SIndexing} i
         * @return {Array}
         */
        getFacetSelectables(i) {
            let getter = (this.c.newUiSelectable);
            if (getter == null)
                return super.getFacetSelectables(i);
            let selectables = ([]);
            let at = 0;
            {
                let array548 = i.indexables();
                for (let index547 = 0; index547 < array548.length; index547++) {
                    let each = array548[index547];
                    /* add */ (selectables.push((target => (typeof target === 'function') ? target(each) : target.apply(each))(getter)) > 0);
                }
            }
            return ((a1, a2) => { if (a1.length >= a2.length) {
                a1.length = 0;
                a1.push.apply(a1, a2);
                return a1;
            }
            else {
                return a2.slice(0);
            } })([], selectables);
        }
    }
    Facets.Facets$6 = Facets$6;
    class Facets$7 extends SIndexing.Coupler {
        constructor(__parent, p) {
            super();
            this.p = p;
            this.__parent = __parent;
            this.thenIndexables = null;
            this.thenSelectables = null;
        }
        /**
         *
         * @param {SIndexing} i
         * @return {Array}
         */
        getIndexables(i) {
            let got = (target => (typeof target === 'function') ? target() : target.get())(this.p.getIndexables);
            if (got == null)
                throw Object.defineProperty(new Error("Null getIndexables for " + i.title()), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.IllegalStateException', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
            let equal = Util.arraysEqual(got, this.thenIndexables);
            if (!equal)
                this.__parent.trace("> Got new indexables in " + Debug.info(i) + ": ", got);
            this.thenIndexables = got;
            return got;
        }
        /**
         *
         * @param {SIndexing} i
         * @return {Array}
         */
        getFacetSelectables(i) {
            let getter = (this.p.newUiSelectable);
            if (getter == null)
                return super.getFacetSelectables(i);
            let selectables = ([]);
            let at = 0;
            {
                let array550 = i.indexables();
                for (let index549 = 0; index549 < array550.length; index549++) {
                    let each = array550[index549];
                    /* add */ (selectables.push((target => (typeof target === 'function') ? target(each) : target.apply(each))(getter)) > 0);
                }
            }
            let got = ((a1, a2) => { if (a1.length >= a2.length) {
                a1.length = 0;
                a1.push.apply(a1, a2);
                return a1;
            }
            else {
                return a2.slice(0);
            } })([], selectables);
            let equal = Util.arraysEqual(got, this.thenSelectables);
            if (!equal)
                this.__parent.trace("> Got new selectables in " + Debug.info(i) + ": ", got);
            this.thenSelectables = got;
            return got;
        }
    }
    Facets.Facets$7 = Facets$7;
    class Facets$8 {
        constructor(__parent, facetUpdated) {
            this.facetUpdated = facetUpdated;
            this.__parent = __parent;
            this.id = Tracer.ids++;
        }
        /**
         *
         * @param {*} target
         */
        retarget(target) {
            let state = target.state();
            let title = target.title();
            this.__parent.trace(" > Updating UI for " + title + " with state=", state);
            (target => (typeof target === 'function') ? target(state) : target.accept(state))(this.facetUpdated);
        }
        /**
         *
         * @return {string}
         */
        toString() {
            return "#" + this.__parent.id;
        }
    }
    Facets.Facets$8 = Facets$8;
    Facets$8["__interfaces"] = ["fjs.core.SRetargetable", "fjs.core.SFacet"];
    class Facets$9 extends SFrameTarget {
        constructor(__parent, __arg0, __arg1, asTargets) {
            super(__arg0, __arg1);
            this.asTargets = asTargets;
            this.__parent = __parent;
        }
        /**
         *
         * @return {Array}
         */
        lazyElements() {
            return this.asTargets;
        }
    }
    Facets.Facets$9 = Facets$9;
    Facets$9["__interfaces"] = ["fjs.core.STarget", "fjs.util.Identified", "fjs.core.Notifying", "fjs.core.Notifiable", "fjs.util.Titled"];
})(Facets || (Facets = {}));
var __Function$1 = Function;

/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
function newInstance(trace) {
    return new Facets("Facets", trace);
}

exports.newInstance = newInstance;

}((this.Facets = this.Facets || {})));
//# sourceMappingURL=Facets.js.map
