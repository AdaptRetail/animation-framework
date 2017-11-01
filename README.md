# @adapt-retail/animation-framework
> A framework for quickly and structured create HTML5 animations with both HTML elements and video.

The core concept of this animation framework is to help you create fast,
structured and logical animations. We do this by helping you create
sections/modules of your code, and then sowing it together on a higher level.

These modules are [Timeline](#timeline), [Scene](#scene) and [Transition](#transition).

## Install

In your project folder run following code.

```bash
npm install @adapt-retail/animation-framework
```

## Usage

### [Get familiar with GSAP](https://greensock.com/gsap)
This project is built upon [greensock/GreenSock-JS](https://github.com/greensock/GreenSock-JS).
We recommend you get familiar with [the basic of GSAP](https://greensock.com/jump-start-js/) to minimize whats new in this project. 

GreenSock GSAP is a animation standard for web, and we recommend you to read [Get started guide](https://greensock.com/get-started-js) to use GreenSock/GSAP in other projects to.

### See it in use
This project is already used as a dependency in the
[AdaptRetail/video-template](https://github.com/AdaptRetail/video-template).

## API

<a name="timeline"></a>
### Timeline

Timline is the core class of this package. At this point every other class uses Timeline.
The Timeline class is extending from [GSAP/TimelineMax](https://greensock.com/timelinemax).

Most of the time you will only use the timelineclass as the main timeline for
all other classes that inherits from the timeline class. Often you will find yourself using 
the timeline through eather a [Scene](#scene) or [Transition](#Transition).

```js
/**
 * Import your scene, as we discuss in the Scene section
 */
const MyIntroScene = require( './Path/To/MyIntroScene' );
const MyScene = require( './Path/To/MyScene' );

/**
 * Create the main timeline.
 * We recommend you to add it to the window to access it from the console later
 * as timeline.
 * 
 * We all properties added to Timeline constructor will be added to TimelineMax
 */
window.timeline = new Timeline();

/**
 * Add the Scene to the timeline.
 * It will automaticly be rendered and added
 * Make sure you new opp your Scene class
 *
 * You can allso pass data to your scene through the constructorj:w
 */
 timeline.add( new MyIntroScene() );
 timeline.add( new MyScene() );

 /**
  * The main timeline has to be kickstarted by running timeline.start() function.
  * It will run the start function automaticly on every child Timline
  */
  timeline.start();
```

> Quick tip: Each module handle its own logic.
> If you just want to work with MyScene, you can just comment out the
> MyIntroScene, and then you only see your MyScene logic and animations.

Cause of the Timeline is extended from TimelineMax you can also add logic like this:
```js
timeline.from( element, 3, {
    opacity: 0,
} );
```

<a name="not-instant"></a>
#### The Timeline is not instant as TimelineMax
One change we made to the Timeline is that it does not execute at once all the
properties are added to it. This is to make it posible to wait for resources
to load and alter the timeline length without the TimelineMax skipping it.

Each parent timeline will wait for every child to notify when it is done. Then it
will notify its parent that it is done. This process will bubble up until its
main timeline, then it will add All into TimelineMax and run.

An example of a resource it to wait for a video to load to get it length. 
You cannot alter the timlines duration after it is added to another timeline in
GSAP.

A result of this is that functions like `totalDuration()`
on a timeline before it has started, will not work.

You can overwrite this behaviour by adding following to constructor
```js
window.timeline = new Timeline({
    paused: false,
});
```

<a name="scene"></a>
### Scene

In this framework you will use the most of your time in a Scene.
The Scene is extending from Timeline that also inherits from TimelineMax.

The Scene is only ment to be extended, and not used on its own.

#### Example class
```js
import {Scene} from '@adapt-retail/animation-framework';

class MyScene extends Scene {

    constructor() {
        super();
        this.helloTo = 'world';
    }

    /**
     * Return html string
     *
     * @return string
     */
    template() {
        return `
            <div>Hello <span class="hello-to">{{ helloTo }}</span>!</div>
        `;
    }

    /**
     * Animate the elemnts around.
     * this.template references the first element in template function
     *
     * @return void
     */
    animate() {
        this.from( this.template, 5, {
            x: '100%',
        } );

        this.from( this.template.querySelector( '.hello-to' ), .8, {
            opacity: 0,
        }, 0 );
    }

}
```

#### Template

```js
render() {
    return `
        <div>
            <h1 class="title">Hello {{ world }}</h1>
            <p class="description">{{{ description }}}</p>
        </div>
    `
}
```

> Note: A template can only have one root HTML element, if multiple is set we will use
> the first one.

The template function is where you will add your HTML for this Scene. We are
using [mustache](https://github.com/janl/mustache.js) to render variables to the template.
As a default you can access all `this.` variables through the template.

##### Render to
As a default we are rendering each Scene and element to the document.body.
You can define what element you want to render your elements to like this:
```js
timeline.add( new Scene({
    renderTo: document.querySelector( '.content' ),
}) );
```

#### Animate
```js
animate() {
    /**
     * Introduction movement for <h1 class="title"></h1> elemnt in template.
     */
    this.to( this.template.querySelector( '.title' ), 1, {
        ease: SlowMo.ease.config(0.1, 2, true),
        scale: 1.5,
    } );

    /**
     * Show the description half a second before the title movement is done.
     */
    this.from( this.template.querySelector( '.description' ), .8, {
        opacity: 0,
    }, '-=.5' );
}
```

The animate function is where you make all your elements move.
The animate will run when everything is rendered to the page.

As the scene is inheriting from TimelineMax, we are accessing the TimelineMax,
from using the `this.` keyword. From there you can do [everything a
TimelineMax](https://greensock.com/docs/TimelineMax) can do.

#### Setup
```js
setup() {
    return new Promise( function( resolve, reject ) {
        window.setTimeout( function() {
            resolve();
        }, 500 );
    } );
}
```

If you need to setup something or wait for resources to load before running
animation you can setup a `setup()` function in the class.

The setup command returns a promise. This is to make timeline wait to sew the
full timeline together before each Scene, Transition and Timeline is done loading before rendering and running animation.

You can read about [why here](#not-instant).

##### Before and after setup function hooks

None of the `beforeSetup()` or `afterSetup()` need to return anything.

The `beforeSetup()` will run immediately before the `setup()` is executed.
The `afterSetup()` will run immediately after the `setup()` is executed.

<a name="transition"></a>
### Transition
### Video

The video is under development, but can be reached by
```js
const {Video} = require( '@adapt-retail/animation-framework' );
```

See [Video.js](https://github.com/AdaptRetail/animation-framework/blob/master/src/Video.js) to see how it works.
