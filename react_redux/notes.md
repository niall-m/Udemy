# Random Notes and Thoughts On React v16 & Redux

#### Navigation with React Router

React Router has three router types: BrowserRouter, HashRouter, MemoryRouter
use HashRouter with Github pages, expects request to defined resource

*When to navigate users*  
*Intentional nav* where a user clinks on a link vs *Programmatic Nav* where we run code to force redirection, like after clicking a button to submit a form. It's bad form to redirect without doing an error/success status check on API requests.

In order to redirect, we make use of the *history* object, which is created by the BrowserRouter. It keeps track of and can change the address in the url bar. This object is injected as a prop into each Route component within the BrowserRouter. 
A downside to the BrowserRouter is that this makes it hard to do programmatic navigation outside of the BrowserRouter's child Route components, i.e. in an action creator. To work around this, we could pass the history object as argument into the action creator any time a component calls that action creator, but that's not ideal as it creates extra code. Alternatively, we can recreate the history object with *createBrowserHistory*, use a plain Router in the App, then import the new history object into the action creator file.

To navigate to some crud based component with a specific object id, so as to edit or delete the correct record, we can either use a Selection Reducer to record what item in the list is being operated on, or preferably a URL-based selection (available with react-router-dom), where you put the ID of the item in the URL. The convention is basically RESTful routes, simply add an ':id' to the Route, i.e. /streams/edit/*:id*. This :variable is automatically added as a prop to the history object (history.match.params.variableName), which is automatically injected into each component of each Route. We then compare the component props to the list of items inside the redux state store and match the ids. To access the props within the component, use ownProps within the mapStateToProps function.

Note that React-Router is greedy when it comes to path matching, and will show all possible matches. For example: `path: "/streams/new"` and `path: "/streams/:id"` will both match at `url: "/streams/new"`. Both components will be displayed. Make use of the react-router-dom *Switch*, which will only return the first match for any given path and only show one component.

Each component needs to be designed to work in isolation, i.e. fetch its own data.

##### Reusable Components and displaying initial values with ReduxForm
The reusable component, which receives custom props, is wrapped by reduxForm. Therefore, the component using the reusable component is passing props to reduxForm, not the reusable component itself. ReduxForm passese the props through, along with other special props like *initialValues*, which accepts an object and tries to match the keys passed in to those in the form, replacing the values. Don't include any properties that aren't being updated in the initialValues object.

#### Restful Conventions
Actions - Methods - Routes - Responses
List All Records - GET - /rootPath - Array of Records
Get one particular record - GET - /rootPath/:id - Single Record
Create record - POST - rootPath - Single Record
Update ALL properties of a record - PUT - /rootPath/:id - Single Record
Update SOME properties of a record - PATCH - /rootPath/:id - Single Record
Delete record - DELETE - /rootPath/:id - Nothing

Put/Patch have conflicting results with different API implementations, all vs some rule is sometimes ignored.

#### Modals with React Portals
In React, all elements are nested inside the 'root' html element. The modal component is typically deeply nested. If it is nested within a div that has a relative styling position *and* a z-index with any defined value, this creates a *Stacking Context*. A bit of a gotcha, it can create problems/unexpected behavior with React modals, as the stacking context creates a new way of comparing sibling elements that have assigned z-index values; i.e. it compares the sibling component's z-index to the modal's *relatively positioned parent element's* z-index, rather than the z-index of the modal itself. You can't always change the parent's css in a complex app. The workaround provided by React Portals is to display the modal not as a direct child of the component, but instead as a child of some other element, e.g. the html body element. Common uses include modal windows, working with 3rd party libraries, or use react to render content in some 3rd party element, i.e. injecting a React component into some HTML that wasn't created by your react application; e.g. introducing react to a server-side rendered application, like a java, ruby on rails, or django app that renders HTML from the backend.

The return statement from a Portal element is a little different than normal, in that it doesn't return typical jsx but instead invokes the ReactDOM createPortal method, which takes 2 arguments: the ReactNode children elements (jsx to be displayed) and a reference to the element in which we want to render the portal. However, we can't just simply target the html body, as the portal will replace all the content in the body. Instead, create a placeholder element in the body hook onto, similarly to the '#root' element.

Users tend to expect a modal to close when the user clicks outside of the modal page. Inject a callback with the *onDismiss* prop on the modal and invoke it on the modal's root html element to trigger a redirect. However, clicking anywhere inside the modal will trigger that redirect via event propagation aka bubbling, so go vanilla and prevent event progagation in the child of the element that invokes the onDismiss callback to cancel the bubbles.

#### Semantic UI
SemanticUI creates styling through a specific naming convention for html elements. 
Regarding modals (https://semantic-ui.com/modules/modal.html), it can be tricky when refactoring and styling a modal to be reusable. For example, if we have a delete and cancel button and we must extract the button logic from the modal into the invoking component and then inject the buttons into the modal as props, it won't style as expected if you follow convention and create a function that returns the buttons wrapped in a div. Due to how jsx is transpiled by babel, a function can only return one html element, and consequently creating that extra div layer could throw off the styling. Rather, use a React Fragment; basically an invisible element that has no effect on the DOM.

##### Real Time Messaging (RTMP) Server
TCP-based protocol which maintains persistent connections and allows low-latency communication for streaming audio, video and data over the Internet, between a Flash player and a server. 

Responsible for receiving different video streams and broadcasting them out to different users browsers.

Data flow for live streaming:
Streamer uses Open Broadcaster Software (OBS) => *sends streamId to* => RTMP
API with list of streams currently broadcasting => *sends data to* => web app in viewer's browser for performs crud ops etc => *makes requests to get video feed with streamId* => RTMP

**OBS** 
- Scenes: a scene is a custom configuration that specifies the source of video and audio for your stream
    - set up multiple scenes to specify different sources of video, audio and quality
- Sources: the actual source of audio or video
    - set display capture, tip: hit `command + f` to recenter picture with fullscreen
    - set audio output capture
    - requires recording permissions and is buggy on macOS 10.15 Catalina; app doesn't reliable request permissions, tried deleting `/Library/Application Support/obs-studio` and reinstalling app; eventually it made request after several restarts
    - NB: output recording format defaulted to .mkv for which mac doesn't seem to have a default media player; 
        - Warning: recordings saved to MP4/MOV will be unrecoverable if the file cannot be finalized (eg. as a result of BSODs, power loss, etc.). If you want to record multiple audio tracks consider using MKV and remux the recording to MP4/MOV after it is finished (File => Remux Recordings)
        - https://medium.com/@tielqt/should-you-be-recording-to-mp4-with-obs-obs-mythbusters-fc8513851170
        
Set up client-side app to receive video streamed from OBS

There are many formats used to [access the live stream](https://github.com/illuspas/Node-Media-Server#accessing-the-live-stream). For react, use the [flv.js](https://www.npmjs.com/package/flv.js#getting-started) package. A bit like axios, it queries a server to download a video stream and converts it to a file that's compatible with the HTML5 video player. Steps: 
- import the flv library into package.json
- create a video element
- get a reference to said element
- createPlayer, accepts an options object 
    - type: flv
    - url: includes stream key from streamer
- pass ref to the video element from the player

Avoid loading logic race conditions in the render method: attach the ref to the video player after the stream has loaded.
MediaSource onSourceEnded: dont forget to `destroy()` the player when unmounting the component, or it will continue to query

### Context React v16
Props system gets data from parent component to *direct* child component, whereas Context system gets data from a parent component to *any* nested child component.
Context Object (CO) acts as a data pipeline from parent to nested component.

Two ways to get data **in** CO
- set up *Default Value* when CO is created
    - can use any valid javascript as default value, e.g. object with key/value pair, or array of numbers
- inside the parent component, create a *Provider* component, which pushes data into CO
    - not the same as Redux Provider, just same name
    - wrap component that needs access with Context.Provider, assigning a *value prop*
        - each separate use of the Context.Provider creates a new, separate *pipe* of information
Two ways to get data **out** of CO
- reference `this.context` property inside of nested child
    - To hook up context object to component, use `static contextType = contextName` to add contextType to component class
- inside the nested child, link up *Consumer* component, similar to provider
    - created automatically when new context object is created
    - when using a consumer, don't need a contextType, which is only required when we want data to be assigned to `this.context` prop
    - when placing a consumer, we give it one child, a function, which will automatically be called with whatever current value is inside the context object
        - use Consumer any time you want to get data out of multiple different context objects, inside of a single component
        - this.context is only used when we want a single context object in a component 

Create a context directory, like components directory, for context files: create and export a custom context object for a given piece of state, import object into the relevant component files that need access to that piece of state.
