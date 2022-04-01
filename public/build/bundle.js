
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/NavBar.svelte generated by Svelte v3.46.2 */

    const file$9 = "src/NavBar.svelte";

    function create_fragment$d(ctx) {
    	let header;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let t1;
    	let button;
    	let img1;
    	let img1_src_value;
    	let t2;
    	let ul;
    	let li0;
    	let a1;
    	let t4;
    	let li1;
    	let a2;
    	let t6;
    	let li2;
    	let a3;
    	let t8;
    	let li3;
    	let a4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = text("\n        WAITR");
    			t1 = space();
    			button = element("button");
    			img1 = element("img");
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Who are we ?";
    			t4 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Our solution";
    			t6 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "What others have said";
    			t8 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Contact Us";
    			attr_dev(img0, "class", "logo svelte-1ce50lx");
    			if (!src_url_equal(img0.src, img0_src_value = "img/WAITR_logo_noText.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "logo");
    			add_location(img0, file$9, 15, 8, 269);
    			attr_dev(a0, "class", "title svelte-1ce50lx");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$9, 14, 4, 234);
    			if (!src_url_equal(img1.src, img1_src_value = "svg/iconMenu.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "icon_menu");
    			add_location(img1, file$9, 18, 55, 411);
    			attr_dev(button, "class", "icon-toggle svelte-1ce50lx");
    			add_location(button, file$9, 18, 4, 360);
    			attr_dev(a1, "href", "#whoAreUs");
    			attr_dev(a1, "class", "svelte-1ce50lx");
    			add_location(a1, file$9, 20, 12, 535);
    			attr_dev(li0, "class", "svelte-1ce50lx");
    			add_location(li0, file$9, 20, 8, 531);
    			attr_dev(a2, "href", "#solution");
    			attr_dev(a2, "class", "svelte-1ce50lx");
    			add_location(a2, file$9, 21, 12, 589);
    			attr_dev(li1, "class", "svelte-1ce50lx");
    			add_location(li1, file$9, 21, 8, 585);
    			attr_dev(a3, "href", "#team");
    			attr_dev(a3, "class", "svelte-1ce50lx");
    			add_location(a3, file$9, 22, 12, 643);
    			attr_dev(li2, "class", "svelte-1ce50lx");
    			add_location(li2, file$9, 22, 8, 639);
    			attr_dev(a4, "href", "#contact");
    			attr_dev(a4, "class", "svelte-1ce50lx");
    			add_location(a4, file$9, 23, 12, 702);
    			attr_dev(li3, "class", "svelte-1ce50lx");
    			add_location(li3, file$9, 23, 8, 698);
    			attr_dev(ul, "data-visible", /*bool*/ ctx[0]);
    			attr_dev(ul, "class", "nav-right flex ligne svelte-1ce50lx");
    			add_location(ul, file$9, 19, 4, 469);
    			attr_dev(header, "class", "nav flex shadow svelte-1ce50lx");
    			add_location(header, file$9, 13, 0, 197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, a0);
    			append_dev(a0, img0);
    			append_dev(a0, t0);
    			append_dev(header, t1);
    			append_dev(header, button);
    			append_dev(button, img1);
    			append_dev(header, t2);
    			append_dev(header, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(ul, t6);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(ul, t8);
    			append_dev(ul, li3);
    			append_dev(li3, a4);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggle_menu*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*bool*/ 1) {
    				attr_dev(ul, "data-visible", /*bool*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavBar', slots, []);
    	let bool = false;

    	function toggle_menu() {
    		if (bool === false) {
    			$$invalidate(0, bool = true);
    		} else {
    			$$invalidate(0, bool = false);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ bool, toggle_menu });

    	$$self.$inject_state = $$props => {
    		if ('bool' in $$props) $$invalidate(0, bool = $$props.bool);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [bool, toggle_menu];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/WhoAreWe.svelte generated by Svelte v3.46.2 */

    const file$8 = "src/WhoAreWe.svelte";

    function create_fragment$c(ctx) {
    	let div2;
    	let div0;
    	let h10;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let div1;
    	let h11;
    	let t7;
    	let p2;
    	let t9;
    	let p3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Who are we ?";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "WAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITR\n            WAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITR\n            WAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITR\n            WAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITR";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "WAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITR";
    			t5 = space();
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Why should you trust us ?";
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "WAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITR";
    			t9 = space();
    			p3 = element("p");
    			p3.textContent = "WAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITRWAITR";
    			attr_dev(h10, "class", "svelte-111jsnk");
    			add_location(h10, file$8, 5, 8, 67);
    			attr_dev(p0, "class", "svelte-111jsnk");
    			add_location(p0, file$8, 6, 8, 97);
    			attr_dev(p1, "class", "svelte-111jsnk");
    			add_location(p1, file$8, 12, 8, 334);
    			add_location(div0, file$8, 4, 4, 53);
    			attr_dev(h11, "class", "svelte-111jsnk");
    			add_location(h11, file$8, 17, 8, 445);
    			attr_dev(p2, "class", "svelte-111jsnk");
    			add_location(p2, file$8, 18, 8, 488);
    			attr_dev(p3, "class", "svelte-111jsnk");
    			add_location(p3, file$8, 21, 8, 571);
    			add_location(div1, file$8, 16, 4, 431);
    			attr_dev(div2, "class", "container flex svelte-111jsnk");
    			add_location(div2, file$8, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h10);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, h11);
    			append_dev(div1, t7);
    			append_dev(div1, p2);
    			append_dev(div1, t9);
    			append_dev(div1, p3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WhoAreWe', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WhoAreWe> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class WhoAreWe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WhoAreWe",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/Resume.svelte generated by Svelte v3.46.2 */

    const file$7 = "src/Resume.svelte";

    function create_fragment$b(ctx) {
    	let div9;
    	let div2;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let t2;
    	let div1;
    	let t4;
    	let div5;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let div3;
    	let t7;
    	let div4;
    	let t9;
    	let div8;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let div6;
    	let t12;
    	let div7;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div2 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Stop";
    			t2 = space();
    			div1 = element("div");
    			div1.textContent = "waiting";
    			t4 = space();
    			div5 = element("div");
    			img1 = element("img");
    			t5 = space();
    			div3 = element("div");
    			div3.textContent = "Start";
    			t7 = space();
    			div4 = element("div");
    			div4.textContent = "earning";
    			t9 = space();
    			div8 = element("div");
    			img2 = element("img");
    			t10 = space();
    			div6 = element("div");
    			div6.textContent = "Easy to";
    			t12 = space();
    			div7 = element("div");
    			div7.textContent = "uses";
    			attr_dev(img0, "class", "icon svelte-1g86ltu");
    			if (!src_url_equal(img0.src, img0_src_value = "icon/wait.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "icon team");
    			add_location(img0, file$7, 5, 8, 74);
    			attr_dev(div0, "class", "mt-3 title svelte-1g86ltu");
    			add_location(div0, file$7, 6, 8, 137);
    			attr_dev(div1, "class", "title svelte-1g86ltu");
    			add_location(div1, file$7, 7, 8, 180);
    			attr_dev(div2, "class", "col svelte-1g86ltu");
    			add_location(div2, file$7, 4, 4, 48);
    			attr_dev(img1, "class", "icon svelte-1g86ltu");
    			if (!src_url_equal(img1.src, img1_src_value = "icon/salary.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "icon map");
    			add_location(img1, file$7, 10, 8, 242);
    			attr_dev(div3, "class", "mt-3 title svelte-1g86ltu");
    			add_location(div3, file$7, 11, 8, 306);
    			attr_dev(div4, "class", "title svelte-1g86ltu");
    			add_location(div4, file$7, 12, 8, 350);
    			add_location(div5, file$7, 9, 4, 228);
    			attr_dev(img2, "class", "icon svelte-1g86ltu");
    			if (!src_url_equal(img2.src, img2_src_value = "icon/snap.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "icon target");
    			add_location(img2, file$7, 15, 8, 412);
    			attr_dev(div6, "class", "mt-3 title svelte-1g86ltu");
    			add_location(div6, file$7, 16, 8, 477);
    			attr_dev(div7, "class", "title svelte-1g86ltu");
    			add_location(div7, file$7, 17, 8, 524);
    			add_location(div8, file$7, 14, 4, 398);
    			attr_dev(div9, "class", "container svelte-1g86ltu");
    			add_location(div9, file$7, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div2);
    			append_dev(div2, img0);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div9, t4);
    			append_dev(div9, div5);
    			append_dev(div5, img1);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div9, t9);
    			append_dev(div9, div8);
    			append_dev(div8, img2);
    			append_dev(div8, t10);
    			append_dev(div8, div6);
    			append_dev(div8, t12);
    			append_dev(div8, div7);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Resume', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Resume> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Resume extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Resume",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/Solution.svelte generated by Svelte v3.46.2 */

    const file$6 = "src/Solution.svelte";

    function create_fragment$a(ctx) {
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div2;
    	let div1;
    	let h1;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Our solution";
    			t2 = space();
    			p = element("p");
    			p.textContent = "WAITR, is a company that offers to transform waiting lines into the a gig economy.\n\t\t\t\tAn app that helps you not have to wait in lines anymore. We hire independent contractors as waiters to wait in line for you.\n\t\t\t\tOr you can make money by becoming an independent contractor and work whenever you feel like it.\n\t\t\t\tThis solution is for anyone that does not want to wait in line anymore.";
    			attr_dev(img, "class", "planet svelte-1x67tse");
    			if (!src_url_equal(img.src, img_src_value = "img/icon_solution.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "planet_image");
    			add_location(img, file$6, 5, 2, 71);
    			attr_dev(div0, "class", "flex svelte-1x67tse");
    			add_location(div0, file$6, 4, 1, 50);
    			attr_dev(h1, "class", "svelte-1x67tse");
    			add_location(h1, file$6, 9, 3, 181);
    			attr_dev(p, "class", "svelte-1x67tse");
    			add_location(p, file$6, 10, 3, 206);
    			add_location(div1, file$6, 8, 2, 172);
    			attr_dev(div2, "class", "article svelte-1x67tse");
    			add_location(div2, file$6, 7, 1, 148);
    			attr_dev(div3, "class", "container flex svelte-1x67tse");
    			add_location(div3, file$6, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Solution', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Solution> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Solution extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Solution",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/Profile.svelte generated by Svelte v3.46.2 */

    const file$5 = "src/Profile.svelte";

    function create_fragment$9(ctx) {
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h1;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let div0;
    	let a0;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let a1;
    	let img2;
    	let img2_src_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			h1 = element("h1");
    			t1 = text(/*name*/ ctx[1]);
    			t2 = space();
    			p = element("p");
    			t3 = text(/*skills*/ ctx[2]);
    			t4 = space();
    			div0 = element("div");
    			a0 = element("a");
    			img1 = element("img");
    			t5 = space();
    			a1 = element("a");
    			img2 = element("img");
    			attr_dev(img0, "class", "picture svelte-1gqw02w");
    			if (!src_url_equal(img0.src, img0_src_value = /*img*/ ctx[0])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", /*name*/ ctx[1]);
    			add_location(img0, file$5, 9, 4, 169);
    			attr_dev(h1, "class", "title svelte-1gqw02w");
    			add_location(h1, file$5, 10, 4, 218);
    			attr_dev(p, "class", "svelte-1gqw02w");
    			add_location(p, file$5, 11, 4, 252);
    			attr_dev(img1, "class", "icon-fit svelte-1gqw02w");
    			if (!src_url_equal(img1.src, img1_src_value = "icon/linkedin.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "icon_linkedin");
    			add_location(img1, file$5, 14, 12, 347);
    			attr_dev(a0, "href", /*linkedin*/ ctx[3]);
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$5, 13, 8, 299);
    			attr_dev(img2, "class", "icon-fit svelte-1gqw02w");
    			if (!src_url_equal(img2.src, img2_src_value = "icon/email.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "icon_email");
    			add_location(img2, file$5, 17, 12, 464);
    			attr_dev(a1, "href", /*email*/ ctx[4]);
    			add_location(a1, file$5, 16, 8, 435);
    			attr_dev(div0, "class", "flex svelte-1gqw02w");
    			add_location(div0, file$5, 12, 4, 272);
    			attr_dev(div1, "class", "container svelte-1gqw02w");
    			add_location(div1, file$5, 8, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, h1);
    			append_dev(h1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img1);
    			append_dev(div0, t5);
    			append_dev(div0, a1);
    			append_dev(a1, img2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*img*/ 1 && !src_url_equal(img0.src, img0_src_value = /*img*/ ctx[0])) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*name*/ 2) {
    				attr_dev(img0, "alt", /*name*/ ctx[1]);
    			}

    			if (dirty & /*name*/ 2) set_data_dev(t1, /*name*/ ctx[1]);
    			if (dirty & /*skills*/ 4) set_data_dev(t3, /*skills*/ ctx[2]);

    			if (dirty & /*linkedin*/ 8) {
    				attr_dev(a0, "href", /*linkedin*/ ctx[3]);
    			}

    			if (dirty & /*email*/ 16) {
    				attr_dev(a1, "href", /*email*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	let { img } = $$props;
    	let { name } = $$props;
    	let { skills } = $$props;
    	let { linkedin } = $$props;
    	let { email } = $$props;
    	const writable_props = ['img', 'name', 'skills', 'linkedin', 'email'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('img' in $$props) $$invalidate(0, img = $$props.img);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('skills' in $$props) $$invalidate(2, skills = $$props.skills);
    		if ('linkedin' in $$props) $$invalidate(3, linkedin = $$props.linkedin);
    		if ('email' in $$props) $$invalidate(4, email = $$props.email);
    	};

    	$$self.$capture_state = () => ({ img, name, skills, linkedin, email });

    	$$self.$inject_state = $$props => {
    		if ('img' in $$props) $$invalidate(0, img = $$props.img);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('skills' in $$props) $$invalidate(2, skills = $$props.skills);
    		if ('linkedin' in $$props) $$invalidate(3, linkedin = $$props.linkedin);
    		if ('email' in $$props) $$invalidate(4, email = $$props.email);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [img, name, skills, linkedin, email];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			img: 0,
    			name: 1,
    			skills: 2,
    			linkedin: 3,
    			email: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*img*/ ctx[0] === undefined && !('img' in props)) {
    			console.warn("<Profile> was created without expected prop 'img'");
    		}

    		if (/*name*/ ctx[1] === undefined && !('name' in props)) {
    			console.warn("<Profile> was created without expected prop 'name'");
    		}

    		if (/*skills*/ ctx[2] === undefined && !('skills' in props)) {
    			console.warn("<Profile> was created without expected prop 'skills'");
    		}

    		if (/*linkedin*/ ctx[3] === undefined && !('linkedin' in props)) {
    			console.warn("<Profile> was created without expected prop 'linkedin'");
    		}

    		if (/*email*/ ctx[4] === undefined && !('email' in props)) {
    			console.warn("<Profile> was created without expected prop 'email'");
    		}
    	}

    	get img() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skills() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skills(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linkedin() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkedin(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Team.svelte generated by Svelte v3.46.2 */
    const file$4 = "src/Team.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let profile;
    	let current;

    	profile = new Profile({
    			props: {
    				img: "img/pol.jpeg",
    				name: "Pol Bachelin",
    				skills: "Développeur",
    				linkedin: "https://www.linkedin.com/in/polbachelin/",
    				email: "mailto:pol.bachelin@epitech.eu"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "What others have said";
    			t1 = space();
    			div0 = element("div");
    			create_component(profile.$$.fragment);
    			attr_dev(h1, "class", "title svelte-142hd0d");
    			add_location(h1, file$4, 5, 4, 100);
    			attr_dev(div0, "class", "grid svelte-142hd0d");
    			add_location(div0, file$4, 6, 4, 149);
    			attr_dev(div1, "class", "primary-container svelte-142hd0d");
    			add_location(div1, file$4, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(profile, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(profile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(profile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(profile);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Team', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Team> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Profile });
    	return [];
    }

    class Team extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Team",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.46.2 */

    const file$3 = "src/Footer.svelte";

    function create_fragment$7(ctx) {
    	let footer;
    	let div4;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let div1;
    	let a0;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let a1;
    	let img2;
    	let img2_src_value;
    	let t4;
    	let a2;
    	let img3;
    	let img3_src_value;
    	let t5;
    	let div2;
    	let h3;
    	let t7;
    	let div3;
    	let a3;
    	let t9;
    	let a4;
    	let t11;
    	let a5;
    	let t13;
    	let a6;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div4 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Contact us !";
    			t2 = space();
    			div1 = element("div");
    			a0 = element("a");
    			img1 = element("img");
    			t3 = space();
    			a1 = element("a");
    			img2 = element("img");
    			t4 = space();
    			a2 = element("a");
    			img3 = element("img");
    			t5 = space();
    			div2 = element("div");
    			h3 = element("h3");
    			h3.textContent = "waitr@protonmail.com";
    			t7 = space();
    			div3 = element("div");
    			a3 = element("a");
    			a3.textContent = "Conditions générales de vente";
    			t9 = text(" - \n            ");
    			a4 = element("a");
    			a4.textContent = "Politique de confidentialité";
    			t11 = text("\n            -\n            ");
    			a5 = element("a");
    			a5.textContent = "Mentions Légales";
    			t13 = text("\n            -\n            ");
    			a6 = element("a");
    			a6.textContent = "Attestation conformité RGPD";
    			attr_dev(img0, "class", "logo svelte-17kmcn7");
    			if (!src_url_equal(img0.src, img0_src_value = "img/WAITR_logo.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "logo_NuageMalin");
    			add_location(img0, file$3, 6, 12, 138);
    			attr_dev(h1, "class", "svelte-17kmcn7");
    			add_location(h1, file$3, 7, 12, 216);
    			attr_dev(div0, "class", "center-items svelte-17kmcn7");
    			set_style(div0, "padding-block", "1rem");
    			add_location(div0, file$3, 5, 8, 70);
    			attr_dev(img1, "class", "icon svelte-17kmcn7");
    			if (!src_url_equal(img1.src, img1_src_value = "icon/instagram.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "contact_instagram_NuageMalin");
    			add_location(img1, file$3, 11, 16, 360);
    			attr_dev(a0, "href", "https://www.instagram.com/nuagemalin/");
    			add_location(a0, file$3, 10, 12, 295);
    			attr_dev(img2, "class", "icon svelte-17kmcn7");
    			if (!src_url_equal(img2.src, img2_src_value = "icon/linkedinBlue.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "contact_linkedin_NuageMalin");
    			add_location(img2, file$3, 14, 16, 540);
    			attr_dev(a1, "href", "https://www.linkedin.com/company/nuage-malin");
    			add_location(a1, file$3, 13, 12, 468);
    			attr_dev(img3, "class", "icon svelte-17kmcn7");
    			if (!src_url_equal(img3.src, img3_src_value = "icon/twitter.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "contact_twitter_NuageMalin");
    			add_location(img3, file$3, 17, 16, 711);
    			attr_dev(a2, "href", "https://twitter.com/NuageMalin_fr");
    			add_location(a2, file$3, 16, 12, 650);
    			attr_dev(div1, "class", "reseaux svelte-17kmcn7");
    			add_location(div1, file$3, 9, 8, 261);
    			attr_dev(h3, "class", "svelte-17kmcn7");
    			add_location(h3, file$3, 21, 12, 865);
    			attr_dev(div2, "class", "center-items svelte-17kmcn7");
    			add_location(div2, file$3, 20, 8, 826);
    			attr_dev(a3, "href", "/404");
    			attr_dev(a3, "class", "svelte-17kmcn7");
    			add_location(a3, file$3, 24, 12, 949);
    			attr_dev(a4, "href", "/404");
    			attr_dev(a4, "class", "svelte-17kmcn7");
    			add_location(a4, file$3, 25, 12, 1013);
    			attr_dev(a5, "href", "/404");
    			attr_dev(a5, "class", "svelte-17kmcn7");
    			add_location(a5, file$3, 27, 12, 1087);
    			attr_dev(a6, "href", "/404");
    			attr_dev(a6, "class", "svelte-17kmcn7");
    			add_location(a6, file$3, 29, 12, 1149);
    			attr_dev(div3, "class", "lien svelte-17kmcn7");
    			add_location(div3, file$3, 23, 8, 918);
    			attr_dev(div4, "class", "container flex svelte-17kmcn7");
    			add_location(div4, file$3, 4, 4, 33);
    			attr_dev(footer, "class", "svelte-17kmcn7");
    			add_location(footer, file$3, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div4);
    			append_dev(div4, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, h1);
    			append_dev(div4, t2);
    			append_dev(div4, div1);
    			append_dev(div1, a0);
    			append_dev(a0, img1);
    			append_dev(div1, t3);
    			append_dev(div1, a1);
    			append_dev(a1, img2);
    			append_dev(div1, t4);
    			append_dev(div1, a2);
    			append_dev(a2, img3);
    			append_dev(div4, t5);
    			append_dev(div4, div2);
    			append_dev(div2, h3);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, a3);
    			append_dev(div3, t9);
    			append_dev(div3, a4);
    			append_dev(div3, t11);
    			append_dev(div3, a5);
    			append_dev(div3, t13);
    			append_dev(div3, a6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/MainFrame.svelte generated by Svelte v3.46.2 */

    function create_fragment$6(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainFrame', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainFrame> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MainFrame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainFrame",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/404not404.svelte generated by Svelte v3.46.2 */

    function create_fragment$5(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('_404not404', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<_404not404> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class _404not404 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_404not404",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.46.2 */

    function create_fragment$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.46.2 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function quadInOut(t) {
        t /= 0.5;
        if (t < 1)
            return 0.5 * t * t;
        t--;
        return -0.5 * (t * (t - 2) - 1);
    }

    function writableSet(value = new Set()) {
      const store = writable(value);

      const wrap = (method) => {
        return (...args) => {
          let output;
          store.update((value) => {
            output = value[method](...args);
            return value;
          });
          return output;
        };
      };
      return {
        ...store,
        add: wrap("add"),
        delete: wrap("delete"),
      };
    }

    const contextKey = {};

    // temporary fork of https://github.com/langbamit/svelte-scrollto
    let supportsPassive = false;
    try {
      let opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
        },
      });
      window.addEventListener('test', null, opts);
    } catch (e) {}

    var _ = {
      $(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector;
      },
      extend(...args) {
        return Object.assign(...args);
      },
      addListeners(element, events, handler, opts = { passive: false }) {
        if (!(events instanceof Array)) {
         events = [events];
       }
       for (let i = 0; i < events.length; i++) {
         element.addEventListener(
           events[i],
           handler,
           supportsPassive ? opts : false
         );
       }
     },
     removeListeners(element, events, handler) {
       if (!(events instanceof Array)) {
         events = [events];
       }
       for (let i = 0; i < events.length; i++) {
         element.removeEventListener(events[i], handler);
       }
     },
      cumulativeOffset(element) {
        let top = 0;
        let left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        return {
          top: top,
          left: left
        };
      },
      directScroll(element) {
        return element && element !== document && element !== document.body;
      },
      scrollTop(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollTop = value) : element.scrollTop;
        } else {
          return inSetter
            ? (document.documentElement.scrollTop = document.body.scrollTop = value)
            : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
        }
      },
      scrollLeft(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollLeft = value) : element.scrollLeft;
        } else {
          return inSetter
            ? (document.documentElement.scrollLeft = document.body.scrollLeft = value)
            : window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0;
        }
      }
    };

    // temporary fork of https://github.com/langbamit/svelte-scrollto

    const defaultOptions = {
      container: "body",
      duration: 500,
      delay: 0,
      offset: 0,
      easing: cubicInOut,
      onStart: noop,
      onDone: noop,
      onAborting: noop,
      scrollX: false,
      scrollY: true
    };

    const abortEvents = [
      'mousedown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'keydown',
      'touchmove',
    ];

    const _scrollTo = options => {
      let {
        offset,
        duration,
        delay,
        easing,
        x=0,
        y=0,
        scrollX,
        scrollY,
        onStart,
        onDone,
        container,
        onAborting,
        element
      } = options;

      if (typeof offset === "function") {
        offset = offset();
      }

      var cumulativeOffsetContainer = _.cumulativeOffset(container);
      var cumulativeOffsetTarget = element
        ? _.cumulativeOffset(element)
        : { top: y, left: x };

      var initialX = _.scrollLeft(container);
      var initialY = _.scrollTop(container);

      var targetX =
        cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
      var targetY =
        cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

      var diffX = targetX - initialX;
    	var diffY = targetY - initialY;

      let scrolling = true;
      let started = false;
      let start_time = now() + delay;
      let end_time = start_time + duration;

      function scrollToTopLeft(element, top, left) {
        if (scrollX) _.scrollLeft(element, left);
        if (scrollY) _.scrollTop(element, top);
      }

      function start(delayStart) {
        if (!delayStart) {
          started = true;
          onStart(element, {x, y});
        }
        _.addListeners(container, abortEvents, stop, { passive: true });
      }

      function tick(progress) {
        scrollToTopLeft(
          container,
          initialY + diffY * progress,
          initialX + diffX * progress
        );
      }

      function stop() {
        scrolling = false;
        _.removeListeners(container, abortEvents, stop);
      }

      loop(now => {
        if (!started && now >= start_time) {
          start(false);
        }

        if (started && now >= end_time) {
          tick(1);
          stop();
          onDone(element, {x, y});
          return false;
        }

        if (!scrolling) {
          onAborting(element, {x, y});
          return false;
        }
        if (started) {
          const p = now - start_time;
          const t = 0 + 1 * easing(p / duration);
          tick(t);
        }

        return true;
      });

      start(delay);

      tick(0);

      return stop;
    };

    const proceedOptions = options => {
    	let opts = _.extend({}, defaultOptions, options);
      opts.container = _.$(opts.container);
      opts.element = _.$(opts.element);
      return opts;
    };

    const scrollTo = options => {
      return _scrollTo(proceedOptions(options));
    };

    // focus - focusOptions - preventScroll polyfill
    (function() {
      if (
        typeof window === "undefined" ||
        typeof document === "undefined" ||
        typeof HTMLElement === "undefined"
      ) {
        return;
      }

      var supportsPreventScrollOption = false;
      try {
        var focusElem = document.createElement("div");
        focusElem.addEventListener(
          "focus",
          function(event) {
            event.preventDefault();
            event.stopPropagation();
          },
          true
        );
        focusElem.focus(
          Object.defineProperty({}, "preventScroll", {
            get: function() {
              // Edge v18 gives a false positive for supporting inputs
              if (
                navigator &&
                typeof navigator.userAgent !== 'undefined' &&
                navigator.userAgent &&
                navigator.userAgent.match(/Edge\/1[7-8]/)) {
                  return supportsPreventScrollOption = false
              }

              supportsPreventScrollOption = true;
            }
          })
        );
      } catch (e) {}

      if (
        HTMLElement.prototype.nativeFocus === undefined &&
        !supportsPreventScrollOption
      ) {
        HTMLElement.prototype.nativeFocus = HTMLElement.prototype.focus;

        var calcScrollableElements = function(element) {
          var parent = element.parentNode;
          var scrollableElements = [];
          var rootScrollingElement =
            document.scrollingElement || document.documentElement;

          while (parent && parent !== rootScrollingElement) {
            if (
              parent.offsetHeight < parent.scrollHeight ||
              parent.offsetWidth < parent.scrollWidth
            ) {
              scrollableElements.push([
                parent,
                parent.scrollTop,
                parent.scrollLeft
              ]);
            }
            parent = parent.parentNode;
          }
          parent = rootScrollingElement;
          scrollableElements.push([parent, parent.scrollTop, parent.scrollLeft]);

          return scrollableElements;
        };

        var restoreScrollPosition = function(scrollableElements) {
          for (var i = 0; i < scrollableElements.length; i++) {
            scrollableElements[i][0].scrollTop = scrollableElements[i][1];
            scrollableElements[i][0].scrollLeft = scrollableElements[i][2];
          }
          scrollableElements = [];
        };

        var patchedFocus = function(args) {
          if (args && args.preventScroll) {
            var evScrollableElements = calcScrollableElements(this);
            if (typeof setTimeout === 'function') {
              var thisElem = this;
              setTimeout(function () {
                thisElem.nativeFocus();
                restoreScrollPosition(evScrollableElements);
              }, 0);
            } else {
              this.nativeFocus();
              restoreScrollPosition(evScrollableElements);
            }
          }
          else {
            this.nativeFocus();
          }
        };

        HTMLElement.prototype.focus = patchedFocus;
      }
    })();

    /* node_modules/svelte-parallax/src/Parallax.svelte generated by Svelte v3.46.2 */

    const { scrollTo: scrollTo_1, setTimeout: setTimeout_1, window: window_1 } = globals;
    const file$2 = "node_modules/svelte-parallax/src/Parallax.svelte";

    function create_fragment$2(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[21]);
    	add_render_callback(/*onwindowresize*/ ctx[22]);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "parallax-container svelte-93oqew");
    			attr_dev(div, "style", /*style*/ ctx[0]);
    			add_location(div, file$2, 108, 0, 3301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[23](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "resize", /*resize_handler*/ ctx[20], false, false, false),
    					listen_dev(window_1, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout_1(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[21]();
    					}),
    					listen_dev(window_1, "resize", /*onwindowresize*/ ctx[22])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$y*/ 8 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo_1(window_1.pageXOffset, /*$y*/ ctx[3]);
    				scrolling_timeout = setTimeout_1(clear_scrolling, 100);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*style*/ 1) {
    				attr_dev(div, "style", /*style*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[23](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $top;
    	let $scrollTop;
    	let $layers;
    	let $y;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Parallax', slots, ['default']);
    	let container;

    	// bind:innerHeight
    	let innerHeight;

    	let { sections = 1 } = $$props;
    	let { config = { stiffness: 0.017, damping: 0.26 } } = $$props;
    	let { threshold = { top: 1, bottom: 1 } } = $$props;
    	let { disabled = false } = $$props;
    	let { style = "" } = $$props;
    	let { onEnter = undefined } = $$props;
    	let { onExit = undefined } = $$props;

    	// bind:scrollY
    	const y = writable(0);

    	validate_store(y, 'y');
    	component_subscribe($$self, y, value => $$invalidate(3, $y = value));

    	// top coord of Parallax container
    	const top = writable(0);

    	validate_store(top, 'top');
    	component_subscribe($$self, top, value => $$invalidate(24, $top = value));

    	// this is only here until legacy onEnter/onExit API is removed
    	const legacyEnter = onEnter ? 0 : 1;

    	const legacyExit = onExit ? 0 : 1;
    	const enter = onEnter === undefined ? threshold.top : legacyEnter;
    	const exit = onExit === undefined ? threshold.bottom : legacyExit;

    	// fake intersection observer
    	const scrollTop = derived([y, top], ([$y, $top], set) => {
    		const dy = $y - $top;
    		const min = 0 - innerHeight + innerHeight * enter;
    		const max = innerHeight * sections - innerHeight * exit;

    		// sorry
    		const step = dy < min ? min : dy > max ? max : dy;

    		set(step);
    	});

    	validate_store(scrollTop, 'scrollTop');
    	component_subscribe($$self, scrollTop, value => $$invalidate(16, $scrollTop = value));

    	// eventually filled with ParallaxLayer objects
    	const layers = writableSet(new Set());

    	validate_store(layers, 'layers');
    	component_subscribe($$self, layers, value => $$invalidate(17, $layers = value));

    	setContext(contextKey, {
    		config,
    		addLayer: layer => {
    			layers.add(layer);
    		},
    		removeLayer: layer => {
    			layers.delete(layer);
    		}
    	});

    	onMount(() => {
    		setDimensions();
    	});

    	function setDimensions() {
    		// set height here for edge case with more than one Parallax on page
    		$$invalidate(2, container.style.height = `${innerHeight * sections}px`, container);

    		set_store_value(top, $top = container.getBoundingClientRect().top + window.pageYOffset, $top);
    	}

    	function scrollTo$1(section, { selector = '', duration = 500, easing = quadInOut } = {}) {
    		const scrollTarget = $top + innerHeight * (section - 1);

    		const focusTarget = () => {
    			document.querySelector(selector).focus({ preventScroll: true });
    		};

    		// don't animate scroll if disabled
    		if (disabled) {
    			window.scrollTo({ top: scrollTarget });
    			selector && focusTarget();
    			return;
    		}

    		scrollTo({
    			y: scrollTarget,
    			duration,
    			easing,
    			onDone: selector
    			? focusTarget
    			: () => {
    					
    				}
    		});
    	}

    	const writable_props = ['sections', 'config', 'threshold', 'disabled', 'style', 'onEnter', 'onExit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Parallax> was created with unknown prop '${key}'`);
    	});

    	const resize_handler = () => setTimeout(setDimensions, 0);

    	function onwindowscroll() {
    		y.set($y = window_1.pageYOffset);
    	}

    	function onwindowresize() {
    		$$invalidate(1, innerHeight = window_1.innerHeight);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(2, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('sections' in $$props) $$invalidate(9, sections = $$props.sections);
    		if ('config' in $$props) $$invalidate(10, config = $$props.config);
    		if ('threshold' in $$props) $$invalidate(11, threshold = $$props.threshold);
    		if ('disabled' in $$props) $$invalidate(12, disabled = $$props.disabled);
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('onEnter' in $$props) $$invalidate(13, onEnter = $$props.onEnter);
    		if ('onExit' in $$props) $$invalidate(14, onExit = $$props.onExit);
    		if ('$$scope' in $$props) $$invalidate(18, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		writable,
    		derived,
    		quadInOut,
    		writableSet,
    		contextKey,
    		svelteScrollTo: scrollTo,
    		container,
    		innerHeight,
    		sections,
    		config,
    		threshold,
    		disabled,
    		style,
    		onEnter,
    		onExit,
    		y,
    		top,
    		legacyEnter,
    		legacyExit,
    		enter,
    		exit,
    		scrollTop,
    		layers,
    		setDimensions,
    		scrollTo: scrollTo$1,
    		$top,
    		$scrollTop,
    		$layers,
    		$y
    	});

    	$$self.$inject_state = $$props => {
    		if ('container' in $$props) $$invalidate(2, container = $$props.container);
    		if ('innerHeight' in $$props) $$invalidate(1, innerHeight = $$props.innerHeight);
    		if ('sections' in $$props) $$invalidate(9, sections = $$props.sections);
    		if ('config' in $$props) $$invalidate(10, config = $$props.config);
    		if ('threshold' in $$props) $$invalidate(11, threshold = $$props.threshold);
    		if ('disabled' in $$props) $$invalidate(12, disabled = $$props.disabled);
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('onEnter' in $$props) $$invalidate(13, onEnter = $$props.onEnter);
    		if ('onExit' in $$props) $$invalidate(14, onExit = $$props.onExit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$layers, innerHeight*/ 131074) {
    			// update ParallaxLayers from parent
    			$layers.forEach(layer => {
    				layer.setHeight(innerHeight);
    			});
    		}

    		if ($$self.$$.dirty & /*$layers, $scrollTop, innerHeight, disabled*/ 200706) {
    			$layers.forEach(layer => {
    				layer.setPosition($scrollTop, innerHeight, disabled);
    			});
    		}
    	};

    	return [
    		style,
    		innerHeight,
    		container,
    		$y,
    		y,
    		top,
    		scrollTop,
    		layers,
    		setDimensions,
    		sections,
    		config,
    		threshold,
    		disabled,
    		onEnter,
    		onExit,
    		scrollTo$1,
    		$scrollTop,
    		$layers,
    		$$scope,
    		slots,
    		resize_handler,
    		onwindowscroll,
    		onwindowresize,
    		div_binding
    	];
    }

    class Parallax extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			sections: 9,
    			config: 10,
    			threshold: 11,
    			disabled: 12,
    			style: 0,
    			onEnter: 13,
    			onExit: 14,
    			scrollTo: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Parallax",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get sections() {
    		throw new Error("<Parallax>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sections(value) {
    		throw new Error("<Parallax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get config() {
    		throw new Error("<Parallax>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<Parallax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get threshold() {
    		throw new Error("<Parallax>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set threshold(value) {
    		throw new Error("<Parallax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Parallax>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Parallax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Parallax>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Parallax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEnter() {
    		throw new Error("<Parallax>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEnter(value) {
    		throw new Error("<Parallax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExit() {
    		throw new Error("<Parallax>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExit(value) {
    		throw new Error("<Parallax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollTo() {
    		return this.$$.ctx[15];
    	}

    	set scrollTo(value) {
    		throw new Error("<Parallax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* node_modules/svelte-parallax/src/ParallaxLayer.svelte generated by Svelte v3.46.2 */
    const file$1 = "node_modules/svelte-parallax/src/ParallaxLayer.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let div_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "parallax-layer svelte-qcp0z5");
    			attr_dev(div, "style", div_style_value = "" + /*style*/ ctx[0] + " height: " + /*height*/ ctx[1] + "px; -ms-transform: " + /*translate*/ ctx[2] + " -webkit-transform: " + /*translate*/ ctx[2] + " transform: " + /*translate*/ ctx[2] + "");
    			add_location(div, file$1, 57, 0, 1528);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*style, height, translate*/ 7 && div_style_value !== (div_style_value = "" + /*style*/ ctx[0] + " height: " + /*height*/ ctx[1] + "px; -ms-transform: " + /*translate*/ ctx[2] + " -webkit-transform: " + /*translate*/ ctx[2] + " transform: " + /*translate*/ ctx[2] + "")) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let translate;
    	let $coord;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ParallaxLayer', slots, ['default']);
    	let { rate = 0.5 } = $$props;
    	let { offset = 0 } = $$props;
    	let { span = 1 } = $$props;
    	let { style = "" } = $$props;

    	// get context from Parallax
    	let { config, addLayer, removeLayer } = getContext(contextKey);

    	// spring store to hold changing scroll coordinate
    	const coord = spring(undefined, config);

    	validate_store(coord, 'coord');
    	component_subscribe($$self, coord, value => $$invalidate(7, $coord = value));

    	// layer height
    	let height;

    	const layer = {
    		setPosition: (scrollTop, innerHeight, disabled) => {
    			// amount to scroll before layer is at target position
    			const targetScroll = Math.floor(offset) * innerHeight;

    			// distance to target position
    			const distance = offset * innerHeight + targetScroll * rate;

    			const current = disabled
    			? offset * innerHeight
    			: -(scrollTop * rate) + distance;

    			coord.set(current, { hard: disabled });
    		},
    		setHeight: innerHeight => {
    			$$invalidate(1, height = span * innerHeight);
    		}
    	};

    	onMount(() => {
    		// register layer with parent
    		addLayer(layer);

    		return () => {
    			// clean up
    			removeLayer(layer);
    		};
    	});

    	const writable_props = ['rate', 'offset', 'span', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ParallaxLayer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('rate' in $$props) $$invalidate(4, rate = $$props.rate);
    		if ('offset' in $$props) $$invalidate(5, offset = $$props.offset);
    		if ('span' in $$props) $$invalidate(6, span = $$props.span);
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		spring,
    		contextKey,
    		rate,
    		offset,
    		span,
    		style,
    		config,
    		addLayer,
    		removeLayer,
    		coord,
    		height,
    		layer,
    		translate,
    		$coord
    	});

    	$$self.$inject_state = $$props => {
    		if ('rate' in $$props) $$invalidate(4, rate = $$props.rate);
    		if ('offset' in $$props) $$invalidate(5, offset = $$props.offset);
    		if ('span' in $$props) $$invalidate(6, span = $$props.span);
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('config' in $$props) config = $$props.config;
    		if ('addLayer' in $$props) addLayer = $$props.addLayer;
    		if ('removeLayer' in $$props) removeLayer = $$props.removeLayer;
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('translate' in $$props) $$invalidate(2, translate = $$props.translate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$coord*/ 128) {
    			// translate layer according to coordinate
    			$$invalidate(2, translate = `translate3d(0, ${$coord}px, 0);`);
    		}
    	};

    	return [style, height, translate, coord, rate, offset, span, $coord, $$scope, slots];
    }

    class ParallaxLayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { rate: 4, offset: 5, span: 6, style: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ParallaxLayer",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get rate() {
    		throw new Error("<ParallaxLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rate(value) {
    		throw new Error("<ParallaxLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<ParallaxLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<ParallaxLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get span() {
    		throw new Error("<ParallaxLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set span(value) {
    		throw new Error("<ParallaxLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ParallaxLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ParallaxLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.2 */
    const file = "src/App.svelte";

    // (33:3) <ParallaxLayer rate={0} offset={0} style={"background-color: white; display: flex !important; justify-content: center !important;"}>
    function create_default_slot_8(ctx) {
    	let solution;
    	let current;
    	solution = new Solution({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(solution.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(solution, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(solution.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(solution.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(solution, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(33:3) <ParallaxLayer rate={0} offset={0} style={\\\"background-color: white; display: flex !important; justify-content: center !important;\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (36:3) <ParallaxLayer rate={0} offset={1}>
    function create_default_slot_7(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "banner svelte-1n8vvxr");
    			if (!src_url_equal(img.src, img_src_value = "img/BannerWAITR.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "banner");
    			add_location(img, file, 36, 4, 1319);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(36:3) <ParallaxLayer rate={0} offset={1}>",
    		ctx
    	});

    	return block;
    }

    // (39:3) <ParallaxLayer rate={0.5} offset={1.2}>
    function create_default_slot_6(ctx) {
    	let resume_1;
    	let current;
    	resume_1 = new Resume({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(resume_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(resume_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(resume_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(resume_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(resume_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(39:3) <ParallaxLayer rate={0.5} offset={1.2}>",
    		ctx
    	});

    	return block;
    }

    // (42:3) <ParallaxLayer rate={2.0} offset={1.5} style={"background-color: white; display: flex !important; justify-content: center !important;"}>
    function create_default_slot_5(ctx) {
    	let whoareus;
    	let current;
    	whoareus = new WhoAreWe({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(whoareus.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(whoareus, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(whoareus.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(whoareus.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(whoareus, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(42:3) <ParallaxLayer rate={2.0} offset={1.5} style={\\\"background-color: white; display: flex !important; justify-content: center !important;\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (45:3) <ParallaxLayer rate={0} offset={1.9}>
    function create_default_slot_4(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "banner svelte-1n8vvxr");
    			if (!src_url_equal(img.src, img_src_value = "img/BannerWAITR.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "banner");
    			add_location(img, file, 45, 4, 1699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(45:3) <ParallaxLayer rate={0} offset={1.9}>",
    		ctx
    	});

    	return block;
    }

    // (48:3) <ParallaxLayer rate={1} offset={2}>
    function create_default_slot_3(ctx) {
    	let team;
    	let current;
    	team = new Team({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(team.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(team, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(team.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(team.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(team, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(48:3) <ParallaxLayer rate={1} offset={2}>",
    		ctx
    	});

    	return block;
    }

    // (32:2) <Parallax sections={3.0} config={{stiffness: 0.3}}>
    function create_default_slot_2(ctx) {
    	let parallaxlayer0;
    	let t0;
    	let parallaxlayer1;
    	let t1;
    	let parallaxlayer2;
    	let t2;
    	let parallaxlayer3;
    	let t3;
    	let parallaxlayer4;
    	let t4;
    	let parallaxlayer5;
    	let current;

    	parallaxlayer0 = new ParallaxLayer({
    			props: {
    				rate: 0,
    				offset: 0,
    				style: "background-color: white; display: flex !important; justify-content: center !important;",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	parallaxlayer1 = new ParallaxLayer({
    			props: {
    				rate: 0,
    				offset: 1,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	parallaxlayer2 = new ParallaxLayer({
    			props: {
    				rate: 0.5,
    				offset: 1.2,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	parallaxlayer3 = new ParallaxLayer({
    			props: {
    				rate: 2.0,
    				offset: 1.5,
    				style: "background-color: white; display: flex !important; justify-content: center !important;",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	parallaxlayer4 = new ParallaxLayer({
    			props: {
    				rate: 0,
    				offset: 1.9,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	parallaxlayer5 = new ParallaxLayer({
    			props: {
    				rate: 1,
    				offset: 2,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parallaxlayer0.$$.fragment);
    			t0 = space();
    			create_component(parallaxlayer1.$$.fragment);
    			t1 = space();
    			create_component(parallaxlayer2.$$.fragment);
    			t2 = space();
    			create_component(parallaxlayer3.$$.fragment);
    			t3 = space();
    			create_component(parallaxlayer4.$$.fragment);
    			t4 = space();
    			create_component(parallaxlayer5.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parallaxlayer0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(parallaxlayer1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(parallaxlayer2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(parallaxlayer3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(parallaxlayer4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(parallaxlayer5, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parallaxlayer0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				parallaxlayer0_changes.$$scope = { dirty, ctx };
    			}

    			parallaxlayer0.$set(parallaxlayer0_changes);
    			const parallaxlayer1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				parallaxlayer1_changes.$$scope = { dirty, ctx };
    			}

    			parallaxlayer1.$set(parallaxlayer1_changes);
    			const parallaxlayer2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				parallaxlayer2_changes.$$scope = { dirty, ctx };
    			}

    			parallaxlayer2.$set(parallaxlayer2_changes);
    			const parallaxlayer3_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				parallaxlayer3_changes.$$scope = { dirty, ctx };
    			}

    			parallaxlayer3.$set(parallaxlayer3_changes);
    			const parallaxlayer4_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				parallaxlayer4_changes.$$scope = { dirty, ctx };
    			}

    			parallaxlayer4.$set(parallaxlayer4_changes);
    			const parallaxlayer5_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				parallaxlayer5_changes.$$scope = { dirty, ctx };
    			}

    			parallaxlayer5.$set(parallaxlayer5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parallaxlayer0.$$.fragment, local);
    			transition_in(parallaxlayer1.$$.fragment, local);
    			transition_in(parallaxlayer2.$$.fragment, local);
    			transition_in(parallaxlayer3.$$.fragment, local);
    			transition_in(parallaxlayer4.$$.fragment, local);
    			transition_in(parallaxlayer5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parallaxlayer0.$$.fragment, local);
    			transition_out(parallaxlayer1.$$.fragment, local);
    			transition_out(parallaxlayer2.$$.fragment, local);
    			transition_out(parallaxlayer3.$$.fragment, local);
    			transition_out(parallaxlayer4.$$.fragment, local);
    			transition_out(parallaxlayer5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parallaxlayer0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(parallaxlayer1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(parallaxlayer2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(parallaxlayer3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(parallaxlayer4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(parallaxlayer5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(32:2) <Parallax sections={3.0} config={{stiffness: 0.3}}>",
    		ctx
    	});

    	return block;
    }

    // (30:4) <Route path="*">
    function create_default_slot_1(ctx) {
    	let navbar;
    	let t0;
    	let parallax;
    	let t1;
    	let footer;
    	let current;
    	navbar = new NavBar({ props: { route: "/" }, $$inline: true });

    	parallax = new Parallax({
    			props: {
    				sections: 3.0,
    				config: { stiffness: 0.3 },
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(parallax.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(parallax, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parallax_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				parallax_changes.$$scope = { dirty, ctx };
    			}

    			parallax.$set(parallax_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(parallax.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(parallax.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(parallax, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(30:4) <Route path=\\\"*\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:0) <Router {url}>
    function create_default_slot(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				path: "*",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(29:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let style;
    	let t1;
    	let div0;
    	let t2;
    	let div1;
    	let t3;
    	let div2;
    	let t4;
    	let div3;
    	let t5;
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			style = element("style");
    			style.textContent = "@import url(\"https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap\");\n        @import url(\"https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap\");";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			div2 = element("div");
    			t4 = space();
    			div3 = element("div");
    			t5 = space();
    			create_component(router.$$.fragment);
    			add_location(style, file, 18, 4, 520);
    			attr_dev(div0, "id", "whoAreUs");
    			set_style(div0, "position", "relative");
    			set_style(div0, "top", "400px");
    			add_location(div0, file, 24, 0, 748);
    			attr_dev(div1, "id", "solution");
    			set_style(div1, "position", "relative");
    			set_style(div1, "top", "1175px");
    			add_location(div1, file, 25, 0, 809);
    			attr_dev(div2, "id", "team");
    			set_style(div2, "position", "relative");
    			set_style(div2, "top", "1750px");
    			add_location(div2, file, 26, 0, 871);
    			attr_dev(div3, "id", "contact");
    			set_style(div3, "position", "relative");
    			set_style(div3, "top", "2500px");
    			add_location(div3, file, 27, 0, 929);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, style);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div3, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(style);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t5);
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let resume = 3.11;
    	const url = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		NavBar,
    		WhoAreUS: WhoAreWe,
    		Resume,
    		Solution,
    		Team,
    		Footer,
    		MainFrame,
    		Not404: _404not404,
    		Router,
    		Route,
    		Parallax,
    		ParallaxLayer,
    		resume,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ('resume' in $$props) resume = $$props.resume;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		return this.$$.ctx[0];
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
