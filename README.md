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

<a href="not-instant"></a>
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

<a name="scene"></a>
### Scene

#### Setup
The setup command returns a promise. This is to make timeline wait to sew the
full timeline together before each Scene, Transition and Timeline is done loading.

You can read about [why here](#not-instant).
<a name="transition"></a>
### Transition
### Video
