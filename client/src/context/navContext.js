import React, { useState, createContext } from 'react';

// reducer
const navReducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_SEARCH":
            return { searchField: action.payload };
        default:
            return state;
    }
};

// state
const initialState = {
    searchField: ""
};

// create context
const NavContext = createContext();

// context provider
const NavProvider = ({ children }) => {
    const [search, setSearch] = useState(initialState);

    return (
        <NavContext.Provider value={{search, setSearch}}>{children}</NavContext.Provider>
    );
};

export { NavProvider, NavContext };