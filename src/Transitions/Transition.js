import Scene from '../Scenes/Scene';

export default class Transition extends Scene {

    /**
     * Construct the element
     *
     * @param Number animationTransitionTime
     *
     * @return void
     */
    constructor( animationTransitionTime = .8, options = {} ) {
        super(options);
        this.transitionTime = animationTransitionTime;
    }

    /**
     * Animate the transition between two elements
     * The this.to and this.from is automaticly set in the Timlineline
     *
     * this.to represents the element we are animating in
     * this.from represents the element we are animating out
     *
     * @return void
     */
    animate() {

        // Hide all to elements as a default 
        if (this.in) {
            TweenLite.set( this.in.template, {
                opacity: 0,
            } );
        }

        // Animate the element out
        if (this.out) {
            this.to( this.out.template, this.transitionTime, { 
                opacity: 0,
            });
        }

        // Animate the element in
        if (this.in) {
            this.to( this.in.template, this.transitionTime, {
                opacity: 1,
            }, 0 );
        }

    }

}
