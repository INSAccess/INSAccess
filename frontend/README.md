# INSAccess Frontend Documentation

## How to

### React components

In this webapp, we chose to not use the class definition of React components, but rather the constant function expression. Components are therefore declared as folows :
```jsx
const Example = ({param1, param2}) => {
    return (
        <>
            <div>This is an example</div>
            <a>Click here</a>
            <p>The params are {param1} and {param2}</p>
        </>
    )
} 
```
The use of `<></>` allows for multiple html tags in succession without having to create a parent container.

You can either chose to separate each parameter and access them directly, or you can chose to bundle the props of the components like this : 
```jsx
const Example = (props) => {
    return <></>
}
```
and access them with `props.param1`.

### Import/export

After having created your component, you can either export it as default, or export multiple constants and components in an object. \
In the first case, you use 
```jsx
import Example from '../Example.jsx'
```
In the second you use
```jsx
import { Example, randomConst } from '../Example.jsx'
```

## Important !

This doc won't teach you React, it is only here in order to allow you to read efficiently the syntax of the app. If you wish to dive deeper in this hell, I advise you to learn about the different React hook. The main hooks used here are `useContext`, `useState` and `useEffect`.

## License

This webapp is licensed under the following 

INSAccess © 2025 by Raphaël Senellart and Jules Galhardo is licensed under CC BY-NC-SA 4.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/
