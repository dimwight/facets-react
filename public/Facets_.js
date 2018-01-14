(function (exports) {
'use strict';

class NotifyingCore {
    constructor(type, title_) {
        this.type = type;
        this.title_ = title_;
    }
    title() {
        return this.title_;
    }
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
        if (this.notifiable_)
            this.notifiable_.notify(this.title());
    }
}

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
    const callback = (key, value) => {
        return '|notifiable_|elements_|'.includes(key) ? key : value;
    };
    // Construct body
    const tail = !thing ? '' : JSON.stringify(thing, callback, 1);
    // Issue complete message
    console.log(top, tail);
}

class TargeterCore$$1 extends NotifyingCore {
    constructor() {
        super(TargeterCore$$1.type, 'Untargeted');
        this.facets_ = [];
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
    titleElements() {
        return this.elements();
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
TargeterCore$$1.type = 'Targeter';

class IndexingFrameTargeter$$1 extends TargeterCore$$1 {
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
        this.titleTargeters.forEach(t => t.retargetFacets());
    }
    titleElements() {
        let list = this.elements();
        list.push(this.indexing);
        this.titleTargeters.forEach(t => list.push(t));
        return list;
    }
    updateToTarget() {
        let frame = this.target();
        this.indexingTarget = frame.indexing();
        this.indexedTarget = frame.indexedTarget();
        this.indexedTitle = this.indexedTarget.title();
    }
}

class TargetCore extends NotifyingCore {
    constructor(title, extra) {
        super(TargetCore.type, title);
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
        if (!this.extra)
            this.extra = this.lazyElements();
        if (this.extra instanceof Array) {
            this.extra.forEach(e => e.setNotifiable(this));
            return this.extra;
        }
        else
            return [];
    }
    lazyElements() {
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
        return new TargeterCore$$1();
    }
    isLive() {
        return this.live;
    }
    setLive(live) {
        this.live = live;
    }
}
TargetCore.type = 'Targety';
TargetCore.NoState = 'No state set';

function traceThing$1(top, thing) {
    if (top.charAt(0) === '^')
        return;
    if (!thing)
        console.log(top);
    else
        console.info(top, JSON.stringify(thing, (key, value) => {
            if (key === 'date')
                value = new Date(value).valueOf();
            else
                'facets,__parent,notifiable_'.split(',').forEach(check => {
                    if (key === check)
                        value = key;
                });
            return value;
        }, 1));
}

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
        let selectables = 0;
        const coupler = this.coupler();
        const getSelectable = coupler.newUiSelectable
            || ((i) => this.title() + selectables++);
        return this.indexables().map(i => getSelectable(i));
    }
    coupler() {
        return this.extra;
    }
    indexed() {
        traceThing$1('^indexed', {
            'indexables': this.indexables().length,
            'state_': this.state_
        });
        if (this.state_ === TargetCore.NoState)
            throw new Error('No index in ' + this.title());
        else
            return this.indexables()[this.state_];
    }
    setIndexed(indexable) {
        for (const [at, i] of this.indexables().entries())
            if (i === indexable) {
                this.setIndex(at);
                break;
            }
    }
    updateState(update) {
        this.setIndex(update);
    }
}

class Toggling$$1 extends TargetCore {
    constructor(title, coupler) {
        super(title, coupler);
        this.coupler = coupler;
        this.state_ = coupler.passSet;
    }
}

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

class IndexingFrame$$1 extends TargetCore {
    constructor(title, indexing_) {
        super(title);
        this.indexing_ = indexing_;
        this.indexing_.setNotifiable(this);
    }
    indexedTarget() {
        let indexed = this.indexing_.indexed();
        const type = indexed.type;
        traceThing$1('^indexedTarget', !indexed.type);
        return type && type === TargetCore.type ? indexed : this.newIndexedTargets(indexed);
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

function newInstance(trace) {
    return new Facets(trace);
}
class Facets {
    constructor(doTrace) {
        this.doTrace = doTrace;
        this.times = {
            doTime: false,
        };
        this.activeContentTitle = "[Active Content Tree]";
        this.notifiable = {
            notify: notice => {
                this.trace('Notified with ' + this.rootTargeter.title());
                this.rootTargeter.retarget(this.rootTargeter.target());
                this.callOnRetargeted();
                this.rootTargeter.retargetFacets();
            },
        };
        this.titleTargeters = new Map();
        this.titleTrees = new Map();
        let activeTitle = this.activeContentTitle;
        let indexedTargetTitle = () => this.root.indexedTarget().title();
        const indexing = new Indexing$$1('RootIndexing', {
            getIndexables: () => {
                const trees = [];
                this.titleTrees.forEach(t => trees.push(t));
                return trees;
            }
        });
        this.root = new class extends IndexingFrame$$1 {
            lazyElements() {
                return [
                    new Textual$$1(activeTitle, {
                        getText: () => indexedTargetTitle()
                    })
                ];
            }
        }('RootFrame', indexing);
    }
    trace(msg) {
        if (this.doTrace)
            console.log('> ' + msg);
    }
    buildApp(app) {
        this.onRetargeted = title => {
            app.onRetargeted(title);
        };
        const trees = app.getContentTrees();
        if (trees instanceof Array)
            trees.forEach(t => this.addContentTree(t));
        else
            this.addContentTree(trees);
        this.trace('Building targeter tree for root=' + this.root.title());
        if (!this.rootTargeter)
            this.rootTargeter = this.root.newTargeter();
        this.rootTargeter.setNotifiable(this.notifiable);
        this.rootTargeter.retarget(this.root);
        this.addTitleTargeters(this.rootTargeter);
        this.callOnRetargeted();
        app.buildLayout();
    }
    callOnRetargeted() {
        const title = this.root.title();
        this.trace('Calling onRetargeted with active=' + title);
        this.onRetargeted(title);
    }
    addContentTree(tree) {
        this.titleTrees.set(tree.title(), tree);
        this.root.indexing().setIndexed(tree);
    }
    activateContentTree(title) {
        const tree = this.titleTrees.get(title);
        if (!tree)
            throw new Error('No tree for ' + title);
        this.root.indexing().setIndexed(tree);
        this.notifiable.notify(title);
    }
    newTextualTarget(title, coupler) {
        const textual = new Textual$$1(title, coupler);
        this.trace('Created textual title=' + title);
        return textual;
    }
    newTogglingTarget(title, coupler) {
        const toggling = new Toggling$$1(title, coupler);
        this.trace('Created toggling title=' + title);
        return toggling;
    }
    newTriggerTarget(title, coupler) {
        const trigger = new TargetCore(title, coupler);
        this.trace('Created trigger title=' + title);
        return trigger;
    }
    newTargetGroup(title, members) {
        return new TargetCore(title, members);
    }
    addTitleTargeters(t) {
        const title = t.title();
        const elements = t.titleElements();
        this.titleTargeters.set(title, t);
        this.trace('Added targeter: title=' + title + ': elements=' + elements.length);
        elements.forEach((e) => this.addTitleTargeters(e));
    }
    attachFacet(title, updater) {
        const t = this.titleTargeters.get(title);
        if (!t)
            throw new Error('No targeter for ' + title);
        this.trace('Attaching facet: title=' + title);
        const facet = {
            retarget: (ta) => {
                this.trace('Facet retargeted title=' + ta.title() + ' state=' + ta.state());
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
        const target = this.titleTarget(title);
        target.notifyParent();
    }
    titleTarget(title) {
        const got = this.titleTargeters.get(title);
        if (!got)
            throw new Error('No targeter for ' + title);
        return got.target();
    }
    newIndexingTarget(title, coupler) {
        const indexing = new Indexing$$1(title, coupler);
        this.trace('Created indexing title=' + title);
        return indexing;
    }
    getIndexingState(title) {
        const i = this.titleTarget(title);
        if (!i)
            throw new Error('No target for title=' + title);
        else
            return {
                uiSelectables: i.uiSelectables(),
                indexed: i.indexed(),
            };
    }
    newIndexingFrame(p) {
        const frameTitle = p.frameTitle ? p.frameTitle
            : 'IndexingFrame' + this.indexingFrames++, indexingTitle = p.indexingTitle ? p.indexingTitle
            : frameTitle + '.Indexing';
        const indexing = new Indexing$$1(indexingTitle, {
            getIndexables: title => p.getIndexables(),
            newUiSelectable: !p.newUiSelectable ? null : i => p.newUiSelectable(i)
        });
        this.trace('Created indexing ' + indexingTitle);
        const frame = new class extends IndexingFrame$$1 {
            lazyElements() {
                return p.newFrameTargets();
            }
            newIndexedTargets(indexed) {
                const titler = p.newIndexedTreeTitle, title = titler ? titler(indexed) : this.title() + '|indexed';
                const newTree = p.newIndexedTree;
                return newTree ? newTree(indexed, title)
                    : new TargetCore(title);
            }
        }(frameTitle, indexing);
        this.trace('Created indexing frame ' + frameTitle);
        return frame;
    }
}

exports.newInstance = newInstance;
exports.Facets = Facets;

}((this.Facets = this.Facets || {})));
//# sourceMappingURL=Facets_.js.map
