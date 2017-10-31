import Scene from '../Scenes/Scene';
export default class Video extends Scene {

    constructor( video, options = {} ) {
        super( options );
        this.video = video;
        this.wantedDuration = options.duration || 0;

        this.speedUp = options.speedUp || false;

    }

    /**
     * Wait for video to know it self duration
     *
     * @return Promise
     */
    setup() {
        return new Promise( ( resolve, reject )=> {

            let self = this;

            if (self.video.readyState !== 0) {
                resolve();
                return;
            }

            this.video.addEventListener( 'loadedmetadata', function() {
                self.videoDuration = self.video.duration;
                resolve();
            }, false );

        } );

    }

    /*
     * Set the timeline duration to the length of the video.
     * If you add add duration option, change the playback speed of the video to sync to what you want the video to be.
     *
     * @return void
     */
    animate() {
        this.add( ()=>{
        
            // Reset video, set video to starting point
            this.video.currentTime = 0;

            // If you want a custom duration calculate the playback speed here
            if (this.wantedDuration) {

                // Calculate what the playback speed should be if we should fit the wanted duration
                var playbackRate = this.videoDuration / this.wantedDuration;

                // If it is ok to speed up the video or we should slow down
                // then we change the playback speed
                if ( this.speedUp || playbackRate <= 1) {
                    this.video.playbackRate = playbackRate;
                }
            }

            // Start playing the video
            this.video.play();

        } );

        // Ocupy the duration time to this timeline
        var duration = this.wantedDuration ? this.wantedDuration : this.videoDuration;
        this.set( {}, {}, '+=' + duration  );
    }


}
