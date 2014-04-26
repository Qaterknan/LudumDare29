// https://github.com/photonstorm/phaser/blob/master/src/tween/Tween.js

function Tween(object, game, manager){
    this.object = object;
    this.game = game;
    this._manager = manager;

    this._valuesStart = {};
    this._valuesEnd = {};
    this._duration = 1000;
    this._delayTime = 0;
    this._easingFunction = Easing.Linear.None;
    this._interpolationFunction = function (v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);

        if (k < 0)
        {
            return this.linear(v[0], v[1], f);
        }

        if (k > 1)
        {
            return this.linear(v[m], v[m - 1], m - f);
        }

        return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);

    },

    this.onStart = function(){};
    this.onComplete = function(){};
}

Tween.prototype = {
    to: function (properties, duration, ease, autoStart, delay) {

        duration = duration || 1000;
        ease = ease || null;
        delay = delay || 0;

        this._repeat = repeat;
        this._duration = duration;
        this._valuesEnd = properties;

        if (ease !== null)
        {
            this._easingFunction = ease;
        }

        if (delay > 0)
        {
            this._delayTime = delay;
        }

        if (autoStart)
        {
            return this.start();
        }
        else
        {
            return this;
        }

    },

    start: function () {

        this.isRunning = true;

        this._onStartCallbackFired = false;

        this._startTime = this.game.time.now + this._delayTime;

        for (var property in this._valuesEnd)
        {
            // check if an Array was provided as property value
            if (Array.isArray(this._valuesEnd[property]))
            {
                if (this._valuesEnd[property].length === 0)
                {
                    continue;
                }

                // create a local copy of the Array with the start value at the front
                this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
            }

            this._valuesStart[property] = this._object[property];

            if (!Array.isArray(this._valuesStart[property]))
            {
                this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }

            this._valuesStartRepeat[property] = this._valuesStart[property] || 0;

        }

        return this;

    },

    /**
    * Stops the tween if running and removes it from the TweenManager. If there are any onComplete callbacks or events they are not dispatched.
    *
    * @method Tween#stop
    * @return {Tween} Itself.
    */
    stop: function () {

        this.isRunning = false;

        this._onUpdateCallback = null;

        this._manager.remove(this);

        return this;

    },

    /**
    * Sets a delay time before this tween will start.
    *
    * @method Tween#delay
    * @param {number} amount - The amount of the delay in ms.
    * @return {Tween} Itself.
    */
    delay: function (amount) {

        this._delayTime = amount;
        return this;

    },

    /**
    * Set easing function this tween will use, i.e. Easing.Linear.None.
    *
    * @method Tween#easing
    * @param {function} easing - The easing function this tween will use, i.e. Easing.Linear.None.
    * @return {Tween} Itself.
    */
    easing: function (easing) {

        this._easingFunction = easing;
        return this;

    },

    /**
    * Sets a callback to be fired each time this tween updates. Note: callback will be called in the context of the global scope.
    *
    * @method Tween#onUpdateCallback
    * @param {function} callback - The callback to invoke each time this tween is updated.
    * @return {Tween} Itself.
    */
    onUpdateCallback: function (callback, callbackContext) {

        this._onUpdateCallback = callback;
        this._onUpdateCallbackContext = callbackContext;

        return this;

    },

    /**
    * Core tween update function called by the TweenManager. Does not need to be invoked directly.
    *
    * @method Tween#update
    * @param {number} time - A timestamp passed in by the TweenManager.
    * @return {boolean} false if the tween has completed and should be deleted from the manager, otherwise true (still active).
    */
    update: function (time) {

        if (this.pendingDelete)
        {
            return false;
        }

        if (this._paused || time < this._startTime)
        {
            return true;
        }

        var property;

        if (time < this._startTime)
        {
            return true;
        }

        if (this._onStartCallbackFired === false)
        {
            this.onStart.dispatch(this._object);
            this._onStartCallbackFired = true;
        }

        var elapsed = (time - this._startTime) / this._duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        var value = this._easingFunction(elapsed);

        for (property in this._valuesEnd)
        {
            var start = this._valuesStart[property] || 0;
            var end = this._valuesEnd[property];

            if (end instanceof Array)
            {
                this._object[property] = this._interpolationFunction(end, value);
            }
            else
            {
                // Parses relative end values with start as base (e.g.: +10, -3)
                if (typeof(end) === 'string')
                {
                    end = start + parseFloat(end, 10);
                }

                // protect against non numeric properties.
                if (typeof(end) === 'number')
                {
                    this._object[property] = start + ( end - start ) * value;
                }
            }
        }

        if (this._onUpdateCallback !== null)
        {
            this._onUpdateCallback.call(this._onUpdateCallbackContext, this, value);
        }

        if (elapsed == 1)
        {
            if (this._repeat > 0)
            {
                if (isFinite(this._repeat))
                {
                    this._repeat--;
                }

                // reassign starting values, restart by making startTime = now
                for (property in this._valuesStartRepeat)
                {
                    if (typeof(this._valuesEnd[property]) === 'string')
                    {
                        this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property], 10);
                    }

                    if (this._yoyo)
                    {
                        var tmp = this._valuesStartRepeat[property];
                        this._valuesStartRepeat[property] = this._valuesEnd[property];
                        this._valuesEnd[property] = tmp;
                        this._reversed = !this._reversed;
                    }

                    this._valuesStart[property] = this._valuesStartRepeat[property];
                }

                this._startTime = time + this._delayTime;

                this.onLoop.dispatch(this._object);

                return true;

            }
            else
            {
                this.isRunning = false;
                this.onComplete.dispatch(this._object);

                for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i ++)
                {
                    this._chainedTweens[i].start(time);
                }

                return false;
            }

        }

        return true;

    }

};


/* jshint curly: false */

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A collection of easing methods defining ease-in ease-out curves.
*
* @class Easing
*/
Easing = {

    /**
    * Linear easing.
    *
    * @class Easing.Linear
    */
    Linear: {

        /**
        * Ease-in.
        *
        * @method Easing.Linear#In
        * @param {number} k - The value to be tweened.
        * @returns {number} k^2.
        */
        None: function ( k ) {

            return k;

        }

    },

    /**
    * Quadratic easing.
    *
    * @class Easing.Quadratic
    */
    Quadratic: {

        /**
        * Ease-in.
        *
        * @method Easing.Quadratic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} k^2.
        */
        In: function ( k ) {

            return k * k;

        },

        /**
        * Ease-out.
        *
        * @method Easing.Quadratic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} k* (2-k).
        */
        Out: function ( k ) {

            return k * ( 2 - k );

        },

        /**
        * Ease-in/out.
        *
        * @method Easing.Quadratic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
            return - 0.5 * ( --k * ( k - 2 ) - 1 );

        }

    },

    /**
    * Cubic easing.
    *
    * @class Easing.Cubic
    */
    Cubic: {

        /**
        * Cubic ease-in.
        *
        * @method Easing.Cubic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return k * k * k;

        },

        /**
        * Cubic ease-out.
        *
        * @method Easing.Cubic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return --k * k * k + 1;

        },

        /**
        * Cubic ease-in/out.
        *
        * @method Easing.Cubic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k + 2 );

        }

    },

    /**
    * Quartic easing.
    *
    * @class Easing.Quartic
    */
    Quartic: {

        /**
        * Quartic ease-in.
        *
        * @method Easing.Quartic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return k * k * k * k;

        },

        /**
        * Quartic ease-out.
        *
        * @method Easing.Quartic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return 1 - ( --k * k * k * k );

        },

        /**
        * Quartic ease-in/out.
        *
        * @method Easing.Quartic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
            return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

        }

    },

    /**
    * Quintic easing.
    *
    * @class Easing.Quintic
    */
    Quintic: {

        /**
        * Quintic ease-in.
        *
        * @method Easing.Quintic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return k * k * k * k * k;

        },

        /**
        * Quintic ease-out.
        *
        * @method Easing.Quintic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return --k * k * k * k * k + 1;

        },

        /**
        * Quintic ease-in/out.
        *
        * @method Easing.Quintic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

        }

    },

    /**
    * Sinusoidal easing.
    *
    * @class Easing.Sinusoidal
    */
    Sinusoidal: {

        /**
        * Sinusoidal ease-in.
        *
        * @method Easing.Sinusoidal#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return 1 - Math.cos( k * Math.PI / 2 );

        },

        /**
        * Sinusoidal ease-out.
        *
        * @method Easing.Sinusoidal#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return Math.sin( k * Math.PI / 2 );

        },

        /**
        * Sinusoidal ease-in/out.
        *
        * @method Easing.Sinusoidal#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

        }

    },

    /**
    * Exponential easing.
    *
    * @class Easing.Exponential
    */
    Exponential: {

        /**
        * Exponential ease-in.
        *
        * @method Easing.Exponential#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return k === 0 ? 0 : Math.pow( 1024, k - 1 );

        },

        /**
        * Exponential ease-out.
        *
        * @method Easing.Exponential#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

        },

        /**
        * Exponential ease-in/out.
        *
        * @method Easing.Exponential#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
            return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

        }

    },

    /**
    * Circular easing.
    *
    * @class Easing.Circular
    */
    Circular: {

        /**
        * Circular ease-in.
        *
        * @method Easing.Circular#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return 1 - Math.sqrt( 1 - k * k );

        },

        /**
        * Circular ease-out.
        *
        * @method Easing.Circular#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return Math.sqrt( 1 - ( --k * k ) );

        },

        /**
        * Circular ease-in/out.
        *
        * @method Easing.Circular#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
            return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

        }

    },

    /**
    * Elastic easing.
    *
    * @class Easing.Elastic
    */
    Elastic: {

        /**
        * Elastic ease-in.
        *
        * @method Easing.Elastic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

        },

        /**
        * Elastic ease-out.
        *
        * @method Easing.Elastic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

        },

        /**
        * Elastic ease-in/out.
        *
        * @method Easing.Elastic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
            return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

        }

    },

    /**
    * Back easing.
    *
    * @class Easing.Back
    */
    Back: {

        /**
        * Back ease-in.
        *
        * @method Easing.Back#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            var s = 1.70158;
            return k * k * ( ( s + 1 ) * k - s );

        },

        /**
        * Back ease-out.
        *
        * @method Easing.Back#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            var s = 1.70158;
            return --k * k * ( ( s + 1 ) * k + s ) + 1;

        },

        /**
        * Back ease-in/out.
        *
        * @method Easing.Back#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            var s = 1.70158 * 1.525;
            if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
            return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

        }

    },

    /**
    * Bounce easing.
    *
    * @class Easing.Bounce
    */
    Bounce: {

        /**
        * Bounce ease-in.
        *
        * @method Easing.Bounce#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return 1 - Easing.Bounce.Out( 1 - k );

        },

        /**
        * Bounce ease-out.
        *
        * @method Easing.Bounce#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            if ( k < ( 1 / 2.75 ) ) {

                return 7.5625 * k * k;

            } else if ( k < ( 2 / 2.75 ) ) {

                return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

            } else if ( k < ( 2.5 / 2.75 ) ) {

                return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

            } else {

                return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

            }

        },

        /**
        * Bounce ease-in/out.
        *
        * @method Easing.Bounce#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( k < 0.5 ) return Easing.Bounce.In( k * 2 ) * 0.5;
            return Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

        }

    }

};