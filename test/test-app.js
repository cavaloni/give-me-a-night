import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';

const should = chai.should();

import App from '../js/components/app';

describe('App component', function () {  
    it('should display the app', function () { 
        const testtext = "Hello World"
        
        const renderer = TestUtils.createRenderer();
        renderer.render(<App />);
        const result = renderer.getRenderOutput();

        result.props.children.should.equal(testtext);
    })
})