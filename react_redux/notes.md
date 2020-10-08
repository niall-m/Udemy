# Random Notes and Thoughts On React v16 & Redux

#### Navigation with React Router

React Router has three router types: BrowserRouter, HashRouter, MemoryRouter
use HashRouter with Github pages, expects request to defined resource

*When to navigate users*  
*Intentional nav* where a user clinks on a link vs *Programmatic Nav* where we run code to force redirection, like after clicking a button to submit a form. It's bad form to redirect without doing an error/success status check on API requests.

In order to redirect, we make use of the *history* object, which is created by the BrowserRouter. It keeps track of and can change the address in the url bar. This object is injected as a prop into each Route component within the BrowserRouter. 
A downside to the BrowserRouter is that this makes it hard to do programmatic navigation outside of the BrowserRouter's child Route components, i.e. in an action creator. To work around this, we could pass the history object as argument into the action creator any time a component calls that action creator, but that's not ideal as it creates extra code. Alternatively, we can recreate the history object with *createBrowserHistory*, use a plain Router in the App, then import the new history object into the action creator file.

To navigate to some crud based component with a specific object id, so as to edit or delete the correct record, we can either use a Selection Reducer to record what item in the list is being operated on, or preferably a URL-based selection (available with react-router-dom), where you put the ID of the item in the URL. The convention is basically RESTful routes, simply add an ':id' to the Route, *i.e. /streams/edit/:id*. This :id is added as a prop to the params value (history.match.params.id). We then compare the props to the list of items inside the redux state store and match the ids. To access the props within the component, use ownProps within the mapStateToProps function.

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
