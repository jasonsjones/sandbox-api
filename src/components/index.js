import React from 'react';
import ReactDOM from 'react-dom';

const App = (props) => {
    return (
        <div>
            <h1>Hello from React</h1>
            <h2>{props.message}</h2>
        </div>
    );
}
ReactDOM.render(
    <App message="here are the props..."/>,
    document.getElementById('root')
);
