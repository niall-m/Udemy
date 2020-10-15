# Testing with Jest
- Jest is an automated test-runner that [searches](https://jestjs.io/docs/en/configuration#testmatch-arraystring) for any `.js, .jsx, .ts, .tsx` files inside of `__tests__` folders, or any files that end in `.test` or `.spec`. 
- it's executed from the command line, yet React only works in the browser
    - JSDOM is used to simulate a browser in the terminal
        - gives us the `document` element to hook onto 
        - auto-installed with create-react-app

NB: Article comparing [Jest, Enzyme, Testing Library and Cypress](https://medium.com/javascript-in-plain-english/i-tested-a-react-app-with-jest-testing-library-and-cypress-here-are-the-differences-3192eae03850)

- What to test
    - look at each individual part of app
    - imagine telling a friend 'here is what this piece of code does'
    - write a test to verify each part does what you expect
        - organize with `__tests__` directory
    - tests should be modular: directly test only the corresponding file

[**Enzyme**](https://enzymejs.github.io/enzyme/) is an open-source testing library from AirBnb. It helps us bypass the need to manually render react nodes and manage node cleanup with ReactDOM. Minor setup required, enzyme-adapter-react-versionNumber. When Jest starts up, it looks for `setupTests.js` file. If found, setupTests.js is automatically executed before any other code in the project gets loaded

- gives us three additional rendering capabilities to write tests, 
    - **Static** renderer
        - render the given component and return plain HTML
    - [**Shallow**](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/find.html) renderer
        - render *just* the given component and none of its children components
    - **Full DOM** renderer
        - render the component and all of its children and lets us modify it afterwards
        - simulate click events, etc
- expectations
    - [find](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/find.html)