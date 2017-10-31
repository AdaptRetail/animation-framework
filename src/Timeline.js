import {TimelineMax} from 'gsap';
import Transition from '../Transitions/Transition';

export default class Timeline extends TimelineMax {

    constructor( options = {} ) {

        /**
         * Pause all timelines before we start woring on it
         * This is to prevent it from shifting elements around before it starts
         */
        options.paused = options.options || true;

        super( options );

        this.options = options;
        this.scenes = [];

        this.promisesToWaitForBeforeStart = [];

    }

    /**
     * Add animation step, but dont push it to timeline
     *
     * @param mixed animate [ tween, timeline, callback, or label, or an array of them ]
     * @param tweenAlign = '+=0'
     */
    add( value, position = '+=0' ) {

        if (Array.isArray( value )) {
            for (var i = 0, len = value.length; i < len; i++) {
                this.add( value[i], position );
            }
            return this;
        }

        this.handleTransitionLogic( value );

        this.scenes.push( {
            value,
            position,
        } );

        this.waitFor( value );

        return this;
    }

    /**
     * Set "in" and "out" properties to Transitions
     *
     * @return void
     */
    handleTransitionLogic( animation ) {

        // Exit if we dont have enough animations yet
        if ( ! this.scenes.length ) {
            return;
        }

        // Get the element before
        var animationBefore = this.scenes[ this.scenes.length-1 ].value;

        if ( this.isInstanceOfTransition( animation ) ) {

            // Check element before
            if ( ! this.isInstanceOfTransition( animationBefore )) {
                animation.out = animationBefore;
            }
            return;

        }

        // If we are not an Transition we add this as the in value
        if (this.isInstanceOfTransition( animationBefore )) {
            animationBefore.in = animation;
        }



    }

    /**
     * Check if value has instance of Transition
     *
     * @return bool
     */
    isInstanceOfTransition( object ) {
        return object instanceof Transition;
    }

    waitFor( timeline ) {
        this.promisesToWaitForBeforeStart.push(
            timeline.totalSetup ? timeline.totalSetup.call( timeline ) : Promise.resolve()
        );
    }

    /**
     * Add to actual Timeline
     *
     * @return void
     */
    addToTimeline( animate, tweenAlign = '+=' ) {

        /**
         * Start playing Timeline when we add it to the actual timeline
         */
        if (animate.play) {
            animate.play();
        }
        super.add( animate, tweenAlign );
    }

    /**
     * Setup all promisesToWaitForBeforeStart in this timeline
     * 
     * @return Promise
     */
    waitForAllPromisesThenStart() {

        // Get all promises
        return Promise.all( this.promisesToWaitForBeforeStart );
    }

    /**
     * Add all tween and scenes to actual timeline
     *
     * @return void
     */
    start() {
        var self = this;

        this.waitForAllPromisesThenStart().then( ()=>{
            this.addAllToActualTimeline();
            this.restart();
        } );

    }

    addAllToActualTimeline() {
        for (var i = 0, len = this.scenes.length; i < len; i++) {
            var scene = this.scenes[i];

            this.addToTimeline( scene.value, scene.position );
        }
    }

    /**
     * This function will hold up your animations until is resolved.
     *
     * Use this to wait for videos or images to load for example.
     *
     * @return Promise
     */
    setup() {
        return Promise.resolve();
    }

    /**
     * This function runs before the setup function is resolved
     *
     * @return void
     */
    beforeSetup() {}

    /**
     * This function runs after the setup function is resolved
     *
     * @return void
     */
    afterSetup() {}

    /**
     * Wait for all setups to complete
     * Also in Timelines inside this
     * 
     * @return Promise
     */
    totalSetup() {
        return new Promise( ( resolve, reject )=>{
            this.beforeSetup();
            this.setup().then( ()=>{
                this.afterSetup();

                Promise.all(
                    this.promisesToWaitForBeforeStart
                ).then( ()=>{
                    this.addAllToActualTimeline();
                    resolve();
                } )

            } )
        } );
    }

}

