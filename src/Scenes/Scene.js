import mustache from 'mustache';
import Timeline from '../Timeline';

export default class Scene extends Timeline {

    constructor( options = {} ) {

        super( options );

        // Make sure we add the content to a element
        this.renderTo = options.renderTo || document.body;

        // Set what data should be rendered to template
        this.templateData = this;


    }

    beforeSetup() {
        this.renderTemplate();
    }

    afterSetup() {
        this.beforeScene();
        this.animate();
        this.afterScene();
    }

    /**
     * Return string with element
     * It is recommended that you require() a html template
     *
     * @return string
     */
    template() {
        return null;
    }

    /**
     * Scene is where all the magic is happen
     *
     * @return void
     */
    animate() {}

    /**
     * This method is called before animate function is called
     *
     * @return void
     */
    beforeScene() {}

    /**
     * This method is called after animate function is called
     *
     * @return void
     */
    afterScene() {}

    /**
     * This function will halt timelines start.
     * Return Promise when ready to start timeline
     *
     * @return Promise
     */
    setup() {
        return Promise.resolve();
    }

    /**
     * Render template to DOM
     *
     * @return void
     */
    renderTemplate() {

        var template = this.template();
        if (!template) {
            this.template = null;
            return;
        }

        // Get the template from the generated object
        this.template = this.createHtmlNodeFromString(template, this.templateData);
        this.renderTo.appendChild( this.template );
    }

    createHtmlNodeFromString( html, data = {} ) {
        let containerElement = document.createElement( 'div' );
        containerElement.insertAdjacentHTML( 'beforeEnd', mustache.render(
            html, data
        ) );

        // Get the template from the generated object
        return containerElement.children[0];
    }

}
