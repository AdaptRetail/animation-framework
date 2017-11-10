# @adapt-retail/animation-framework
> A framework for quickly and structured create linear HTML5 animations with both HTML elements and video.

## Table of content
- [Introduction](#introduction)
- [Install](#install)
- [Usage](#usage)
    - [See it in action](#see-it-in-action)
- [API](#api)
    - [Timeline](#timeline)
        - [The Timeline is not instant as TimelineMax](#not-instant)
    - [Scene](#scene)
        - [Example class](#scene-example-class)
        - [Template](#template)
            - [Render to](#render-to)
        - [Animate](#animate)
        - [Setup](#setup)
            - [Before and after setup function hooks](#before-after-setup-hooks)
    - [Transition](#transition)
    - [Video](#video)
- [License](#license)

<a name="introduction"></a>
## Introduction

The core concept of this animation framework is to help you create fast,
structured and logical animations using the [GSAP animation framework](https://greensock.com/gsap).
We do this by helping you create sections/modules of your code, and then sowing it together on a higher level.

These modules are [Timeline](#timeline), [Scene](#scene) and [Transition](#transition).

<a name="install"></a>
## Install

In your project folder run following code.

```bash
npm install @adapt-retail/animation-framework
```

<a name="usage"></a>
## Usage

### [Get familiar with GSAP animation framework](https://greensock.com/gsap)
This project is built upon [greensock/GreenSock-JS](https://github.com/greensock/GreenSock-JS).
We recommend you get familiar with [the basic of GSAP](https://greensock.com/jump-start-js/) to minimize whats new in this project. 

GreenSock GSAP is a animation standard for web, and we recommend you to read [Get started guide](https://greensock.com/get-started-js) to use GreenSock/GSAP in other projects to.

<a name="see-it-in-action"></a>
### See it in action
This project is already used as a dependency in the
[AdaptRetail/video-template](https://github.com/AdaptRetail/video-template).

<a name="api"></a>
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
 * Import Timeline
 */
const Timeline = require('@adapt-retail/animation-framework');
// const { Timeline } = require('@adapt-retail/animation-framework'); // Also available

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
> The Scene is only ment to be extended, and not used on its own.

In this framework you will use the most of your time in a Scene.
The Scene is extending from Timeline that also inherits from TimelineMax.

You should think of each Scene as a Scene in a movie, or a section/module of
your animation. Try make your Scenes solve one task. Also remember Scenes can
add multiple sub Scenes. [See example here](https://github.com/AdaptRetail/video-template/blob/master/src/Scripts/Scenes/Products.js#L23-L36).

<a name="scene-example-class"></a>
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

<a name="template"></a>
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

<a name="render-to"></a>
##### Render to
As a default we are rendering each Scene and element to the document.body.
You can define what element you want to render your elements to like this:
```js
timeline.add( new Scene({
    renderTo: document.querySelector( '.content' ),
}) );
```

<a name="animate"></a>
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

<a name="setup"></a>
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

<a name="before-after-setup-hooks"></a>
##### Before and after setup function hooks

None of the `beforeSetup()` or `afterSetup()` need to return anything.

The `beforeSetup()` will run immediately before the `setup()` is executed.
The `afterSetup()` will run immediately after the `setup()` is executed.

<a name="transition"></a>
### Transition

```js
const { Transition } = require( '@adapt-retail/animation-framework' );

timeline.add( new IntroScene );
timeline.add( new Transition ); // <-- Transition between Scenes
timeline.add( new ContentSectionScene );
timeline.add( new Transition ); // <-- Transition between Scenes
timeline.add( new OutroScene );
```

The transition is extending from [Scene](#scene) and therefor inherits from [Timeline](#timeline) and TimelineMax also.
You should also extend the Transition or use it as it is. Do not run functions
from it.

Transitions are the glue between [Scenes](#scene), and you can look at as a
special Scene that handle the transition between two Scenes.

The framework notifies the Transitions about the Scene that should be animated
in (`this.in`) and what Scene should be animated out (`this.out`).

The [Core Transition class](https://github.com/AdaptRetail/animation-framework/blob/master/src/Transitions/Transition.js)
is probably the best code reference about how to create a new version of it.
But here is an example:

```js
import {Transition} from '@adapt-retail/animation-framework';

export default class SlideInOut extends Transition {

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

        // Animate the element out
        if (this.out) {
            this.to( this.out.template, this.transitionTime, { 
                x: '100%',
            });
        }

        // Animate the element in
        if (this.in) {
            this.to( this.in.template, this.transitionTime, {
                x: '-100%',
            }, 0 );
        }

    }

}
```

When your class is created you can use it like so:
```js
const SlideInOut = require( './path/to/SlideInOut' );

timeline.add( new FirstScene );
timeline.add( new SlideInOut ); // <-- Slides scenes from left to right
timeline.add( new SecondScene );
```


<a name="video"></a>
### Video

The video is under development, but can be reached by
```js
const {Video} = require( '@adapt-retail/animation-framework' );
```

See [Video.js](https://github.com/AdaptRetail/animation-framework/blob/master/src/Video.js) to see how it works.

<a name="license"></a>
## License

The code provided in this framework is MIT Licensed,
but it rely on external packages that may not.

This framework is built using the [GSAP animation framework](https://greensock.com/gsap), and they are subject to [their own license](http://greensock.com/standard-license).
Read their license to make sure you are on the safe side on how you use this framework.
