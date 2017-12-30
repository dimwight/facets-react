(function (exports) {
'use strict';

class NotifyingCore {
    setNotifiable(n) {
        this.notifiable_ = n;
    }
    notifiable() {
        return this.notifiable_;
    }
    notifyParent() {
        this.notifiable_.notify(this);
    }
    notify(notice) {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=NotifyingCore.js.map

/**
 * Simplifies instrumenting code
 * @param top heading for message
 * @param thing suitable for JSON serialization
 */
function traceThing(top, thing) {
    // Allow for quick disable
    if (top.charAt(0) === '^')
        return;
    // Allow for callback eg to find and kill circular references
    const callback = null;
    // Construct body
    const tail = !thing ? '' : JSON.stringify(thing, callback, 1);
    // Issue complete message
    console.log(top, tail);
}
//# sourceMappingURL=Bits.js.map

//# sourceMappingURL=SwapArrayElement.js.map

//# sourceMappingURL=_globals.js.map

class TargeterCore {
    constructor() {
        this.title_ = 'Untargeted';
        this.facets_ = [];
    }
    notify(notice) {
        this.notifiable.notify(notice);
    }
    setNotifiable(notifiable) {
        this.notifiable = notifiable;
    }
    retarget(target) {
        if (!target)
            throw new Error('Missing target');
        this.target_ = target;
        const targets = target.elements();
        traceThing('^retarget', targets);
        if (!this.elements_)
            this.elements_ = targets.map(targety => {
                let element = targety.newTargeter();
                element.setNotifiable(this);
                return element;
            });
        if (targets.length === this.elements_.length)
            this.elements_.forEach((e, at) => e.retarget(targets[at]));
        if (target.notifiesTargeter())
            target.setNotifiable(this);
    }
    title() {
        return this.target_ ? this.target_.title() : this.title_;
    }
    target() {
        if (!this.target_)
            throw new Error(this.title_);
        else
            return this.target_;
    }
    elements() {
        return this.elements_;
    }
    attachFacet(f) {
        if (!this.facets_.includes(f))
            this.facets_.push(f);
        f.retarget(this.target_);
    }
    retargetFacets() {
        this.elements_.forEach(e => e.retargetFacets());
        this.facets_.forEach(f => f.retarget(this.target_));
    }
}
//# sourceMappingURL=TargeterCore.js.map

class IndexingFrameTargeter$$1 extends TargeterCore {
    constructor() {
        super(...arguments);
        this.titleTargeters = new Map();
    }
    retarget(Targety) {
        super.retarget(Targety);
        this.updateToTarget();
        if (!this.indexing) {
            this.indexing = this.indexingTarget.newTargeter();
            this.indexing.setNotifiable(this);
        }
        if (this.titleTargeters.size === 0) {
            let atThen = this.indexingTarget.index();
            for (let at = 0; at < this.indexingTarget.indexables().length; at++) {
                this.indexingTarget.setIndex(at);
                this.updateToTarget();
                this.indexed = this.indexedTarget.newTargeter();
                this.indexed.setNotifiable(this);
                this.indexed.retarget(this.indexedTarget);
                this.titleTargeters.set(this.indexedTitle, this.indexed);
            }
            this.indexingTarget.setIndex(atThen);
            this.updateToTarget();
        }
        this.indexing.retarget(this.indexingTarget);
        this.indexed = this.titleTargeters.get(this.indexedTitle);
        if (!this.indexed)
            throw new Error('No indexed for ' + this.indexedTitle);
        this.indexed.retarget(this.indexedTarget);
    }
    retargetFacets() {
        super.retargetFacets();
        this.indexing.retargetFacets();
        for (let t in this.titleTargeters.values())
            t.retargetFacets();
    }
    titleElements() {
        let list = this.elements();
        list.push(this.indexing);
        for (let t in this.titleTargeters.values())
            list.push(t);
        return list;
    }
    updateToTarget() {
        let frame = this.target();
        this.indexingTarget = frame.indexing();
        this.indexedTarget = frame.indexedTarget();
        this.indexedTitle = this.indexedTarget.title();
    }
}

//# sourceMappingURL=_locals.js.map

class TargetCore extends NotifyingCore {
    constructor(title_, extra) {
        super();
        this.title_ = title_;
        this.extra = extra;
        this.live = true;
        this.state_ = TargetCore.NoState;
    }
    state() {
        return this.state_;
    }
    notifiesTargeter() {
        const extra = this.extra;
        return extra && extra instanceof Array;
    }
    elements() {
        const extra = this.extra;
        if (extra && extra instanceof Array) {
            extra.forEach(e => e.setNotifiable(this));
            return extra;
        }
        else
            return [];
    }
    updateState(update) {
        this.state_ = update;
        const extra = this.extra;
        const updater = !extra || extra instanceof Array ? null
            : extra.targetStateUpdated;
        if (updater)
            updater(this.state(), this.title());
    }
    newTargeter() {
        return new TargeterCore();
    }
    title() {
        return this.title_;
    }
    isLive() {
        return this.live;
    }
    setLive(live) {
        this.live = live;
    }
}
TargetCore.NoState = 'No state set';
//# sourceMappingURL=TargetCore.js.map

class Indexing$$1 extends TargetCore {
    constructor(title, coupler) {
        super(title, coupler);
        this.setIndex(coupler.passIndex ? coupler.passIndex : 0);
    }
    index() {
        return this.state_;
    }
    setIndex(index) {
        const first = this.state_ === TargetCore.NoState;
        this.state_ = index;
        if (!first) {
            const updated = this.coupler().targetStateUpdated;
            if (updated)
                updated(this.state_, this.title());
        }
    }
    indexables() {
        const indexables = this.coupler().getIndexables(this.title());
        if (!indexables || indexables.length === 0)
            throw new Error('Missing or empty indexables in ' + this);
        else
            return indexables;
    }
    uiSelectables() {
        const getSelectable = this.coupler().newUiSelectable || ((i) => i);
        return this.indexables().map(i => getSelectable(i));
    }
    coupler() {
        return this.extra;
    }
    indexed() {
        if (this.state_ === TargetCore.NoState)
            throw new Error(('No index in ' + this.title()));
        else
            return this.indexables()[this.state_];
    }
    setIndexed(indexable) {
        for (const [at, i] of this.indexables().entries())
            if (i === indexable) {
                this.setIndex(i);
                break;
            }
    }
    updateState(update) {
        this.setIndex(update);
    }
}
//# sourceMappingURL=Indexing.js.map

class Toggling$$1 extends TargetCore {
    constructor(title, coupler) {
        super(title, coupler);
        this.coupler = coupler;
        this.state_ = coupler.passSet;
    }
}
//# sourceMappingURL=Toggling.js.map

class Textual$$1 extends TargetCore {
    constructor(title, coupler) {
        super(title, coupler);
        if (coupler.passText)
            this.state_ = coupler.passText;
    }
    state() {
        return this.state_ !== TargetCore.NoState ? this.state_
            : this.extra.getText(this.title());
    }
}
//# sourceMappingURL=Textual.js.map

class IndexingFrame$$1 extends TargetCore {
    constructor(title, indexing_) {
        super(title);
        this.indexing_ = indexing_;
        this.indexing_.setNotifiable(this);
    }
    indexedTarget() {
        let indexed = this.indexing_.indexed();
        const type = indexed.type;
        return type && type === 'Targety' ? indexed : this.newIndexedTargets(indexed);
    }
    newIndexedTargets(indexed) {
        throw new Error("Not implemented in " + this.title());
    }
    indexing() {
        return this.indexing_;
    }
    newTargeter() {
        return new IndexingFrameTargeter$$1();
    }
    notifiesTargeter() {
        return true;
    }
}
//# sourceMappingURL=IndexingFrame.js.map

//# sourceMappingURL=_globals.js.map

function newInstance(trace) {
    return new Facets();
}
class Facets {
    constructor() {
        this.times = {
            doTime: false,
        };
        this.notifiable = {
            notify: notice => {
                traceThing('> Notified with ' + this.rootTargeter.title());
                this.rootTargeter.retarget(this.rootTargeter.target());
                this.callOnRetargeted();
                this.rootTargeter.retargetFacets();
            },
        };
        this.titleTargeters = new Map();
    }
    buildApp(app) {
        this.onRetargeted = title => {
            app.onRetargeted(title);
        };
        let trees = app.getContentTrees();
        if (trees instanceof Array)
            throw new Error('Not implemented for ' + trees.length);
        else
            this.addContentTree(trees);
        if (!this.rootTargeter)
            this.rootTargeter = this.root.newTargeter();
        this.rootTargeter.setNotifiable(this.notifiable);
        this.rootTargeter.retarget(this.root);
        this.addTitleTargeters(this.rootTargeter);
        this.callOnRetargeted();
        app.buildLayout();
    }
    callOnRetargeted() {
        let title = this.root.title();
        traceThing('> Calling onRetargeted with active=' + title);
        this.onRetargeted(title);
    }
    addContentTree(tree) {
        this.root = tree;
    }
    newTextualTarget(title, coupler) {
        let textual = new Textual$$1(title, coupler);
        traceThing('> Created textual title=' + title);
        return textual;
    }
    newTogglingTarget(title, coupler) {
        let toggling = new Toggling$$1(title, coupler);
        traceThing('> Created toggling title=' + title);
        return toggling;
    }
    newTriggerTarget(title, coupler) {
        let trigger = new TargetCore(title, coupler);
        traceThing('> Created trigger title=' + title);
        return trigger;
    }
    newTargetGroup(title, members) {
        return new TargetCore(title, members);
    }
    addTitleTargeters(t) {
        let title = t.title();
        const elements = t.elements();
        this.titleTargeters.set(title, t);
        traceThing('> Added targeter: title=' + title + ': elements=' + elements.length);
        elements.forEach((e) => this.addTitleTargeters(e));
    }
    attachFacet(title, updater) {
        let t = this.titleTargeters.get(title);
        if (!t)
            throw new Error('Missing targeter for ' + title);
        traceThing('> Attaching facet: title=' + title);
        let facet = {
            retarget(ta) {
                traceThing('> Facet retargeted title=' + ta.title() + ' state=' + ta.state());
                updater(ta.state());
            },
        };
        t.attachFacet(facet);
    }
    updateTargetState(title, update) {
        this.titleTarget(title).updateState(update);
        this.notifiable.notify(title);
    }
    getTargetState(title) {
        return this.titleTarget(title).state();
    }
    isTargetLive(title) {
        return this.titleTarget(title).isLive();
    }
    setTargetLive(title, live) {
        this.titleTarget(title).setLive(live);
    }
    notifyTargetUpdated(title) {
        let target = this.titleTarget(title);
        target.notifyParent();
    }
    titleTarget(title) {
        const got = this.titleTargeters.get(title);
        if (!got)
            throw new Error('No targeter for ' + title);
        return got.target();
    }
    newIndexingTarget(title, coupler) {
        let indexing = new Indexing$$1(title, coupler);
        traceThing('> Created indexing title=' + title, { coupler: !coupler.targetStateUpdated });
        return indexing;
    }
    getIndexingState(title) {
        let i = this.titleTarget(title);
        if (!i)
            throw new Error('No target for title=' + title);
        else
            return {
                uiSelectables: i.uiSelectables(),
                indexed: i.indexed(),
            };
    }
    newIndexingFrame(p) {
        let frameTitle = p.frameTitle ? p.frameTitle
            : 'IndexingFrame' + this.indexingFrames++, indexingTitle = p.indexingTitle ? p.indexingTitle
            : frameTitle + '.Indexing';
        let indexing = new Indexing$$1(indexingTitle, {
            getIndexables: title => p.getIndexables(),
            newUiSelectable: i => p.newUiSelectable(i)
        });
        let frame = new IndexingFrame$$1(frameTitle, indexing);
        traceThing(' > Created indexing frame ', frame);
        return frame;
    }
}
//# sourceMappingURL=Facets.js.map

exports.newInstance = newInstance;
exports.Facets = Facets;

}((this.Facets = this.Facets || {})));
//# sourceMappingURL=Facets_.js.map
