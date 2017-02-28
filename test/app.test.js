// jest.autoMockOff()

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';

const should = chai.should();

import  {App} from '../js/components/app/app';

describe('App component', function () {  
    it('should display the app', function () { 
        
        const renderer = TestUtils.createRenderer();
        renderer.render(<App />);
        const result = renderer.getRenderOutput();
        expect(result.props.children).toHaveLength(6);
    });
});