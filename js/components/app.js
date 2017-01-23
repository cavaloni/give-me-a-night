import React from 'react';
import SearchArea from './search-area';
import ResultBox from './results';

export default function App() {
    return (
        <div className="app">
            <div className="banner"/>
            <SearchArea/>
            <ResultBox/>
        </div>
    )
}
