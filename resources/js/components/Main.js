import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../storage/store';
import Site from './Site';



class Main extends Component {
    render() {
        return (
            <Provider store={store}>
                <Site></Site>
            </Provider>
        );
    }
}

export default Main;


if (document.getElementById('main')) {
    ReactDOM.render(<Main />, document.getElementById('main'));
}
