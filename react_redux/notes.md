# Random Notes and Thoughts On React v16 & Redux

#### Navigation with React Router

React Router has three router types: BrowserRouter, HashRouter, MemoryRouter
use HashRouter with Github pages, expects request to defined resource

*When to navigate users*  
*Intentional nav* where a user clinks on a link vs *Programmatic Nav* where we run code to force redirection, like after clicking a button to submit a form. It's bad form to redirect without doing an error/success status check on API requests.

In order to redirect, we make use of the *history* object, which is created by the BrowserRouter. It keeps track of and can change the address in the url bar. This object is injected as a prop into each Route component within the BrowserRouter. 
A downside to the BrowserRouter is that this makes it hard to do programmatic navigation outside of the BrowserRouter's child Route components, i.e. in an action creator. To work around this, we could pass the history object as argument into the action creator any time a component calls that action creator, but that's not ideal as it creates extra code. Alternatively, we can recreate the history object with *createBrowserHistory*, use a plain Router in the App, then import the new history object into the action creator file.

To navigate to some crud based component with a specific object id, so as to edit or delete the correct record, we can either use a Selection Reducer to record what item in the list is being operated on, or preferably a URL-based selection (available with react-router-dom), where you put the ID of the item in the URL. The convention is basically RESTful routes, simply add an ':id' to the Route, i.e. /streams/edit/*:id*. This :variable is automatically added as a prop to the history object (history.match.params.variableName), which is automatically injected into each component of each Route. We then compare the component props to the list of items inside the redux state store and match the ids. To access the props within the component, use ownProps within the mapStateToProps function.

With React-Router, each component needs to be designed to work in isolation, i.e. fetch its own data.

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