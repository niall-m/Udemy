# Testing 
[**Jest**](https://jestjs.io/) is an automated test-runner that [searches](https://jestjs.io/docs/en/configuration#testmatch-arraystring) for any `.js, .jsx, .ts, .tsx` files inside of `__tests__` folders, or any files that end in `.test` or `.spec`. It's executed from the command line, yet React only works in the browser. JSDOM, which is auto-installed with create-react-app, is used to simulate a browser in the terminal. This gives gives us the `document` element to hook onto.

[**Enzyme**](https://enzymejs.github.io/enzyme/) is an open-source testing library from AirBnb. It helps us bypass the need to manually render react nodes and manage node cleanup with ReactDOM. Minor setup required, enzyme-adapter-react-versionNumber. When Jest starts up, it looks for `setupTests.js` file. If found, setupTests.js is automatically executed before any other code in the project gets loaded

- enzyme gives us three additional rendering capabilities to write tests, 
    - **Static** renderer
        - render the given component and return plain HTML
    - [**Shallow**](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/find.html) renderer
        - render *just* the given component and none of its children components
            - child components are represented with placeholders
    - **Full DOM** renderer
        - render the component and all of its children and lets us modify it afterwards with `mount()`
        - simulate click and change events, etc
        - unlike shallow or static rendering, full rendering actually mounts the component in the DOM, which means that tests can affect each other if they are all using the same DOM. Keep that in mind while writing your tests and, if necessary, use `.unmount()` or something similar as cleanup
            - sharing the same fake DOM implemented by JSDOM

### What to test
- look at each individual part of app
- imagine telling a friend 'here is what this piece of code does'
- write a test to verify each part does what you expect

### Some Functions
- [find](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/find.html) to find component instances or normal HTML elements
- [simulate](https://enzymejs.github.io/enzyme/docs/api/ReactWrapper/simulate.html): 1st arg is event to override, 2nd arg is mock event object
- [prop](https://enzymejs.github.io/enzyme/docs/api/ReactWrapper/prop.html) to target component's this.props
- [text](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/text.html) or [render](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/render.html) to extract html out of an element

### best practices and common errors
- always try to break your tests
- extract common code setup and breakdown with `beforeEach` and `afterEach`
    - initialize variable outside of beforeEach, to give scope access to describe/it blocks
- organize with `__tests__` directory
- tests should be modular
    - directly test only the corresponding file; a given test file should not try to make assertions against the inner workings of other components
- simulating events
    - find the element
    - simulate a change event
    - provide a fake mock event object
    - force the component to `.update()`
        - calling setState in component triggers *asynchronous* rerender; queues request for update, which can cause race conditions within test
    - assert that the element's value has changed
- Redux 
    - connect: connected component expects a parent wrapped in a Provider, so directly importing a component would cause it to lose access to Redux store
    - to give access to store in test file, extract Provider into a Root component that wraps props.children
        - however, this approach doesn't allow us to modify data in the store - without component dispatching actions
    - to get data into store in test file, pass in an additional argument to Root with a preloaded initial state
        - destructure and assign initialState with default value to make Root compatible with app and tests
            - `({ children, initialState = {} }) =>`
- testing **Reducers** is straight-forward
    - call the reducer
    - pass in fake action
    - assert against the return value
- testing **action creators**
    - call action creator
    - get the action back
    - write an expectation about the action
- testing **network calls** with integration tests
    - we dont have the ability to make ajax requests from within our test suite when using JSDOM
        - use [**moxios**](https://github.com/axios/moxios) for mocking out api calls with axios
    - even though moxios hijacks the api call and returns a fake response, thus making an async call synchronous, it's still not instant
        - creates race conditions as test thread will instantly check assertion aftering invoking method (mock api call), i.e. moxios response enters the queue behind the assertion check
        - you could create a pause with `setTimeout()`, but whenever jest executes a test (function), it runs code and checks if any error was thrown or any expectation failed *without any consideration for delayed events*
            - jest can be configured to wait with the `done` argument passed to the `it` block callback, then invoking it in the setTimeout
                - dont forget to update() redux 
                    - or just use moxios `wait()` function instead, as it does all the *done/setTimeout* for you

Example: 

    it('can wait until it is', (done) => {
        const wrapped = mount(<Component />);  
        wrapped.find('.buttonForAsyncActionCreator').simulate('click');
        setTimeout(() => {
            wrapped.update();
            expect(wrapped.find('li').length).toEqual(3);
            done();
        }, 100);
    });

### misc
- [absolute imports](https://create-react-app.dev/docs/importing-a-component/#absolute-imports)
    - webpack/node based projects require relative paths for imports
    - CreateReactApp changed support for `.env` file, use `jsconfig.json`
    - allows for easier global find/replace of imports
- comparing [Jest, Enzyme, Testing Library and Cypress](https://medium.com/javascript-in-plain-english/i-tested-a-react-app-with-jest-testing-library-and-cypress-here-are-the-differences-3192eae03850)
- *unit tests* affects a single piece of code functionality
- *integration test* touch many parts within a single test
    - by testing that clicking a button shows a list of elements, we asserting that there's a box with a button, that its wired up to an action creator, that the action creator can make an ajax request, that redux can parse the response tied to that action through the middleware, that the reducer catches it correctly, and that the list of elements shows up in the component
    - not tied to any particular part of any subdirectory, so group files together in directory in src/__ tests __
    - more value from integration than unit tests
- [tdd article best practices from IBM](https://developer.ibm.com/devpractices/software-development/articles/5-steps-of-test-driven-development/)
- [Unit test basics per Microsoft](https://docs.microsoft.com/en-us/visualstudio/test/unit-test-basics?view=vs-2019)
    - AAA
        - Arrange: initialize objects and set the value of the data that is passed to the method under test
        - Act: invoke the method under test with the arranged parameters
        - Assert: verify that the action of the method under test behaves as expected
- file naming convention: lower case will export default a function, upper case will export default a class

# Higher Order Components (HOC)
- A React component made to help us reuse code
- Component + HOC = *'enhanced'* or *'composed'* component
    - e.g. `connect` function from react-redux, or restricting access to certain components with an auth HOC (src/components/requireAuth.js)
- Steps
    - write the logic you want to reuse into a component
    - create a HOC file and add the HOC scaffold
    - move the reusable logic into the HOC
    - pass props/config/behavior through to child component
        - multiple parents are passing props (history object from react-router, action creator from redux connect, etc) that will end up in custom HOC

# Middlewares
- React-Redux Cycle Recap
    - React => *component calls action creator*
    - Action Creator => *function that returns an action object*
    - Action => *object with type and payload property, dispatched/forwarded to middleware*
    - **Middleware** => *processes then forwards action to reducer*
        - functions that give ability to **log, modify or stop actions** en route to reducer
    - Reducers => *produce new state*
    - State => *sent to React component and triggers rerender*
    - rinse and repeat
- Middleware Stack; chaining together multiple middlewares in a linked list
    - action is passed through each middleware in the chain
        - if processed, middleware returns a new action
            - new action gets *dispatched* from the beginning of the chain
- series of functions (3 deep) that return each other
    - 1st outer func is called with dispatch and getState as arguments
    - 2nd func is called with the `next` argument, for forwarding 
        - a reference to the *next middleware* on the chain
    - 3rd func called with action object from action creator as argument

Steps to recreate reduxPromise
- check to see if action has a promise on its 'payload' property
    - if it does
        - wait for it to resolve
        - create new action with resolved data
        - dispatch it
    - if it does not, send action to next middleware

- [JSON Schema document creator](https://jsonschema.net/)
- [tv4](https://github.com/geraintluff/tv4) tiny validator 4 takes json and a schema, compares the two for validation
- [JSON Schema package](https://github.com/json-schema-org/json-schema-spec/) for validating documents

# Server Setup Authentication
React is server agnostic, only cares about receiving JSON. Basic cycle: server checks client credentials and sends back auth cookie/token hall-pass to be included in all future requests
- Cookies introduce the concept of state to HTTP 
    - automatically included on all requests
    - unique to each domain, cannot be sent to different domains
- Tokens
    - have to wire up manually to Headers
    - can be sent to any domain
    - useful for distributed system hosted on several servers, on several domains

Best practices
- scalability
    - setup content server for index.html + bundle.js static files
    - setup separate API server for all authenticated data flows
        - allows load distributing for api calls, decouples api calls from react app
- keep route handlers outside main index.js file
    - to add route handlers to express, use REST methods: `.get()`, `.post`, etc
        - `app.get('/route', function(request, response, next) { ...blah });`

express: parse response + routing
- [MongoDB](https://docs.mongodb.com/guides/)
    - ([install with brew](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/index.html)), help installing [here](https://tinmankinetics.com/how-to-install-mongo-in-macos-linux-with-homebrew/)
    - [shell stuff](https://docs.mongodb.com/manual/reference/program/mongo/) with `mongo` interactive shell
    - mongoose: an [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) that works with MongoDB
    - create models with custom validation properties, e.g. email/password/etc
        - define model with `new Schema({ email: String })`
        - create model class (used to create instances of model, e.g. new users)
            - `mongoose.model('classname', schema);`
        - export model
- middleware
    - morgan is a logging incoming request, used for debugging
    - bodyParser parses any incoming requests into JSON
    - nodemon for hot reloading, watches project directory for any file changes, restarts server with updates, wired up in package.json 
- auth packages: passport, bcrypt

Holding off until course is updated for mongodb 