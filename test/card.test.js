import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import { mount, shallow } from 'enzyme';

const should = chai.should();

import  {Card} from '../js/components/card/card';

describe('card component', function () {  
    it('should display the card', function () { 
        
        const testObj = {
            testImage: 'http://lorempixel.com/400/200/',
            testTitle: 'test event'
        };

        const renderer = TestUtils.createRenderer();
        renderer.render(<Card 
            resultsBoxNum='1'
            evtType='zomatoResults'
            evtName={testObj.testTitle}
            evtImg={testObj.testImage}
            title="test type"
            key="1"
            cardNum="1"
            flippy={false}
        />);
        const result = renderer.getRenderOutput();
        expect(result.props.children.props.children[0].props.children[0].props.children).toBe('test type');
        expect(result.props.children.props.children[0].props.children[1].props.children.props.src).toBe(testObj.testImage);
        console.log(result.props.children.props.children[0].props.children[2].props);

    });
});