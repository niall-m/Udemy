# Random Notes and Thoughts On React v16 & Redux

## Simple Cycle
React app *user clicks something* => action creator *produces* => action *gets dispatched, goes through* => middleware *passes action to* => reducers *produces* => state *flows back into* => React app

## Functional vs Class Components
Until the hooks system, we could only use functional components to produce JSX for the user. Hooks introduces the lifecycle and state functionalities to functional components, basically bringing it up to par with class-based components. They're now functionally equivalent.
- Class
    - easier to organize code
    - can introduce complexity with manual configuration of constructor and lifecycle methods
    - rules: 
        - must be a JS Class
        - must *extend* (subclass) React.Component 
        - must define a `render()` method that returns JSX
            - don't need to define constructor function, as babel will do it anyways
            - this.props
- Functional
    - easier/faster to implement
    - not supported in legacy react apps
    - just `props`

## Hooks
- primitive hooks
    - useState
        - returns an array with 2 elements: a piece of state, and a function to change it
        - define getter and setter with array destructuring and an initial value for state
            - `const [index, setIndex] = useState(null);`
    - useEffect
        - allows function components to basically use lifecycle methods
        - configure hook to run some code automatically in 3 scenarios:
            - run at **initial render only**
                - useEffect(() => {}, [])
            - run at initial render **and after every rerender**
                - useEffect(() => {})
            - run at initial render **and after every rerender *if* data has changed since last render**
                - useEffect(() => {}, [data])
        - built in cleanup function
            - only one possible value we're allowed to return from useEffect: another function
            - this function is invoked first whenever the useEffect hook is called again
        - not allowed to mark function being passed to useEffect with async/await
            - create inner helper function or IFFE and mark that as async
            - or just use normal promises, .then 
    - useRef
        - `<div ref={ref}>`
        - after component is first rendered , get access with `ref.current`
        - `if (ref.current.contains(event.target))`
    - useContext
    - useReducer
    - useCallback
    - useMemo
    - useImperativeHandle
    - useLayoutEffect
    - useDebugValue
- custom hooks
    - created by extracting hook-related code out of a function component
    - makes use of at least one primitive hook
    - should have one purpose

## Refs
Reference, gives access to a single DOM element, `<ref>.current`. In classes, create refs in the constructor, assign them to instance variables, pass to JSX element as props
Add event listener to get html info `this.imageRef.current.addEventListener('load', callback);`

NB: event listeners added directly onto the dom `document.body.addEventListener('onClick', etc)` will be invoked before any react component onClick handlers

## Navigation with React Router
Router tells react which part of the url to consider when decided which components to render to the screen.
- change URL without triggering a page refresh
- manipulates history with window.history.pushState()
    - `window.dispatchEvent(new PopStateEvent('popstate'));`
    - `window.addEventListener('popstate', awesomeCallback);`
- three router types: 
    - BrowserRouter => example.com **/users**
        - pretty urls
    - HashRouter => example.com **/#**/users
        - good for github pages, expects request to defined resource
        - or if working off an existing server with a lot of existing routes, and you want to throw a react app on it 
    - MemoryRouter

*When to navigate users*  
*Intentional nav* where a user clinks on a link vs *Programmatic Nav* where we run code to force redirection, like after clicking a button to submit a form. It's bad form to redirect without doing an error/success status check on API requests.

In order to redirect, we make use of the *history* object, which is created by the BrowserRouter. It keeps track of and can change the address in the url bar. This object is injected as a prop into each Route component within the BrowserRouter. 
A downside to the BrowserRouter is that this makes it hard to do programmatic navigation outside of the BrowserRouter's child Route components, i.e. in an action creator. To work around this, we could pass the history object as argument into the action creator any time a component calls that action creator, but that's not ideal as it creates extra code. Alternatively, we can recreate the history object with *createBrowserHistory*, use a plain Router in the App, then import the new history object into the action creator file.

To navigate to some crud based component with a specific object id, so as to edit or delete the correct record, we can either use a Selection Reducer to record what item in the list is being operated on, or preferably a URL-based selection (available with react-router-dom), where you put the ID of the item in the URL. The convention is basically RESTful routes, simply add an ':id' to the Route, i.e. /streams/edit/*:id*. This :variable is automatically added as a prop to the history object (history.match.params.variableName), which is automatically injected into each component of each Route. We then compare the component props to the list of items inside the redux state store and match the ids. To access the props within the component, use ownProps within the mapStateToProps function.

Note that React-Router is greedy when it comes to path matching, and will show all possible matches. For example: `path: "/streams/new"` and `path: "/streams/:id"` will both match at `url: "/streams/new"`. Both components will be displayed. Make use of the react-router-dom *Switch*, which (like *express*) will only return the first match for any given path and only show one component

Each component needs to be designed to work in isolation, i.e. fetch its own data.

## actions and reducers
- actions
    - must return a plain js object
    - must have a property called `type`
- reducers 
    - cannot return the same state object in memory, [or it will assume no change was made](https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts#L207)
    - cannot return undefined 
    - must be pure: cant reach outside of itself, e.g. api call
        - only considers previous state data and action
    - state.filter, state.map, [ ...state, element], { ...state, property: value }

react and redux are connected by react-redux, with Provider and Connect

meh. not gonna bother going into noob details about redux cycle and term definitions

## general data loading with redux and thunk
- components are generally responsible for fetching data they need by calling an action creator
- action creators are responsible for making API requests
    - using async/await within action creator can return unexpected objects, using a promise can create race conditions, use middleware instead
        - babel transpiler creates switch statement that returns request object, not the action
        - with synchronous action creator, it causes us to return request object instead of action
- get fetched data into component by generating new state in redux store with reducer, connecting component with mapStateToProps
- thunk
    - allows the return of functions from action creators
    - allows async/await in action creators with no problem
    - if you return function, thunk will invoke it automatically with `dispatch` and `getState` as arguments
    - ignores objects, sends them through to reducers

            return ({ dispatch, getState }) => next => action => {
                if (typeof action === 'function') {
                    return action(dispatch, getState, extraArgument);
                }
                return next(action);
            }

## ReduxForm

Reusable Components and displaying initial values. 
The reusable component, which receives custom props, is wrapped by reduxForm. Therefore, the component using the reusable component is passing props to reduxForm, not the reusable component itself. ReduxForm passese the props through, along with other special props like *initialValues*, which accepts an object and tries to match the keys passed in to those in the form, replacing the values. Don't include any properties that aren't being updated in the initialValues object.
- automatically creates its own reducers
- wrap component with `reduxForm`, exactly like redux Connect function
    - injects tons of props
- `<Field component={this.renderInput}>`
    - injects arguments into `renderInput`
        - need to manually wire up value and eventHandler 
        - `return <input {...formProps.input} />`
            - takes all key-value pairs in formProps.input and adds them as props to the input element
            - customize `renderInput` by adding additional props to field element  
                - any unrecognized props will be automatically passed to `renderInput`
- must call `handleSubmit` from reduxForm to submit
    - `<form onSubmit={this.props.handleSubmit(this.onSubmit)}>`
    - automatically invoked with whatever arguments are in the inputs
    - automatically calls `event.preventDefault();`
- `validate`
    - function is called any time you interact with the form
    - hook up to reduxForm wrapper
    - automatically called with formValues object
    - must return object
        - valid = empty object
        - invalid -> return object with NAME of the field as key, error message as value
            - automatically matches names in error object to Field
            - passes error message to renderInput function for corresponding Field
                - `meta.error` property
                - conditional rendering with `meta.touched`

        
## Restful Conventions
Actions - Methods - Routes - Responses
List All Records - GET - /rootPath - Array of Records
Get one particular record - GET - /rootPath/:id - Single Record
Create record - POST - rootPath - Single Record
Update ALL properties of a record - PUT - /rootPath/:id - Single Record
Update SOME properties of a record - PATCH - /rootPath/:id - Single Record
Delete record - DELETE - /rootPath/:id - Nothing

Put/Patch have conflicting results with different API implementations, all vs some rule is sometimes ignored.

## Modals with React Portals
In React, all elements are nested inside the 'root' html element. The modal component is typically deeply nested. If it is nested within a div that has a relative styling position *and* a z-index with any defined value, this creates a *Stacking Context*. A bit of a gotcha, it can create problems/unexpected behavior with React modals, as the stacking context creates a new way of comparing sibling elements that have assigned z-index values; i.e. it compares the sibling component's z-index to the modal's *relatively positioned parent element's* z-index, rather than the z-index of the modal itself. You can't always change the parent's css in a complex app. The workaround provided by React Portals is to display the modal not as a direct child of the component, but instead as a child of some other element, e.g. the html body element. Common uses include modal windows, working with 3rd party libraries, or use react to render content in some 3rd party element, i.e. injecting a React component into some HTML that wasn't created by your react application; e.g. introducing react to a server-side rendered application, like a java, ruby on rails, or django app that renders HTML from the backend.

The return statement from a Portal element is a little different than normal, in that it doesn't return typical jsx but instead invokes the ReactDOM createPortal method, which takes 2 arguments: the ReactNode children elements (jsx to be displayed) and a reference to the element in which we want to render the portal. However, we can't just simply target the html body, as the portal will replace all the content in the body. Instead, create a placeholder element in the body hook onto, similarly to the '#root' element.

Users tend to expect a modal to close when the user clicks outside of the modal page. Inject a callback with the *onDismiss* prop on the modal and invoke it on the modal's root html element to trigger a redirect. However, clicking anywhere inside the modal will trigger that redirect via event propagation aka bubbling, so go vanilla and prevent event progagation in the child of the element that invokes the onDismiss callback to cancel the bubbles.

## Semantic UI
SemanticUI creates styling through a specific naming convention for html elements. 
Regarding modals (https://semantic-ui.com/modules/modal.html), it can be tricky when refactoring and styling a modal to be reusable. For example, if we have a delete and cancel button and we must extract the button logic from the modal into the invoking component and then inject the buttons into the modal as props, it won't style as expected if you follow convention and create a function that returns the buttons wrapped in a div. Due to how jsx is transpiled by babel, a function can only return one html element, and consequently creating that extra div layer could throw off the styling. Rather, use a React Fragment; basically an invisible element that has no effect on the DOM.

## Real Time Messaging (RTMP) Server
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

## Context React v16
Props system gets data from parent component to *direct* child component, whereas Context system gets data from a parent component to *any* nested child component.
Context Object (CO) acts as a data pipeline from parent to nested component.

Two ways to get data **in** CO
- set up *Default Value* when CO is created
    - can use any valid javascript as default value, e.g. object with key/value pair, or array of numbers
- inside the parent component, create a *Provider* component, which pushes data into CO
    - not the same as Redux Provider, just same name
    - wrap component that needs access with Context.Provider, assigning a *value prop*
        - each separate use of the Context.Provider creates a new, separate *pipe* of information
        - only the components that get wrapped by the Provider will have access to the Context it implements, via props.children
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

**pros n cons**
- redux
    - distributes data to various components
    - centralizes data in a store
    - provides mechanisms for changing data in store
    - great docs
    - established design patterns
    - tons of open source libs
- context
    - distributes data to various components
    - no need for extra libs
    - hard to build store components for multiple concerns
        - separate store components for each piece of state in the app
            - currently too complicated to share data between those stores


If we want to use Context instead of Redux, we need to be able to:
1. get data to any component in hierarchy (not an issue)
2. separate view logic from business logic
3. split up business logic
    - 2 and 3 are easy with redux, just sayin'

One way would be to create your own store component, contain all business logic in a single source of truth, implement a provider to share that data to children components, and pass a callback to so the child can edit that data

## Redux Promise
Action flows enters middleware => Does the action have a promise as a payload?
- yes 
    - stop action
    - after promise resolves, create new action (same type, payload of resolved promise) and send to reducer
- no
    - let it go through to reducer

## thunk
vanilla redux expects action creator us to return an action, plain js object, but redux-thunk enables another return type, a plain function; this inner function takes *dispatch* as its argument

### reselect
use case for derived state, where the data we care about is a product of 2 different reducers
last argument to createSelector is the function that has the selection logic, all others are slices of state

## animations
[ReactCSSTransitionGroup](https://github.com/reactjs/react-transition-group) is a component: import and render in component, passing it a list of items. Animates items as they are added and removed from the list, through class names
- render component and define css class `<transition-name>-enter` for intial styling, i.e. fade-enter
- after initial render, apply case `<transition-name>-enter-active` to apply a transition

        import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
        
        render() {
            const transitionOptions = {
                transitionName: "fade",
                transitionEnterTimeout: 500,
                transitionLeaveTimout: 500
            };

            return (
                <ul className="list-group">
                    <ReactCSSTransitionGroup {...transitionOptions}>
                        {this.renderStuff()}
                    </ReactCSSTransitionGroup>
                <ul>
            )
        }

- apply some css 

        .fade-enter { 
            transform: rotateX(90deg) rotateZ(90deg); 
            opacity: 0;
        }
        .fade-enter-active { 
            transform: rotateX(0deg) rotateZ(0deg)
            opacity: 1.0;
            transition: .5 ease-in all;
        }
        .fade-leave { opacity: 1.0 }
        .fade-leave-active { 
            opacity: 0;
            transition: .5 ease-out all;
        }


## [_Lodash](https://lodash.com/)
Going to the developer console at lodash site allows the loading of the lodash library. Here's some potentially useful helper methods
- [`_.mapKeys(object, 'string')`](https://lodash.com/docs/4.17.15#mapKeys) - looks in each object for a property matching the string, returns new object with each match as the key and the object as the value. Good for object-based reducers
    - list of posts with id's can be coerced into an object that can be indexed by the key
    
        `payload = { {id: 1, post}, {id: 2, post2 }, etc }`  
        `payload = { 1: { id: 1, post }, 2: { id:2 post }}`
- [`_.omit(object, [pathsToOmit])`](https://lodash.com/docs/4.17.15#omit)
    - basically the delete function in reducer
- `_.memoize` for overfetching api requests
- `_.uniq`
- `_.chain` 
    - chain on additional functions
        - won't execute steps until chaining on `.value()`

## errors
- Objects are not valid as a React child
    - can render arrays, strings and numbers as text, but not objects.. they must reference a property within the object